import BookingMaster from "../models/BookingMaster.js";
import UserBooking from "../models/UserBooking.js";
import ProviderBooking from "../models/ProviderBooking.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import dayjs from "dayjs";


export async function createBooking(req, res) {
  try {
    const { providerId, serviceTitle, scheduledAt, durationHours = 1, address, notes, category, price } = req.body;

    if (!providerId || !serviceTitle || !scheduledAt || !address) {
      return res.status(400).json({ error: "providerId, serviceTitle, scheduledAt and address are required" });
    }

    const provider = await User.findById(providerId);
    if (!provider || provider.role !== "provider") {
      return res.status(404).json({ error: "Provider not found" });
    }

    const start = new Date(scheduledAt);
    if (isNaN(start.getTime())) return res.status(400).json({ error: "Invalid scheduledAt" });

    const dur = Number(durationHours) || 1;
    const end = new Date(start.getTime() + dur * 60 * 60 * 1000);

    const overlapping = await BookingMaster.findOne({
      provider: providerId,
      status: { $in: ["pending", "accepted", "in_progress"] },
      scheduledAt: { $lt: end },
      $expr: {
        $gte: [
          { $add: ["$scheduledAt", { $multiply: ["$durationHours", 3600000] }] },
          start
        ]
      }
    });

    if (overlapping) {
      return res.status(409).json({ error: "Provider not available at selected time" });
    }

    const master = new BookingMaster({
      user: req.user._id,
      provider: providerId,
      serviceTitle,
      category: category || (provider.categories && provider.categories[0]) || "",
      scheduledAt: start,
      durationHours: dur,
      address,
      notes,
      price
    });

    await master.save();

    await UserBooking.create({ user: req.user._id, booking: master._id });
    await ProviderBooking.create({ provider: providerId, booking: master._id });

    await master.populate([{ path: "provider", select: "name email avatar phone categories" }, { path: "user", select: "name email" }]);

    return res.status(201).json({ data: master });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getMyBookings(req, res) {
  try {
    const {
      page = 1,
      perPage = 10,
      status,
      q
    } = req.query;

    const skip = (page - 1) * perPage;

    const userBookings = await UserBooking.find({ user: req.user._id })
      .populate({
        path: "booking",
        populate: { path: "provider user", select: "name email avatar phone" }
      });

    let bookings = userBookings
      .map(u => u.booking)
      .filter(Boolean);

    if (q) {
      const qLower = q.toLowerCase();
      bookings = bookings.filter(b =>
        (b.serviceTitle || "").toLowerCase().includes(qLower) ||
        (b.provider?.name || "").toLowerCase().includes(qLower)
      );
    }

    if (status && status !== "all") {
      if (status === "upcoming") {
        bookings = bookings.filter(b =>
          dayjs(b.scheduledAt).isAfter(dayjs()) &&
          ["pending", "accepted"].includes(b.status)
        );
      } else {
        bookings = bookings.filter(b => b.status === status);
      }
    }

    if (status === "upcoming") {
      bookings.sort((a, z) =>
        dayjs(a.scheduledAt).isAfter(dayjs(z.scheduledAt)) ? 1 : -1
      );
    } else {
      bookings.sort((a, z) =>
        dayjs(z.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
      );
    }

    const total = bookings.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));

    const paginated = bookings.slice(skip, skip + Number(perPage));

    return res.json({
      data: paginated,
      meta: {
        page: Number(page),
        perPage: Number(perPage),
        total,
        totalPages
      }
    });
  } catch (err) {
    console.error("getMyBookings:", err);
    return res.status(500).json({ error: "Server error" });
  }
}


export async function getProviderBookings(req, res) {
  try {
    if (req.user.role !== "provider") return res.status(403).json({ error: "Not a provider" });

    const pBookings = await ProviderBooking.find({ provider: req.user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "booking",
        populate: { path: "user provider", select: "name email avatar phone" }
      });

    const data = pBookings
      .map(pb => pb.booking)
      .filter(Boolean);

    return res.json({ data });
  } catch (err) {
    console.error("getProviderBookings:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getBookingById(req, res) {
  try {
    const { bookingId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const master = await BookingMaster.findById(bookingId).populate("user provider", "name email avatar");
    if (!master) return res.status(404).json({ error: "Not found" });

    const isAdmin = req.user?.role === "admin";
    const isUser = String(master.user._id) === String(req.user._id);
    const isProvider = String(master.provider._id) === String(req.user._id);

    if (isAdmin || isUser || isProvider) {
      return res.json({ data: master });
    }

    const ub = await UserBooking.findOne({ user: req.user._id, booking: master._id });
    if (ub) return res.json({ data: master });

    const pb = await ProviderBooking.findOne({ provider: req.user._id, booking: master._id });
    if (pb) return res.json({ data: master });

    return res.status(403).json({ error: "Not authorized" });
  } catch (err) {
    console.error("getBookingById:", err);
    return res.status(500).json({ error: "Server error" });
  }
}


export async function updateBookingStatus(req, res) {
  try {
    const { bookingId } = req.params;
    const { status, price } = req.body;

    const allowed = ["accepted", "rejected", "in_progress", "completed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const booking = await BookingMaster.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const isProvider = req.user.role === "provider" && String(booking.provider) === String(req.user._id);
    const isCustomer = String(booking.user) === String(req.user._id);

    if (!isProvider && status !== "cancelled") {
      return res.status(403).json({ error: "You can only cancel your booking" });
    }

    if (isProvider) {
      if (status === "completed") {
        if (price === undefined || price === null) {
          return res.status(400).json({ error: "Price is required when completing a booking" });
        }
        const parsed = Number(price);
        if (Number.isNaN(parsed) || parsed < 0) {
          return res.status(400).json({ error: "Invalid price value" });
        }
        booking.price = parsed;
        booking.paid = true;
      }

      booking.status = status;
      await booking.save();

      // populate for response
      await booking.populate("user provider", "name email avatar");

      // (optional) notify sockets: emit booking updated using the master doc
      return res.json({ data: booking });
    }

    if (isCustomer && status === "cancelled") {
      booking.status = "cancelled";
      await booking.save();
      await booking.populate("user provider", "name email avatar");
      return res.json({ data: booking });
    }

    return res.status(403).json({ error: "Not authorized to update status" });
  } catch (err) {
    console.error("updateBookingStatus error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function deleteUserBooking(req, res) {
  try {
    const { masterId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(masterId)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const removed = await UserBooking.findOneAndDelete({ user: req.user._id, booking: masterId });
    if (!removed) return res.status(404).json({ error: "Booking not found in user view" });

    return res.json({ message: "Removed from your bookings" });
  } catch (err) {
    console.error("deleteUserBooking:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function deleteProviderBooking(req, res) {
  try {
    const { masterId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(masterId)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    if (req.user.role !== "provider") return res.status(403).json({ error: "Not a provider" });

    const removed = await ProviderBooking.findOneAndDelete({ provider: req.user._id, booking: masterId });
    if (!removed) return res.status(404).json({ error: "Booking not found in provider view" });

    return res.json({ message: "Removed from provider bookings" });
  } catch (err) {
    console.error("deleteProviderBooking:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

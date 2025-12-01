import Booking from "../models/Booking.js";
import User from "../models/User.js";
import mongoose from "mongoose";


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

    const overlapping = await Booking.findOne({
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

    const b = new Booking({
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

    await b.save();
    await b.populate([{ path: "provider", select: "name email avatar phone categories" }, { path: "user", select: "name email" }]);

    return res.status(201).json({ data: b });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getMyBookings(req, res) {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("provider", "name email avatar categories rating")
      .sort({ scheduledAt: -1 });

    return res.json({ data: bookings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getProviderBookings(req, res) {
  try {
    if (req.user.role !== "provider") return res.status(403).json({ error: "Not a provider" });

    const bookings = await Booking.find({ provider: req.user._id })
      .populate("user", "name email avatar")
      .sort({ scheduledAt: -1 });

    return res.json({ data: bookings });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}

export async function getBookingById(req, res) {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate("provider user");
    if (!booking) return res.status(404).json({ error: "Not found" });

    const isUser = String(booking.user._id) === String(req.user._id);
    const isProvider = String(booking.provider._id) === String(req.user._id);
    if (!isUser && !isProvider && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    return res.json({ data: booking });
  } catch (err) {
    console.error(err);
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
  
      const booking = await Booking.findById(bookingId);
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
  
        await booking.populate("user provider", "name email avatar");
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
  

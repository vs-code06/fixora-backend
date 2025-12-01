import mongoose from "mongoose";
import User from "../models/User.js";
import { cookieOptions } from "../utils/token.js"; 

export const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password").lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user });
  } catch (err) {
    next(err);
  }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const allowedScalars = ["avatar", "phone", "bio"];
    const allowCategoriesKey = "categories";

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    for (const k of allowedScalars) {
      if (req.body[k] !== undefined) {
        user[k] = req.body[k];
      }
    }

    if (req.body.location && typeof req.body.location === "object") {
      user.location = {
        ...(user.location || {}),
        ...req.body.location,
      };
    }

    if (req.body[allowCategoriesKey] !== undefined) {
      if (user.role !== "provider") {
        return res.status(403).json({ message: "Only providers can update categories" });
      }

      let cats = req.body.categories;
      if (Array.isArray(cats)) {
        cats = cats.map((c) => String(c || "").trim()).filter(Boolean);
      } else if (typeof cats === "string") {
        cats = cats
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean);
      } else {
        return res.status(400).json({ message: "Invalid categories format (array or CSV expected)" });
      }

      user.categories = cats;
    }

    await user.save();

    const hasPhone = !!(user.phone && String(user.phone).trim());
    const hasCity = !!(user.location && user.location.city && user.location.city.trim());
    if (hasPhone && hasCity && !user.profileCompleted) {
      user.profileCompleted = true;
      await user.save();
    }

    const updated = await User.findById(user._id).select("-password").lean();
    return res.json({ user: updated });
  } catch (err) {
    next(err);
  }
};

export const requestProvider = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "provider") {
      return res.status(400).json({ message: "Already a provider" });
    }

    user.role = "provider";
    user.isProviderVerified = false;
    await user.save();

    return res.json({ message: "Role changed to provider. Verification pending.", user: { id: user._id, role: user.role } });
  } catch (err) {
    next(err);
  }
};

export const deleteMyProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id" });
    }


    const deleted = await User.findByIdAndDelete(userId);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    const opts = cookieOptions();
    delete opts.maxAge; 
    res.clearCookie("token", opts);

    return res.json({ message: "Account deleted" });
  } catch (err) {
    next(err);
  }
};

export const addFavorite = async (req, res, next) => {
  try {
    const providerId = req.params.providerId;
    if (!mongoose.Types.ObjectId.isValid(providerId)) {
      return res.status(400).json({ message: "Invalid provider id" });
    }

    const provider = await User.findById(providerId);
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    // prevent users favoriting themselves
    if (String(req.user._id) === String(providerId)) {
      return res.status(400).json({ message: "Cannot favorite yourself" });
    }

    const user = await User.findById(req.user._id);
    user.favorites = user.favorites || [];

    const exists = user.favorites.some((f) => String(f) === String(providerId));
    if (exists) {
      return res.status(200).json({ message: "Already favorited" });
    }

    user.favorites.push(new mongoose.Types.ObjectId(providerId));
    await user.save();

    return res.status(201).json({ message: "Added to favorites" });
  } catch (err) {
    next(err);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const providerId = req.params.providerId;
    if (!mongoose.Types.ObjectId.isValid(providerId)) {
      return res.status(400).json({ message: "Invalid provider id" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.favorites = (user.favorites || []).filter((f) => String(f) !== String(providerId));
    await user.save();

    return res.json({ message: "Removed from favorites" });
  } catch (err) {
    next(err);
  }
};

// List favorites (populate minimal provider info)
export const listFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "favorites",
      select: "name avatar categories rating location createdAt", // adjust fields you want to expose
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    // user.favorites will be an array of user docs (providers)
    return res.json({ favorites: user.favorites || [] });
  } catch (err) {
    next(err);
  }
};

// Check if a provider is favorited by the current user
export const checkFavorite = async (req, res, next) => {
  try {
    const providerId = req.params.providerId;
    if (!mongoose.Types.ObjectId.isValid(providerId)) {
      return res.json({ favorited: false });
    }
    const user = await User.findById(req.user._id);
    if (!user) return res.json({ favorited: false });
    const favorited = (user.favorites || []).some((f) => String(f) === String(providerId));
    return res.json({ favorited });
  } catch (err) {
    next(err);
  }
};

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true, minlength: 2, maxlength: 60 },
    email: { type: String, trim: true, unique: true, lowercase: true, required: true },
    password: { type: String, required: true, minlength: 6 },

    role: {
      type: String,
      enum: ["user", "provider", "admin"],
      default: "user",
    },

    avatar: { type: String },
    phone: { type: String },
    bio: { type: String },
    categories: { type: [String], index: true },
    location: {
      address: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },

    isProviderVerified: { type: Boolean, default: false },
    profileCompleted: { type: Boolean, default: false },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    rating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.index({ "location.city": 1, role: 1 });
userSchema.index({ name: "text", bio: "text", categories: "text" });


export default mongoose.model("User", userSchema);

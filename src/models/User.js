// models/User.js
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
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

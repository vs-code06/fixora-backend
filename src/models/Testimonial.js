import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    city: { type: String, trim: true, maxlength: 80 },
    message: { type: String, required: true, trim: true, maxlength: 600 },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);

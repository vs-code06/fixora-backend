import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    image: { type: String, required: true }, 
    icon: { type: String, required: true }  
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);

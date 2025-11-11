import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("Missing MONGO_URI in .env");

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    });
    
    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

export default connectDB;


// src/config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ MONGO_URI not set in env");
    throw new Error("Missing MONGO_URI");
  }

  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000, 
      socketTimeoutMS: 45000,
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    });

    console.log("✅ MongoDB Connected Successfully!");
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ Mongoose disconnected");
    });
    mongoose.connection.on("reconnected", () => {
      console.log("🔁 Mongoose reconnected");
    });
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

export default connectDB;


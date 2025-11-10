import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
        dbName: "FixoraDB"
    });      
    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

export default connectDB;


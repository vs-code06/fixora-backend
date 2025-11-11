import dotenv from "dotenv";
import mongoose from "mongoose";
import Testimonial from "../src/models/Testimonial.js";

dotenv.config();

const run = async () => {
  try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    });

    await Testimonial.deleteMany({});

    await Testimonial.insertMany([
      {
        name: "Christopher Doe",
        city: "New York",
        message:
          "I hired a handyman to fix my faucet and I was impressed with their professionalism and speed. Excellent job!",
        rating: 5,
        featured: true,
      },
      {
        name: "Emily Thompson",
        city: "New York",
        message:
          "The handyman I hired to repair my fence was efficient and friendly. My fence looks brand new.",
        rating: 5,
      },
      {
        name: "Ravi Mehta",
        city: "San Jose",
        message:
          "Quick diagnosis and neat work. The pricing was transparent and fair. Highly recommended.",
        rating: 5,
      },
      {
        name: "Ayesha Khan",
        city: "Seattle",
        message:
          "Booked AC service and the technician arrived on time. Great experience overall.",
        rating: 4,
      },
      {
        name: "Luis Perez",
        city: "Austin",
        message:
          "They fixed a persistent leak in my bathroom. Courteous and knowledgeable.",
        rating: 5,
      },
      {
        name: "Hannah Lee",
        city: "Chicago",
        message:
          "Fast response, professional communication, and spotless finish.",
        rating: 5,
      },
    ]);

    console.log("✅ Testimonials seeded.");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();

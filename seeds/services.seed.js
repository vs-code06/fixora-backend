import dotenv from "dotenv";
import mongoose from "mongoose";
import Service from "../src/models/Service.js";

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Service.deleteMany({});

    await Service.insertMany([
      {
        slug: "general-repairs",
        title: "General Repairs",
        desc: "Quick fixes for doors, hinges, small installs and household repairs.",
        image: "/assets/service-1.jpg",
        icon: "LuWrench"
      },
      {
        slug: "painting",
        title: "Painting and decorating",
        desc: "Interior & exterior painting: prep, primer, finish coats and touch-ups.",
        image: "/assets/service-2.jpg",
        icon: "LuPaintRoller"
      },
      {
        slug: "electrical",
        title: "Electrical repairs",
        desc: "Socket & switch replacement, appliance wiring, safety checks.",
        image: "/assets/service-3.jpg",
        icon: "LuZap"
      },
      {
        slug: "plumbing",
        title: "Plumbing repairs",
        desc: "Leak detection, pipe repairs, mixer & geyser installation.",
        image: "/assets/service-4.jpg",
        icon: "LuDroplet"
      },
      {
        slug: "carpentry",
        title: "Carpentry services",
        desc: "Door, shelf and cabinet installations, small woodwork projects.",
        image: "/assets/service-5.jpg",
        icon: "LuHammer"
      },
      {
        slug: "furniture",
        title: "Furniture assembly",
        desc: "Fast, careful furniture assembly from flat-pack deliveries.",
        image: "/assets/service-6.jpg",
        icon: "LuDrill"
      }
    ]);

    console.log("✅ Services seeded");
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
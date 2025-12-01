import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import readline from "readline";
import User from "../src/models/User.js";

dotenv.config();

const MONGO = process.env.MONGO_URI;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const providerCategories = [
  "Plumbing",
  "Cleaning",
  "Electrical",
  "AC Repair",
  "Painting",
  "Carpentry",
];

const providerNames = [
  "Rahul Sharma","Priya Singh","Amit Verma","Neha Kapoor","Vikram Patel","Siddharth Rao",
  "Anita Desai","Rohit Kumar","Sunil Mehta","Kavita Nair","Mayank Jain","Sonal Gupta",
  "Ramesh Yadav","Pooja Agarwal","Suresh Gupta","Divya Iyer","Karan Malhotra","Meera Joshi",
  "Ritika Sharma","Aditya Roy"
];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function connect() {
  await mongoose.connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to Mongo");
}

async function seed() {
  const answer = await new Promise((res) => rl.question("This will DELETE existing users. Continue? (y/n) ", res));
  if (!/^y(es)?$/i.test(answer)) {
    console.log("Aborted.");
    process.exit(0);
  }

  try {
    await connect();

    console.log("Dropping users collection...");
    await User.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash("password123", salt);

    const docs = [];

    // create providers
    for (let i = 0; i < providerNames.length; i++) {
      const name = providerNames[i];
      const email = `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`;
      const categories = [randomFrom(providerCategories)];
      // some providers offer 2 categories
      if (Math.random() > 0.6) categories.push(randomFrom(providerCategories));

      const doc = {
        name,
        email,
        password: hashed,
        role: "provider",
        avatar: `https://i.pravatar.cc/150?img=${10 + i}`,
        phone: `+91${randomInt(6000000000, 9999999999)}`,
        bio: `${randomFrom(["Experienced", "Certified", "Trusted", "Professional"])} ${categories[0]} specialist with ${randomInt(1,20)} years experience.`,
        location: {
          address: `${randomInt(1,200)} Main Rd`,
          city: randomFrom(["Delhi","Noida","Gurgaon","Lucknow","Kanpur","Mumbai","Bengaluru","Hyderabad","Jaipur","Varanasi"]),
          state: "State",
          country: "India",
          postalCode: `${randomInt(110000, 560000)}`,
        },
        isProviderVerified: Math.random() > 0.4,
        profileCompleted: true,
        rating: Number((3.8 + Math.random() * 1.3).toFixed(1)),
        reviewsCount: randomInt(3, 240),
        categories,               
        createdAt: new Date(Date.now() - randomInt(0, 1000) * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
      };

      docs.push(doc);
    }

    for (let i = 0; i < 30; i++) {
      const name = `Customer ${i + 1}`;
      docs.push({
        name,
        email: `customer${i + 1}@example.com`,
        password: hashed,
        role: "user",
        avatar: `https://i.pravatar.cc/150?img=${40 + i}`,
        phone: `+91${randomInt(6000000000, 9999999999)}`,
        bio: "",
        location: {
          city: randomFrom(["Delhi","Noida","Gurgaon","Lucknow","Kanpur","Mumbai"]),
          country: "India",
        },
        profileCompleted: Math.random() > 0.2,
        rating: 0,
        reviewsCount: 0,
      });
    }

    console.log("Inserting users:", docs.length);
    await User.insertMany(docs, { ordered: false });
    console.log("Seeding complete.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();

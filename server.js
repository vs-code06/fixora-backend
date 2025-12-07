import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import testimonialRoutes from "./src/routes/testimonialRoutes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import serviceRoutes from "./src/routes/serviceRoutes.js";
import contactRoutes from "./src/routes/contactRoutes.js";
import faqRoutes from "./src/routes/faqRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import providerRoutes from "./src/routes/providerRoutes.js";
import bookingRoutes from "./src/routes/bookingRoutes.js";
import adminRoutes from "./src/routes/admin.js";
const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

console.log(`Configuring CORS for origin: ${FRONTEND_URL}`);

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));


app.use(express.json());
app.use(cookieParser());

await connectDB();

app.use("/api", testimonialRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/auth", authRoutes);
app.get("/api/FAQ", contactRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

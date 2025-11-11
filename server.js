import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import testimonialRoutes from "./src/routes/testimonialRoutes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

dotenv.config();
const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(
  cors({
    origin: [FRONTEND_URL],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

await connectDB();

app.use("/api", testimonialRoutes);
app.use("/api/auth", authRoutes);
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

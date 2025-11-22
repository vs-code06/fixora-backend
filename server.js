import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import testimonialRoutes from "./src/routes/testimonialRoutes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import serviceRoutes from "./src/routes/serviceRoutes.js";

dotenv.config();
const app = express();

const PROD_ORIGIN = process.env.FRONTEND_URL; 
const DEV_ORIGIN = "http://localhost:3000";

const allowedOrigins = new Set([DEV_ORIGIN]);
if (PROD_ORIGIN) allowedOrigins.add(PROD_ORIGIN);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS policy: origin ${origin} not allowed`), false);
  },
  credentials: true, 
}));


app.use(express.json());
app.use(cookieParser());

await connectDB();

app.use("/api", testimonialRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/auth", authRoutes);
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

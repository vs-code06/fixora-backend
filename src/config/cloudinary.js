// src/config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

const cloud = process.env.CLOUDINARY_CLOUD;
const key = process.env.CLOUDINARY_KEY;
const secret = process.env.CLOUDINARY_SECRET;

if (!cloud || !key || !secret) {
  console.error("[cloudinary] Missing credentials:");
  console.error("  CLOUDINARY_CLOUD:", cloud ? cloud : "<missing>");
  console.error("  CLOUDINARY_KEY present?:", !!key);
  console.error("  CLOUDINARY_SECRET present?:", !!secret);
}

cloudinary.config({
  cloud_name: cloud,
  api_key: key,
  api_secret: secret,
});

export default cloudinary;

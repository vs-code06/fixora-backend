import Service from "../models/Service.js";

export async function getAllServices(req, res) {
  try {
    const services = await Service.find({});
    return res.json(services);
  } catch (err) {
    console.error("getAllServices error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

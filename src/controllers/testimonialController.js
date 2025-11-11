import Testimonial from "../models/Testimonial.js";

export const listTestimonials = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "12", 10), 50);
    const docs = await Testimonial
      .find({})
      .sort({ featured: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    res.json({ testimonials: docs });
  } catch (err) {
    next(err);
  }
};

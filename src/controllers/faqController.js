import Faq from "../models/Faq.js";

export const getFaqs = async (req, res) => {
  const faqs = await Faq.find({ active: true }).sort({ order: 1 });

  res.json({
    success: true,
    data: faqs,
  });
};

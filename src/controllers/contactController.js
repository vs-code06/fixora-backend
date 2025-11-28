import Contact from "../models/Contact.js";

export const createContact = async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body || {};

  if (!firstName || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "firstName, email and message are required",
    });
  }

  const newContact = await Contact.create({
    firstName,
    lastName,
    email,
    phone,
    message,
  });

  res.status(201).json({
    success: true,
    data: newContact,
  });
};

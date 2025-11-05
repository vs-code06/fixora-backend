import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

const setAuthCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: "/",
  });
};

export const signup = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password)
        return res.status(400).json({ message: "All fields required" });
  
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email))
        return res.status(400).json({ message: "Invalid email format" });
  
      const exists = await User.findOne({ email });
      if (exists)
        return res.status(409).json({ message: "Email already in use" });
  
      const user = await User.create({ name, email, password });
  
      const token = signToken(user._id);
      setAuthCookie(res, token);
  
      res.status(201).json({
        user: { id: user._id, name: user.name, email: user.email }
      });
    } catch (err) {
      res.status(500).json({ message: "Signup failed", error: err.message });
    }
  };
  

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user._id);
    setAuthCookie(res, token);

    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

export const me = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "Unauthenticated" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(payload.id).select("name email");
    
    res.json({ user });
  } catch {
    res.status(401).json({ message: "Unauthenticated" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", { path: "/", domain: process.env.COOKIE_DOMAIN || undefined });
  res.json({ message: "Logged out" });
};

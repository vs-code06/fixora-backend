import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken, setAuthCookie, cookieOptions } from "../utils/token.js";

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const userRole = ["user", "provider"].includes(role) ? role : "user";

  const user = await User.create({ name, email, password: hashed, role: userRole });

  const token = signToken(user);
  setAuthCookie(res, token);

  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken(user);
  setAuthCookie(res, token);

  res.json({ user: { id: user._id, name: user.name, email: user.email } });
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};


export const guestLogin = async (req, res) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
  const email = `guest_${uniqueSuffix}@fixora.com`;
  const password = uniqueSuffix;
  const name = "Guest User";

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const user = await User.create({ name, email, password: hashed, role: "user" });

  const token = signToken(user);
  setAuthCookie(res, token);

  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
};

export const logout = (req, res) => {
  const opts = cookieOptions();
  delete opts.maxAge;
  res.clearCookie("token", opts);
  res.json({ message: "Logged out" });
};

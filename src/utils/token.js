import jwt from "jsonwebtoken";

export const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role },process.env.JWT_SECRET,{ expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

export const cookieOptions = () => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    domain: process.env.COOKIE_DOMAIN || undefined,
    path: "/",
  };
};

export const setAuthCookie = (res, token) => {
  res.cookie("token", token, cookieOptions());
};

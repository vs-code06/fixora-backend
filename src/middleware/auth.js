import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token){
            return res.status(401).json({ message: "Unauthenticated" });
        } 

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(payload.id).select("name email role profileCompleted avatar").lean();

        if (!user){
            return res.status(401).json({ message: "Unauthenticated" });
        } 

        req.user = user;
        next();
    } 
    catch {
        return res.status(401).json({ message: "Unauthenticated" });
    }
};

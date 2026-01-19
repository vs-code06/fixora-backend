import { Router } from "express";
import { signup, login, me, logout, guestLogin } from "../controllers/authController.js";
import { validateSignup, validateLogin } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.post("/signup", validateSignup, asyncHandler(signup));
router.post("/login", validateLogin, asyncHandler(login));
router.post("/guest-login", asyncHandler(guestLogin));
router.get("/me", requireAuth, asyncHandler(me));
router.post("/logout", asyncHandler(logout));

export default router;

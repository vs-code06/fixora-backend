import { Router } from "express";
import { getFaqs } from "../controllers/faqController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getFaqs));

export default router;

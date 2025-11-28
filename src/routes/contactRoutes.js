import { Router } from "express";
import { createContact } from "../controllers/contactController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.post("/", asyncHandler(createContact));

export default router;

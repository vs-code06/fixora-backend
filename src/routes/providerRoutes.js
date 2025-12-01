import { Router } from "express";
import { listProviders, getProvider } from "../controllers/providerController.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(listProviders));
router.get("/:id", asyncHandler(getProvider));

export default router;

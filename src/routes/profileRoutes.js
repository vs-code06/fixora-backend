// src/routes/profileRoutes.js
import express from "express";
import { getMyProfile, updateMyProfile, requestProvider, deleteMyProfile, addFavorite, removeFavorite, listFavorites, checkFavorite} from "../controllers/profileController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", requireAuth, getMyProfile);
router.put("/me", requireAuth, updateMyProfile);
router.post("/request-provider", requireAuth, requestProvider);
router.delete("/me", requireAuth, deleteMyProfile);

router.post("/favorites/:providerId", requireAuth, addFavorite);
router.delete("/favorites/:providerId", requireAuth, removeFavorite);
router.get("/favorites", requireAuth, listFavorites);
router.get("/favorites/check/:providerId", requireAuth, checkFavorite);

export default router;

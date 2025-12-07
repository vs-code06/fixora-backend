import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/authorize.js";
import {
    getStats,
    getAllUsers,
    getAllProviders,
    verifyProvider,
    getAllBookings,
    getQueries,
    deleteQuery,
    deleteUser
} from "../controllers/adminController.js";

const router = express.Router();

// Protect all routes: Must be logged in AND have role 'admin'
router.use(requireAuth);
router.use(authorizeRoles("admin"));

router.get("/stats", getStats);
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

router.get("/providers", getAllProviders);
router.patch("/providers/:id/verify", verifyProvider);

router.get("/bookings", getAllBookings);

router.get("/queries", getQueries);
router.delete("/queries/:id", deleteQuery);

export default router;

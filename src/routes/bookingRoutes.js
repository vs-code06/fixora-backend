import express from "express";
import * as bookingCtrl from "../controllers/bookingController.js";
import { requireAuth } from "../middleware/auth.js"; 

const router = express.Router();

router.post("/", requireAuth, bookingCtrl.createBooking);
router.get("/me", requireAuth, bookingCtrl.getMyBookings);         
router.get("/provider", requireAuth, bookingCtrl.getProviderBookings); 
router.get("/:bookingId", requireAuth, bookingCtrl.getBookingById);
router.patch("/:bookingId/status", requireAuth, bookingCtrl.updateBookingStatus);

export default router;

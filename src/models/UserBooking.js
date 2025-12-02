import mongoose from "mongoose";

const userBookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "BookingMaster", required: true },
}, { timestamps: true });

export default mongoose.model("UserBooking", userBookingSchema);

import mongoose from "mongoose";

const providerBookingSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "BookingMaster", required: true },
}, { timestamps: true });

export default mongoose.model("ProviderBooking", providerBookingSchema);

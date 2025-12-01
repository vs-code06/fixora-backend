import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },    
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  
  serviceTitle: { type: String, required: true },
  category: { type: String },

  scheduledAt: { type: Date, required: true },    
  durationHours: { type: Number, default: 1 },    
  address: { type: String, required: true },
  notes: { type: String },

  price: { type: Number }, 
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "in_progress", "completed", "cancelled"],
    default: "pending",
  },

  paid: { type: Boolean, default: false },
  paymentTransactionId: String,

}, { timestamps: true });

bookingSchema.virtual("endsAt").get(function() {
  if (!this.scheduledAt) return null;
  return new Date(this.scheduledAt.getTime() + (this.durationHours || 1) * 60 * 60 * 1000);
});

export default mongoose.model("Booking", bookingSchema);

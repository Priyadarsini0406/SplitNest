const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    propertyId: { type: String, required: true, trim: true, index: true },
    propertyName: { type: String, required: true, trim: true },

    userId: { type: String, required: true, trim: true, index: true },
    ownerId: { type: String, required: true, trim: true, index: true },

    fullName: { type: String, required: true, trim: true },
    email: { type: String, default: "", trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },

    checkInDate: { type: Date, required: true },

    sharingType: {
      type: String,
      enum: ["single", "double", "triple"],
      default: "double",
    },

    splitLedgerEnabled: { type: Boolean, default: true },

    baseRent: { type: Number, required: true, min: 0, default: 0 },
    deposit: { type: Number, min: 0, default: 0 },
    adminFee: { type: Number, min: 0, default: 500 },
    estimatedUtilities: { type: Number, min: 0, default: 1200 },
    totalDue: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Cancelled"],
      default: "Pending",
      index: true,
    },

    ownerMessage: { type: String, default: "", trim: true },
  },
  { timestamps: true }
);

bookingSchema.index({ ownerId: 1, status: 1 });
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ ownerId: 1, createdAt: -1 });

module.exports = mongoose.model("Booking", bookingSchema);

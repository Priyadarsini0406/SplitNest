const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    ownerId: {
      type: String,
      required: [true, "Owner ID is required"],
      trim: true,
      index: true,
    },

    name: { type: String, required: true, trim: true },
    area: { type: String, required: true, trim: true },
    rent: { type: Number, required: true, min: 0 },
    deposit: { type: Number, required: true, min: 0 },

    type: {
      type: String,
      required: true,
      enum: ["PG", "Apartment", "Hostel", "Room", "House"],
    },

    amenities: { type: [String], default: [] },
    sharingOptions: {
      type: [String],
      enum: ["single", "double", "triple"],
      default: ["double"],
    },
    totalBeds: { type: Number, min: 1, default: 1 },
    availableBeds: { type: Number, min: 0, default: 1 },
    description: { type: String, default: "", trim: true },
    image: { type: String, default: "", trim: true },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

propertySchema.index({ ownerId: 1, createdAt: -1 });
propertySchema.index({ status: 1 });

module.exports = mongoose.model("Property", propertySchema);

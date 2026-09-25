const RoommateListing = require("../models/roommateListing.model");
const Property = require("../models/property.model");
const User = require("../models/user.model");

/* ==========================================
   PUBLIC LISTINGS
========================================== */

exports.listPublic = async (req, res) => {
  try {
    const query = {
      status: "Active",
    };

    if (req.query.area) {
      query.area = {
        $regex: String(req.query.area).trim(),
        $options: "i",
      };
    }

    const rows = await RoommateListing.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error("Public Roommate Listing Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load roommate listings.",
      error: error.message,
    });
  }
};

/* ==========================================
   OWNER LISTINGS
========================================== */

exports.listOwner = async (req, res) => {
  try {
    const rows = await RoommateListing.find({
      ownerId: String(req.user.id),
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Owner Roommate Listing Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load listings.",
      error: error.message,
    });
  }
};

/* ==========================================
   CREATE LISTING
========================================== */

exports.create = async (req, res) => {
  try {
    const property = await Property.findOne({
      _id: req.body.propertyId,
      ownerId: String(req.user.id),
      status: "Active",
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Select one of your active properties.",
      });
    }

    const owner = await User.findById(req.user.id).select(
      "fullName phone email"
    );

    const submittedPhone = String(
      req.body.contactPhone || ""
    ).replace(/\D/g, "");

    const ownerPhone = String(
      owner?.phone || ""
    ).replace(/\D/g, "");

    const finalContactPhone =
      submittedPhone || ownerPhone;

    if (!finalContactPhone) {
      return res.status(400).json({
        success: false,
        message:
          "Contact phone is required. Add your phone number in owner profile.",
      });
    }

    if (finalContactPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        message:
          "Contact phone must contain exactly 10 digits.",
      });
    }

    const row = await RoommateListing.create({
      ownerId: String(req.user.id),
      propertyId: String(property._id),
      propertyName: property.name,
      area: property.area,
      gender: req.body.gender || "Any",
      sharingType: req.body.sharingType || "double",
      rent: Number(req.body.rent || property.rent),
      availableBeds: Number(
        req.body.availableBeds || 1
      ),
      description: req.body.description || "",
      contactPhone: finalContactPhone,
      status: "Active",
    });

    return res.status(201).json({
      success: true,
      message: "Roommate request published.",
      data: row,
    });
  } catch (error) {
    console.error("Create Roommate Listing Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   DELETE LISTING
========================================== */

exports.remove = async (req, res) => {
  try {
    const row = await RoommateListing.findOneAndDelete({
      _id: req.params.id,
      ownerId: String(req.user.id),
    });

    if (!row) {
      return res.status(404).json({
        success: false,
        message: "Listing not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Listing deleted.",
    });
  } catch (error) {
    console.error("Delete Roommate Listing Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete listing.",
      error: error.message,
    });
  }
};
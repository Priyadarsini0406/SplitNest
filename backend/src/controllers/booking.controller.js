const mongoose = require("mongoose");
const Booking = require("../models/booking.model");
const Property = require("../models/property.model");
const Notification = require("../models/notification.model");
const { sendBookingStatusEmail } = require("../services/email.service");

const isValidMongoId = (id) =>
  mongoose.Types.ObjectId.isValid(String(id || ""));

const escapeRegExp = (value) =>
  String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findProperty = async (propertyId, propertyName) => {
  if (isValidMongoId(propertyId)) {
    const byId = await Property.findById(propertyId);
    if (byId) return byId;
  }

  if (propertyName) {
    return Property.findOne({
      name: {
        $regex: `^${escapeRegExp(String(propertyName).trim())}$`,
        $options: "i",
      },
      status: "Active",
    }).sort({ createdAt: -1 });
  }

  return null;
};

// POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const {
      propertyId,
      propertyName,
      fullName,
      email,
      phone,
      checkInDate,
      sharingType,
      splitLedgerEnabled,
      baseRent,
      deposit,
      adminFee,
      estimatedUtilities,
    } = req.body || {};

    if (!propertyId || !propertyName || !fullName || !phone || !checkInDate) {
      return res.status(400).json({
        success: false,
        message: "Property, tenant and check-in details are required.",
      });
    }

    const cleanPhone = String(phone).replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number.",
      });
    }

    const selectedDate = new Date(checkInDate);
    if (Number.isNaN(selectedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid check-in date.",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: "Check-in date cannot be in the past.",
      });
    }

    // Resolve owner from the real MongoDB property.
    const property = await findProperty(propertyId, propertyName);

    if (!property || property.status !== "Active") {
      return res.status(404).json({
        success: false,
        message: "This property is no longer available. Please choose an owner-listed property.",
      });
    }

    const resolvedOwnerId = property.ownerId;

    if (!resolvedOwnerId) {
      return res.status(400).json({
        success: false,
        message:
          "Owner information is missing. Book a property created by an owner account.",
      });
    }

    const parsedBaseRent = Number(baseRent ?? property?.rent ?? 0);
    const parsedDeposit = Number(deposit ?? property?.deposit ?? 0);
    const parsedAdminFee = Number(adminFee ?? 500);
    const parsedUtilities = Number(estimatedUtilities ?? 1200);

    const booking = await Booking.create({
      propertyId: String(property?._id || propertyId),
      propertyName: String(property?.name || propertyName).trim(),

      userId: String(req.user.id),
      ownerId: String(resolvedOwnerId),

      fullName: String(fullName).trim(),
      email: String(email || "").trim().toLowerCase(),
      phone: String(phone).trim(),

      checkInDate: selectedDate,
      sharingType: sharingType || "double",
      splitLedgerEnabled: splitLedgerEnabled !== false,

      baseRent: parsedBaseRent,
      deposit: parsedDeposit,
      adminFee: parsedAdminFee,
      estimatedUtilities: parsedUtilities,
      totalDue: parsedBaseRent + parsedDeposit + parsedAdminFee,

      status: "Pending",
      ownerMessage: "",
    });

    await Promise.all([
      Notification.create({
        recipientId: booking.ownerId,
        recipientRole: "owner",
        type: "booking",
        title: "New booking request",
        message: `${booking.fullName} requested ${booking.propertyName}`,
        link: "/owner-bookings",
      }),
      Notification.create({
        recipientId: booking.userId,
        recipientRole: "user",
        type: "booking",
        title: "Booking request submitted",
        message: `Your booking request for ${booking.propertyName} is pending owner approval.`,
        link: "/my-bookings",
      }),
    ]);

    return res.status(201).json({
      success: true,
      message: "Booking request submitted successfully.",
      data: booking,
    });
  } catch (error) {
    console.error("Create Booking Error:", error);

    return res.status(error.name === "ValidationError" ? 400 : 500).json({
      success: false,
      message:
        error.name === "ValidationError"
          ? Object.values(error.errors).map((item) => item.message).join(", ")
          : "Unable to create booking.",
      error: error.message,
    });
  }
};

// GET /api/bookings
const getAllBookings = async (req, res) => {
  try {
    const query = {};

    if (req.user.role === "user" || req.user.role === "tenant") {
      query.userId = String(req.user.id);
    } else if (req.user.role === "owner") {
      query.ownerId = String(req.user.id);
    } else {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view bookings.",
      });
    }

    if (req.query.status) query.status = req.query.status;
    if (req.query.propertyId) query.propertyId = String(req.query.propertyId);

    let bookings = await Booking.find(query).sort({ createdAt: -1 });

    if (req.user.role === "user" || req.user.role === "tenant") {
      const validPropertyIds = new Set(
        (await Property.find({ _id: { $in: bookings.filter((b) => isValidMongoId(b.propertyId)).map((b) => b.propertyId) } }).select("_id"))
          .map((item) => String(item._id))
      );
      const orphanIds = bookings
        .filter((booking) => !validPropertyIds.has(String(booking.propertyId)))
        .map((booking) => booking._id);
      if (orphanIds.length) await Booking.deleteMany({ _id: { $in: orphanIds } });
      bookings = bookings.filter((booking) => validPropertyIds.has(String(booking.propertyId)));
    }

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Get Bookings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch bookings.",
      error: error.message,
    });
  }
};

const getBookingById = async (req, res) => {
  try {
    if (!isValidMongoId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    const allowed =
      String(booking.ownerId) === String(req.user.id) ||
      String(booking.userId) === String(req.user.id);

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this booking.",
      });
    }

    return res.json({ success: true, data: booking });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch booking.",
      error: error.message,
    });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, ownerMessage } = req.body || {};

    if (!isValidMongoId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const allowedStatuses = [
      "Pending",
      "Approved",
      "Rejected",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status.",
      });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (req.user.role === "user" || req.user.role === "tenant") {
      if (
        String(booking.userId) !== String(req.user.id) ||
        status !== "Cancelled"
      ) {
        return res.status(403).json({
          success: false,
          message: "Users can only cancel their own booking.",
        });
      }
    } else if (req.user.role === "owner") {
      if (String(booking.ownerId) !== String(req.user.id)) {
        return res.status(403).json({
          success: false,
          message: "This booking does not belong to your property.",
        });
      }

      if (!["Approved", "Rejected"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Owners can only approve or reject bookings.",
        });
      }
    }

    booking.status = status;
    booking.ownerMessage = String(ownerMessage || "").trim();
    await booking.save();

    await Notification.create({
      recipientId: booking.userId,
      recipientRole: "user",
      type: "booking-status",
      title: `Booking ${status}`,
      message: `${booking.propertyName} booking status changed to ${status}.`,
      link: "/my-bookings",
    });

    if (booking.email && ["Approved", "Rejected"].includes(status)) {
      try {
        await sendBookingStatusEmail(booking.email, booking, status);
      } catch (mailError) {
        console.error("Booking status email error:", mailError.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Booking ${status.toLowerCase()} successfully.`,
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update booking status.",
      error: error.message,
    });
  }
};

const updateBooking = async (req, res) => {
  try {
    if (!isValidMongoId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (String(booking.userId) !== String(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own booking.",
      });
    }

    const fields = [
      "fullName",
      "email",
      "phone",
      "checkInDate",
      "sharingType",
      "splitLedgerEnabled",
    ];

    fields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        booking[field] = req.body[field];
      }
    });

    await booking.save();

    return res.json({
      success: true,
      message: "Booking updated successfully.",
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update booking.",
      error: error.message,
    });
  }
};

const deleteBooking = async (req, res) => {
  try {
    if (!isValidMongoId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    const allowed =
      String(booking.userId) === String(req.user.id) ||
      String(booking.ownerId) === String(req.user.id);

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete this booking.",
      });
    }

    await booking.deleteOne();

    return res.json({
      success: true,
      message: "Booking deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete booking.",
      error: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  updateBooking,
  deleteBooking,
};

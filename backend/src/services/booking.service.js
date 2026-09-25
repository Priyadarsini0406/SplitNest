const Booking = require("../models/booking.model");

// ==========================================
// CREATE BOOKING
// ==========================================

const createBooking = async (bookingData) => {
  const booking = new Booking(bookingData);

  return await booking.save();
};

// ==========================================
// GET ALL BOOKINGS
// ==========================================

const getAllBookings = async (filters = {}) => {
  const query = {};

  if (filters.userId) {
    query.userId = filters.userId;
  }

  if (filters.ownerId) {
    query.ownerId = filters.ownerId;
  }

  if (filters.propertyId) {
    query.propertyId = filters.propertyId;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  return await Booking.find(query).sort({
    createdAt: -1,
  });
};

// ==========================================
// GET BOOKING BY ID
// ==========================================

const getBookingById = async (bookingId) => {
  return await Booking.findById(bookingId);
};

// ==========================================
// UPDATE BOOKING STATUS
// ==========================================

const updateBookingStatus = async (
  bookingId,
  status,
  ownerMessage = ""
) => {
  return await Booking.findByIdAndUpdate(
    bookingId,
    {
      status,
      ownerMessage,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

// ==========================================
// UPDATE COMPLETE BOOKING
// ==========================================

const updateBooking = async (
  bookingId,
  updateData
) => {
  return await Booking.findByIdAndUpdate(
    bookingId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

// ==========================================
// DELETE BOOKING
// ==========================================

const deleteBooking = async (bookingId) => {
  return await Booking.findByIdAndDelete(
    bookingId
  );
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  updateBooking,
  deleteBooking,
};
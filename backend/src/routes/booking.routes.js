const express = require("express");

const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
} = require("../controllers/booking.controller");

const {
  protect,
  requireRole,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.post(
  "/",
  protect,
  requireRole("user", "tenant"),
  createBooking
);

router.get(
  "/",
  protect,
  requireRole("user", "tenant", "owner"),
  getAllBookings
);

router.get(
  "/:id",
  protect,
  requireRole("user", "tenant", "owner"),
  getBookingById
);

router.put(
  "/:id",
  protect,
  requireRole("user", "tenant"),
  updateBooking
);

router.patch(
  "/:id/status",
  protect,
  requireRole("user", "tenant", "owner"),
  updateBookingStatus
);

router.delete(
  "/:id",
  protect,
  requireRole("user", "tenant", "owner"),
  deleteBooking
);

module.exports = router;

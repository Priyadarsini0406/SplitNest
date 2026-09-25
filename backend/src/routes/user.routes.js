const express = require("express");

const {
  getMyProfile,
  updateMyProfile,
  getAllUsersForOwner,
  getUserByIdForOwner,
} = require("../controllers/user.controller");

const {
  protect,
  requireRole,
} = require("../middlewares/auth.middleware");

const router = express.Router();

/* ==========================================
   OWNER USER MANAGEMENT ROUTES
========================================== */

/**
 * Owner can view all registered users.
 *
 * GET /api/users
 */
router.get(
  "/",
  protect,
  requireRole("owner"),
  getAllUsersForOwner
);

/**
 * Owner can view one registered user.
 *
 * GET /api/users/:userId
 */
router.get(
  "/:userId",
  protect,
  requireRole("owner"),
  getUserByIdForOwner
);

/* ==========================================
   PROFILE ROUTES
========================================== */

/**
 * GET /api/users/profile
 */
router.get(
  "/profile/me",
  protect,
  requireRole("user", "owner"),
  getMyProfile
);

/**
 * PUT /api/users/profile
 */
router.put(
  "/profile/me",
  protect,
  requireRole("user", "owner"),
  updateMyProfile
);

/*
  Existing route preserved for frontend compatibility.
*/
router.get(
  "/profile",
  protect,
  requireRole("user", "owner"),
  getMyProfile
);

router.put(
  "/profile",
  protect,
  requireRole("user", "owner"),
  updateMyProfile
);

module.exports = router;
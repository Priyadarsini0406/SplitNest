const express = require("express");

const {
  register,
  verifyEmail,
  resendVerificationCode,
  login,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/auth.controller");

const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationCode);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/me", protect, getCurrentUser);
router.put("/change-password", protect, changePassword);

module.exports = router;
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const authService = require("../services/auth.service");
const User = require("../models/user.model");

const {
  sendVerificationCode,
  sendForgotPasswordEmail,
} = require("../services/email.service");

const {
  generateOTP,
  hashOTP,
  createOTPExpiry,
  isOTPExpired,
  verifyOTPHash,
} = require("../utils/otp.util");

const OTP_EXPIRY_MINUTES = 10;
const OTP_RESEND_COOLDOWN_SECONDS = 60;
const MAX_OTP_ATTEMPTS = 5;
const RESET_PASSWORD_EXPIRY_MINUTES = 15;

/* ==========================================
   COMMON HELPERS
========================================== */

/**
 * Validate email format.
 */
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * Create JWT token.
 */
const generateToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET || "splitnest_default_secret",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );

/**
 * Return only safe user fields.
 */
const formatUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  role: user.role,
  status: user.status,
  isEmailVerified: user.isEmailVerified,

  age: user.age,
  gender: user.gender,
  occupation: user.occupation,
  collegeOrCompany: user.collegeOrCompany,
  city: user.city,
  preferredArea: user.preferredArea,
  monthlyBudget: user.monthlyBudget,
  roomType: user.roomType,
  foodPreference: user.foodPreference,
  smokingPreference: user.smokingPreference,
  bio: user.bio,

  businessName: user.businessName,
  address: user.address,
  area: user.area,
  profileImage: user.profileImage,

  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

/* ==========================================
   REGISTER
========================================== */

/**
 * POST /api/auth/register
 *
 * Creates a new inactive account and sends a 6-digit OTP.
 * Existing unverified registrations are updated and a new OTP is sent.
 */
const register = async (req, res) => {
  try {
    const { fullName, email, phone, password, role } =
      req.body || {};

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Full name, email, phone and password are required.",
      });
    }

    const normalizedEmail = String(email)
      .trim()
      .toLowerCase();

    const normalizedName = String(fullName).trim();

    const cleanPhone = String(phone).replace(/\D/g, "");

    const normalizedPassword = String(password);

    const selectedRole = ["user", "owner"].includes(role)
      ? role
      : "user";

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (!normalizedName) {
      return res.status(400).json({
        success: false,
        message: "Full name is required.",
      });
    }

    if (cleanPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid 10 digit phone number.",
      });
    }

    if (normalizedPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 6 characters.",
      });
    }

    let user = await User.findOne({
      email: normalizedEmail,
      role: selectedRole,
    }).select(
      "+password " +
        "+emailVerificationCode " +
        "+emailVerificationExpires " +
        "+emailVerificationAttempts " +
        "+lastVerificationEmailSentAt"
    );

    if (user && user.isEmailVerified) {
      return res.status(409).json({
        success: false,
        message:
          "An account already exists with this email and role.",
      });
    }

    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);
    const otpExpiry =
      createOTPExpiry(OTP_EXPIRY_MINUTES);
    const now = new Date();

    if (!user) {
      user = await authService.createUser({
        fullName: normalizedName,
        email: normalizedEmail,
        phone: cleanPhone,
        password: normalizedPassword,
        role: selectedRole,
        status: "inactive",
        isEmailVerified: false,
        emailVerificationCode: hashedOTP,
        emailVerificationExpires: otpExpiry,
        emailVerificationAttempts: 0,
        lastVerificationEmailSentAt: now,
      });
    } else {
      user.fullName = normalizedName;
      user.phone = cleanPhone;
      user.password = normalizedPassword;
      user.role = selectedRole;
      user.status = "inactive";
      user.isEmailVerified = false;
      user.emailVerificationCode = hashedOTP;
      user.emailVerificationExpires = otpExpiry;
      user.emailVerificationAttempts = 0;
      user.lastVerificationEmailSentAt = now;

      await user.save();
    }

    const mail = await sendVerificationCode(
      normalizedEmail,
      otp,
      user.fullName
    );

    return res.status(201).json({
      success: true,
      requiresVerification: true,
      email: normalizedEmail,
      role: selectedRole,
      message: mail?.sent
        ? "Verification code sent to your email."
        : "Verification code created. Configure Gmail SMTP to receive it by email.",
      ...(mail?.sent
        ? {}
        : {
            devVerificationCode: otp,
          }),
    });
  } catch (error) {
    console.error("Register Error:", error);

    return res
      .status(error.code === 11000 ? 409 : 500)
      .json({
        success: false,
        message:
          error.code === 11000
            ? "An account already exists with this email and role."
            : "Unable to register user.",
        error: error.message,
      });
  }
};

/* ==========================================
   VERIFY EMAIL
========================================== */

/**
 * POST /api/auth/verify-email
 *
 * Verifies the 6-digit registration OTP.
 */
const verifyEmail = async (req, res) => {
  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();

    const code = String(
      req.body?.code || ""
    ).trim();

    const role = ["user", "owner"].includes(req.body?.role)
      ? req.body.role
      : "user";

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address.",
      });
    }

    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid 6-digit code.",
      });
    }

    const user = await User.findOne({
      email,
      role,
    }).select(
      "+emailVerificationCode " +
        "+emailVerificationExpires " +
        "+emailVerificationAttempts"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Registration request not found.",
      });
    }

    if (user.isEmailVerified) {
      return res.json({
        success: true,
        message:
          "Email already verified. Please login.",
      });
    }

    if (
      (user.emailVerificationAttempts || 0) >=
      MAX_OTP_ATTEMPTS
    ) {
      return res.status(429).json({
        success: false,
        message:
          "Too many incorrect attempts. Please request a new verification code.",
      });
    }

    if (
      !user.emailVerificationCode ||
      isOTPExpired(user.emailVerificationExpires)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Verification code has expired. Please request a new code.",
      });
    }

    const isValidCode = verifyOTPHash(
      code,
      user.emailVerificationCode
    );

    if (!isValidCode) {
      user.emailVerificationAttempts =
        (user.emailVerificationAttempts || 0) + 1;

      await user.save({
        validateBeforeSave: false,
      });

      const remainingAttempts =
        MAX_OTP_ATTEMPTS -
        user.emailVerificationAttempts;

      return res.status(400).json({
        success: false,
        message:
          remainingAttempts > 0
            ? `Invalid verification code. ${remainingAttempts} attempt(s) remaining.`
            : "Too many incorrect attempts. Please request a new verification code.",
      });
    }

    user.isEmailVerified = true;
    user.status = "active";
    user.emailVerificationCode = null;
    user.emailVerificationExpires = null;
    user.emailVerificationAttempts = 0;
    user.lastVerificationEmailSentAt = null;

    await user.save({
      validateBeforeSave: false,
    });

    return res.json({
      success: true,
      message:
        "Email verified successfully. Your account is now active.",
    });
  } catch (error) {
    console.error("Verify Email Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify email.",
      error: error.message,
    });
  }
};

/* ==========================================
   RESEND VERIFICATION OTP
========================================== */

/**
 * POST /api/auth/resend-verification-code
 *
 * Sends a new verification OTP with a 60-second cooldown.
 */
const resendVerificationCode = async (
  req,
  res
) => {
  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();

    const role = ["user", "owner"].includes(req.body?.role)
      ? req.body.role
      : "user";

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address.",
      });
    }

    const user = await User.findOne({
      email,
      role,
    }).select(
      "+emailVerificationCode " +
        "+emailVerificationExpires " +
        "+emailVerificationAttempts " +
        "+lastVerificationEmailSentAt"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Registration request not found.",
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified.",
      });
    }

    if (user.lastVerificationEmailSentAt) {
      const elapsedSeconds = Math.floor(
        (Date.now() -
          new Date(
            user.lastVerificationEmailSentAt
          ).getTime()) /
          1000
      );

      if (
        elapsedSeconds <
        OTP_RESEND_COOLDOWN_SECONDS
      ) {
        return res.status(429).json({
          success: false,
          message: `Please wait ${
            OTP_RESEND_COOLDOWN_SECONDS -
            elapsedSeconds
          } second(s) before requesting another code.`,
        });
      }
    }

    const otp = generateOTP();

    user.emailVerificationCode = hashOTP(otp);
    user.emailVerificationExpires =
      createOTPExpiry(OTP_EXPIRY_MINUTES);
    user.emailVerificationAttempts = 0;
    user.lastVerificationEmailSentAt =
      new Date();

    await user.save({
      validateBeforeSave: false,
    });

    const mail = await sendVerificationCode(
      email,
      otp,
      user.fullName
    );

    return res.json({
      success: true,
      message: mail?.sent
        ? "A new verification code was sent."
        : "New verification code created. Configure Gmail SMTP.",
      ...(mail?.sent
        ? {}
        : {
            devVerificationCode: otp,
          }),
    });
  } catch (error) {
    console.error(
      "Resend Verification Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to resend verification code.",
      error: error.message,
    });
  }
};

/* ==========================================
   LOGIN
========================================== */

/**
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password, role } =
      req.body || {};

    if (!email || !password || !["user", "owner"].includes(role)) {
      return res.status(400).json({
        success: false,
        message:
          "Email, password and account role are required.",
      });
    }

    const normalizedEmail = String(email)
      .trim()
      .toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email address.",
      });
    }

    const user =
      await authService.findUserByEmail(
        normalizedEmail,
        true,
        role
      );

    if (
      !user ||
      !(await user.comparePassword(
        String(password)
      ))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (user.isEmailVerified === false) {
      return res.status(403).json({
        success: false,
        requiresVerification: true,
        email: user.email,
        role: user.role,
        message:
          "Please verify your email before login.",
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive.",
      });
    }

    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `This account is registered as ${user.role}.`,
      });
    }

    return res.json({
      success: true,
      message: "Login successful.",
      token: generateToken(user),
      data: formatUser(user),
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to login.",
      error: error.message,
    });
  }
};

/* ==========================================
   CURRENT USER
========================================== */

/**
 * GET /api/auth/me
 */
const getCurrentUser = async (req, res) => {
  try {
    const user =
      await authService.getUserById(
        req.user.id
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      data: formatUser(user),
    });
  } catch (error) {
    console.error(
      "Get Current User Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to fetch user.",
      error: error.message,
    });
  }
};

/* ==========================================
   FORGOT PASSWORD
========================================== */

/**
 * POST /api/auth/forgot-password
 */
const forgotPassword = async (req, res) => {
  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();

    const role = ["user", "owner"].includes(req.body?.role)
      ? req.body.role
      : "user";

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid email address.",
      });
    }

    const user = await User.findOne({
      email,
      role,
    }).select(
      "+resetPasswordToken +resetPasswordExpires"
    );

    /*
      Always return a general response when the account
      does not exist. This prevents email/account discovery.
    */
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If this email is registered, a password reset link has been sent.",
      });
    }

    const rawToken = crypto
      .randomBytes(32)
      .toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;

    user.resetPasswordExpires = new Date(
      Date.now() +
        RESET_PASSWORD_EXPIRY_MINUTES *
          60 *
          1000
    );

    await user.save({
      validateBeforeSave: false,
    });

    const frontendURL = String(
      process.env.FRONTEND_URL ||
        "http://localhost:5173"
    ).replace(/\/+$/, "");

    const resetURL =
      `${frontendURL}/reset-password` +
      `?email=${encodeURIComponent(email)}` +
      `&role=${encodeURIComponent(role)}` +
      `&token=${encodeURIComponent(rawToken)}`;

    const mail =
      await sendForgotPasswordEmail(
        email,
        user.fullName || "User",
        resetURL
      );

    if (!mail?.sent) {
      console.warn(
        "Password reset email was not sent:",
        mail?.reason
      );

      /*
        Development fallback.
        Token remains active so devResetUrl can be tested.
      */
      return res.status(200).json({
        success: true,
        message:
          "Reset link created, but email could not be sent.",
        devResetUrl: resetURL,
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Password reset link sent to your email.",
    });
  } catch (error) {
    console.error(
      "Forgot Password Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create password reset request.",
      error: error.message,
    });
  }
};

/* ==========================================
   RESET PASSWORD
========================================== */

/**
 * POST /api/auth/reset-password
 */
const resetPassword = async (req, res) => {
  try {
    const { email, token, password, role } =
      req.body || {};

    if (!email || !token || !password || !["user", "owner"].includes(role)) {
      return res.status(400).json({
        success: false,
        message:
          "Email, role, token and new password are required.",
      });
    }

    const normalizedEmail = String(email)
      .trim()
      .toLowerCase();

    const normalizedToken =
      String(token).trim();

    const normalizedPassword =
      String(password);

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address.",
      });
    }

    if (!normalizedToken) {
      return res.status(400).json({
        success: false,
        message:
          "Password reset token is required.",
      });
    }

    if (normalizedPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "New password must contain at least 6 characters.",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(normalizedToken)
      .digest("hex");

    const user = await User.findOne({
      email: normalizedEmail,
      role,
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: new Date(),
      },
    }).select(
      "+password " +
        "+resetPasswordToken " +
        "+resetPasswordExpires"
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Reset link is invalid or expired. Please request a new reset link.",
      });
    }

    const isSamePassword =
      await user.comparePassword(
        normalizedPassword
      );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from your current password.",
      });
    }

    user.password = normalizedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. Please login with your new password.",
    });
  } catch (error) {
    console.error(
      "Reset Password Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to reset password.",
      error: error.message,
    });
  }
};

/* ==========================================
   CHANGE PASSWORD
========================================== */

/**
 * PUT /api/auth/change-password
 */
const changePassword = async (
  req,
  res
) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Current and new passwords are required.",
      });
    }

    const normalizedCurrentPassword =
      String(currentPassword);

    const normalizedNewPassword =
      String(newPassword);

    if (
      normalizedNewPassword.length < 6
    ) {
      return res.status(400).json({
        success: false,
        message:
          "New password must contain at least 6 characters.",
      });
    }

    const user = await User.findById(
      req.user.id
    ).select(
      "+password " +
        "+resetPasswordToken " +
        "+resetPasswordExpires"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const currentPasswordMatches =
      await user.comparePassword(
        normalizedCurrentPassword
      );

    if (!currentPasswordMatches) {
      return res.status(400).json({
        success: false,
        message:
          "Current password is incorrect.",
      });
    }

    const newPasswordMatches =
      await user.comparePassword(
        normalizedNewPassword
      );

    if (newPasswordMatches) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be different from the current password.",
      });
    }

    user.password = normalizedNewPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password changed successfully.",
    });
  } catch (error) {
    console.error(
      "Change Password Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to change password.",
      error: error.message,
    });
  }
};

/* ==========================================
   EXPORT CONTROLLERS
========================================== */

module.exports = {
  register,
  verifyEmail,
  resendVerificationCode,
  login,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  changePassword,
};
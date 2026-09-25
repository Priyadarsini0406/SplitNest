const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [80, "Full name cannot exceed 80 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[0-9]{10}$/, "Phone number must contain exactly 10 digits"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must contain at least 6 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: {
        values: ["user", "owner"],
        message: "Role must be either user or owner",
      },
      default: "user",
    },

    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
        message: "Status must be active or inactive",
      },
      default: "active",
    },

    age: {
      type: Number,
      min: [18, "Age must be at least 18"],
      max: [100, "Age must be 100 or below"],
      default: null,
    },

    gender: {
      type: String,
      enum: ["", "Male", "Female", "Other"],
      default: "",
    },

    occupation: {
      type: String,
      trim: true,
      default: "",
    },

    collegeOrCompany: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "Salem",
    },

    preferredArea: {
      type: String,
      trim: true,
      default: "",
    },

    businessName: {
      type: String,
      trim: true,
      default: "",
      maxlength: [120, "Business name cannot exceed 120 characters"],
    },

    address: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Address cannot exceed 500 characters"],
    },

    area: {
      type: String,
      trim: true,
      default: "",
      maxlength: [120, "Area cannot exceed 120 characters"],
    },

    profileImage: {
      type: String,
      trim: true,
      default: "",
    },

    monthlyBudget: {
      type: Number,
      min: [0, "Monthly budget cannot be negative"],
      default: null,
    },

    roomType: {
      type: String,
      enum: [
        "",
        "Private Room",
        "Double Sharing",
        "Triple Sharing",
        "Entire Flat",
      ],
      default: "",
    },

    foodPreference: {
      type: String,
      enum: ["", "Vegetarian", "Non-Vegetarian", "Any"],
      default: "",
    },

    smokingPreference: {
      type: String,
      enum: ["", "Non-Smoker", "Smoker", "No Preference"],
      default: "",
    },

    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      default: "",
    },

    // Email Verification OTP
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationCode: {
      type: String,
      default: null,
      select: false,
    },

    emailVerificationExpires: {
      type: Date,
      default: null,
      select: false,
    },

    emailVerificationAttempts: {
      type: Number,
      default: 0,
      select: false,
    },

    lastVerificationEmailSentAt: {
      type: Date,
      default: null,
      select: false,
    },

    // Forgot Password
    resetPasswordToken: {
      type: String,
      default: null,
      select: false,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
      select: false,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


// Same email can have one User account and one Owner account.
// Duplicate accounts with the same email and same role are blocked.
userSchema.index({ email: 1, role: 1 }, { unique: true });

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  if (!this.isNew) {
    this.passwordChangedAt = new Date();
  }
});

// Compare entered password with stored password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Remove sensitive fields when converting user document to JSON
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();

  delete userObject.password;
  delete userObject.emailVerificationCode;
  delete userObject.emailVerificationExpires;
  delete userObject.emailVerificationAttempts;
  delete userObject.lastVerificationEmailSentAt;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpires;
  delete userObject.passwordChangedAt;

  return userObject;
};

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);
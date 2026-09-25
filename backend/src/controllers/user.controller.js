const User = require("../models/user.model");

/* ==========================================
   ALLOWED PROFILE UPDATE FIELDS
========================================== */

const allowedProfileFields = [
  "fullName",
  "phone",
  "age",
  "gender",
  "occupation",
  "collegeOrCompany",
  "city",
  "preferredArea",
  "monthlyBudget",
  "roomType",
  "foodPreference",
  "smokingPreference",
  "bio",
  "businessName",
  "address",
  "area",
  "profileImage",
];

/* ==========================================
   PROFILE FORMATTER
========================================== */

const sanitizeProfile = (user) => ({
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
   GET LOGGED-IN USER PROFILE
========================================== */

/**
 * GET /api/users/profile
 */
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: sanitizeProfile(user),
    });
  } catch (error) {
    console.error("Get My Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load profile.",
      error: error.message,
    });
  }
};

/* ==========================================
   UPDATE LOGGED-IN USER PROFILE
========================================== */

/**
 * PUT /api/users/profile
 */
const updateMyProfile = async (req, res) => {
  try {
    const updates = {};

    allowedProfileFields.forEach((field) => {
      if (
        Object.prototype.hasOwnProperty.call(
          req.body || {},
          field
        )
      ) {
        updates[field] = req.body[field];
      }
    });

    if (
      Object.prototype.hasOwnProperty.call(
        updates,
        "fullName"
      )
    ) {
      updates.fullName = String(
        updates.fullName || ""
      ).trim();

      if (!updates.fullName) {
        return res.status(400).json({
          success: false,
          message: "Full name cannot be empty.",
        });
      }
    }

    if (
      Object.prototype.hasOwnProperty.call(
        updates,
        "phone"
      )
    ) {
      const cleanPhone = String(
        updates.phone || ""
      ).replace(/\D/g, "");

      if (cleanPhone && cleanPhone.length !== 10) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter a valid 10 digit phone number.",
        });
      }

      updates.phone = cleanPhone;
    }

    if (
      Object.prototype.hasOwnProperty.call(
        updates,
        "profileImage"
      )
    ) {
      const image = String(
        updates.profileImage || ""
      );

      const isBase64Image =
        image.startsWith("data:image/");

      const isImageURL =
        /^https?:\/\//i.test(image);

      const isUploadedImage =
        image.startsWith("/uploads/");

      if (
        image &&
        !isBase64Image &&
        !isImageURL &&
        !isUploadedImage
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid profile image.",
        });
      }

      if (image.length > 3_500_000) {
        return res.status(413).json({
          success: false,
          message:
            "Profile image is too large. Select an image below 2 MB.",
        });
      }

      updates.profileImage = image;
    }

    ["age", "monthlyBudget"].forEach((field) => {
      if (
        Object.prototype.hasOwnProperty.call(
          updates,
          field
        )
      ) {
        updates[field] =
          updates[field] === "" ||
          updates[field] == null
            ? null
            : Number(updates[field]);
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: updates,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: sanitizeProfile(user),
    });
  } catch (error) {
    console.error("Update My Profile Error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update profile.",
      error: error.message,
    });
  }
};

/* ==========================================
   OWNER - GET ALL REGISTERED USERS
========================================== */

/**
 * GET /api/users
 *
 * Owner can view all registered user accounts.
 */
const getAllUsersForOwner = async (req, res) => {
  try {
    const {
      search = "",
      status = "",
      page = 1,
      limit = 20,
    } = req.query;

    const query = {
      role: "user",
    };

    if (
      status &&
      ["active", "inactive"].includes(status)
    ) {
      query.status = status;
    }

    const normalizedSearch =
      String(search).trim();

    if (normalizedSearch) {
      query.$or = [
        {
          fullName: {
            $regex: normalizedSearch,
            $options: "i",
          },
        },
        {
          email: {
            $regex: normalizedSearch,
            $options: "i",
          },
        },
        {
          phone: {
            $regex: normalizedSearch,
            $options: "i",
          },
        },
      ];
    }

    const currentPage = Math.max(
      Number(page) || 1,
      1
    );

    const pageLimit = Math.min(
      Math.max(Number(limit) || 20, 1),
      100
    );

    const skip =
      (currentPage - 1) * pageLimit;

    const [users, totalUsers] =
      await Promise.all([
        User.find(query)
          .select(
            "fullName email phone role status " +
              "isEmailVerified profileImage city " +
              "preferredArea occupation createdAt updatedAt"
          )
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(pageLimit),

        User.countDocuments(query),
      ]);

    const formattedUsers = users.map(
      (user) => ({
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        isEmailVerified:
          user.isEmailVerified,
        profileImage: user.profileImage,
        city: user.city,
        preferredArea:
          user.preferredArea,
        occupation: user.occupation,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
    );

    return res.status(200).json({
      success: true,
      message:
        "Registered users loaded successfully.",
      data: formattedUsers,
      pagination: {
        currentPage,
        limit: pageLimit,
        totalUsers,
        totalPages: Math.ceil(
          totalUsers / pageLimit
        ),
      },
    });
  } catch (error) {
    console.error(
      "Get Users For Owner Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load registered users.",
      error: error.message,
    });
  }
};

/* ==========================================
   OWNER - GET SINGLE USER
========================================== */

/**
 * GET /api/users/:userId
 */
const getUserByIdForOwner = async (
  req,
  res
) => {
  try {
    const user = await User.findOne({
      _id: req.params.userId,
      role: "user",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: sanitizeProfile(user),
    });
  } catch (error) {
    console.error(
      "Get User By ID Error:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to load user details.",
      error: error.message,
    });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getAllUsersForOwner,
  getUserByIdForOwner,
};
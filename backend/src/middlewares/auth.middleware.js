const jwt = require("jsonwebtoken");

// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================

const protect = async (req, res, next) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required. Please login.",
      });
    }

    const token =
      authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication token not found.",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ||
        "splitnest_default_secret"
    );

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error(
      "Authentication Error:",
      error.message
    );

    if (
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Session expired. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      message:
        "Invalid authentication token.",
    });
  }
};

// ==========================================
// ROLE AUTHORIZATION
// Usage:
// authorize("owner")
// authorize("user", "owner")
// ==========================================

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    if (
      !roles.includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to access this resource.",
      });
    }

    next();
  };
};

// ==========================================
// REQUIRE ROLE
//
// Compatibility middleware for existing
// SplitNest routes.
//
// Supports:
//
// requireRole("owner")
//
// requireRole("user", "owner")
//
// requireRole(["user", "owner"])
// ==========================================

const requireRole = (...roles) => {
  const allowedRoles =
    roles.length === 1 &&
    Array.isArray(roles[0])
      ? roles[0]
      : roles;

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    if (
      !allowedRoles.includes(
        req.user.role
      )
    ) {
      return res.status(403).json({
        success: false,
        message:
          `Access denied. Required role: ${allowedRoles.join(
            " or "
          )}.`,
      });
    }

    next();
  };
};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {
  protect,
  authorize,
  requireRole,
};
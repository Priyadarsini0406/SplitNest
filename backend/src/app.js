const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const propertyRoutes = require("./routes/property.routes");
const publicPropertyRoutes = require("./routes/publicProperty.routes");
const bookingRoutes = require("./routes/booking.routes");
const notificationRoutes = require("./routes/notification.routes");
const roommateListingRoutes = require("./routes/roommateListing.routes");

const errorMiddleware = require("./middlewares/error.middleware");

const app = express();

/* ==========================================
   SECURITY
========================================== */

app.use(helmet());

/* ==========================================
   CORS
========================================== */

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

/* ==========================================
   BODY PARSER
========================================== */

app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

/* ==========================================
   LOGGER
========================================== */

app.use(morgan("dev"));

/* ==========================================
   STATIC FILES (Property Images)
========================================== */

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

/* ==========================================
   ROOT
========================================== */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SplitNest Backend API is running 🚀",
  });
});

/* ==========================================
   HEALTH
========================================== */

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

/* ==========================================
   API ROUTES
========================================== */

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/public-properties", publicPropertyRoutes);

app.use("/api/properties", propertyRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/roommate-listings", roommateListingRoutes);

/* ==========================================
   404
========================================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

/* ==========================================
   GLOBAL ERROR HANDLER
========================================== */

app.use(errorMiddleware);

module.exports = app;
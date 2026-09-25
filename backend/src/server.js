require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const connectDB = require("./config/db");

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
   ENVIRONMENT
========================================== */

const PORT = process.env.PORT || 5000;
const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";

/* ==========================================
   SECURITY
========================================== */

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

/* ==========================================
   CORS
========================================== */

const allowedOrigins = [
  FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman, Thunder Client and server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked request from origin: ${origin}`)
      );
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ==========================================
   BODY PARSER
========================================== */

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

/* ==========================================
   LOGGER
========================================== */

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

/* ==========================================
   STATIC FILES
========================================== */

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

/* ==========================================
   ROOT ROUTE
========================================== */

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "SplitNest Backend API is running 🚀",
  });
});

/* ==========================================
   HEALTH CHECK
========================================== */

app.get("/api/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "SplitNest server is healthy",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
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
   404 ROUTE
========================================== */

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

/* ==========================================
   GLOBAL ERROR HANDLER
========================================== */

app.use(errorMiddleware);

/* ==========================================
   START SERVER
========================================== */

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("==========================================");
      console.log("SplitNest Backend Started Successfully");
      console.log(`Server URL : http://localhost:${PORT}`);
      console.log(`Frontend   : ${FRONTEND_URL}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      console.log("==========================================");
    });
  } catch (error) {
    console.error("Failed to start SplitNest backend:");
    console.error(error.message);

    process.exit(1);
  }
};

startServer();

/* ==========================================
   EXPORT FOR TESTING
========================================== */

module.exports = app;
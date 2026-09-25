const express = require("express");
const { protect } = require("../middlewares/auth.middleware");
const { getNotifications, markAllRead } = require("../controllers/notification.controller");
const router = express.Router();
router.use(protect);
router.get("/", getNotifications);
router.patch("/read-all", markAllRead);
module.exports = router;

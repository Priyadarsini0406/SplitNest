const Notification = require('../models/notification.model');

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipientId: req.user.id }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, count: notifications.length, data: notifications });
  } catch (error) { next(error); }
};

const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ recipientId: req.user.id, read: false }, { $set: { read: true } });
    res.json({ success: true, message: 'Notifications marked as read' });
  } catch (error) { next(error); }
};

module.exports = { getNotifications, markAllRead };

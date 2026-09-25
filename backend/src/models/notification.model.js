const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientId: { type: String, required: true, index: true },
  recipientRole: { type: String, enum: ['user', 'owner'], required: true },
  type: { type: String, default: 'info' },
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  link: { type: String, default: '' },
  read: { type: Boolean, default: false, index: true },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);

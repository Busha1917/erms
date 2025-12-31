const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  targetRole: { type: String }, // 'admin', 'technician'
  message: { type: String, required: true },
  type: { type: String, default: 'info' }, // info, warning, success, error
  isRead: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
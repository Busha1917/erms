const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  recipientUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipientRole: { type: String }, // 'admin', 'technician', 'user'
  type: { type: String, default: 'info' }, // info, success, warning, error
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  relatedId: { type: mongoose.Schema.Types.ObjectId },
  relatedModel: { type: String } // 'RepairRequest', 'Device', 'Inventory'
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Notification', notificationSchema);
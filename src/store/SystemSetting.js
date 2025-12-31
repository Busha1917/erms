const mongoose = require('mongoose');

const systemSettingSchema = mongoose.Schema({
  systemName: { type: String, default: 'ERMS' },
  logoUrl: { type: String },
  contactEmail: { type: String },
  maintenanceMode: { type: Boolean, default: false },
  defaultCurrency: { type: String, default: 'USD' },
  notificationsEnabled: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('SystemSetting', systemSettingSchema);
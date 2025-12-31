const mongoose = require('mongoose');

const sparePartSchema = mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  quantity: { type: Number, required: true, default: 0 },
  minStockLevel: { type: Number, default: 5 },
  price: { type: Number, required: true },
  description: { type: String },
  compatibility: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('SparePart', sparePartSchema);
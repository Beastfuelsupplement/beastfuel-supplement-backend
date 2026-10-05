const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: null },
  address: { type: String, default: null },
  status: { type: String, default: 'Active', enum: ['Active', 'Inactive'] },
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Customer', customerSchema);

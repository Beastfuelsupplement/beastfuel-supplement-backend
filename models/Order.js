const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  items: [orderItemSchema],
  total: { type: Number, default: 0 },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] },
  paymentStatus: { type: String, default: 'Pending', enum: ['Pending', 'Paid', 'Failed', 'Refunded'] },
  paymentMethod: { type: String, default: null },
  shippingAddress: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${String(count + 1).padStart(5, '0')}`;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);

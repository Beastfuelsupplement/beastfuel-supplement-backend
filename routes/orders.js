const express = require('express');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get user's orders
router.get('/', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all orders (admin)
router.get('/all', authenticate, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create order
router.post('/', authenticate, async (req, res) => {
  try {
    const { customerName, customerEmail, items, total, shippingAddress, paymentMethod } = req.body;

    const order = new Order({
      userId: req.user._id,
      customerName,
      customerEmail,
      items,
      total,
      shippingAddress,
      paymentMethod
    });
    await order.save();

    // Update or create customer record
    let customer = await Customer.findOne({ email: customerEmail });
    if (customer) {
      customer.totalOrders += 1;
      customer.totalSpent += total;
      await customer.save();
    } else {
      await Customer.create({
        userId: req.user._id,
        name: customerName,
        email: customerEmail,
        address: shippingAddress,
        totalOrders: 1,
        totalSpent: total
      });
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status (admin)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete order (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

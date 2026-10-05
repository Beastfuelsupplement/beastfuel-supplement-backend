const express = require('express');
const Customer = require('../models/Customer');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all customers (admin)
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update customer (admin)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete customer (admin)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

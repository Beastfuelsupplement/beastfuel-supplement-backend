const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Customer = require('../models/Customer');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// 1. Sign Up / Register (Accepts BOTH '/signup' and '/register')
router.post(['/signup', '/register'], async (req, res) => {
  try {
    const { email, password, name, adminKey } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Determine role: admin@beastfuel.com automatically gets "admin",
    // or if the secret adminKey is provided, otherwise default to "user"
    let role = 'user';
    if (email.toLowerCase() === 'admin@beastfuel.com' || adminKey === process.env.ADMIN_SECRET_KEY) {
      role = 'admin';
    }

    const user = new User({ email, password, name, role });
    await user.save();

    // Automatically sync customer record in the database for regular users
    if (role === 'user') {
      try {
        await Customer.findOneAndUpdate(
          { email: user.email },
          {
            $setOnInsert: {
              userId: user._id,
              name: user.name || user.email.split('@')[0],
              email: user.email,
              status: 'Active',
              totalOrders: 0,
              totalSpent: 0
            }
          },
          { upsert: true, new: true }
        );
      } catch (custErr) {
        console.warn('Customer record sync note:', custErr.message);
      }
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get Current User / Profile (Accepts BOTH '/me' and '/profile')
router.get(['/me', '/profile'], authenticate, (req, res) => {
  const userData = { id: req.user._id, email: req.user.email, name: req.user.name, role: req.user.role };
  res.json({
    ...userData,
    user: userData
  });
});

// 4. Update Password
router.put('/update-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id);
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    user.updatedAt = Date.now();
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Update Profile (name, email)
router.put('/update-profile', authenticate, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user._id);

    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ error: 'Email already in use' });
      user.email = email;
    }

    if (name !== undefined) user.name = name;
    user.updatedAt = Date.now();
    await user.save();

    res.json({ user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const express = require('express');
const Review = require('../models/Review');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Get reviews for a product (public)
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create review
router.post('/', authenticate, async (req, res) => {
  try {
    const { productId, rating, reviewText } = req.body;
    const review = new Review({ userId: req.user._id, productId, rating, reviewText });
    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete review (own only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const express = require('express');
const multer = require('multer');
const path = require('path');
const { authenticate, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter - only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Upload single image (admin only)
router.post('/', authenticate, requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({
    message: 'Image uploaded successfully',
    imageUrl,
    filename: req.file.filename,
    size: req.file.size,
  });
});

// Upload multiple images (admin only)
router.post('/multiple', authenticate, requireAdmin, upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No image files provided' });
  }

  const images = req.files.map(file => ({
    imageUrl: `/uploads/${file.filename}`,
    filename: file.filename,
    size: file.size,
  }));

  res.json({
    message: `${images.length} images uploaded successfully`,
    images,
  });
});

module.exports = router;

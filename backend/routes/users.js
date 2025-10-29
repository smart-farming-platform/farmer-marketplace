const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2000000 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get current user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, upload.single('avatar'), [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').optional().trim(),
  body('address.street').optional().trim(),
  body('address.city').optional().trim(),
  body('address.state').optional().trim(),
  body('address.zipCode').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic fields
    if (req.body.name) user.name = req.body.name;
    if (req.body.phone) user.phone = req.body.phone;
    
    // Update address
    if (req.body.address) {
      user.address = { ...user.address, ...req.body.address };
    }

    // Update farmer profile if user is a farmer
    if (user.role === 'farmer' && req.body.farmerProfile) {
      user.farmerProfile = { ...user.farmerProfile, ...req.body.farmerProfile };
    }

    // Update avatar if uploaded
    if (req.file) {
      user.avatar = req.file.filename;
    }

    await user.save();

    // Return user without password
    const updatedUser = await User.findById(user._id).select('-password');
    
    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all farmers (public)
router.get('/farmers', async (req, res) => {
  try {
    const { page = 1, limit = 12, search } = req.query;
    
    const filter = { role: 'farmer' };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'farmerProfile.farmName': { $regex: search, $options: 'i' } }
      ];
    }

    const farmers = await User.find(filter)
      .select('name farmerProfile avatar createdAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      farmers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get farmers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single farmer profile (public)
router.get('/farmers/:id', async (req, res) => {
  try {
    const farmer = await User.findOne({ 
      _id: req.params.id, 
      role: 'farmer' 
    }).select('name farmerProfile avatar createdAt');

    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    res.json(farmer);
  } catch (error) {
    console.error('Get farmer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
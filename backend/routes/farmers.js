const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get farmer dashboard stats
router.get('/dashboard', auth, async (req, res) => {
  try {
    if (req.user.role !== 'farmer') {
      return res.status(403).json({ message: 'Access denied. Farmers only.' });
    }

    // Get product stats
    const totalProducts = await Product.countDocuments({ farmer: req.user.id });
    const activeProducts = await Product.countDocuments({ 
      farmer: req.user.id, 
      isAvailable: true 
    });

    // Get order stats
    const totalOrders = await Order.countDocuments({ 'items.farmer': req.user.id });
    const pendingOrders = await Order.countDocuments({ 
      'items.farmer': req.user.id, 
      status: { $in: ['pending', 'confirmed'] }
    });

    // Get revenue (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const revenueData = await Order.aggregate([
      {
        $match: {
          'items.farmer': req.user._id,
          createdAt: { $gte: thirtyDaysAgo },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $unwind: '$items'
      },
      {
        $match: {
          'items.farmer': req.user._id
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: { $multiply: ['$items.price', '$items.quantity'] }
          }
        }
      }
    ]);

    const monthlyRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Get recent orders
    const recentOrders = await Order.find({ 'items.farmer': req.user.id })
      .populate('customer', 'name email')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalProducts,
        activeProducts,
        totalOrders,
        pendingOrders,
        monthlyRevenue
      },
      recentOrders
    });
  } catch (error) {
    console.error('Get farmer dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get farmer products
router.get('/products', auth, async (req, res) => {
  try {
    if (req.user.role !== 'farmer') {
      return res.status(403).json({ message: 'Access denied. Farmers only.' });
    }

    const { page = 1, limit = 12, search, category, isAvailable } = req.query;
    
    const filter = { farmer: req.user.id };
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) filter.category = category;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === 'true';

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get farmer products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
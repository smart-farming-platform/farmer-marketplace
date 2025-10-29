const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user orders
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const filter = { customer: req.user.id };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('items.product', 'name images price unit')
      .populate('items.farmer', 'name farmerProfile.farmName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get farmer orders
router.get('/farmer', auth, async (req, res) => {
  try {
    if (req.user.role !== 'farmer') {
      return res.status(403).json({ message: 'Access denied. Farmers only.' });
    }

    const { page = 1, limit = 10, status } = req.query;
    
    const filter = { 'items.farmer': req.user.id };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name images price unit')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get farmer orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create order
router.post('/', auth, [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.product').isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('deliveryAddress.street').notEmpty().withMessage('Street address is required'),
  body('deliveryAddress.city').notEmpty().withMessage('City is required'),
  body('deliveryAddress.zipCode').notEmpty().withMessage('Zip code is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, deliveryAddress, notes } = req.body;

    // Validate products and calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product).populate('farmer');
      
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }

      if (!product.isAvailable) {
        return res.status(400).json({ message: `Product ${product.name} is not available` });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.quantity}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        farmer: product.farmer._id
      });

      // Update product quantity
      product.quantity -= item.quantity;
      await product.save();
    }

    // Create order
    const order = new Order({
      customer: req.user.id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      notes
    });

    await order.save();
    await order.populate('items.product', 'name images');
    await order.populate('items.farmer', 'name farmerProfile.farmName');

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (farmers only)
router.patch('/:id/status', auth, [
  body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'])
    .withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is farmer for this order
    const isFarmerForOrder = order.items.some(item => 
      item.farmer.toString() === req.user.id
    );

    if (req.user.role !== 'farmer' || !isFarmerForOrder) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    order.status = req.body.status;
    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name images price unit description')
      .populate('items.farmer', 'name email phone farmerProfile');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user has access to this order
    const isCustomer = order.customer._id.toString() === req.user.id;
    const isFarmer = order.items.some(item => 
      item.farmer._id.toString() === req.user.id
    );

    if (!isCustomer && !isFarmer && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
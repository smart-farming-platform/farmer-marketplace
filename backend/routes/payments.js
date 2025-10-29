const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', auth, [
  body('items').isArray({ min: 1 }).withMessage('Items are required'),
  body('deliveryAddress').notEmpty().withMessage('Delivery address is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, deliveryAddress } = req.body;

    // Calculate total amount and validate products
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).populate('farmer');

      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
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
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to paise (1 INR = 100 paise)
      currency: 'inr',
      metadata: {
        customerId: req.user.id,
        orderItems: JSON.stringify(orderItems.map(item => ({
          productId: item.product,
          quantity: item.quantity,
          price: item.price
        })))
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      totalAmount: totalAmount
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
});

// Confirm payment and create order
router.post('/confirm-payment', auth, [
  body('paymentIntentId').notEmpty().withMessage('Payment intent ID is required'),
  body('items').isArray({ min: 1 }).withMessage('Items are required'),
  body('deliveryAddress').notEmpty().withMessage('Delivery address is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { paymentIntentId, items, deliveryAddress, notes } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    // Validate and prepare order items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId).populate('farmer');

      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`
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
      notes,
      paymentStatus: 'paid',
      paymentMethod: 'card',
      stripePaymentIntentId: paymentIntentId
    });

    await order.save();
    await order.populate('items.product', 'name images');
    await order.populate('items.farmer', 'name farmerProfile.farmName');

    res.status(201).json({
      message: 'Order created successfully',
      order
    });

  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: 'Failed to confirm payment' });
  }
});

// Get payment history
router.get('/history', auth, async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.user.id,
      paymentStatus: 'paid'
    })
      .populate('items.product', 'name images')
      .populate('items.farmer', 'name farmerProfile.farmName')
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({ message: 'Failed to get payment history' });
  }
});

// Webhook for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;
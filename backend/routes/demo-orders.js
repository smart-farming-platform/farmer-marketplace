const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Simple demo order creation (bypasses complex validation)
router.post('/create', auth, async (req, res) => {
    try {
        const { items, deliveryAddress, notes } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items provided' });
        }

        // Calculate total and prepare order items
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product).populate('farmer');

            if (product) {
                const itemTotal = product.price * item.quantity;
                totalAmount += itemTotal;

                orderItems.push({
                    product: product._id,
                    quantity: item.quantity,
                    price: product.price,
                    farmer: product.farmer._id
                });

                // Update product quantity (optional for demo)
                if (product.quantity >= item.quantity) {
                    product.quantity -= item.quantity;
                    await product.save();
                }
            }
        }

        // Create order with minimal validation
        const order = new Order({
            customer: req.user.id,
            items: orderItems,
            totalAmount,
            deliveryAddress: deliveryAddress || {
                street: 'Demo Street',
                city: 'Demo City',
                state: 'Demo State',
                zipCode: '12345',
                country: 'USA'
            },
            notes: notes || 'Demo order',
            status: 'confirmed',
            paymentStatus: 'paid',
            paymentMethod: 'card'
        });

        await order.save();

        // Populate order details
        await order.populate('items.product', 'name images');
        await order.populate('items.farmer', 'name farmerProfile.farmName');

        res.status(201).json({
            message: 'Demo order created successfully',
            order
        });

    } catch (error) {
        console.error('Demo order creation error:', error);
        res.status(500).json({
            message: 'Demo order creation failed',
            error: error.message
        });
    }
});

module.exports = router;
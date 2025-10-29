const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for review images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/reviews/');
    },
    filename: (req, file, cb) => {
        cb(null, `review-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 3000000 }, // 3MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Add review to product
router.post('/product/:productId', auth, upload.array('images', 3), [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().isLength({ min: 10, max: 500 }).withMessage('Comment must be between 10 and 500 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { productId } = req.params;
        const { rating, comment } = req.body;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user has purchased this product (optional verification)
        const hasPurchased = await Order.findOne({
            customer: req.user.id,
            'items.product': productId,
            paymentStatus: 'paid'
        });

        // Check if user already reviewed this product
        const existingReview = product.reviews.find(
            review => review.user.toString() === req.user.id
        );

        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        // Handle uploaded images
        const reviewImages = req.files ? req.files.map(file => file.filename) : [];

        // Add review
        const newReview = {
            user: req.user.id,
            rating: parseInt(rating),
            comment,
            images: reviewImages,
            verified: !!hasPurchased,
            createdAt: new Date()
        };

        product.reviews.push(newReview);
        product.calculateAverageRating();
        await product.save();

        // Populate the new review
        await product.populate('reviews.user', 'name avatar');

        res.status(201).json({
            message: 'Review added successfully',
            review: product.reviews[product.reviews.length - 1],
            averageRating: product.averageRating
        });

    } catch (error) {
        console.error('Add review error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get product reviews
router.get('/product/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const { page = 1, limit = 10, sort = 'newest' } = req.query;

        const product = await Product.findById(productId)
            .populate('reviews.user', 'name avatar')
            .select('reviews averageRating');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Sort reviews
        let sortedReviews = [...product.reviews];
        switch (sort) {
            case 'oldest':
                sortedReviews.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'highest':
                sortedReviews.sort((a, b) => b.rating - a.rating);
                break;
            case 'lowest':
                sortedReviews.sort((a, b) => a.rating - b.rating);
                break;
            default: // newest
                sortedReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        // Paginate
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + parseInt(limit);
        const paginatedReviews = sortedReviews.slice(startIndex, endIndex);

        // Get review statistics
        const stats = product.getReviewStats();

        res.json({
            reviews: paginatedReviews,
            averageRating: product.averageRating,
            totalReviews: product.reviews.length,
            stats,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(product.reviews.length / limit),
                hasNext: endIndex < product.reviews.length,
                hasPrev: startIndex > 0
            }
        });

    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Mark review as helpful
router.post('/helpful/:reviewId', auth, async (req, res) => {
    try {
        const { reviewId } = req.params;

        const product = await Product.findOne({ 'reviews._id': reviewId });
        if (!product) {
            return res.status(404).json({ message: 'Review not found' });
        }

        const review = product.reviews.id(reviewId);
        const userIndex = review.helpful.indexOf(req.user.id);

        if (userIndex > -1) {
            // Remove helpful vote
            review.helpful.splice(userIndex, 1);
        } else {
            // Add helpful vote
            review.helpful.push(req.user.id);
        }

        await product.save();

        res.json({
            message: 'Helpful status updated',
            helpfulCount: review.helpful.length,
            isHelpful: review.helpful.includes(req.user.id)
        });

    } catch (error) {
        console.error('Mark helpful error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update review
router.put('/:reviewId', auth, upload.array('images', 3), [
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim().isLength({ min: 10, max: 500 }).withMessage('Comment must be between 10 and 500 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        const product = await Product.findOne({ 'reviews._id': reviewId });
        if (!product) {
            return res.status(404).json({ message: 'Review not found' });
        }

        const review = product.reviews.id(reviewId);

        // Check if user owns the review
        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this review' });
        }

        // Update review
        if (rating) review.rating = parseInt(rating);
        if (comment) review.comment = comment;

        // Handle new images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.filename);
            review.images = [...review.images, ...newImages];
        }

        product.calculateAverageRating();
        await product.save();

        res.json({
            message: 'Review updated successfully',
            review,
            averageRating: product.averageRating
        });

    } catch (error) {
        console.error('Update review error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete review
router.delete('/:reviewId', auth, async (req, res) => {
    try {
        const { reviewId } = req.params;

        const product = await Product.findOne({ 'reviews._id': reviewId });
        if (!product) {
            return res.status(404).json({ message: 'Review not found' });
        }

        const review = product.reviews.id(reviewId);

        // Check if user owns the review or is admin
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }

        // Remove review
        product.reviews.pull(reviewId);
        product.calculateAverageRating();
        await product.save();

        res.json({
            message: 'Review deleted successfully',
            averageRating: product.averageRating
        });

    } catch (error) {
        console.error('Delete review error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const auth = require('../middleware/auth');
const aiService = require('../services/aiService');

const router = express.Router();

// AI-powered product recommendations
router.get('/recommendations', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 10 } = req.query;

        // Get user's order history
        const userOrders = await Order.find({ customer: userId })
            .populate('items.product', 'category name')
            .limit(20);

        // Extract categories and products user has bought
        const purchasedCategories = new Map();
        const purchasedProducts = new Set();

        userOrders.forEach(order => {
            order.items.forEach(item => {
                if (item.product) {
                    const category = item.product.category;
                    purchasedCategories.set(category, (purchasedCategories.get(category) || 0) + item.quantity);
                    purchasedProducts.add(item.product._id.toString());
                }
            });
        });

        // Get top categories user buys
        const topCategories = Array.from(purchasedCategories.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([category]) => category);

        let recommendations = [];

        if (topCategories.length > 0) {
            // Recommend products from user's favorite categories
            recommendations = await Product.find({
                category: { $in: topCategories },
                _id: { $nin: Array.from(purchasedProducts) },
                isAvailable: true,
                quantity: { $gt: 0 }
            })
                .populate('farmer', 'name farmerProfile.farmName farmerProfile.rating')
                .sort({ averageRating: -1, createdAt: -1 })
                .limit(parseInt(limit));
        }

        // If not enough recommendations, add popular products
        if (recommendations.length < limit) {
            const popularProducts = await Product.find({
                _id: { $nin: [...Array.from(purchasedProducts), ...recommendations.map(p => p._id)] },
                isAvailable: true,
                quantity: { $gt: 0 }
            })
                .populate('farmer', 'name farmerProfile.farmName farmerProfile.rating')
                .sort({ averageRating: -1, reviews: -1 })
                .limit(parseInt(limit) - recommendations.length);

            recommendations = [...recommendations, ...popularProducts];
        }

        // Add recommendation reasons
        const recommendationsWithReasons = recommendations.map(product => ({
            ...product.toObject(),
            recommendationReason: getRecommendationReason(product, topCategories, purchasedCategories)
        }));

        res.json({
            recommendations: recommendationsWithReasons,
            userPreferences: {
                topCategories,
                totalOrders: userOrders.length
            }
        });

    } catch (error) {
        console.error('AI recommendations error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// AI price prediction
router.get('/price-prediction/:productId', async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Get similar products for price comparison
        const similarProducts = await Product.find({
            category: product.category,
            _id: { $ne: productId },
            isAvailable: true
        }).select('price averageRating');

        if (similarProducts.length === 0) {
            return res.json({
                currentPrice: product.price,
                prediction: 'stable',
                confidence: 0.5,
                message: 'Not enough data for prediction'
            });
        }

        // Calculate average price in category
        const avgPrice = similarProducts.reduce((sum, p) => sum + p.price, 0) / similarProducts.length;
        const priceVariance = similarProducts.reduce((sum, p) => sum + Math.pow(p.price - avgPrice, 2), 0) / similarProducts.length;

        // Simple AI prediction logic
        let prediction = 'stable';
        let confidence = 0.7;

        const priceDiff = (product.price - avgPrice) / avgPrice;

        if (priceDiff > 0.2) {
            prediction = 'decrease';
            confidence = 0.8;
        } else if (priceDiff < -0.2) {
            prediction = 'increase';
            confidence = 0.8;
        }

        // Factor in rating
        if (product.averageRating > 4.5 && prediction === 'decrease') {
            prediction = 'stable';
            confidence = 0.6;
        }

        // Seasonal factors (simplified)
        const month = new Date().getMonth();
        const seasonalFactors = getSeasonalFactors(product.category, month);

        res.json({
            currentPrice: product.price,
            averageMarketPrice: Math.round(avgPrice * 100) / 100,
            prediction,
            confidence,
            seasonalFactor: seasonalFactors,
            priceRange: {
                min: Math.round((avgPrice - Math.sqrt(priceVariance)) * 100) / 100,
                max: Math.round((avgPrice + Math.sqrt(priceVariance)) * 100) / 100
            }
        });

    } catch (error) {
        console.error('Price prediction error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// AI chatbot responses
router.post('/chatbot', auth, async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        // Get user context for personalized responses
        const userContext = {
            role: req.user.role,
            name: req.user.name,
            id: req.user.id
        };

        const response = await aiService.generateChatResponse(message, userContext);

        res.json({
            response,
            timestamp: new Date(),
            aiPowered: aiService.isEnabled
        });

    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// AI farming advice
router.post('/farming-advice', auth, async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ message: 'Query is required' });
        }

        if (req.user.role !== 'farmer') {
            return res.status(403).json({ message: 'This feature is only available for farmers' });
        }

        const advice = await aiService.analyzeFarmingQuery(query, {
            farmerId: req.user.id,
            farmerProfile: req.user.farmerProfile
        });

        res.json({
            advice,
            timestamp: new Date(),
            aiPowered: aiService.isEnabled
        });

    } catch (error) {
        console.error('Farming advice error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Enhanced AI recommendations with explanations
router.get('/smart-recommendations', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 6 } = req.query;

        // Get user's order history
        const userOrders = await Order.find({ customer: userId })
            .populate('items.product', 'category name price')
            .limit(10);

        // Extract purchase patterns
        const purchaseHistory = userOrders.map(order => ({
            items: order.items.map(item => ({
                name: item.product?.name,
                category: item.product?.category,
                price: item.product?.price,
                quantity: item.quantity
            })),
            date: order.createdAt
        }));

        // Get AI-powered recommendation explanation
        const aiExplanation = await aiService.generateProductRecommendations(purchaseHistory);

        // Get actual product recommendations (existing logic)
        const recommendations = await getProductRecommendations(userId, limit);

        res.json({
            recommendations,
            aiExplanation,
            purchaseHistory: purchaseHistory.slice(0, 3), // Last 3 orders
            aiPowered: aiService.isEnabled
        });

    } catch (error) {
        console.error('Smart recommendations error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// AI quality assessment
router.post('/quality-assessment', auth, async (req, res) => {
    try {
        const { productId, images, description } = req.body;

        // Simulate AI quality assessment
        const qualityScore = Math.random() * 40 + 60; // Random score between 60-100

        const assessment = {
            overallScore: Math.round(qualityScore),
            factors: {
                freshness: Math.round(Math.random() * 20 + 80),
                appearance: Math.round(Math.random() * 20 + 75),
                packaging: Math.round(Math.random() * 15 + 85),
                description: Math.round(Math.random() * 10 + 90)
            },
            suggestions: generateQualitySuggestions(qualityScore),
            confidence: Math.random() * 0.3 + 0.7
        };

        res.json(assessment);

    } catch (error) {
        console.error('Quality assessment error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Helper functions
function getRecommendationReason(product, topCategories, purchasedCategories) {
    if (topCategories.includes(product.category)) {
        return `You frequently buy ${product.category}`;
    }
    if (product.averageRating >= 4.5) {
        return 'Highly rated by other customers';
    }
    if (product.isOrganic) {
        return 'Premium organic quality';
    }
    return 'Popular in your area';
}

function getSeasonalFactors(category, month) {
    const seasonalData = {
        fruits: {
            spring: [2, 3, 4],
            summer: [5, 6, 7],
            fall: [8, 9, 10],
            winter: [11, 0, 1]
        },
        vegetables: {
            spring: [2, 3, 4],
            summer: [5, 6, 7],
            fall: [8, 9, 10],
            winter: [11, 0, 1]
        }
    };

    const seasons = ['winter', 'winter', 'spring', 'spring', 'spring', 'summer', 'summer', 'summer', 'fall', 'fall', 'fall', 'winter'];
    const currentSeason = seasons[month];

    if (category === 'fruits' || category === 'vegetables') {
        return {
            season: currentSeason,
            inSeason: seasonalData[category][currentSeason].includes(month),
            factor: seasonalData[category][currentSeason].includes(month) ? 'favorable' : 'neutral'
        };
    }

    return { season: currentSeason, inSeason: true, factor: 'neutral' };
}

async function getProductRecommendations(userId, limit) {
    // Get user's order history
    const userOrders = await Order.find({ customer: userId })
        .populate('items.product', 'category name')
        .limit(20);

    // Extract categories and products user has bought
    const purchasedCategories = new Map();
    const purchasedProducts = new Set();

    userOrders.forEach(order => {
        order.items.forEach(item => {
            if (item.product) {
                const category = item.product.category;
                purchasedCategories.set(category, (purchasedCategories.get(category) || 0) + item.quantity);
                purchasedProducts.add(item.product._id.toString());
            }
        });
    });

    // Get top categories user buys
    const topCategories = Array.from(purchasedCategories.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([category]) => category);

    let recommendations = [];

    if (topCategories.length > 0) {
        // Recommend products from user's favorite categories
        recommendations = await Product.find({
            category: { $in: topCategories },
            _id: { $nin: Array.from(purchasedProducts) },
            isAvailable: true,
            quantity: { $gt: 0 }
        })
            .populate('farmer', 'name farmerProfile.farmName farmerProfile.rating')
            .sort({ averageRating: -1, createdAt: -1 })
            .limit(parseInt(limit));
    }

    // If not enough recommendations, add popular products
    if (recommendations.length < limit) {
        const popularProducts = await Product.find({
            _id: { $nin: [...Array.from(purchasedProducts), ...recommendations.map(p => p._id)] },
            isAvailable: true,
            quantity: { $gt: 0 }
        })
            .populate('farmer', 'name farmerProfile.farmName farmerProfile.rating')
            .sort({ averageRating: -1, reviews: -1 })
            .limit(parseInt(limit) - recommendations.length);

        recommendations = [...recommendations, ...popularProducts];
    }

    // Add recommendation reasons
    return recommendations.map(product => ({
        ...product.toObject(),
        recommendationReason: getRecommendationReason(product, topCategories, purchasedCategories)
    }));
}

function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

function generateQualitySuggestions(score) {
    const suggestions = [];

    if (score < 70) {
        suggestions.push("Consider improving product photography with better lighting");
        suggestions.push("Add more detailed product descriptions");
    }
    if (score < 80) {
        suggestions.push("Highlight organic or sustainable farming practices");
        suggestions.push("Include harvest date information");
    }
    if (score < 90) {
        suggestions.push("Add customer reviews and testimonials");
        suggestions.push("Consider offering bulk pricing options");
    }

    return suggestions.length > 0 ? suggestions : ["Great quality! Keep up the excellent work."];
}

module.exports = router;
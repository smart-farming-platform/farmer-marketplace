const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Update user location
router.post('/update', auth, [
    body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
    body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
    body('address').optional().trim().isLength({ min: 5, max: 200 }).withMessage('Address must be between 5 and 200 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { latitude, longitude, address } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user location
        user.location = {
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            address: address || ''
        };

        // If user is a farmer, also update farmer profile location
        if (user.role === 'farmer') {
            user.farmerProfile.location = {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                address: address || ''
            };
        }

        await user.save();

        res.json({
            message: 'Location updated successfully',
            location: user.location
        });

    } catch (error) {
        console.error('Update location error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get nearby farmers
router.get('/nearby-farmers', async (req, res) => {
    try {
        const { latitude, longitude, radius = 50 } = req.query; // radius in km

        if (!latitude || !longitude) {
            return res.status(400).json({ message: 'Latitude and longitude are required' });
        }

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        const radiusInKm = parseFloat(radius);

        // Find farmers within radius using MongoDB geospatial query
        const farmers = await User.aggregate([
            {
                $match: {
                    role: 'farmer',
                    'farmerProfile.location.latitude': { $exists: true },
                    'farmerProfile.location.longitude': { $exists: true }
                }
            },
            {
                $addFields: {
                    distance: {
                        $multiply: [
                            6371, // Earth's radius in km
                            {
                                $acos: {
                                    $add: [
                                        {
                                            $multiply: [
                                                { $sin: { $multiply: [{ $degreesToRadians: lat }, 1] } },
                                                { $sin: { $multiply: [{ $degreesToRadians: '$farmerProfile.location.latitude' }, 1] } }
                                            ]
                                        },
                                        {
                                            $multiply: [
                                                { $cos: { $multiply: [{ $degreesToRadians: lat }, 1] } },
                                                { $cos: { $multiply: [{ $degreesToRadians: '$farmerProfile.location.latitude' }, 1] } },
                                                { $cos: { $multiply: [{ $degreesToRadians: { $subtract: [lng, '$farmerProfile.location.longitude'] } }, 1] } }
                                            ]
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            },
            {
                $match: {
                    distance: { $lte: radiusInKm }
                }
            },
            {
                $sort: { distance: 1 }
            },
            {
                $project: {
                    name: 1,
                    'farmerProfile.farmName': 1,
                    'farmerProfile.location': 1,
                    'farmerProfile.description': 1,
                    'farmerProfile.rating': 1,
                    'farmerProfile.verified': 1,
                    avatar: 1,
                    distance: 1
                }
            },
            {
                $limit: 20
            }
        ]);

        res.json({
            farmers,
            searchCenter: { latitude: lat, longitude: lng },
            radius: radiusInKm,
            count: farmers.length
        });

    } catch (error) {
        console.error('Get nearby farmers error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get nearby products
router.get('/nearby-products', async (req, res) => {
    try {
        const { latitude, longitude, radius = 50, category, limit = 20 } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ message: 'Latitude and longitude are required' });
        }

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        const radiusInKm = parseFloat(radius);

        // Build match criteria
        const matchCriteria = {
            isAvailable: true,
            quantity: { $gt: 0 }
        };

        if (category) {
            matchCriteria.category = category;
        }

        // Find products from nearby farmers
        const products = await Product.aggregate([
            { $match: matchCriteria },
            {
                $lookup: {
                    from: 'users',
                    localField: 'farmer',
                    foreignField: '_id',
                    as: 'farmerInfo'
                }
            },
            { $unwind: '$farmerInfo' },
            {
                $match: {
                    'farmerInfo.role': 'farmer',
                    'farmerInfo.farmerProfile.location.latitude': { $exists: true },
                    'farmerInfo.farmerProfile.location.longitude': { $exists: true }
                }
            },
            {
                $addFields: {
                    distance: {
                        $multiply: [
                            6371,
                            {
                                $acos: {
                                    $add: [
                                        {
                                            $multiply: [
                                                { $sin: { $multiply: [{ $degreesToRadians: lat }, 1] } },
                                                { $sin: { $multiply: [{ $degreesToRadians: '$farmerInfo.farmerProfile.location.latitude' }, 1] } }
                                            ]
                                        },
                                        {
                                            $multiply: [
                                                { $cos: { $multiply: [{ $degreesToRadians: lat }, 1] } },
                                                { $cos: { $multiply: [{ $degreesToRadians: '$farmerInfo.farmerProfile.location.latitude' }, 1] } },
                                                { $cos: { $multiply: [{ $degreesToRadians: { $subtract: [lng, '$farmerInfo.farmerProfile.location.longitude'] } }, 1] } }
                                            ]
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            },
            {
                $match: {
                    distance: { $lte: radiusInKm }
                }
            },
            {
                $sort: { distance: 1 }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    category: 1,
                    price: 1,
                    unit: 1,
                    quantity: 1,
                    images: 1,
                    isOrganic: 1,
                    averageRating: 1,
                    distance: 1,
                    'farmerInfo.name': 1,
                    'farmerInfo.farmerProfile.farmName': 1,
                    'farmerInfo.farmerProfile.location': 1
                }
            },
            {
                $limit: parseInt(limit)
            }
        ]);

        res.json({
            products,
            searchCenter: { latitude: lat, longitude: lng },
            radius: radiusInKm,
            count: products.length
        });

    } catch (error) {
        console.error('Get nearby products error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Calculate delivery cost based on distance
router.post('/delivery-cost', [
    body('fromLatitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid from latitude'),
    body('fromLongitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid from longitude'),
    body('toLatitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid to latitude'),
    body('toLongitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid to longitude')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fromLatitude, fromLongitude, toLatitude, toLongitude } = req.body;

        // Calculate distance using Haversine formula
        const R = 6371; // Earth's radius in km
        const dLat = (toLatitude - fromLatitude) * Math.PI / 180;
        const dLon = (toLongitude - fromLongitude) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(fromLatitude * Math.PI / 180) * Math.cos(toLatitude * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in km

        // Calculate delivery cost (example pricing)
        let deliveryCost = 0;
        if (distance <= 5) {
            deliveryCost = 2.99; // Free delivery for very close
        } else if (distance <= 15) {
            deliveryCost = 4.99;
        } else if (distance <= 30) {
            deliveryCost = 7.99;
        } else if (distance <= 50) {
            deliveryCost = 12.99;
        } else {
            deliveryCost = 19.99;
        }

        // Estimated delivery time (in hours)
        const estimatedTime = Math.max(2, Math.ceil(distance / 25)); // Assuming 25km/h average

        res.json({
            distance: Math.round(distance * 100) / 100, // Round to 2 decimal places
            deliveryCost,
            estimatedTime,
            currency: 'INR'
        });

    } catch (error) {
        console.error('Calculate delivery cost error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
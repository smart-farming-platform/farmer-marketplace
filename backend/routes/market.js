const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Mock market data - in production, this would integrate with real market APIs
const marketData = {
    tomato: {
        currentPrice: 45,
        yesterdayPrice: 42,
        weekAgoPrice: 38,
        monthAgoPrice: 52,
        predictions: {
            '30days': { price: 58, confidence: 87 },
            '60days': { price: 62, confidence: 82 },
            '90days': { price: 48, confidence: 75 }
        },
        trend: 'rising',
        demandLevel: 'high',
        supplyLevel: 'medium',
        markets: [
            { name: 'Delhi Azadpur', price: 48, distance: 280, state: 'Delhi' },
            { name: 'Mumbai Vashi', price: 52, distance: 450, state: 'Maharashtra' },
            { name: 'Chennai Koyambedu', price: 44, distance: 120, state: 'Tamil Nadu' },
            { name: 'Bangalore Yeshwantpur', price: 46, distance: 200, state: 'Karnataka' }
        ],
        priceHistory: generatePriceHistory(45, 30),
        factors: [
            { factor: 'Weather', impact: 'positive', weight: 0.3, description: 'Good rainfall expected' },
            { factor: 'Festival Season', impact: 'positive', weight: 0.25, description: 'Diwali demand increasing' },
            { factor: 'Supply', impact: 'negative', weight: 0.2, description: 'Harvest season in Punjab' },
            { factor: 'Export', impact: 'positive', weight: 0.25, description: 'New export orders from UAE' }
        ]
    },
    onion: {
        currentPrice: 28,
        yesterdayPrice: 30,
        weekAgoPrice: 32,
        monthAgoPrice: 25,
        predictions: {
            '30days': { price: 35, confidence: 92 },
            '60days': { price: 42, confidence: 88 },
            '90days': { price: 38, confidence: 80 }
        },
        trend: 'volatile',
        demandLevel: 'medium',
        supplyLevel: 'low',
        markets: [
            { name: 'Pune Market', price: 32, distance: 180, state: 'Maharashtra' },
            { name: 'Mumbai Vashi', price: 30, distance: 220, state: 'Maharashtra' },
            { name: 'Nashik APMC', price: 28, distance: 150, state: 'Maharashtra' },
            { name: 'Delhi Azadpur', price: 35, distance: 400, state: 'Delhi' }
        ],
        priceHistory: generatePriceHistory(28, 30),
        factors: [
            { factor: 'Storage', impact: 'positive', weight: 0.35, description: 'Low storage levels' },
            { factor: 'Monsoon', impact: 'negative', weight: 0.25, description: 'Late monsoon affecting quality' },
            { factor: 'Government Policy', impact: 'neutral', weight: 0.15, description: 'Export restrictions lifted' },
            { factor: 'Regional Demand', impact: 'positive', weight: 0.25, description: 'High demand in South India' }
        ]
    }
};

// Get market data for a specific crop
router.get('/crop/:cropId', async (req, res) => {
    try {
        const { cropId } = req.params;
        const data = marketData[cropId];

        if (!data) {
            return res.status(404).json({ message: 'Market data not found for this crop' });
        }

        // Add real-time calculations
        const enhancedData = {
            ...data,
            priceChange: {
                daily: ((data.currentPrice - data.yesterdayPrice) / data.yesterdayPrice * 100).toFixed(2),
                weekly: ((data.currentPrice - data.weekAgoPrice) / data.weekAgoPrice * 100).toFixed(2),
                monthly: ((data.currentPrice - data.monthAgoPrice) / data.monthAgoPrice * 100).toFixed(2)
            },
            bestSellingTime: calculateBestSellingTime(data.predictions),
            riskAssessment: calculateRiskAssessment(data.factors),
            lastUpdated: new Date()
        };

        res.json(enhancedData);
    } catch (error) {
        console.error('Error fetching market data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get price predictions for multiple crops
router.get('/predictions', async (req, res) => {
    try {
        const { crops, timeframe = '30days' } = req.query;
        const cropList = crops ? crops.split(',') : Object.keys(marketData);

        const predictions = cropList.map(cropId => {
            const data = marketData[cropId];
            if (!data) return null;

            return {
                crop: cropId,
                currentPrice: data.currentPrice,
                predictedPrice: data.predictions[timeframe]?.price,
                confidence: data.predictions[timeframe]?.confidence,
                priceChange: data.predictions[timeframe] ?
                    ((data.predictions[timeframe].price - data.currentPrice) / data.currentPrice * 100).toFixed(2) : 0,
                trend: data.trend,
                recommendation: generateRecommendation(data, timeframe)
            };
        }).filter(Boolean);

        res.json({ predictions, timeframe, generatedAt: new Date() });
    } catch (error) {
        console.error('Error fetching predictions:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get best markets for selling
router.get('/markets/:cropId', async (req, res) => {
    try {
        const { cropId } = req.params;
        const { location, maxDistance = 500 } = req.query;

        const data = marketData[cropId];
        if (!data) {
            return res.status(404).json({ message: 'Market data not found for this crop' });
        }

        // Filter markets by distance and add profit calculations
        const markets = data.markets
            .filter(market => market.distance <= maxDistance)
            .map(market => ({
                ...market,
                profitMargin: market.price - data.currentPrice,
                profitPercentage: ((market.price - data.currentPrice) / data.currentPrice * 100).toFixed(2),
                transportCost: calculateTransportCost(market.distance),
                netProfit: market.price - data.currentPrice - calculateTransportCost(market.distance)
            }))
            .sort((a, b) => b.netProfit - a.netProfit);

        res.json({
            crop: cropId,
            currentPrice: data.currentPrice,
            markets,
            bestMarket: markets[0],
            averagePrice: (markets.reduce((sum, m) => sum + m.price, 0) / markets.length).toFixed(2)
        });
    } catch (error) {
        console.error('Error fetching market data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create price alert
router.post('/alerts', auth, async (req, res) => {
    try {
        const { cropId, alertType, targetPrice, notificationMethods } = req.body;

        // Validate input
        if (!cropId || !alertType) {
            return res.status(400).json({ message: 'Crop ID and alert type are required' });
        }

        if ((alertType === 'price_above' || alertType === 'price_below') && !targetPrice) {
            return res.status(400).json({ message: 'Target price is required for price alerts' });
        }

        // Create alert (in production, save to database)
        const alert = {
            id: Date.now().toString(),
            userId: req.user.id,
            cropId,
            alertType,
            targetPrice: parseFloat(targetPrice) || null,
            notificationMethods: notificationMethods || ['push'],
            isActive: true,
            createdAt: new Date(),
            triggeredCount: 0
        };

        // Check if alert should be triggered immediately
        const currentData = marketData[cropId];
        let shouldTrigger = false;

        if (currentData && targetPrice) {
            if (alertType === 'price_above' && currentData.currentPrice >= targetPrice) {
                shouldTrigger = true;
            } else if (alertType === 'price_below' && currentData.currentPrice <= targetPrice) {
                shouldTrigger = true;
            }
        }

        res.json({
            alert,
            triggered: shouldTrigger,
            message: shouldTrigger ? 'Alert created and triggered immediately!' : 'Alert created successfully'
        });
    } catch (error) {
        console.error('Error creating alert:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get crop planning recommendations
router.get('/planning/:season', async (req, res) => {
    try {
        const { season } = req.params;
        const { location = 'maharashtra', farmSize = 5 } = req.query;

        // Mock crop planning data
        const planningData = {
            rabi: [
                {
                    crop: 'Wheat',
                    profitability: 'high',
                    investmentPerAcre: 15000,
                    expectedYield: 25,
                    expectedPrice: 28,
                    profitPerAcre: 45000,
                    roi: 200,
                    riskLevel: 'low',
                    plantingTime: 'Nov-Dec',
                    harvestTime: 'Mar-Apr',
                    suitableFor: ['maharashtra', 'punjab', 'uttar_pradesh'],
                    reasons: [
                        'Government MSP support at ₹2125/quintal',
                        'Export demand increasing',
                        'Good monsoon ensures quality',
                        'Storage facilities available'
                    ]
                },
                {
                    crop: 'Mustard',
                    profitability: 'high',
                    investmentPerAcre: 12000,
                    expectedYield: 12,
                    expectedPrice: 65,
                    profitPerAcre: 66000,
                    roi: 450,
                    riskLevel: 'medium',
                    plantingTime: 'Oct-Nov',
                    harvestTime: 'Feb-Mar',
                    suitableFor: ['rajasthan', 'gujarat', 'maharashtra'],
                    reasons: [
                        'Oil prices rising globally',
                        'Reduced import dependency',
                        'Processing industry demand',
                        'Good export potential'
                    ]
                }
            ],
            kharif: [
                {
                    crop: 'Rice',
                    profitability: 'medium',
                    investmentPerAcre: 18000,
                    expectedYield: 30,
                    expectedPrice: 32,
                    profitPerAcre: 78000,
                    roi: 333,
                    riskLevel: 'medium',
                    plantingTime: 'Jun-Jul',
                    harvestTime: 'Oct-Nov',
                    suitableFor: ['punjab', 'uttar_pradesh', 'west_bengal'],
                    reasons: [
                        'MSP at ₹2183/quintal',
                        'Export opportunities',
                        'Food security crop',
                        'Processing industry demand'
                    ]
                }
            ]
        };

        const recommendations = planningData[season] || [];
        const filteredRecommendations = recommendations.filter(crop =>
            crop.suitableFor.includes(location)
        );

        // Calculate totals for the farm
        const totalInvestment = filteredRecommendations.reduce((sum, crop) =>
            sum + (crop.investmentPerAcre * farmSize), 0
        );
        const totalExpectedProfit = filteredRecommendations.reduce((sum, crop) =>
            sum + (crop.profitPerAcre * farmSize), 0
        );

        res.json({
            season,
            location,
            farmSize: parseInt(farmSize),
            recommendations: filteredRecommendations,
            summary: {
                totalInvestment,
                totalExpectedProfit,
                averageROI: filteredRecommendations.length > 0 ?
                    (filteredRecommendations.reduce((sum, crop) => sum + crop.roi, 0) / filteredRecommendations.length).toFixed(0) : 0
            }
        });
    } catch (error) {
        console.error('Error fetching crop planning data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get market trends and analytics
router.get('/trends', async (req, res) => {
    try {
        const { period = '30days', crops } = req.query;
        const cropList = crops ? crops.split(',') : Object.keys(marketData);

        const trends = cropList.map(cropId => {
            const data = marketData[cropId];
            if (!data) return null;

            return {
                crop: cropId,
                currentPrice: data.currentPrice,
                trend: data.trend,
                priceHistory: data.priceHistory.slice(-parseInt(period.replace('days', ''))),
                volatility: calculateVolatility(data.priceHistory),
                momentum: calculateMomentum(data.priceHistory),
                support: Math.min(...data.priceHistory.map(p => p.price)),
                resistance: Math.max(...data.priceHistory.map(p => p.price))
            };
        }).filter(Boolean);

        res.json({
            trends,
            period,
            marketSummary: {
                bullishCrops: trends.filter(t => t.trend === 'rising').length,
                bearishCrops: trends.filter(t => t.trend === 'falling').length,
                volatileCrops: trends.filter(t => t.trend === 'volatile').length
            }
        });
    } catch (error) {
        console.error('Error fetching market trends:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Helper functions
function generatePriceHistory(currentPrice, days) {
    const history = [];
    let price = currentPrice;

    for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        // Add some random variation
        const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
        price = Math.max(price * (1 + variation), 1);

        history.push({
            date: date.toISOString().split('T')[0],
            price: Math.round(price * 100) / 100
        });
    }

    return history;
}

function calculateBestSellingTime(predictions) {
    const prices = Object.entries(predictions).map(([period, data]) => ({
        period,
        price: data.price,
        confidence: data.confidence
    }));

    const bestPrice = Math.max(...prices.map(p => p.price));
    const bestPeriod = prices.find(p => p.price === bestPrice);

    return `${bestPeriod.period.replace('days', '')} days`;
}

function calculateRiskAssessment(factors) {
    const riskScore = factors.reduce((score, factor) => {
        const impact = factor.impact === 'positive' ? -1 : factor.impact === 'negative' ? 1 : 0;
        return score + (impact * factor.weight);
    }, 0);

    if (riskScore <= -0.2) return 'low';
    if (riskScore >= 0.2) return 'high';
    return 'medium';
}

function generateRecommendation(data, timeframe) {
    const prediction = data.predictions[timeframe];
    if (!prediction) return 'Hold';

    const priceChange = (prediction.price - data.currentPrice) / data.currentPrice;

    if (priceChange > 0.15 && prediction.confidence > 80) return 'Strong Hold';
    if (priceChange > 0.05) return 'Hold';
    if (priceChange < -0.1) return 'Sell Now';
    return 'Monitor';
}

function calculateTransportCost(distance) {
    // ₹2 per km per quintal
    return Math.round(distance * 2);
}

function calculateVolatility(priceHistory) {
    if (priceHistory.length < 2) return 0;

    const prices = priceHistory.map(p => p.price);
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;

    return Math.sqrt(variance) / mean * 100; // Coefficient of variation as percentage
}

function calculateMomentum(priceHistory) {
    if (priceHistory.length < 10) return 0;

    const recent = priceHistory.slice(-5);
    const older = priceHistory.slice(-10, -5);

    const recentAvg = recent.reduce((sum, p) => sum + p.price, 0) / recent.length;
    const olderAvg = older.reduce((sum, p) => sum + p.price, 0) / older.length;

    return ((recentAvg - olderAvg) / olderAvg * 100).toFixed(2);
}

module.exports = router;
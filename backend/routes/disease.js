const express = require('express');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/disease-images/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'disease-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Disease database (in production, this would be in a proper database)
const diseaseDatabase = {
    'tomato_blight': {
        id: 'tomato_blight',
        name: 'Tomato Late Blight',
        nameHi: 'टमाटर का देर से झुलसा रोग',
        nameTa: 'தக்காளி தாமத பூஞ்சை நோய்',
        crop: 'tomato',
        severity: 'high',
        symptoms: [
            'Dark brown spots on leaves',
            'White fuzzy growth on leaf undersides',
            'Rapid leaf yellowing and death',
            'Brown lesions on stems and fruits'
        ],
        causes: [
            'High humidity (>90%)',
            'Cool temperatures (15-20°C)',
            'Poor air circulation',
            'Overhead watering'
        ],
        treatments: {
            organic: [
                'Remove affected leaves immediately',
                'Apply neem oil spray (2-3 times weekly)',
                'Use copper-based fungicide',
                'Improve air circulation',
                'Avoid overhead watering'
            ],
            chemical: [
                'Mancozeb 75% WP (2g/L water)',
                'Metalaxyl + Mancozeb (2g/L)',
                'Copper oxychloride (3g/L)',
                'Apply every 7-10 days'
            ]
        },
        prevention: [
            'Use resistant varieties',
            'Proper spacing between plants',
            'Drip irrigation instead of sprinkler',
            'Regular field sanitation',
            'Crop rotation'
        ],
        estimatedLoss: '30-80% yield loss if untreated',
        treatmentCost: '₹500-1000 per acre',
        recoveryTime: '2-3 weeks with proper treatment',
        urgency: 'immediate'
    },
    'wheat_rust': {
        id: 'wheat_rust',
        name: 'Wheat Leaf Rust',
        nameHi: 'गेहूं का पत्ती रतुआ',
        nameTa: 'கோதுமை இலை துரு',
        crop: 'wheat',
        severity: 'medium',
        symptoms: [
            'Orange-red pustules on leaves',
            'Yellowing of infected areas',
            'Premature leaf drying',
            'Reduced grain filling'
        ],
        causes: [
            'Moderate temperatures (15-25°C)',
            'High humidity',
            'Dense plant population',
            'Susceptible varieties'
        ],
        treatments: {
            organic: [
                'Spray garlic-chili extract',
                'Use trichoderma viride',
                'Apply cow urine solution',
                'Increase potassium fertilization'
            ],
            chemical: [
                'Propiconazole 25% EC (1ml/L)',
                'Tebuconazole 25.9% EC (1ml/L)',
                'Mancozeb 75% WP (2g/L)',
                'Apply at first sign of infection'
            ]
        },
        prevention: [
            'Use resistant varieties',
            'Balanced fertilization',
            'Proper seed treatment',
            'Timely sowing',
            'Field sanitation'
        ],
        estimatedLoss: '10-40% yield loss',
        treatmentCost: '₹300-600 per acre',
        recoveryTime: '1-2 weeks',
        urgency: 'moderate'
    },
    'rice_blast': {
        id: 'rice_blast',
        name: 'Rice Blast Disease',
        nameHi: 'चावल का ब्लास्ट रोग',
        nameTa: 'அரிசி வெடிப்பு நோய்',
        crop: 'rice',
        severity: 'high',
        symptoms: [
            'Diamond-shaped lesions on leaves',
            'Gray centers with brown borders',
            'Neck rot in severe cases',
            'Panicle blast affecting grains'
        ],
        causes: [
            'High nitrogen fertilization',
            'Prolonged leaf wetness',
            'Dense planting',
            'Susceptible varieties'
        ],
        treatments: {
            organic: [
                'Silicon application to strengthen plants',
                'Pseudomonas fluorescens spray',
                'Neem cake application',
                'Balanced nutrition management'
            ],
            chemical: [
                'Tricyclazole 75% WP (0.6g/L)',
                'Carbendazim 50% WP (1g/L)',
                'Propiconazole 25% EC (1ml/L)',
                'Preventive spraying recommended'
            ]
        },
        prevention: [
            'Use resistant varieties',
            'Avoid excessive nitrogen',
            'Proper water management',
            'Seed treatment',
            'Crop rotation'
        ],
        estimatedLoss: '20-70% yield loss',
        treatmentCost: '₹400-800 per acre',
        recoveryTime: '2-4 weeks',
        urgency: 'immediate'
    }
};

// AI Disease Detection (Mock implementation)
router.post('/detect', auth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const { cropType, symptoms, location } = req.body;

        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mock AI analysis - in production, this would call actual AI service
        const mockAnalysis = simulateAIAnalysis(cropType, symptoms);

        // Get disease information
        const diseaseInfo = diseaseDatabase[mockAnalysis.diseaseId];

        if (!diseaseInfo) {
            return res.status(404).json({ message: 'Disease not found in database' });
        }

        // Create analysis result
        const result = {
            analysisId: Date.now().toString(),
            confidence: mockAnalysis.confidence,
            disease: diseaseInfo,
            imageUrl: `/uploads/disease-images/${req.file.filename}`,
            analyzedAt: new Date(),
            location: location,
            recommendations: generateRecommendations(diseaseInfo, location),
            nextSteps: getNextSteps(diseaseInfo.severity),
            expertConsultation: diseaseInfo.severity === 'high'
        };

        res.json(result);

    } catch (error) {
        console.error('Disease detection error:', error);
        res.status(500).json({ message: 'Disease detection failed' });
    }
});

// Get disease information by ID
router.get('/info/:diseaseId', (req, res) => {
    try {
        const { diseaseId } = req.params;
        const disease = diseaseDatabase[diseaseId];

        if (!disease) {
            return res.status(404).json({ message: 'Disease not found' });
        }

        res.json(disease);
    } catch (error) {
        console.error('Error fetching disease info:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all diseases for a specific crop
router.get('/crop/:cropType', (req, res) => {
    try {
        const { cropType } = req.params;

        const cropDiseases = Object.values(diseaseDatabase)
            .filter(disease => disease.crop === cropType.toLowerCase());

        res.json(cropDiseases);
    } catch (error) {
        console.error('Error fetching crop diseases:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Disease alert system
router.post('/alert', auth, async (req, res) => {
    try {
        const { diseaseId, location, severity } = req.body;

        // In production, this would:
        // 1. Store the alert in database
        // 2. Notify nearby farmers
        // 3. Update disease spread maps

        const alert = {
            id: Date.now().toString(),
            diseaseId,
            location,
            severity,
            reportedBy: req.user.id,
            reportedAt: new Date(),
            status: 'active'
        };

        res.json({
            message: 'Disease alert created successfully',
            alert: alert,
            notifiedFarmers: Math.floor(Math.random() * 50) + 10 // Mock number
        });

    } catch (error) {
        console.error('Error creating disease alert:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Expert consultation booking
router.post('/consult', auth, async (req, res) => {
    try {
        const { expertId, diseaseId, preferredTime, consultationType } = req.body;

        // Mock expert consultation booking
        const consultation = {
            id: Date.now().toString(),
            expertId,
            farmerId: req.user.id,
            diseaseId,
            consultationType, // 'video', 'chat', 'phone'
            scheduledTime: preferredTime,
            status: 'scheduled',
            fee: consultationType === 'video' ? 500 : 300,
            bookedAt: new Date()
        };

        res.json({
            message: 'Consultation booked successfully',
            consultation: consultation,
            paymentRequired: true
        });

    } catch (error) {
        console.error('Error booking consultation:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Helper functions
function simulateAIAnalysis(cropType, symptoms) {
    // Mock AI analysis based on crop type and symptoms
    const diseases = Object.keys(diseaseDatabase);
    const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];

    return {
        diseaseId: randomDisease,
        confidence: Math.floor(Math.random() * 20) + 80 // 80-100% confidence
    };
}

function generateRecommendations(disease, location) {
    const baseRecommendations = [
        'Start treatment immediately',
        'Monitor spread to other plants',
        'Improve field sanitation',
        'Consider weather conditions'
    ];

    // Add location-specific recommendations
    if (location && location.includes('humid')) {
        baseRecommendations.push('Increase air circulation');
        baseRecommendations.push('Reduce irrigation frequency');
    }

    return baseRecommendations;
}

function getNextSteps(severity) {
    switch (severity) {
        case 'high':
            return [
                'Immediate treatment required',
                'Isolate affected plants',
                'Contact agricultural expert',
                'Monitor daily for 1 week'
            ];
        case 'medium':
            return [
                'Begin treatment within 24 hours',
                'Monitor affected area',
                'Apply preventive measures',
                'Check weekly progress'
            ];
        case 'low':
            return [
                'Apply preventive treatment',
                'Monitor for spread',
                'Maintain good practices',
                'Regular field inspection'
            ];
        default:
            return ['Monitor and maintain good practices'];
    }
}

module.exports = router;
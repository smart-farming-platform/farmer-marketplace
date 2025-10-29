import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    Sprout, Calendar, TrendingUp, DollarSign,
    AlertTriangle, CheckCircle, Target, BarChart3
} from 'lucide-react'

const CropPlanning = () => {
    const { t } = useTranslation()
    const [selectedSeason, setSelectedSeason] = useState('rabi')
    const [farmSize, setFarmSize] = useState(5)
    const [location, setLocation] = useState('maharashtra')

    // Mock crop recommendations based on market intelligence
    const cropRecommendations = {
        rabi: [
            {
                crop: 'Wheat',
                icon: '🌾',
                profitability: 'high',
                expectedPrice: 28,
                currentPrice: 25,
                investmentPerAcre: 15000,
                expectedYield: '25 quintals/acre',
                profitPerAcre: 45000,
                roi: 200,
                plantingTime: 'Nov-Dec',
                harvestTime: 'Mar-Apr',
                riskLevel: 'low',
                marketDemand: 'stable',
                reasons: [
                    'Government MSP support at ₹2125/quintal',
                    'Export demand increasing',
                    'Good monsoon ensures quality',
                    'Storage facilities available'
                ]
            },
            {
                crop: 'Mustard',
                icon: '🌻',
                profitability: 'high',
                expectedPrice: 65,
                currentPrice: 58,
                investmentPerAcre: 12000,
                expectedYield: '12 quintals/acre',
                profitPerAcre: 66000,
                roi: 450,
                plantingTime: 'Oct-Nov',
                harvestTime: 'Feb-Mar',
                riskLevel: 'medium',
                marketDemand: 'high',
                reasons: [
                    'Oil prices rising globally',
                    'Reduced import dependency',
                    'Processing industry demand',
                    'Good export potential'
                ]
            },
            {
                crop: 'Gram (Chana)',
                icon: '🫘',
                profitability: 'medium',
                expectedPrice: 55,
                currentPrice: 52,
                investmentPerAcre: 10000,
                expectedYield: '15 quintals/acre',
                profitPerAcre: 72500,
                roi: 625,
                plantingTime: 'Oct-Nov',
                harvestTime: 'Feb-Mar',
                riskLevel: 'low',
                marketDemand: 'stable',
                reasons: [
                    'Protein demand increasing',
                    'Pulse mission support',
                    'Nitrogen fixation benefits',
                    'Drought resistant variety'
                ]
            }
        ],
        kharif: [
            {
                crop: 'Rice',
                icon: '🌾',
                profitability: 'medium',
                expectedPrice: 32,
                currentPrice: 30,
                investmentPerAcre: 18000,
                expectedYield: '30 quintals/acre',
                profitPerAcre: 78000,
                roi: 333,
                plantingTime: 'Jun-Jul',
                harvestTime: 'Oct-Nov',
                riskLevel: 'medium',
                marketDemand: 'stable',
                reasons: [
                    'MSP at ₹2183/quintal',
                    'Export opportunities',
                    'Food security crop',
                    'Processing industry demand'
                ]
            },
            {
                crop: 'Cotton',
                icon: '🌱',
                profitability: 'high',
                expectedPrice: 85,
                currentPrice: 78,
                investmentPerAcre: 25000,
                expectedYield: '8 quintals/acre',
                profitPerAcre: 43000,
                roi: 72,
                plantingTime: 'May-Jun',
                harvestTime: 'Oct-Dec',
                riskLevel: 'high',
                marketDemand: 'volatile',
                reasons: [
                    'Textile industry recovery',
                    'Export demand strong',
                    'Technology adoption benefits',
                    'Premium for quality cotton'
                ]
            }
        ]
    }

    const seasons = [
        { id: 'rabi', name: 'Rabi Season', period: 'Oct-Mar', icon: '❄️' },
        { id: 'kharif', name: 'Kharif Season', period: 'Jun-Oct', icon: '🌧️' },
        { id: 'zaid', name: 'Zaid Season', period: 'Mar-Jun', icon: '☀️' }
    ]

    const locations = [
        { id: 'maharashtra', name: 'Maharashtra' },
        { id: 'punjab', name: 'Punjab' },
        { id: 'uttar_pradesh', name: 'Uttar Pradesh' },
        { id: 'gujarat', name: 'Gujarat' },
        { id: 'rajasthan', name: 'Rajasthan' }
    ]

    const getProfitabilityColor = (level) => {
        switch (level) {
            case 'high': return 'text-green-600 bg-green-100'
            case 'medium': return 'text-yellow-600 bg-yellow-100'
            case 'low': return 'text-red-600 bg-red-100'
            default: return 'text-gray-600 bg-gray-100'
        }
    }

    const getRiskColor = (level) => {
        switch (level) {
            case 'low': return 'text-green-600'
            case 'medium': return 'text-yellow-600'
            case 'high': return 'text-red-600'
            default: return 'text-gray-600'
        }
    }

    const calculateTotalInvestment = (crop) => {
        return crop.investmentPerAcre * farmSize
    }

    const calculateTotalProfit = (crop) => {
        return crop.profitPerAcre * farmSize
    }

    const recommendations = cropRecommendations[selectedSeason] || []

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                        <Sprout className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Smart Crop Planning</h3>
                        <p className="text-sm text-gray-600">AI-powered recommendations for maximum profit</p>
                    </div>
                </div>
            </div>

            {/* Planning Parameters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Season</label>
                    <select
                        value={selectedSeason}
                        onChange={(e) => setSelectedSeason(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                        {seasons.map(season => (
                            <option key={season.id} value={season.id}>
                                {season.icon} {season.name} ({season.period})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Farm Size (Acres)</label>
                    <input
                        type="number"
                        value={farmSize}
                        onChange={(e) => setFarmSize(Number(e.target.value))}
                        min="1"
                        max="1000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                        {locations.map(loc => (
                            <option key={loc.id} value={loc.id}>
                                {loc.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Crop Recommendations */}
            <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Target className="w-5 h-5 text-green-600" />
                    <span>Recommended Crops for {seasons.find(s => s.id === selectedSeason)?.name}</span>
                </h4>

                {recommendations.map((crop, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        {/* Crop Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <span className="text-3xl">{crop.icon}</span>
                                <div>
                                    <h5 className="text-xl font-semibold text-gray-900">{crop.crop}</h5>
                                    <div className="flex items-center space-x-3 mt-1">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProfitabilityColor(crop.profitability)}`}>
                                            {crop.profitability.toUpperCase()} PROFIT
                                        </span>
                                        <span className={`text-sm font-medium ${getRiskColor(crop.riskLevel)}`}>
                                            {crop.riskLevel.toUpperCase()} RISK
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            Demand: {crop.marketDemand}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-green-600">
                                    {crop.roi}% ROI
                                </div>
                                <div className="text-sm text-gray-600">Return on Investment</div>
                            </div>
                        </div>

                        {/* Financial Projections */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="bg-blue-50 p-3 rounded-lg">
                                <div className="flex items-center space-x-2 mb-1">
                                    <DollarSign className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-900">Investment</span>
                                </div>
                                <div className="text-lg font-bold text-blue-600">
                                    ₹{calculateTotalInvestment(crop).toLocaleString()}
                                </div>
                                <div className="text-xs text-blue-700">
                                    ₹{crop.investmentPerAcre.toLocaleString()}/acre
                                </div>
                            </div>

                            <div className="bg-green-50 p-3 rounded-lg">
                                <div className="flex items-center space-x-2 mb-1">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-900">Expected Profit</span>
                                </div>
                                <div className="text-lg font-bold text-green-600">
                                    ₹{calculateTotalProfit(crop).toLocaleString()}
                                </div>
                                <div className="text-xs text-green-700">
                                    ₹{crop.profitPerAcre.toLocaleString()}/acre
                                </div>
                            </div>

                            <div className="bg-purple-50 p-3 rounded-lg">
                                <div className="flex items-center space-x-2 mb-1">
                                    <BarChart3 className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm font-medium text-purple-900">Expected Yield</span>
                                </div>
                                <div className="text-lg font-bold text-purple-600">
                                    {crop.expectedYield}
                                </div>
                                <div className="text-xs text-purple-700">
                                    Total: {parseInt(crop.expectedYield) * farmSize} quintals
                                </div>
                            </div>

                            <div className="bg-orange-50 p-3 rounded-lg">
                                <div className="flex items-center space-x-2 mb-1">
                                    <Calendar className="w-4 h-4 text-orange-600" />
                                    <span className="text-sm font-medium text-orange-900">Timeline</span>
                                </div>
                                <div className="text-sm font-bold text-orange-600">
                                    Plant: {crop.plantingTime}
                                </div>
                                <div className="text-xs text-orange-700">
                                    Harvest: {crop.harvestTime}
                                </div>
                            </div>
                        </div>

                        {/* Market Intelligence */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <h6 className="font-medium text-gray-900 mb-2">Market Intelligence</h6>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Current Price:</span>
                                    <span className="font-medium ml-2">₹{crop.currentPrice}/kg</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Expected Price:</span>
                                    <span className="font-medium ml-2 text-green-600">₹{crop.expectedPrice}/kg</span>
                                </div>
                            </div>
                        </div>

                        {/* Reasons for Recommendation */}
                        <div className="mb-4">
                            <h6 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span>Why This Crop?</span>
                            </h6>
                            <ul className="space-y-1">
                                {crop.reasons.map((reason, idx) => (
                                    <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700">
                                        <span className="text-green-500 mt-1">•</span>
                                        <span>{reason}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3">
                            <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
                                Add to Plan
                            </button>
                            <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                                Get Seeds Quote
                            </button>
                            <button className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700">
                                Set Price Alert
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h6 className="font-medium text-blue-900 mb-2">Planning Summary</h6>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <span className="text-blue-700">Total Investment:</span>
                        <div className="font-bold text-blue-900">
                            ₹{recommendations.reduce((sum, crop) => sum + calculateTotalInvestment(crop), 0).toLocaleString()}
                        </div>
                    </div>
                    <div>
                        <span className="text-blue-700">Expected Profit:</span>
                        <div className="font-bold text-green-600">
                            ₹{recommendations.reduce((sum, crop) => sum + calculateTotalProfit(crop), 0).toLocaleString()}
                        </div>
                    </div>
                    <div>
                        <span className="text-blue-700">Farm Size:</span>
                        <div className="font-bold text-blue-900">{farmSize} acres</div>
                    </div>
                    <div>
                        <span className="text-blue-700">Season:</span>
                        <div className="font-bold text-blue-900">
                            {seasons.find(s => s.id === selectedSeason)?.name}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CropPlanning
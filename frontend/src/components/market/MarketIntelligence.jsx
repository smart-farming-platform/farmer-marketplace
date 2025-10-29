import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
    TrendingUp, TrendingDown, DollarSign, AlertTriangle,
    Calendar, MapPin, Target, Bell, BarChart3, LineChart
} from 'lucide-react'

const MarketIntelligence = () => {
    const { t } = useTranslation()
    const [selectedCrop, setSelectedCrop] = useState('tomato')
    const [selectedTimeframe, setSelectedTimeframe] = useState('30days')
    const [marketData, setMarketData] = useState(null)
    const [priceAlerts, setPriceAlerts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    // Mock market data - in production, this would come from real APIs
    const mockMarketData = {
        tomato: {
            currentPrice: 45,
            yesterdayPrice: 42,
            weekAgoPrice: 38,
            monthAgoPrice: 52,
            predictedPrice30Days: 58,
            predictedPrice60Days: 62,
            predictedPrice90Days: 48,
            confidence: 87,
            trend: 'rising',
            demandLevel: 'high',
            supplyLevel: 'medium',
            bestSellingTime: '15-20 days',
            topMarkets: [
                { name: 'Delhi Azadpur', price: 48, distance: '280 km' },
                { name: 'Mumbai Vashi', price: 52, distance: '450 km' },
                { name: 'Chennai Koyambedu', price: 44, distance: '120 km' },
                { name: 'Bangalore Yeshwantpur', price: 46, distance: '200 km' }
            ],
            priceHistory: [
                { date: '2024-10-01', price: 52 },
                { date: '2024-10-05', price: 48 },
                { date: '2024-10-10', price: 45 },
                { date: '2024-10-15', price: 42 },
                { date: '2024-10-20', price: 38 },
                { date: '2024-10-25', price: 42 },
                { date: '2024-10-29', price: 45 }
            ],
            factors: [
                { factor: 'Weather', impact: 'positive', description: 'Good rainfall expected' },
                { factor: 'Festival Season', impact: 'positive', description: 'Diwali demand increasing' },
                { factor: 'Supply', impact: 'negative', description: 'Harvest season in Punjab' },
                { factor: 'Export', impact: 'positive', description: 'New export orders from UAE' }
            ]
        },
        onion: {
            currentPrice: 28,
            yesterdayPrice: 30,
            weekAgoPrice: 32,
            monthAgoPrice: 25,
            predictedPrice30Days: 35,
            predictedPrice60Days: 42,
            predictedPrice90Days: 38,
            confidence: 92,
            trend: 'volatile',
            demandLevel: 'medium',
            supplyLevel: 'low',
            bestSellingTime: '30-45 days',
            topMarkets: [
                { name: 'Pune Market', price: 32, distance: '180 km' },
                { name: 'Mumbai Vashi', price: 30, distance: '220 km' },
                { name: 'Nashik APMC', price: 28, distance: '150 km' },
                { name: 'Delhi Azadpur', price: 35, distance: '400 km' }
            ],
            priceHistory: [
                { date: '2024-10-01', price: 25 },
                { date: '2024-10-05', price: 27 },
                { date: '2024-10-10', price: 32 },
                { date: '2024-10-15', price: 35 },
                { date: '2024-10-20', price: 32 },
                { date: '2024-10-25', price: 30 },
                { date: '2024-10-29', price: 28 }
            ],
            factors: [
                { factor: 'Storage', impact: 'positive', description: 'Low storage levels' },
                { factor: 'Monsoon', impact: 'negative', description: 'Late monsoon affecting quality' },
                { factor: 'Government Policy', impact: 'neutral', description: 'Export restrictions lifted' },
                { factor: 'Regional Demand', impact: 'positive', description: 'High demand in South India' }
            ]
        }
    }

    const crops = [
        { id: 'tomato', name: 'Tomato', nameHi: 'टमाटर', icon: '🍅' },
        { id: 'onion', name: 'Onion', nameHi: 'प्याज', icon: '🧅' },
        { id: 'potato', name: 'Potato', nameHi: 'आलू', icon: '🥔' },
        { id: 'rice', name: 'Rice', nameHi: 'चावल', icon: '🌾' },
        { id: 'wheat', name: 'Wheat', nameHi: 'गेहूं', icon: '🌾' }
    ]

    useEffect(() => {
        // Simulate API call
        setIsLoading(true)
        setTimeout(() => {
            setMarketData(mockMarketData[selectedCrop])
            setIsLoading(false)
        }, 1000)
    }, [selectedCrop])

    const getPriceChangeColor = (current, previous) => {
        if (current > previous) return 'text-green-600'
        if (current < previous) return 'text-red-600'
        return 'text-gray-600'
    }

    const getPriceChangeIcon = (current, previous) => {
        if (current > previous) return <TrendingUp className="w-4 h-4" />
        if (current < previous) return <TrendingDown className="w-4 h-4" />
        return <DollarSign className="w-4 h-4" />
    }

    const getTrendColor = (trend) => {
        switch (trend) {
            case 'rising': return 'text-green-600 bg-green-100'
            case 'falling': return 'text-red-600 bg-red-100'
            case 'volatile': return 'text-yellow-600 bg-yellow-100'
            default: return 'text-gray-600 bg-gray-100'
        }
    }

    const getImpactColor = (impact) => {
        switch (impact) {
            case 'positive': return 'text-green-600'
            case 'negative': return 'text-red-600'
            default: return 'text-gray-600'
        }
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <BarChart3 className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Market Intelligence</h2>
                            <p className="text-sm text-gray-600">AI-powered price predictions & market insights</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <select
                            value={selectedCrop}
                            onChange={(e) => setSelectedCrop(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        >
                            {crops.map(crop => (
                                <option key={crop.id} value={crop.id}>
                                    {crop.icon} {crop.name}
                                </option>
                            ))}
                        </select>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                            <Bell className="w-4 h-4" />
                            <span>Set Alert</span>
                        </button>
                    </div>
                </div>

                {/* Current Price Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm">Current Price</p>
                                <p className="text-2xl font-bold">₹{marketData?.currentPrice}/kg</p>
                            </div>
                            <DollarSign className="w-8 h-8 text-blue-200" />
                        </div>
                        <div className={`flex items-center space-x-1 mt-2 ${getPriceChangeColor(marketData?.currentPrice, marketData?.yesterdayPrice)}`}>
                            {getPriceChangeIcon(marketData?.currentPrice, marketData?.yesterdayPrice)}
                            <span className="text-sm">
                                {marketData?.currentPrice > marketData?.yesterdayPrice ? '+' : ''}
                                {((marketData?.currentPrice - marketData?.yesterdayPrice) / marketData?.yesterdayPrice * 100).toFixed(1)}% vs yesterday
                            </span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm">30-Day Prediction</p>
                                <p className="text-2xl font-bold">₹{marketData?.predictedPrice30Days}/kg</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-200" />
                        </div>
                        <div className="flex items-center space-x-1 mt-2">
                            <Target className="w-4 h-4 text-green-200" />
                            <span className="text-sm text-green-100">{marketData?.confidence}% confidence</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm">Market Trend</p>
                                <p className="text-xl font-bold capitalize">{marketData?.trend}</p>
                            </div>
                            <LineChart className="w-8 h-8 text-purple-200" />
                        </div>
                        <div className="flex items-center space-x-1 mt-2">
                            <Calendar className="w-4 h-4 text-purple-200" />
                            <span className="text-sm text-purple-100">Best time: {marketData?.bestSellingTime}</span>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-sm">Potential Profit</p>
                                <p className="text-2xl font-bold">
                                    ₹{((marketData?.predictedPrice30Days - marketData?.currentPrice) * 100).toLocaleString()}
                                </p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-orange-200" />
                        </div>
                        <div className="flex items-center space-x-1 mt-2">
                            <span className="text-sm text-orange-100">Per 100kg if sold optimally</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Price Predictions & Market Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Price Predictions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span>Price Predictions</span>
                    </h3>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div>
                                <p className="font-medium text-green-900">30 Days</p>
                                <p className="text-sm text-green-700">Recommended selling period</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-green-600">₹{marketData?.predictedPrice30Days}</p>
                                <p className="text-sm text-green-600">
                                    +{((marketData?.predictedPrice30Days - marketData?.currentPrice) / marketData?.currentPrice * 100).toFixed(1)}%
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                            <div>
                                <p className="font-medium text-blue-900">60 Days</p>
                                <p className="text-sm text-blue-700">Peak season expected</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-blue-600">₹{marketData?.predictedPrice60Days}</p>
                                <p className="text-sm text-blue-600">
                                    +{((marketData?.predictedPrice60Days - marketData?.currentPrice) / marketData?.currentPrice * 100).toFixed(1)}%
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900">90 Days</p>
                                <p className="text-sm text-gray-700">Market stabilization</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-gray-600">₹{marketData?.predictedPrice90Days}</p>
                                <p className="text-sm text-gray-600">
                                    {marketData?.predictedPrice90Days > marketData?.currentPrice ? '+' : ''}
                                    {((marketData?.predictedPrice90Days - marketData?.currentPrice) / marketData?.currentPrice * 100).toFixed(1)}%
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            <p className="text-sm font-medium text-yellow-900">AI Recommendation</p>
                        </div>
                        <p className="text-sm text-yellow-800 mt-1">
                            Hold your stock for {marketData?.bestSellingTime} to maximize profit.
                            Expected gain: ₹{((marketData?.predictedPrice30Days - marketData?.currentPrice) * 100).toLocaleString()} per 100kg.
                        </p>
                    </div>
                </div>

                {/* Market Factors */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        <span>Market Factors</span>
                    </h3>

                    <div className="space-y-3">
                        {marketData?.factors.map((factor, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                                <div className={`w-3 h-3 rounded-full mt-1 ${factor.impact === 'positive' ? 'bg-green-500' :
                                        factor.impact === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                                    }`}></div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium text-gray-900">{factor.factor}</p>
                                        <span className={`text-sm font-medium ${getImpactColor(factor.impact)}`}>
                                            {factor.impact}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{factor.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">Demand Level</p>
                            <p className={`font-bold capitalize ${marketData?.demandLevel === 'high' ? 'text-green-600' :
                                    marketData?.demandLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                {marketData?.demandLevel}
                            </p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <p className="text-sm text-purple-700">Supply Level</p>
                            <p className={`font-bold capitalize ${marketData?.supplyLevel === 'low' ? 'text-green-600' :
                                    marketData?.supplyLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                {marketData?.supplyLevel}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Markets */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-red-600" />
                    <span>Best Markets to Sell</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {marketData?.topMarkets.map((market, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium text-gray-900">{market.name}</h4>
                                <span className="text-lg font-bold text-green-600">₹{market.price}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>{market.distance}</span>
                                <span className={`font-medium ${market.price > marketData.currentPrice ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {market.price > marketData.currentPrice ? '+' : ''}
                                    ₹{(market.price - marketData.currentPrice).toFixed(0)} vs local
                                </span>
                            </div>
                            <button className="w-full mt-3 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700">
                                Get Transport Quote
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MarketIntelligence
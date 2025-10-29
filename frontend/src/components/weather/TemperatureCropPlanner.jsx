import { useState, useEffect } from 'react'
import { Thermometer, Calendar, TrendingUp, Leaf, Sun, Snowflake, Droplets, Star } from 'lucide-react'
import weatherService from '../../services/weatherService'

const TemperatureCropPlanner = ({ location }) => {
    const [weather, setWeather] = useState(null)
    const [forecast, setForecast] = useState([])
    const [selectedSeason, setSelectedSeason] = useState('current')
    const [loading, setLoading] = useState(true)

    const cropDatabase = {
        // Cool Season Crops (5-20°C)
        coolSeason: [
            { name: 'Lettuce', icon: '🥬', optimalTemp: { min: 10, max: 20 }, plantingTemp: { min: 8, max: 18 }, daysToHarvest: 45 },
            { name: 'Spinach', icon: '🥬', optimalTemp: { min: 8, max: 18 }, plantingTemp: { min: 5, max: 15 }, daysToHarvest: 40 },
            { name: 'Peas', icon: '🟢', optimalTemp: { min: 10, max: 18 }, plantingTemp: { min: 7, max: 16 }, daysToHarvest: 60 },
            { name: 'Carrots', icon: '🥕', optimalTemp: { min: 12, max: 22 }, plantingTemp: { min: 8, max: 20 }, daysToHarvest: 70 },
            { name: 'Broccoli', icon: '🥦', optimalTemp: { min: 15, max: 20 }, plantingTemp: { min: 10, max: 18 }, daysToHarvest: 80 },
            { name: 'Cabbage', icon: '🥬', optimalTemp: { min: 12, max: 20 }, plantingTemp: { min: 8, max: 18 }, daysToHarvest: 90 },
        ],
        // Warm Season Crops (18-30°C)
        warmSeason: [
            { name: 'Tomato', icon: '🍅', optimalTemp: { min: 18, max: 27 }, plantingTemp: { min: 16, max: 24 }, daysToHarvest: 80 },
            { name: 'Pepper', icon: '🫑', optimalTemp: { min: 20, max: 30 }, plantingTemp: { min: 18, max: 26 }, daysToHarvest: 75 },
            { name: 'Cucumber', icon: '🥒', optimalTemp: { min: 20, max: 30 }, plantingTemp: { min: 18, max: 25 }, daysToHarvest: 55 },
            { name: 'Zucchini', icon: '🥒', optimalTemp: { min: 18, max: 28 }, plantingTemp: { min: 16, max: 25 }, daysToHarvest: 50 },
            { name: 'Beans', icon: '🫘', optimalTemp: { min: 16, max: 28 }, plantingTemp: { min: 15, max: 25 }, daysToHarvest: 60 },
            { name: 'Eggplant', icon: '🍆', optimalTemp: { min: 22, max: 30 }, plantingTemp: { min: 20, max: 28 }, daysToHarvest: 85 },
        ],
        // Hot Season Crops (25-40°C)
        hotSeason: [
            { name: 'Okra', icon: '🌶️', optimalTemp: { min: 25, max: 35 }, plantingTemp: { min: 22, max: 32 }, daysToHarvest: 60 },
            { name: 'Hot Peppers', icon: '🌶️', optimalTemp: { min: 25, max: 35 }, plantingTemp: { min: 22, max: 30 }, daysToHarvest: 80 },
            { name: 'Watermelon', icon: '🍉', optimalTemp: { min: 24, max: 35 }, plantingTemp: { min: 20, max: 30 }, daysToHarvest: 90 },
            { name: 'Melon', icon: '🍈', optimalTemp: { min: 22, max: 32 }, plantingTemp: { min: 20, max: 28 }, daysToHarvest: 85 },
            { name: 'Sweet Potato', icon: '🍠', optimalTemp: { min: 20, max: 30 }, plantingTemp: { min: 18, max: 28 }, daysToHarvest: 120 },
        ]
    }

    useEffect(() => {
        loadWeatherData()
    }, [location])

    const loadWeatherData = async () => {
        try {
            setLoading(true)
            const lat = location?.lat || 13.0827
            const lon = location?.lon || 80.2707

            const [currentWeather, forecastData] = await Promise.all([
                weatherService.getCurrentWeather(lat, lon),
                weatherService.getForecast(lat, lon)
            ])

            setWeather(currentWeather)
            setForecast(forecastData)
        } catch (error) {
            console.error('Error loading weather data:', error)
        } finally {
            setLoading(false)
        }
    }

    const calculateSuitability = (crop, currentTemp, avgTemp) => {
        const tempScore = calculateTemperatureScore(avgTemp, crop.optimalTemp)
        const plantingScore = calculateTemperatureScore(currentTemp, crop.plantingTemp)
        return (tempScore + plantingScore) / 2
    }

    const calculateTemperatureScore = (temp, optimalRange) => {
        if (temp >= optimalRange.min && temp <= optimalRange.max) {
            return 1.0
        }

        const midPoint = (optimalRange.min + optimalRange.max) / 2
        const range = optimalRange.max - optimalRange.min
        const distance = Math.abs(temp - midPoint)

        return Math.max(0, 1 - (distance / (range * 1.5)))
    }

    const getSuitableCrops = () => {
        if (!weather || !forecast.length) return []

        const currentTemp = weather.temperature
        const avgTemp = forecast.reduce((sum, day) => sum + (day.temperature.min + day.temperature.max) / 2, 0) / forecast.length

        const allCrops = [
            ...cropDatabase.coolSeason.map(crop => ({ ...crop, season: 'cool' })),
            ...cropDatabase.warmSeason.map(crop => ({ ...crop, season: 'warm' })),
            ...cropDatabase.hotSeason.map(crop => ({ ...crop, season: 'hot' }))
        ]

        return allCrops
            .map(crop => ({
                ...crop,
                suitability: calculateSuitability(crop, currentTemp, avgTemp),
                plantingAdvice: getPlantingAdvice(crop, currentTemp, avgTemp)
            }))
            .filter(crop => crop.suitability > 0.3)
            .sort((a, b) => b.suitability - a.suitability)
    }

    const getPlantingAdvice = (crop, currentTemp, avgTemp) => {
        if (currentTemp >= crop.plantingTemp.min && currentTemp <= crop.plantingTemp.max) {
            return { status: 'optimal', message: 'Perfect planting conditions' }
        } else if (currentTemp < crop.plantingTemp.min) {
            const diff = crop.plantingTemp.min - currentTemp
            return {
                status: 'wait',
                message: `Wait ${Math.ceil(diff * 2)} days for warmer weather`
            }
        } else {
            return {
                status: 'protect',
                message: 'Use shade cloth or wait for cooler weather'
            }
        }
    }

    const getSeasonIcon = (season) => {
        switch (season) {
            case 'cool': return <Snowflake className="w-4 h-4 text-blue-500" />
            case 'warm': return <Sun className="w-4 h-4 text-yellow-500" />
            case 'hot': return <Thermometer className="w-4 h-4 text-red-500" />
            default: return <Leaf className="w-4 h-4 text-green-500" />
        }
    }

    const getSuitabilityColor = (score) => {
        if (score >= 0.8) return 'text-green-600 bg-green-100'
        if (score >= 0.6) return 'text-yellow-600 bg-yellow-100'
        if (score >= 0.4) return 'text-orange-600 bg-orange-100'
        return 'text-red-600 bg-red-100'
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-32 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    const suitableCrops = getSuitableCrops()

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6">
                <div className="flex items-center space-x-3">
                    <Thermometer className="w-8 h-8" />
                    <div>
                        <h2 className="text-xl font-semibold">Temperature-Based Crop Planner</h2>
                        <p className="text-blue-100 text-sm">
                            Smart crop suggestions based on current and forecasted temperatures
                        </p>
                    </div>
                </div>
            </div>

            {/* Current Temperature Info */}
            <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-bold text-blue-600">{weather.temperature}°C</div>
                        <div className="text-sm text-gray-600">Current Temp</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-green-600">
                            {Math.round(forecast.reduce((sum, day) => sum + (day.temperature.min + day.temperature.max) / 2, 0) / forecast.length)}°C
                        </div>
                        <div className="text-sm text-gray-600">5-Day Average</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-red-600">
                            {Math.max(...forecast.map(day => day.temperature.max))}°C
                        </div>
                        <div className="text-sm text-gray-600">Max This Week</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-blue-600">
                            {Math.min(...forecast.map(day => day.temperature.min))}°C
                        </div>
                        <div className="text-sm text-gray-600">Min This Week</div>
                    </div>
                </div>
            </div>

            {/* Crop Recommendations */}
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Recommended Crops</h3>
                    <div className="text-sm text-gray-600">
                        Showing {suitableCrops.length} suitable crops
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suitableCrops.map((crop, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{crop.icon}</span>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{crop.name}</h4>
                                        <div className="flex items-center space-x-1">
                                            {getSeasonIcon(crop.season)}
                                            <span className="text-xs text-gray-500 capitalize">{crop.season} season</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSuitabilityColor(crop.suitability)}`}>
                                    {Math.round(crop.suitability * 100)}%
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Optimal Temp:</span>
                                    <span className="font-medium">{crop.optimalTemp.min}-{crop.optimalTemp.max}°C</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Days to Harvest:</span>
                                    <span className="font-medium">{crop.daysToHarvest} days</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Planting Status:</span>
                                    <span className={`font-medium ${crop.plantingAdvice.status === 'optimal' ? 'text-green-600' :
                                            crop.plantingAdvice.status === 'wait' ? 'text-yellow-600' :
                                                'text-orange-600'
                                        }`}>
                                        {crop.plantingAdvice.status === 'optimal' ? '✓ Plant Now' :
                                            crop.plantingAdvice.status === 'wait' ? '⏳ Wait' :
                                                '🛡️ Protect'}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                                {crop.plantingAdvice.message}
                            </div>

                            <div className="mt-3 flex items-center">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3 h-3 ${i < Math.round(crop.suitability * 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                                <span className="ml-2 text-xs text-gray-500">Suitability Score</span>
                            </div>
                        </div>
                    ))}
                </div>

                {suitableCrops.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        <Thermometer className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No suitable crops found for current temperature conditions.</p>
                        <p className="text-sm">Try adjusting your location or check back when weather changes.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TemperatureCropPlanner
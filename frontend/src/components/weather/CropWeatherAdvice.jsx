import { useState, useEffect } from 'react'
import {
    Leaf,
    Droplets,
    Sun,
    Calendar,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Clock,
    Thermometer,
    Star
} from 'lucide-react'
import weatherService from '../../services/weatherService'

const CropWeatherAdvice = ({ selectedCrop = 'tomato', location }) => {
    const [weather, setWeather] = useState(null)
    const [forecast, setForecast] = useState([])
    const [advice, setAdvice] = useState([])
    const [loading, setLoading] = useState(true)

    const crops = {
        tomato: {
            name: 'Tomato',
            icon: '🍅',
            optimalTemp: { min: 18, max: 27 },
            optimalHumidity: { min: 60, max: 70 },
            waterNeeds: 'medium',
            growthStages: ['seedling', 'vegetative', 'flowering', 'fruiting'],
            season: 'warm',
            soilTemp: { min: 16, max: 24 },
            frostTolerance: 'none',
            heatTolerance: 'moderate'
        },
        rice: {
            name: 'Rice',
            icon: '🌾',
            optimalTemp: { min: 20, max: 35 },
            optimalHumidity: { min: 70, max: 85 },
            waterNeeds: 'high',
            growthStages: ['germination', 'tillering', 'panicle', 'grain_filling'],
            season: 'hot',
            soilTemp: { min: 18, max: 30 },
            frostTolerance: 'none',
            heatTolerance: 'high'
        },
        wheat: {
            name: 'Wheat',
            icon: '🌾',
            optimalTemp: { min: 15, max: 25 },
            optimalHumidity: { min: 50, max: 70 },
            waterNeeds: 'medium',
            growthStages: ['germination', 'tillering', 'jointing', 'grain_filling'],
            season: 'cool',
            soilTemp: { min: 10, max: 20 },
            frostTolerance: 'moderate',
            heatTolerance: 'low'
        },
        corn: {
            name: 'Corn',
            icon: '🌽',
            optimalTemp: { min: 16, max: 35 },
            optimalHumidity: { min: 60, max: 75 },
            waterNeeds: 'high',
            growthStages: ['emergence', 'vegetative', 'tasseling', 'grain_filling'],
            season: 'warm',
            soilTemp: { min: 15, max: 30 },
            frostTolerance: 'none',
            heatTolerance: 'high'
        },
        potato: {
            name: 'Potato',
            icon: '🥔',
            optimalTemp: { min: 15, max: 20 },
            optimalHumidity: { min: 70, max: 80 },
            waterNeeds: 'medium',
            growthStages: ['sprouting', 'vegetative', 'tuber_initiation', 'tuber_bulking'],
            season: 'cool',
            soilTemp: { min: 10, max: 18 },
            frostTolerance: 'light',
            heatTolerance: 'low'
        },
        lettuce: {
            name: 'Lettuce',
            icon: '🥬',
            optimalTemp: { min: 10, max: 20 },
            optimalHumidity: { min: 60, max: 80 },
            waterNeeds: 'medium',
            growthStages: ['germination', 'rosette', 'heading', 'harvest'],
            season: 'cool',
            soilTemp: { min: 8, max: 18 },
            frostTolerance: 'moderate',
            heatTolerance: 'very_low'
        },
        spinach: {
            name: 'Spinach',
            icon: '🥬',
            optimalTemp: { min: 8, max: 18 },
            optimalHumidity: { min: 65, max: 85 },
            waterNeeds: 'medium',
            growthStages: ['germination', 'rosette', 'mature', 'harvest'],
            season: 'cool',
            soilTemp: { min: 5, max: 15 },
            frostTolerance: 'high',
            heatTolerance: 'very_low'
        },
        cucumber: {
            name: 'Cucumber',
            icon: '🥒',
            optimalTemp: { min: 20, max: 30 },
            optimalHumidity: { min: 70, max: 85 },
            waterNeeds: 'high',
            growthStages: ['germination', 'vine_growth', 'flowering', 'fruiting'],
            season: 'warm',
            soilTemp: { min: 18, max: 25 },
            frostTolerance: 'none',
            heatTolerance: 'moderate'
        },
        carrot: {
            name: 'Carrot',
            icon: '🥕',
            optimalTemp: { min: 12, max: 22 },
            optimalHumidity: { min: 60, max: 75 },
            waterNeeds: 'medium',
            growthStages: ['germination', 'leaf_growth', 'root_development', 'maturity'],
            season: 'cool',
            soilTemp: { min: 8, max: 20 },
            frostTolerance: 'moderate',
            heatTolerance: 'low'
        },
        pepper: {
            name: 'Bell Pepper',
            icon: '🫑',
            optimalTemp: { min: 20, max: 30 },
            optimalHumidity: { min: 60, max: 75 },
            waterNeeds: 'medium',
            growthStages: ['germination', 'vegetative', 'flowering', 'fruiting'],
            season: 'warm',
            soilTemp: { min: 18, max: 26 },
            frostTolerance: 'none',
            heatTolerance: 'moderate'
        }
    }

    useEffect(() => {
        loadWeatherAndAdvice()
    }, [selectedCrop, location])

    const loadWeatherAndAdvice = async () => {
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

            const cropAdvice = generateCropAdvice(currentWeather, forecastData, crops[selectedCrop])
            setAdvice(cropAdvice)

        } catch (error) {
            console.error('Error loading crop weather advice:', error)
        } finally {
            setLoading(false)
        }
    }

    const getTemperatureBasedCropSuggestions = (currentTemp, avgTemp) => {
        const suitableCrops = []

        Object.entries(crops).forEach(([key, crop]) => {
            const tempScore = calculateTemperatureScore(avgTemp, crop.optimalTemp)
            const currentTempScore = calculateTemperatureScore(currentTemp, crop.optimalTemp)

            if (tempScore >= 0.7 && currentTempScore >= 0.5) {
                suitableCrops.push({
                    key,
                    ...crop,
                    suitabilityScore: (tempScore + currentTempScore) / 2,
                    reason: getTemperatureReason(avgTemp, crop)
                })
            }
        })

        return suitableCrops.sort((a, b) => b.suitabilityScore - a.suitabilityScore).slice(0, 3)
    }

    const calculateTemperatureScore = (temp, optimalRange) => {
        if (temp >= optimalRange.min && temp <= optimalRange.max) {
            return 1.0 // Perfect temperature
        }

        const midPoint = (optimalRange.min + optimalRange.max) / 2
        const range = optimalRange.max - optimalRange.min
        const distance = Math.abs(temp - midPoint)

        // Score decreases as temperature moves away from optimal range
        const score = Math.max(0, 1 - (distance / (range * 1.5)))
        return score
    }

    const getTemperatureReason = (temp, crop) => {
        if (temp >= crop.optimalTemp.min && temp <= crop.optimalTemp.max) {
            return `Perfect temperature range (${crop.optimalTemp.min}-${crop.optimalTemp.max}°C)`
        } else if (temp < crop.optimalTemp.min) {
            const diff = crop.optimalTemp.min - temp
            return `${diff}°C below optimal, but manageable with protection`
        } else {
            const diff = temp - crop.optimalTemp.max
            return `${diff}°C above optimal, requires cooling measures`
        }
    }

    const generateCropAdvice = (weather, forecast, crop) => {
        const advice = []

        // Temperature advice
        if (weather.temperature < crop.optimalTemp.min) {
            advice.push({
                type: 'temperature',
                severity: 'warning',
                title: 'Temperature Too Low',
                message: `Current temperature (${weather.temperature}°C) is below optimal range for ${crop.name}. Consider using row covers or greenhouse protection.`,
                action: 'Protect from cold',
                icon: 'thermometer'
            })
        } else if (weather.temperature > crop.optimalTemp.max) {
            advice.push({
                type: 'temperature',
                severity: 'warning',
                title: 'Temperature Too High',
                message: `Current temperature (${weather.temperature}°C) is above optimal range for ${crop.name}. Provide shade and increase irrigation.`,
                action: 'Provide cooling',
                icon: 'sun'
            })
        } else {
            advice.push({
                type: 'temperature',
                severity: 'good',
                title: 'Optimal Temperature',
                message: `Current temperature (${weather.temperature}°C) is perfect for ${crop.name} growth.`,
                action: 'Continue current care',
                icon: 'check-circle'
            })
        }

        // Humidity advice
        if (weather.humidity < crop.optimalHumidity.min) {
            advice.push({
                type: 'humidity',
                severity: 'info',
                title: 'Low Humidity',
                message: `Humidity (${weather.humidity}%) is below optimal. Consider misting or mulching to retain moisture.`,
                action: 'Increase humidity',
                icon: 'droplets'
            })
        } else if (weather.humidity > crop.optimalHumidity.max) {
            advice.push({
                type: 'humidity',
                severity: 'warning',
                title: 'High Humidity',
                message: `High humidity (${weather.humidity}%) may increase disease risk. Ensure good air circulation.`,
                action: 'Improve ventilation',
                icon: 'alert-circle'
            })
        }

        // Watering advice based on forecast
        const rainDays = forecast.filter(day => day.precipitation > 2).length
        const totalRain = forecast.reduce((sum, day) => sum + day.precipitation, 0)

        if (totalRain < 10 && crop.waterNeeds === 'high') {
            advice.push({
                type: 'irrigation',
                severity: 'warning',
                title: 'Irrigation Needed',
                message: `Low rainfall expected (${totalRain}mm over 5 days). ${crop.name} needs regular watering.`,
                action: 'Increase irrigation',
                icon: 'droplets'
            })
        } else if (totalRain > 50) {
            advice.push({
                type: 'drainage',
                severity: 'warning',
                title: 'Excess Water Risk',
                message: `Heavy rainfall expected (${totalRain}mm). Ensure proper drainage to prevent root rot.`,
                action: 'Check drainage',
                icon: 'alert-circle'
            })
        }

        // Temperature-based crop suggestions
        const avgTemp = forecast.reduce((sum, day) => sum + (day.temperature.min + day.temperature.max) / 2, 0) / forecast.length
        const suggestedCrops = getTemperatureBasedCropSuggestions(weather.temperature, avgTemp)

        if (suggestedCrops.length > 0 && suggestedCrops[0].key !== selectedCrop) {
            advice.push({
                type: 'crop_suggestion',
                severity: 'info',
                title: 'Alternative Crop Suggestions',
                message: `Based on current temperature (${weather.temperature}°C), consider these crops: ${suggestedCrops.map(c => c.name).join(', ')}`,
                action: 'Explore alternatives',
                icon: 'leaf',
                suggestions: suggestedCrops
            })
        }

        // Planting timing advice
        if (avgTemp >= crop.optimalTemp.min && avgTemp <= crop.optimalTemp.max) {
            advice.push({
                type: 'planting',
                severity: 'good',
                title: 'Good Planting Conditions',
                message: `Weather conditions are favorable for planting ${crop.name} this week.`,
                action: 'Consider planting',
                icon: 'leaf'
            })
        } else if (avgTemp < crop.optimalTemp.min) {
            advice.push({
                type: 'planting',
                severity: 'warning',
                title: 'Cool Weather Planting',
                message: `Temperature is ${crop.optimalTemp.min - avgTemp}°C below optimal. Consider waiting or using season extension techniques.`,
                action: 'Delay or protect',
                icon: 'thermometer'
            })
        } else {
            advice.push({
                type: 'planting',
                severity: 'warning',
                title: 'Hot Weather Planting',
                message: `Temperature is ${avgTemp - crop.optimalTemp.max}°C above optimal. Consider shade cloth or wait for cooler weather.`,
                action: 'Provide cooling',
                icon: 'sun'
            })
        }

        // Harvest timing advice
        const stormRisk = forecast.some(day => day.windSpeed > 30 || day.precipitation > 15)
        if (stormRisk) {
            advice.push({
                type: 'harvest',
                severity: 'urgent',
                title: 'Early Harvest Recommended',
                message: 'Severe weather expected. Consider harvesting mature crops early to prevent damage.',
                action: 'Harvest soon',
                icon: 'clock'
            })
        }

        return advice
    }

    const getAdviceIcon = (iconType) => {
        switch (iconType) {
            case 'thermometer': return <Thermometer className="w-5 h-5" />
            case 'sun': return <Sun className="w-5 h-5" />
            case 'droplets': return <Droplets className="w-5 h-5" />
            case 'leaf': return <Leaf className="w-5 h-5" />
            case 'clock': return <Clock className="w-5 h-5" />
            case 'check-circle': return <CheckCircle className="w-5 h-5" />
            case 'alert-circle': return <AlertCircle className="w-5 h-5" />
            default: return <TrendingUp className="w-5 h-5" />
        }
    }

    const getSeverityStyle = (severity) => {
        switch (severity) {
            case 'urgent': return 'border-red-300 bg-red-50 text-red-800'
            case 'warning': return 'border-yellow-300 bg-yellow-50 text-yellow-800'
            case 'info': return 'border-blue-300 bg-blue-50 text-blue-800'
            case 'good': return 'border-green-300 bg-green-50 text-green-800'
            default: return 'border-gray-300 bg-gray-50 text-gray-800'
        }
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    const currentCrop = crops[selectedCrop]

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
                <div className="flex items-center space-x-3">
                    <span className="text-3xl">{currentCrop.icon}</span>
                    <div>
                        <h2 className="text-xl font-semibold">{currentCrop.name} Weather Advice</h2>
                        <p className="text-green-100 text-sm">
                            Personalized recommendations based on current conditions
                        </p>
                    </div>
                </div>
            </div>

            {/* Crop Selection */}
            <div className="p-4 border-b bg-gray-50">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Crop:
                </label>
                <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                    {Object.entries(crops).map(([key, crop]) => (
                        <option key={key} value={key}>
                            {crop.icon} {crop.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Current Conditions Summary */}
            <div className="p-6 border-b">
                <h3 className="font-semibold text-gray-900 mb-3">Current Conditions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{weather.temperature}°C</div>
                        <div className="text-sm text-gray-600">Temperature</div>
                        <div className="text-xs text-gray-500">
                            Optimal: {currentCrop.optimalTemp.min}-{currentCrop.optimalTemp.max}°C
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{weather.humidity}%</div>
                        <div className="text-sm text-gray-600">Humidity</div>
                        <div className="text-xs text-gray-500">
                            Optimal: {currentCrop.optimalHumidity.min}-{currentCrop.optimalHumidity.max}%
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{weather.precipitation}mm</div>
                        <div className="text-sm text-gray-600">Rain Today</div>
                        <div className="text-xs text-gray-500">
                            Water needs: {currentCrop.waterNeeds}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{weather.windSpeed}</div>
                        <div className="text-sm text-gray-600">Wind (km/h)</div>
                        <div className="text-xs text-gray-500">
                            Current conditions
                        </div>
                    </div>
                </div>
            </div>

            {/* Temperature-Based Crop Suggestions */}
            {weather && (
                <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-green-50">
                    <h3 className="font-semibold text-gray-900 mb-4">🌡️ Smart Crop Suggestions</h3>
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-3">
                            Based on current temperature ({weather.temperature}°C) and 5-day forecast, here are the most suitable crops:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {(() => {
                                const avgTemp = forecast.reduce((sum, day) => sum + (day.temperature.min + day.temperature.max) / 2, 0) / forecast.length
                                const suggestions = getTemperatureBasedCropSuggestions(weather.temperature, avgTemp)
                                return suggestions.map((crop, index) => (
                                    <div key={crop.key} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <span className="text-2xl">{crop.icon}</span>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">{crop.name}</h4>
                                                <div className="flex items-center space-x-1">
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-3 h-3 ${i < Math.round(crop.suitabilityScore * 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-gray-500">
                                                        {Math.round(crop.suitabilityScore * 100)}% match
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-600 mb-2">{crop.reason}</p>
                                        <div className="text-xs text-gray-500 mb-2">
                                            <div>Optimal: {crop.optimalTemp.min}-{crop.optimalTemp.max}°C</div>
                                            <div>Season: {crop.season} weather crop</div>
                                            <div>Water needs: {crop.waterNeeds}</div>
                                        </div>
                                        <button
                                            onClick={() => setSelectedCrop(crop.key)}
                                            className="w-full bg-green-100 text-green-700 py-1 px-2 rounded text-xs hover:bg-green-200 transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                ))
                            })()}
                        </div>
                    </div>
                </div>
            )}

            {/* Advice Cards */}
            <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Recommendations</h3>
                <div className="space-y-4">
                    {advice.map((item, index) => (
                        <div key={index} className={`border rounded-lg p-4 ${getSeverityStyle(item.severity)}`}>
                            <div className="flex items-start space-x-3">
                                <div className={`p-2 rounded-full ${item.severity === 'urgent' ? 'bg-red-100' :
                                    item.severity === 'warning' ? 'bg-yellow-100' :
                                        item.severity === 'info' ? 'bg-blue-100' :
                                            'bg-green-100'
                                    }`}>
                                    {getAdviceIcon(item.icon)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold">{item.title}</h4>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.severity === 'urgent' ? 'bg-red-200 text-red-800' :
                                            item.severity === 'warning' ? 'bg-yellow-200 text-yellow-800' :
                                                item.severity === 'info' ? 'bg-blue-200 text-blue-800' :
                                                    'bg-green-200 text-green-800'
                                            }`}>
                                            {item.action}
                                        </span>
                                    </div>
                                    <p className="text-sm">{item.message}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CropWeatherAdvice
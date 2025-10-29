import { useState, useEffect } from 'react'
import {
    Cloud,
    Sun,
    CloudRain,
    Wind,
    Droplets,
    Thermometer,
    Eye,
    Gauge,
    AlertTriangle,
    TrendingUp,
    Calendar,
    MapPin
} from 'lucide-react'
import weatherService from '../../services/weatherService'

const WeatherWidget = ({ location, compact = false }) => {
    const [weather, setWeather] = useState(null)
    const [forecast, setForecast] = useState([])
    const [recommendations, setRecommendations] = useState([])
    const [alerts, setAlerts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadWeatherData()
        // Refresh every 10 minutes
        const interval = setInterval(loadWeatherData, 10 * 60 * 1000)
        return () => clearInterval(interval)
    }, [location])

    const loadWeatherData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Use provided location or default coordinates
            const lat = location?.lat || 13.0827 // Chennai default
            const lon = location?.lon || 80.2707

            const [currentWeather, forecastData] = await Promise.all([
                weatherService.getCurrentWeather(lat, lon),
                weatherService.getForecast(lat, lon)
            ])

            setWeather(currentWeather)
            setForecast(forecastData)

            // Generate recommendations
            const { recommendations: recs, alerts: weatherAlerts } =
                weatherService.generateFarmingRecommendations(currentWeather, forecastData)

            setRecommendations(recs)
            setAlerts(weatherAlerts)

        } catch (err) {
            setError('Failed to load weather data')
            console.error('Weather loading error:', err)
        } finally {
            setLoading(false)
        }
    }

    const getWeatherIcon = (condition) => {
        switch (condition) {
            case 'sunny': return <Sun className="w-8 h-8 text-yellow-500" />
            case 'cloudy': return <Cloud className="w-8 h-8 text-gray-500" />
            case 'rainy': return <CloudRain className="w-8 h-8 text-blue-500" />
            case 'partly_cloudy': return <Sun className="w-8 h-8 text-orange-500" />
            default: return <Sun className="w-8 h-8 text-yellow-500" />
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span className="text-red-700">{error}</span>
                </div>
                <button
                    onClick={loadWeatherData}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
                >
                    Try again
                </button>
            </div>
        )
    }

    if (compact) {
        return (
            <div className="bg-white rounded-lg shadow-sm border p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {getWeatherIcon(weather.condition)}
                        <div>
                            <div className="font-semibold text-lg">{weather.temperature}°C</div>
                            <div className="text-sm text-gray-600">{weather.location}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-gray-600">Humidity</div>
                        <div className="font-medium">{weather.humidity}%</div>
                    </div>
                </div>

                {alerts.length > 0 && (
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                            <span className="text-sm text-yellow-800">{alerts[0].message}</span>
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm opacity-90">{weather.location}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            {getWeatherIcon(weather.condition)}
                            <div>
                                <div className="text-3xl font-bold">{weather.temperature}°C</div>
                                <div className="text-sm opacity-90 capitalize">
                                    {weather.condition.replace('_', ' ')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={loadWeatherData}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        title="Refresh weather data"
                    >
                        <TrendingUp className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Weather Details */}
            <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                        <Droplets className="w-5 h-5 text-blue-500" />
                        <div>
                            <div className="text-sm text-gray-600">Humidity</div>
                            <div className="font-semibold">{weather.humidity}%</div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Wind className="w-5 h-5 text-gray-500" />
                        <div>
                            <div className="text-sm text-gray-600">Wind</div>
                            <div className="font-semibold">{weather.windSpeed} km/h</div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <CloudRain className="w-5 h-5 text-blue-500" />
                        <div>
                            <div className="text-sm text-gray-600">Rain</div>
                            <div className="font-semibold">{weather.precipitation} mm</div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Gauge className="w-5 h-5 text-purple-500" />
                        <div>
                            <div className="text-sm text-gray-600">Pressure</div>
                            <div className="font-semibold">{weather.pressure} hPa</div>
                        </div>
                    </div>
                </div>

                {/* Alerts */}
                {alerts.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            <span>Weather Alerts</span>
                        </h3>
                        <div className="space-y-2">
                            {alerts.map((alert, index) => (
                                <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-start space-x-2">
                                        <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                                        <div>
                                            <div className="font-medium text-red-800 capitalize">
                                                {alert.type.replace('_', ' ')}
                                            </div>
                                            <div className="text-sm text-red-700">{alert.message}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recommendations */}
                {recommendations.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Farming Recommendations</h3>
                        <div className="space-y-2">
                            {recommendations.map((rec, index) => (
                                <div key={index} className={`p-3 rounded-lg border ${rec.priority === 'high' ? 'bg-orange-50 border-orange-200' :
                                        rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                                            'bg-green-50 border-green-200'
                                    }`}>
                                    <div className="flex items-start space-x-2">
                                        <span className="text-lg">{rec.icon}</span>
                                        <div>
                                            <div className={`font-medium capitalize ${rec.priority === 'high' ? 'text-orange-800' :
                                                    rec.priority === 'medium' ? 'text-yellow-800' :
                                                        'text-green-800'
                                                }`}>
                                                {rec.type.replace('_', ' ')}
                                            </div>
                                            <div className={`text-sm ${rec.priority === 'high' ? 'text-orange-700' :
                                                    rec.priority === 'medium' ? 'text-yellow-700' :
                                                        'text-green-700'
                                                }`}>
                                                {rec.message}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5-Day Forecast */}
                <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                        <Calendar className="w-5 h-5" />
                        <span>5-Day Forecast</span>
                    </h3>
                    <div className="grid grid-cols-5 gap-2">
                        {forecast.map((day, index) => (
                            <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                                <div className="text-xs text-gray-600 mb-1">
                                    {formatDate(day.date)}
                                </div>
                                <div className="mb-2">
                                    {getWeatherIcon(day.condition)}
                                </div>
                                <div className="text-sm font-medium">
                                    {day.temperature.max}°/{day.temperature.min}°
                                </div>
                                {day.precipitation > 0 && (
                                    <div className="text-xs text-blue-600 mt-1">
                                        {day.precipitation}mm
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WeatherWidget
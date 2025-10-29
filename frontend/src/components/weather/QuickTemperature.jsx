import { useState, useEffect } from 'react'
import { Thermometer, MapPin, RefreshCw, Loader } from 'lucide-react'
import weatherService from '../../services/weatherService'

const QuickTemperature = () => {
    const [temperature, setTemperature] = useState(null)
    const [location, setLocation] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    // Get current location temperature
    const getCurrentTemperature = async () => {
        setIsLoading(true)
        setError('')

        try {
            // Get GPS location quickly
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    {
                        enableHighAccuracy: false, // Use network location for speed
                        timeout: 5000,
                        maximumAge: 300000 // 5 minutes cache
                    }
                )
            })

            const { latitude, longitude } = position.coords

            // Get weather data
            const weather = await weatherService.getCurrentWeather(latitude, longitude)

            setTemperature(weather.temperature)
            setLocation({
                name: weather.location,
                lat: latitude,
                lng: longitude
            })

        } catch (err) {
            console.error('Quick temperature error:', err)

            // Fallback to default location
            try {
                const defaultWeather = await weatherService.getCurrentWeather(13.0827, 80.2707) // Chennai
                setTemperature(defaultWeather.temperature)
                setLocation({ name: 'Default Location', lat: 13.0827, lng: 80.2707 })
            } catch (fallbackErr) {
                setError('Unable to get temperature')
                setTemperature(25) // Fallback temperature
                setLocation({ name: 'Unknown Location' })
            }
        } finally {
            setIsLoading(false)
        }
    }

    // Auto-load on mount
    useEffect(() => {
        getCurrentTemperature()
    }, [])

    // Get temperature color based on value
    const getTemperatureColor = (temp) => {
        if (temp < 10) return 'text-blue-600'
        if (temp < 20) return 'text-green-600'
        if (temp < 30) return 'text-yellow-600'
        if (temp < 40) return 'text-orange-600'
        return 'text-red-600'
    }

    // Get temperature background color
    const getTemperatureBackground = (temp) => {
        if (temp < 10) return 'bg-blue-50 border-blue-200'
        if (temp < 20) return 'bg-green-50 border-green-200'
        if (temp < 30) return 'bg-yellow-50 border-yellow-200'
        if (temp < 40) return 'bg-orange-50 border-orange-200'
        return 'bg-red-50 border-red-200'
    }

    return (
        <div className={`rounded-lg border p-4 ${temperature ? getTemperatureBackground(temperature) : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm">
                        <Thermometer className={`w-6 h-6 ${temperature ? getTemperatureColor(temperature) : 'text-gray-400'}`} />
                    </div>

                    <div>
                        {isLoading ? (
                            <div className="flex items-center space-x-2">
                                <Loader className="w-5 h-5 animate-spin text-gray-500" />
                                <span className="text-gray-600">Getting temperature...</span>
                            </div>
                        ) : error ? (
                            <div>
                                <p className="text-red-600 font-medium">{error}</p>
                                <p className="text-xs text-red-500">Please try again</p>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-baseline space-x-1">
                                    <span className={`text-3xl font-bold ${getTemperatureColor(temperature)}`}>
                                        {temperature}°
                                    </span>
                                    <span className="text-lg text-gray-600">C</span>
                                </div>
                                {location && (
                                    <div className="flex items-center space-x-1 mt-1">
                                        <MapPin className="w-3 h-3 text-gray-500" />
                                        <span className="text-xs text-gray-600 truncate max-w-32">
                                            {location.name}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={getCurrentTemperature}
                    disabled={isLoading}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-full transition-colors disabled:opacity-50"
                    title="Refresh temperature"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* Temperature description */}
            {temperature && !isLoading && (
                <div className="mt-2 text-xs text-gray-600">
                    {temperature < 10 && "❄️ Very cold - protect crops from frost"}
                    {temperature >= 10 && temperature < 20 && "🌤️ Cool - good for cool-season crops"}
                    {temperature >= 20 && temperature < 30 && "☀️ Warm - ideal growing conditions"}
                    {temperature >= 30 && temperature < 40 && "🌡️ Hot - ensure adequate irrigation"}
                    {temperature >= 40 && "🔥 Very hot - provide shade and extra water"}
                </div>
            )}
        </div>
    )
}

export default QuickTemperature
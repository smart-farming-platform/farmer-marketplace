import { useState, useEffect, useCallback } from 'react'
import { MapPin, Navigation, RefreshCw, Loader, AlertTriangle, CheckCircle, Cloud, Sun, CloudRain } from 'lucide-react'
import weatherService from '../../services/weatherService'

const GPSWeatherWidget = () => {
    const [location, setLocation] = useState(null)
    const [weather, setWeather] = useState(null)
    const [forecast, setForecast] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [lastUpdate, setLastUpdate] = useState(null)
    const [autoRefresh, setAutoRefresh] = useState(true)

    // Get current location and weather
    const getCurrentLocationWeather = useCallback(async () => {
        setIsLoading(true)
        setError('')

        try {
            // Get GPS location with faster timeout for immediate response
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    {
                        enableHighAccuracy: true,
                        timeout: 8000, // Reduced timeout for faster response
                        maximumAge: 60000 // 1 minute cache
                    }
                )
            })

            const { latitude, longitude } = position.coords
            const newLocation = {
                latitude,
                longitude,
                accuracy: position.coords.accuracy
            }

            setLocation(newLocation)

            // Get weather data for this location
            const [currentWeather, weatherForecast] = await Promise.all([
                weatherService.getCurrentWeather(latitude, longitude),
                weatherService.getForecast(latitude, longitude)
            ])

            setWeather(currentWeather)
            setForecast(weatherForecast)
            setLastUpdate(new Date())

        } catch (err) {
            console.error('Location/Weather error:', err)
            if (err.code === 1) {
                setError('Location access denied. Trying network location...')
                await getNetworkLocationWeather()
            } else if (err.code === 2) {
                setError('GPS unavailable. Using network location...')
                await getNetworkLocationWeather()
            } else if (err.code === 3) {
                setError('Location timeout. Trying network location...')
                await getNetworkLocationWeather()
            } else {
                setError('Failed to get location. Using default location.')
                await getDefaultLocationWeather()
            }
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Fallback to default location weather
    const getDefaultLocationWeather = async () => {
        const defaultLocation = { latitude: 13.0827, longitude: 80.2707 } // Chennai
        setLocation(defaultLocation)

        const [currentWeather, weatherForecast] = await Promise.all([
            weatherService.getCurrentWeather(defaultLocation.latitude, defaultLocation.longitude),
            weatherService.getForecast(defaultLocation.latitude, defaultLocation.longitude)
        ])

        setWeather(currentWeather)
        setForecast(weatherForecast)
        setLastUpdate(new Date())
    }

    // Try network-based location
    const getNetworkLocationWeather = async () => {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    {
                        enableHighAccuracy: false,
                        timeout: 15000,
                        maximumAge: 600000 // 10 minutes
                    }
                )
            })

            const { latitude, longitude } = position.coords
            setLocation({ latitude, longitude, accuracy: position.coords.accuracy })

            const [currentWeather, weatherForecast] = await Promise.all([
                weatherService.getCurrentWeather(latitude, longitude),
                weatherService.getForecast(latitude, longitude)
            ])

            setWeather(currentWeather)
            setForecast(weatherForecast)
            setLastUpdate(new Date())

        } catch (err) {
            await getDefaultLocationWeather()
        }
    }

    // Auto-load weather on component mount
    useEffect(() => {
        getCurrentLocationWeather()
    }, [getCurrentLocationWeather])

    // Auto-refresh weather data
    useEffect(() => {
        if (autoRefresh && location) {
            const interval = setInterval(async () => {
                try {
                    const [currentWeather, weatherForecast] = await Promise.all([
                        weatherService.getCurrentWeather(location.latitude, location.longitude),
                        weatherService.getForecast(location.latitude, location.longitude)
                    ])
                    setWeather(currentWeather)
                    setForecast(weatherForecast)
                    setLastUpdate(new Date())
                } catch (err) {
                    console.error('Auto-refresh error:', err)
                }
            }, 10 * 60 * 1000) // Refresh every 10 minutes

            return () => clearInterval(interval)
        }
    }, [autoRefresh, location])

    // Get weather icon component
    const getWeatherIcon = (condition, size = 'w-8 h-8') => {
        switch (condition) {
            case 'sunny':
                return <Sun className={`${size} text-yellow-500`} />
            case 'cloudy':
                return <Cloud className={`${size} text-gray-500`} />
            case 'rainy':
                return <CloudRain className={`${size} text-blue-500`} />
            case 'partly_cloudy':
                return <Cloud className={`${size} text-orange-400`} />
            default:
                return <Sun className={`${size} text-yellow-500`} />
        }
    }

    // Get weather condition color
    const getConditionColor = (condition) => {
        switch (condition) {
            case 'sunny':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800'
            case 'cloudy':
                return 'bg-gray-50 border-gray-200 text-gray-800'
            case 'rainy':
                return 'bg-blue-50 border-blue-200 text-blue-800'
            case 'partly_cloudy':
                return 'bg-orange-50 border-orange-200 text-orange-800'
            default:
                return 'bg-yellow-50 border-yellow-200 text-yellow-800'
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <Navigation className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">GPS Weather</h2>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={getCurrentLocationWeather}
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center space-x-2"
                    >
                        {isLoading ? (
                            <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                            <RefreshCw className="w-4 h-4" />
                        )}
                        <span>{isLoading ? 'Loading...' : 'Update'}</span>
                    </button>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                </div>
            )}

            {/* Location Info */}
            {location && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="text-green-800 font-medium">Location Found</p>
                                <p className="text-green-700 text-sm font-mono">
                                    {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                                </p>
                            </div>
                        </div>
                        {location.accuracy && (
                            <span className="text-green-600 text-sm">
                                ±{Math.round(location.accuracy)}m
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Current Weather */}
            {weather && (
                <div className={`mb-6 p-4 rounded-lg border ${getConditionColor(weather.condition)}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            {getWeatherIcon(weather.condition, 'w-12 h-12')}
                            <div>
                                <h3 className="text-2xl font-bold">{weather.temperature}°C</h3>
                                <p className="text-sm capitalize">{weather.condition.replace('_', ' ')}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-medium">{weather.location}</p>
                            {lastUpdate && (
                                <p className="text-xs opacity-75">
                                    Updated: {lastUpdate.toLocaleTimeString()}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Weather Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <p className="text-xs opacity-75">Humidity</p>
                            <p className="font-semibold">{weather.humidity}%</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs opacity-75">Wind</p>
                            <p className="font-semibold">{weather.windSpeed} km/h</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs opacity-75">Pressure</p>
                            <p className="font-semibold">{weather.pressure} hPa</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs opacity-75">UV Index</p>
                            <p className="font-semibold">{weather.uvIndex}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* 5-Day Forecast */}
            {forecast && (
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">5-Day Forecast</h3>
                    <div className="grid grid-cols-5 gap-2">
                        {forecast.map((day, index) => (
                            <div key={day.date} className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-600 mb-1">
                                    {index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}
                                </p>
                                <div className="flex justify-center mb-2">
                                    {getWeatherIcon(day.condition, 'w-6 h-6')}
                                </div>
                                <p className="text-sm font-semibold text-gray-900">
                                    {day.temperature.max}°
                                </p>
                                <p className="text-xs text-gray-600">
                                    {day.temperature.min}°
                                </p>
                                {day.precipitation > 0 && (
                                    <p className="text-xs text-blue-600 mt-1">
                                        {day.precipitation}mm
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Farming Recommendations */}
            {weather && forecast && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Farming Recommendations</h3>
                    <div className="space-y-2">
                        {weatherService.generateFarmingRecommendations(weather, forecast).recommendations.map((rec, index) => (
                            <div key={index} className={`p-3 rounded-lg border ${rec.priority === 'high' ? 'bg-red-50 border-red-200' :
                                rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                                    'bg-green-50 border-green-200'
                                }`}>
                                <div className="flex items-center space-x-2">
                                    <span className="text-lg">{rec.icon}</span>
                                    <p className={`text-sm ${rec.priority === 'high' ? 'text-red-800' :
                                        rec.priority === 'medium' ? 'text-yellow-800' :
                                            'text-green-800'
                                        }`}>
                                        {rec.message}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Auto-refresh Toggle */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="autoRefresh"
                        checked={autoRefresh}
                        onChange={(e) => setAutoRefresh(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="autoRefresh" className="text-sm text-gray-700">
                        Auto-refresh every 10 minutes
                    </label>
                </div>

                {!weather && !isLoading && (
                    <button
                        onClick={getCurrentLocationWeather}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                    >
                        <MapPin className="w-4 h-4" />
                        <span>Get Weather</span>
                    </button>
                )}
            </div>
        </div>
    )
}

export default GPSWeatherWidget
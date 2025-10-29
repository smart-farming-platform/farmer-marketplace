import { useState } from 'react'
import { MapPin, Navigation } from 'lucide-react'
import WeatherWidget from '../components/weather/WeatherWidget'
import WeatherAlerts from '../components/weather/WeatherAlerts'
import CropWeatherAdvice from '../components/weather/CropWeatherAdvice'
import GPSWeatherWidget from '../components/weather/GPSWeatherWidget'
import QuickTemperature from '../components/weather/QuickTemperature'
import TemperatureCropPlanner from '../components/weather/TemperatureCropPlanner'

const Weather = () => {
    const [selectedLocation, setSelectedLocation] = useState({
        name: 'Chennai, Tamil Nadu',
        lat: 13.0827,
        lon: 80.2707
    })
    const [selectedCrop, setSelectedCrop] = useState('tomato')
    const [weatherMode, setWeatherMode] = useState('gps') // 'gps' or 'manual'

    const locations = [
        { name: 'Chennai, Tamil Nadu', lat: 13.0827, lon: 80.2707 },
        { name: 'Bangalore, Karnataka', lat: 12.9716, lon: 77.5946 },
        { name: 'Coimbatore, Tamil Nadu', lat: 11.0168, lon: 76.9558 },
        { name: 'Salem, Tamil Nadu', lat: 11.6643, lon: 78.1460 },
        { name: 'Madurai, Tamil Nadu', lat: 9.9252, lon: 78.1198 }
    ]

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header with Quick Temperature */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Smart Weather</h1>
                            <p className="mt-2 text-gray-600">
                                GPS-enabled weather monitoring and farming recommendations
                            </p>
                        </div>

                        {/* Quick Temperature Display */}
                        <div className="hidden md:block">
                            <QuickTemperature />
                        </div>
                    </div>

                    {/* Mobile Quick Temperature */}
                    <div className="md:hidden mt-4">
                        <QuickTemperature />
                    </div>

                    {/* Weather Mode Toggle */}
                    <div className="flex items-center justify-center mt-6">
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setWeatherMode('gps')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${weatherMode === 'gps'
                                    ? 'bg-white text-blue-700 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <Navigation className="w-4 h-4" />
                                <span>GPS Weather</span>
                            </button>
                            <button
                                onClick={() => setWeatherMode('manual')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${weatherMode === 'manual'
                                    ? 'bg-white text-green-700 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <MapPin className="w-4 h-4" />
                                <span>Manual Location</span>
                            </button>
                        </div>

                        {/* Manual Location Selector */}
                        {weatherMode === 'manual' && (
                            <div className="flex items-center space-x-2 ml-4">
                                <select
                                    value={`${selectedLocation.lat},${selectedLocation.lon}`}
                                    onChange={(e) => {
                                        const [lat, lon] = e.target.value.split(',')
                                        const location = locations.find(
                                            loc => loc.lat === parseFloat(lat) && loc.lon === parseFloat(lon)
                                        )
                                        setSelectedLocation(location)
                                    }}
                                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    {locations.map((location) => (
                                        <option
                                            key={`${location.lat},${location.lon}`}
                                            value={`${location.lat},${location.lon}`}
                                        >
                                            {location.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Weather Overview */}
                {weatherMode === 'gps' ? (
                    <div className="mb-8">
                        <GPSWeatherWidget />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="lg:col-span-2">
                            <WeatherWidget location={selectedLocation} />
                        </div>
                        <div>
                            <WeatherAlerts location={selectedLocation} />
                        </div>
                    </div>
                )}

                {/* Temperature-Based Crop Planner */}
                <div className="mb-8">
                    <TemperatureCropPlanner location={selectedLocation} />
                </div>

                {/* Crop-Specific Weather Advice */}
                <div className="mb-8">
                    <CropWeatherAdvice
                        selectedCrop={selectedCrop}
                        location={selectedLocation}
                    />
                </div>

                {/* Weather Features Info */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Smart Weather Features
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="text-center p-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">🌡️</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Real-time Monitoring</h3>
                            <p className="text-sm text-gray-600">
                                Get current temperature, humidity, and weather conditions for your farm location
                            </p>
                        </div>

                        <div className="text-center p-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">🌱</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Crop-Specific Advice</h3>
                            <p className="text-sm text-gray-600">
                                Personalized recommendations based on your crops and current weather conditions
                            </p>
                        </div>

                        <div className="text-center p-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">⚠️</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Weather Alerts</h3>
                            <p className="text-sm text-gray-600">
                                Early warnings for extreme weather that could affect your crops
                            </p>
                        </div>

                        <div className="text-center p-4">
                            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">📅</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">5-Day Forecast</h3>
                            <p className="text-sm text-gray-600">
                                Plan your farming activities with accurate weather predictions
                            </p>
                        </div>

                        <div className="text-center p-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">💧</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Irrigation Guidance</h3>
                            <p className="text-sm text-gray-600">
                                Smart watering recommendations based on rainfall and soil conditions
                            </p>
                        </div>

                        <div className="text-center p-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-2xl">🚜</span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Optimal Timing</h3>
                            <p className="text-sm text-gray-600">
                                Know the best times for planting, harvesting, and field operations
                            </p>
                        </div>
                    </div>
                </div>

                {/* Weather Data Sources */}
                <div className="mt-8 bg-gray-100 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Weather Data Sources</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                            <h4 className="font-medium text-gray-800 mb-2">Current Implementation:</h4>
                            <ul className="space-y-1">
                                <li>• Mock weather data for demonstration</li>
                                <li>• Simulated forecasts and alerts</li>
                                <li>• Location-based recommendations</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-800 mb-2">Production Ready:</h4>
                            <ul className="space-y-1">
                                <li>• OpenWeatherMap API integration</li>
                                <li>• Satellite imagery data</li>
                                <li>• Government meteorological services</li>
                                <li>• IoT sensor networks</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Weather
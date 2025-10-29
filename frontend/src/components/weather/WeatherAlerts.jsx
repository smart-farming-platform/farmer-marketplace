import { useState, useEffect } from 'react'
import {
    AlertTriangle,
    Bell,
    X,
    Cloud,
    CloudRain,
    Wind,
    Thermometer,
    Sun,
    Snowflake
} from 'lucide-react'
import weatherService from '../../services/weatherService'

const WeatherAlerts = ({ location, onClose }) => {
    const [alerts, setAlerts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadAlerts()
        // Check for new alerts every 30 minutes
        const interval = setInterval(loadAlerts, 30 * 60 * 1000)
        return () => clearInterval(interval)
    }, [location])

    const loadAlerts = async () => {
        try {
            setLoading(true)
            const lat = location?.lat || 13.0827
            const lon = location?.lon || 80.2707

            const [weather, forecast] = await Promise.all([
                weatherService.getCurrentWeather(lat, lon),
                weatherService.getForecast(lat, lon)
            ])

            const { alerts: weatherAlerts } = weatherService.generateFarmingRecommendations(weather, forecast)

            // Add some additional demo alerts
            const additionalAlerts = generateDemoAlerts(weather, forecast)
            setAlerts([...weatherAlerts, ...additionalAlerts])

        } catch (error) {
            console.error('Error loading weather alerts:', error)
        } finally {
            setLoading(false)
        }
    }

    const generateDemoAlerts = (weather, forecast) => {
        const alerts = []

        // Frost warning
        const coldDays = forecast.filter(day => day.temperature.min < 5)
        if (coldDays.length > 0) {
            alerts.push({
                id: 'frost_warning',
                type: 'frost_warning',
                severity: 'high',
                title: 'Frost Warning',
                message: 'Temperatures may drop below 5°C. Protect sensitive crops.',
                icon: 'snowflake',
                timestamp: new Date().toISOString(),
                validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            })
        }

        // Drought conditions
        const dryDays = forecast.filter(day => day.precipitation < 1).length
        if (dryDays >= 4) {
            alerts.push({
                id: 'drought_warning',
                type: 'drought_warning',
                severity: 'medium',
                title: 'Dry Conditions',
                message: 'No significant rainfall expected for 4+ days. Plan irrigation.',
                icon: 'sun',
                timestamp: new Date().toISOString(),
                validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
            })
        }

        // Heavy rain warning
        const heavyRainDays = forecast.filter(day => day.precipitation > 10)
        if (heavyRainDays.length >= 2) {
            alerts.push({
                id: 'heavy_rain_warning',
                type: 'heavy_rain_warning',
                severity: 'high',
                title: 'Heavy Rain Expected',
                message: 'Heavy rainfall may cause waterlogging. Ensure proper drainage.',
                icon: 'cloud-rain',
                timestamp: new Date().toISOString(),
                validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
            })
        }

        return alerts
    }

    const getAlertIcon = (iconType) => {
        switch (iconType) {
            case 'snowflake': return <Snowflake className="w-5 h-5" />
            case 'sun': return <Sun className="w-5 h-5" />
            case 'cloud-rain': return <CloudRain className="w-5 h-5" />
            case 'wind': return <Wind className="w-5 h-5" />
            case 'thermometer': return <Thermometer className="w-5 h-5" />
            default: return <AlertTriangle className="w-5 h-5" />
        }
    }

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'high': return 'border-red-300 bg-red-50 text-red-800'
            case 'medium': return 'border-yellow-300 bg-yellow-50 text-yellow-800'
            case 'low': return 'border-blue-300 bg-blue-50 text-blue-800'
            default: return 'border-gray-300 bg-gray-50 text-gray-800'
        }
    }

    const dismissAlert = (alertId) => {
        setAlerts(alerts.filter(alert => alert.id !== alertId))
    }

    const formatTimeAgo = (timestamp) => {
        const now = new Date()
        const alertTime = new Date(timestamp)
        const diffMinutes = Math.floor((now - alertTime) / (1000 * 60))

        if (diffMinutes < 60) {
            return `${diffMinutes} minutes ago`
        } else if (diffMinutes < 1440) {
            return `${Math.floor(diffMinutes / 60)} hours ago`
        } else {
            return `${Math.floor(diffMinutes / 1440)} days ago`
        }
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-16 bg-gray-200 rounded"></div>
                        <div className="h-16 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Bell className="w-5 h-5" />
                        <h2 className="text-lg font-semibold">Weather Alerts</h2>
                        {alerts.length > 0 && (
                            <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                                {alerts.length}
                            </span>
                        )}
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-white/10 rounded"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Alerts List */}
            <div className="p-4">
                {alerts.length === 0 ? (
                    <div className="text-center py-8">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No active weather alerts</p>
                        <p className="text-sm text-gray-400 mt-1">
                            We'll notify you of any weather conditions that may affect your crops
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {alerts.map((alert) => (
                            <div
                                key={alert.id}
                                className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3">
                                        <div className={`p-2 rounded-full ${alert.severity === 'high' ? 'bg-red-100' :
                                                alert.severity === 'medium' ? 'bg-yellow-100' :
                                                    'bg-blue-100'
                                            }`}>
                                            {getAlertIcon(alert.icon)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <h3 className="font-semibold">{alert.title}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${alert.severity === 'high' ? 'bg-red-200 text-red-800' :
                                                        alert.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                                            'bg-blue-200 text-blue-800'
                                                    }`}>
                                                    {alert.severity.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-sm mb-2">{alert.message}</p>
                                            <div className="flex items-center justify-between text-xs opacity-75">
                                                <span>{formatTimeAgo(alert.timestamp)}</span>
                                                {alert.validUntil && (
                                                    <span>
                                                        Valid until {new Date(alert.validUntil).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => dismissAlert(alert.id)}
                                        className="p-1 hover:bg-black/10 rounded"
                                        title="Dismiss alert"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 border-t">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Last updated: {new Date().toLocaleTimeString()}</span>
                    <button
                        onClick={loadAlerts}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Refresh
                    </button>
                </div>
            </div>
        </div>
    )
}

export default WeatherAlerts
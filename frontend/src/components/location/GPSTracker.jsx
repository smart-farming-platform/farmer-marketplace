import { useState, useEffect, useCallback } from 'react'
import { MapPin, Navigation, Target, Compass, Clock, AlertCircle, RefreshCw, Share2, Download, CheckCircle, Loader, Map, ExternalLink } from 'lucide-react'

const GPSTracker = () => {
    const [location, setLocation] = useState(null)
    const [isTracking, setIsTracking] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [accuracy, setAccuracy] = useState(null)
    const [heading, setHeading] = useState(null)
    const [speed, setSpeed] = useState(null)
    const [lastUpdate, setLastUpdate] = useState(null)
    const [trackingHistory, setTrackingHistory] = useState([])
    const [watchId, setWatchId] = useState(null)
    const [permissionStatus, setPermissionStatus] = useState('unknown')
    const [mapView, setMapView] = useState('hybrid') // 'roadmap', 'satellite', 'hybrid', 'terrain'

    // Check geolocation support and permissions
    useEffect(() => {
        const checkGeolocationSupport = async () => {
            if (!navigator.geolocation) {
                setError('❌ Geolocation is not supported by this browser.')
                return
            }

            // Check permission status
            try {
                if (navigator.permissions) {
                    const permission = await navigator.permissions.query({ name: 'geolocation' })
                    setPermissionStatus(permission.state)

                    permission.addEventListener('change', () => {
                        setPermissionStatus(permission.state)
                    })
                }
            } catch (err) {
                console.log('Permission API not supported')
            }
        }

        checkGeolocationSupport()

        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId)
            }
        }
    }, [watchId])

    // Clear messages after 5 seconds
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(''), 5000)
            return () => clearTimeout(timer)
        }
    }, [success])

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 10000)
            return () => clearTimeout(timer)
        }
    }, [error])

    const startTracking = useCallback(() => {
        if (!navigator.geolocation) {
            setError('❌ Geolocation is not supported by this browser')
            return
        }

        setIsTracking(true)
        setError('')
        setSuccess('')
        setIsLoading(true)

        // Try with high accuracy first, then fallback to lower accuracy
        const highAccuracyOptions = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000 // Allow cached position up to 1 minute
        }

        const lowAccuracyOptions = {
            enableHighAccuracy: false,
            timeout: 30000,
            maximumAge: 300000 // Allow cached position up to 5 minutes
        }

        // Function to handle successful location
        const handleSuccess = (position) => {
            setIsLoading(false)
            const newLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                timestamp: new Date(),
                accuracy: position.coords.accuracy
            }

            setLocation(newLocation)
            setAccuracy(position.coords.accuracy)
            setHeading(position.coords.heading)
            setSpeed(position.coords.speed)
            setLastUpdate(new Date())
            setSuccess('✅ Location tracking active!')

            // Add to tracking history (avoid duplicates)
            setTrackingHistory(prev => {
                const lastLocation = prev[0]
                if (!lastLocation ||
                    Math.abs(lastLocation.latitude - newLocation.latitude) > 0.00001 ||
                    Math.abs(lastLocation.longitude - newLocation.longitude) > 0.00001) {
                    return [newLocation, ...prev.slice(0, 99)] // Keep last 100 locations
                }
                return prev
            })
        }

        // Function to handle location errors with fallback
        const handleError = (error) => {
            console.error('GPS Error:', error)

            if (error.code === error.TIMEOUT) {
                // Try with lower accuracy on timeout
                setSuccess('🔄 Trying with lower accuracy...')

                const fallbackId = navigator.geolocation.watchPosition(
                    handleSuccess,
                    (fallbackError) => {
                        setIsLoading(false)
                        let errorMessage = ''

                        switch (fallbackError.code) {
                            case fallbackError.PERMISSION_DENIED:
                                errorMessage = '❌ Location access denied. Please enable location permissions in your browser settings.'
                                break
                            case fallbackError.POSITION_UNAVAILABLE:
                                errorMessage = '❌ Location unavailable. Please check your GPS/WiFi connection and try again.'
                                break
                            case fallbackError.TIMEOUT:
                                errorMessage = '⏱️ Location still timing out. Please check your connection and try again.'
                                break
                            default:
                                errorMessage = '❌ Unable to get location. Please try again.'
                                break
                        }

                        setError(errorMessage)
                        setIsTracking(false)
                    },
                    lowAccuracyOptions
                )

                setWatchId(fallbackId)
                return
            }

            // Handle other errors immediately
            setIsLoading(false)
            let errorMessage = ''

            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = '❌ Location access denied. Please enable location permissions in your browser settings.'
                    break
                case error.POSITION_UNAVAILABLE:
                    errorMessage = '❌ Location information unavailable. Please check your GPS/WiFi connection.'
                    break
                default:
                    errorMessage = '❌ Unknown location error occurred. Please try again.'
                    break
            }

            setError(errorMessage)
            setIsTracking(false)
        }

        // Start with high accuracy
        const id = navigator.geolocation.watchPosition(
            handleSuccess,
            handleError,
            highAccuracyOptions
        )

        setWatchId(id)
    }, [])

    const stopTracking = useCallback(() => {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId)
            setWatchId(null)
        }
        setIsTracking(false)
        setIsLoading(false)
        setSuccess('🛑 Tracking stopped')
    }, [watchId])

    const getCurrentLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setError('❌ Geolocation is not supported by this browser')
            return
        }

        setError('')
        setSuccess('')
        setIsLoading(true)

        // Try high accuracy first
        const highAccuracyOptions = {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 60000
        }

        // Fallback to lower accuracy
        const lowAccuracyOptions = {
            enableHighAccuracy: false,
            timeout: 20000,
            maximumAge: 300000
        }

        const handleLocationSuccess = (position) => {
            setIsLoading(false)
            const newLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                timestamp: new Date(),
                accuracy: position.coords.accuracy
            }

            setLocation(newLocation)
            setAccuracy(position.coords.accuracy)
            setHeading(position.coords.heading)
            setSpeed(position.coords.speed)
            setLastUpdate(new Date())
            setSuccess('✅ Current location found!')

            // Add to history if it's a new location
            setTrackingHistory(prev => {
                const lastLocation = prev[0]
                if (!lastLocation ||
                    Math.abs(lastLocation.latitude - newLocation.latitude) > 0.00001 ||
                    Math.abs(lastLocation.longitude - newLocation.longitude) > 0.00001) {
                    return [newLocation, ...prev.slice(0, 99)]
                }
                return prev
            })
        }

        const handleLocationError = (error) => {
            if (error.code === error.TIMEOUT) {
                // Try with lower accuracy on timeout
                setSuccess('🔄 Trying with network location...')

                navigator.geolocation.getCurrentPosition(
                    handleLocationSuccess,
                    (fallbackError) => {
                        setIsLoading(false)
                        let errorMessage = ''

                        switch (fallbackError.code) {
                            case fallbackError.PERMISSION_DENIED:
                                errorMessage = '❌ Location access denied. Please enable location permissions.'
                                break
                            case fallbackError.POSITION_UNAVAILABLE:
                                errorMessage = '❌ Location unavailable. Please check your connection.'
                                break
                            case fallbackError.TIMEOUT:
                                errorMessage = '⏱️ Still timing out. Please check your GPS/WiFi connection.'
                                break
                            default:
                                errorMessage = '❌ Unable to get location. Please try again.'
                                break
                        }

                        setError(errorMessage)
                    },
                    lowAccuracyOptions
                )
                return
            }

            // Handle other errors immediately
            setIsLoading(false)
            let errorMessage = ''

            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = '❌ Location access denied. Please allow location access and try again.'
                    break
                case error.POSITION_UNAVAILABLE:
                    errorMessage = '❌ Location unavailable. Please check your GPS/WiFi and try again.'
                    break
                default:
                    errorMessage = '❌ Failed to get location. Please try again.'
                    break
            }

            setError(errorMessage)
        }

        // Start with high accuracy
        navigator.geolocation.getCurrentPosition(
            handleLocationSuccess,
            handleLocationError,
            highAccuracyOptions
        )
    }, [])

    // Demo location for testing when GPS is not available
    const useDemoLocation = useCallback(() => {
        const demoLocations = [
            { lat: 40.7128, lng: -74.0060, name: "New York Farm" },
            { lat: 34.0522, lng: -118.2437, name: "Los Angeles Farm" },
            { lat: 41.8781, lng: -87.6298, name: "Chicago Farm" },
            { lat: 29.7604, lng: -95.3698, name: "Houston Farm" },
            { lat: 39.9526, lng: -75.1652, name: "Philadelphia Farm" }
        ]

        const randomLocation = demoLocations[Math.floor(Math.random() * demoLocations.length)]

        const demoLocation = {
            latitude: randomLocation.lat + (Math.random() - 0.5) * 0.01, // Add small random offset
            longitude: randomLocation.lng + (Math.random() - 0.5) * 0.01,
            timestamp: new Date(),
            accuracy: Math.floor(Math.random() * 20) + 5 // 5-25 meters accuracy
        }

        setLocation(demoLocation)
        setAccuracy(demoLocation.accuracy)
        setHeading(Math.floor(Math.random() * 360)) // Random heading
        setSpeed(Math.random() * 5) // Random speed 0-5 m/s
        setLastUpdate(new Date())
        setSuccess(`✅ Demo location set: ${randomLocation.name}`)

        // Add to history
        setTrackingHistory(prev => [demoLocation, ...prev.slice(0, 99)])
    }, [])

    const shareLocation = async () => {
        if (!location) return

        const locationText = `My Location: ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
        const mapsUrl = `https://maps.google.com/maps?q=${location.latitude},${location.longitude}`

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My GPS Location',
                    text: locationText,
                    url: mapsUrl
                })
            } catch (err) {
                console.log('Error sharing:', err)
            }
        } else {
            navigator.clipboard.writeText(`${locationText}\n${mapsUrl}`)
            alert('Location copied to clipboard!')
        }
    }

    const exportTrackingData = () => {
        if (trackingHistory.length === 0) return

        const data = trackingHistory.map(loc => ({
            latitude: loc.latitude,
            longitude: loc.longitude,
            timestamp: loc.timestamp.toISOString()
        }))

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `gps-tracking-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    const formatCoordinate = (coord) => {
        return coord ? coord.toFixed(6) : 'N/A'
    }

    const formatSpeed = (speedMs) => {
        if (!speedMs) return 'N/A'
        const kmh = speedMs * 3.6
        return `${kmh.toFixed(1)} km/h`
    }

    const formatHeading = (headingDeg) => {
        if (!headingDeg) return 'N/A'
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
        const index = Math.round(headingDeg / 45) % 8
        return `${headingDeg.toFixed(0)}° ${directions[index]}`
    }

    // Generate Google Maps URL with tracking path
    const generateMapUrl = (viewType = 'hybrid') => {
        if (!location) return ''

        const mapTypes = {
            roadmap: 'm',
            satellite: 'k',
            hybrid: 'h',
            terrain: 'p'
        }

        const mapType = mapTypes[viewType] || 'h'

        // If we have tracking history, create a path
        if (trackingHistory.length > 1) {
            const pathPoints = trackingHistory.slice(0, 10).map(point =>
                `${point.latitude},${point.longitude}`
            ).join('|')

            return `https://maps.google.com/maps?q=${location.latitude},${location.longitude}&t=${mapType}&z=15&ie=UTF8&iwloc=&output=embed&path=${encodeURIComponent(pathPoints)}`
        }

        return `https://maps.google.com/maps?q=${location.latitude},${location.longitude}&t=${mapType}&z=15&ie=UTF8&iwloc=&output=embed`
    }

    // Generate directions URL to a destination
    const generateDirectionsUrl = (destLat, destLng, destName = 'Destination') => {
        if (!location) return ''
        return `https://maps.google.com/maps/dir/${location.latitude},${location.longitude}/${destLat},${destLng}`
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <Navigation className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">GPS Tracker</h2>
                </div>
                <div className="flex items-center space-x-2">
                    {isTracking && (
                        <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-green-800 text-sm font-medium">Tracking</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Status Messages */}
            {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <p className="text-red-800">{error}</p>
                    </div>
                </div>
            )}

            {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-green-800">{success}</p>
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                        <p className="text-blue-800">Getting your location...</p>
                    </div>
                </div>
            )}

            {/* Permission Status */}
            {permissionStatus !== 'unknown' && (
                <div className={`mb-4 p-3 rounded-lg border ${permissionStatus === 'granted'
                    ? 'bg-green-50 border-green-200'
                    : permissionStatus === 'denied'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-yellow-50 border-yellow-200'
                    }`}>
                    <p className={`text-sm ${permissionStatus === 'granted'
                        ? 'text-green-800'
                        : permissionStatus === 'denied'
                            ? 'text-red-800'
                            : 'text-yellow-800'
                        }`}>
                        Location Permission: <strong className="capitalize">{permissionStatus}</strong>
                        {permissionStatus === 'denied' && (
                            <span className="block mt-1">
                                Please enable location access in your browser settings to use GPS features.
                            </span>
                        )}
                    </p>
                </div>
            )}

            {/* Control Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                <button
                    onClick={getCurrentLocation}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                >
                    <Target className="w-4 h-4" />
                    <span>Get Location</span>
                </button>

                {!isTracking ? (
                    <button
                        onClick={startTracking}
                        className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                    >
                        <Navigation className="w-4 h-4" />
                        <span>Start Tracking</span>
                    </button>
                ) : (
                    <button
                        onClick={stopTracking}
                        className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Stop Tracking</span>
                    </button>
                )}

                <button
                    onClick={shareLocation}
                    disabled={!location}
                    className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 flex items-center justify-center space-x-2"
                >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                </button>

                <button
                    onClick={exportTrackingData}
                    disabled={trackingHistory.length === 0}
                    className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 flex items-center justify-center space-x-2"
                >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                </button>

                <button
                    onClick={useDemoLocation}
                    className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center justify-center space-x-2"
                >
                    <Target className="w-4 h-4" />
                    <span>Demo</span>
                </button>
            </div>

            {/* Quick Tips */}
            {!location && !isLoading && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-semibold text-yellow-900 mb-2">🚀 Quick Start Tips</h3>
                    <ul className="text-yellow-800 text-sm space-y-1">
                        <li>• <strong>Get Location:</strong> Click to get your current position once</li>
                        <li>• <strong>Start Tracking:</strong> Continuously monitor your location</li>
                        <li>• <strong>Demo:</strong> Try with a sample location if GPS is not working</li>
                        <li>• <strong>Troubleshooting:</strong> Enable location permissions in browser settings</li>
                    </ul>
                </div>
            )}

            {/* Location Information */}
            {location && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Current Location */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 mb-3 flex items-center space-x-2">
                            <MapPin className="w-5 h-5" />
                            <span>Current Location</span>
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-blue-700">Latitude:</span>
                                <span className="font-mono text-blue-900">{formatCoordinate(location.latitude)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-blue-700">Longitude:</span>
                                <span className="font-mono text-blue-900">{formatCoordinate(location.longitude)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-blue-700">Accuracy:</span>
                                <span className="text-blue-900">{accuracy ? `±${accuracy.toFixed(0)}m` : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-blue-700">Last Update:</span>
                                <span className="text-blue-900">{lastUpdate ? lastUpdate.toLocaleTimeString() : 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Movement Information */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-semibold text-green-900 mb-3 flex items-center space-x-2">
                            <Compass className="w-5 h-5" />
                            <span>Movement Data</span>
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-green-700">Speed:</span>
                                <span className="text-green-900">{formatSpeed(speed)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-green-700">Heading:</span>
                                <span className="text-green-900">{formatHeading(heading)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-green-700">Tracking Points:</span>
                                <span className="text-green-900">{trackingHistory.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-green-700">Status:</span>
                                <span className={`font-medium ${isTracking ? 'text-green-600' : 'text-gray-600'}`}>
                                    {isTracking ? 'Active' : 'Stopped'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Embedded Google Maps */}
            {location && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                            <Map className="w-5 h-5 text-blue-600" />
                            <span>Live Map View</span>
                        </h3>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-gray-600">Your Location</span>
                        </div>
                    </div>

                    {/* Google Maps Embed */}
                    <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden border border-gray-300">
                        <iframe
                            src={generateMapUrl(mapView)}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Your Current Location"
                            key={`${location.latitude}-${location.longitude}-${mapView}`}
                        ></iframe>

                        {/* Overlay with location info */}
                        <div className="absolute top-2 left-2 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-2 shadow-sm">
                            <div className="text-xs text-gray-700">
                                <div className="font-semibold">📍 Current Position</div>
                                <div className="font-mono">{location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</div>
                                {accuracy && <div className="text-gray-500">±{accuracy.toFixed(0)}m accuracy</div>}
                            </div>
                        </div>

                        {/* Map controls overlay */}
                        <div className="absolute top-2 right-2 flex flex-col space-y-1">
                            <button
                                onClick={() => window.open(`https://maps.google.com/maps?q=${location.latitude},${location.longitude}&t=m&z=15`, '_blank')}
                                className="bg-white bg-opacity-90 backdrop-blur-sm p-2 rounded-lg shadow-sm hover:bg-opacity-100 transition-all"
                                title="Open in Google Maps"
                            >
                                <ExternalLink className="w-4 h-4 text-gray-700" />
                            </button>
                            <button
                                onClick={() => {
                                    const iframe = document.querySelector('iframe[title="Your Current Location"]')
                                    if (iframe) {
                                        iframe.src = `https://maps.google.com/maps?q=${location.latitude},${location.longitude}&t=h&z=15&ie=UTF8&iwloc=&output=embed`
                                    }
                                }}
                                className="bg-white bg-opacity-90 backdrop-blur-sm p-2 rounded-lg shadow-sm hover:bg-opacity-100 transition-all"
                                title="Refresh Map"
                            >
                                <RefreshCw className="w-4 h-4 text-gray-700" />
                            </button>
                        </div>
                    </div>

                    {/* Map View Options */}
                    <div className="mt-3 flex flex-wrap gap-2 justify-between">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setMapView('roadmap')}
                                className={`px-3 py-1 rounded-full text-sm transition-colors ${mapView === 'roadmap'
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                    }`}
                            >
                                🗺️ Road Map
                            </button>
                            <button
                                onClick={() => setMapView('satellite')}
                                className={`px-3 py-1 rounded-full text-sm transition-colors ${mapView === 'satellite'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                                    }`}
                            >
                                🛰️ Satellite
                            </button>
                            <button
                                onClick={() => setMapView('hybrid')}
                                className={`px-3 py-1 rounded-full text-sm transition-colors ${mapView === 'hybrid'
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                                    }`}
                            >
                                🏞️ Hybrid
                            </button>
                            <button
                                onClick={() => setMapView('terrain')}
                                className={`px-3 py-1 rounded-full text-sm transition-colors ${mapView === 'terrain'
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                                    }`}
                            >
                                🏔️ Terrain
                            </button>
                        </div>

                        {/* Tracking info */}
                        {trackingHistory.length > 1 && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>{trackingHistory.length} tracking points</span>
                            </div>
                        )}
                    </div>

                    {/* Quick Directions */}
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">🧭 Quick Directions</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <a
                                href={generateDirectionsUrl(40.7589, -73.9851, 'Times Square NYC')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs bg-white border border-gray-200 rounded px-2 py-1 hover:bg-gray-50 text-center"
                            >
                                🏙️ NYC
                            </a>
                            <a
                                href={generateDirectionsUrl(34.0522, -118.2437, 'Downtown LA')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs bg-white border border-gray-200 rounded px-2 py-1 hover:bg-gray-50 text-center"
                            >
                                🌴 LA
                            </a>
                            <a
                                href={generateDirectionsUrl(41.8781, -87.6298, 'Chicago Loop')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs bg-white border border-gray-200 rounded px-2 py-1 hover:bg-gray-50 text-center"
                            >
                                🏢 Chicago
                            </a>
                            <button
                                onClick={() => {
                                    const destination = prompt('Enter destination (address or coordinates):')
                                    if (destination) {
                                        window.open(`https://maps.google.com/maps/dir/${location.latitude},${location.longitude}/${encodeURIComponent(destination)}`, '_blank')
                                    }
                                }}
                                className="text-xs bg-blue-100 text-blue-800 rounded px-2 py-1 hover:bg-blue-200"
                            >
                                📍 Custom
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            {location && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <a
                            href={`https://maps.google.com/maps?q=${location.latitude},${location.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 text-center flex items-center justify-center space-x-2"
                        >
                            <ExternalLink className="w-4 h-4" />
                            <span>Google Maps</span>
                        </a>
                        <a
                            href={`https://maps.apple.com/?q=${location.latitude},${location.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 text-center flex items-center justify-center space-x-2"
                        >
                            <ExternalLink className="w-4 h-4" />
                            <span>Apple Maps</span>
                        </a>
                        <a
                            href={`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}&zoom=15`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-center flex items-center justify-center space-x-2"
                        >
                            <ExternalLink className="w-4 h-4" />
                            <span>OpenStreetMap</span>
                        </a>
                        <button
                            onClick={() => {
                                const coords = `${location.latitude},${location.longitude}`
                                navigator.clipboard.writeText(coords)
                                setSuccess('📋 Coordinates copied to clipboard!')
                            }}
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 flex items-center justify-center space-x-2"
                        >
                            <Target className="w-4 h-4" />
                            <span>Copy Coords</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Tracking History */}
            {trackingHistory.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-yellow-900 flex items-center space-x-2">
                            <Clock className="w-5 h-5" />
                            <span>Recent Tracking History</span>
                        </h3>
                        <span className="text-yellow-700 text-sm">{trackingHistory.length} points</span>
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-1">
                        {trackingHistory.slice(0, 10).map((point, index) => (
                            <div key={index} className="flex justify-between items-center text-sm bg-white p-2 rounded">
                                <span className="font-mono text-yellow-800">
                                    {formatCoordinate(point.latitude)}, {formatCoordinate(point.longitude)}
                                </span>
                                <span className="text-yellow-600">
                                    {point.timestamp.toLocaleTimeString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Usage Instructions */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">📍 How to Use GPS Tracker</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                    <li>• <strong>Get Location:</strong> Get your current GPS coordinates once</li>
                    <li>• <strong>Start Tracking:</strong> Continuously track your movement and location</li>
                    <li>• <strong>Share:</strong> Share your location via text, email, or social media</li>
                    <li>• <strong>Export:</strong> Download your tracking data as JSON file</li>
                    <li>• <strong>Farm Use:</strong> Track field boundaries, equipment location, or delivery routes</li>
                </ul>
            </div>
        </div>
    )
}

export default GPSTracker
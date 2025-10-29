import { useState, useEffect } from 'react'
import { MapPin, Navigation, Star, Truck } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const NearbyFarmers = () => {
    const [farmers, setFarmers] = useState([])
    const [userLocation, setUserLocation] = useState(null)
    const [radius, setRadius] = useState(25)
    const [isLoading, setIsLoading] = useState(false)
    const [locationPermission, setLocationPermission] = useState('prompt')

    useEffect(() => {
        getCurrentLocation()
    }, [])

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by this browser')
            return
        }

        setIsLoading(true)
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
                setUserLocation(location)
                setLocationPermission('granted')
                fetchNearbyFarmers(location)
            },
            (error) => {
                console.error('Location error:', error)
                setLocationPermission('denied')
                setIsLoading(false)

                // Use default location (Los Angeles) for demo
                const defaultLocation = { latitude: 34.0522, longitude: -118.2437 }
                setUserLocation(defaultLocation)
                fetchNearbyFarmers(defaultLocation)
                toast.info('Using default location for demo. Enable location for accurate results.')
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        )
    }

    const fetchNearbyFarmers = async (location) => {
        try {
            setIsLoading(true)
            const response = await axios.get('/api/location/nearby-farmers', {
                params: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    radius: radius
                }
            })
            setFarmers(response.data.farmers)
        } catch (error) {
            console.error('Fetch farmers error:', error)
            toast.error('Failed to fetch nearby farmers')
        } finally {
            setIsLoading(false)
        }
    }

    const handleRadiusChange = (newRadius) => {
        setRadius(newRadius)
        if (userLocation) {
            fetchNearbyFarmers(userLocation)
        }
    }

    const calculateDeliveryInfo = async (farmerLocation) => {
        if (!userLocation) return null

        try {
            const response = await axios.post('/api/location/delivery-cost', {
                fromLatitude: farmerLocation.latitude,
                fromLongitude: farmerLocation.longitude,
                toLatitude: userLocation.latitude,
                toLongitude: userLocation.longitude
            })
            return response.data
        } catch (error) {
            console.error('Delivery calculation error:', error)
            return null
        }
    }

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
            />
        ))
    }

    if (locationPermission === 'denied' && !userLocation) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Location Access Needed</h3>
                <p className="text-gray-600 mb-4">
                    Enable location access to find farmers near you and get accurate delivery estimates.
                </p>
                <button
                    onClick={getCurrentLocation}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                    Enable Location
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Nearby Farmers</h2>
                    <p className="text-gray-600">
                        {userLocation && `Found ${farmers.length} farmers within ${radius}km`}
                    </p>
                </div>

                {/* Radius Selector */}
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Radius:</span>
                    <select
                        value={radius}
                        onChange={(e) => handleRadiusChange(parseInt(e.target.value))}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                        <option value={10}>10 km</option>
                        <option value={25}>25 km</option>
                        <option value={50}>50 km</option>
                        <option value={100}>100 km</option>
                    </select>
                </div>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-gray-600 mt-2">Finding nearby farmers...</p>
                </div>
            )}

            {/* Farmers Grid */}
            {!isLoading && farmers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {farmers.map((farmer) => (
                        <FarmerCard
                            key={farmer._id}
                            farmer={farmer}
                            userLocation={userLocation}
                            onCalculateDelivery={calculateDeliveryInfo}
                        />
                    ))}
                </div>
            )}

            {/* No Farmers Found */}
            {!isLoading && farmers.length === 0 && userLocation && (
                <div className="text-center py-12">
                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Farmers Found</h3>
                    <p className="text-gray-600 mb-4">
                        No farmers found within {radius}km of your location.
                    </p>
                    <button
                        onClick={() => handleRadiusChange(radius * 2)}
                        className="text-green-600 hover:text-green-500"
                    >
                        Expand search to {radius * 2}km
                    </button>
                </div>
            )}
        </div>
    )
}

const FarmerCard = ({ farmer, userLocation, onCalculateDelivery }) => {
    const [deliveryInfo, setDeliveryInfo] = useState(null)
    const [loadingDelivery, setLoadingDelivery] = useState(false)

    const handleGetDeliveryInfo = async () => {
        if (!farmer.farmerProfile?.location || !userLocation) return

        setLoadingDelivery(true)
        const info = await onCalculateDelivery(farmer.farmerProfile.location)
        setDeliveryInfo(info)
        setLoadingDelivery(false)
    }

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
            />
        ))
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* Farmer Header */}
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    {farmer.avatar ? (
                        <img
                            src={`/api/uploads/avatars/${farmer.avatar}`}
                            alt={farmer.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-green-600 font-medium text-lg">
                            {farmer.name.charAt(0)}
                        </span>
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{farmer.name}</h3>
                    <p className="text-sm text-gray-600">
                        {farmer.farmerProfile?.farmName || 'Local Farm'}
                    </p>
                </div>
                {farmer.farmerProfile?.verified && (
                    <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Verified
                    </div>
                )}
            </div>

            {/* Rating */}
            {farmer.farmerProfile?.rating > 0 && (
                <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                        {renderStars(farmer.farmerProfile.rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                        {farmer.farmerProfile.rating.toFixed(1)}
                    </span>
                </div>
            )}

            {/* Description */}
            {farmer.farmerProfile?.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {farmer.farmerProfile.description}
                </p>
            )}

            {/* Distance */}
            <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                    {farmer.distance?.toFixed(1)} km away
                </span>
            </div>

            {/* Delivery Info */}
            <div className="border-t pt-4">
                {!deliveryInfo && !loadingDelivery && (
                    <button
                        onClick={handleGetDeliveryInfo}
                        className="flex items-center space-x-2 text-green-600 hover:text-green-500 text-sm"
                    >
                        <Truck className="w-4 h-4" />
                        <span>Get Delivery Info</span>
                    </button>
                )}

                {loadingDelivery && (
                    <div className="flex items-center space-x-2 text-gray-500 text-sm">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                        <span>Calculating...</span>
                    </div>
                )}

                {deliveryInfo && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Delivery Cost:</span>
                            <span className="font-medium text-gray-900">
                                ${deliveryInfo.deliveryCost}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Estimated Time:</span>
                            <span className="font-medium text-gray-900">
                                {deliveryInfo.estimatedTime}h
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t">
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm font-medium">
                    View Products
                </button>
            </div>
        </div>
    )
}

export default NearbyFarmers
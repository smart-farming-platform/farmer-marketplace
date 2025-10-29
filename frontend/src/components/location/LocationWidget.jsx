import { useState, useEffect } from 'react'
import { MapPin, Edit3, Navigation, Globe } from 'lucide-react'
// Location widget for displaying and managing user/farm locations

const LocationWidget = ({
    userType = 'consumer',
    initialLocation = null,
    onLocationUpdate = null
}) => {
    const [location, setLocation] = useState({
        name: userType === 'farmer' ? 'Green Valley Farm, CA' : 'Los Angeles, CA',
        address: userType === 'farmer' ? 'Farm Location, California' : '123 Main Street, Los Angeles, CA',
        coordinates: { lat: 34.0522, lng: -118.2437 }
    })
    const [isEditing, setIsEditing] = useState(false)
    const [newLocationName, setNewLocationName] = useState('')
    const [isGettingLocation, setIsGettingLocation] = useState(false)

    useEffect(() => {
        // Load saved location
        const storageKey = userType === 'farmer' ? 'farmLocation' : 'userLocation'
        const savedLocation = localStorage.getItem(storageKey)

        if (savedLocation) {
            setLocation(JSON.parse(savedLocation))
        } else if (initialLocation) {
            setLocation(initialLocation)
        }
    }, [userType, initialLocation])

    const handleLocationUpdate = () => {
        if (newLocationName.trim()) {
            const updatedLocation = {
                ...location,
                name: newLocationName.trim()
            }

            setLocation(updatedLocation)

            // Save to localStorage
            const storageKey = userType === 'farmer' ? 'farmLocation' : 'userLocation'
            localStorage.setItem(storageKey, JSON.stringify(updatedLocation))

            setIsEditing(false)
            setNewLocationName('')

            if (onLocationUpdate) {
                onLocationUpdate(updatedLocation)
            }

            console.log('Location updated successfully!')
        }
    }

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            console.error('Geolocation is not supported by this browser')
            return
        }

        setIsGettingLocation(true)

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords

                try {
                    // Reverse geocoding (simplified - in real app you'd use Google Maps API)
                    const locationName = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`

                    const updatedLocation = {
                        name: locationName,
                        address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
                        coordinates: { lat: latitude, lng: longitude }
                    }

                    setLocation(updatedLocation)

                    const storageKey = userType === 'farmer' ? 'farmLocation' : 'userLocation'
                    localStorage.setItem(storageKey, JSON.stringify(updatedLocation))

                    if (onLocationUpdate) {
                        onLocationUpdate(updatedLocation)
                    }

                    console.log('Location detected successfully!')
                } catch (error) {
                    console.error('Failed to get location details')
                } finally {
                    setIsGettingLocation(false)
                }
            },
            (error) => {
                console.error('Location error:', error)
                console.error('Failed to get your location')
                setIsGettingLocation(false)
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 min-w-[280px]">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">
                        {userType === 'farmer' ? 'Farm Location' : 'Your Location'}
                    </span>
                </div>
                <div className="flex items-center space-x-1">
                    <button
                        onClick={getCurrentLocation}
                        disabled={isGettingLocation}
                        className="text-blue-500 hover:text-blue-600 disabled:opacity-50"
                        title="Get current location"
                    >
                        {isGettingLocation ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        ) : (
                            <Navigation className="w-4 h-4" />
                        )}
                    </button>
                    <button
                        onClick={() => {
                            setIsEditing(true)
                            setNewLocationName(location.name)
                        }}
                        className="text-gray-400 hover:text-gray-600"
                        title="Edit location"
                    >
                        <Edit3 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {isEditing ? (
                <div className="space-y-3">
                    <input
                        type="text"
                        value={newLocationName}
                        onChange={(e) => setNewLocationName(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder={`Enter ${userType === 'farmer' ? 'farm' : ''} location name`}
                    />
                    <div className="flex space-x-2">
                        <button
                            onClick={handleLocationUpdate}
                            className="flex-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => {
                                setIsEditing(false)
                                setNewLocationName('')
                            }}
                            className="flex-1 px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <p className="font-medium text-gray-900 text-sm mb-1">{location.name}</p>
                    <p className="text-xs text-gray-500 mb-2">{location.address}</p>

                    {/* Quick Actions */}
                    <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                        <button
                            onClick={() => window.open(`https://maps.google.com/?q=${location.coordinates.lat},${location.coordinates.lng}`, '_blank')}
                            className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-500"
                        >
                            <Globe className="w-3 h-3" />
                            <span>View on Map</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default LocationWidget
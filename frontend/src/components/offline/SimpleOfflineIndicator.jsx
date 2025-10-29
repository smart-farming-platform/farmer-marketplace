import { useState, useEffect } from 'react'
import { Wifi, WifiOff, Database, Sync } from 'lucide-react'

const SimpleOfflineIndicator = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine)
    const [showDetails, setShowDetails] = useState(false)
    const [cachedData, setCachedData] = useState({
        products: 0,
        lastUpdate: null
    })

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true)
            console.log('Back online - syncing data...')
            syncOfflineData()
        }

        const handleOffline = () => {
            setIsOnline(false)
            console.log('Gone offline - using cached data')
            cacheCurrentData()
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        // Load cached data on mount
        loadCachedData()

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    const loadCachedData = () => {
        try {
            const cached = localStorage.getItem('agroconnect_offline_data')
            if (cached) {
                const data = JSON.parse(cached)
                setCachedData({
                    products: data.products?.length || 0,
                    lastUpdate: data.lastUpdate || null
                })
            }
        } catch (error) {
            console.error('Error loading cached data:', error)
        }
    }

    const cacheCurrentData = () => {
        try {
            // Cache basic data for offline use
            const offlineData = {
                products: [
                    { id: 1, name: 'Fresh Tomatoes', price: 120, category: 'vegetables', image: 'tomatoes.svg' },
                    { id: 2, name: 'Sweet Corn', price: 15, category: 'vegetables', image: 'corn.svg' },
                    { id: 3, name: 'Organic Strawberries', price: 180, category: 'fruits', image: 'strawberries.svg' },
                    { id: 4, name: 'Fresh Lettuce', price: 40, category: 'vegetables', image: 'lettuce.svg' },
                    { id: 5, name: 'Farm Fresh Eggs', price: 150, category: 'dairy', image: 'eggs.svg' },
                    { id: 6, name: 'Organic Carrots', price: 80, category: 'vegetables', image: 'carrots.svg' }
                ],
                farmers: [
                    { id: 1, name: 'Green Valley Farm', location: 'Fresno, CA' },
                    { id: 2, name: 'Smith Family Farm', location: 'Los Angeles, CA' }
                ],
                lastUpdate: new Date().toISOString()
            }

            localStorage.setItem('agroconnect_offline_data', JSON.stringify(offlineData))
            setCachedData({
                products: offlineData.products.length,
                lastUpdate: offlineData.lastUpdate
            })
        } catch (error) {
            console.error('Error caching data:', error)
        }
    }

    const syncOfflineData = () => {
        // Simulate syncing offline actions
        const offlineActions = JSON.parse(localStorage.getItem('agroconnect_offline_actions') || '[]')

        if (offlineActions.length > 0) {
            console.log('Syncing offline actions:', offlineActions)
            // In a real app, you'd send these to the server
            localStorage.removeItem('agroconnect_offline_actions')
        }

        // Update cache with fresh data
        cacheCurrentData()
    }

    const clearCache = () => {
        if (confirm('Clear all offline data?')) {
            localStorage.removeItem('agroconnect_offline_data')
            localStorage.removeItem('agroconnect_offline_actions')
            setCachedData({ products: 0, lastUpdate: null })
        }
    }

    const formatLastUpdate = (dateString) => {
        if (!dateString) return 'Never'
        const date = new Date(dateString)
        return date.toLocaleString()
    }

    return (
        <>
            {/* Status Indicator */}
            <div className="fixed top-20 right-4 z-40">
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-lg ${isOnline
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-red-500 text-white hover:bg-red-600 animate-pulse'
                        }`}
                >
                    {isOnline ? (
                        <Wifi className="w-4 h-4" />
                    ) : (
                        <WifiOff className="w-4 h-4" />
                    )}
                    <span>{isOnline ? 'Online' : 'Offline'}</span>
                </button>
            </div>

            {/* Offline Banner */}
            {!isOnline && (
                <div className="fixed top-16 left-0 right-0 bg-yellow-500 text-yellow-900 px-4 py-2 text-center text-sm font-medium z-30 animate-slide-down">
                    <div className="flex items-center justify-center space-x-2">
                        <WifiOff className="w-4 h-4" />
                        <span>You're offline. Browsing cached content with {cachedData.products} products.</span>
                    </div>
                </div>
            )}

            {/* Details Panel */}
            {showDetails && (
                <div className="fixed top-32 right-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80 z-40 animate-fade-in">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">Connection Status</h3>
                        <button
                            onClick={() => setShowDetails(false)}
                            className="text-gray-400 hover:text-gray-600 text-lg"
                        >
                            ×
                        </button>
                    </div>

                    {/* Connection Status */}
                    <div className="mb-4">
                        <div className={`flex items-center space-x-3 p-3 rounded-lg ${isOnline ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                            }`}>
                            {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                            <div>
                                <p className="font-medium">
                                    {isOnline ? 'Connected' : 'Disconnected'}
                                </p>
                                <p className="text-sm opacity-75">
                                    {isOnline
                                        ? 'All features available'
                                        : 'Using cached content'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cache Info */}
                    <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                            <Database className="w-4 h-4" />
                            <span>Offline Data</span>
                        </h4>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Cached Products:</span>
                                <span className="font-medium">{cachedData.products}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Last Updated:</span>
                                <span className="font-medium text-xs">
                                    {formatLastUpdate(cachedData.lastUpdate)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Offline Features */}
                    <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Available Offline:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span>Browse cached products</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span>View product details</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span>Add items to cart</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                <span>Limited search & filters</span>
                            </li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                        <button
                            onClick={cacheCurrentData}
                            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 flex items-center justify-center space-x-1"
                        >
                            <Sync className="w-4 h-4" />
                            <span>Refresh Cache</span>
                        </button>
                        <button
                            onClick={clearCache}
                            className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-gray-700"
                        >
                            Clear Cache
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slide-down {
                    from { transform: translateY(-100%); }
                    to { transform: translateY(0); }
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-slide-down {
                    animation: slide-down 0.3s ease-out;
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
            `}</style>
        </>
    )
}

export default SimpleOfflineIndicator
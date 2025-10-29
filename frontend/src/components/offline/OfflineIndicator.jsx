import { useState, useEffect } from 'react'
import { Wifi, WifiOff, Download, Sync, Database } from 'lucide-react'
import offlineService from '../../services/offlineService'

const OfflineIndicator = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine)
    const [showDetails, setShowDetails] = useState(false)
    const [cacheStats, setCacheStats] = useState({})
    const [syncing, setSyncing] = useState(false)

    useEffect(() => {
        const handleStatusChange = (status) => {
            setIsOnline(status === 'online')
            updateCacheStats()

            if (status === 'online') {
                setSyncing(true)
                setTimeout(() => setSyncing(false), 2000) // Show syncing for 2 seconds
            }
        }

        offlineService.addListener(handleStatusChange)
        updateCacheStats()

        return () => {
            offlineService.removeListener(handleStatusChange)
        }
    }, [])

    const updateCacheStats = () => {
        setCacheStats(offlineService.getCacheStats())
    }

    const handleClearCache = () => {
        if (confirm('Clear all offline data? This will remove cached products and saved data.')) {
            offlineService.clearCache()
            updateCacheStats()
        }
    }

    return (
        <>
            {/* Status Indicator */}
            <div className="fixed top-20 right-4 z-40">
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-colors ${isOnline
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                >
                    {syncing ? (
                        <Sync className="w-4 h-4 animate-spin" />
                    ) : isOnline ? (
                        <Wifi className="w-4 h-4" />
                    ) : (
                        <WifiOff className="w-4 h-4" />
                    )}
                    <span>{syncing ? 'Syncing...' : isOnline ? 'Online' : 'Offline'}</span>
                </button>
            </div>

            {/* Offline Banner */}
            {!isOnline && (
                <div className="fixed top-16 left-0 right-0 bg-yellow-500 text-yellow-900 px-4 py-2 text-center text-sm font-medium z-30">
                    <div className="flex items-center justify-center space-x-2">
                        <WifiOff className="w-4 h-4" />
                        <span>You're offline. Browsing cached content.</span>
                    </div>
                </div>
            )}

            {/* Details Panel */}
            {showDetails && (
                <div className="fixed top-32 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-80 z-40">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">Offline Status</h3>
                        <button
                            onClick={() => setShowDetails(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ×
                        </button>
                    </div>

                    {/* Connection Status */}
                    <div className="mb-4">
                        <div className={`flex items-center space-x-2 p-3 rounded-lg ${isOnline ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                            }`}>
                            {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
                            <div>
                                <p className="font-medium">
                                    {isOnline ? 'Connected' : 'Disconnected'}
                                </p>
                                <p className="text-sm opacity-75">
                                    {isOnline
                                        ? 'All features available'
                                        : 'Limited to cached content'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cache Statistics */}
                    <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                            <Database className="w-4 h-4" />
                            <span>Cached Data</span>
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Products:</span>
                                <span className="font-medium">{cacheStats.products || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Farmers:</span>
                                <span className="font-medium">{cacheStats.farmers || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Pending Actions:</span>
                                <span className="font-medium">{cacheStats.offlineActions || 0}</span>
                            </div>
                        </div>
                    </div>

                    {/* Offline Features */}
                    <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Available Offline:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Browse cached products</li>
                            <li>• View farmer profiles</li>
                            <li>• Add items to cart</li>
                            <li>• Read product details</li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                        <button
                            onClick={updateCacheStats}
                            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-700 flex items-center justify-center space-x-1"
                        >
                            <Download className="w-4 h-4" />
                            <span>Refresh</span>
                        </button>
                        <button
                            onClick={handleClearCache}
                            className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-gray-700"
                        >
                            Clear Cache
                        </button>
                    </div>

                    {/* Last Sync */}
                    {cacheStats.lastSync && (
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Last sync: {cacheStats.lastSync}
                        </p>
                    )}
                </div>
            )}
        </>
    )
}

export default OfflineIndicator
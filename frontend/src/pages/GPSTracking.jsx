import GPSTracker from '../components/location/GPSTracker'

const GPSTracking = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        GPS Tracking
                    </h1>
                    <p className="text-xl text-gray-600 mb-4">
                        Track your location for farming activities, deliveries, and field management
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
                        <h3 className="font-semibold text-blue-800 mb-2">🌾 Perfect for Farmers</h3>
                        <p className="text-blue-700 text-sm">
                            Use GPS tracking to map field boundaries, track equipment, monitor delivery routes,
                            and share your farm location with customers and suppliers.
                        </p>
                    </div>
                </div>

                <GPSTracker />

                {/* Additional Farm-Specific Features */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🚜</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Equipment Tracking</h3>
                            <p className="text-gray-600 text-sm">
                                Track the location of tractors, harvesters, and other farm equipment in real-time.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🗺️</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Field Mapping</h3>
                            <p className="text-gray-600 text-sm">
                                Map field boundaries, crop areas, and create accurate farm layouts for planning.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">🚚</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delivery Routes</h3>
                            <p className="text-gray-600 text-sm">
                                Optimize delivery routes and share real-time location with customers.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Privacy Notice */}
                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-semibold text-yellow-900 mb-2">🔒 Privacy & Security</h3>
                    <ul className="text-yellow-800 text-sm space-y-1">
                        <li>• Your location data is stored locally on your device</li>
                        <li>• No location data is sent to external servers</li>
                        <li>• You control when to share your location</li>
                        <li>• Tracking can be stopped at any time</li>
                        <li>• Export your data for your own records</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default GPSTracking
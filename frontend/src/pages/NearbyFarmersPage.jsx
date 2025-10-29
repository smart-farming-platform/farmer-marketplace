import NearbyFarmers from '../components/location/NearbyFarmers'

const NearbyFarmersPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Find Nearby Farmers
                    </h1>
                    <p className="text-lg text-gray-600">
                        Discover local farmers in your area using GPS location services
                    </p>
                </div>
                <NearbyFarmers />
            </div>
        </div>
    )
}

export default NearbyFarmersPage
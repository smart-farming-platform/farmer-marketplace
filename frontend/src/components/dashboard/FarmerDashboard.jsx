import { useQuery } from 'react-query'
import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import LocationWidget from '../location/LocationWidget'
import FarmingAdvice from '../ai/FarmingAdvice'
import DiseaseHistory from '../disease/DiseaseHistory'
import PriceAlerts from '../market/PriceAlerts'
import WeatherWidget from '../weather/WeatherWidget'
import WeatherAlerts from '../weather/WeatherAlerts'
import CropWeatherAdvice from '../weather/CropWeatherAdvice'

const FarmerDashboard = () => {
  const { user } = useAuth()

  const { data, isLoading, error } = useQuery(
    'farmerDashboard',
    () => axios.get('/api/farmers/dashboard').then(res => res.data)
  )

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-4 bg-gray-300 rounded mb-4"></div>
              <div className="h-8 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-600">
        Error loading dashboard data. Please try again later.
      </div>
    )
  }

  const stats = [
    {
      name: 'Total Products',
      value: data?.stats?.totalProducts || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Active Products',
      value: data?.stats?.activeProducts || 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Total Orders',
      value: data?.stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Monthly Revenue',
      value: `₹${(data?.stats?.monthlyRevenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ]

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Farmer Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Welcome back! Here's what's happening with your farm.
            </p>
          </div>

          {/* Farm Location Widget */}
          <LocationWidget
            userType="farmer"
            initialLocation={{
              name: user?.farmerProfile?.farmName ? `${user.farmerProfile.farmName}, CA` : 'Green Valley Farm, CA',
              address: '456 Farm Road, Fresno, CA 93720',
              coordinates: { lat: 36.7378, lng: -119.7871 }
            }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${stat.bgColor} p-3 rounded-md`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="ml-4 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Weather Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <WeatherWidget location={{ lat: 36.7378, lon: -119.7871 }} />
        </div>
        <div>
          <WeatherAlerts location={{ lat: 36.7378, lon: -119.7871 }} />
        </div>
      </div>

      {/* Crop Weather Advice */}
      <div className="mb-8">
        <CropWeatherAdvice
          selectedCrop="tomato"
          location={{ lat: 36.7378, lon: -119.7871 }}
        />
      </div>

      {/* AI Farming Advice */}
      <FarmingAdvice />

      {/* Disease Detection History */}
      <DiseaseHistory />

      {/* Price Alerts */}
      <PriceAlerts />

      {/* Recent Orders */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-hidden">
          {data?.recentOrders?.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {data.recentOrders.map((order) => (
                <li key={order._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {order.customer.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Order #{order.orderNumber}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-900">
                        ₹{order.totalAmount.toFixed(2)}
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              No recent orders found.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FarmerDashboard
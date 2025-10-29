import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { ShoppingCart, Package, Clock, Star } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import LocationWidget from '../location/LocationWidget'

const ConsumerDashboard = () => {
  const { user } = useAuth()

  const { data: orders, isLoading } = useQuery(
    'userOrders',
    () => axios.get('/api/orders?limit=5').then(res => res.data)
  )

  const { data: featuredProducts } = useQuery(
    'featuredProducts',
    () => axios.get('/api/products?limit=6&sortBy=averageRating&sortOrder=desc').then(res => res.data)
  )

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-4 bg-gray-300 rounded mb-4"></div>
              <div className="h-8 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const stats = [
    {
      name: 'Total Orders',
      value: orders?.total || 0,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Recent Orders',
      value: orders?.orders?.filter(order =>
        new Date(order.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length || 0,
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Favorite Products',
      value: '12', // This would come from a favorites system
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ]

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Consumer Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Welcome back, {user?.name}! Discover fresh products from local farmers.
            </p>
          </div>

          {/* Location Widget */}
          <LocationWidget
            userType="consumer"
            initialLocation={{
              name: 'Los Angeles, CA',
              address: '123 Main Street, Los Angeles, CA 90210',
              coordinates: { lat: 34.0522, lng: -118.2437 }
            }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

      {/* Location Management Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Settings</h2>
        <LocationWidget
          userType="consumer"
          initialLocation={{
            name: 'Los Angeles, CA',
            address: '123 Main Street, Los Angeles, CA 90210',
            coordinates: { lat: 34.0522, lng: -118.2437 }
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
            <Link
              to="/dashboard/orders"
              className="text-sm text-green-600 hover:text-green-500"
            >
              View all
            </Link>
          </div>
          <div className="overflow-hidden">
            {orders?.orders?.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {orders.orders.slice(0, 5).map((order) => (
                  <li key={order._id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Order #{order.orderNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
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
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p>No orders yet.</p>
                <Link
                  to="/products"
                  className="mt-2 inline-flex items-center text-sm text-green-600 hover:text-green-500"
                >
                  Start shopping
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Featured Products */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Featured Products</h3>
            <Link
              to="/products"
              className="text-sm text-green-600 hover:text-green-500"
            >
              View all
            </Link>
          </div>
          <div className="p-6">
            {featuredProducts?.products?.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {featuredProducts.products.slice(0, 4).map((product) => (
                  <Link
                    key={product._id}
                    to={`/products/${product._id}`}
                    className="group"
                  >
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                      <img
                        src={product.images?.[0] ? `/images/products/${product.images[0]}` : '/placeholder-product.jpg'}
                        alt={product.name}
                        className="h-24 w-full object-cover object-center group-hover:opacity-75"
                      />
                    </div>
                    <h4 className="mt-2 text-sm font-medium text-gray-900 truncate">
                      {product.name}
                    </h4>
                    <p className="text-sm text-green-600">
                      ₹{product.price}/{product.unit}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p>No products available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConsumerDashboard
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Eye, Package, Clock, CheckCircle, XCircle } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const OrderManagement = () => {
  const { user } = useAuth()
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery(
    ['orders', user?.role, statusFilter],
    () => {
      const endpoint = user?.role === 'farmer' ? '/api/orders/farmer' : '/api/orders'
      const params = statusFilter ? `?status=${statusFilter}` : ''
      return axios.get(`${endpoint}${params}`).then(res => res.data)
    }
  )

  const updateStatusMutation = useMutation(
    ({ orderId, status }) => axios.patch(`/api/orders/${orderId}/status`, { status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orders')
        toast.success('Order status updated successfully')
        setSelectedOrder(null)
      },
      onError: () => {
        toast.error('Failed to update order status')
      }
    }
  )

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      preparing: 'bg-purple-100 text-purple-800',
      ready: 'bg-green-100 text-green-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      confirmed: CheckCircle,
      preparing: Package,
      ready: Package,
      delivered: CheckCircle,
      cancelled: XCircle
    }
    const Icon = icons[status] || Clock
    return <Icon className="w-4 h-4" />
  }

  if (selectedOrder) {
    return <OrderDetail
      order={selectedOrder}
      onBack={() => setSelectedOrder(null)}
      onUpdateStatus={(status) => updateStatusMutation.mutate({ orderId: selectedOrder._id, status })}
      userRole={user?.role}
    />
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {user?.role === 'farmer' ? 'Order Management' : 'My Orders'}
        </h1>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="bg-gray-300 h-4 rounded w-32"></div>
                  <div className="bg-gray-300 h-3 rounded w-24"></div>
                </div>
                <div className="bg-gray-300 h-6 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {data?.orders?.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      Order #{order.orderNumber}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">
                        {user?.role === 'farmer' ? 'Customer:' : 'Total:'}
                      </span>
                      <span className="ml-1">
                        {user?.role === 'farmer'
                          ? order.customer?.name
                          : `₹${order.totalAmount.toFixed(2)}`
                        }
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Items:</span>
                      <span className="ml-1">{order.items.length}</span>
                    </div>
                    <div>
                      <span className="font-medium">Date:</span>
                      <span className="ml-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {user?.role === 'farmer' && (
                    <div className="text-right mr-4">
                      <div className="text-lg font-medium text-gray-900">
                        ₹{order.totalAmount.toFixed(2)}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-500"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {data?.orders?.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">
                {user?.role === 'farmer'
                  ? 'You haven\'t received any orders yet.'
                  : 'You haven\'t placed any orders yet.'
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const OrderDetail = ({ order, onBack, onUpdateStatus, userRole }) => {
  const [newStatus, setNewStatus] = useState(order.status)

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready', label: 'Ready for Pickup' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={onBack}
            className="text-green-600 hover:text-green-500 mb-2"
          >
            ← Back to Orders
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{order.orderNumber}
          </h1>
        </div>

        {userRole === 'farmer' && (
          <div className="flex items-center space-x-3">
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => onUpdateStatus(newStatus)}
              disabled={newStatus === order.status}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Status
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {order.items.map((item, index) => (
                <div key={index} className="p-6 flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={item.product.images?.[0] ? `/images/products/${item.product.images[0]}` : '/placeholder-product.jpg'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900">
                      {item.product.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      ₹{item.price}/{item.product.unit}
                    </p>
                    {userRole === 'consumer' && (
                      <p className="text-sm text-gray-500">
                        From: {item.farmer?.farmerProfile?.farmName || item.farmer?.name}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-gray-900">
                    Qty: {item.quantity}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery</span>
                <span className="text-gray-900">Free</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-medium">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer/Farmer Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {userRole === 'farmer' ? 'Customer Information' : 'Order Information'}
            </h3>
            <div className="space-y-3 text-sm">
              {userRole === 'farmer' ? (
                <>
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 text-gray-900">{order.customer?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 text-gray-900">{order.customer?.email}</span>
                  </div>
                  {order.customer?.phone && (
                    <div>
                      <span className="text-gray-600">Phone:</span>
                      <span className="ml-2 text-gray-900">{order.customer.phone}</span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div>
                    <span className="text-gray-600">Order Date:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment:</span>
                    <span className="ml-2 text-gray-900 capitalize">{order.paymentStatus}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Delivery Address */}
          {order.deliveryAddress && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Address</h3>
              <div className="text-sm text-gray-600">
                <p>{order.deliveryAddress.street}</p>
                <p>
                  {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                </p>
                {order.deliveryAddress.country && (
                  <p>{order.deliveryAddress.country}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderManagement
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
// Removed Stripe imports for demo mode
import { ArrowLeft, MapPin, User } from 'lucide-react'
import DemoCheckoutForm from '../components/payment/DemoCheckoutForm'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

// Demo mode - no Stripe initialization needed

const Checkout = () => {
  const [cartItems, setCartItems] = useState([])
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  })
  const [step, setStep] = useState(1) // 1: Address, 2: Payment
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout')
      navigate('/login')
      return
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    if (cart.length === 0) {
      toast.error('Your cart is empty')
      navigate('/cart')
      return
    }

    setCartItems(cart)

    // Pre-fill address from user profile
    if (user?.address) {
      setDeliveryAddress(prev => ({
        ...prev,
        name: user.name,
        street: user.address.street || '',
        city: user.address.city || '',
        state: user.address.state || '',
        zipCode: user.address.zipCode || '',
        country: user.address.country || 'USA'
      }))
    }
  }, [user, isAuthenticated, navigate])

  const handleAddressSubmit = (e) => {
    e.preventDefault()

    // Validate required fields
    if (!deliveryAddress.name || !deliveryAddress.street || !deliveryAddress.city ||
      !deliveryAddress.state || !deliveryAddress.zipCode) {
      toast.error('Please fill in all required fields')
      return
    }

    setStep(2)
  }

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setDeliveryAddress(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }

  const handlePaymentSuccess = (order) => {
    toast.success('Order placed successfully!')
    navigate(`/dashboard/orders`)
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => step === 1 ? navigate('/cart') : setStep(1)}
          className="flex items-center text-green-600 hover:text-green-500 mr-4"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center mb-8">
        <div className={`flex items-center ${step >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}>
            1
          </div>
          <span className="ml-2 font-medium">Delivery Address</span>
        </div>

        <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`}></div>

        <div className={`flex items-center ${step >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200'
            }`}>
            2
          </div>
          <span className="ml-2 font-medium">Payment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {step === 1 ? (
            /* Address Form */
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <MapPin className="w-6 h-6 text-green-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Delivery Address</h3>
              </div>

              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={deliveryAddress.name}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={deliveryAddress.street}
                    onChange={handleAddressChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={deliveryAddress.city}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={deliveryAddress.state}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={deliveryAddress.zipCode}
                      onChange={handleAddressChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={deliveryAddress.country}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 font-medium"
                >
                  Continue to Payment
                </button>
              </form>
            </div>
          ) : (
            /* Payment Form */
            <DemoCheckoutForm
              cartItems={cartItems}
              deliveryAddress={deliveryAddress}
              onSuccess={handlePaymentSuccess}
            />
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h3>

            <div className="space-y-3 mb-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <img
                    src={item.product.images?.[0] ? `/images/products/${item.product.images[0]}` : '/placeholder-product.jpg'}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × ₹{item.product.price}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">₹{getTotalAmount().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Delivery</span>
                <span className="text-gray-900">Free</span>
              </div>
              <div className="flex justify-between text-lg font-medium">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">₹{getTotalAmount().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
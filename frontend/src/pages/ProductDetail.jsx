
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import { Star, MapPin, Calendar, ShoppingCart, Plus, Minus } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const [quantity, setQuantity] = useState(1)

  const { data: product, isLoading, error } = useQuery(
    ['product', id],
    () => axios.get(`/api/products/${id}`).then(res => res.data)
  )

  const addToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      return
    }

    // Add to cart logic (localStorage for now)
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItem = cart.find(item => item.product._id === product._id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({ product, quantity })
    }

    localStorage.setItem('cart', JSON.stringify(cart))
    toast.success('Added to cart!')
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
          }`}
      />
    ))
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-300 h-96 rounded-lg"></div>
            <div className="space-y-4">
              <div className="bg-gray-300 h-8 rounded"></div>
              <div className="bg-gray-300 h-4 rounded w-2/3"></div>
              <div className="bg-gray-300 h-20 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <Link to="/products" className="text-green-600 hover:text-green-500">
          Back to Products
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="mb-8">
        <Link to="/products" className="text-green-600 hover:text-green-500">
          ← Back to Products
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="aspect-w-1 aspect-h-1 w-full">
            <img
              src={product.images?.[0] ? `/images/products/${product.images[0]}` : '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              {product.isOrganic && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Organic
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {renderStars(product.averageRating)}
                <span className="ml-2 text-sm text-gray-600">
                  ({product.ratings?.length || 0} reviews)
                </span>
              </div>
            </div>

            <div className="text-3xl font-bold text-green-600 mb-4">
              ₹{product.price}
              <span className="text-lg text-gray-500 font-normal">/{product.unit}</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Farmer Info */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">From the Farm</h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-medium">
                  {product.farmer?.name?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {product.farmer?.farmerProfile?.farmName || product.farmer?.name}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>Local Farm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Product Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Category:</span>
                <span className="ml-2 capitalize">{product.category}</span>
              </div>
              <div>
                <span className="text-gray-500">Available:</span>
                <span className="ml-2">{product.quantity} {product.unit}</span>
              </div>
              {product.harvestDate && (
                <div>
                  <span className="text-gray-500">Harvested:</span>
                  <span className="ml-2">
                    {new Date(product.harvestDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {product.expiryDate && (
                <div>
                  <span className="text-gray-500">Best by:</span>
                  <span className="ml-2">
                    {new Date(product.expiryDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Add to Cart */}
          {product.isAvailable && product.quantity > 0 ? (
            <div className="border-t pt-6">
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-sm font-medium text-gray-900">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={addToCart}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart - ₹{(product.price * quantity).toFixed(2)}</span>
              </button>
            </div>
          ) : (
            <div className="border-t pt-6">
              <button
                disabled
                className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-md cursor-not-allowed"
              >
                Out of Stock
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
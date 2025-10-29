import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { Search, Filter, Star, MapPin } from 'lucide-react'
import axios from 'axios'
import PlaceholderImage from '../components/PlaceholderImage'
// import { useOfflineData } from '../hooks/useOfflineData'

const Products = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    isOrganic: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const [page, setPage] = useState(1)
  // const { isOnline, cachedProducts, addToOfflineCart } = useOfflineData()
  const isOnline = true // Temporarily set to true

  const { data, isLoading, error } = useQuery(
    ['products', filters, page],
    () => axios.get('/api/products', {
      params: { ...filters, page, limit: 12 }
    }).then(res => res.data),
    {
      keepPreviousData: true,
      enabled: isOnline // Only fetch when online
    }
  )

  // Use online data only for now
  const products = data?.products || []
  const totalPages = data?.totalPages || 1

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'grains', label: 'Grains' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'meat', label: 'Meat' },
    { value: 'herbs', label: 'Herbs' }
  ]

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating)
          ? 'text-yellow-400 fill-current'
          : 'text-gray-300'
          }`}
      />
    ))
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Error loading products. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Offline Banner - Temporarily Disabled */}

      {/* Header */}
      <div className="mb-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🌱 Fresh Farm Products {!isOnline && '(Offline)'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {isOnline
              ? 'Discover fresh, locally-sourced vegetables, fruits, and organic produce directly from farmers in your area'
              : 'Browsing cached products - connect to internet for latest updates'
            }
          </p>
        </div>

        {/* Category Quick Links */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {categories.slice(1).map(cat => (
            <button
              key={cat.value}
              onClick={() => handleFilterChange('category', filters.category === cat.value ? '' : cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filters.category === cat.value
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              {cat.value === 'vegetables' && '🥕'}
              {cat.value === 'fruits' && '🍎'}
              {cat.value === 'grains' && '🌾'}
              {cat.value === 'dairy' && '🥛'}
              {cat.value === 'meat' && '🥩'}
              {cat.value === 'herbs' && '🌿'}
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>

          {/* Category */}
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          {/* Price Range */}
          <div className="flex space-x-2">
            <input
              type="number"
              placeholder="Min ₹"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
            <input
              type="number"
              placeholder="Max ₹"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </div>

          {/* Sort */}
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-')
              setFilters(prev => ({ ...prev, sortBy, sortOrder }))
            }}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="averageRating-desc">Highest Rated</option>
          </select>
        </div>

        <div className="mt-4 flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              checked={filters.isOrganic === 'true'}
              onChange={(e) => handleFilterChange('isOrganic', e.target.checked ? 'true' : '')}
            />
            <span className="ml-2 text-sm text-gray-700">Organic Only</span>
          </label>
        </div>
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
              <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
              <div className="bg-gray-300 h-4 rounded mb-2"></div>
              <div className="bg-gray-300 h-4 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products?.map((product) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="relative">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'block'
                      }}
                    />
                  ) : null}
                  <div style={{ display: product.images?.[0] ? 'none' : 'block' }}>
                    <PlaceholderImage category={product.category} className="w-full h-48 rounded-t-lg" />
                  </div>

                  {product.isOrganic && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                      🌱 Organic
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full">
                    {product.quantity} left
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{product.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full capitalize">
                        {product.category}
                      </span>
                      {product.isOrganic && (
                        <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                          Certified Organic
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {renderStars(product.averageRating)}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      {product.averageRating} ({product.ratings?.length || 0} reviews)
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-bold text-green-600">
                        ₹{product.price}
                      </span>
                      <span className="text-sm text-gray-500">per {product.unit}</span>
                    </div>
                    <div className={`text-sm font-medium ${product.quantity > 10 ? 'text-green-600' :
                      product.quantity > 5 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                      {product.quantity > 10 ? 'In Stock' :
                        product.quantity > 5 ? 'Low Stock' : 'Almost Gone'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="truncate">{product.farmer?.farmerProfile?.farmName || product.farmer?.name}</span>
                    </div>
                    <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      Fresh
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-4 py-2 border rounded-lg ${page === pageNum
                      ? 'bg-green-600 text-white border-green-600'
                      : 'border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Products
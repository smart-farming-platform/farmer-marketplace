import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { Brain, Star, TrendingUp, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const SmartRecommendations = ({ limit = 6 }) => {
    const { data, isLoading, error } = useQuery(
        ['aiRecommendations', limit],
        () => axios.get(`/api/ai/smart-recommendations?limit=${limit}`).then(res => res.data),
        {
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 10 * 60 * 1000 // 10 minutes
        }
    )

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
            />
        ))
    }

    const getReasonIcon = (reason) => {
        if (reason.includes('frequently')) return <TrendingUp className="w-4 h-4 text-blue-500" />
        if (reason.includes('rated')) return <Star className="w-4 h-4 text-yellow-500" />
        if (reason.includes('organic')) return <Sparkles className="w-4 h-4 text-green-500" />
        return <Brain className="w-4 h-4 text-purple-500" />
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: limit }).map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="bg-gray-300 h-32 rounded-lg mb-3"></div>
                            <div className="bg-gray-300 h-4 rounded mb-2"></div>
                            <div className="bg-gray-300 h-4 rounded w-2/3"></div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (error || !data?.recommendations?.length) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Yet</h3>
                <p className="text-gray-600">
                    Start shopping to get personalized AI-powered recommendations!
                </p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${data.aiPowered ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {data.aiPowered ? 'AI Powered' : 'Smart Logic'}
                    </div>
                </div>

                {data.userPreferences?.topCategories?.length > 0 && (
                    <div className="text-sm text-gray-600">
                        Based on your {data.userPreferences.totalOrders} orders
                    </div>
                )}
            </div>

            {/* AI Explanation */}
            {data.aiExplanation && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                        <Brain className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-medium text-blue-900 mb-1">AI Insights</h4>
                            <p className="text-sm text-blue-800">{data.aiExplanation}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* User Preferences */}
            {data.userPreferences?.topCategories?.length > 0 && (
                <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                    <h4 className="text-sm font-medium text-purple-900 mb-2">Your Preferences</h4>
                    <div className="flex flex-wrap gap-2">
                        {data.userPreferences.topCategories.map((category, index) => (
                            <span
                                key={category}
                                className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium capitalize"
                            >
                                #{index + 1} {category}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.recommendations.map((product) => (
                    <Link
                        key={product._id}
                        to={`/products/${product._id}`}
                        className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                        {/* Product Image */}
                        <div className="aspect-w-1 aspect-h-1 relative">
                            <img
                                src={product.images?.[0] ? `/images/products/${product.images[0]}` : '/placeholder-product.jpg'}
                                alt={product.name}
                                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            {product.isOrganic && (
                                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                    Organic
                                </div>
                            )}
                        </div>

                        {/* Product Info */}
                        <div className="p-3">
                            <h4 className="font-medium text-gray-900 truncate mb-1">
                                {product.name}
                            </h4>

                            <div className="flex items-center space-x-1 mb-2">
                                {renderStars(product.averageRating)}
                                <span className="text-xs text-gray-500">
                                    ({product.reviews?.length || 0})
                                </span>
                            </div>

                            <div className="flex items-center justify-between mb-2">
                                <span className="text-lg font-bold text-green-600">
                                    ₹{product.price}
                                </span>
                                <span className="text-xs text-gray-500">
                                    per {product.unit}
                                </span>
                            </div>

                            {/* Recommendation Reason */}
                            <div className="flex items-center space-x-1 text-xs text-gray-600 bg-gray-50 rounded-md p-2">
                                {getReasonIcon(product.recommendationReason)}
                                <span className="truncate">{product.recommendationReason}</span>
                            </div>

                            {/* Farmer Info */}
                            <div className="mt-2 text-xs text-gray-500 truncate">
                                From: {product.farmer?.farmerProfile?.farmName || product.farmer?.name}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* View More */}
            <div className="mt-6 text-center">
                <Link
                    to="/products"
                    className="text-purple-600 hover:text-purple-500 text-sm font-medium"
                >
                    View All Products →
                </Link>
            </div>
        </div>
    )
}

export default SmartRecommendations
import { Star } from 'lucide-react'

const ReviewSummary = ({ averageRating, totalReviews, stats }) => {
    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-5 h-5 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
            />
        ))
    }

    const getPercentage = (count) => {
        return totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Overall Rating */}
                <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                        {averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center mb-2">
                        {renderStars(averageRating)}
                    </div>
                    <p className="text-sm text-gray-600">
                        Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* Rating Breakdown */}
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1 w-12">
                                <span className="text-sm text-gray-600">{rating}</span>
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${getPercentage(stats[rating] || 0)}%` }}
                                ></div>
                            </div>
                            <span className="text-sm text-gray-600 w-12 text-right">
                                {stats[rating] || 0}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Review Highlights */}
            {totalReviews > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-green-600">
                                {getPercentage((stats[5] || 0) + (stats[4] || 0))}%
                            </div>
                            <p className="text-sm text-gray-600">Positive Reviews</p>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-blue-600">
                                {Math.round(averageRating * 20)}%
                            </div>
                            <p className="text-sm text-gray-600">Overall Satisfaction</p>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-purple-600">
                                {totalReviews > 10 ? '95%' : '85%'}
                            </div>
                            <p className="text-sm text-gray-600">Would Recommend</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ReviewSummary
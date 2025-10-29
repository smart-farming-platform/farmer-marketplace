import { useState } from 'react'
import { Star, ThumbsUp, Camera, Shield } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const ReviewCard = ({ review, onHelpfulUpdate }) => {
    const [isHelpful, setIsHelpful] = useState(review.helpful?.includes(review.user._id) || false)
    const [helpfulCount, setHelpfulCount] = useState(review.helpful?.length || 0)

    const handleHelpful = async () => {
        try {
            const response = await axios.post(`/api/reviews/helpful/${review._id}`)
            setIsHelpful(response.data.isHelpful)
            setHelpfulCount(response.data.helpfulCount)
            if (onHelpfulUpdate) onHelpfulUpdate(review._id, response.data.helpfulCount)
        } catch (error) {
            toast.error('Failed to update helpful status')
        }
    }

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
            />
        ))
    }

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        {review.user.avatar ? (
                            <img
                                src={`/api/uploads/avatars/${review.user.avatar}`}
                                alt={review.user.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-green-600 font-medium">
                                {review.user.name.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{review.user.name}</h4>
                            {review.verified && (
                                <div className="flex items-center text-green-600">
                                    <Shield className="w-4 h-4 mr-1" />
                                    <span className="text-xs">Verified Purchase</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                                {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Content */}
            <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
                <div className="mb-4">
                    <div className="flex items-center mb-2">
                        <Camera className="w-4 h-4 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-500">Customer Photos</span>
                    </div>
                    <div className="flex space-x-2 overflow-x-auto">
                        {review.images.map((image, index) => (
                            <img
                                key={index}
                                src={`/api/uploads/reviews/${image}`}
                                alt={`Review ${index + 1}`}
                                className="w-20 h-20 object-cover rounded-lg flex-shrink-0 cursor-pointer hover:opacity-80"
                                onClick={() => window.open(`/api/uploads/reviews/${image}`, '_blank')}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                    onClick={handleHelpful}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm transition-colors ${isHelpful
                            ? 'bg-green-100 text-green-700'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful ({helpfulCount})</span>
                </button>

                <div className="text-xs text-gray-400">
                    Review #{review._id.slice(-6)}
                </div>
            </div>
        </div>
    )
}

export default ReviewCard
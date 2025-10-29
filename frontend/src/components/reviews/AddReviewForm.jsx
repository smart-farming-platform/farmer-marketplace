import { useState } from 'react'
import { Star, Camera, X } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AddReviewForm = ({ productId, onReviewAdded, onClose }) => {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState('')
    const [images, setImages] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files)
        if (files.length + images.length > 3) {
            toast.error('Maximum 3 images allowed')
            return
        }
        setImages([...images, ...files])
    }

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (rating === 0) {
            toast.error('Please select a rating')
            return
        }

        if (comment.trim().length < 10) {
            toast.error('Review must be at least 10 characters long')
            return
        }

        setIsSubmitting(true)

        try {
            const formData = new FormData()
            formData.append('rating', rating)
            formData.append('comment', comment.trim())

            images.forEach((image) => {
                formData.append('images', image)
            })

            const response = await axios.post(`/api/reviews/product/${productId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            toast.success('Review added successfully!')

            if (onReviewAdded) {
                onReviewAdded(response.data.review)
            }

            // Reset form
            setRating(0)
            setComment('')
            setImages([])

            if (onClose) {
                onClose()
            }

        } catch (error) {
            console.error('Add review error:', error)
            toast.error(error.response?.data?.message || 'Failed to add review')
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderStars = () => {
        return Array.from({ length: 5 }, (_, i) => {
            const starValue = i + 1
            return (
                <button
                    key={i}
                    type="button"
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none"
                >
                    <Star
                        className={`w-8 h-8 transition-colors ${starValue <= (hoverRating || rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300 hover:text-yellow-200'
                            }`}
                    />
                </button>
            )
        })
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating *
                    </label>
                    <div className="flex items-center space-x-1">
                        {renderStars()}
                        {rating > 0 && (
                            <span className="ml-2 text-sm text-gray-600">
                                {rating} out of 5 stars
                            </span>
                        )}
                    </div>
                </div>

                {/* Comment */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Review *
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Share your experience with this product..."
                        required
                        minLength={10}
                        maxLength={500}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                        {comment.length}/500 characters (minimum 10)
                    </div>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add Photos (Optional)
                    </label>
                    <div className="flex items-center space-x-4">
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={images.length >= 3}
                            />
                            <div className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                                <Camera className="w-4 h-4" />
                                <span className="text-sm">Add Photos</span>
                            </div>
                        </label>
                        <span className="text-xs text-gray-500">
                            Up to 3 images, max 3MB each
                        </span>
                    </div>

                    {/* Image Preview */}
                    {images.length > 0 && (
                        <div className="mt-3 flex space-x-2">
                            {images.map((image, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Preview ${index + 1}`}
                                        className="w-20 h-20 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3 pt-4">
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddReviewForm
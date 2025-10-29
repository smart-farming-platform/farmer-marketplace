import { useState } from 'react'
import { MessageSquare, Star, Send, ThumbsUp, X } from 'lucide-react'

const FloatingFeedbackButton = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const renderStars = (currentRating, interactive = false, onStarClick = null) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-5 h-5 ${i < currentRating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    } ${interactive ? 'cursor-pointer hover:text-yellow-300 transition-colors' : ''}`}
                onClick={() => interactive && onStarClick && onStarClick(i + 1)}
            />
        ))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (rating > 0 && comment.trim()) {
            setSubmitted(true)
            setTimeout(() => {
                setIsOpen(false)
                setSubmitted(false)
                setRating(0)
                setComment('')
            }, 2000)
        }
    }

    const handleQuickFeedback = (type) => {
        // Handle quick feedback (thumbs up, etc.)
        setSubmitted(true)
        setTimeout(() => {
            setIsOpen(false)
            setSubmitted(false)
        }, 1500)
    }

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 hover:scale-110 group"
                    title="Share Feedback"
                >
                    <MessageSquare className="w-6 h-6" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                </button>

                {/* Tooltip */}
                <div className="absolute bottom-16 right-0 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Share your feedback
                    <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-80 max-h-96 overflow-hidden">
                {/* Header */}
                <div className="bg-green-600 text-white p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <MessageSquare className="w-5 h-5" />
                        <span className="font-medium">Quick Feedback</span>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:text-green-200 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4">
                    {submitted ? (
                        <div className="text-center py-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <ThumbsUp className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">Thank You!</h3>
                            <p className="text-sm text-gray-600">Your feedback helps us improve</p>
                        </div>
                    ) : (
                        <>
                            {/* Quick Actions */}
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-3">How's your experience?</p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleQuickFeedback('positive')}
                                        className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded-lg hover:bg-green-200 transition-colors text-sm flex items-center justify-center"
                                    >
                                        <ThumbsUp className="w-4 h-4 mr-1" />
                                        Great!
                                    </button>
                                    <button
                                        onClick={() => setRating(3)}
                                        className="flex-1 bg-yellow-100 text-yellow-700 py-2 px-3 rounded-lg hover:bg-yellow-200 transition-colors text-sm flex items-center justify-center"
                                    >
                                        <Star className="w-4 h-4 mr-1" />
                                        Good
                                    </button>
                                </div>
                            </div>

                            {/* Detailed Feedback Form */}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Rate your experience
                                    </label>
                                    <div className="flex items-center space-x-1">
                                        {renderStars(rating, true, setRating)}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Comments (optional)
                                    </label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Tell us more..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                        rows="3"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={rating === 0}
                                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm flex items-center justify-center"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    Submit Feedback
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FloatingFeedbackButton
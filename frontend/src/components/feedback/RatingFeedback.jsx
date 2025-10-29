import { useState, useEffect } from 'react'
import { Star, TrendingUp, Award, Users, MessageSquare, Send, ThumbsUp, Heart, Gift } from 'lucide-react'

const RatingFeedback = () => {
    const [feedbackStats, setFeedbackStats] = useState({
        averageRating: 4.7,
        totalReviews: 1247,
        satisfactionRate: 94,
        repeatCustomers: 87
    })

    const [showFeedbackForm, setShowFeedbackForm] = useState(false)
    const [userRating, setUserRating] = useState(0)
    const [userComment, setUserComment] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

    const [recentFeedback, setRecentFeedback] = useState([
        {
            id: 1,
            user: "John D.",
            rating: 5,
            comment: "Amazing fresh vegetables! The tomatoes were perfect.",
            product: "Organic Tomatoes",
            date: "2 hours ago"
        },
        {
            id: 2,
            user: "Sarah M.",
            rating: 5,
            comment: "Fast delivery and excellent quality. Highly recommend!",
            product: "Fresh Lettuce",
            date: "5 hours ago"
        },
        {
            id: 3,
            user: "Mike R.",
            rating: 4,
            comment: "Good quality produce, will order again.",
            product: "Sweet Corn",
            date: "1 day ago"
        }
    ])

    const renderStars = (rating, interactive = false, onStarClick = null) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    } ${interactive ? 'cursor-pointer hover:text-yellow-300 transition-colors' : ''}`}
                onClick={() => interactive && onStarClick && onStarClick(i + 1)}
            />
        ))
    }

    const handleFeedbackSubmit = (e) => {
        e.preventDefault()
        if (userRating > 0 && userComment.trim()) {
            // Simulate feedback submission
            setFeedbackSubmitted(true)
            setTimeout(() => {
                setShowFeedbackForm(false)
                setFeedbackSubmitted(false)
                setUserRating(0)
                setUserComment('')
                setUserEmail('')
            }, 2000)
        }
    }

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Customer Rating Feedback
                    </h2>
                    <p className="text-lg text-gray-600">
                        Real feedback from our community of farmers and consumers
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                        <div className="flex items-center justify-center mb-3">
                            <Star className="w-8 h-8 text-yellow-500" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            {feedbackStats.averageRating}
                        </div>
                        <p className="text-sm text-gray-600">Average Rating</p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                        <div className="flex items-center justify-center mb-3">
                            <MessageSquare className="w-8 h-8 text-blue-500" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            {feedbackStats.totalReviews.toLocaleString()}
                        </div>
                        <p className="text-sm text-gray-600">Total Reviews</p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                        <div className="flex items-center justify-center mb-3">
                            <Award className="w-8 h-8 text-green-500" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            {feedbackStats.satisfactionRate}%
                        </div>
                        <p className="text-sm text-gray-600">Satisfaction Rate</p>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                        <div className="flex items-center justify-center mb-3">
                            <Users className="w-8 h-8 text-purple-500" />
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            {feedbackStats.repeatCustomers}%
                        </div>
                        <p className="text-sm text-gray-600">Repeat Customers</p>
                    </div>
                </div>

                {/* Recent Feedback */}
                <div className="bg-gray-50 rounded-lg p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-gray-900">Recent Customer Feedback</h3>
                        <div className="flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                            <span className="text-sm text-green-600 font-medium">Trending Positive</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recentFeedback.map((feedback) => (
                            <div key={feedback.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <span className="text-green-600 font-medium text-sm">
                                                {feedback.user.charAt(0)}
                                            </span>
                                        </div>
                                        <span className="font-medium text-gray-900">{feedback.user}</span>
                                    </div>
                                    <div className="flex items-center">
                                        {renderStars(feedback.rating)}
                                    </div>
                                </div>

                                <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                                    "{feedback.comment}"
                                </p>

                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span className="font-medium">{feedback.product}</span>
                                    <span>{feedback.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Enhanced Call to Action */}
                    <div className="text-center mt-8">
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
                            <div className="flex items-center justify-center mb-4">
                                <Heart className="w-6 h-6 text-red-500 mr-2" />
                                <span className="text-lg font-semibold text-gray-900">Love Our Service?</span>
                            </div>
                            <p className="text-gray-600 mb-4">
                                Your feedback helps us improve and helps other customers make better choices
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <button
                                    onClick={() => setShowFeedbackForm(true)}
                                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                                >
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Share Your Experience
                                </button>
                                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center">
                                    <Gift className="w-4 h-4 mr-2" />
                                    Get Rewards for Reviews
                                </button>
                            </div>
                        </div>

                        {/* Quick Rating Buttons */}
                        <div className="flex justify-center space-x-4 mb-4">
                            <button className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full hover:bg-green-200 transition-colors">
                                <ThumbsUp className="w-4 h-4" />
                                <span>Quick Thumbs Up</span>
                            </button>
                            <button
                                onClick={() => setShowFeedbackForm(true)}
                                className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full hover:bg-blue-200 transition-colors"
                            >
                                <Star className="w-4 h-4" />
                                <span>Rate & Review</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div>
                        <div className="text-2xl font-bold text-green-600 mb-2">98%</div>
                        <p className="text-gray-600">On-time Delivery</p>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-green-600 mb-2">4.8/5</div>
                        <p className="text-gray-600">Product Quality</p>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-green-600 mb-2">24/7</div>
                        <p className="text-gray-600">Customer Support</p>
                    </div>
                </div>
            </div>

            {/* Feedback Form Modal */}
            {showFeedbackForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        {feedbackSubmitted ? (
                            <div className="text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ThumbsUp className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
                                <p className="text-gray-600 mb-4">Your feedback has been submitted successfully.</p>
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <p className="text-green-700 text-sm">
                                        🎁 You've earned 50 reward points for your review!
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-gray-900">Share Your Feedback</h3>
                                    <button
                                        onClick={() => setShowFeedbackForm(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <form onSubmit={handleFeedbackSubmit}>
                                    {/* Rating Section */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            How would you rate your experience?
                                        </label>
                                        <div className="flex items-center space-x-1">
                                            {renderStars(userRating, true, setUserRating)}
                                            <span className="ml-2 text-sm text-gray-600">
                                                {userRating > 0 && (
                                                    userRating === 5 ? 'Excellent!' :
                                                        userRating === 4 ? 'Very Good!' :
                                                            userRating === 3 ? 'Good' :
                                                                userRating === 2 ? 'Fair' : 'Poor'
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Comment Section */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Tell us about your experience
                                        </label>
                                        <textarea
                                            value={userComment}
                                            onChange={(e) => setUserComment(e.target.value)}
                                            placeholder="What did you love? What could we improve?"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            rows="4"
                                            required
                                        />
                                    </div>

                                    {/* Email Section */}
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email (optional - for reward points)
                                        </label>
                                        <input
                                            type="email"
                                            value={userEmail}
                                            onChange={(e) => setUserEmail(e.target.value)}
                                            placeholder="your@email.com"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Earn 50 reward points for verified reviews!
                                        </p>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowFeedbackForm(false)}
                                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={userRating === 0 || !userComment.trim()}
                                            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                        >
                                            <Send className="w-4 h-4 mr-2" />
                                            Submit Feedback
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}

export default RatingFeedback
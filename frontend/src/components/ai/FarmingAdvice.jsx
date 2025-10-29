import { useState } from 'react'
import { Lightbulb, Send, Loader, Sprout } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'

const FarmingAdvice = () => {
    const [query, setQuery] = useState('')
    const [advice, setAdvice] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [aiPowered, setAiPowered] = useState(false)
    const { user } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!query.trim()) return

        setIsLoading(true)
        setAdvice('')

        try {
            const response = await axios.post('/api/ai/farming-advice', {
                query: query.trim()
            })

            setAdvice(response.data.advice)
            setAiPowered(response.data.aiPowered)
        } catch (error) {
            console.error('Farming advice error:', error)
            setAdvice('Sorry, I couldn\'t get farming advice right now. Please try again later or contact our agricultural experts.')
        } finally {
            setIsLoading(false)
        }
    }

    const quickQuestions = [
        "How to improve soil quality for vegetables?",
        "Best time to plant tomatoes in India?",
        "Organic pest control methods",
        "Water management for small farms",
        "Crop rotation strategies"
    ]

    const handleQuickQuestion = (question) => {
        setQuery(question)
    }

    if (user?.role !== 'farmer') {
        return null
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
                <Sprout className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI Farming Advisor</h3>
                {aiPowered && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        AI Powered
                    </span>
                )}
            </div>

            <p className="text-gray-600 mb-4">
                Get personalized farming advice powered by AI. Ask about crops, soil, weather, pests, or any farming challenge.
            </p>

            {/* Quick Questions */}
            <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Quick Questions:</p>
                <div className="flex flex-wrap gap-2">
                    {quickQuestions.map((question, index) => (
                        <button
                            key={index}
                            onClick={() => handleQuickQuestion(question)}
                            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                        >
                            {question}
                        </button>
                    ))}
                </div>
            </div>

            {/* Query Form */}
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask your farming question..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!query.trim() || isLoading}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        {isLoading ? (
                            <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                        <span>Ask</span>
                    </button>
                </div>
            </form>

            {/* Advice Display */}
            {advice && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                        <Lightbulb className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="font-medium text-green-900 mb-2">Farming Advice:</h4>
                            <p className="text-green-800 whitespace-pre-wrap">{advice}</p>
                        </div>
                    </div>
                </div>
            )}

            {isLoading && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                        <Loader className="w-5 h-5 text-gray-600 animate-spin" />
                        <p className="text-gray-600">Getting AI-powered farming advice...</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FarmingAdvice
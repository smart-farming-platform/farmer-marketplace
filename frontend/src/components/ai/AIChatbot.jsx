import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, Bot, User, X, Minimize2 } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../../contexts/AuthContext'

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            message: "Hi! I'm AgroConnect AI Assistant powered by advanced AI. How can I help you today?",
            timestamp: new Date(),
            aiPowered: true
        }
    ])
    const [inputMessage, setInputMessage] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [aiStatus, setAiStatus] = useState({ enabled: false, checked: false })
    const messagesEndRef = useRef(null)
    const { isAuthenticated, user } = useAuth()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const sendMessage = async (e) => {
        e.preventDefault()

        if (!inputMessage.trim()) return

        const userMessage = {
            id: Date.now(),
            type: 'user',
            message: inputMessage.trim(),
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInputMessage('')
        setIsTyping(true)

        try {
            let response

            if (isAuthenticated) {
                // Use AI API for authenticated users
                response = await axios.post('/api/ai/chatbot', {
                    message: inputMessage.trim()
                })
            } else {
                // Simple responses for non-authenticated users
                response = { data: { response: getSimpleResponse(inputMessage.trim()) } }
            }

            // Simulate typing delay
            setTimeout(() => {
                const botMessage = {
                    id: Date.now() + 1,
                    type: 'bot',
                    message: response.data.response,
                    timestamp: new Date(),
                    aiPowered: response.data.aiPowered || false
                }
                setMessages(prev => [...prev, botMessage])
                setIsTyping(false)

                // Update AI status
                if (!aiStatus.checked) {
                    setAiStatus({ enabled: response.data.aiPowered || false, checked: true })
                }
            }, 1000)

        } catch (error) {
            console.error('Chatbot error:', error)
            const errorMessage = {
                id: Date.now() + 1,
                type: 'bot',
                message: "Sorry, I'm having trouble right now. Please try again later or contact our support team.",
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
            setIsTyping(false)
        }
    }

    const getSimpleResponse = (message) => {
        const lowerMessage = message.toLowerCase()

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return "Hello! Welcome to AgroConnect. I can help you with information about our platform, products, and farmers."
        }
        if (lowerMessage.includes('product') || lowerMessage.includes('buy')) {
            return "You can browse fresh products from local farmers in our Products section. We have fruits, vegetables, dairy, and more!"
        }
        if (lowerMessage.includes('farmer') || lowerMessage.includes('sell')) {
            return "Farmers can join AgroConnect to sell directly to consumers. Sign up as a farmer to start listing your products!"
        }
        if (lowerMessage.includes('order') || lowerMessage.includes('delivery')) {
            return "Orders are processed quickly and delivered fresh from local farms. You can track your orders in the dashboard."
        }
        if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
            return "Our platform ensures fair pricing by eliminating intermediaries. Farmers get better prices and consumers save money!"
        }

        return "I'm here to help with AgroConnect! You can ask me about products, farmers, orders, or how our platform works."
    }

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors z-50"
            >
                <MessageCircle className="w-6 h-6" />
            </button>
        )
    }

    return (
        <div className={`fixed bottom-6 right-6 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transition-all duration-300 ${isMinimized ? 'w-80 h-16' : 'w-80 h-96'
            }`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-green-600 text-white rounded-t-lg">
                <div className="flex items-center space-x-2">
                    <Bot className="w-5 h-5" />
                    <span className="font-medium">AgroConnect AI</span>
                    {aiStatus.checked && (
                        <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${aiStatus.enabled ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'
                            }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${aiStatus.enabled ? 'bg-white animate-pulse' : 'bg-orange-300'
                                }`}></div>
                            <span>{aiStatus.enabled ? 'AI' : 'Basic'}</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="text-white hover:text-green-200"
                    >
                        <Minimize2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:text-green-200"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 h-64 space-y-3">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex items-start space-x-2 max-w-xs ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                                    }`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'user'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-200 text-gray-600'
                                        }`}>
                                        {message.type === 'user' ? (
                                            <User className="w-3 h-3" />
                                        ) : (
                                            <Bot className="w-3 h-3" />
                                        )}
                                    </div>
                                    <div className={`rounded-lg p-3 ${message.type === 'user'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 text-gray-900'
                                        }`}>
                                        <p className="text-sm">{message.message}</p>
                                        <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-green-200' : 'text-gray-500'
                                            }`}>
                                            {formatTime(message.timestamp)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="flex items-start space-x-2 max-w-xs">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-3 h-3" />
                                    </div>
                                    <div className="bg-gray-100 rounded-lg p-3">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Ask me anything about AgroConnect..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                disabled={isTyping}
                            />
                            <button
                                type="submit"
                                disabled={!inputMessage.trim() || isTyping}
                                className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    )
}

export default AIChatbot
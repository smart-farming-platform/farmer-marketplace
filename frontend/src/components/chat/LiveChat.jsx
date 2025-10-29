import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, User, Headphones, X, Minimize2, Phone, Video, PhoneCall, PhoneOff, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import AudioCallService from '../../services/audioCallService'
import VideoCallWidget from './VideoCallWidget'

const LiveChat = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'support',
            message: "Hello! Welcome to AgroConnect Live Support. How can I help you today?",
            timestamp: new Date(),
            agent: "Sarah"
        }
    ])
    const [inputMessage, setInputMessage] = useState('')
    const [isTyping, setIsTyping] = useState(false)

    const [isCallActive, setIsCallActive] = useState(false)
    const [isCallConnecting, setIsCallConnecting] = useState(false)
    const [isVideoCallActive, setIsVideoCallActive] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [isSpeakerOn, setIsSpeakerOn] = useState(true)
    const [callDuration, setCallDuration] = useState(0)
    const [hasAudioPermission, setHasAudioPermission] = useState(false)
    const [hasVideoPermission, setHasVideoPermission] = useState(false)
    const messagesEndRef = useRef(null)
    const audioRef = useRef(null)
    const localStreamRef = useRef(null)
    const callTimerRef = useRef(null)
    const audioServiceRef = useRef(null)
    const { } = useAuth()

    // Initialize audio service
    useEffect(() => {
        audioServiceRef.current = new AudioCallService()

        // Set up callbacks
        audioServiceRef.current.setCallStateChangeCallback((state) => {
            console.log('Call state changed:', state)
        })

        audioServiceRef.current.setRemoteStreamCallback((stream) => {
            if (audioRef.current) {
                audioRef.current.srcObject = stream
            }
        })

        return () => {
            if (audioServiceRef.current) {
                audioServiceRef.current.endCall()
            }
        }
    }, [])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Check media permissions on component mount
    useEffect(() => {
        checkMediaPermissions()
    }, [])

    // Call timer effect
    useEffect(() => {
        if (isCallActive) {
            callTimerRef.current = setInterval(() => {
                setCallDuration(prev => prev + 1)
            }, 1000)
        } else {
            if (callTimerRef.current) {
                clearInterval(callTimerRef.current)
            }
            setCallDuration(0)
        }

        return () => {
            if (callTimerRef.current) {
                clearInterval(callTimerRef.current)
            }
        }
    }, [isCallActive])

    const checkMediaPermissions = async () => {
        try {
            // Check both audio and video permissions
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            setHasAudioPermission(true)
            setHasVideoPermission(true)
            stream.getTracks().forEach(track => track.stop())
        } catch (error) {
            console.error('Media permissions check failed:', error)

            // Check individually
            try {
                const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
                setHasAudioPermission(true)
                audioStream.getTracks().forEach(track => track.stop())
            } catch (audioError) {
                console.error('Audio permission denied:', audioError)
                setHasAudioPermission(false)
            }

            try {
                const videoStream = await navigator.mediaDevices.getUserMedia({ video: true })
                setHasVideoPermission(true)
                videoStream.getTracks().forEach(track => track.stop())
            } catch (videoError) {
                console.error('Video permission denied:', videoError)
                setHasVideoPermission(false)
            }
        }
    }

    const startAudioCall = async () => {
        try {
            setIsCallConnecting(true)

            // Get user media (audio only)
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            })

            localStreamRef.current = stream

            // Simulate connection delay
            setTimeout(() => {
                setIsCallConnecting(false)
                setIsCallActive(true)

                // Add call started message
                const callMessage = {
                    id: Date.now(),
                    type: 'system',
                    message: "🔊 Audio call started with support agent Sarah",
                    timestamp: new Date()
                }
                setMessages(prev => [...prev, callMessage])

                // Simulate agent joining
                setTimeout(() => {
                    const agentMessage = {
                        id: Date.now() + 1,
                        type: 'support',
                        message: "Hi! I'm now on the call. How can I help you today?",
                        timestamp: new Date(),
                        agent: "Sarah"
                    }
                    setMessages(prev => [...prev, agentMessage])
                }, 2000)

            }, 2000)

        } catch (error) {
            console.error('Failed to start audio call:', error)
            setIsCallConnecting(false)

            const errorMessage = {
                id: Date.now(),
                type: 'system',
                message: "❌ Failed to start audio call. Please check your microphone permissions.",
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        }
    }

    const endAudioCall = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop())
            localStreamRef.current = null
        }

        setIsCallActive(false)
        setIsCallConnecting(false)
        setIsMuted(false)

        const callEndMessage = {
            id: Date.now(),
            type: 'system',
            message: `📞 Call ended. Duration: ${formatCallDuration(callDuration)}`,
            timestamp: new Date()
        }
        setMessages(prev => [...prev, callEndMessage])
    }

    const toggleMute = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0]
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled
                setIsMuted(!audioTrack.enabled)
            }
        }
    }

    const toggleSpeaker = () => {
        setIsSpeakerOn(!isSpeakerOn)
        // In a real implementation, this would control audio output routing
    }

    const handleVideoCallStateChange = (state) => {
        if (state === 'video-connected') {
            setIsVideoCallActive(true)
        } else if (state === 'disconnected') {
            setIsVideoCallActive(false)
        }
    }

    const addVideoCallMessage = (message) => {
        setMessages(prev => [...prev, message])
    }

    const formatCallDuration = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

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

        // Simulate support agent response
        setTimeout(() => {
            const responses = [
                "Thank you for reaching out! I'm looking into that for you right now.",
                "That's a great question! Let me help you with that.",
                "I understand your concern. Here's what I can do to help...",
                "Thanks for contacting AgroConnect support. I'll assist you with this issue.",
                "I see what you're asking about. Let me provide you with the information you need.",
                "Great! I'm here to help you get the most out of AgroConnect."
            ]

            const supportMessage = {
                id: Date.now() + 1,
                type: 'support',
                message: responses[Math.floor(Math.random() * responses.length)],
                timestamp: new Date(),
                agent: "Sarah"
            }
            setMessages(prev => [...prev, supportMessage])
            setIsTyping(false)
        }, 1500)
    }

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const quickActions = [
        "I need help with my order",
        "How do I contact a farmer?",
        "Payment issues",
        "Product quality concerns",
        "Delivery questions"
    ]

    const sendQuickMessage = (message) => {
        setInputMessage(message)
    }

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 left-6 z-50">
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors group"
                >
                    <MessageCircle className="w-6 h-6" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                </button>
                <div className="absolute bottom-16 left-0 bg-white rounded-lg shadow-lg p-3 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-sm text-gray-700 whitespace-nowrap">Need help? Chat with us!</p>
                </div>
            </div>
        )
    }

    return (
        <div className={`fixed bottom-6 left-6 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transition-all duration-300 ${isMinimized ? 'w-80 h-16' : 'w-80 h-96'
            }`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
                <div className="flex items-center space-x-2">
                    <Headphones className="w-5 h-5" />
                    <div>
                        <span className="font-medium">Live Support</span>
                        <div className="flex items-center space-x-1 text-xs">
                            <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                            <span>Sarah is online</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {!isCallActive && !isCallConnecting && (
                        <button
                            onClick={startAudioCall}
                            className="text-white hover:text-blue-200 p-1 rounded"
                            title="Start Audio Call"
                            disabled={!hasAudioPermission}
                        >
                            <Phone className="w-4 h-4" />
                        </button>
                    )}

                    {isCallConnecting && (
                        <div className="flex items-center space-x-1 text-white">
                            <PhoneCall className="w-4 h-4 animate-pulse" />
                            <span className="text-xs">Connecting...</span>
                        </div>
                    )}

                    {isCallActive && (
                        <>
                            <div className="flex items-center space-x-1 text-white">
                                <PhoneCall className="w-4 h-4 text-green-300" />
                                <span className="text-xs">{formatCallDuration(callDuration)}</span>
                            </div>
                            <button
                                onClick={toggleMute}
                                className={`p-1 rounded ${isMuted ? 'bg-red-500' : 'hover:bg-blue-500'}`}
                                title={isMuted ? 'Unmute' : 'Mute'}
                            >
                                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={toggleSpeaker}
                                className={`p-1 rounded ${!isSpeakerOn ? 'bg-gray-500' : 'hover:bg-blue-500'}`}
                                title={isSpeakerOn ? 'Mute Speaker' : 'Unmute Speaker'}
                            >
                                {isSpeakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={endAudioCall}
                                className="bg-red-500 hover:bg-red-600 p-1 rounded"
                                title="End Call"
                            >
                                <PhoneOff className="w-4 h-4" />
                            </button>
                        </>
                    )}

                    <VideoCallWidget
                        onCallStateChange={handleVideoCallStateChange}
                        onAddMessage={addVideoCallMessage}
                    />
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="text-white hover:text-blue-200"
                    >
                        <Minimize2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:text-blue-200"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Connection Status */}
                    <div className={`px-4 py-2 border-b ${isCallActive
                        ? 'bg-blue-50 border-blue-200'
                        : isCallConnecting
                            ? 'bg-yellow-50 border-yellow-200'
                            : 'bg-green-50 border-green-200'
                        }`}>
                        <div className={`flex items-center justify-between text-sm ${isCallActive
                            ? 'text-blue-700'
                            : isCallConnecting
                                ? 'text-yellow-700'
                                : 'text-green-700'
                            }`}>
                            <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full animate-pulse ${isCallActive
                                    ? 'bg-blue-500'
                                    : isCallConnecting
                                        ? 'bg-yellow-500'
                                        : 'bg-green-500'
                                    }`}></div>
                                <span>
                                    {isCallActive
                                        ? `🔊 On call with Sarah • ${formatCallDuration(callDuration)}`
                                        : isCallConnecting
                                            ? '📞 Connecting to audio call...'
                                            : 'Connected to live support'
                                    }
                                </span>
                            </div>

                            {(!hasAudioPermission || !hasVideoPermission) && (
                                <button
                                    onClick={checkMediaPermissions}
                                    className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded hover:bg-orange-200"
                                >
                                    Enable Media
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 h-48 space-y-3">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex items-start space-x-2 max-w-xs ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                                    }`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : message.type === 'system'
                                            ? 'bg-orange-200 text-orange-600'
                                            : 'bg-gray-200 text-gray-600'
                                        }`}>
                                        {message.type === 'user' ? (
                                            <User className="w-3 h-3" />
                                        ) : message.type === 'system' ? (
                                            <Phone className="w-3 h-3" />
                                        ) : (
                                            <Headphones className="w-3 h-3" />
                                        )}
                                    </div>
                                    <div className={`rounded-lg p-3 ${message.type === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : message.type === 'system'
                                            ? 'bg-orange-100 text-orange-800'
                                            : 'bg-gray-100 text-gray-900'
                                        }`}>
                                        <p className="text-sm">{message.message}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className={`text-xs ${message.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                                                }`}>
                                                {formatTime(message.timestamp)}
                                            </p>
                                            {message.agent && (
                                                <p className="text-xs text-gray-500">
                                                    {message.agent}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="flex items-start space-x-2 max-w-xs">
                                    <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center flex-shrink-0">
                                        <Headphones className="w-3 h-3" />
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

                    {/* Quick Actions */}
                    <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
                        <p className="text-xs text-gray-600 mb-2">Quick actions:</p>
                        <div className="flex flex-wrap gap-1">
                            {quickActions.slice(0, 3).map((action, index) => (
                                <button
                                    key={index}
                                    onClick={() => sendQuickMessage(action)}
                                    className="text-xs bg-white border border-gray-200 rounded-full px-2 py-1 hover:bg-gray-100 transition-colors"
                                >
                                    {action}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Input */}
                    <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                disabled={isTyping}
                            />
                            <button
                                type="submit"
                                disabled={!inputMessage.trim() || isTyping}
                                className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default LiveChat
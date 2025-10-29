import { useState } from 'react'
import { Video, Phone, MessageCircle, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import VideoCallWidget from '../components/chat/VideoCallWidget'
import AudioCallWidget from '../components/chat/AudioCallWidget'

const VideoCallDemo = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'system',
            message: "Welcome to AgroConnect Video Call Demo! Try starting an audio or video call.",
            timestamp: new Date()
        }
    ])

    const addMessage = (message) => {
        setMessages(prev => [...prev, message])
    }

    const handleCallStateChange = (state) => {
        console.log('Call state changed:', state)
    }

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/"
                                className="text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Video Call Demo</h1>
                                <p className="text-gray-600">Test audio and video calling features</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">AgroConnect Support</span>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Demo Controls */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
                            Call Controls
                        </h2>

                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <h3 className="font-medium text-blue-900 mb-2 flex items-center">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Audio Call
                                </h3>
                                <p className="text-blue-700 text-sm mb-3">
                                    Start an audio-only call with voice communication
                                </p>
                                <div className="flex items-center justify-center p-4 bg-blue-600 rounded-lg">
                                    <AudioCallWidget
                                        onCallStateChange={handleCallStateChange}
                                        onAddMessage={addMessage}
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-green-50 rounded-lg">
                                <h3 className="font-medium text-green-900 mb-2 flex items-center">
                                    <Video className="w-4 h-4 mr-2" />
                                    Video Call
                                </h3>
                                <p className="text-green-700 text-sm mb-3">
                                    Start a video call with both audio and video
                                </p>
                                <div className="flex items-center justify-center p-4 bg-green-600 rounded-lg">
                                    <VideoCallWidget
                                        onCallStateChange={handleCallStateChange}
                                        onAddMessage={addMessage}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                                <li>• Real-time audio/video communication</li>
                                <li>• Mute/unmute microphone (M key)</li>
                                <li>• Enable/disable camera (V key)</li>
                                <li>• Speaker volume control</li>
                                <li>• Call duration tracking</li>
                                <li>• Fullscreen video mode (F key)</li>
                                <li>• Picture-in-picture local video</li>
                                <li>• Multiple exit options (X button, phone button, ESC key)</li>
                                <li>• Keyboard shortcuts for easy control</li>
                            </ul>
                        </div>
                    </div>

                    {/* Message Log */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <h2 className="text-xl font-semibold mb-4">Call Activity Log</h2>

                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`p-3 rounded-lg ${message.type === 'system'
                                        ? 'bg-blue-50 border border-blue-200'
                                        : message.type === 'support'
                                            ? 'bg-green-50 border border-green-200'
                                            : 'bg-gray-50 border border-gray-200'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <p className={`text-sm ${message.type === 'system'
                                            ? 'text-blue-800'
                                            : message.type === 'support'
                                                ? 'text-green-800'
                                                : 'text-gray-800'
                                            }`}>
                                            {message.message}
                                        </p>
                                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                            {formatTime(message.timestamp)}
                                        </span>
                                    </div>
                                    {message.agent && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Agent: {message.agent}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {messages.length === 1 && (
                            <div className="text-center py-8 text-gray-500">
                                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>Start a call to see activity here</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold mb-4">How to Test</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-medium text-gray-900 mb-2">Audio Call Testing:</h3>
                            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                                <li>Click the phone icon to start an audio call</li>
                                <li>Allow microphone access when prompted</li>
                                <li>Wait for the simulated connection</li>
                                <li>Use mute/unmute and speaker controls</li>
                                <li>End the call with the red phone button</li>
                            </ol>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-900 mb-2">Video Call Testing:</h3>
                            <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                                <li>Click the video icon to start a video call</li>
                                <li>Allow camera and microphone access</li>
                                <li>Wait for the simulated connection</li>
                                <li>Toggle video on/off and use audio controls</li>
                                <li>Try fullscreen mode and keyboard shortcuts</li>
                                <li>End the call using X button, red phone button, or ESC key</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoCallDemo
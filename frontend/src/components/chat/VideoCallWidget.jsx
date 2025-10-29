import { useState, useEffect, useRef } from 'react'
import { Video, VideoOff, PhoneOff, Mic, MicOff, Volume2, VolumeX, Maximize2, Minimize2, Loader, X } from 'lucide-react'

const VideoCallWidget = ({ onCallStateChange, onAddMessage }) => {
    const [isCallActive, setIsCallActive] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoEnabled, setIsVideoEnabled] = useState(true)
    const [isSpeakerOn, setIsSpeakerOn] = useState(true)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [callDuration, setCallDuration] = useState(0)
    const [hasPermissions, setHasPermissions] = useState({ audio: false, video: false })
    const [showExitConfirm, setShowExitConfirm] = useState(false)

    const localVideoRef = useRef(null)
    const remoteVideoRef = useRef(null)
    const localStreamRef = useRef(null)
    const remoteStreamRef = useRef(null)
    const timerRef = useRef(null)

    // Check media permissions on mount
    useEffect(() => {
        checkMediaPermissions()
    }, [])

    // Call timer
    useEffect(() => {
        if (isCallActive) {
            timerRef.current = setInterval(() => {
                setCallDuration(prev => prev + 1)
            }, 1000)
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
            setCallDuration(0)
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
    }, [isCallActive])

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (isCallActive || isConnecting) {
                if (e.key === 'Escape') {
                    if (showExitConfirm) {
                        setShowExitConfirm(false)
                    } else {
                        confirmEndCall()
                    }
                } else if (e.key === 'm' || e.key === 'M') {
                    toggleMute()
                } else if (e.key === 'v' || e.key === 'V') {
                    toggleVideo()
                } else if (e.key === 'f' || e.key === 'F') {
                    toggleFullscreen()
                }
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [isCallActive, isConnecting, showExitConfirm])

    const checkMediaPermissions = async () => {
        try {
            // Check both audio and video permissions
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            setHasPermissions({ audio: true, video: true })
            stream.getTracks().forEach(track => track.stop())
        } catch (error) {
            console.error('Media permissions check failed:', error)

            // Check individually
            try {
                const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
                audioStream.getTracks().forEach(track => track.stop())
                setHasPermissions(prev => ({ ...prev, audio: true }))
            } catch (audioError) {
                console.error('Audio permission denied:', audioError)
            }

            try {
                const videoStream = await navigator.mediaDevices.getUserMedia({ video: true })
                videoStream.getTracks().forEach(track => track.stop())
                setHasPermissions(prev => ({ ...prev, video: true }))
            } catch (videoError) {
                console.error('Video permission denied:', videoError)
            }
        }
    }

    const startVideoCall = async () => {
        try {
            setIsConnecting(true)

            // Get user media (audio + video)
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                },
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    frameRate: { ideal: 30 }
                }
            })

            localStreamRef.current = stream

            // Display local video
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream
            }

            // Simulate connection delay and remote video
            setTimeout(() => {
                setIsConnecting(false)
                setIsCallActive(true)
                setIsVideoEnabled(true)

                // Create simulated remote video
                createSimulatedRemoteVideo()

                if (onCallStateChange) {
                    onCallStateChange('video-connected')
                }

                if (onAddMessage) {
                    onAddMessage({
                        id: Date.now(),
                        type: 'system',
                        message: "📹 Video call connected! You can now see and speak with our support agent.",
                        timestamp: new Date()
                    })
                }

                // Simulate agent response
                setTimeout(() => {
                    if (onAddMessage) {
                        onAddMessage({
                            id: Date.now() + 1,
                            type: 'support',
                            message: "Hello! I can see and hear you clearly. How can I help you today?",
                            timestamp: new Date(),
                            agent: "Sarah"
                        })
                    }
                }, 2000)

            }, 3000)

        } catch (error) {
            console.error('Failed to start video call:', error)
            setIsConnecting(false)

            if (onAddMessage) {
                onAddMessage({
                    id: Date.now(),
                    type: 'system',
                    message: "❌ Unable to start video call. Please check your camera and microphone permissions.",
                    timestamp: new Date()
                })
            }
        }
    }

    const createSimulatedRemoteVideo = () => {
        // Create a canvas for simulated remote video
        const canvas = document.createElement('canvas')
        canvas.width = 640
        canvas.height = 480
        const ctx = canvas.getContext('2d')

        let frame = 0
        const animate = () => {
            if (!isCallActive) return

            // Create animated background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
            gradient.addColorStop(0, `hsl(${(frame * 2) % 360}, 70%, 60%)`)
            gradient.addColorStop(1, `hsl(${(frame * 2 + 180) % 360}, 70%, 40%)`)

            ctx.fillStyle = gradient
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Add agent info
            ctx.fillStyle = 'white'
            ctx.font = 'bold 32px Arial'
            ctx.textAlign = 'center'
            ctx.fillText('Support Agent - Sarah', canvas.width / 2, canvas.height / 2 - 40)

            ctx.font = '24px Arial'
            ctx.fillText('AgroConnect Support', canvas.width / 2, canvas.height / 2)

            ctx.font = '18px Arial'
            ctx.fillText('(Demo Video Call)', canvas.width / 2, canvas.height / 2 + 40)

            // Add timestamp
            ctx.font = '16px Arial'
            ctx.textAlign = 'right'
            ctx.fillText(new Date().toLocaleTimeString(), canvas.width - 20, 30)

            frame++
            requestAnimationFrame(animate)
        }

        animate()

        // Create stream from canvas
        const stream = canvas.captureStream(30)
        remoteStreamRef.current = stream

        // Display remote video
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream
        }
    }

    const confirmEndCall = () => {
        setShowExitConfirm(true)
    }

    const endVideoCall = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop())
            localStreamRef.current = null
        }

        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null
        }

        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null
        }

        setIsCallActive(false)
        setIsConnecting(false)
        setIsMuted(false)
        setIsVideoEnabled(true)
        setIsFullscreen(false)
        setShowExitConfirm(false)

        if (onCallStateChange) {
            onCallStateChange('disconnected')
        }

        if (onAddMessage) {
            onAddMessage({
                id: Date.now(),
                type: 'system',
                message: `📹 Video call ended. Duration: ${formatDuration(callDuration)}. Thank you for contacting AgroConnect support!`,
                timestamp: new Date()
            })
        }
    }

    const toggleMute = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0]
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled
                setIsMuted(!audioTrack.enabled)

                if (onAddMessage) {
                    onAddMessage({
                        id: Date.now(),
                        type: 'system',
                        message: audioTrack.enabled ? "🎤 Microphone unmuted" : "🔇 Microphone muted",
                        timestamp: new Date()
                    })
                }
            }
        }
    }

    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0]
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled
                setIsVideoEnabled(videoTrack.enabled)

                if (onAddMessage) {
                    onAddMessage({
                        id: Date.now(),
                        type: 'system',
                        message: videoTrack.enabled ? "📹 Camera enabled" : "📷 Camera disabled",
                        timestamp: new Date()
                    })
                }
            }
        }
    }

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen)
    }

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    // If call is active, show video interface
    if (isCallActive || isConnecting) {
        return (
            <div className={`fixed inset-0 bg-black z-50 flex flex-col ${isFullscreen ? '' : 'rounded-lg'}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-gray-900 text-white">
                    <div className="flex items-center space-x-3">
                        <Video className="w-5 h-5 text-green-400" />
                        <div>
                            <span className="font-medium">Video Call - Sarah</span>
                            <div className="text-sm text-gray-300">
                                {isConnecting ? 'Connecting...' : `Duration: ${formatDuration(callDuration)}`}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={toggleFullscreen}
                            className="text-white hover:text-gray-300 p-2 rounded-lg transition-colors"
                            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                        >
                            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={confirmEndCall}
                            className="text-white hover:text-red-400 p-2 rounded-lg transition-colors"
                            title="Exit Video Call"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Video Area */}
                <div className="flex-1 relative bg-gray-900">
                    {/* Remote Video (Main) */}
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />

                    {/* Local Video (Picture-in-Picture) */}
                    <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                        {!isVideoEnabled && (
                            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                                <VideoOff className="w-8 h-8 text-gray-400" />
                            </div>
                        )}
                    </div>

                    {/* Connection Status */}
                    {isConnecting && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <div className="text-white text-center">
                                <Loader className="w-12 h-12 animate-spin mx-auto mb-4" />
                                <p className="text-xl">Connecting to video call...</p>
                                <p className="text-gray-300">Please wait while we connect you to our support agent</p>
                            </div>
                        </div>
                    )}

                    {/* Keyboard Shortcuts Hint */}
                    {isCallActive && (
                        <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white p-3 rounded-lg text-sm">
                            <div className="font-medium mb-1">Keyboard Shortcuts:</div>
                            <div className="space-y-1 text-xs">
                                <div><kbd className="bg-gray-700 px-1 rounded">ESC</kbd> Exit call</div>
                                <div><kbd className="bg-gray-700 px-1 rounded">M</kbd> Mute/Unmute</div>
                                <div><kbd className="bg-gray-700 px-1 rounded">V</kbd> Video on/off</div>
                                <div><kbd className="bg-gray-700 px-1 rounded">F</kbd> Fullscreen</div>
                            </div>
                        </div>
                    )}

                    {/* Exit Confirmation Dialog */}
                    {showExitConfirm && (
                        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-10">
                            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">End Video Call?</h3>
                                <p className="text-gray-600 mb-4">
                                    Are you sure you want to end this video call? This will disconnect you from the support agent.
                                </p>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={endVideoCall}
                                        className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        End Call
                                    </button>
                                    <button
                                        onClick={() => setShowExitConfirm(false)}
                                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                                    >
                                        Continue Call
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="p-6 bg-gray-900">
                    <div className="flex items-center justify-center space-x-4">
                        <button
                            onClick={toggleMute}
                            className={`p-3 rounded-full transition-colors ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                            title={isMuted ? 'Unmute' : 'Mute'}
                        >
                            {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
                        </button>

                        <button
                            onClick={toggleVideo}
                            className={`p-3 rounded-full transition-colors ${!isVideoEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                            title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
                        >
                            {isVideoEnabled ? <Video className="w-6 h-6 text-white" /> : <VideoOff className="w-6 h-6 text-white" />}
                        </button>

                        <button
                            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                            className={`p-3 rounded-full transition-colors ${!isSpeakerOn ? 'bg-gray-500' : 'bg-gray-700 hover:bg-gray-600'
                                }`}
                            title={isSpeakerOn ? 'Mute Speaker' : 'Unmute Speaker'}
                        >
                            {isSpeakerOn ? <Volume2 className="w-6 h-6 text-white" /> : <VolumeX className="w-6 h-6 text-white" />}
                        </button>

                        <button
                            onClick={confirmEndCall}
                            className="p-4 bg-red-500 hover:bg-red-600 rounded-full transition-colors shadow-lg border-2 border-red-400"
                            title="End Call (ESC)"
                        >
                            <PhoneOff className="w-7 h-7 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Video call button (when not in call)
    return (
        <div className="flex items-center space-x-2">
            <button
                onClick={startVideoCall}
                className="text-white hover:text-blue-200 p-1 rounded transition-colors"
                title="Start Video Call"
                disabled={!hasPermissions.audio || !hasPermissions.video}
            >
                <Video className="w-4 h-4" />
            </button>

            {/* Permission Warning */}
            {(!hasPermissions.audio || !hasPermissions.video) && (
                <button
                    onClick={checkMediaPermissions}
                    className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded hover:bg-orange-300 transition-colors"
                    title="Enable camera and microphone for video calls"
                >
                    📹 Enable
                </button>
            )}
        </div>
    )
}

export default VideoCallWidget
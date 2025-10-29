import { useState, useEffect, useRef } from 'react'
import { Phone, PhoneCall, PhoneOff, Mic, MicOff, Volume2, VolumeX, Loader } from 'lucide-react'

const AudioCallWidget = ({ onCallStateChange, onAddMessage }) => {
    const [isCallActive, setIsCallActive] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [isSpeakerOn, setIsSpeakerOn] = useState(true)
    const [callDuration, setCallDuration] = useState(0)
    const [hasPermission, setHasPermission] = useState(false)
    const [audioLevel, setAudioLevel] = useState(0)

    const streamRef = useRef(null)
    const timerRef = useRef(null)
    const audioContextRef = useRef(null)
    const analyserRef = useRef(null)

    // Check audio permissions on mount
    useEffect(() => {
        checkAudioPermissions()
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

    const checkAudioPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            setHasPermission(true)
            stream.getTracks().forEach(track => track.stop())
        } catch (error) {
            console.error('Audio permission denied:', error)
            setHasPermission(false)
        }
    }

    const startCall = async () => {
        try {
            setIsConnecting(true)

            // Get audio stream
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            })

            streamRef.current = stream

            // Set up audio level monitoring
            setupAudioLevelMonitoring(stream)

            // Simulate connection delay
            setTimeout(() => {
                setIsConnecting(false)
                setIsCallActive(true)

                if (onCallStateChange) {
                    onCallStateChange('connected')
                }

                if (onAddMessage) {
                    onAddMessage({
                        id: Date.now(),
                        type: 'system',
                        message: "🔊 Audio call connected! You can now speak with our support agent.",
                        timestamp: new Date()
                    })
                }

                // Simulate agent response
                setTimeout(() => {
                    if (onAddMessage) {
                        onAddMessage({
                            id: Date.now() + 1,
                            type: 'support',
                            message: "Hello! I can hear you clearly. What can I help you with today?",
                            timestamp: new Date(),
                            agent: "Sarah"
                        })
                    }
                }, 2000)

            }, 2500)

        } catch (error) {
            console.error('Failed to start call:', error)
            setIsConnecting(false)

            if (onAddMessage) {
                onAddMessage({
                    id: Date.now(),
                    type: 'system',
                    message: "❌ Unable to start audio call. Please check your microphone permissions.",
                    timestamp: new Date()
                })
            }
        }
    }

    const endCall = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
            streamRef.current = null
        }

        if (audioContextRef.current) {
            audioContextRef.current.close()
            audioContextRef.current = null
        }

        setIsCallActive(false)
        setIsConnecting(false)
        setIsMuted(false)
        setAudioLevel(0)

        if (onCallStateChange) {
            onCallStateChange('disconnected')
        }

        if (onAddMessage) {
            onAddMessage({
                id: Date.now(),
                type: 'system',
                message: `📞 Call ended. Duration: ${formatDuration(callDuration)}. Thank you for contacting AgroConnect support!`,
                timestamp: new Date()
            })
        }
    }

    const toggleMute = () => {
        if (streamRef.current) {
            const audioTrack = streamRef.current.getAudioTracks()[0]
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

    const setupAudioLevelMonitoring = (stream) => {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext
            audioContextRef.current = new AudioContextClass()
            analyserRef.current = audioContextRef.current.createAnalyser()

            const source = audioContextRef.current.createMediaStreamSource(stream)
            source.connect(analyserRef.current)

            analyserRef.current.fftSize = 256
            const bufferLength = analyserRef.current.frequencyBinCount
            const dataArray = new Uint8Array(bufferLength)

            const updateAudioLevel = () => {
                if (analyserRef.current && isCallActive) {
                    analyserRef.current.getByteFrequencyData(dataArray)
                    const average = dataArray.reduce((a, b) => a + b) / bufferLength
                    setAudioLevel(Math.round(average))
                    requestAnimationFrame(updateAudioLevel)
                }
            }

            updateAudioLevel()
        } catch (error) {
            console.error('Failed to set up audio monitoring:', error)
        }
    }

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="flex items-center space-x-2">
            {/* Audio Call Button */}
            {!isCallActive && !isConnecting && (
                <button
                    onClick={startCall}
                    className="text-white hover:text-blue-200 p-1 rounded transition-colors"
                    title="Start Audio Call"
                    disabled={!hasPermission}
                >
                    <Phone className="w-4 h-4" />
                </button>
            )}

            {/* Connecting State */}
            {isConnecting && (
                <div className="flex items-center space-x-1 text-white">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-xs">Connecting...</span>
                </div>
            )}

            {/* Active Call Controls */}
            {isCallActive && (
                <>
                    <div className="flex items-center space-x-1 text-white">
                        <PhoneCall className="w-4 h-4 text-green-300" />
                        <span className="text-xs font-mono">{formatDuration(callDuration)}</span>
                    </div>

                    {/* Audio Level Indicator */}
                    <div className="flex items-center space-x-1">
                        <div className="flex space-x-0.5">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-1 h-3 rounded-full transition-colors ${audioLevel > (i * 20) ? 'bg-green-400' : 'bg-gray-400'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={toggleMute}
                        className={`p-1 rounded transition-colors ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'hover:bg-blue-500'
                            }`}
                        title={isMuted ? 'Unmute' : 'Mute'}
                    >
                        {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    <button
                        onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                        className={`p-1 rounded transition-colors ${!isSpeakerOn ? 'bg-gray-500' : 'hover:bg-blue-500'
                            }`}
                        title={isSpeakerOn ? 'Mute Speaker' : 'Unmute Speaker'}
                    >
                        {isSpeakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>

                    <button
                        onClick={endCall}
                        className="bg-red-500 hover:bg-red-600 p-1 rounded transition-colors"
                        title="End Call"
                    >
                        <PhoneOff className="w-4 h-4" />
                    </button>
                </>
            )}

            {/* Permission Warning */}
            {!hasPermission && (
                <button
                    onClick={checkAudioPermissions}
                    className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded hover:bg-orange-300 transition-colors"
                    title="Enable microphone for audio calls"
                >
                    🎤 Enable
                </button>
            )}

            {/* Hidden audio element for remote stream */}
            <audio autoPlay hidden />
        </div>
    )
}

export default AudioCallWidget
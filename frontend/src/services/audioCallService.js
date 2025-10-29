class AudioCallService {
    constructor() {
        this.localStream = null
        this.remoteStream = null
        this.peerConnection = null
        this.isCallActive = false
        this.isMuted = false
        this.isVideoEnabled = false
        this.isVideoCall = false
        this.callStartTime = null
        this.onCallStateChange = null
        this.onRemoteStream = null
        this.onLocalStream = null

        // WebRTC configuration
        this.rtcConfig = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        }
    }

    // Initialize call (audio or video)
    async initializeCall(isVideoCall = false) {
        try {
            this.isVideoCall = isVideoCall

            // Get user media (audio only or audio + video)
            const constraints = {
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 44100
                }
            }

            if (isVideoCall) {
                constraints.video = {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    frameRate: { ideal: 30 }
                }
                this.isVideoEnabled = true
            }

            this.localStream = await navigator.mediaDevices.getUserMedia(constraints)

            // Notify about local stream
            if (this.onLocalStream) {
                this.onLocalStream(this.localStream)
            }

            // Create peer connection
            this.peerConnection = new RTCPeerConnection(this.rtcConfig)

            // Add local stream to peer connection
            this.localStream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, this.localStream)
            })

            // Handle remote stream
            this.peerConnection.ontrack = (event) => {
                this.remoteStream = event.streams[0]
                if (this.onRemoteStream) {
                    this.onRemoteStream(this.remoteStream)
                }
            }

            // Handle ICE candidates
            this.peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    // In a real implementation, send this to the remote peer
                    console.log('ICE candidate:', event.candidate)
                }
            }

            // Handle connection state changes
            this.peerConnection.onconnectionstatechange = () => {
                const state = this.peerConnection.connectionState
                console.log('Connection state:', state)

                if (state === 'connected') {
                    this.isCallActive = true
                    this.callStartTime = Date.now()
                } else if (state === 'disconnected' || state === 'failed') {
                    this.endCall()
                }

                if (this.onCallStateChange) {
                    this.onCallStateChange(state)
                }
            }

            return true
        } catch (error) {
            console.error('Failed to initialize call:', error)
            throw error
        }
    }

    // Start call (audio or video)
    async startCall(isVideoCall = false) {
        try {
            await this.initializeCall(isVideoCall)

            // Simulate call connection delay
            return new Promise((resolve) => {
                setTimeout(() => {
                    this.isCallActive = true
                    this.callStartTime = Date.now()

                    // Simulate remote stream
                    if (isVideoCall) {
                        this.simulateRemoteVideo()
                    } else {
                        this.simulateRemoteAudio()
                    }

                    resolve(true)
                }, 2000)
            })
        } catch (error) {
            throw error
        }
    }

    // End the call
    endCall() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop())
            this.localStream = null
        }

        if (this.peerConnection) {
            this.peerConnection.close()
            this.peerConnection = null
        }

        this.isCallActive = false
        this.isVideoCall = false
        this.isVideoEnabled = false
        this.callStartTime = null
        this.remoteStream = null
    }

    // Toggle mute
    toggleMute() {
        if (this.localStream) {
            const audioTrack = this.localStream.getAudioTracks()[0]
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled
                this.isMuted = !audioTrack.enabled
                return this.isMuted
            }
        }
        return false
    }

    // Toggle video
    toggleVideo() {
        if (this.localStream && this.isVideoCall) {
            const videoTrack = this.localStream.getVideoTracks()[0]
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled
                this.isVideoEnabled = videoTrack.enabled
                return this.isVideoEnabled
            }
        }
        return false
    }

    // Get call duration in seconds
    getCallDuration() {
        if (this.callStartTime) {
            return Math.floor((Date.now() - this.callStartTime) / 1000)
        }
        return 0
    }

    // Check if microphone is available
    async checkMicrophonePermission() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            stream.getTracks().forEach(track => track.stop())
            return true
        } catch (error) {
            console.error('Microphone permission denied:', error)
            return false
        }
    }

    // Check if camera is available
    async checkCameraPermission() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true })
            stream.getTracks().forEach(track => track.stop())
            return true
        } catch (error) {
            console.error('Camera permission denied:', error)
            return false
        }
    }

    // Check both audio and video permissions
    async checkMediaPermissions() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            stream.getTracks().forEach(track => track.stop())
            return { audio: true, video: true }
        } catch (error) {
            console.error('Media permissions check failed:', error)

            // Check individually
            const audio = await this.checkMicrophonePermission()
            const video = await this.checkCameraPermission()

            return { audio, video }
        }
    }

    // Simulate remote audio for demo purposes
    simulateRemoteAudio() {
        // In a real implementation, this would handle the remote peer's audio stream
        // For demo purposes, we'll just log that remote audio is connected
        console.log('Remote audio connected (simulated)')

        // Simulate periodic audio activity indicators
        if (this.isCallActive) {
            setTimeout(() => {
                if (this.isCallActive && this.onRemoteStream) {
                    // Simulate remote audio activity
                    console.log('Remote audio activity detected')
                }
            }, 3000)
        }
    }

    // Simulate remote video for demo purposes
    simulateRemoteVideo() {
        // In a real implementation, this would handle the remote peer's video stream
        console.log('Remote video connected (simulated)')

        // Create a simulated remote stream for demo
        if (this.onRemoteStream) {
            // In a real app, this would be the actual remote peer's stream
            // For demo, we could create a canvas-based fake stream or use a test pattern
            this.createSimulatedRemoteStream()
        }
    }

    // Create a simulated remote video stream for demo
    async createSimulatedRemoteStream() {
        try {
            // Create a canvas for simulated remote video
            const canvas = document.createElement('canvas')
            canvas.width = 320
            canvas.height = 240
            const ctx = canvas.getContext('2d')

            // Draw a simple pattern
            ctx.fillStyle = '#4A90E2'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.fillStyle = 'white'
            ctx.font = '20px Arial'
            ctx.textAlign = 'center'
            ctx.fillText('Support Agent', canvas.width / 2, canvas.height / 2 - 10)
            ctx.fillText('(Demo Video)', canvas.width / 2, canvas.height / 2 + 20)

            // Create stream from canvas
            const stream = canvas.captureStream(30)

            // Add audio track (silent for demo)
            const AudioContextClass = window.AudioContext || window.webkitAudioContext
            const audioContext = new AudioContextClass()
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()
            gainNode.gain.value = 0 // Silent
            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)

            const dest = audioContext.createMediaStreamDestination()
            gainNode.connect(dest)

            // Add silent audio track to stream
            stream.addTrack(dest.stream.getAudioTracks()[0])

            this.remoteStream = stream

            if (this.onRemoteStream) {
                this.onRemoteStream(stream)
            }
        } catch (error) {
            console.error('Failed to create simulated remote stream:', error)
        }
    }

    // Set callback for call state changes
    setCallStateChangeCallback(callback) {
        this.onCallStateChange = callback
    }

    // Set callback for remote stream
    setRemoteStreamCallback(callback) {
        this.onRemoteStream = callback
    }

    // Set callback for local stream
    setLocalStreamCallback(callback) {
        this.onLocalStream = callback
    }

    // Get audio levels (for visual indicators)
    getAudioLevel() {
        // In a real implementation, this would analyze the audio stream
        // and return the current audio level for visual indicators
        return Math.random() * 100 // Simulated audio level
    }

    // Check WebRTC support
    static isWebRTCSupported() {
        return !!(navigator.mediaDevices &&
            navigator.mediaDevices.getUserMedia &&
            window.RTCPeerConnection)
    }
}

export default AudioCallService
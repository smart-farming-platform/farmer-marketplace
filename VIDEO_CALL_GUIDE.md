# Video Call Feature Guide

## Overview
AgroConnect now includes live video and audio calling functionality for real-time support and communication. This feature allows users to connect with support agents through high-quality audio and video calls.

## Features

### Audio Calls
- **High-quality audio** with echo cancellation and noise suppression
- **Mute/unmute** microphone control
- **Speaker volume** control
- **Audio level indicators** showing voice activity
- **Call duration tracking**
- **Permission management** for microphone access

### Video Calls
- **HD video calling** with camera and microphone
- **Picture-in-picture** local video display
- **Fullscreen mode** for immersive experience
- **Camera on/off** toggle during calls
- **Audio controls** (mute/unmute, speaker)
- **Simulated remote video** for demo purposes
- **Responsive design** that works on all screen sizes

## How to Use

### Starting a Call

1. **Audio Call**: Click the phone icon (📞) in the live chat widget
2. **Video Call**: Click the video icon (📹) in the live chat widget or visit `/video-call-demo`

### During a Call

#### Audio Call Controls:
- **Mute/Unmute**: Toggle microphone on/off
- **Speaker**: Control audio output
- **End Call**: Terminate the call

#### Video Call Controls:
- **Mute/Unmute**: Toggle microphone on/off
- **Camera On/Off**: Enable/disable video
- **Speaker**: Control audio output
- **Fullscreen**: Expand video to full screen
- **End Call**: Terminate the call

### Permissions Required

- **Microphone**: Required for all calls
- **Camera**: Required for video calls
- The system will prompt for permissions when starting a call

## Technical Implementation

### Components

1. **AudioCallWidget** (`frontend/src/components/chat/AudioCallWidget.jsx`)
   - Handles audio-only calls
   - Integrated into the live chat system
   - Provides audio level monitoring

2. **VideoCallWidget** (`frontend/src/components/chat/VideoCallWidget.jsx`)
   - Full-featured video calling interface
   - Fullscreen support
   - Picture-in-picture local video

3. **AudioCallService** (`frontend/src/services/audioCallService.js`)
   - WebRTC service for handling media streams
   - Supports both audio and video calls
   - Simulated remote streams for demo

4. **LiveChat** (`frontend/src/components/chat/LiveChat.jsx`)
   - Integrated chat with call functionality
   - Message logging for call events

### Demo Page

Visit `/video-call-demo` to test the video calling features:
- Interactive demo environment
- Call activity logging
- Step-by-step testing instructions
- Feature overview and controls

### WebRTC Configuration

The system uses WebRTC with STUN servers for peer-to-peer communication:
- Google STUN servers for NAT traversal
- Echo cancellation and noise suppression
- Automatic gain control for audio

## Browser Compatibility

### Supported Browsers:
- **Chrome/Chromium**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 11+)
- **Edge**: Full support

### Required Features:
- WebRTC support
- getUserMedia API
- MediaStream API
- Canvas API (for simulated video)

## Security & Privacy

- **Permission-based access**: Users must explicitly grant camera/microphone permissions
- **Local processing**: Audio/video processing happens locally
- **No recording**: Calls are not recorded or stored
- **Secure connections**: Uses HTTPS for secure media transmission

## Troubleshooting

### Common Issues:

1. **Permission Denied**
   - Check browser permissions for camera/microphone
   - Reload the page and try again
   - Ensure HTTPS connection

2. **No Audio/Video**
   - Verify device has working camera/microphone
   - Check if other applications are using the devices
   - Try refreshing the browser

3. **Connection Issues**
   - Check internet connection
   - Disable VPN if causing issues
   - Try different browser

### Browser Settings:

1. **Chrome**: Settings → Privacy and Security → Site Settings → Camera/Microphone
2. **Firefox**: Preferences → Privacy & Security → Permissions
3. **Safari**: Preferences → Websites → Camera/Microphone

## Development Notes

### For Developers:

1. **Simulated Remote Streams**: The demo uses canvas-generated video for remote streams
2. **Real Implementation**: Replace simulation with actual WebRTC peer connections
3. **Signaling Server**: Add WebSocket signaling for production use
4. **TURN Servers**: Add TURN servers for NAT traversal in production

### Customization:

- Modify video resolution in `VideoCallWidget.jsx`
- Adjust audio settings in `AudioCallService.js`
- Customize UI themes in component styles
- Add additional call features as needed

## Integration

The video call system integrates seamlessly with:
- **Live Chat**: Embedded call controls
- **Support System**: Agent connectivity
- **User Authentication**: User context in calls
- **Offline Mode**: Graceful degradation when offline

## Future Enhancements

Planned improvements:
- **Screen sharing** capability
- **Group video calls** support
- **Call recording** (with permission)
- **Chat during calls** overlay
- **Mobile app** integration
- **Call quality metrics** and analytics

---

For technical support or questions about the video call feature, contact the development team or visit the demo page at `/video-call-demo`.
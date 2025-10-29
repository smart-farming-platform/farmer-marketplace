import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, X, Settings } from 'lucide-react'

const VoiceChat = () => {
    const { t, i18n } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [messages, setMessages] = useState([])
    const [isSupported, setIsSupported] = useState(false)
    const [selectedVoiceLanguage, setSelectedVoiceLanguage] = useState('en-US')

    const recognitionRef = useRef(null)
    const synthRef = useRef(null)

    // Language configurations for speech recognition and synthesis
    const voiceLanguages = {
        'en': { code: 'en-US', name: 'English (US)', voice: 'en-US' },
        'hi': { code: 'hi-IN', name: 'हिंदी (भारत)', voice: 'hi-IN' },
        'ta': { code: 'ta-IN', name: 'தமிழ் (இந்தியா)', voice: 'ta-IN' },
        'te': { code: 'te-IN', name: 'తెలుగు (భారత్)', voice: 'te-IN' },
        'bn': { code: 'bn-IN', name: 'বাংলা (ভারত)', voice: 'bn-IN' },
        'mr': { code: 'mr-IN', name: 'मराठी (भारत)', voice: 'mr-IN' }
    }

    useEffect(() => {
        // Check if speech recognition is supported
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const SpeechSynthesis = window.speechSynthesis

        if (SpeechRecognition && SpeechSynthesis) {
            setIsSupported(true)

            // Initialize speech recognition
            recognitionRef.current = new SpeechRecognition()
            recognitionRef.current.continuous = true
            recognitionRef.current.interimResults = true

            // Set language based on current i18n language
            const currentLang = voiceLanguages[i18n.language] || voiceLanguages['en']
            recognitionRef.current.lang = currentLang.code
            setSelectedVoiceLanguage(currentLang.code)

            // Initialize speech synthesis
            synthRef.current = SpeechSynthesis

            setupSpeechRecognition()
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
        }
    }, [i18n.language])

    const setupSpeechRecognition = () => {
        if (!recognitionRef.current) return

        recognitionRef.current.onstart = () => {
            setIsListening(true)
        }

        recognitionRef.current.onend = () => {
            setIsListening(false)
        }

        recognitionRef.current.onresult = (event) => {
            let finalTranscript = ''
            let interimTranscript = ''

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript
                if (event.results[i].isFinal) {
                    finalTranscript += transcript
                } else {
                    interimTranscript += transcript
                }
            }

            setTranscript(interimTranscript)

            if (finalTranscript) {
                handleVoiceMessage(finalTranscript)
                setTranscript('')
            }
        }

        recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error:', event.error)
            setIsListening(false)
        }
    }

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            // Update language before starting
            const currentLang = voiceLanguages[i18n.language] || voiceLanguages['en']
            recognitionRef.current.lang = currentLang.code

            recognitionRef.current.start()
        }
    }

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop()
        }
    }

    const handleVoiceMessage = (message) => {
        const userMessage = {
            id: Date.now(),
            type: 'user',
            message: message,
            timestamp: new Date(),
            language: i18n.language
        }

        setMessages(prev => [...prev, userMessage])

        // Generate AI response based on language
        setTimeout(() => {
            const response = generateResponse(message, i18n.language)
            const botMessage = {
                id: Date.now() + 1,
                type: 'bot',
                message: response,
                timestamp: new Date(),
                language: i18n.language
            }
            setMessages(prev => [...prev, botMessage])

            // Speak the response
            speakMessage(response, i18n.language)
        }, 1000)
    }

    const speakMessage = (message, language = 'en') => {
        if (!synthRef.current) return

        // Cancel any ongoing speech
        synthRef.current.cancel()

        const utterance = new SpeechSynthesisUtterance(message)

        // Set language and voice
        const voiceLang = voiceLanguages[language] || voiceLanguages['en']
        utterance.lang = voiceLang.code

        // Try to find a native voice for the language
        const voices = synthRef.current.getVoices()
        const nativeVoice = voices.find(voice =>
            voice.lang.startsWith(language) || voice.lang.startsWith(voiceLang.code)
        )

        if (nativeVoice) {
            utterance.voice = nativeVoice
        }

        utterance.rate = 0.9
        utterance.pitch = 1
        utterance.volume = 1

        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => setIsSpeaking(false)
        utterance.onerror = () => setIsSpeaking(false)

        synthRef.current.speak(utterance)
    }

    const generateResponse = (message, language) => {
        const responses = {
            'en': {
                greeting: "Hello! Welcome to AgroConnect. How can I help you with fresh produce today?",
                products: "You can browse our fresh products from local farmers. We have vegetables, fruits, dairy, and more!",
                farmers: "Our farmers are verified and committed to quality produce. You can view their profiles and farming practices.",
                orders: "You can track your orders in the dashboard. Orders are typically delivered within 2-3 days.",
                help: "I can help you with product information, farmer details, orders, or navigation. What would you like to know?",
                default: "I'm here to help with AgroConnect! You can ask about products, farmers, orders, or how to use our platform."
            },
            'hi': {
                greeting: "नमस्ते! एग्रोकनेक्ट में आपका स्वागत है। आज मैं ताजा उत्पादों के साथ आपकी कैसे मदद कर सकता हूं?",
                products: "आप स्थानीय किसानों से ताजा उत्पाद ब्राउज़ कर सकते हैं। हमारे पास सब्जियां, फल, डेयरी और बहुत कुछ है!",
                farmers: "हमारे किसान सत्यापित हैं और गुणवत्तापूर्ण उत्पादन के लिए प्रतिबद्ध हैं। आप उनकी प्रोफाइल और खेती की प्रथाओं को देख सकते हैं।",
                orders: "आप डैशबोर्ड में अपने ऑर्डर ट्रैक कर सकते हैं। ऑर्डर आमतौर पर 2-3 दिनों में डिलीवर हो जाते हैं।",
                help: "मैं उत्पाद की जानकारी, किसान विवरण, ऑर्डर या नेवीगेशन में आपकी मदद कर सकता हूं। आप क्या जानना चाहते हैं?",
                default: "मैं एग्रोकनेक्ट के साथ मदद के लिए यहां हूं! आप उत्पादों, किसानों, ऑर्डर या हमारे प्लेटफॉर्म का उपयोग करने के बारे में पूछ सकते हैं।"
            },
            'ta': {
                greeting: "வணக்கம்! அக்ரோகனெக்ட்டில் உங்களை வரவேற்கிறோம். இன்று புதிய பொருட்களுடன் நான் உங்களுக்கு எப்படி உதவ முடியும்?",
                products: "உள்ளூர் விவசாயிகளிடமிருந்து புதிய பொருட்களை நீங்கள் உலாவலாம். எங்களிடம் காய்கறிகள், பழங்கள், பால் பொருட்கள் மற்றும் பல உள்ளன!",
                farmers: "எங்கள் விவசாயிகள் சரிபார்க்கப்பட்டவர்கள் மற்றும் தர உற்பத்திக்கு அர்பணிப்புடையவர்கள். அவர்களின் சுயவிவரங்கள் மற்றும் விவசாய நடைமுறைகளை நீங்கள் பார்க்கலாம்.",
                orders: "டாஷ்போர்டில் உங்கள் ஆர்டர்களை நீங்கள் கண்காணிக்கலாம். ஆர்டர்கள் பொதுவாக 2-3 நாட்களில் வழங்கப்படும்.",
                help: "தயாரிப்பு தகவல், விவசாயி விவரங்கள், ஆர்டர்கள் அல்லது வழிசெலுத்தலில் நான் உங்களுக்கு உதவ முடியும். நீங்கள் என்ன தெரிந்து கொள்ள விரும்புகிறீர்கள்?",
                default: "அக்ரோகனெக்ட்டுடன் உதவ நான் இங்கே இருக்கிறேன்! தயாரிப்புகள், விவசாயிகள், ஆர்டர்கள் அல்லது எங்கள் தளத்தை எவ்வாறு பயன்படுத்துவது என்பதைப் பற்றி நீங்கள் கேட்கலாம்."
            }
        }

        const langResponses = responses[language] || responses['en']
        const lowerMessage = message.toLowerCase()

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('नमस्ते') || lowerMessage.includes('வணக்கம்')) {
            return langResponses.greeting
        }
        if (lowerMessage.includes('product') || lowerMessage.includes('उत्पाद') || lowerMessage.includes('பொருட்கள்')) {
            return langResponses.products
        }
        if (lowerMessage.includes('farmer') || lowerMessage.includes('किसान') || lowerMessage.includes('விவசாயி')) {
            return langResponses.farmers
        }
        if (lowerMessage.includes('order') || lowerMessage.includes('ऑर्डर') || lowerMessage.includes('ஆர்டர்')) {
            return langResponses.orders
        }
        if (lowerMessage.includes('help') || lowerMessage.includes('मदद') || lowerMessage.includes('உதவி')) {
            return langResponses.help
        }

        return langResponses.default
    }

    const clearMessages = () => {
        setMessages([])
    }

    if (!isSupported) {
        return null
    }

    return (
        <>
            {/* Voice Chat Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-20 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
            >
                <Mic className="w-6 h-6" />
            </button>

            {/* Voice Chat Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md h-96 flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <div className="flex items-center space-x-2">
                                <Mic className="w-5 h-5 text-blue-600" />
                                <h3 className="font-semibold text-gray-900">{t('voiceChat')}</h3>
                                <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Language Selector */}
                        <div className="p-3 bg-gray-50 border-b">
                            <select
                                value={i18n.language}
                                onChange={(e) => i18n.changeLanguage(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                {Object.entries(voiceLanguages).map(([code, lang]) => (
                                    <option key={code} value={code}>{lang.name}</option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-600 mt-1">
                                {t('speakYourMessage')} {voiceLanguages[i18n.language]?.name}
                            </p>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-500 text-sm">
                                    <Mic className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                    <p>{t('speakYourMessage')}</p>
                                </div>
                            )}

                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-xs p-3 rounded-lg ${message.type === 'user'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-900'
                                        }`}>
                                        <p className="text-sm">{message.message}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className={`text-xs ${message.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                                                }`}>
                                                {message.timestamp.toLocaleTimeString()}
                                            </p>
                                            {message.type === 'bot' && (
                                                <button
                                                    onClick={() => speakMessage(message.message, message.language)}
                                                    className="ml-2 text-gray-500 hover:text-gray-700"
                                                >
                                                    <Volume2 className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Live Transcript */}
                            {transcript && (
                                <div className="flex justify-end">
                                    <div className="max-w-xs p-3 rounded-lg bg-blue-100 text-blue-900 border-2 border-blue-300">
                                        <p className="text-sm italic">{transcript}</p>
                                        <p className="text-xs text-blue-600 mt-1">{t('listening')}...</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="p-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={isListening ? stopListening : startListening}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${isListening
                                                ? 'bg-red-600 text-white hover:bg-red-700'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                    >
                                        {isListening ? (
                                            <>
                                                <MicOff className="w-4 h-4" />
                                                <span>{t('stopListening')}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Mic className="w-4 h-4" />
                                                <span>{t('startListening')}</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                <button
                                    onClick={clearMessages}
                                    className="text-gray-500 hover:text-gray-700 text-sm"
                                >
                                    Clear
                                </button>
                            </div>

                            {isSpeaking && (
                                <div className="mt-2 flex items-center space-x-2 text-sm text-blue-600">
                                    <Volume2 className="w-4 h-4 animate-pulse" />
                                    <span>Speaking...</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default VoiceChat
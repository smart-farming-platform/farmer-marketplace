import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { initializeApp } from './utils/startupHelper'
import AIChatbot from './components/ai/AIChatbot'
import VoiceChat from './components/voice/VoiceChat'
import CropDiseaseDetector from './components/disease/CropDiseaseDetector'
// import SimpleOfflineIndicator from './components/offline/SimpleOfflineIndicator'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import NearbyFarmersPage from './pages/NearbyFarmersPage'
import MarketIntelligencePage from './pages/MarketIntelligence'
import WeatherPage from './pages/Weather'
import QRDemo from './pages/QRDemo'
import GPSTracking from './pages/GPSTracking'
import VideoCallDemo from './pages/VideoCallDemo'
import ProtectedRoute from './components/ProtectedRoute'
import RouteTest from './components/debug/RouteTest'
import HealthCheck from './components/debug/HealthCheck'
import QuickLogin from './components/debug/QuickLogin'
import LinkDiagnostic from './components/debug/LinkDiagnostic'
import FloatingScanner from './components/scanner/FloatingScanner'
import FloatingFeedbackButton from './components/feedback/FloatingFeedbackButton'

function App() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [showDebugTools, setShowDebugTools] = useState(false)
  const isDevelopment = import.meta.env.DEV

  useEffect(() => {
    const startup = async () => {
      try {
        await initializeApp()
        setIsInitialized(true)
      } catch (error) {
        console.error('App initialization failed:', error)
        // Still allow app to load even if initialization fails
        setIsInitialized(true)
      }
    }

    startup()

    // Listen for debug toggle (Ctrl+Shift+D)
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setShowDebugTools(!showDebugTools)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [showDebugTools])

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">🌱 AgroConnect</h2>
          <p className="text-gray-600">Initializing your farming platform...</p>
          <div className="mt-4 text-sm text-gray-500">
            <p>✓ Loading offline data</p>
            <p>✓ Checking network connection</p>
            <p>✓ Setting up services</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/farmers" element={<NearbyFarmersPage />} />
          <Route path="/market" element={<MarketIntelligencePage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/qr-demo" element={<QRDemo />} />
          <Route path="/gps-tracking" element={<GPSTracking />} />
          <Route path="/video-call-demo" element={<VideoCallDemo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <AIChatbot />
      <VoiceChat />
      <CropDiseaseDetector />
      {/* <SimpleOfflineIndicator /> */}

      {/* Debug Tools - Only show in development or when toggled */}
      {(isDevelopment && showDebugTools) && (
        <>
          <RouteTest />
          <HealthCheck />
          <QuickLogin />
          <LinkDiagnostic />
        </>
      )}

      {/* Debug Toggle Hint - Only in development */}
      {isDevelopment && !showDebugTools && (
        <div className="fixed bottom-4 left-4 bg-gray-800 text-white px-3 py-1 rounded text-xs opacity-50 hover:opacity-100 transition-opacity">
          Press Ctrl+Shift+D for debug tools
        </div>
      )}

      <Toaster position="top-right" />

      {/* Floating Scanner - Always Available */}
      <FloatingScanner />

      {/* Floating Feedback Button - Always Available */}
      <FloatingFeedbackButton />
    </div>
  )
}

export default App
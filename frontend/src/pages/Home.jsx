import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Truck, Shield, Users, Star, QrCode, Wifi, Download, Video } from 'lucide-react'
import SmartRecommendations from '../components/ai/SmartRecommendations'
import LiveChat from '../components/chat/LiveChat'
import RatingFeedback from '../components/feedback/RatingFeedback'
import WeatherWidget from '../components/weather/WeatherWidget'
import QRScanner from '../components/scanner/QRScanner'
import MobileScannerHelper from '../components/scanner/MobileScannerHelper'
// import SimpleOfflineIndicator from '../components/offline/SimpleOfflineIndicator'
import { useAuth } from '../contexts/AuthContext'
// import offlineService from '../services/offlineService'

const Home = () => {
  const { isAuthenticated } = useAuth()
  const { t } = useTranslation()
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showMobileHelper, setShowMobileHelper] = useState(false)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)

  useEffect(() => {
    // Listen for offline/online status changes
    const handleOffline = () => setIsOffline(true)
    const handleOnline = () => setIsOffline(false)

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    // Cache initial data for offline use
    if (navigator.onLine) {
      cacheInitialData()
    }

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  const cacheInitialData = async () => {
    try {
      // Cache some basic data for offline use
      const mockProducts = [
        { id: 1, name: 'Fresh Tomatoes', price: 120, category: 'vegetables' },
        { id: 2, name: 'Sweet Corn', price: 15, category: 'vegetables' },
        { id: 3, name: 'Organic Strawberries', price: 180, category: 'fruits' }
      ]
      // offlineService.cacheProducts(mockProducts)
    } catch (error) {
      console.error('Error caching initial data:', error)
    }
  }

  const handleQRInput = (input) => {
    setShowQRScanner(false)

    if (input.startsWith('PRODUCT_')) {
      // Navigate to products page for demo
      window.location.href = '/products'
    } else if (input.startsWith('/')) {
      // Handle internal routes
      window.location.href = input
    } else if (input.startsWith('http')) {
      // Handle external URLs
      window.open(input, '_blank')
    } else {
      // Default to products page
      window.location.href = '/products'
    }
  }

  const features = [
    {
      icon: <Truck className="w-8 h-8 text-green-600" />,
      title: t('directFromFarm'),
      description: t('directFromFarmDesc')
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: t('fairPricing'),
      description: t('fairPricingDesc')
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: t('communityDriven'),
      description: t('communityDrivenDesc')
    },
    {
      icon: <Star className="w-8 h-8 text-green-600" />,
      title: t('qualityAssured'),
      description: t('qualityAssuredDesc')
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20 w-full min-w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('heroTitle')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                {t('shopNow')}
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
              >
                {t('joinAsFarmer')}
              </Link>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                onClick={() => setShowQRScanner(true)}
                className="bg-green-500 bg-opacity-20 text-white px-6 py-2 rounded-lg font-medium hover:bg-opacity-30 transition-colors flex items-center justify-center space-x-2"
              >
                <QrCode className="w-5 h-5" />
                <span>Scan QR Code</span>
              </button>

              {isOffline && (
                <div className="bg-yellow-500 bg-opacity-20 text-white px-6 py-2 rounded-lg font-medium flex items-center justify-center space-x-2">
                  <Wifi className="w-5 h-5" />
                  <span>Offline Mode Active</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Weather & Features Section */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Smart Farming Features
            </h2>
            <p className="text-lg text-gray-600">
              Weather-smart agriculture with modern technology
            </p>
          </div>

          {/* Weather Widget */}
          <div className="mb-12">
            <WeatherWidget compact={true} location={{ lat: 13.0827, lon: 80.2707 }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* QR Scanner Feature */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <QrCode className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">QR Code Scanner</h3>
                  <p className="text-gray-600">Instant product lookup</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Scan QR codes on products or farmer profiles for instant access to detailed information, pricing, and ordering options.
              </p>
              <button
                onClick={() => setShowQRScanner(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Try Scanner
              </button>
            </div>

            {/* Offline Mode Feature */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Download className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Offline Mode</h3>
                  <p className="text-gray-600">Browse without internet</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Continue browsing products, viewing farmer profiles, and adding items to cart even when offline. Data syncs when you're back online.
              </p>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isOffline ? 'bg-red-500' : 'bg-green-500'}`}></div>
                <span className="text-sm font-medium">
                  {isOffline ? 'Currently Offline' : 'Online & Synced'}
                </span>
              </div>
            </div>

            {/* Video Call Demo Feature */}
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Video className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Video Support</h3>
                  <p className="text-gray-600">Live audio & video calls</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Get instant help with live audio and video calls. Connect with our support team for real-time assistance with your farming needs.
              </p>
              <Link
                to="/video-call-demo"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors inline-block"
              >
                Try Video Call
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose AgroConnect?
            </h2>
            <p className="text-lg text-gray-600">
              We're eliminating intermediaries and ensuring fair pricing for all
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-lg text-gray-700">Local Farmers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">10,000+</div>
              <div className="text-lg text-gray-700">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">50,000+</div>
              <div className="text-lg text-gray-700">Orders Delivered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Rating Feedback Section */}
      <RatingFeedback />

      {/* AI Recommendations Section */}
      {isAuthenticated && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                AI Recommendations
              </h2>
              <p className="text-lg text-gray-600">
                Personalized suggestions based on your shopping history
              </p>
            </div>
            <SmartRecommendations limit={6} />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Experience Fresh?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of customers who trust us for their fresh produce needs
          </p>
          <Link
            to="/products"
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-block"
          >
            Start Shopping
          </Link>
        </div>
      </section>

      {/* Enhanced QR Scanner */}
      <QRScanner
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
      />

      {/* Mobile Scanner Helper */}
      <MobileScannerHelper
        isVisible={showMobileHelper}
        onClose={() => {
          setShowMobileHelper(false)
          setShowQRScanner(true)
        }}
      />

      {/* Offline Indicator - Temporarily Disabled */}
      {/* <SimpleOfflineIndicator /> */}

      {/* Navigation Test - Temporary Debug Component */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50">
          <h4 className="font-semibold mb-2">Navigation Test</h4>
          <div className="space-y-2">
            <Link
              to="/products"
              className="block bg-blue-500 px-3 py-1 rounded text-sm hover:bg-blue-400"
            >
              Link to Products
            </Link>
            <button
              onClick={() => window.location.href = '/products'}
              className="block bg-green-500 px-3 py-1 rounded text-sm hover:bg-green-400 w-full"
            >
              Direct Navigation
            </button>
          </div>
        </div>
      )}

      {/* Mobile QR Scanner Button */}
      <button
        onClick={() => {
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
          if (isMobile) {
            setShowMobileHelper(true)
          } else {
            setShowQRScanner(true)
          }
        }}
        className="fixed bottom-20 left-6 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition-all duration-300 hover:scale-110 z-40 md:hidden"
        title="Scan QR Code or Barcode"
      >
        <QrCode className="w-6 h-6" />
      </button>

      {/* Mobile Help Button */}
      <button
        onClick={() => setShowMobileHelper(true)}
        className="fixed bottom-6 left-6 bg-green-600 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-green-700 transition-colors z-40 md:hidden text-xs"
        title="Mobile Scanning Help"
      >
        📱 Help
      </button>

      {/* Live Chat Component */}
      <LiveChat />
    </div>
  )
}

export default Home
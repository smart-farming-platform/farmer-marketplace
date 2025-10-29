import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Menu, X, Wifi, WifiOff, QrCode, Scan, CreditCard, Eye } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import LanguageSwitcher from './language/LanguageSwitcher'
import QRScanner from './scanner/QRScanner'
import PaymentScanner from './scanner/PaymentScanner'
import ProductViewScanner from './scanner/ProductViewScanner'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showScanner, setShowScanner] = useState(false)
  const [showPaymentScanner, setShowPaymentScanner] = useState(false)
  const [showProductScanner, setShowProductScanner] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">🌱</span>
            </div>
            <span className="font-bold text-xl">AgroConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-green-200 transition-colors">
              {t('home')}
            </Link>
            <Link to="/market" className="hover:text-green-200 transition-colors">
              {t('marketIntelligence')}
            </Link>
            <Link to="/weather" className="hover:text-green-200 transition-colors">
              {t('smartWeather')}
            </Link>
            <Link to="/qr-demo" className="hover:text-green-200 transition-colors">
              QR Generator
            </Link>
            <Link to="/gps-tracking" className="hover:text-green-200 transition-colors">
              GPS Tracker
            </Link>
            <Link to="/video-call-demo" className="hover:text-green-200 transition-colors">
              📹 Video Call
            </Link>
            <div className="relative group">
              <button className="hover:text-green-200 transition-colors flex items-center space-x-1">
                <QrCode className="w-4 h-4" />
                <span>Scanners</span>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <button
                  onClick={() => setShowScanner(true)}
                  className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center space-x-2 rounded-t-lg"
                >
                  <QrCode className="w-4 h-4" />
                  <span>QR & Barcode Scanner</span>
                </button>
                <button
                  onClick={() => setShowProductScanner(true)}
                  className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Product View Scanner</span>
                </button>
                <button
                  onClick={() => setShowPaymentScanner(true)}
                  className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 flex items-center space-x-2 rounded-b-lg"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Payment Scanner</span>
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                // Trigger the disease detector
                const event = new CustomEvent('openDiseaseDetector')
                window.dispatchEvent(event)
              }}
              className="hover:text-green-200 transition-colors flex items-center space-x-1"
            >
              <span>🔬</span>
              <span>Disease Detector</span>
            </button>
            <Link to="/products" className="hover:text-green-200 transition-colors">
              {t('products')}
            </Link>
            <Link to="/farmers" className="hover:text-green-200 transition-colors">
              {t('farmers')}
            </Link>

            {/* Login/Register or User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Link to="/cart" className="hover:text-green-200 transition-colors">
                    <ShoppingCart className="w-6 h-6" />
                  </Link>
                  {/* Offline Mode Indicator */}
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${isOnline
                    ? 'bg-green-500/20 text-green-100'
                    : 'bg-red-500/20 text-red-100 animate-pulse'
                    }`}>
                    {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                    <span>{isOnline ? 'Online' : 'Offline'}</span>
                  </div>
                </div>
                <Link to="/dashboard" className="hover:text-green-200 transition-colors flex items-center space-x-1">
                  <User className="w-5 h-5" />
                  <span>{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-green-200 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* Offline Mode Indicator for non-authenticated users */}
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${isOnline
                  ? 'bg-green-500/20 text-green-100'
                  : 'bg-red-500/20 text-red-100 animate-pulse'
                  }`}>
                  {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  <span>{isOnline ? 'Online' : 'Offline'}</span>
                </div>
                <Link
                  to="/login"
                  className="text-white hover:text-green-200 transition-colors font-medium border border-white px-3 py-1 rounded-md hover:bg-white hover:text-green-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-green-600 px-4 py-2 rounded-md hover:bg-green-50 transition-colors font-medium shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-green-200"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="block px-3 py-2 hover:text-green-200 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/market"
                className="block px-3 py-2 hover:text-green-200 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t('marketIntelligence')}
              </Link>
              <Link
                to="/weather"
                className="block px-3 py-2 hover:text-green-200 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t('smartWeather')}
              </Link>
              <Link
                to="/qr-demo"
                className="block px-3 py-2 hover:text-green-200 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                QR Generator
              </Link>
              <Link
                to="/gps-tracking"
                className="block px-3 py-2 hover:text-green-200 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                📍 GPS Tracker
              </Link>
              <Link
                to="/video-call-demo"
                className="block px-3 py-2 hover:text-green-200 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                📹 Video Call
              </Link>
              <button
                onClick={() => {
                  setShowScanner(true)
                  setIsOpen(false)
                }}
                className="block w-full text-left px-3 py-2 hover:text-green-200 transition-colors"
              >
                📱 QR & Barcode Scanner
              </button>
              <button
                onClick={() => {
                  setShowProductScanner(true)
                  setIsOpen(false)
                }}
                className="block w-full text-left px-3 py-2 hover:text-green-200 transition-colors"
              >
                👁️ Product View Scanner
              </button>
              <button
                onClick={() => {
                  setShowPaymentScanner(true)
                  setIsOpen(false)
                }}
                className="block w-full text-left px-3 py-2 hover:text-green-200 transition-colors"
              >
                💳 Payment Scanner
              </button>
              <button
                onClick={() => {
                  const event = new CustomEvent('openDiseaseDetector')
                  window.dispatchEvent(event)
                  setIsOpen(false)
                }}
                className="block w-full text-left px-3 py-2 hover:text-green-200 transition-colors"
              >
                🔬 Disease Detector
              </button>
              <Link
                to="/products"
                className="block px-3 py-2 hover:text-green-200 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t('products')}
              </Link>
              <Link
                to="/farmers"
                className="block px-3 py-2 hover:text-green-200 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {t('farmers')}
              </Link>

              {/* Divider */}
              <div className="border-t border-green-500 my-2"></div>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/cart"
                    className="block px-3 py-2 hover:text-green-200 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Cart
                  </Link>
                  {/* Mobile Offline Indicator */}
                  <div className={`flex items-center space-x-2 px-3 py-2 ${isOnline
                    ? 'text-green-200'
                    : 'text-red-200 animate-pulse'
                    }`}>
                    {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                    <span className="text-sm">{isOnline ? 'Online Mode' : 'Offline Mode'}</span>
                  </div>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 hover:text-green-200 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 hover:text-green-200 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Mobile Offline Indicator */}
                  <div className={`flex items-center space-x-2 px-3 py-2 ${isOnline
                    ? 'text-green-200'
                    : 'text-red-200 animate-pulse'
                    }`}>
                    {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                    <span className="text-sm">{isOnline ? 'Online Mode' : 'Offline Mode'}</span>
                  </div>

                  {/* Login/Register Section */}
                  <div className="bg-green-500 bg-opacity-20 rounded-lg mx-3 my-2 p-2">
                    <Link
                      to="/login"
                      className="block px-3 py-2 text-center bg-transparent border border-white text-white rounded-md hover:bg-white hover:text-green-600 transition-colors font-medium mb-2"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('login')}
                    </Link>
                    <Link
                      to="/register"
                      className="block px-3 py-2 text-center bg-white text-green-600 rounded-md hover:bg-green-50 transition-colors font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('register')}
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Scanner Modals */}
      <QRScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
      />
      <PaymentScanner
        isOpen={showPaymentScanner}
        onClose={() => setShowPaymentScanner(false)}
      />
      <ProductViewScanner
        isOpen={showProductScanner}
        onClose={() => setShowProductScanner(false)}
      />
    </nav>
  )
}

export default Navbar
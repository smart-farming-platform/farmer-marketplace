import { useState, useRef, useCallback, useEffect } from 'react'
import { CreditCard, Scan, X, CheckCircle, AlertCircle, User, ShoppingCart, Loader } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Webcam from 'react-webcam'

const PaymentScanner = ({ isOpen, onClose }) => {
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [isScanning, setIsScanning] = useState(false)
    const [scannedProduct, setScannedProduct] = useState(null)
    const [paymentAmount, setPaymentAmount] = useState(0)
    const [isProcessing, setIsProcessing] = useState(false)
    const [paymentSuccess, setPaymentSuccess] = useState(false)
    const [error, setError] = useState('')
    const [scanHistory, setScanHistory] = useState([])
    const webcamRef = useRef(null)
    const streamRef = useRef(null)

    // Mock product database for payment scanning
    const productDatabase = {
        'PAY_TOMATO_001': {
            id: 'TOMATO_001',
            name: 'Organic Tomatoes',
            price: 120,
            unit: 'kg',
            farmer: 'Rajesh Kumar',
            image: 'https://images.unsplash.com/photo-1546470427-e5b89b618b84?w=300',
            description: 'Fresh organic tomatoes from local farm'
        },
        'PAY_CORN_002': {
            id: 'CORN_002',
            name: 'Sweet Corn',
            price: 80,
            unit: 'kg',
            farmer: 'Priya Sharma',
            image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=300',
            description: 'Sweet and tender corn kernels'
        },
        'PAY_RICE_003': {
            id: 'RICE_003',
            name: 'Basmati Rice',
            price: 150,
            unit: 'kg',
            farmer: 'Suresh Patel',
            image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300',
            description: 'Premium quality basmati rice'
        }
    }

    useEffect(() => {
        if (isOpen && !isAuthenticated) {
            setError('Please login to use payment scanner')
            return
        }

        if (isOpen) {
            startScanning()
        }

        return () => {
            stopScanning()
        }
    }, [isOpen, isAuthenticated])

    const startScanning = async () => {
        try {
            setError('')
            setIsScanning(true)

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            })

            streamRef.current = stream
            if (webcamRef.current) {
                webcamRef.current.srcObject = stream
            }

            detectPaymentCode()
        } catch (err) {
            setError('Camera access denied. Please allow camera permissions.')
            setIsScanning(false)
        }
    }

    const stopScanning = () => {
        setIsScanning(false)
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
            streamRef.current = null
        }
    }

    const detectPaymentCode = () => {
        const scanInterval = setInterval(() => {
            if (!isScanning) {
                clearInterval(scanInterval)
                return
            }

            // Simulate payment code detection
            const mockDetection = Math.random() < 0.12 // 12% chance per scan

            if (mockDetection) {
                clearInterval(scanInterval)
                const paymentCodes = Object.keys(productDatabase)
                const randomCode = paymentCodes[Math.floor(Math.random() * paymentCodes.length)]
                handlePaymentCodeDetected(randomCode)
            }
        }, 400)

        setTimeout(() => {
            clearInterval(scanInterval)
        }, 30000)
    }

    const handlePaymentCodeDetected = (code) => {
        stopScanning()

        const product = productDatabase[code]
        if (product) {
            setScannedProduct(product)
            setPaymentAmount(product.price)

            // Add to scan history
            const scanRecord = {
                id: Date.now(),
                code,
                product: product.name,
                amount: product.price,
                timestamp: new Date()
            }
            setScanHistory(prev => [scanRecord, ...prev.slice(0, 4)])
        } else {
            setError('Payment code not recognized. Please try again.')
        }
    }

    const processPayment = async () => {
        setIsProcessing(true)
        setError('')

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Mock payment success
            setPaymentSuccess(true)
            setIsProcessing(false)

            // Auto close after success
            setTimeout(() => {
                onClose()
                resetScanner()
            }, 3000)

        } catch (err) {
            setError('Payment failed. Please try again.')
            setIsProcessing(false)
        }
    }

    const resetScanner = () => {
        setScannedProduct(null)
        setPaymentAmount(0)
        setPaymentSuccess(false)
        setError('')
        setIsProcessing(false)
    }

    const handleManualCode = () => {
        const code = prompt('Enter payment code manually:')
        if (code) {
            handlePaymentCodeDetected(code)
        }
    }

    if (!isOpen) return null

    if (!isAuthenticated) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                    <div className="text-center">
                        <User className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Login Required</h3>
                        <p className="text-gray-600 mb-4">Please login to use the payment scanner</p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => navigate('/login')}
                                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                            >
                                Login
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                            <CreditCard className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Payment Scanner</h2>
                            <p className="text-sm text-gray-600">Scan to pay instantly</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    {/* User Info */}
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <User className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-green-900">Logged in as: {user?.name}</span>
                        </div>
                    </div>

                    {paymentSuccess ? (
                        /* Payment Success */
                        <div className="text-center py-8">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
                            <p className="text-gray-600 mb-4">₹{paymentAmount} paid for {scannedProduct?.name}</p>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-sm text-green-800">
                                    Transaction completed successfully. Receipt sent to your email.
                                </p>
                            </div>
                        </div>
                    ) : scannedProduct ? (
                        /* Payment Confirmation */
                        <div className="space-y-4">
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <div className="flex items-start space-x-4">
                                    <img
                                        src={scannedProduct.image}
                                        alt={scannedProduct.name}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{scannedProduct.name}</h4>
                                        <p className="text-sm text-gray-600">By: {scannedProduct.farmer}</p>
                                        <p className="text-sm text-gray-500">{scannedProduct.description}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-blue-900">Amount to Pay:</span>
                                    <span className="text-2xl font-bold text-blue-600">₹{paymentAmount}</span>
                                </div>
                                <p className="text-sm text-blue-800">Per {scannedProduct.unit}</p>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={resetScanner}
                                    className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={processPayment}
                                    disabled={isProcessing}
                                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader className="w-4 h-4 animate-spin" />
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-4 h-4" />
                                            <span>Pay Now</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* Scanner Interface */
                        <div className="space-y-4">
                            {/* Camera View */}
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                {isScanning ? (
                                    <div className="relative">
                                        <Webcam
                                            audio={false}
                                            ref={webcamRef}
                                            screenshotFormat="image/jpeg"
                                            className="w-full h-64 bg-gray-900 rounded-lg object-cover"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-48 h-48 border-2 border-green-500 rounded-lg relative">
                                                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-green-500"></div>
                                                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-green-500"></div>
                                                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-green-500"></div>
                                                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-green-500"></div>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-4 left-0 right-0 text-center">
                                            <p className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full inline-block">
                                                Scan payment barcode
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Scan className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 mb-4">Point camera at payment barcode</p>
                                        <button
                                            onClick={startScanning}
                                            className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700"
                                        >
                                            Start Scanning
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                        <p className="text-red-800 text-sm">{error}</p>
                                    </div>
                                </div>
                            )}

                            {/* Manual Input */}
                            <button
                                onClick={handleManualCode}
                                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
                            >
                                Enter Code Manually
                            </button>

                            {/* Demo Codes */}
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <h4 className="font-medium text-blue-900 mb-2">Demo Payment Codes:</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {Object.entries(productDatabase).map(([code, product]) => (
                                        <button
                                            key={code}
                                            onClick={() => handlePaymentCodeDetected(code)}
                                            className="text-left bg-blue-100 text-blue-800 px-3 py-2 rounded text-sm hover:bg-blue-200"
                                        >
                                            <div className="font-mono text-xs">{code}</div>
                                            <div>{product.name} - ₹{product.price}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Scan History */}
                            {scanHistory.length > 0 && (
                                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-2">Recent Scans:</h4>
                                    <div className="space-y-1">
                                        {scanHistory.map((scan) => (
                                            <div key={scan.id} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">{scan.product}</span>
                                                <span className="text-gray-900 font-medium">₹{scan.amount}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PaymentScanner
import { useState, useRef, useEffect } from 'react'
import { QrCode, X, Camera, AlertCircle, Scan, BarChart3, Zap, History } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const QRScanner = ({ isOpen, onClose }) => {
    const [isScanning, setIsScanning] = useState(false)
    const [error, setError] = useState('')
    const [hasCamera, setHasCamera] = useState(true)
    const [scanMode, setScanMode] = useState('qr') // 'qr' or 'barcode'
    const [scanHistory, setScanHistory] = useState([])
    const [lastScanResult, setLastScanResult] = useState(null)
    const [scanCount, setScanCount] = useState(0)
    const videoRef = useRef(null)
    const streamRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (isOpen && hasCamera) {
            startScanning()
        }
        return () => {
            stopScanning()
        }
    }, [isOpen, hasCamera])

    const startScanning = async () => {
        try {
            setError('')
            setIsScanning(true)

            // Check if camera is available
            const devices = await navigator.mediaDevices.enumerateDevices()
            const videoDevices = devices.filter(device => device.kind === 'videoinput')

            if (videoDevices.length === 0) {
                setHasCamera(false)
                setError('No camera found on this device')
                return
            }

            // Get camera stream
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Use back camera if available
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            })

            streamRef.current = stream
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                videoRef.current.play()
            }

            // Start code detection
            detectCode()

        } catch (err) {
            console.error('Camera access error:', err)
            setError('Camera access denied. Please allow camera permissions.')
            setHasCamera(false)
            setIsScanning(false)
        }
    }

    const stopScanning = () => {
        setIsScanning(false)
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
            streamRef.current = null
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null
        }
    }

    const detectCode = () => {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        const scanInterval = setInterval(() => {
            if (!videoRef.current || !isScanning) {
                clearInterval(scanInterval)
                return
            }

            // Enhanced detection simulation for both QR and barcodes
            const mockDetection = Math.random() < 0.15 // 15% chance per scan

            if (mockDetection) {
                clearInterval(scanInterval)

                // Generate different types of codes based on scan mode
                let mockData
                if (scanMode === 'qr') {
                    const qrTypes = [
                        'PRODUCT_AGR001',
                        'FARMER_F123',
                        'ORDER_ORD456',
                        'https://agroconnect.com/product/tomato-organic',
                        'BATCH_B789_ORGANIC_TOMATO',
                        'CERT_ORGANIC_2024_001'
                    ]
                    mockData = qrTypes[Math.floor(Math.random() * qrTypes.length)]
                } else {
                    // Barcode simulation
                    const barcodeTypes = [
                        '8901030875991', // EAN-13
                        '012345678905',  // UPC-A
                        '1234567890128', // EAN-13
                        '789012345678',  // UPC-A
                        'AGR001TOMATO',  // Custom product code
                        'ORG2024001'     // Organic certification
                    ]
                    mockData = barcodeTypes[Math.floor(Math.random() * barcodeTypes.length)]
                }

                handleCodeDetected(mockData, scanMode)
            }
        }, 300) // Faster scanning

        // Cleanup after 45 seconds
        setTimeout(() => {
            clearInterval(scanInterval)
        }, 45000)
    }

    const handleCodeDetected = (codeData, codeType) => {
        stopScanning()
        setScanCount(prev => prev + 1)

        const scanResult = {
            data: codeData,
            type: codeType,
            timestamp: new Date(),
            id: Date.now()
        }

        setLastScanResult(scanResult)
        setScanHistory(prev => [scanResult, ...prev.slice(0, 9)]) // Keep last 10 scans

        // Enhanced parsing for different code types
        if (codeType === 'qr') {
            handleQRCode(codeData)
        } else {
            handleBarcode(codeData)
        }
    }

    const handleQRCode = (qrData) => {
        if (qrData.startsWith('PRODUCT_')) {
            const productId = qrData.replace('PRODUCT_', '')
            showScanResult(`Product: ${productId}`, 'success')
            setTimeout(() => navigate(`/products/${productId}`), 1500)
        } else if (qrData.startsWith('FARMER_')) {
            const farmerId = qrData.replace('FARMER_', '')
            showScanResult(`Farmer Profile: ${farmerId}`, 'success')
            setTimeout(() => navigate(`/farmers/${farmerId}`), 1500)
        } else if (qrData.startsWith('ORDER_')) {
            const orderId = qrData.replace('ORDER_', '')
            showScanResult(`Order: ${orderId}`, 'success')
            setTimeout(() => navigate(`/dashboard/orders/${orderId}`), 1500)
        } else if (qrData.startsWith('BATCH_')) {
            showScanResult(`Batch Info: ${qrData}`, 'info')
        } else if (qrData.startsWith('CERT_')) {
            showScanResult(`Certification: ${qrData}`, 'info')
        } else if (qrData.startsWith('http')) {
            showScanResult(`Opening URL: ${qrData}`, 'success')
            setTimeout(() => window.open(qrData, '_blank'), 1500)
        } else {
            showScanResult(`QR Data: ${qrData}`, 'warning')
        }
    }

    const handleBarcode = (barcodeData) => {
        if (barcodeData.length === 13 || barcodeData.length === 12) {
            // EAN-13 or UPC-A
            showScanResult(`Product Barcode: ${barcodeData}`, 'success')
            // In real app, lookup product by barcode
            setTimeout(() => navigate(`/products/barcode/${barcodeData}`), 1500)
        } else if (barcodeData.startsWith('AGR')) {
            // Custom AgroConnect product code
            showScanResult(`AgroConnect Product: ${barcodeData}`, 'success')
            setTimeout(() => navigate(`/products/${barcodeData}`), 1500)
        } else if (barcodeData.startsWith('ORG')) {
            // Organic certification code
            showScanResult(`Organic Certification: ${barcodeData}`, 'info')
        } else {
            showScanResult(`Barcode: ${barcodeData}`, 'info')
        }
    }

    const showScanResult = (message, type) => {
        setError('')
        // You could use a toast notification here instead
        alert(`✅ Scan Successful!\n${message}`)
    }

    const handleManualInput = () => {
        const input = prompt(`Enter ${scanMode === 'qr' ? 'QR code data' : 'barcode'} manually:`)
        if (input) {
            handleCodeDetected(input, scanMode)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        {scanMode === 'qr' ? (
                            <QrCode className="w-6 h-6 text-green-600" />
                        ) : (
                            <BarChart3 className="w-6 h-6 text-blue-600" />
                        )}
                        <h3 className="text-lg font-semibold text-gray-900">
                            {scanMode === 'qr' ? 'QR Code' : 'Barcode'} Scanner
                        </h3>
                        <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                            <Zap className="w-3 h-3 text-green-600" />
                            <span className="text-xs text-green-800">{scanCount} scans</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scan Mode Toggle */}
                <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setScanMode('qr')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${scanMode === 'qr'
                            ? 'bg-white text-green-700 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <QrCode className="w-4 h-4 inline mr-2" />
                        QR Codes
                    </button>
                    <button
                        onClick={() => setScanMode('barcode')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${scanMode === 'barcode'
                            ? 'bg-white text-blue-700 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <BarChart3 className="w-4 h-4 inline mr-2" />
                        Barcodes
                    </button>
                </div>

                {/* Scanner Area */}
                <div className="mb-4">
                    {hasCamera && isScanning ? (
                        <div className="relative">
                            <video
                                ref={videoRef}
                                className="w-full h-64 bg-gray-900 rounded-lg object-cover"
                                autoPlay
                                playsInline
                                muted
                            />
                            {/* Scanning overlay */}
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
                                    Point camera at {scanMode === 'qr' ? 'QR code' : 'barcode'}
                                </p>
                            </div>

                            {/* Scan animation */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-full h-0.5 bg-red-500 opacity-75 animate-pulse"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600">Camera not available</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <p className="text-red-800 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* Last Scan Result */}
                {lastScanResult && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-medium text-green-900">Last Scan:</h4>
                                <p className="text-sm text-green-800 font-mono">{lastScanResult.data}</p>
                                <p className="text-xs text-green-600">
                                    {lastScanResult.type.toUpperCase()} • {lastScanResult.timestamp.toLocaleTimeString()}
                                </p>
                            </div>
                            <Scan className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                )}

                {/* Instructions */}
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-1">
                        {scanMode === 'qr' ? 'QR Code' : 'Barcode'} Scanner:
                    </h4>
                    <ul className="text-blue-800 text-sm space-y-1">
                        {scanMode === 'qr' ? (
                            <>
                                <li>• Product QR codes (PRODUCT_xxx)</li>
                                <li>• Farmer profiles (FARMER_xxx)</li>
                                <li>• Order tracking (ORDER_xxx)</li>
                                <li>• Batch information (BATCH_xxx)</li>
                                <li>• Certifications (CERT_xxx)</li>
                            </>
                        ) : (
                            <>
                                <li>• EAN-13 product barcodes</li>
                                <li>• UPC-A product codes</li>
                                <li>• AgroConnect custom codes</li>
                                <li>• Organic certification codes</li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                    {!isScanning && hasCamera && (
                        <button
                            onClick={startScanning}
                            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                        >
                            <Camera className="w-4 h-4" />
                            <span>Start Scanning</span>
                        </button>
                    )}

                    <button
                        onClick={handleManualInput}
                        className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
                    >
                        Manual Input
                    </button>
                </div>

                {/* Scan History */}
                {scanHistory.length > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                            <History className="w-4 h-4 text-gray-600" />
                            <h4 className="text-sm font-medium text-gray-700">Recent Scans</h4>
                        </div>
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                            {scanHistory.slice(0, 3).map((scan) => (
                                <div key={scan.id} className="flex justify-between items-center text-xs">
                                    <span className="text-gray-600 font-mono truncate flex-1 mr-2">
                                        {scan.data}
                                    </span>
                                    <span className="text-gray-500">
                                        {scan.type.toUpperCase()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Demo Codes */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-2">Demo codes to try:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        {scanMode === 'qr' ? (
                            <>
                                <button
                                    onClick={() => handleCodeDetected('PRODUCT_AGR001', 'qr')}
                                    className="bg-green-100 text-green-800 px-2 py-1 rounded"
                                >
                                    Product QR
                                </button>
                                <button
                                    onClick={() => handleCodeDetected('FARMER_F123', 'qr')}
                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded"
                                >
                                    Farmer QR
                                </button>
                                <button
                                    onClick={() => handleCodeDetected('ORDER_ORD456', 'qr')}
                                    className="bg-purple-100 text-purple-800 px-2 py-1 rounded"
                                >
                                    Order QR
                                </button>
                                <button
                                    onClick={() => handleCodeDetected('BATCH_B789_ORGANIC', 'qr')}
                                    className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded"
                                >
                                    Batch QR
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => handleCodeDetected('8901030875991', 'barcode')}
                                    className="bg-green-100 text-green-800 px-2 py-1 rounded"
                                >
                                    EAN-13
                                </button>
                                <button
                                    onClick={() => handleCodeDetected('012345678905', 'barcode')}
                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded"
                                >
                                    UPC-A
                                </button>
                                <button
                                    onClick={() => handleCodeDetected('AGR001TOMATO', 'barcode')}
                                    className="bg-purple-100 text-purple-800 px-2 py-1 rounded"
                                >
                                    Custom Code
                                </button>
                                <button
                                    onClick={() => handleCodeDetected('ORG2024001', 'barcode')}
                                    className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded"
                                >
                                    Organic Cert
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QRScanner
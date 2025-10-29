import { useState, useRef, useCallback, useEffect } from 'react'
import { Eye, X, ShoppingCart, Star, User, MapPin, Loader, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Webcam from 'react-webcam'

const ProductViewScanner = ({ isOpen, onClose }) => {
    const navigate = useNavigate()
    const [isScanning, setIsScanning] = useState(false)
    const [scannedProduct, setScannedProduct] = useState(null)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const webcamRef = useRef(null)
    const streamRef = useRef(null)

    // Mock product database for direct viewing
    const productDatabase = {
        'PROD_TOMATO_001': {
            id: 'TOMATO_001',
            name: 'Organic Tomatoes',
            price: 120,
            unit: 'kg',
            farmer: {
                name: 'Rajesh Kumar',
                location: 'Punjab, India',
                rating: 4.8,
                experience: '15 years'
            },
            image: 'https://images.unsplash.com/photo-1546470427-e5b89b618b84?w=400',
            images: [
                'https://images.unsplash.com/photo-1546470427-e5b89b618b84?w=400',
                'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400'
            ],
            description: 'Fresh organic tomatoes grown without pesticides. Rich in vitamins and perfect for cooking.',
            category: 'Vegetables',
            inStock: true,
            quantity: 50,
            organic: true,
            certifications: ['Organic', 'Pesticide-Free'],
            nutritionFacts: {
                calories: 18,
                protein: '0.9g',
                carbs: '3.9g',
                fiber: '1.2g',
                vitaminC: '14mg'
            },
            reviews: [
                { user: 'Priya S.', rating: 5, comment: 'Very fresh and tasty!' },
                { user: 'Amit K.', rating: 4, comment: 'Good quality tomatoes' }
            ]
        },
        'PROD_CORN_002': {
            id: 'CORN_002',
            name: 'Sweet Corn',
            price: 80,
            unit: 'kg',
            farmer: {
                name: 'Priya Sharma',
                location: 'Maharashtra, India',
                rating: 4.6,
                experience: '12 years'
            },
            image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400',
            images: [
                'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400',
                'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400'
            ],
            description: 'Sweet and tender corn kernels, perfect for boiling or grilling. Naturally sweet and nutritious.',
            category: 'Vegetables',
            inStock: true,
            quantity: 30,
            organic: false,
            certifications: ['Fresh', 'Quality Assured'],
            nutritionFacts: {
                calories: 86,
                protein: '3.3g',
                carbs: '19g',
                fiber: '2.7g',
                vitaminC: '7mg'
            },
            reviews: [
                { user: 'Ravi M.', rating: 5, comment: 'Very sweet and fresh!' },
                { user: 'Sunita D.', rating: 4, comment: 'Kids love it' }
            ]
        },
        'PROD_RICE_003': {
            id: 'RICE_003',
            name: 'Basmati Rice',
            price: 150,
            unit: 'kg',
            farmer: {
                name: 'Suresh Patel',
                location: 'Haryana, India',
                rating: 4.9,
                experience: '20 years'
            },
            image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
            images: [
                'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
                'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400'
            ],
            description: 'Premium quality basmati rice with long grains and aromatic fragrance. Perfect for biryanis and pulao.',
            category: 'Grains',
            inStock: true,
            quantity: 100,
            organic: true,
            certifications: ['Organic', 'Premium Quality', 'Export Grade'],
            nutritionFacts: {
                calories: 130,
                protein: '2.7g',
                carbs: '28g',
                fiber: '0.4g',
                iron: '0.8mg'
            },
            reviews: [
                { user: 'Meera J.', rating: 5, comment: 'Best basmati rice!' },
                { user: 'Kiran P.', rating: 5, comment: 'Excellent aroma and taste' }
            ]
        }
    }

    useEffect(() => {
        if (isOpen) {
            startScanning()
        }
        return () => {
            stopScanning()
        }
    }, [isOpen])

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

            detectProductCode()
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

    const detectProductCode = () => {
        const scanInterval = setInterval(() => {
            if (!isScanning) {
                clearInterval(scanInterval)
                return
            }

            // Simulate product code detection
            const mockDetection = Math.random() < 0.15 // 15% chance per scan

            if (mockDetection) {
                clearInterval(scanInterval)
                const productCodes = Object.keys(productDatabase)
                const randomCode = productCodes[Math.floor(Math.random() * productCodes.length)]
                handleProductCodeDetected(randomCode)
            }
        }, 300)

        setTimeout(() => {
            clearInterval(scanInterval)
        }, 30000)
    }

    const handleProductCodeDetected = async (code) => {
        stopScanning()
        setIsLoading(true)

        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        const product = productDatabase[code]
        if (product) {
            setScannedProduct(product)
        } else {
            setError('Product not found. Please try again.')
        }
        setIsLoading(false)
    }

    const handleAddToCart = () => {
        // Add to cart logic here
        alert(`${scannedProduct.name} added to cart!`)
    }

    const handleViewFullProduct = () => {
        navigate(`/products/${scannedProduct.id}`)
        onClose()
    }

    const handleManualCode = () => {
        const code = prompt('Enter product code manually:')
        if (code) {
            handleProductCodeDetected(code)
        }
    }

    const resetScanner = () => {
        setScannedProduct(null)
        setError('')
        setIsLoading(false)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <Eye className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Product Scanner</h2>
                            <p className="text-sm text-gray-600">Scan to view product details</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    {isLoading ? (
                        /* Loading State */
                        <div className="text-center py-12">
                            <Loader className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Product...</h3>
                            <p className="text-gray-600">Fetching product details</p>
                        </div>
                    ) : scannedProduct ? (
                        /* Product Details */
                        <div className="space-y-6">
                            {/* Product Images */}
                            <div className="grid grid-cols-2 gap-4">
                                {scannedProduct.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${scannedProduct.name} ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                ))}
                            </div>

                            {/* Product Info */}
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">{scannedProduct.name}</h3>
                                        <p className="text-lg text-green-600 font-semibold">₹{scannedProduct.price} per {scannedProduct.unit}</p>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{scannedProduct.category}</span>
                                            {scannedProduct.organic && (
                                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Organic</span>
                                            )}
                                            <span className={`px-2 py-1 rounded text-sm ${scannedProduct.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {scannedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-700 mb-4">{scannedProduct.description}</p>

                                {/* Farmer Info */}
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                                    <div className="flex items-center space-x-3">
                                        <User className="w-8 h-8 text-gray-600" />
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{scannedProduct.farmer.name}</h4>
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                <div className="flex items-center space-x-1">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>{scannedProduct.farmer.location}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Star className="w-4 h-4 text-yellow-500" />
                                                    <span>{scannedProduct.farmer.rating}</span>
                                                </div>
                                                <span>{scannedProduct.farmer.experience} experience</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Certifications */}
                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Certifications:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {scannedProduct.certifications.map((cert, index) => (
                                            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                {cert}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Nutrition Facts */}
                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-900 mb-2">Nutrition Facts (per 100g):</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        {Object.entries(scannedProduct.nutritionFacts).map(([key, value]) => (
                                            <div key={key} className="flex justify-between">
                                                <span className="text-gray-600 capitalize">{key}:</span>
                                                <span className="font-medium">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Reviews */}
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-900 mb-2">Customer Reviews:</h4>
                                    <div className="space-y-2">
                                        {scannedProduct.reviews.map((review, index) => (
                                            <div key={index} className="bg-gray-50 p-3 rounded">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="font-medium text-sm">{review.user}</span>
                                                    <div className="flex">
                                                        {[...Array(review.rating)].map((_, i) => (
                                                            <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-700">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-3">
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={!scannedProduct.inStock}
                                        className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        <span>Add to Cart</span>
                                    </button>
                                    <button
                                        onClick={handleViewFullProduct}
                                        className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        <span>View Full Details</span>
                                    </button>
                                </div>

                                <button
                                    onClick={resetScanner}
                                    className="w-full mt-3 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
                                >
                                    Scan Another Product
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
                                            <div className="w-48 h-48 border-2 border-blue-500 rounded-lg relative">
                                                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500"></div>
                                                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500"></div>
                                                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500"></div>
                                                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500"></div>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-4 left-0 right-0 text-center">
                                            <p className="text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full inline-block">
                                                Scan product barcode
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 mb-4">Point camera at product barcode</p>
                                        <button
                                            onClick={startScanning}
                                            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
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
                                <h4 className="font-medium text-blue-900 mb-2">Demo Product Codes:</h4>
                                <div className="space-y-2">
                                    {Object.entries(productDatabase).map(([code, product]) => (
                                        <button
                                            key={code}
                                            onClick={() => handleProductCodeDetected(code)}
                                            className="w-full text-left bg-blue-100 text-blue-800 px-3 py-2 rounded text-sm hover:bg-blue-200"
                                        >
                                            <div className="font-mono text-xs">{code}</div>
                                            <div>{product.name} - ₹{product.price}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductViewScanner

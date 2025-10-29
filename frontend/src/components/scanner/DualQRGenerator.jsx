import { useState } from 'react'
import { QrCode, CreditCard, Eye, Download, Share2, Printer } from 'lucide-react'
import PaymentQRGenerator from './PaymentQRGenerator'
import ProductViewQRGenerator from './ProductViewQRGenerator'

const DualQRGenerator = ({
    productId = 'AGR001',
    productName = 'Organic Tomatoes',
    farmerName = 'John Smith',
    farmerId = 'F123',
    price = '5.99',
    category = 'Vegetables',
    description = "Fresh organic tomatoes from local farm"
}) => {
    const [activeTab, setActiveTab] = useState('both') // 'both', 'payment', 'view'
    const [printMode, setPrintMode] = useState(false)

    const handlePrintBoth = () => {
        setPrintMode(true)
        setTimeout(() => {
            window.print()
            setPrintMode(false)
        }, 100)
    }

    const handleDownloadBoth = async () => {
        // Create a canvas to combine both QR codes
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        // Set canvas size for two QR codes side by side
        canvas.width = 600
        canvas.height = 350

        // White background
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Add title
        ctx.fillStyle = 'black'
        ctx.font = 'bold 20px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(`${productName} by ${farmerName}`, canvas.width / 2, 30)

        // Add labels
        ctx.font = '16px Arial'
        ctx.fillText('Scan to View Product', 150, 60)
        ctx.fillText('Scan to Pay', 450, 60)

        // Note: In a real implementation, you'd load the actual QR code images
        // and draw them on the canvas. For now, we'll create a simple download
        const link = document.createElement('a')
        link.download = `${productName.replace(/\s+/g, '-').toLowerCase()}-dual-qr.png`
        link.href = canvas.toDataURL()
        link.click()
    }

    if (printMode) {
        return (
            <div className="print-only bg-white p-8">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">{productName}</h1>
                    <p className="text-lg text-gray-600">by {farmerName}</p>
                    <p className="text-xl font-bold text-green-600">${price}</p>
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div className="text-center">
                        <h2 className="text-lg font-semibold mb-4">View Product Details</h2>
                        <ProductViewQRGenerator
                            productId={productId}
                            productName={productName}
                            farmerName={farmerName}
                            farmerId={farmerId}
                            price={price}
                            category={category}
                        />
                    </div>

                    <div className="text-center">
                        <h2 className="text-lg font-semibold mb-4">Make Payment</h2>
                        <PaymentQRGenerator
                            farmerId={farmerId}
                            farmerName={farmerName}
                            amount={price}
                            productId={productId}
                            productName={productName}
                            description={description}
                        />
                    </div>
                </div>

                <div className="text-center mt-6 text-sm text-gray-600">
                    <p>Scan with any smartphone camera or QR code app</p>
                    <p>No app installation required</p>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Header */}
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">QR Code Generator</h1>
                <p className="text-gray-600">Generate QR codes for product viewing and payments</p>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <h2 className="text-xl font-semibold text-blue-900">{productName}</h2>
                    <p className="text-blue-700">by {farmerName} • ${price} • {category}</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-6">
                <div className="bg-gray-100 rounded-lg p-1 flex">
                    <button
                        onClick={() => setActiveTab('both')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${activeTab === 'both'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <QrCode className="w-4 h-4" />
                        <span>Both QR Codes</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('view')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${activeTab === 'view'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <Eye className="w-4 h-4" />
                        <span>View Product</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('payment')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${activeTab === 'payment'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <CreditCard className="w-4 h-4" />
                        <span>Payment</span>
                    </button>
                </div>
            </div>

            {/* Content */}
            {activeTab === 'both' && (
                <div>
                    {/* Quick Actions for Both */}
                    <div className="flex justify-center space-x-4 mb-6">
                        <button
                            onClick={handleDownloadBoth}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                        >
                            <Download className="w-5 h-5" />
                            <span>Download Both QR Codes</span>
                        </button>
                        <button
                            onClick={handlePrintBoth}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                        >
                            <Printer className="w-5 h-5" />
                            <span>Print Both QR Codes</span>
                        </button>
                    </div>

                    {/* Both QR Codes Side by Side */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                <Eye className="w-5 h-5 text-green-600" />
                                <span>Product View QR Code</span>
                            </h3>
                            <ProductViewQRGenerator
                                productId={productId}
                                productName={productName}
                                farmerName={farmerName}
                                farmerId={farmerId}
                                price={price}
                                category={category}
                            />
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                                <span>Payment QR Code</span>
                            </h3>
                            <PaymentQRGenerator
                                farmerId={farmerId}
                                farmerName={farmerName}
                                amount={price}
                                productId={productId}
                                productName={productName}
                                description={description}
                            />
                        </div>
                    </div>

                    {/* Usage Guide */}
                    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Use Your QR Codes</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-medium text-green-700 mb-2">📱 Product View QR (Left)</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Place on product packaging</li>
                                    <li>• Display at your farm stand</li>
                                    <li>• Share on social media</li>
                                    <li>• Customers see full product details</li>
                                    <li>• Includes reviews and descriptions</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-medium text-blue-700 mb-2">💳 Payment QR (Right)</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>• Enable instant payments</li>
                                    <li>• Works with UPI, PayPal, Stripe</li>
                                    <li>• Customers pay directly</li>
                                    <li>• No cash handling needed</li>
                                    <li>• Automatic payment confirmation</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'view' && (
                <div className="max-w-2xl mx-auto">
                    <ProductViewQRGenerator
                        productId={productId}
                        productName={productName}
                        farmerName={farmerName}
                        farmerId={farmerId}
                        price={price}
                        category={category}
                    />
                </div>
            )}

            {activeTab === 'payment' && (
                <div className="max-w-2xl mx-auto">
                    <PaymentQRGenerator
                        farmerId={farmerId}
                        farmerName={farmerName}
                        amount={price}
                        productId={productId}
                        productName={productName}
                        description={description}
                    />
                </div>
            )}

            {/* Tips Section */}
            <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">💡 Pro Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-yellow-800">
                    <div>
                        <h4 className="font-medium mb-1">Placement</h4>
                        <p>Place QR codes at eye level and ensure good lighting for easy scanning.</p>
                    </div>
                    <div>
                        <h4 className="font-medium mb-1">Size</h4>
                        <p>Use medium or large sizes for outdoor displays. Small sizes work for packaging.</p>
                    </div>
                    <div>
                        <h4 className="font-medium mb-1">Testing</h4>
                        <p>Always test your QR codes with different devices before printing or sharing.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DualQRGenerator
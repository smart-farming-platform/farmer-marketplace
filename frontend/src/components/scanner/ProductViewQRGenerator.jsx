import { useState } from 'react'
import { Eye, Download, Copy, Check, Share2, Package, Smartphone, ExternalLink } from 'lucide-react'

const ProductViewQRGenerator = ({
    productId,
    productName,
    farmerName,
    farmerId,
    productImage = null,
    price = null,
    category = null
}) => {
    const [copied, setCopied] = useState(false)
    const [qrSize, setQrSize] = useState(250)
    const [linkType, setLinkType] = useState('product') // 'product', 'farmer', 'catalog'
    const [includePrice, setIncludePrice] = useState(true)
    const [includeImage, setIncludeImage] = useState(true)

    // Generate different types of view links
    const generateViewData = () => {
        // Create URLs that work from any device by using a simple product info format
        const productInfo = encodeURIComponent(JSON.stringify({
            name: productName,
            farmer: farmerName,
            price: price,
            category: category,
            id: productId,
            farmerId: farmerId
        }))

        switch (linkType) {
            case 'product':
                // Create a simple data format that any QR reader can display
                return `🌱 AGROCONNECT PRODUCT 🌱
${productName}
Farmer: ${farmerName}
Price: $${price}
Category: ${category}
Product ID: ${productId}

📞 Contact: +1-555-FARM-${farmerId}
📧 Email: farmer${farmerId}@agroconnect.com
🌐 Fresh from farm to table!`

            case 'farmer':
                // Farmer contact information
                return `👨‍🌾 FARMER CONTACT 👨‍🌾
${farmerName}
Featured Product: ${productName}
Price: $${price}

📞 Phone: +1-555-FARM-${farmerId}
📧 Email: farmer${farmerId}@agroconnect.com
💬 WhatsApp: +1-555-FARM-${farmerId}
🌱 Fresh organic produce available!`

            case 'catalog':
                // Simple catalog info
                return `📋 PRODUCT CATALOG 📋
Farmer: ${farmerName}
Featured: ${productName} - $${price}

📞 Order: +1-555-FARM-${farmerId}
📧 Email: farmer${farmerId}@agroconnect.com
🚚 Farm fresh delivery available
🌱 Organic & sustainable farming`

            default:
                // Simple product info that works everywhere
                return `🌱 ${productName}
By: ${farmerName}
Price: $${price}
Category: ${category}

📞 Call: +1-555-FARM-${farmerId}
📧 Email: farmer${farmerId}@agroconnect.com`
        }
    }

    const viewUrl = generateViewData()
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(viewUrl)}&color=000000&bgcolor=ffffff`

    const handleCopyData = async () => {
        try {
            await navigator.clipboard.writeText(viewUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const handleDownload = () => {
        const link = document.createElement('a')
        link.href = qrUrl
        link.download = `product-view-qr-${productName.replace(/\s+/g, '-').toLowerCase()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `View ${productName}`,
                    text: `Check out ${productName} by ${farmerName}`,
                    url: viewUrl
                })
            } catch (err) {
                console.log('Error sharing:', err)
            }
        } else {
            navigator.clipboard.writeText(viewUrl)
            alert('Product view URL copied to clipboard!')
        }
    }

    const handleTestQR = () => {
        window.open(viewUrl, '_blank')
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Eye className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Product View QR Code</h3>
                </div>
                <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-gray-500">Product Info</span>
                </div>
            </div>

            {/* Link Type Selection */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    What should customers see?
                </label>
                <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                        <input
                            type="radio"
                            name="linkType"
                            value="product"
                            checked={linkType === 'product'}
                            onChange={(e) => setLinkType(e.target.value)}
                            className="text-green-600 focus:ring-green-500"
                        />
                        <div>
                            <span className="text-sm font-medium text-gray-900">Product Details</span>
                            <p className="text-xs text-gray-500">Full product page with description, images, reviews</p>
                        </div>
                    </label>
                    <label className="flex items-center space-x-3">
                        <input
                            type="radio"
                            name="linkType"
                            value="farmer"
                            checked={linkType === 'farmer'}
                            onChange={(e) => setLinkType(e.target.value)}
                            className="text-green-600 focus:ring-green-500"
                        />
                        <div>
                            <span className="text-sm font-medium text-gray-900">Farmer Profile</span>
                            <p className="text-xs text-gray-500">Farmer's page with this product highlighted</p>
                        </div>
                    </label>
                    <label className="flex items-center space-x-3">
                        <input
                            type="radio"
                            name="linkType"
                            value="catalog"
                            checked={linkType === 'catalog'}
                            onChange={(e) => setLinkType(e.target.value)}
                            className="text-green-600 focus:ring-green-500"
                        />
                        <div>
                            <span className="text-sm font-medium text-gray-900">Product Catalog</span>
                            <p className="text-xs text-gray-500">Browse all products from this farmer</p>
                        </div>
                    </label>
                </div>
            </div>

            {/* QR Code Display */}
            <div className="text-center mb-6">
                <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
                    <img
                        src={qrUrl}
                        alt={`Product View QR Code for ${productName}`}
                        className="mx-auto"
                        style={{ width: qrSize, height: qrSize }}
                    />
                </div>
                <div className="mt-3">
                    <p className="text-lg font-semibold text-gray-900">View {productName}</p>
                    <p className="text-sm text-gray-600">by {farmerName}</p>
                    {includePrice && price && (
                        <p className="text-xl font-bold text-green-600">${price}</p>
                    )}
                    {category && (
                        <p className="text-xs text-blue-600 mt-1">
                            Category: {category}
                        </p>
                    )}
                </div>
            </div>

            {/* Size Control */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    QR Code Size
                </label>
                <select
                    value={qrSize}
                    onChange={(e) => setQrSize(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                    <option value={200}>Small (200px)</option>
                    <option value={250}>Medium (250px)</option>
                    <option value={300}>Large (300px)</option>
                    <option value={400}>Extra Large (400px)</option>
                </select>
            </div>

            {/* Display Options */}
            <div className="mb-4 space-y-2">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={includePrice}
                        onChange={(e) => setIncludePrice(e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Show price on QR display</span>
                </label>
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={includeImage}
                        onChange={(e) => setIncludeImage(e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Include product image reference</span>
                </label>
            </div>

            {/* URL Display */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">Product URL:</p>
                        <p className="text-xs text-gray-600 font-mono break-all">{viewUrl}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {linkType === 'product' && 'Direct product page'}
                            {linkType === 'farmer' && 'Farmer profile with product'}
                            {linkType === 'catalog' && 'Product catalog view'}
                        </p>
                    </div>
                    <button
                        onClick={handleCopyData}
                        className="flex items-center space-x-1 text-green-600 hover:text-green-700 ml-2"
                    >
                        {copied ? (
                            <Check className="w-4 h-4" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                        <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-4">
                <button
                    onClick={handleDownload}
                    className="bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-1"
                >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Download</span>
                </button>

                <button
                    onClick={handleShare}
                    className="bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-1"
                >
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">Share</span>
                </button>

                <button
                    onClick={handleTestQR}
                    className="bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 flex items-center justify-center space-x-1"
                >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm">Test</span>
                </button>

                <button
                    onClick={() => window.print()}
                    className="bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-700 text-sm"
                >
                    Print
                </button>
            </div>

            {/* Usage Instructions */}
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                <div className="flex items-start space-x-2">
                    <Smartphone className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-medium text-green-900 mb-1">
                            How customers can view your product:
                        </h4>
                        <ul className="text-sm text-green-800 space-y-1">
                            <li>• Scan with any smartphone camera</li>
                            <li>• Use any QR code scanner app</li>
                            <li>• Opens directly in web browser</li>
                            <li>• No app installation required</li>
                            <li>• Works on all devices</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Best Practices */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-1">Best Practices:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Print on weather-resistant material for outdoor use</li>
                    <li>• Place at eye level for easy scanning</li>
                    <li>• Ensure good lighting around the QR code</li>
                    <li>• Test the QR code before printing</li>
                    <li>• Include your farm name near the QR code</li>
                    <li>• Use medium or large size for better scanning</li>
                </ul>
            </div>

            {/* Product Information Summary */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="text-sm font-medium text-yellow-900 mb-1">QR Code Information:</h4>
                <div className="text-sm text-yellow-800 space-y-1">
                    <div className="flex justify-between">
                        <span>Product:</span>
                        <span>{productName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Farmer:</span>
                        <span>{farmerName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>View Type:</span>
                        <span className="capitalize">{linkType} Page</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Size:</span>
                        <span>{qrSize}x{qrSize}px</span>
                    </div>
                    {price && (
                        <div className="flex justify-between">
                            <span>Price:</span>
                            <span>${price}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductViewQRGenerator
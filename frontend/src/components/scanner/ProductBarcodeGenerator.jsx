import { useState } from 'react'
import { BarChart3, Download, Copy, Check, Eye, ShoppingCart, CreditCard } from 'lucide-react'

const ProductBarcodeGenerator = ({ product }) => {
    const [copied, setCopied] = useState(false)
    const [barcodeSize, setBarcodeSize] = useState(200)
    const [includePrice, setIncludePrice] = useState(true)
    const [includePaymentCode, setIncludePaymentCode] = useState(true)

    // Generate different barcode types for the product
    const generateBarcodes = () => {
        const productId = product?.id || 'DEMO001'
        const productName = product?.name || 'Demo Product'
        const price = product?.price || 100

        return {
            // Product viewing barcode
            productBarcode: `PROD_${productId}`,
            productBarcodeEAN: `890${productId.toString().padStart(9, '0')}1`,

            // Payment barcode
            paymentBarcode: `PAY_${productId}`,
            paymentBarcodeEAN: `891${productId.toString().padStart(9, '0')}2`,

            // Combined barcode with price
            combinedBarcode: `${productId}_${price}`,

            // URLs for barcode generation
            productBarcodeUrl: `https://barcode.tec-it.com/barcode.ashx?data=PROD_${productId}&code=Code128&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&qunit=Mm&quiet=0`,
            paymentBarcodeUrl: `https://barcode.tec-it.com/barcode.ashx?data=PAY_${productId}&code=Code128&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&qunit=Mm&quiet=0`,
            productEANUrl: `https://barcode.tec-it.com/barcode.ashx?data=890${productId.toString().padStart(9, '0')}1&code=EAN13&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&qunit=Mm&quiet=0`,
            paymentEANUrl: `https://barcode.tec-it.com/barcode.ashx?data=891${productId.toString().padStart(9, '0')}2&code=EAN13&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&qunit=Mm&quiet=0`
        }
    }

    const barcodes = generateBarcodes()

    const handleCopy = async (text, type) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(type)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const handleDownload = (url, filename) => {
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const BarcodeCard = ({ title, subtitle, barcode, url, icon, color, type }) => (
        <div className={`bg-white border-2 border-${color}-200 rounded-lg p-4`}>
            <div className="flex items-center space-x-2 mb-3">
                {icon}
                <div>
                    <h4 className={`font-medium text-${color}-900`}>{title}</h4>
                    <p className={`text-sm text-${color}-700`}>{subtitle}</p>
                </div>
            </div>

            {/* Barcode Image */}
            <div className="text-center mb-4">
                <div className="inline-block p-3 bg-white border border-gray-200 rounded">
                    <img
                        src={url}
                        alt={`${title} Barcode`}
                        className="mx-auto"
                        style={{ width: barcodeSize, height: barcodeSize * 0.4 }}
                    />
                </div>
                <div className="mt-2 font-mono text-sm text-gray-600">{barcode}</div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
                <button
                    onClick={() => handleCopy(barcode, type)}
                    className={`flex-1 bg-${color}-100 text-${color}-800 py-2 px-3 rounded text-sm hover:bg-${color}-200 flex items-center justify-center space-x-1`}
                >
                    {copied === type ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied === type ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                    onClick={() => handleDownload(url, `${product?.name || 'product'}-${type}-barcode.gif`)}
                    className={`flex-1 bg-${color}-600 text-white py-2 px-3 rounded text-sm hover:bg-${color}-700 flex items-center justify-center space-x-1`}
                >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                </button>
            </div>
        </div>
    )

    return (
        <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Product Barcodes</h3>
            </div>

            {/* Product Info */}
            {product && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-4">
                        {product.image && (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                        )}
                        <div>
                            <h4 className="font-semibold text-gray-900">{product.name}</h4>
                            <p className="text-gray-600">Price: ₹{product.price}</p>
                            <p className="text-sm text-gray-500">ID: {product.id}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Barcode Size Control */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Barcode Size
                </label>
                <select
                    value={barcodeSize}
                    onChange={(e) => setBarcodeSize(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value={150}>Small (150px)</option>
                    <option value={200}>Medium (200px)</option>
                    <option value={300}>Large (300px)</option>
                    <option value={400}>Extra Large (400px)</option>
                </select>
            </div>

            {/* Barcode Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product View Barcode */}
                <BarcodeCard
                    title="Product View Barcode"
                    subtitle="Scan to view product details"
                    barcode={barcodes.productBarcode}
                    url={barcodes.productBarcodeUrl}
                    icon={<Eye className="w-5 h-5 text-blue-600" />}
                    color="blue"
                    type="product"
                />

                {/* Payment Barcode */}
                <BarcodeCard
                    title="Payment Barcode"
                    subtitle="Scan to pay for this product"
                    barcode={barcodes.paymentBarcode}
                    url={barcodes.paymentBarcodeUrl}
                    icon={<CreditCard className="w-5 h-5 text-green-600" />}
                    color="green"
                    type="payment"
                />

                {/* EAN-13 Product Barcode */}
                <BarcodeCard
                    title="EAN-13 Product Code"
                    subtitle="Standard retail barcode"
                    barcode={barcodes.productBarcodeEAN}
                    url={barcodes.productEANUrl}
                    icon={<ShoppingCart className="w-5 h-5 text-purple-600" />}
                    color="purple"
                    type="ean-product"
                />

                {/* EAN-13 Payment Barcode */}
                <BarcodeCard
                    title="EAN-13 Payment Code"
                    subtitle="Standard payment barcode"
                    barcode={barcodes.paymentBarcodeEAN}
                    url={barcodes.paymentEANUrl}
                    icon={<CreditCard className="w-5 h-5 text-orange-600" />}
                    color="orange"
                    type="ean-payment"
                />
            </div>

            {/* Usage Instructions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">📱 Product View Barcodes:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Customers scan to view product details</li>
                        <li>• Shows price, description, farmer info</li>
                        <li>• Links to product page directly</li>
                        <li>• Works with any barcode scanner</li>
                    </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">💳 Payment Barcodes:</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                        <li>• Customers scan to pay instantly</li>
                        <li>• Requires user to be logged in</li>
                        <li>• Shows product and price confirmation</li>
                        <li>• Processes payment automatically</li>
                    </ul>
                </div>
            </div>

            {/* Print All Button */}
            <div className="mt-6 text-center">
                <button
                    onClick={() => window.print()}
                    className="bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 flex items-center space-x-2 mx-auto"
                >
                    <Download className="w-5 h-5" />
                    <span>Print All Barcodes</span>
                </button>
            </div>

            {/* Barcode Information */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">📋 Barcode Information:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-yellow-800">
                    <div>
                        <strong>Product View:</strong>
                        <div className="font-mono text-xs">{barcodes.productBarcode}</div>
                    </div>
                    <div>
                        <strong>Payment Code:</strong>
                        <div className="font-mono text-xs">{barcodes.paymentBarcode}</div>
                    </div>
                    <div>
                        <strong>EAN-13 Product:</strong>
                        <div className="font-mono text-xs">{barcodes.productBarcodeEAN}</div>
                    </div>
                    <div>
                        <strong>EAN-13 Payment:</strong>
                        <div className="font-mono text-xs">{barcodes.paymentBarcodeEAN}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductBarcodeGenerator
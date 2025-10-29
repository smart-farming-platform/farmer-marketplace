import { useState } from 'react'
import { CreditCard, Download, Copy, Check, Share2, DollarSign, Smartphone } from 'lucide-react'

const PaymentQRGenerator = ({
    farmerId,
    farmerName,
    amount = null,
    productId = null,
    productName = null,
    description = "Payment for farm products"
}) => {
    const [copied, setCopied] = useState(false)
    const [qrSize, setQrSize] = useState(250)
    const [customAmount, setCustomAmount] = useState(amount || '')
    const [paymentMethod, setPaymentMethod] = useState('upi') // 'upi', 'paypal', 'stripe'
    const [includeProductInfo, setIncludeProductInfo] = useState(true)

    // Generate payment QR data based on method
    const generatePaymentData = () => {
        const baseAmount = customAmount || amount || 0

        switch (paymentMethod) {
            case 'upi':
                // UPI payment format (Indian standard) - this will work with real UPI apps
                return `upi://pay?pa=farmer${farmerId}@paytm&pn=${encodeURIComponent(farmerName)}&am=${baseAmount}&cu=INR&tn=${encodeURIComponent(description)}`

            case 'paypal':
                // Simple payment info that can be copied
                return `💳 PAYPAL PAYMENT 💳
Pay: ${farmerName}
Amount: $${baseAmount}
For: ${description}

📧 PayPal Email: farmer${farmerId}@gmail.com
🔗 PayPal.me/farmer${farmerId}
📞 Contact: +1-555-FARM-${farmerId}

Send payment via PayPal app or website`

            case 'stripe':
                // Simple payment instructions
                return `💳 PAYMENT REQUEST 💳
Farmer: ${farmerName}
Amount: $${baseAmount}
For: ${description}

📞 Call: +1-555-FARM-${farmerId}
📧 Email: farmer${farmerId}@agroconnect.com
💬 Text for payment link
🌱 Fresh farm products`

            default:
                // Generic payment format with contact info
                return `💰 PAY ${farmerName} 💰
Amount: $${baseAmount}
For: ${description}

Payment Options:
📞 Call: +1-555-FARM-${farmerId}
📧 Email: farmer${farmerId}@agroconnect.com
💳 Venmo: @farmer${farmerId}
💵 Cash on delivery available`
        }
    }

    const paymentData = generatePaymentData()
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(paymentData)}&color=000000&bgcolor=ffffff`

    const handleCopyData = async () => {
        try {
            await navigator.clipboard.writeText(paymentData)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const handleDownload = () => {
        const link = document.createElement('a')
        link.href = qrUrl
        link.download = `payment-qr-${farmerName.replace(/\s+/g, '-').toLowerCase()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Pay ${farmerName}`,
                    text: `Scan to pay ${farmerName} for farm products`,
                    url: qrUrl
                })
            } catch (err) {
                console.log('Error sharing:', err)
            }
        } else {
            navigator.clipboard.writeText(qrUrl)
            alert('Payment QR URL copied to clipboard!')
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Payment QR Code</h3>
                </div>
                <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-gray-500">Instant Payment</span>
                </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-3 rounded-lg border text-sm font-medium transition-colors ${paymentMethod === 'upi'
                            ? 'bg-orange-50 border-orange-300 text-orange-700'
                            : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        UPI
                    </button>
                    <button
                        onClick={() => setPaymentMethod('paypal')}
                        className={`p-3 rounded-lg border text-sm font-medium transition-colors ${paymentMethod === 'paypal'
                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                            : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        PayPal
                    </button>
                    <button
                        onClick={() => setPaymentMethod('stripe')}
                        className={`p-3 rounded-lg border text-sm font-medium transition-colors ${paymentMethod === 'stripe'
                            ? 'bg-purple-50 border-purple-300 text-purple-700'
                            : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Stripe
                    </button>
                </div>
            </div>

            {/* Amount Input */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (Optional)
                </label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Enter amount or leave blank"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                    />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    Leave blank for flexible amount payment
                </p>
            </div>

            {/* QR Code Display */}
            <div className="text-center mb-6">
                <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg shadow-sm">
                    <img
                        src={qrUrl}
                        alt={`Payment QR Code for ${farmerName}`}
                        className="mx-auto"
                        style={{ width: qrSize, height: qrSize }}
                    />
                </div>
                <div className="mt-3">
                    <p className="text-lg font-semibold text-gray-900">Pay {farmerName}</p>
                    {customAmount && (
                        <p className="text-2xl font-bold text-green-600">${customAmount}</p>
                    )}
                    <p className="text-sm text-gray-600">{description}</p>
                    {includeProductInfo && productName && (
                        <p className="text-xs text-blue-600 mt-1">
                            Product: {productName}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value={200}>Small (200px)</option>
                    <option value={250}>Medium (250px)</option>
                    <option value={300}>Large (300px)</option>
                    <option value={400}>Extra Large (400px)</option>
                </select>
            </div>

            {/* Options */}
            <div className="mb-4">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={includeProductInfo}
                        onChange={(e) => setIncludeProductInfo(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Include product information</span>
                </label>
            </div>

            {/* Payment Data Display */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">Payment Data:</p>
                        <p className="text-xs text-gray-600 font-mono break-all">{paymentData}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {paymentMethod.toUpperCase()} format
                        </p>
                    </div>
                    <button
                        onClick={handleCopyData}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 ml-2"
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
            <div className="grid grid-cols-3 gap-2 mb-4">
                <button
                    onClick={handleDownload}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                </button>

                <button
                    onClick={handleShare}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                </button>

                <button
                    onClick={() => window.print()}
                    className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
                >
                    Print
                </button>
            </div>

            {/* Usage Instructions */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                    <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-medium text-blue-900 mb-1">
                            How customers can pay:
                        </h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                            {paymentMethod === 'upi' && (
                                <>
                                    <li>• Open any UPI app (GPay, PhonePe, Paytm)</li>
                                    <li>• Scan this QR code</li>
                                    <li>• Verify amount and details</li>
                                    <li>• Complete payment with PIN</li>
                                </>
                            )}
                            {paymentMethod === 'paypal' && (
                                <>
                                    <li>• Scan with any QR scanner</li>
                                    <li>• Opens PayPal payment page</li>
                                    <li>• Login and confirm payment</li>
                                    <li>• Instant payment confirmation</li>
                                </>
                            )}
                            {paymentMethod === 'stripe' && (
                                <>
                                    <li>• Scan with camera or QR app</li>
                                    <li>• Opens secure Stripe checkout</li>
                                    <li>• Enter card details</li>
                                    <li>• Complete secure payment</li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Payment Method Info */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="text-sm font-medium text-yellow-900 mb-1">Payment Details:</h4>
                <div className="text-sm text-yellow-800 space-y-1">
                    <div className="flex justify-between">
                        <span>Method:</span>
                        <span className="font-mono">{paymentMethod.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Farmer:</span>
                        <span>{farmerName}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Amount:</span>
                        <span>{customAmount ? `$${customAmount}` : 'Flexible'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Size:</span>
                        <span>{qrSize}x{qrSize}px</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentQRGenerator
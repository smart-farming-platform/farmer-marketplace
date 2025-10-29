import { useState } from 'react'
import { QrCode, Download, Copy, Check, BarChart3, Palette, Share2 } from 'lucide-react'

const QRGenerator = ({ productId, productName, farmerName }) => {
    const [copied, setCopied] = useState(false)
    const [qrSize, setQrSize] = useState(200)
    const [codeType, setCodeType] = useState('qr') // 'qr' or 'barcode'
    const [qrColor, setQrColor] = useState('000000')
    const [bgColor, setBgColor] = useState('ffffff')
    const [includeText, setIncludeText] = useState(true)

    // Generate different types of codes
    const generateCodeData = () => {
        if (codeType === 'qr') {
            return `PRODUCT_${productId}`
        } else {
            // Generate barcode (EAN-13 format simulation)
            return `890${productId.toString().padStart(9, '0')}1`
        }
    }

    const codeData = generateCodeData()

    // Generate URLs for different code types
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(codeData)}&color=${qrColor}&bgcolor=${bgColor}`
    const barcodeUrl = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(codeData)}&code=EAN13&multiplebarcodes=false&translate-esc=false&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23${qrColor}&bgcolor=%23${bgColor}&qunit=Mm&quiet=0&eclevel=L`

    const handleCopyData = async () => {
        try {
            await navigator.clipboard.writeText(qrData)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const handleDownload = () => {
        const link = document.createElement('a')
        link.href = codeType === 'qr' ? qrUrl : barcodeUrl
        link.download = `${productName}-${codeType}-code.${codeType === 'qr' ? 'png' : 'gif'}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${productName} - ${codeType.toUpperCase()} Code`,
                    text: `Scan this ${codeType.toUpperCase()} code for ${productName} by ${farmerName}`,
                    url: codeType === 'qr' ? qrUrl : barcodeUrl
                })
            } catch (err) {
                console.log('Error sharing:', err)
            }
        } else {
            // Fallback to copying URL
            navigator.clipboard.writeText(codeType === 'qr' ? qrUrl : barcodeUrl)
            alert('Code URL copied to clipboard!')
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    {codeType === 'qr' ? (
                        <QrCode className="w-6 h-6 text-green-600" />
                    ) : (
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900">
                        Product {codeType === 'qr' ? 'QR Code' : 'Barcode'}
                    </h3>
                </div>
                <div className="flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-500">Customizable</span>
                </div>
            </div>

            {/* Code Type Toggle */}
            <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
                <button
                    onClick={() => setCodeType('qr')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${codeType === 'qr'
                        ? 'bg-white text-green-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <QrCode className="w-4 h-4 inline mr-2" />
                    QR Code
                </button>
                <button
                    onClick={() => setCodeType('barcode')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${codeType === 'barcode'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <BarChart3 className="w-4 h-4 inline mr-2" />
                    Barcode
                </button>
            </div>

            <div className="text-center mb-6">
                <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                    <img
                        src={codeType === 'qr' ? qrUrl : barcodeUrl}
                        alt={`${codeType === 'qr' ? 'QR Code' : 'Barcode'} for ${productName}`}
                        className="mx-auto"
                        style={{
                            width: codeType === 'qr' ? qrSize : Math.min(qrSize * 1.5, 300),
                            height: codeType === 'qr' ? qrSize : qrSize * 0.6
                        }}
                    />
                    {includeText && (
                        <div className="mt-2 text-xs text-gray-600">
                            <div className="font-mono">{codeData}</div>
                        </div>
                    )}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                    {codeType === 'qr' ? 'QR Code' : 'Barcode'} for: <span className="font-medium">{productName}</span>
                </p>
                <p className="text-xs text-gray-500">
                    By: {farmerName}
                </p>
            </div>

            {/* Customization Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Size Control */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Size
                    </label>
                    <select
                        value={qrSize}
                        onChange={(e) => setQrSize(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                        <option value={150}>Small (150px)</option>
                        <option value={200}>Medium (200px)</option>
                        <option value={300}>Large (300px)</option>
                        <option value={400}>Extra Large (400px)</option>
                    </select>
                </div>

                {/* Color Controls */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Colors
                    </label>
                    <div className="flex space-x-2">
                        <div className="flex-1">
                            <input
                                type="color"
                                value={`#${qrColor}`}
                                onChange={(e) => setQrColor(e.target.value.substring(1))}
                                className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                                title="Code Color"
                            />
                            <span className="text-xs text-gray-500">Code</span>
                        </div>
                        <div className="flex-1">
                            <input
                                type="color"
                                value={`#${bgColor}`}
                                onChange={(e) => setBgColor(e.target.value.substring(1))}
                                className="w-full h-10 border border-gray-300 rounded cursor-pointer"
                                title="Background Color"
                            />
                            <span className="text-xs text-gray-500">Background</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Options */}
            <div className="mb-4">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={includeText}
                        onChange={(e) => setIncludeText(e.target.checked)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Include text below code</span>
                </label>
            </div>

            {/* Code Data Display */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-700">
                            {codeType === 'qr' ? 'QR' : 'Barcode'} Data:
                        </p>
                        <p className="text-sm text-gray-600 font-mono">{codeData}</p>
                        <p className="text-xs text-gray-500 mt-1">
                            {codeType === 'qr' ? 'QR Code format' : 'EAN-13 format'}
                        </p>
                    </div>
                    <button
                        onClick={handleCopyData}
                        className="flex items-center space-x-1 text-green-600 hover:text-green-700"
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
            <div className="grid grid-cols-3 gap-2">
                <button
                    onClick={handleDownload}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                </button>

                <button
                    onClick={handleShare}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
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
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-1">
                    {codeType === 'qr' ? 'QR Code' : 'Barcode'} Usage:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    {codeType === 'qr' ? (
                        <>
                            <li>• Print and attach to product packaging</li>
                            <li>• Display at your farm stand or market stall</li>
                            <li>• Share digitally on social media</li>
                            <li>• Customers can scan to view product details</li>
                            <li>• Works with any QR code scanner app</li>
                        </>
                    ) : (
                        <>
                            <li>• Standard retail barcode format (EAN-13)</li>
                            <li>• Compatible with POS systems</li>
                            <li>• Print on product labels and packaging</li>
                            <li>• Use for inventory management</li>
                            <li>• Scan with barcode scanners</li>
                        </>
                    )}
                </ul>
            </div>

            {/* Code Information */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="text-sm font-medium text-yellow-900 mb-1">Code Information:</h4>
                <div className="text-sm text-yellow-800 space-y-1">
                    <div className="flex justify-between">
                        <span>Format:</span>
                        <span className="font-mono">{codeType === 'qr' ? 'QR Code' : 'EAN-13'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Data:</span>
                        <span className="font-mono">{codeData}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Size:</span>
                        <span>{qrSize}x{codeType === 'qr' ? qrSize : Math.round(qrSize * 0.6)}px</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Colors:</span>
                        <div className="flex space-x-1">
                            <div
                                className="w-4 h-4 border rounded"
                                style={{ backgroundColor: `#${qrColor}` }}
                                title="Code Color"
                            ></div>
                            <div
                                className="w-4 h-4 border rounded"
                                style={{ backgroundColor: `#${bgColor}` }}
                                title="Background Color"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QRGenerator
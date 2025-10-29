import { useState } from 'react'
import { QrCode, Scan } from 'lucide-react'
import QRScanner from './QRScanner'

const FloatingScanner = () => {
    const [showScanner, setShowScanner] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    return (
        <>
            {/* Floating Scanner Button */}
            <button
                onClick={() => setShowScanner(true)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition-all duration-300 hover:scale-110 z-40"
                title="QR & Barcode Scanner"
            >
                <div className="relative">
                    <QrCode className="w-6 h-6" />
                    {/* Scanning animation */}
                    <div className="absolute inset-0 border-2 border-white rounded-full animate-ping opacity-75"></div>
                </div>
            </button>

            {/* Tooltip */}
            {isHovered && (
                <div className="fixed bottom-20 right-6 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm z-50 animate-fade-in">
                    <div className="flex items-center space-x-2">
                        <Scan className="w-4 h-4" />
                        <span>QR & Barcode Scanner</span>
                    </div>
                    <div className="text-xs text-gray-300 mt-1">
                        Scan products, farmers, orders & more
                    </div>
                    {/* Arrow */}
                    <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
            )}

            {/* Scanner Modal */}
            <QRScanner
                isOpen={showScanner}
                onClose={() => setShowScanner(false)}
            />
        </>
    )
}

export default FloatingScanner
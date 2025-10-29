import { useState, useEffect } from 'react'
import { Smartphone, Camera, Zap, AlertCircle, CheckCircle } from 'lucide-react'

const MobileScannerHelper = ({ isVisible, onClose }) => {
    const [step, setStep] = useState(1)
    const [deviceInfo, setDeviceInfo] = useState({})

    useEffect(() => {
        // Detect device capabilities
        const detectDevice = () => {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            const hasCamera = navigator.mediaDevices && navigator.mediaDevices.getUserMedia
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
            const isAndroid = /Android/.test(navigator.userAgent)

            setDeviceInfo({
                isMobile,
                hasCamera,
                isIOS,
                isAndroid,
                browser: getBrowserName(),
                supportsCamera: hasCamera && isMobile
            })
        }

        detectDevice()
    }, [])

    const getBrowserName = () => {
        const userAgent = navigator.userAgent
        if (userAgent.includes('Chrome')) return 'Chrome'
        if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari'
        if (userAgent.includes('Firefox')) return 'Firefox'
        if (userAgent.includes('Edge')) return 'Edge'
        return 'Unknown'
    }

    const steps = [
        {
            title: "Welcome to Mobile Scanner",
            content: (
                <div className="text-center">
                    <Smartphone className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-700 mb-4">
                        Your device: <strong>{deviceInfo.isIOS ? 'iOS' : deviceInfo.isAndroid ? 'Android' : 'Mobile'}</strong>
                    </p>
                    <p className="text-gray-700 mb-4">
                        Browser: <strong>{deviceInfo.browser}</strong>
                    </p>
                    <div className={`p-3 rounded-lg ${deviceInfo.supportsCamera ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                        {deviceInfo.supportsCamera ? (
                            <div className="flex items-center space-x-2 text-green-800">
                                <CheckCircle className="w-5 h-5" />
                                <span>Camera scanning supported!</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 text-red-800">
                                <AlertCircle className="w-5 h-5" />
                                <span>Camera not available - use manual input</span>
                            </div>
                        )}
                    </div>
                </div>
            )
        },
        {
            title: "Camera Permission",
            content: (
                <div className="text-center">
                    <Camera className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <p className="text-gray-700 mb-4">
                        When you start scanning, your browser will ask for camera permission.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-blue-900 mb-2">What to do:</h4>
                        <ol className="text-sm text-blue-800 space-y-1 text-left">
                            <li>1. Tap "Allow" when prompted</li>
                            <li>2. If blocked, check browser settings</li>
                            <li>3. Look for camera icon in address bar</li>
                            <li>4. Enable camera permissions</li>
                        </ol>
                    </div>
                    {deviceInfo.isIOS && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <p className="text-xs text-yellow-800">
                                <strong>iOS Tip:</strong> Use Safari for best camera performance
                            </p>
                        </div>
                    )}
                </div>
            )
        },
        {
            title: "Scanning Tips",
            content: (
                <div>
                    <Zap className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                    <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <h4 className="font-medium text-green-900 mb-2">✅ For Best Results:</h4>
                            <ul className="text-sm text-green-800 space-y-1">
                                <li>• Hold phone 6-12 inches from code</li>
                                <li>• Use good lighting (natural light is best)</li>
                                <li>• Keep phone steady for 2-3 seconds</li>
                                <li>• Make sure code is flat and clean</li>
                            </ul>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <h4 className="font-medium text-blue-900 mb-2">📱 Mobile Controls:</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li>• Tap to switch between QR and Barcode modes</li>
                                <li>• Use manual input if camera fails</li>
                                <li>• Try demo codes to test functionality</li>
                                <li>• Check scan history for recent scans</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )
        }
    ]

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Mobile Scanner Guide
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-xl"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center mb-6">
                        {steps.map((_, index) => (
                            <div key={index} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${index + 1 === step
                                        ? 'bg-blue-600 text-white'
                                        : index + 1 < step
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    {index + 1 < step ? '✓' : index + 1}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`w-8 h-1 ${index + 1 < step ? 'bg-green-600' : 'bg-gray-200'
                                        }`}></div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Step Content */}
                    <div className="mb-6">
                        <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                            {steps[step - 1].title}
                        </h4>
                        {steps[step - 1].content}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex space-x-3">
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
                            >
                                Previous
                            </button>
                        )}

                        {step < steps.length ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                onClick={onClose}
                                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                            >
                                Start Scanning!
                            </button>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <button
                                onClick={() => setStep(1)}
                                className="bg-gray-100 text-gray-700 py-2 px-3 rounded hover:bg-gray-200"
                            >
                                Device Info
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                className="bg-gray-100 text-gray-700 py-2 px-3 rounded hover:bg-gray-200"
                            >
                                Scanning Tips
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MobileScannerHelper
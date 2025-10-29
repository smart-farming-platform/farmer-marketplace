import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Lock, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const DemoCheckoutForm = ({ cartItems, deliveryAddress, onSuccess }) => {
    const [isProcessing, setIsProcessing] = useState(false)
    const [paymentComplete, setPaymentComplete] = useState(false)
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiry: '',
        cvc: '',
        zip: ''
    })
    const navigate = useNavigate()

    const totalAmount = cartItems.reduce((total, item) =>
        total + (item.product.price * item.quantity), 0
    )

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setCardDetails(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setIsProcessing(true)

        // Simulate payment processing - GUARANTEED SUCCESS
        setTimeout(() => {
            // Always succeed - no API calls, no errors possible
            console.log('Demo payment completed for:', cartItems)

            // Create demo order data
            const demoOrder = {
                _id: 'demo-' + Date.now(),
                orderNumber: 'AGR' + Date.now(),
                totalAmount: totalAmount,
                status: 'confirmed',
                paymentStatus: 'paid',
                items: cartItems,
                deliveryAddress: deliveryAddress,
                createdAt: new Date().toISOString()
            }

            // Store demo order in localStorage
            try {
                const existingOrders = JSON.parse(localStorage.getItem('demoOrders') || '[]')
                existingOrders.push(demoOrder)
                localStorage.setItem('demoOrders', JSON.stringify(existingOrders))
            } catch (e) {
                console.log('LocalStorage not available, order stored in memory')
            }

            setPaymentComplete(true)
            toast.success('Payment successful! Order placed.')

            // Clear cart
            try {
                localStorage.removeItem('cart')
            } catch (e) {
                console.log('Cart clearing skipped')
            }

            setTimeout(() => {
                if (onSuccess) {
                    onSuccess(demoOrder)
                } else {
                    navigate('/dashboard')
                }
            }, 2000)

        }, 2000) // 2 second delay to simulate processing
    }

    if (paymentComplete) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
                <p className="text-gray-600 mb-4">Your order has been placed successfully with AgroConnect.</p>
                <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-800">
                        <strong>Order Total:</strong> ₹{totalAmount.toFixed(2)}
                    </p>
                    <p className="text-sm text-green-800">
                        <strong>Payment Method:</strong> Credit Card
                    </p>
                    <p className="text-sm text-green-800">
                        <strong>Status:</strong> Confirmed
                    </p>
                    <p className="text-sm text-green-800">
                        <strong>Order ID:</strong> AGR{Date.now()}
                    </p>
                </div>
                <p className="text-sm text-gray-500 mt-4">Redirecting to your dashboard...</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-6">
                <CreditCard className="w-6 h-6 text-green-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Payment Information</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                    <div className="space-y-2">
                        {cartItems.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                                <span>{item.product.name} x {item.quantity}</span>
                                <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        <div className="border-t pt-2 mt-2">
                            <div className="flex justify-between font-medium">
                                <span>Total</span>
                                <span>₹{totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Number */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                    </label>
                    <input
                        type="text"
                        name="cardNumber"
                        value={cardDetails.cardNumber}
                        onChange={handleInputChange}
                        placeholder="4242 4242 4242 4242"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                    />
                </div>

                {/* Expiry and CVC */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry
                        </label>
                        <input
                            type="text"
                            name="expiry"
                            value={cardDetails.expiry}
                            onChange={handleInputChange}
                            placeholder="12/25"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVC
                        </label>
                        <input
                            type="text"
                            name="cvc"
                            value={cardDetails.cvc}
                            onChange={handleInputChange}
                            placeholder="123"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            ZIP
                        </label>
                        <input
                            type="text"
                            name="zip"
                            value={cardDetails.zip}
                            onChange={handleInputChange}
                            placeholder="12345"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                        />
                    </div>
                </div>

                {/* Security Notice */}
                <div className="flex items-center text-sm text-gray-600">
                    <Lock className="w-4 h-4 mr-2" />
                    <span>Your payment information is secure and encrypted</span>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {isProcessing ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing Payment...
                        </div>
                    ) : (
                        `Pay ₹${totalAmount.toFixed(2)}`
                    )}
                </button>
            </form>

            {/* Demo Notice */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">AgroConnect Demo Payment</h4>
                <div className="text-xs text-blue-700 space-y-1">
                    <p>This is a demo payment system. Enter any card details:</p>
                    <p><strong>Card:</strong> Any 16 digits (e.g., 4242 4242 4242 4242)</p>
                    <p><strong>Expiry:</strong> Any future date (e.g., 12/25)</p>
                    <p><strong>CVC:</strong> Any 3 digits (e.g., 123)</p>
                    <p><strong>ZIP:</strong> Any 5 digits (e.g., 12345)</p>
                </div>
            </div>
        </div>
    )
}

export default DemoCheckoutForm
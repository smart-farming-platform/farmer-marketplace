import { useState } from 'react'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { useNavigate } from 'react-router-dom'
import { CreditCard, Lock } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const CheckoutForm = ({ cartItems, deliveryAddress, onSuccess }) => {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState(null)

  const totalAmount = cartItems.reduce((total, item) =>
    total + (item.product.price * item.quantity), 0
  )

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setPaymentError(null)

    try {
      // Create payment intent
      const { data } = await axios.post('/api/payments/create-payment-intent', {
        items: cartItems.map(item => ({
          productId: item.product._id,
          quantity: item.quantity
        })),
        deliveryAddress
      })

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: deliveryAddress.name || 'Customer',
              address: {
                line1: deliveryAddress.street,
                city: deliveryAddress.city,
                state: deliveryAddress.state,
                postal_code: deliveryAddress.zipCode,
                country: 'US'
              }
            }
          }
        }
      )

      if (error) {
        setPaymentError(error.message)
        toast.error(error.message)
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment with backend
        const orderResponse = await axios.post('/api/payments/confirm-payment', {
          paymentIntentId: paymentIntent.id,
          items: cartItems.map(item => ({
            productId: item.product._id,
            quantity: item.quantity
          })),
          deliveryAddress
        })

        toast.success('Payment successful! Order placed.')

        // Clear cart
        localStorage.removeItem('cart')

        // Call success callback or navigate
        if (onSuccess) {
          onSuccess(orderResponse.data.order)
        } else {
          navigate('/dashboard/orders')
        }
      }
    } catch (error) {
      console.error('Payment error:', error)
      setPaymentError(error.response?.data?.message || 'Payment failed')
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
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

        {/* Card Element */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="border border-gray-300 rounded-md p-3 bg-white">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {/* Security Notice */}
        <div className="flex items-center text-sm text-gray-600">
          <Lock className="w-4 h-4 mr-2" />
          <span>Your payment information is secure and encrypted</span>
        </div>

        {/* Error Message */}
        {paymentError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{paymentError}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe || isProcessing}
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

      {/* Test Card Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Test Card Information</h4>
        <div className="text-xs text-blue-700 space-y-1">
          <p><strong>Card Number:</strong> 4242 4242 4242 4242</p>
          <p><strong>Expiry:</strong> Any future date</p>
          <p><strong>CVC:</strong> Any 3 digits</p>
          <p><strong>ZIP:</strong> Any 5 digits</p>
        </div>
      </div>
    </div>
  )
}

export default CheckoutForm
"use client"

import { useState, useEffect, useCallback } from "react"
import CreditCardSelector from "../Card/CreditCardSelector"
import { useLocation } from "react-router-dom"
import api from "../api"
import axios from "axios"
import { loadStripe } from "@stripe/stripe-js"
import { CreditCard, Lock, CheckCircle, AlertCircle, Sparkles, Zap } from "lucide-react"

const StripePayment = ({ username }) => {
  const location = useLocation()
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)

  // Extract order info and optionally passed userId from route state
  const { orderId, amount, userId: passedUserId } = location.state || {}

  // State hooks
  const [userId, setUserId] = useState(passedUserId || null)
  const [showCardSelector, setShowCardSelector] = useState(true)
  const [selectedCard, setSelectedCard] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [email, setEmail] = useState("")
  const [stripeCustomerId, setStripeCustomerId] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const fetchStripeCustomerId = async () => {
      if (!userId) return
      try {
        const response = await api.get(`http://localhost:5108/users/stripe-customer-id?userId=${userId}`)
        setStripeCustomerId(response.data.stripeCustomerId)
      } catch (error) {
        console.error("Failed to fetch stripeCustomerId:", error)
      }
    }

    fetchStripeCustomerId()
  }, [userId])

  // Fetch user's email based on username on mount or username change
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:5108/users/email?username=${username}`)
        setEmail(response.data.email || response.data)
      } catch (error) {
        console.error("Failed to fetch email:", error)
      }
    }

    if (username) {
      fetchEmail()
    }
  }, [username])

  // Fetch userId from username if not passed via route state
  const fetchUserId = useCallback(async () => {
    if (!username) return
    try {
      const res = await api.get(`http://localhost:5108/users/by-username?username=${username}`)
      setUserId(res.data.id)
      localStorage.setItem("selectedUserId", res.data.id)
    } catch (err) {
      console.error("Failed to fetch user ID", err)
    }
  }, [username])

  useEffect(() => {
    if (!userId) {
      fetchUserId()
    }
  }, [fetchUserId, userId])

  const handleSelectCard = (card) => {
    setSelectedCard(card)
    setShowCardSelector(false)
  }

  // Complete handlePayment with debug logs and amount converted to cents
  const handlePayment = async () => {
    if (!selectedCard) {
      alert("Please select a card to proceed.")
      return
    }

    if (!userId || !orderId || !amount || !email) {
      alert("Missing required payment information.")
      console.warn("Missing data:", { userId, orderId, amount, email })
      return
    }

    const paymentMethodId = selectedCard.stripePaymentMethodId || selectedCard.id || selectedCard.paymentMethod

    if (!paymentMethodId) {
      alert("Selected card is missing payment method ID.")
      console.error("Invalid paymentMethodId:", paymentMethodId)
      return
    }

    setIsProcessing(true)

    try {
      const payload = {
        UserId: userId,
        OrderId: orderId,
        Amount: amount,
        Email: email,
        PaymentMethodId: paymentMethodId,
        StripeCustomerId: stripeCustomerId,
      }

      console.log("Sending payment request payload:", payload)

      const chargeResponse = await api.post("/Payments/charge", payload)

      console.log("Charge response:", chargeResponse.data)

      if (chargeResponse.status === 200) {
        const data = chargeResponse.data
        if (data.requiresAction) {
          // Use Stripe.js to confirm the payment intent on client side
          const stripe = await stripePromise
          const result = await stripe.confirmCardPayment(data.clientSecret)

          if (result.error) {
            setPaymentStatus(`Payment failed: ${result.error.message}`)
          } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
            setPaymentStatus("Payment successful! Thank you for your order.")
          } else {
            setPaymentStatus(`Payment status: ${result.paymentIntent.status}`)
          }
        } else {
          setPaymentStatus("Payment successful! Thank you for your order.")
        }
      } else {
        setPaymentStatus("Payment failed. Please try again.")
      }
    } catch (error) {
      if (error.response) {
        console.error("Payment error response data:", error.response.data)
      } else {
        console.error("Payment error:", error.message)
      }
      setPaymentStatus("Payment error occurred. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCloseCardSelector = () => setShowCardSelector(false)

  const maskCardNumber = (number) => {
    if (!number || number.length < 4) return number || ""
    return "**** **** **** " + number.slice(-4)
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 relative overflow-hidden flex items-center justify-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-green-500/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-400/5 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <div className="w-8 h-8 bg-white/30 rounded-full"></div>
          </div>
          <p className="text-white text-lg">Loading user information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-500/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-400/5 rounded-full blur-xl animate-bounce" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Main Payment Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30" />
              <div className="relative flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Secure Payment</h1>
                  <p className="text-green-100">Complete your order safely</p>
                </div>
                <div className="ml-auto">
                  <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Payment Status */}
              {paymentStatus && (
                <div
                  className={`p-4 rounded-xl border backdrop-blur-sm ${
                    paymentStatus.includes("successful")
                      ? "bg-green-500/10 border-green-400/30 text-green-300"
                      : "bg-red-500/10 border-red-400/30 text-red-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {paymentStatus.includes("successful") ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    )}
                    <p className="font-semibold">{paymentStatus}</p>
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Order Summary
                </h3>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Order ID:</span>
                    <span className="text-white font-mono">#{orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span className="text-white">{username}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">Total Amount:</span>
                      <span className="text-emerald-400">
                        {amount?.toLocaleString("de-DE", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Card Display */}
              {selectedCard && (
                <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-purple-400/30 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-400" />
                    Selected Payment Method
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {maskCardNumber(selectedCard.cardNumber || selectedCard.last4)}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {selectedCard.cardType || selectedCard.brand} • Expires {selectedCard.expiryMonth}/
                        {selectedCard.expiryYear}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* No Card Selected Message */}
              {!selectedCard && (
                <div className="bg-yellow-500/10 backdrop-blur-sm border border-yellow-400/30 rounded-xl p-4 text-center">
                  <AlertCircle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-yellow-300 font-medium">Please select a payment method to proceed</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  className="w-full group relative flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                  onClick={() => setShowCardSelector(true)}
                >
                  <CreditCard className="w-5 h-5" />
                  {selectedCard ? "Change Payment Method" : "Select Payment Method"}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </button>

                <button
                  className="w-full group relative flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 disabled:hover:scale-100 disabled:hover:shadow-none disabled:opacity-50"
                  onClick={handlePayment}
                  disabled={!selectedCard || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Pay{" "}
                      {amount?.toLocaleString("de-DE", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </>
                  )}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </button>
              </div>

              {/* Security Notice */}
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                <Lock className="w-4 h-4" />
                <span>Your payment is secured with 256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Selector Modal */}
      {showCardSelector && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          aria-modal="true"
          role="dialog"
          tabIndex={-1}
          onClick={handleCloseCardSelector}
        >
          <div
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CreditCardSelector
              userId={userId}
              showCardSelector={showCardSelector}
              onClose={handleCloseCardSelector}
              onSelectCard={handleSelectCard}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default StripePayment

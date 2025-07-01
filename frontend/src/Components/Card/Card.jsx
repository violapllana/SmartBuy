"use client"

import { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { CreditCard, Lock, CheckCircle, AlertCircle, Sparkles, Zap, Shield, Plus } from "lucide-react"

// Load Stripe outside component to avoid recreating on every render
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)

const AddCardForm = ({ userId }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [successMessage, setSuccessMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  console.log("Stripe key:", process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")

    if (!stripe || !elements) {
      setError("Stripe.js has not loaded yet.")
      return
    }

    setLoading(true)

    const cardElement = elements.getElement(CardElement)

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Get the card brand from paymentMethod.card.brand
    const brand = paymentMethod.card.brand // e.g. "mastercard"

    // Format brand with first letter uppercase, rest lowercase (if needed)
    const formattedCardType = brand.charAt(0).toUpperCase() + brand.slice(1)

    const payload = {
      cardType: formattedCardType, // note lowercase "cardType"
      stripePaymentMethodId: paymentMethod.id,
      userId,
    }

    try {
      const res = await fetch("http://localhost:5108/api/Card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      })

      if (res.ok) {
        setSuccessMessage("Card added successfully!")
        elements.getElement(CardElement).clear()
      } else {
        const errorText = await res.text()
        setError("Failed to add card: " + errorText)
      }
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Please try again.")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Input Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Card Information</h3>
            <p className="text-gray-400 text-sm">Enter your payment details securely</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:border-white/30 transition-all duration-300">
          <label className="block text-white/80 font-medium mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            Card Details
            <span className="text-red-400">*</span>
          </label>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-400/20 transition-all duration-300">
            <CardElement
              options={{
                hidePostalCode: true,
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#ffffff",
                    fontFamily: "system-ui, sans-serif",
                    "::placeholder": {
                      color: "#9CA3AF",
                    },
                    iconColor: "#10B981",
                  },
                  invalid: {
                    color: "#EF4444",
                    iconColor: "#EF4444",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500/10 backdrop-blur-sm border border-green-400/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-green-300 font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="group relative w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 disabled:hover:scale-100 disabled:hover:shadow-none disabled:opacity-50"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Plus className="w-5 h-5" />
            Add Payment Method
          </>
        )}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl" />
      </button>

      {/* Security Notice */}
      <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
        <Shield className="w-4 h-4 text-emerald-400" />
        <span>Your payment information is secured with 256-bit SSL encryption</span>
      </div>
    </form>
  )
}

const AddCard = () => {
  const [userId, setUserId] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const username = Cookies.get("username")
    if (username) {
      setIsLoggedIn(true)
      fetchUserIdFromUsername(username)
    } else {
      setIsLoggedIn(false)
      setLoading(false)
    }
  }, [])

  const fetchUserIdFromUsername = async (username) => {
    try {
      const response = await fetch(`http://localhost:5108/users/by-username?username=${username}`)
      if (!response.ok) throw new Error("User not found!")
      const data = await response.json()
      setUserId(data.id)
    } catch (error) {
      console.error("Error fetching userId:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <div className="w-8 h-8 bg-white/30 rounded-full"></div>
          </div>
          <p className="text-white text-xl font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 flex items-center justify-center">
        <div className="bg-red-500/10 backdrop-blur-md border border-red-400/30 rounded-2xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-red-300 text-lg">You must be logged in to add a payment method.</p>
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

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Main Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30" />
              <div className="relative flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Add Payment Method</h1>
                  <p className="text-green-100 text-lg">Securely add your credit card information</p>
                </div>
                <div className="ml-auto">
                  <Sparkles className="w-10 h-10 text-yellow-300 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Brand Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400">
                    SmartBuy
                  </h2>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Secure Payment Setup</h3>
                  <p className="text-gray-300">Add your payment information below to enable seamless transactions</p>
                </div>
              </div>

              {/* Stripe Elements Form */}
              <Elements stripe={stripePromise}>
                <AddCardForm userId={userId} />
              </Elements>

              {/* Features */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-white font-medium mb-1">Bank-Level Security</h4>
                  <p className="text-gray-400 text-sm">256-bit SSL encryption</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-white font-medium mb-1">Instant Processing</h4>
                  <p className="text-gray-400 text-sm">Real-time verification</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-white font-medium mb-1">Premium Experience</h4>
                  <p className="text-gray-400 text-sm">Seamless integration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddCard

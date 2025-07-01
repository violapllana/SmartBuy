"use client"

import { useEffect, useState } from "react"
import api from "../api"
import CreditCard from "./CreditCard"
import { CreditCardIcon, X, Sparkles, Zap } from "lucide-react"

const CardSelectorModal = ({ userId, showCardSelector, onClose, onSelectCard }) => {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUserCards = async () => {
      try {
        if (!userId) return
        setLoading(true)
        const response = await api.get(`/Card/user/${userId}`)
        setCards(response.data || [])
      } catch (error) {
        console.error("Error fetching cards:", error)
        setCards([])
      } finally {
        setLoading(false)
      }
    }

    if (showCardSelector) {
      fetchUserCards()
    } else {
      setCards([]) // clear cards when modal is hidden
    }
  }, [showCardSelector, userId])

  const maskCardNumber = (number, last4) => {
    if (last4) return `**** **** **** ${last4}`
    if (!number || typeof number !== "string") return ""

    const clean = number.replace(/\D/g, "")
    if (clean.length <= 4) return clean
    const lastFour = clean.slice(-4)
    const maskedSection = clean.slice(0, -4).replace(/\d/g, "*")
    const maskedWithSpaces = maskedSection.replace(/(.{4})/g, "$1 ").trim()
    return `${maskedWithSpaces} ${lastFour}`
  }

  if (!showCardSelector) return null

  return (
    <div className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-green-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-4xl mx-auto relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-emerald-400/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-400/5 rounded-full blur-lg animate-bounce" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30" />

      {/* Header */}
      <div className="relative bg-gradient-to-r from-emerald-600 to-green-600 p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <CreditCardIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                Select Payment Method
                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
              </h3>
              <p className="text-green-100">Choose your preferred card for this transaction</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="group relative p-2 text-white/70 hover:text-white transition-all duration-300 hover:scale-110"
          >
            <div className="absolute inset-0 bg-red-500/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
            <X className="w-6 h-6 relative z-10" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mb-4 animate-spin">
              <div className="w-8 h-8 bg-white/30 rounded-full"></div>
            </div>
            <p className="text-white text-lg">Loading your payment methods...</p>
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCardIcon className="w-10 h-10 text-yellow-400" />
            </div>
            <h4 className="text-xl font-semibold text-white mb-2">No Payment Methods Found</h4>
            <p className="text-gray-300 mb-6">You need to add a payment method before you can make a purchase.</p>
            <button
              onClick={onClose}
              className="group relative flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 mx-auto"
            >
              <Zap className="w-4 h-4" />
              Add Payment Method
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <p className="text-gray-300">Select the card you want to use for this transaction</p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {cards.map((card, index) => (
                <div
                  key={card.id}
                  className="group relative cursor-pointer transform transition-all duration-500 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
                  onClick={() => {
                    onSelectCard(card)
                    onClose()
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      onSelectCard(card)
                      onClose()
                    }
                  }}
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animation: "slideInUp 0.8s ease-out forwards",
                  }}
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400/20 via-green-400/20 to-yellow-400/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  {/* Card container */}
                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 group-hover:border-emerald-400/50 rounded-xl p-1 transition-all duration-300">
                    <CreditCard
                      card={{
                        ...card,
                        cardNumber: maskCardNumber(card.cardNumber),
                      }}
                    />

                    {/* Selection indicator */}
                    <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Cancel Button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="group relative flex items-center justify-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105"
          >
            <X className="w-4 h-4" />
            Cancel
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl" />
          </button>
        </div>
      </div>

      <style>{`
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`}</style>



    </div>
  )
}

export default CardSelectorModal

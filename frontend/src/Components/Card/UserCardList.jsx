"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import CreditCard from "./CreditCard"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, Edit3, Trash2, CreditCardIcon, X, Check, Loader2 } from "lucide-react"

const getCardLogo = (type) => {
  switch (type?.toLowerCase()) {
    case "visa":
      return "/logos/visa.png"
    case "mastercard":
      return "/logos/mastercard.png"
    case "amex":
    case "american express":
      return "/logos/amex.png"
    case "discover":
      return "/logos/discover.png"
    default:
      return "/logos/generic-card.png"
  }
}

// Mask card number except last 4 digits
const maskCardNumber = (number) => {
  if (!number || number.length < 4) return number
  return number.slice(0, -4).replace(/\d/g, "*") + number.slice(-4)
}

const cardTypes = ["Visa", "Mastercard", "Amex", "Discover"]

const UserCardList = () => {
  const [cards, setCards] = useState([])
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCard, setSelectedCard] = useState(null)
  const [editCard, setEditCard] = useState(null)
  const [originalCard, setOriginalCard] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showCVV, setShowCVV] = useState(false)
  const [role, setRole] = useState("")
  const [isDeleting, setIsDeleting] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUsername = Cookies.get("username")
    if (storedUsername) {
      fetchUserId(storedUsername)
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const storedRole = Cookies.get("role")
    if (storedRole) setRole(storedRole)
  }, [])

  useEffect(() => {
    if (!role) return
    if (role !== "Admin" && role !== "User") {
      navigate("/")
    }
  }, [role, navigate])

  const fetchUserId = async (username) => {
    try {
      const res = await fetch(`http://localhost:5108/users/by-username?username=${username}`)
      if (!res.ok) throw new Error("Failed to fetch user ID")
      const data = await res.json()
      setUserId(data.id)
      fetchCards(data.id)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const fetchCards = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5108/api/Card/user/${userId}`)
      if (!res.ok) throw new Error("Failed to fetch cards")
      const data = await res.json()
      setCards(data)
    } catch (err) {
      console.error(err)
      setCards([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (cardId) => {
    if (!window.confirm("Are you sure you want to delete this card?")) return

    setIsDeleting(cardId)
    try {
      const res = await fetch(`http://localhost:5108/api/Card/${cardId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete card")
      setCards(cards.filter((card) => card.id !== cardId))
    } catch (err) {
      alert("Error deleting card")
      console.error(err)
    } finally {
      setIsDeleting(null)
    }
  }

  const openEdit = (card) => {
    setEditCard({ ...card })
    setOriginalCard({ ...card })
    setIsEditing(true)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    if (name === "expMonth" || name === "expYear") {
      setEditCard((prev) => ({ ...prev, [name]: Number(value) }))
    } else {
      setEditCard((prev) => ({ ...prev, [name]: value }))
    }
  }

  const isChanged = () => {
    return JSON.stringify(editCard) !== JSON.stringify(originalCard)
  }

  const saveEdit = async () => {
    setIsSaving(true)
    try {
      const res = await fetch(`http://localhost:5108/api/Card/${editCard.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCard),
      })
      if (!res.ok) throw new Error("Failed to update card")
      setCards(cards.map((card) => (card.id === editCard.id ? editCard : card)))
      setIsEditing(false)
      setEditCard(null)
    } catch (err) {
      alert("Error updating card")
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  const viewDetails = (card) => {
    setSelectedCard(card)
    setShowCVV(false)
    setShowDetails(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <div className="w-8 h-8 bg-white/30 rounded-full"></div>
          </div>
          <p className="text-white text-xl font-medium">Loading your cards...</p>
        </div>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 flex items-center justify-center">
        <div className="bg-red-500/10 backdrop-blur-md border border-red-400/30 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-red-300 text-xl font-semibold">User not found or not logged in.</p>
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

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center">
              <CreditCardIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-yellow-400 mb-4">
            Your Credit Cards
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Manage your payment methods securely and efficiently
          </p>
        </div>

        {cards.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-600/20 to-gray-700/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <CreditCardIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">No Cards Found</h3>
            <p className="text-gray-400 text-lg">Add your first payment method to get started.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <div
                key={card.id}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all duration-500 hover:scale-105"
              >
                {/* Glow effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400/20 via-green-400/20 to-yellow-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

                <div className="relative z-10">
                  {/* Card Display */}
                  <div className="flex items-center justify-center mb-6">
                    <CreditCard card={{ ...card, cardNumber: maskCardNumber(card.last4) }} />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => viewDetails(card)}
                      className="group/btn flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                    >
                      <Eye className="w-4 h-4" />
                      Details
                      <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl" />
                    </button>

                    <button
                      onClick={() => openEdit(card)}
                      className="group/btn flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                      <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl" />
                    </button>

                    <button
                      onClick={() => handleDelete(card.id)}
                      disabled={isDeleting === card.id}
                      className="group/btn flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 disabled:hover:scale-100 disabled:hover:shadow-none disabled:opacity-50"
                    >
                      {isDeleting === card.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Delete
                      <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card Details Modal */}
      {showDetails && selectedCard && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <CreditCardIcon className="w-5 h-5 text-white" />
                </div>
                Card Details
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 text-white/70 hover:text-white transition-colors duration-300 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-gray-300">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-sm text-white/60 mb-1">Card Number</p>
                <p className="text-white font-mono text-lg">**** **** **** {selectedCard.last4}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-white/60 mb-1">Type</p>
                  <p className="text-white font-medium">{selectedCard.cardType || selectedCard.brand}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-sm text-white/60 mb-1">Expires</p>
                  <p className="text-white font-mono">
                    {selectedCard.expMonth}/{selectedCard.expYear}
                  </p>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-sm text-white/60 mb-1">Cardholder Name</p>
                <p className="text-white font-medium">{selectedCard.cardHolderName || "N/A"}</p>
              </div>

              <div className="bg-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-white/60">CVV</p>
                  <button
                    onClick={() => setShowCVV((prev) => !prev)}
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors duration-300"
                  >
                    {showCVV ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showCVV ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="text-white font-mono">{showCVV ? selectedCard.cvv || "N/A" : "***"}</p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowDetails(false)}
                className="group relative flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
              >
                <Check className="w-4 h-4" />
                Close
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Card Modal */}
      {isEditing && editCard && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                Edit Card
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 text-white/70 hover:text-white transition-colors duration-300 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!isChanged()) {
                  alert("No changes detected.")
                  return
                }
                saveEdit()
              }}
              className="space-y-6"
            >
              <div>
                <label htmlFor="cardHolderName" className="block text-white/80 font-medium mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  id="cardHolderName"
                  name="cardHolderName"
                  value={Cookies.getItem(`username`) || ""}
                  onChange={handleEditChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                  placeholder="Enter cardholder name"
                />
              </div>

              <div>
                <label htmlFor="cardType" className="block text-white/80 font-medium mb-2">
                  Card Type
                </label>
                <select
                  id="cardType"
                  name="cardType"
                  value={editCard.cardType || ""}
                  onChange={handleEditChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="" disabled className="bg-gray-800">
                    Select card type
                  </option>
                  {cardTypes.map((type) => (
                    <option key={type} value={type} className="bg-gray-800">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="last4" className="block text-white/80 font-medium mb-2">
                  Last 4 Digits
                </label>
                <input
                  type="text"
                  id="last4"
                  name="last4"
                  value={editCard.last4 || ""}
                  onChange={handleEditChange}
                  maxLength={4}
                  minLength={4}
                  pattern="\d{4}"
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                  placeholder="1234"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expMonth" className="block text-white/80 font-medium mb-2">
                    Exp Month
                  </label>
                  <input
                    type="number"
                    id="expMonth"
                    name="expMonth"
                    value={editCard.expMonth || ""}
                    onChange={handleEditChange}
                    min={1}
                    max={12}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                    placeholder="MM"
                  />
                </div>
                <div>
                  <label htmlFor="expYear" className="block text-white/80 font-medium mb-2">
                    Exp Year
                  </label>
                  <input
                    type="number"
                    id="expYear"
                    name="expYear"
                    value={editCard.expYear || ""}
                    onChange={handleEditChange}
                    min={new Date().getFullYear()}
                    max={2100}
                    required
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                    placeholder="YYYY"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cvv" className="block text-white/80 font-medium mb-2">
                  CVV
                </label>
                <input
                  type="password"
                  id="cvv"
                  name="cvv"
                  value={editCard.cvv || ""}
                  onChange={handleEditChange}
                  maxLength={4}
                  minLength={3}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                  placeholder="***"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setEditCard(null)
                  }}
                  className="group relative flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                >
                  <X className="w-4 h-4" />
                  Cancel
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl" />
                </button>

                <button
                  type="submit"
                  disabled={!isChanged() || isSaving}
                  className="group relative flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 disabled:hover:scale-100 disabled:hover:shadow-none disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {isSaving ? "Saving..." : "Save Changes"}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserCardList

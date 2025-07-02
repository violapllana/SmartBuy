"use client"

import { useEffect, useState } from "react"
import api from "../api"
import axios from "axios"
import {
  Package,
  Truck,
  Calendar,
  User,
  Edit3,
  Trash2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Clock,
  ShoppingCart,
  Navigation,
} from "lucide-react"

const ShipmentManager = () => {
  const [shipments, setShipments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [editingShipmentId, setEditingShipmentId] = useState(null)
  const [editFormData, setEditFormData] = useState(null)
  const [usernames, setUsernames] = useState({})
  const [isDeleting, setIsDeleting] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const fetchUsernames = async (shipments) => {
    const usernameMap = { ...usernames }
    for (const shipment of shipments) {
      const userId = shipment.userId
      if (!usernameMap[userId]) {
        try {
          const res = await axios.get(`http://localhost:5108/users/getusernamefromid/${userId}`)
          usernameMap[userId] = res.data
        } catch (err) {
          console.error(`Failed to get username for ${userId}`, err)
          usernameMap[userId] = "Unknown"
        }
      }
    }
    setUsernames(usernameMap)
  }

  const fetchShipments = async () => {
    setLoading(true)
    try {
      const response = await api.get("/Shipment")
      setShipments(response.data)
      await fetchUsernames(response.data)
      setError(null)
    } catch (err) {
      setError("Failed to fetch shipments.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShipments()
  }, [])

  const updateShipment = async (id, updateData) => {
    setIsSaving(true)
    try {
      await api.put(`/Shipment/${id}`, updateData)
      showNotification(`Shipment #${id} updated successfully`, "success")
      fetchShipments()
      setEditingShipmentId(null)
      setEditFormData(null)
    } catch (err) {
      console.error(err)
      showNotification("Failed to update shipment", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const deleteShipment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this shipment?")) return

    setIsDeleting(id)
    try {
      await api.delete(`/Shipment/${id}`)
      showNotification(`Shipment #${id} deleted successfully`, "success")
      setShipments((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      console.error(err)
      showNotification("Failed to delete shipment", "error")
    } finally {
      setIsDeleting(null)
    }
  }

  const showNotification = (message, type = "success") => {
    const notification = document.createElement("div")
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-xl shadow-lg z-50 backdrop-blur-md border ${
      type === "success"
        ? "bg-green-500/10 border-green-400/30 text-green-300"
        : "bg-red-500/10 border-red-400/30 text-red-300"
    }`
    notification.textContent = message
    document.body.appendChild(notification)
    setTimeout(() => document.body.removeChild(notification), 3000)
  }

  const getShipmentStatus = (shipmentDate) => {
    const now = new Date()
    const shipDate = new Date(shipmentDate)
    const diffDays = Math.ceil((shipDate - now) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { status: "Shipped", color: "text-green-400", bgColor: "bg-green-500/10", icon: CheckCircle }
    } else if (diffDays === 0) {
      return { status: "Shipping Today", color: "text-yellow-400", bgColor: "bg-yellow-500/10", icon: Clock }
    } else {
      return { status: "Pending", color: "text-blue-400", bgColor: "bg-blue-500/10", icon: Package }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <div className="w-8 h-8 bg-white/30 rounded-full"></div>
          </div>
          <p className="text-white text-xl font-medium">Loading shipments...</p>
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
              <Truck className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-yellow-400 mb-4">
            Shipment Management
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Track and manage all your shipments in one centralized dashboard
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && shipments.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-600/20 to-gray-700/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">No Shipments Found</h3>
            <p className="text-gray-400 text-lg">Your shipments will appear here once orders are processed.</p>
          </div>
        )}

        {/* Shipments Grid */}
        {shipments.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {shipments.map((shipment) => {
              const statusInfo = getShipmentStatus(shipment.shipmentDate)
              const StatusIcon = statusInfo.icon

              return (
                <div
                  key={shipment.id}
                  className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all duration-500 hover:scale-105"
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400/20 via-green-400/20 to-yellow-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  <div className="relative z-10">
                    {editingShipmentId === shipment.id ? (
                      /* Edit Form */
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault()
                          await updateShipment(editingShipmentId, editFormData)
                        }}
                        className="space-y-6"
                      >
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Edit3 className="w-5 h-5 text-yellow-400" />
                            Edit Shipment
                          </h3>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-white/80 font-medium mb-2">
                              <Calendar className="w-4 h-4 inline mr-2" />
                              Shipment Date
                            </label>
                            <input
                              type="datetime-local"
                              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                              value={
                                editFormData.shipmentDate
                                  ? new Date(editFormData.shipmentDate).toISOString().slice(0, 16)
                                  : ""
                              }
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  shipmentDate: new Date(e.target.value).toISOString(),
                                })
                              }
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-white/80 font-medium mb-2">
                              <Navigation className="w-4 h-4 inline mr-2" />
                              Tracking Number
                            </label>
                            <input
                              type="text"
                              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                              value={editFormData.trackingNumber || ""}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  trackingNumber: e.target.value,
                                })
                              }
                              placeholder="Enter tracking number"
                            />
                          </div>

                          <div>
                            <label className="block text-white/80 font-medium mb-2">
                              <ShoppingCart className="w-4 h-4 inline mr-2" />
                              Order ID
                            </label>
                            <input
                              type="number"
                              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                              value={editFormData.orderId || ""}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  orderId: Number(e.target.value),
                                })
                              }
                              required
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button
                            type="submit"
                            disabled={isSaving}
                            className="group relative flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 disabled:hover:scale-100 disabled:hover:shadow-none disabled:opacity-50"
                          >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isSaving ? "Saving..." : "Save Changes"}
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingShipmentId(null)
                              setEditFormData(null)
                            }}
                            className="group relative flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl" />
                          </button>
                        </div>
                      </form>
                    ) : (
                      /* Display Mode */
                      <>
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                              <Package className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-white">Shipment #{shipment.id}</h3>
                              <div className={`flex items-center gap-1 ${statusInfo.color}`}>
                                <StatusIcon className="w-4 h-4" />
                                <span className="text-sm font-medium">{statusInfo.status}</span>
                              </div>
                            </div>
                          </div>
                          <div
                            className={`px-3 py-1 rounded-full ${statusInfo.bgColor} ${statusInfo.color} text-xs font-bold`}
                          >
                            {statusInfo.status}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-4 mb-6">
                          <div className="bg-white/5 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <ShoppingCart className="w-4 h-4 text-blue-400" />
                              <span className="text-sm text-white/60">Order Details</span>
                            </div>
                            <p className="text-white font-mono text-lg">Order #{shipment.orderId}</p>
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            <div className="bg-white/5 rounded-xl p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm text-white/60">Customer</span>
                              </div>
                              <p className="text-white font-medium">{usernames[shipment.userId] || "Loading..."}</p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 text-purple-400" />
                                <span className="text-sm text-white/60">Ship Date</span>
                              </div>
                              <p className="text-white font-medium">
                                {new Date(shipment.shipmentDate).toLocaleDateString()}
                              </p>
                              <p className="text-white/60 text-sm">
                                {new Date(shipment.shipmentDate).toLocaleTimeString()}
                              </p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Navigation className="w-4 h-4 text-yellow-400" />
                                <span className="text-sm text-white/60">Tracking</span>
                              </div>
                              <p className="text-white font-mono">{shipment.trackingNumber || "Not assigned"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setEditingShipmentId(shipment.id)
                              setEditFormData({ ...shipment })
                            }}
                            className="group/btn flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit
                            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl" />
                          </button>

                          <button
                            onClick={() => deleteShipment(shipment.id)}
                            disabled={isDeleting === shipment.id}
                            className="group/btn flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 disabled:hover:scale-100 disabled:hover:shadow-none disabled:opacity-50"
                          >
                            {isDeleting === shipment.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                            Delete
                            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ShipmentManager

"use client"

import { useEffect, useState } from "react"
import api from "../api"
import {
  Package,
  Truck,
  Calendar,
  Navigation,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  RefreshCw,
  Sparkles,
  Zap,
  X,
} from "lucide-react"

const MyShipments = ({ username }) => {
  const [userId, setUserId] = useState(null)
  const [shipments, setShipments] = useState([])
  const [loadingUserId, setLoadingUserId] = useState(true)
  const [loadingShipments, setLoadingShipments] = useState(false)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  // Fetch userId by username
  useEffect(() => {
    const fetchUserId = async () => {
      if (!username) return

      setLoadingUserId(true)
      try {
        const res = await api.get(`http://localhost:5108/users/by-username?username=${username}`)
        setUserId(res.data.id)
        localStorage.setItem("selectedUserId", res.data.id)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch user ID", err)
        setError("Failed to fetch user info")
      } finally {
        setLoadingUserId(false)
      }
    }

    fetchUserId()
  }, [username])

  // Fetch shipments by userId
  useEffect(() => {
    if (!userId) return

    const fetchShipments = async () => {
      setLoadingShipments(true)
      try {
        const res = await api.get(`/Shipment/user/${userId}`)
        setShipments(res.data)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch shipments", err)
        setError("Failed to load your shipments")
      } finally {
        setLoadingShipments(false)
      }
    }

    fetchShipments()
  }, [userId])

  const refreshShipments = async () => {
    if (!userId) return

    setRefreshing(true)
    try {
      const res = await api.get(`/Shipment/user/${userId}`)
      setShipments(res.data)
      setError(null)
      showNotification("Shipments refreshed successfully", "success")
    } catch (err) {
      console.error("Failed to refresh shipments", err)
      showNotification("Failed to refresh shipments", "error")
    } finally {
      setRefreshing(false)
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

  const getShipmentStatus = (shipment) => {
    const now = new Date()
    const shipDate = new Date(shipment.shipmentDate)
    const diffDays = Math.ceil((shipDate - now) / (1000 * 60 * 60 * 24))

    if (shipment.status) {
      switch (shipment.status.toLowerCase()) {
        case "delivered":
          return {
            status: "Delivered",
            color: "text-green-400",
            bgColor: "bg-green-500/10",
            borderColor: "border-green-400/30",
            icon: CheckCircle,
            description: "Package has been delivered",
          }
        case "in transit":
          return {
            status: "In Transit",
            color: "text-blue-400",
            bgColor: "bg-blue-500/10",
            borderColor: "border-blue-400/30",
            icon: Truck,
            description: "Package is on the way",
          }
        case "shipped":
          return {
            status: "Shipped",
            color: "text-emerald-400",
            bgColor: "bg-emerald-500/10",
            borderColor: "border-emerald-400/30",
            icon: Package,
            description: "Package has been shipped",
          }
        default:
          return {
            status: "Processing",
            color: "text-yellow-400",
            bgColor: "bg-yellow-500/10",
            borderColor: "border-yellow-400/30",
            icon: Clock,
            description: "Order is being processed",
          }
      }
    }

    // Fallback to date-based status
    if (diffDays < 0) {
      return {
        status: "Shipped",
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-400/30",
        icon: Package,
        description: "Package has been shipped",
      }
    } else if (diffDays === 0) {
      return {
        status: "Shipping Today",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-400/30",
        icon: Clock,
        description: "Package ships today",
      }
    } else {
      return {
        status: "Processing",
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-400/30",
        icon: Clock,
        description: "Order is being processed",
      }
    }
  }

  const viewShipmentDetails = (shipment) => {
    setSelectedShipment(shipment)
    setShowDetails(true)
  }

  if (loadingUserId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <div className="w-10 h-10 bg-white/30 rounded-full animate-spin"></div>
            </div>
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full blur-xl opacity-50 animate-ping"></div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Your Profile</h2>
          <p className="text-gray-300 text-lg">Fetching your account information...</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
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
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center relative">
              <Package className="w-8 h-8 text-white" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-400 to-yellow-400 mb-4">
            My Shipments
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Track your orders and monitor delivery status in real-time
          </p>

          {/* Refresh Button */}
          <button
            onClick={refreshShipments}
            disabled={refreshing || loadingShipments}
            className="group relative flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 disabled:hover:scale-100 disabled:hover:shadow-none disabled:opacity-50 mx-auto"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh Shipments"}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl" />
          </button>
        </div>

        {/* Loading Shipments */}
        {loadingShipments && (
          <div className="text-center py-20">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                <Truck className="w-12 h-12 text-white animate-bounce" />
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full blur-xl opacity-50 animate-ping"></div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Loading Your Shipments</h2>
            <p className="text-gray-300 text-lg mb-6">Fetching the latest tracking information...</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce"></div>
              <div
                className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-red-300 font-semibold text-lg">Error Loading Shipments</h3>
                <p className="text-red-300/80">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loadingShipments && shipments.length === 0 && !error && (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-600/20 to-gray-700/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
              <Package className="w-16 h-16 text-gray-400" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">No Shipments Yet</h3>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              Your shipments will appear here once you place an order. Start shopping to see your delivery tracking!
            </p>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 max-w-md mx-auto">
              <h4 className="text-white font-semibold mb-2">What happens next?</h4>
              <ul className="text-gray-300 text-sm space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  Place an order from our store
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  Receive tracking information
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  Monitor delivery status here
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Shipments Grid */}
        {shipments.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {shipments.map((shipment, index) => {
              const statusInfo = getShipmentStatus(shipment)
              const StatusIcon = statusInfo.icon

              return (
                <div
                  key={shipment.id}
                  className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all duration-500 hover:scale-105"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    animation: "slideInUp 0.8s ease-out forwards",
                  }}
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400/20 via-green-400/20 to-yellow-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">Shipment #{shipment.id}</h3>
                          <p className="text-gray-400 text-sm">Order #{shipment.orderId}</p>
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full ${statusInfo.bgColor} ${statusInfo.color} text-xs font-bold border ${statusInfo.borderColor}`}
                      >
                        {statusInfo.status}
                      </div>
                    </div>

                    {/* Status Card */}
                    <div
                      className={`${statusInfo.bgColor} border ${statusInfo.borderColor} rounded-xl p-4 mb-6 relative overflow-hidden`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${statusInfo.bgColor} rounded-lg flex items-center justify-center`}>
                          <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                        </div>
                        <div>
                          <h4 className={`font-semibold ${statusInfo.color}`}>{statusInfo.status}</h4>
                          <p className="text-gray-400 text-sm">{statusInfo.description}</p>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 w-2 h-2 bg-current rounded-full animate-pulse opacity-60"></div>
                    </div>

                    {/* Details */}
                    <div className="space-y-4 mb-6">
                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-purple-400" />
                          <span className="text-sm text-white/60">Ship Date</span>
                        </div>
                        <p className="text-white font-medium">{new Date(shipment.shipmentDate).toLocaleDateString()}</p>
                        <p className="text-white/60 text-sm">{new Date(shipment.shipmentDate).toLocaleTimeString()}</p>
                      </div>

                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Navigation className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-white/60">Tracking Number</span>
                        </div>
                        <p className="text-white font-mono text-sm">{shipment.trackingNumber || "Not assigned yet"}</p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => viewShipmentDetails(shipment)}
                      className="group/btn w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                      <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Shipment Details Modal */}
      {showDetails && selectedShipment && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                Shipment Details
              </h3>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 text-white/70 hover:text-white transition-colors duration-300 hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Status Section */}
              {(() => {
                const statusInfo = getShipmentStatus(selectedShipment)
                const StatusIcon = statusInfo.icon
                return (
                  <div
                    className={`${statusInfo.bgColor} border ${statusInfo.borderColor} rounded-xl p-6 relative overflow-hidden`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 ${statusInfo.bgColor} rounded-xl flex items-center justify-center`}>
                        <StatusIcon className={`w-8 h-8 ${statusInfo.color}`} />
                      </div>
                      <div>
                        <h4 className={`text-xl font-bold ${statusInfo.color}`}>{statusInfo.status}</h4>
                        <p className="text-gray-400">{statusInfo.description}</p>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 w-3 h-3 bg-current rounded-full animate-pulse opacity-60"></div>
                  </div>
                )
              })()}

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-5 h-5 text-emerald-400" />
                    <span className="text-white font-medium">Shipment Info</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Shipment ID:</span>
                      <span className="text-white font-mono">#{selectedShipment.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Order ID:</span>
                      <span className="text-white font-mono">#{selectedShipment.orderId}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-medium">Timing</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ship Date:</span>
                      <span className="text-white">{new Date(selectedShipment.shipmentDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ship Time:</span>
                      <span className="text-white">{new Date(selectedShipment.shipmentDate).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-4 md:col-span-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Navigation className="w-5 h-5 text-yellow-400" />
                    <span className="text-white font-medium">Tracking Information</span>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <span className="text-gray-400 text-sm">Tracking Number:</span>
                    <p className="text-white font-mono text-lg">
                      {selectedShipment.trackingNumber || "Tracking number will be assigned soon"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setShowDetails(false)}
                  className="group relative flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
                >
                  <CheckCircle className="w-4 h-4" />
                  Close
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
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

export default MyShipments

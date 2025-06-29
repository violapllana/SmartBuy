"use client"

import { useEffect, useState } from "react"
import axios from "axios"

const OrderForAdmins = () => {
  const [orders, setOrders] = useState([])
  const [usernames, setUsernames] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch orders and usernames
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: ordersData } = await axios.get("http://localhost:5108/api/Order")
        setOrders(ordersData)

        const uniqueUserIds = [...new Set(ordersData.map((order) => order.userId))]

        const usernamePromises = uniqueUserIds.map(async (userId) => {
          try {
            const res = await axios.get(`http://localhost:5108/users/getusernamefromid/${userId}`)
            return { userId, username: res.data }
          } catch {
            return { userId, username: "Unknown User" }
          }
        })

        const results = await Promise.all(usernamePromises)
        const userMap = {}
        results.forEach(({ userId, username }) => {
          userMap[userId] = username
        })

        setUsernames(userMap)
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError("Failed to load orders.")
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Function to update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5108/api/Order/UpdateStatus/${orderId}`, { status: newStatus })

      // Show success notification (you can replace with toast)
      const notification = document.createElement("div")
      notification.className =
        "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse"
      notification.textContent = `Order #${orderId} status updated to ${newStatus}`
      document.body.appendChild(notification)
      setTimeout(() => document.body.removeChild(notification), 3000)

      // Refresh orders after update
      const { data: updatedOrders } = await axios.get("http://localhost:5108/api/Order")
      setOrders(updatedOrders)
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error.message)

      // Show error notification
      const notification = document.createElement("div")
      notification.className = "fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
      notification.textContent = "Failed to update status: " + (error.response?.data || error.message)
      document.body.appendChild(notification)
      setTimeout(() => document.body.removeChild(notification), 3000)
    }
  }

  // Filter orders based on status and search term
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = !filterStatus || order.status.toLowerCase() === filterStatus.toLowerCase()
    const matchesSearch =
      !searchTerm ||
      order.id.toString().includes(searchTerm) ||
      (usernames[order.userId] || "").toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Get status color classes
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "shipped":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "delivered":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "cancelled":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-300 text-lg font-semibold">Loading orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 flex items-center justify-center">
        <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-red-300 text-lg font-semibold">{error}</p>
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
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />

      <div className="relative z-10 p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-green-300 to-yellow-400 bg-clip-text text-transparent mb-4">
            Admin Orders Dashboard
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-emerald-400 to-yellow-400 mx-auto rounded-full" />
        </div>

        {/* Filters and Search */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8 shadow-2xl">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 min-w-64">
              <label className="block text-sm font-semibold text-emerald-300 mb-2">Search Orders</label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search by Order ID or Username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="group">
              <label className="block text-sm font-semibold text-emerald-300 mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 hover:bg-white/30 group-hover:scale-105"
              >
                <option value="" className="bg-gray-800 text-white">
                  All Status
                </option>
                <option value="pending" className="bg-gray-800 text-white">
                  Pending
                </option>
                <option value="paid" className="bg-gray-800 text-white">
                  Paid
                </option>
                <option value="shipped" className="bg-gray-800 text-white">
                  Shipped
                </option>
                <option value="delivered" className="bg-gray-800 text-white">
                  Delivered
                </option>
                <option value="cancelled" className="bg-gray-800 text-white">
                  Cancelled
                </option>
              </select>
            </div>

            {/* Orders Count */}
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">{filteredOrders.length}</div>
                <div className="text-sm opacity-90">Orders</div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Orders Found</h3>
              <p className="text-gray-300">Try adjusting your filters to see more orders.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:scale-[1.02] hover:bg-white/15"
              >
                {/* Order Header */}
                <div className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 border-b border-white/10 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold text-white">Order #{order.id}</h2>
                      <div className="flex items-center gap-4 text-emerald-300">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span className="font-medium">User:</span>
                          <span className="text-white">{usernames[order.userId] || order.userId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 13a2 2 0 002 2h6a2 2 0 002-2L16 7"
                            />
                          </svg>
                          <span className="font-medium">Date:</span>
                          <span className="text-white">{new Date(order.orderDate).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`px-4 py-2 rounded-full border backdrop-blur-sm font-semibold ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </div>
                  </div>
                </div>

                {/* Products Table */}
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-white/10 border-b border-white/10">
                            <th className="px-6 py-4 text-left text-emerald-300 font-semibold">Product</th>
                            <th className="px-6 py-4 text-center text-emerald-300 font-semibold">Image</th>
                            <th className="px-6 py-4 text-right text-emerald-300 font-semibold">Quantity</th>
                            <th className="px-6 py-4 text-right text-emerald-300 font-semibold">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.products.map((product, index) => (
                            <tr
                              key={product.productId}
                              className={`border-b border-white/5 hover:bg-white/5 transition-colors ${index % 2 === 0 ? "bg-white/2" : ""}`}
                            >
                              <td className="px-6 py-4 text-white font-medium">{product.productName}</td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex justify-center">
                                  <img
                                    src={`http://localhost:5108${product.productImage.replace(/\\/g, "/")}`}
                                    alt={product.productName}
                                    className="h-12 w-12 object-cover rounded-lg border border-white/20 shadow-lg"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right text-gray-300">{product.quantity}</td>
                              <td className="px-6 py-4 text-right text-white font-semibold">
                                ${product.price.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Total Price */}
                  <div className="mt-6 text-right">
                    <div className="inline-block bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl shadow-lg">
                      <span className="text-lg font-bold">Total: ${order.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Status Update Buttons */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h3 className="text-emerald-300 font-semibold mb-4">Update Order Status:</h3>
                    <div className="flex flex-wrap gap-3">
                      {[
                        {
                          status: "Pending",
                          color: "from-yellow-500 to-amber-500",
                          hoverColor: "hover:from-yellow-600 hover:to-amber-600",
                        },
                        {
                          status: "Paid",
                          color: "from-green-500 to-emerald-500",
                          hoverColor: "hover:from-green-600 hover:to-emerald-600",
                        },
                        {
                          status: "Shipped",
                          color: "from-blue-500 to-cyan-500",
                          hoverColor: "hover:from-blue-600 hover:to-cyan-600",
                        },
                        {
                          status: "Delivered",
                          color: "from-purple-500 to-violet-500",
                          hoverColor: "hover:from-purple-600 hover:to-violet-600",
                        },
                        {
                          status: "Cancelled",
                          color: "from-red-500 to-rose-500",
                          hoverColor: "hover:from-red-600 hover:to-rose-600",
                        },
                      ].map(({ status, color, hoverColor }) => (
                        <button
                          key={status}
                          onClick={() => updateOrderStatus(order.id, status)}
                          disabled={order.status === status}
                          className={`bg-gradient-to-r ${color} ${hoverColor} disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none disabled:opacity-50`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx="true">{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-pulse {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-bounce {
          animation: bounce 4s infinite;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default OrderForAdmins

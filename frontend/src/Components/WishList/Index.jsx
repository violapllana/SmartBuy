"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import api from "../api"

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([])
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState({})

  useEffect(() => {
    const storedUsername = Cookies.get("username")
    if (storedUsername) {
      fetchUserId(storedUsername)
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUserId = async (username) => {
    try {
      const res = await fetch(`http://localhost:5108/users/by-username?username=${username}`)
      if (!res.ok) throw new Error("Failed to fetch user ID")
      const data = await res.json()
      setUserId(data.id)
      fetchWishlist(data.id)
    } catch (err) {
      console.error("Error fetching user ID:", err)
      setLoading(false)
    }
  }

  const fetchWishlist = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5108/api/Wishlist/user/${userId}`)
      if (!res.ok) throw new Error("Failed to fetch wishlist")
      const data = await res.json()
      setWishlist(data)
    } catch (err) {
      console.error("Error fetching wishlist:", err)
      setWishlist([])
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type = "success") => {
    const notification = document.createElement("div")
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse ${
      type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"
    } text-white`
    notification.textContent = message
    document.body.appendChild(notification)
    setTimeout(() => document.body.removeChild(notification), 3000)
  }

  const handleAddToCart = async (productId, quantity) => {
    if (!userId) {
      console.error("User ID not available.")
      return
    }

    setAddingToCart((prev) => ({ ...prev, [productId]: true }))

    try {
      // Step 1: Check if the user has a pending order
      const { data: hasPendingOrder } = await api.get(`/Order/HasPendingOrder/${userId}`)

      if (hasPendingOrder) {
        // Step 2a: Get all orders and find the one with "Pending" status
        const { data: orders } = await api.get(`/Order/GetOrdersByUser/${userId}`)
        const pendingOrder = orders.find((o) => o.status === "Pending")

        if (pendingOrder) {
          // Step 3: Add product to existing pending order
          await api.post(`/Order/AddProductToOrder`, {
            orderId: pendingOrder.id,
            productId,
            quantity,
          })
          showNotification("Product added to existing cart!", "success")
          return
        }

        // If hasPendingOrder is true but no pending order is found (edge case), log it
        console.warn("HasPendingOrder returned true, but no pending order found.")
      }

      // Step 2b: No pending order (or not found), create a new order
      await api.post(`/Order`, {
        userId,
        products: [{ productId, quantity }],
      })
      showNotification("Product added to new cart!", "success")
    } catch (err) {
      console.error("Failed to add product to cart", err)
      showNotification("Failed to add product to cart", "error")
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }))
    }
  }

  const deleteFromWishlist = async (productId) => {
    if (!userId) return

    const confirmed = window.confirm("Are you sure you want to remove this product from wishlist?")
    if (!confirmed) return

    try {
      const res = await fetch(`http://localhost:5108/api/Wishlist/${userId}/${productId}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete item")

      setWishlist((prev) => prev.filter((item) => item.product.id !== productId))
      showNotification("Product removed from wishlist", "success")
    } catch (err) {
      console.error("Error deleting wishlist item:", err)
      showNotification("Failed to remove product", "error")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-green-500/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-400/5 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-emerald-300 text-lg font-semibold">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-red-500/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-red-400/5 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-2xl p-12 text-center max-w-md mx-4">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-red-300 mb-2">Access Denied</h3>
          <p className="text-red-200">User not found or not logged in.</p>
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
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-pink-400/10 rounded-full blur-lg animate-float" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />

      {/* Floating Hearts */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-3 h-3 bg-pink-400 rounded-full opacity-60 animate-float" />
        <div className="absolute top-1/4 right-10 w-4 h-4 bg-red-400 rounded-full opacity-40 animate-float-delayed" />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-pink-300 rounded-full opacity-50 animate-float" />
        <div className="absolute bottom-10 right-1/4 w-5 h-5 bg-red-300 rounded-full opacity-30 animate-float-delayed" />
      </div>

      <div className="relative z-10 p-4 md:p-8 pt-24">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 via-red-400 to-rose-400 bg-clip-text text-transparent mb-4">
            Your Wishlist
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-pink-400 to-red-400 mx-auto rounded-full" />
          <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
            Your favorite products saved for later. Add them to cart when you're ready to purchase!
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 max-w-lg mx-auto">
              <div className="animate-float mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">Your Wishlist is Empty</h3>
                <p className="text-gray-300 mb-8 leading-relaxed">
                  Start adding products you love to your wishlist. Browse our amazing collection and save your
                  favorites!
                </p>

                <button
                  onClick={() => (window.location.href = "/productlist")}
                  className="group relative bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25 flex items-center justify-center gap-3 mx-auto"
                >
                  <svg
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  Browse Products
                  <svg
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Wishlist Stats */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Wishlist Items</h3>
                    <p className="text-gray-300 text-sm">Products you've saved for later</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-xl shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{wishlist.length}</div>
                    <div className="text-sm opacity-90">Items</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {wishlist.map((item, index) => (
                <div
                  key={item.id}
                  className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 hover:scale-[1.02] hover:bg-white/15"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Product Image */}
                    <div className="relative overflow-hidden sm:w-48 h-48 sm:h-auto">
                      {item.product.imageFile ? (
                        <img
                          src={`http://localhost:5108${item.product.imageFile}`}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                          <svg
                            className="w-16 h-16 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Wishlist Badge */}
                      <div className="absolute top-3 right-3 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        Loved
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-300 transition-colors duration-300 line-clamp-1">
                          {item.product.name}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 mb-3">
                          {item.product.description}
                        </p>
                      </div>

                      {/* Product Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Category:</span>
                          <span className="text-emerald-300 text-sm font-medium">{item.product.category}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Price:</span>
                          <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                            €{item.product.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm">Added:</span>
                          <span className="text-gray-300 text-sm">{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* SmartBuy Badge */}
                      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-emerald-300 text-sm font-semibold">SmartBuy</div>
                            <div className="text-gray-400 text-xs">Kosovo's #1 Online Store</div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAddToCart(item.product.id, 1)}
                          disabled={addingToCart[item.product.id]}
                          className="group/btn flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2"
                        >
                          {addingToCart[item.product.id] ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4 group-hover/btn:scale-110 transition-transform"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                              </svg>
                              Add to Cart
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => deleteFromWishlist(item.product.id)}
                          className="group/heart bg-white/20 backdrop-blur-sm border border-white/30 hover:border-red-400/50 hover:bg-red-500/20 rounded-xl px-4 py-3 transition-all duration-300 hover:scale-110"
                        >
                          <svg
                            className="w-5 h-5 text-red-400 group-hover/heart:scale-125 transition-all duration-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-12 text-center">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Shop?</h3>
                <p className="text-gray-300 mb-6">Browse more products or check out your cart</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => (window.location.href = "/productlist")}
                    className="group bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-3"
                  >
                    <svg
                      className="w-5 h-5 group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    Browse More Products
                  </button>
                  <button
                    onClick={() => (window.location.href = "/order")}
                    className="group bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 flex items-center justify-center gap-3"
                  >
                    <svg
                      className="w-5 h-5 group-hover:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    View Cart
                  </button>
                </div>
              </div>
            </div>
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
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
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
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default Wishlist

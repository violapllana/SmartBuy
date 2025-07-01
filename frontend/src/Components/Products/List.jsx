"use client"

import { useEffect, useState } from "react"
import api from "../api"

const categoryOptions = [
  "Smartphones dhe Aksesore",
  "Laptopë dhe Tabletë",
  "Paisje Smart Home",
  "Kompjuterë dhe Pajisje Hardware",
  "Gadgete dhe Pajisje Wearables",
  "Lojëra dhe Pajisje Gaming",
  "Softuer dhe Licenca",
]

const nameOptions = [
  "Laptop",
  "Tabletë",
  "iPhone",
  "Samsung",
  "Smartwatch",
  "Kufje Wireless",
  "Smart Home Speaker",
  "Gaming Mouse",
  "Gaming Keyboard",
  "Desktop PC",
  "Monitor",
  "VR Headset",
  "Router",
  "Power Bank",
  "Smart TV",
]

const ProductList = ({ username }) => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [sortOption, setSortOption] = useState("newest")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [nameFilter, setNameFilter] = useState("")
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const fetchUserId = async () => {
      if (!username) return
      try {
        const response = await api.get(`http://localhost:5108/users/by-username?username=${username}`)
        if (response.data && response.data.id) {
          setUserId(response.data.id)
        }
      } catch (err) {
        console.error("Failed to fetch userId:", err)
      }
    }
    fetchUserId()
  }, [username])

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [products, sortOption, categoryFilter, nameFilter])

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5108/api/Product")
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error("Failed to fetch products:", err)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Filter by category if selected
    if (categoryFilter) {
      filtered = filtered.filter((product) => product.category === categoryFilter)
    }

    // Filter by name if selected
    if (nameFilter) {
      filtered = filtered.filter((product) => product.name.toLowerCase().includes(nameFilter.toLowerCase()))
    }

    // Sorting
    switch (sortOption) {
      case "az":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "za":
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        break
      case "lowPrice":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "highPrice":
        filtered.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }

    setFilteredProducts(filtered)
  }

  const handleSortChange = (e) => {
    setSortOption(e.target.value)
  }

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value)
  }

  const handleNameChange = (e) => {
    setNameFilter(e.target.value)
  }

  const handleAddToCart = async (productId, quantity) => {
    if (!userId) {
      console.error("User ID not available.")
      return
    }

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
          alert("Product added to existing cart!")
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
      alert("Product added to new cart!")
    } catch (err) {
      console.error("Failed to add product to cart", err)
    }
  }

  const addToWishlist = async (product) => {
    if (!userId) {
      console.error("User ID not available.")
      return
    }

    try {
      await api.post(`/Wishlist`, {
        userId,
        productId: product.id,
      })
      alert("Product added to wishlist!")
    } catch (err) {
      if (err.response && err.response.status === 400) {
        // Backend responded with "Product X is already in wishlist"
        alert("Product is already in wishlist.")
      } else {
        console.error("Failed to add product to wishlist", err)
        alert("An error occurred while adding the product to wishlist.")
      }
    }
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
            Our Products
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-yellow-400 mx-auto rounded-full" />
        </div>

        {/* Top Controls */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8 shadow-2xl">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Sort Dropdown */}
            <div className="group">
              <label className="block text-sm font-semibold text-emerald-300 mb-2">Sort By</label>
              <select
                value={sortOption}
                onChange={handleSortChange}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 hover:bg-white/30 group-hover:scale-105"
              >
                <option value="az" className="bg-gray-800 text-white">
                  A to Z
                </option>
                <option value="za" className="bg-gray-800 text-white">
                  Z to A
                </option>
                <option value="newest" className="bg-gray-800 text-white">
                  Newest
                </option>
                <option value="oldest" className="bg-gray-800 text-white">
                  Oldest
                </option>
                <option value="lowPrice" className="bg-gray-800 text-white">
                  Lowest Price
                </option>
                <option value="highPrice" className="bg-gray-800 text-white">
                  Highest Price
                </option>
              </select>
            </div>

            {/* Category Filter Dropdown */}
            <div className="group">
              <label className="block text-sm font-semibold text-emerald-300 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={handleCategoryChange}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 hover:bg-white/30 group-hover:scale-105"
              >
                <option value="" className="bg-gray-800 text-white">
                  All Categories
                </option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat} className="bg-gray-800 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Name Filter Dropdown */}
            <div className="group">
              <label className="block text-sm font-semibold text-emerald-300 mb-2">Filter by Name</label>
              <select
                value={nameFilter}
                onChange={handleNameChange}
                className="bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 hover:bg-white/30 group-hover:scale-105"
              >
                <option value="" className="bg-gray-800 text-white">
                  All Names
                </option>
                {nameOptions.map((name) => (
                  <option key={name} value={name} className="bg-gray-800 text-white">
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Product count */}
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold">{filteredProducts.length}</div>
                <div className="text-sm opacity-90">Products</div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:scale-105 hover:bg-white/20"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                {product.imageFile && (
                  <img
                    src={`http://localhost:5108${product.imageFile}`}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Stock Badge */}
                <div className="absolute top-3 right-3">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      product.stockQuantity > 10
                        ? "bg-green-500 text-white"
                        : product.stockQuantity > 0
                          ? "bg-yellow-500 text-black"
                          : "bg-red-500 text-white"
                    }`}
                  >
                    {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Out of stock"}
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-2">{product.description}</p>
                </div>

                {/* Price and Category */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">
                    €{product.price.toFixed(2)}
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1">
                    <span className="text-emerald-300 text-xs font-semibold">{product.category}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAddToCart(product.id, 1)}
                    disabled={product.stockQuantity === 0}
                    className="group/btn flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/25 disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4 group-hover/btn:scale-110 transition-transform"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    ADD TO CART
                  </button>

                  <button
                    onClick={() => addToWishlist(product)}
                    className="group/heart bg-white/20 backdrop-blur-sm border border-white/30 hover:border-red-400/50 hover:bg-red-500/20 rounded-xl px-4 py-3 transition-all duration-300 hover:scale-110"
                  >
                    <svg
                      className="w-5 h-5 text-gray-300 group-hover/heart:text-red-400 group-hover/heart:scale-125 transition-all duration-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">No Products Found</h3>
              <p className="text-gray-300">Try adjusting your filters to see more products.</p>
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
        
        .animate-pulse {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-bounce {
          animation: bounce 4s infinite;
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

export default ProductList

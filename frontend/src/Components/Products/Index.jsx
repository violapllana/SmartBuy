"use client"

import { useState, useEffect } from "react"

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

const Products = () => {
  const [product, setProduct] = useState({
    name: nameOptions[0], // default Laptop
    description: "",
    price: "",
    stockQuantity: 0,
    category: categoryOptions[0], // default Smartphones dhe Aksesore
    imageFile: null,
  })

  const [productsList, setProductsList] = useState([])
  const [editProductId, setEditProductId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch("http://localhost:5108/api/Product")
      if (res.ok) {
        const data = await res.json()
        setProductsList(data)
      }
    } catch (err) {
      console.error("Failed to fetch products", err)
      showNotification("Failed to fetch products", "error")
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type = "success") => {
    const notification = document.createElement("div")
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    } text-white`
    notification.textContent = message
    document.body.appendChild(notification)
    setTimeout(() => document.body.removeChild(notification), 3000)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    setProduct((prev) => ({ ...prev, imageFile: e.target.files[0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append("Name", product.name)
    formData.append("Description", product.description)
    formData.append("Price", product.price)
    formData.append("StockQuantity", product.stockQuantity)
    formData.append("Category", product.category)

    if (product.imageFile) {
      formData.append("ImageFile", product.imageFile)
    }

    try {
      let res
      if (editProductId) {
        res = await fetch(`http://localhost:5108/api/Product/${editProductId}`, {
          method: "PUT",
          body: formData,
        })
      } else {
        res = await fetch("http://localhost:5108/api/Product", {
          method: "POST",
          body: formData,
        })
      }

      if (res.ok) {
        showNotification(editProductId ? "Product updated successfully!" : "Product created successfully!")
        setProduct({
          name: nameOptions[0],
          description: "",
          price: "",
          stockQuantity: 0,
          category: categoryOptions[0],
          imageFile: null,
        })
        setEditProductId(null)
        fetchProducts()
      } else {
        showNotification("Failed to save product", "error")
      }
    } catch (error) {
      console.error(error)
      showNotification("Something went wrong", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (prod) => {
    setEditProductId(prod.id)
    setProduct({
      name: prod.name || nameOptions[0],
      description: prod.description || "",
      price: prod.price || "",
      stockQuantity: prod.stockQuantity || 0,
      category: prod.category || categoryOptions[0],
      imageFile: null,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return

    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5108/api/Product/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        showNotification("Product deleted successfully!")
        fetchProducts()
      } else {
        showNotification("Failed to delete product", "error")
      }
    } catch (error) {
      console.error(error)
      showNotification("Something went wrong", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditProductId(null)
    setProduct({
      name: nameOptions[0],
      description: "",
      price: "",
      stockQuantity: 0,
      category: categoryOptions[0],
      imageFile: null,
    })
  }

  // Filter products based on search term and category
  const filteredProducts = productsList.filter((prod) => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || prod.category === filterCategory
    return matchesSearch && matchesCategory
  })

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
            Product Management
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-emerald-400 to-yellow-400 mx-auto rounded-full" />
        </div>

        {/* Product Form */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            {editProductId ? (
              <>
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit Product
              </>
            ) : (
              <>
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Product
              </>
            )}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Dropdown */}
              <div className="group">
                <label className="block text-sm font-semibold text-emerald-300 mb-2">Product Name</label>
                <select
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 hover:bg-white/30 group-hover:scale-105"
                >
                  {nameOptions.map((opt, idx) => (
                    <option key={idx} value={opt} className="bg-gray-800 text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Dropdown */}
              <div className="group">
                <label className="block text-sm font-semibold text-emerald-300 mb-2">Category</label>
                <select
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 hover:bg-white/30 group-hover:scale-105"
                >
                  {categoryOptions.map((opt, idx) => (
                    <option key={idx} value={opt} className="bg-gray-800 text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="group">
                <label className="block text-sm font-semibold text-emerald-300 mb-2">Price (€)</label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  required
                  className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 hover:bg-white/30 group-hover:scale-105"
                />
              </div>

              {/* Stock Quantity */}
              <div className="group">
                <label className="block text-sm font-semibold text-emerald-300 mb-2">Stock Quantity</label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={product.stockQuantity}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 hover:bg-white/30 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Description */}
            <div className="group">
              <label className="block text-sm font-semibold text-emerald-300 mb-2">Description</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleChange}
                placeholder="Enter product description..."
                required
                rows="4"
                className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 hover:bg-white/30 group-hover:scale-105 resize-none"
              />
            </div>

            {/* Image Upload */}
            <div className="group">
              <label className="block text-sm font-semibold text-emerald-300 mb-2">Product Image</label>
              <div className="relative">
                <input
                  type="file"
                  name="imageFile"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 hover:bg-white/30 group-hover:scale-105 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500 file:text-white hover:file:bg-emerald-600"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:opacity-50 ${
                  editProductId
                    ? "bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 hover:shadow-yellow-500/25"
                    : "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 hover:shadow-emerald-500/25"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : editProductId ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Update Product
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Create Product
                  </>
                )}
              </button>

              {editProductId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Products List Section */}
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter Controls */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8 shadow-2xl">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              {/* Search Bar */}
              <div className="flex-1 min-w-64">
                <label className="block text-sm font-semibold text-emerald-300 mb-2">Search Products</label>
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
                    placeholder="Search by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="group">
                <label className="block text-sm font-semibold text-emerald-300 mb-2">Filter by Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
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

              {/* Products Count */}
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold">{filteredProducts.length}</div>
                  <div className="text-sm opacity-90">Products</div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-emerald-300 text-lg font-semibold">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
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
                <p className="text-gray-300">Try adjusting your search or create a new product.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:scale-105 hover:bg-white/20"
                >
                  {/* Product Image */}
                  <div className="relative overflow-hidden h-48">
                    {prod.imageFile ? (
                      <img
                        src={`http://localhost:5108${prod.imageFile}`}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                    {/* Stock Badge */}
                    <div className="absolute top-3 right-3">
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          prod.stockQuantity > 10
                            ? "bg-green-500 text-white"
                            : prod.stockQuantity > 0
                              ? "bg-yellow-500 text-black"
                              : "bg-red-500 text-white"
                        }`}
                      >
                        {prod.stockQuantity > 0 ? `${prod.stockQuantity} in stock` : "Out of stock"}
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                        {prod.name}
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed line-clamp-2 mb-3">{prod.description}</p>
                    </div>

                    {/* Price and Category */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">
                        €{prod.price.toFixed(2)}
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1">
                        <span className="text-emerald-300 text-xs font-semibold">{prod.category}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(prod)}
                        className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-semibold rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              ))}
            </div>
          )}
        </div>
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

export default Products

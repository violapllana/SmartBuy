"use client"

import React, { useState, useEffect } from 'react';

const RandomProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    fetchRandomProducts();
  }, []);

  const fetchRandomProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5108/api/Product/random', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCardStyle = (index) => {
    const styles = ['featured', 'compact', 'wide', 'tall'];
    return styles[index % styles.length];
  };

  const getSpecialBadge = (product, index) => {
    if (index === 0) return { text: 'Featured', color: 'from-purple-500 to-pink-500' };
    if (product.stockQuantity < 5) return { text: 'Limited', color: 'from-red-500 to-orange-500' };
    if (product.stockQuantity > 20) return { text: 'Popular', color: 'from-blue-500 to-cyan-500' };
    if (index === products.length - 1) return { text: 'New', color: 'from-green-500 to-emerald-500' };
    return null;
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <div className="w-6 h-6 bg-white/30 rounded-full"></div>
            </div>
            <div className="h-8 bg-white/20 rounded-lg w-48 animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="group relative">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-2xl animate-pulse">
                <div className="aspect-square bg-gradient-to-br from-emerald-500/20 to-green-500/20" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-white/20 rounded-lg" />
                  <div className="h-3 bg-white/10 rounded-lg w-3/4" />
                  <div className="h-3 bg-white/10 rounded-lg w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-white font-semibold text-xl mb-2">Failed to load products</h3>
          <p className="text-gray-300 text-sm mb-2">{error}</p>
          <button
            onClick={fetchRandomProducts}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg hover:from-emerald-600 hover:to-green-600 transition-all duration-300 hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="bg-yellow-500/10 backdrop-blur-md border border-yellow-500/20 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-white font-semibold text-xl mb-2">No products found</h3>
          <p className="text-gray-300 text-sm mb-6">
            The database appears to be empty. Add some products to see them here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Simple Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white">Featured Products</h2>
        </div>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Discover our handpicked selection of amazing products
        </p>
      </div>

      {/* Dynamic Products Grid with Different Shapes */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 auto-rows-[200px]">
        {products.map((product, index) => {
          const cardStyle = getCardStyle(index);
          const specialBadge = getSpecialBadge(product, index);
          
          return (
            <div
              key={product.id}
              className={`group relative cursor-pointer transition-all duration-700 hover:z-10 ${
                cardStyle === 'featured' ? 'md:col-span-2 md:row-span-2' : // Large square
                cardStyle === 'wide' ? 'md:col-span-2 md:row-span-1' : // Wide rectangle
                cardStyle === 'tall' ? 'md:col-span-1 md:row-span-2' : // Tall rectangle
                'md:col-span-1 md:row-span-1' // Regular square
              }`}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              style={{ 
                animationDelay: `${index * 150}ms`,
                animation: 'slideInUp 0.8s ease-out forwards'
              }}
            >
              {/* Backdrop glow */}
              <div className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110 ${
                specialBadge ? `bg-gradient-to-r ${specialBadge.color}/20` : 'bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-yellow-400/20'
              }`} />

              {/* Main Card */}
              <div className={`relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:scale-105 hover:border-white/30 h-full ${
                cardStyle === 'featured' ? 'bg-gradient-to-br from-purple-900/20 to-pink-900/20' :
                cardStyle === 'compact' ? 'bg-gradient-to-br from-blue-900/20 to-cyan-900/20' :
                cardStyle === 'wide' ? 'bg-gradient-to-br from-green-900/20 to-emerald-900/20' :
                'bg-gradient-to-br from-orange-900/20 to-red-900/20'
              }`}>
                
                {/* Animated Background Elements */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-2 right-2 w-8 h-8 bg-emerald-500/10 rounded-full blur-lg animate-pulse" />
                  <div className="absolute bottom-2 left-2 w-6 h-6 bg-yellow-400/10 rounded-full blur-md animate-pulse" />
                </div>

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30" />

                {/* Special Badge */}
                {specialBadge && (
                  <div className="absolute top-3 left-3 z-20">
                    <div className={`px-3 py-1 bg-gradient-to-r ${specialBadge.color} text-white text-xs font-bold rounded-full shadow-lg animate-pulse`}>
                      {specialBadge.text}
                    </div>
                  </div>
                )}

                {/* Product Image */}
                <div className="relative h-2/3 overflow-hidden bg-gradient-to-br from-emerald-500/20 to-green-500/20">
                  {product.imageFile ? (
                    <img
                      src={`http://localhost:5108/${product.imageFile}`}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        const fallback = e.target.nextSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  
                  {/* Fallback for missing images */}
                  <div className={`absolute inset-0 flex items-center justify-center ${product.imageFile ? 'hidden' : 'flex'}`}>
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  {/* Stock Status Badge */}
                  <div className="absolute top-3 right-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm border ${
                      product.stockQuantity > 10 
                        ? 'bg-green-500/20 border-green-400/30 text-green-300'
                        : product.stockQuantity > 0
                          ? 'bg-yellow-500/20 border-yellow-400/30 text-yellow-300'
                          : 'bg-red-500/20 border-red-400/30 text-red-300'
                    }`}>
                      {product.stockQuantity > 10 ? 'In Stock' : product.stockQuantity > 0 ? 'Low Stock' : 'Out of Stock'}
                    </div>
                  </div>

                  {/* Price Overlay */}
                  <div className="absolute bottom-3 left-3">
                    <div className="px-3 py-1 bg-gradient-to-r from-emerald-500/90 to-green-500/90 backdrop-blur-sm rounded-lg">
                      <span className="text-white font-bold text-sm">{formatPrice(product.price)}</span>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3 relative z-10 h-1/3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-300 text-xs line-clamp-2 mb-2">
                      {product.description || 'No description available'}
                    </p>
                  </div>
                  
                  {/* Category */}
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="bg-white/10 px-2 py-1 rounded text-xs">{product.category}</span>
                    <span>{formatDate(product.createdAt)}</span>
                  </div>
                </div>

                {/* Enhanced Hover Details Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent backdrop-blur-sm transition-all duration-500 ${
                  hoveredProduct === product.id ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-lg font-bold mb-3">{product.name}</h3>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-white/10 rounded-lg p-2">
                        <span className="text-gray-300 text-xs">Price</span>
                        <div className="font-semibold text-emerald-300">{formatPrice(product.price)}</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-2">
                        <span className="text-gray-300 text-xs">Stock</span>
                        <div className={`font-semibold ${
                          product.stockQuantity > 10 ? 'text-green-300' : 
                          product.stockQuantity > 0 ? 'text-yellow-300' : 'text-red-300'
                        }`}>
                          {product.stockQuantity} units
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-200 text-sm leading-relaxed">
                      {product.description || 'No detailed description available for this product.'}
                    </p>
                  </div>
                </div>

                {/* Floating Particles */}
                <div className="absolute bottom-2 left-4 w-1 h-1 bg-emerald-400 rounded-full opacity-60 animate-float" />
                <div className="absolute top-4 right-8 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-40 animate-float-delayed" />

                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              </div>
            </div>
          );
        })}
      </div>

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

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
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
  );
};

export default RandomProducts;
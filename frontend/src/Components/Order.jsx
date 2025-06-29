import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "./api";
import { useNavigate } from "react-router-dom";

const API_BASE_ORDERS = "http://localhost:5108/api/Order/GetOrdersByUser";
const BASE_URL = "http://localhost:5108";

const Order = ({ username }) => {
  const [userId, setUserId] = useState(null);
  const [order, setOrder] = useState(null);

  const navigate = useNavigate();

  // Fetch user ID from username
  useEffect(() => {
    if (!username) return;

    const fetchUserId = async () => {
      try {
        const response = await api.get(
          `http://localhost:5108/users/by-username?username=${username}`
        );
        if (response.data?.id) {
          setUserId(response.data.id);
        }
      } catch (err) {
        console.error("Failed to fetch userId:", err);
      }
    };

    fetchUserId();
  }, [username]);

  // Fetch active or pending order for user
  useEffect(() => {
    if (!userId) return;

    const fetchOrdersByUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_ORDERS}/${userId}`);
        const activeOrder = res.data.find(
          (o) => o.status === "Active" || o.status === "Pending"
        );
        setOrder(activeOrder || null);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };

    fetchOrdersByUser();
  }, [userId]);

  // Remove product from order or delete order if no products left
  const removeProductFromOrder = async (orderId, productId) => {
    try {
      const response = await api.post("Order/RemoveProductFromOrder", { orderId, productId });

      if (response.status === 204) {
        // Order deleted, remove from UI
        setOrder(null);
        return;
      }

      const updatedOrder = response.data;
      setOrder(updatedOrder);
    } catch (error) {
      console.error("Error removing product or deleting order:", error);
    }
  };

  // Simplified: navigate directly to stripe payment page with order info
  const handlePlaceOrderClick = () => {
    navigate("/stripepayment", { state: { orderId: order.id, amount: order.totalPrice } });
  };

 if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-green-500/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-400/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-400/5 rounded-full blur-xl animate-bounce" />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />

        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 max-w-lg mx-4 text-center shadow-2xl">
          <div className="animate-float mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-emerald-300 to-green-300 bg-clip-text text-transparent">
              No Active Orders Yet
            </h2>

            <p className="text-gray-300 mb-8 leading-relaxed">
              Looks like you don't have any active or pending orders. Browse our amazing products and start your
              shopping journey today!
            </p>

            <button
              onClick={() => (window.location.href = "/productlist")}
              className="group relative bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-3 mx-auto"
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

        <style jsx="true">{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
        `}</style>
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

      <div className="relative z-10 p-4 md:p-8 pt-24">
        <section
          className="max-w-6xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-2xl"
          aria-label="Order summary"
        >
          {/* Header */}
          <header className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 px-8 md:px-12 py-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">Your Order Summary</h2>
            </div>

            <div className="flex items-center gap-2 text-emerald-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 13a2 2 0 002 2h6a2 2 0 002-2L16 7"
                />
              </svg>
              <p className="text-base md:text-lg">
                Last order placed on{" "}
                <time dateTime={order.orderDate} className="font-semibold text-yellow-200">
                  {new Date(order.orderDate).toLocaleDateString()}
                </time>
              </p>
            </div>
          </header>

          {/* Main Content */}
          <main className="px-8 md:px-12 py-10">
            {/* Status and Total */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-10 gap-6">
              <div
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm backdrop-blur-sm border ${
                  order.status === "Active"
                    ? "bg-green-500/20 text-green-300 border-green-500/30"
                    : order.status === "Pending"
                      ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                      : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    order.status === "Active"
                      ? "bg-green-400"
                      : order.status === "Pending"
                        ? "bg-yellow-400"
                        : "bg-gray-400"
                  } animate-pulse`}
                />
                {order.status.toUpperCase()}
              </div>

              <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-4 rounded-xl shadow-lg">
                <p className="text-lg font-semibold">
                  Total:{" "}
                  <span className="text-2xl font-bold">
                    {order.totalPrice.toLocaleString("de-DE", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </span>
                </p>
              </div>
            </div>

            {/* Products Grid */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-emerald-300 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                Order Items ({order.products.length})
              </h3>

              <ul
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                role="list"
                aria-label="Products in order"
              >
                {order.products.map(({ productId, quantity, price, productName, productImage }) => (
                  <li
                    key={productId}
                    className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:scale-105 hover:bg-white/20"
                  >
                    {/* Product Image */}
                    <div className="relative overflow-hidden h-48">
                      {productImage ? (
                        <img
                          src={`${BASE_URL}${productImage}`}
                          alt={productName}
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

                      {/* Quantity Badge */}
                      <div className="absolute top-3 right-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Qty: {quantity}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300 line-clamp-1">
                        {productName}
                      </h3>

                      <div className="flex items-center justify-between mb-4">
                        <div className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">
                          {price.toLocaleString("de-DE", {
                            style: "currency",
                            currency: "EUR",
                          })}
                        </div>
                      </div>

                      <button
                        onClick={() => removeProductFromOrder(order.id, productId)}
                        className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Remove from Order
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Place Order Button */}
            <div className="border-t border-white/10 pt-8">
              <button
                type="button"
                className="group w-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-600 hover:via-green-600 hover:to-emerald-700 text-white font-bold py-6 rounded-xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 text-lg"
                onClick={handlePlaceOrderClick}
              >
                <svg
                  className="w-6 h-6 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Place Order
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </main>
        </section>
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
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
};

export default Order;

import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "./api";
import CreditCardSelector from "./Card/CreditCardSelector";
  import { useNavigate } from "react-router-dom";



const API_BASE_ORDERS = "http://localhost:5108/api/Order/GetOrdersByUser";
const BASE_URL = "http://localhost:5108";

const Order = ({ username }) => {
  const [userId, setUserId] = useState(null);
  const [order, setOrder] = useState(null);
  const [showCardSelector, setShowCardSelector] = useState(false); // Modal visibility
  const [selectedCard, setSelectedCard] = useState(null); // now holds full card info object

const navigate = useNavigate();


const handleSelectCard = (card) => {
  const paymentMethodId = card.paymentMethod;  // <-- Use the paymentMethod string here

  const paymentData = {
    orderId: order.id,
    amount: order.totalPrice,
    paymentMethodId,  // pass this along
  };

  console.log("Navigating with paymentMethodId:", paymentMethodId);
  navigate("/stripepayment", { state: { orderId: order.id, amount: order.totalPrice, paymentMethodId } });
};

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

  // Open card selector modal on place order click
  const handlePlaceOrderClick = () => {
    setShowCardSelector(true);
    
  };

  // Close card selector modal
  const handleCloseCardSelector = () => {
    setShowCardSelector(false);
  };


  if (!order)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 bg-green-50 rounded-lg border border-green-300 text-green-900 shadow-md mx-auto max-w-xl my-24">
        <div
          className="flex flex-col items-center"
          style={{
            animation: "float 4s ease-in-out infinite",
          }}
        >
          <svg
            className="w-12 h-12 mb-4 text-green-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
          </svg>

          <h2 className="text-2xl font-semibold mb-2 tracking-wide">
            No Active Orders Yet
          </h2>

          <p className="text-center text-green-800 mb-6 max-w-xs">
            Looks like you don’t have any active or pending orders. Browse our products and start your order today!
          </p>

          <button
            onClick={() => (window.location.href = "/productlist")}
            className="px-6 py-2 border-2 border-green-700 text-green-700 rounded-lg font-medium hover:bg-green-700 hover:text-white transition-colors"
          >
            Browse Products
          </button>
        </div>

        <style>
          {`
            @keyframes float {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-10px);
              }
            }
          `}
        </style>
      </div>
    );

  return (
    <section
      className="max-w-6xl mx-auto mt-24 bg-white rounded-lg border border-green-300 shadow-md overflow-hidden"
      aria-label="Order summary"
    >
      <header className="px-10 py-8 bg-green-900">
        <h2 className="text-4xl font-extrabold text-white tracking-tight">
          Your Order Summary
        </h2>
        <p className="mt-3 text-green-300 text-base sm:text-lg">
          Last order placed on{" "}
          <time dateTime={order.orderDate}>
            {new Date(order.orderDate).toLocaleDateString()}
          </time>
        </p>
      </header>

      <main className="px-10 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <span
            className={`inline-block px-5 py-2 rounded-md font-semibold text-sm sm:text-base ${
              order.status === "Active"
                ? "bg-green-200 text-green-900"
                : order.status === "Pending"
                ? "bg-yellow-200 text-yellow-900"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {order.status.toUpperCase()}
          </span>
          <p className="text-2xl font-semibold text-green-900">
            Total:{" "}
            <span className="text-3xl font-extrabold text-green-700">
              {order.totalPrice.toLocaleString("de-DE", {
                style: "currency",
                currency: "EUR",
              })}
            </span>
          </p>
        </div>

        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 border-t border-b border-green-200 py-6"
          role="list"
          aria-label="Products in order"
        >
          {order.products.map(
            ({ productId, quantity, price, productName, productImage }) => (
              <li
                key={productId}
                className="flex flex-col bg-green-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                {productImage ? (
                  <img
                    src={`${BASE_URL}${productImage}`}
                    alt={productName}
                    className="w-full h-40 object-cover rounded-md border border-green-300 mb-4"
                  />
                ) : (
                  <div className="w-full h-40 bg-green-100 rounded-md flex items-center justify-center text-green-700 font-semibold text-lg select-none mb-4">
                    N/A
                  </div>
                )}

                <h3 className="text-lg font-semibold text-green-900 truncate mb-1">
                  {productName}
                </h3>
                <p className="text-green-700 font-medium mb-2">Qty: {quantity}</p>

                <p className="text-green-900 font-bold text-xl mb-2">
                  {price.toLocaleString("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </p>

                <button
                  onClick={() => removeProductFromOrder(order.id, productId)}
                  className="mt-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
                >
                  Remove from Order
                </button>
              </li>
            )
          )}
        </ul>

        <button
          type="button"
          className="mt-12 w-full py-4 bg-green-700 text-white font-bold rounded-lg shadow-md hover:bg-green-800 transition-colors duration-300"
          onClick={handlePlaceOrderClick}
        >
          Place order
        </button>
      </main>

      {/* Modal popup for card selection */}


  {showCardSelector && (
  <div
    className="fixed inset-0 bg-black bg-opacity-0 flex items-center justify-center z-50"
    aria-modal="true"
    role="dialog"
  >
    <div className="bg-gray-100 bg-opacity-20 p-6 rounded-lg shadow-lg max-w-max w-auto">
      <CreditCardSelector
        userId={userId}
        showCardSelector={showCardSelector}
        onClose={handleCloseCardSelector}
        onSelectCard={handleSelectCard}
      />
    </div>
  </div>
)}




    </section>
  );
};

export default Order;

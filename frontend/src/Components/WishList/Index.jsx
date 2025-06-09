import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import api from "../api";


const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUsername = Cookies.get("username");
    if (storedUsername) {
      fetchUserId(storedUsername);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserId = async (username) => {
    try {
      const res = await fetch(
        `http://localhost:5108/users/by-username?username=${username}`
      );
      if (!res.ok) throw new Error("Failed to fetch user ID");
      const data = await res.json();
      setUserId(data.id);
      fetchWishlist(data.id);
    } catch (err) {
      console.error("Error fetching user ID:", err);
      setLoading(false);
    }
  };

  const fetchWishlist = async (userId) => {
    try {
      const res = await fetch(
        `http://localhost:5108/api/Wishlist/user/${userId}`
      );
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      const data = await res.json();
      setWishlist(data);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };








  const handleAddToCart = async (productId, quantity) => {
  if (!userId) {
    console.error("User ID not available.");
    return;
  }

  try {
    // 1. Check if user has a pending order (returns boolean)
    const { data: hasPendingOrder } = await api.get(`/Order/HasPendingOrder/${userId}`);

    if (!hasPendingOrder) {
      // 2a. No pending order, create a new order with product
      // Backend expects DTO like: { userId, products: [{ productId, quantity }] }
      await api.post(`/Order`, {
        userId,
        products: [{ productId, quantity }],
      });

    } else {
      // 2b. Pending order exists, get that pending order's Id
      const { data: orders } = await api.get(`/Order/GetOrdersByUser/${userId}`);

      // Find the pending order from orders list
      const pendingOrder = orders.find(o => o.status === "Pending");
      if (!pendingOrder) {
        console.error("Pending order not found after check.");
        return;
      }

      // 3. Add product to existing pending order
      // Backend expects AddProductToOrderRequestDto: { orderId, productId, quantity }
      await api.post(`/Order/AddProductToOrder`, {
        orderId: pendingOrder.id,
        productId,
        quantity,
      });
    }

    alert("Product added to cart!");
  } catch (err) {
    console.error("Failed to add product to cart", err);
  }
};










  const deleteFromWishlist = async (productId) => {
    if (!userId) return;
    const confirmed = window.confirm(
      "Are you sure you want to remove this product from wishlist?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `http://localhost:5108/api/Wishlist/${userId}/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete item");
      setWishlist((prev) =>
        prev.filter((item) => item.product.id !== productId)
      );
    } catch (err) {
      console.error("Error deleting wishlist item:", err);
    }
  };

  if (loading)
    return <p className="text-center text-gray-500">Loading wishlist...</p>;
  if (!userId)
    return (
      <p className="text-center text-red-500">
        User not found or not logged in.
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-black-700 ">Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="text-center text-gray-500">
          No products in your wishlist.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center justify-between bg-white border rounded shadow p-4"
            >
              {/* Image */}
              <img
                src={`http://localhost:5108${item.product.imageFile}`}
                alt={item.product.name}
                className="w-24 h-24 object-contain rounded mb-4 sm:mb-0"
              />
              {/* Product info */}
              <div className="flex-1 sm:ml-4 text-sm text-gray-800">
                <p className="font-semibold text-gray-900">
                  {item.product.name}
                </p>
                <p className="mt-1">
                  <strong>Description:</strong> {item.product.description}
                </p>
                <p>
                  <strong>Category:</strong> {item.product.category}
                </p>
                <p>
                  <strong>Price:</strong>{" "}
                  <span className="font-semibold text-orange-600">
                    {item.product.price} €
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Added on: {new Date(item.createdAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Shop: SmartBuy - The first online shopping center in Kosovo
                </p>
              </div>
              {/* Buttons */}
              <div className="flex flex-col gap-2 mt-4 sm:mt-0">
                <button
                  onClick={() => handleAddToCart(item.product.id, 1)}
                  className="flex items-center gap-1 text-xs border border-orange-500 text-orange-500 hover:bg-orange-100 rounded px-2 py-1"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="orange"
                    strokeWidth="2"
                  >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  Add to cart
                </button>
                <button
                  onClick={() => deleteFromWishlist(item.product.id)}
                  className="flex items-center gap-1 text-xs border border-red-500 text-red-500 hover:bg-red-100 rounded px-2 py-1"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="red"
                    strokeWidth="2"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderForAdmins = () => {
  const [orders, setOrders] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders and usernames
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: ordersData } = await axios.get("http://localhost:5108/api/Order");
        setOrders(ordersData);

        const uniqueUserIds = [...new Set(ordersData.map(order => order.userId))];
        const usernamePromises = uniqueUserIds.map(async (userId) => {
          try {
            const res = await axios.get(`http://localhost:5108/users/getusernamefromid/${userId}`);
            return { userId, username: res.data };
          } catch {
            return { userId, username: "Unknown User" };
          }
        });

        const results = await Promise.all(usernamePromises);
        const userMap = {};
        results.forEach(({ userId, username }) => {
          userMap[userId] = username;
        });
        setUsernames(userMap);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Function to update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:5108/api/Order/UpdateStatus/${orderId}`,
        { status: newStatus }
      );
      alert(`Order #${orderId} status updated to ${newStatus}`);

      // Refresh orders after update
      const { data: updatedOrders } = await axios.get("http://localhost:5108/api/Order");
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error.message);
      alert("Failed to update status: " + (error.response?.data || error.message));
    }
  };

  if (loading) return <div className="text-green-600 p-4">Loading orders...</div>;
  if (error) return <div className="text-red-600 p-4">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-green-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-green-900">Admin Orders Dashboard</h1>

      {orders.length === 0 ? (
        <p className="text-green-700">No orders found.</p>
      ) : (
        <div className="space-y-8">
          {orders.map(order => (
            <div
              key={order.id}
              className="border border-green-300 rounded-lg p-6 bg-white shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-green-800">Order #{order.id}</h2>
                  <p className="text-green-600">
                    <span className="font-medium">User:</span>{" "}
                    {usernames[order.userId] || order.userId}
                  </p>
                  <p className="text-green-600">
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(order.orderDate).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status.toLowerCase() === "paid"
                      ? "bg-green-200 text-green-800"
                      : order.status.toLowerCase() === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : order.status.toLowerCase() === "shipped"
                      ? "bg-blue-200 text-blue-800"
                      : order.status.toLowerCase() === "delivered"
                      ? "bg-purple-200 text-purple-800"
                      : order.status.toLowerCase() === "cancelled"
                      ? "bg-red-200 text-red-800"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-green-200">
                  <thead>
                    <tr className="bg-green-100">
                      <th className="border border-green-300 px-4 py-2 text-left text-green-800">Product</th>
                      <th className="border border-green-300 px-4 py-2 text-right text-green-800">Quantity</th>
                      <th className="border border-green-300 px-4 py-2 text-right text-green-800">Price</th>
                      <th className="border border-green-300 px-4 py-2 text-left text-green-800">Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map(product => (
                      <tr key={product.productId} className="hover:bg-green-50">
                        <td className="border border-green-300 px-4 py-2">{product.productName}</td>
                        <td className="border border-green-300 px-4 py-2 text-right">{product.quantity}</td>
                        <td className="border border-green-300 px-4 py-2 text-right">${product.price.toFixed(2)}</td>
                        <td className="border border-green-300 px-4 py-2">
                          <img
                            src={`http://localhost:5108${product.productImage.replace(/\\/g, "/")}`}
                            alt={product.productName}
                            className="h-12 w-12 object-contain rounded"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-right text-lg font-semibold text-green-900">
                Total: ${order.totalPrice.toFixed(2)}
              </div>

              {/* Status update buttons */}
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => updateOrderStatus(order.id, "Pending")}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Pending
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, "Paid")}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  Paid
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, "Shipped")}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Shipped
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, "Delivered")}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
                >
                  Delivered
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, "Cancelled")}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Cancelled
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderForAdmins;

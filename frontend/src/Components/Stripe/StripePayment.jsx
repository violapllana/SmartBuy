import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../api";
import { useLocation } from "react-router-dom";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ username, initialEmail, initialAmount, initialOrderId }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [userId, setUserId] = useState("");
  const [orderId, setOrderId] = useState(initialOrderId || "");
  const [amount, setAmount] = useState(initialAmount || "");
  const [email, setEmail] = useState(initialEmail || "");

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch userId using username
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet.");
      return;
    }

    if (!userId || !orderId || !amount || !email) {
      setError("Please fill all the fields.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const cardElement = elements.getElement(CardElement);

    try {
      const res = await fetch("http://localhost:5108/api/Payments/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          orderId: parseInt(orderId, 10),
          amount: parseFloat(amount),
          email,
        }),
      });

      const data = await res.json();

      if (!data.clientSecret) {
        setError("Failed to create payment intent.");
        setLoading(false);
        return;
      }

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: cardElement },
      });

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        setSuccess(true);
      } else {
        setError("Payment failed.");
      }
    } catch (err) {
      setError("Payment error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded shadow-md space-y-6">
      <h2 className="text-2xl font-semibold text-center">Complete Payment</h2>

     
      {/* Order ID */}
      <div>
        <label className="block mb-1 font-medium">Order ID</label>
        <input
          type="number"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter order ID"
          required
        />
      </div>

      {/* Amount */}
      <div>
        <label className="block mb-1 font-medium">Amount</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter amount"
          required
        />
      </div>

      {/* Email */}
      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Enter email"
          required
        />
      </div>

      {/* Card */}
      <div>
        <label className="block mb-1 font-medium">Card Details</label>
        <div className="p-3 border rounded">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-3 mt-4 text-white rounded ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Processing…" : "Pay Now"}
      </button>

      {error && <p className="text-red-600 font-medium">{error}</p>}
      {success && <p className="text-green-600 font-medium">Payment succeeded!</p>}
    </form>
  );
};

const StripePayment = () => {
  const { state } = useLocation();
  const { username, email, amount, orderId } = state || {};

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        username={username}
        initialEmail={email}
        initialAmount={amount}
        initialOrderId={orderId}
      />
    </Elements>
  );
};

export default StripePayment;

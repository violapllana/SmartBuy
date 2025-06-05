import React, { useState, useEffect, useCallback } from "react";
import CreditCardSelector from "../Card/CreditCardSelector";
import { useLocation } from "react-router-dom";
import api from "../api"; // Your configured axios instance
import axios from "axios";

const StripePayment = ({ username }) => {
  const location = useLocation();

  // Extract order info and optionally passed userId from route state
  const { orderId, amount, userId: passedUserId } = location.state || {};

  // State hooks
  const [userId, setUserId] = useState(passedUserId || null);
  const [showCardSelector, setShowCardSelector] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [email, setEmail] = useState("");

  // Fetch user's email based on username on mount or username change
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5108/users/email?username=${username}`
        );
        // The API might return { email: "..." } or just the email string
        setEmail(response.data.email || response.data);
      } catch (error) {
        console.error("Failed to fetch email:", error);
      }
    };

    if (username) {
      fetchEmail();
    }
  }, [username]);

  // Fetch userId from username if not passed via route state
  const fetchUserId = useCallback(async () => {
    if (!username) return;
    try {
      const res = await api.get(
        `http://localhost:5108/users/by-username?username=${username}`
      );
      setUserId(res.data.id);
      localStorage.setItem("selectedUserId", res.data.id);
    } catch (err) {
      console.error("Failed to fetch user ID", err);
    }
  }, [username]);

  // Trigger fetchUserId if userId is missing
  useEffect(() => {
    if (!userId) {
      fetchUserId();
    }
  }, [fetchUserId, userId]);

  // When a card is selected from CreditCardSelector
  const handleSelectCard = (card) => {
    setSelectedCard(card);
    setShowCardSelector(false);
  };

  // Handles the payment process
  const handlePayment = async () => {
    if (!selectedCard) {
      alert("Please select a card to proceed.");
      return;
    }

    if (!userId || !orderId || !amount || !email) {
      alert("Missing required payment information.");
      console.warn("Missing data:", { userId, orderId, amount, email });
      return;
    }

    try {
      // You can extend this if paymentMethodId is actually needed
      const paymentMethodId =
        selectedCard.stripePaymentMethodId ||
        selectedCard.id ||
        selectedCard.paymentMethod;

      console.log("Sending payment request:", {
        userId,
        orderId,
        amount,
        email,
        paymentMethodId,
      });

      // Make a charge request to your backend
      const chargeResponse = await api.post("/Payments/Charge", {
        userId,
        orderId,
        amount,
        email,
        paymentMethodId,
      });

      if (chargeResponse.status === 200) {
        if (chargeResponse.data.requiresConfirmation) {
          // If backend requires confirmation (e.g. 3D Secure)
          const confirmResponse = await api.post("/Payments/Confirm", {
            transactionId: chargeResponse.data.transactionId,
          });

          if (confirmResponse.status === 200) {
            setPaymentStatus("Payment successful! Thank you for your order.");
          } else {
            setPaymentStatus("Payment confirmation failed. Please try again.");
          }
        } else {
          setPaymentStatus("Payment successful! Thank you for your order.");
        }
      } else {
        setPaymentStatus("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("Payment error occurred. Please try again.");
    }
  };

  // Close the card selector popup/modal
  const handleCloseCardSelector = () => setShowCardSelector(false);

  // Mask card number for display
  const maskCardNumber = (number) => {
    if (!number || number.length < 4) return number || "";
    return "**** **** **** " + number.slice(-4);
  };

  // Show loading UI if userId isn't ready yet
  if (!userId) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-20 text-center">
        Loading user information...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-20">
      <h1 className="text-3xl font-bold mb-6">Complete Your Payment</h1>

      {paymentStatus && (
        <p className="mb-4 text-center font-semibold">{paymentStatus}</p>
      )}

      {!selectedCard && (
        <p className="mb-4 text-center text-gray-600">
          Please select a card to proceed.
        </p>
      )}

      {/* {selectedCard && (
        <div className="mb-4 p-4 border rounded bg-green-50">
          <h2 className="text-xl font-semibold mb-2">Selected Card</h2>
          <p>Card ending with: {maskCardNumber(selectedCard.last4)}</p>
          <p>
            Payment Method:{" "}
            {selectedCard.paymentMethod ||
              selectedCard.stripePaymentMethodId ||
              selectedCard.id}
          </p>
        </div>
      )} */}

      <button
        className="mb-6 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800 transition"
        onClick={() => setShowCardSelector(true)}
      >
        {selectedCard ? "Change Card" : "Select Card"}
      </button>

      {showCardSelector && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          aria-modal="true"
          role="dialog"
          tabIndex={-1}
          onClick={handleCloseCardSelector}
        >
          <div
            className="bg-gray-100 p-6 rounded-lg shadow-lg max-w-max w-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CreditCardSelector
              userId={userId}
              showCardSelector={showCardSelector}
              onClose={handleCloseCardSelector}
              onSelectCard={handleSelectCard}
            />
          </div>
        </div>
      )}

      <button
        className="w-full py-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition"
        onClick={handlePayment}
        disabled={!selectedCard}
      >
        Pay{" "}
        {amount?.toLocaleString("de-DE", {
          style: "currency",
          currency: "EUR",
        })}
      </button>
    </div>
  );
};

export default StripePayment;

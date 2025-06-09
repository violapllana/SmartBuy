import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import CreditCard from "./CreditCard";
import { useNavigate } from "react-router-dom";

const getCardLogo = (type) => {
  switch (type?.toLowerCase()) {
    case "visa":
      return "/logos/visa.png";
    case "mastercard":
      return "/logos/mastercard.png";
    case "amex":
    case "american express":
      return "/logos/amex.png";
    case "discover":
      return "/logos/discover.png";
    default:
      return "/logos/generic-card.png";
  }
};

// Mask card number except last 4 digits
const maskCardNumber = (number) => {
  if (!number || number.length < 4) return number;
  return number.slice(0, -4).replace(/\d/g, "*") + number.slice(-4);
};

const cardTypes = ["Visa", "Mastercard", "Amex", "Discover"];

const UserCardList = () => {
  const [cards, setCards] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedCard, setSelectedCard] = useState(null);
  const [editCard, setEditCard] = useState(null);
  const [originalCard, setOriginalCard] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showCVV, setShowCVV] = useState(false);
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = Cookies.get("username");
    if (storedUsername) {
      fetchUserId(storedUsername);
    } else {
      setLoading(false);
    }
  }, []);

  // You probably want to get role from somewhere, e.g. Cookies or an API
  useEffect(() => {
    const storedRole = Cookies.get("role");
    if (storedRole) setRole(storedRole);
  }, []);

  // Redirect logic corrected: redirect if role is NOT Admin or User
  useEffect(() => {
    if (!role) return;

    if (role !== "Admin" && role !== "User") {
      navigate("/");
    }
  }, [role, navigate]);

  // Fetch user ID by username
  const fetchUserId = async (username) => {
    try {
      const res = await fetch(`http://localhost:5108/users/by-username?username=${username}`);
      if (!res.ok) throw new Error("Failed to fetch user ID");
      const data = await res.json();
      setUserId(data.id);
      fetchCards(data.id);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Fetch cards for user
  const fetchCards = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5108/api/Card/user/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch cards");
      const data = await res.json();
      setCards(data);
    } catch (err) {
      console.error(err);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  // Delete card
  const handleDelete = async (cardId) => {
    if (!window.confirm("Are you sure you want to delete this card?")) return;
    try {
      const res = await fetch(`http://localhost:5108/api/Card/${cardId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete card");
      setCards(cards.filter((card) => card.id !== cardId));
    } catch (err) {
      alert("Error deleting card");
      console.error(err);
    }
  };

  // Open edit modal
  const openEdit = (card) => {
    setEditCard({ ...card });
    setOriginalCard({ ...card });
    setIsEditing(true);
  };

  // Handle form changes in edit modal
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    // For exp month and year, ensure numbers (convert if needed)
    if (name === "expMonth" || name === "expYear") {
      setEditCard((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setEditCard((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Check if changes were made in edit form
  const isChanged = () => {
    return JSON.stringify(editCard) !== JSON.stringify(originalCard);
  };

  // Save edited card
  const saveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:5108/api/Card/${editCard.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCard),
      });
      if (!res.ok) throw new Error("Failed to update card");
      setCards(cards.map((card) => (card.id === editCard.id ? editCard : card)));
      setIsEditing(false);
      setEditCard(null);
    } catch (err) {
      alert("Error updating card");
      console.error(err);
    }
  };

  // View card details modal
  const viewDetails = (card) => {
    setSelectedCard(card);
    setShowCVV(false);
    setShowDetails(true);
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-20 text-lg font-medium">Loading cards...</p>;

  if (!userId)
    return (
      <p className="text-center text-red-600 font-semibold mt-20 text-lg">
        User not found or not logged in.
      </p>
    );

  return (
    <div className="px-4 sm:px-6 lg:px-8 p-6 max-w-full sm:max-w-3xl md:max-w-5xl lg:max-w-7xl mx-auto">
      <h2 className="text-center text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-700 drop-shadow-md mb-10 animate-fade-in">
        Your Credit Cards
      </h2>

      {cards.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No cards found.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className="relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-md p-5 min-h-[360px] flex flex-col items-center justify-center group transition-transform hover:scale-[1.02]"
            >
              <div className="flex-1 flex items-center justify-center w-full">
                {/* Pass masked card number */}
                <CreditCard card={{ ...card, cardNumber: maskCardNumber(card.last4) }} />
              </div>

              {/* Action buttons shown on hover */}
              <div className="absolute inset-0 bg-white/90 rounded-2xl flex items-end justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5">
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => viewDetails(card)}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => openEdit(card)}
                    className="flex-1 px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Card Details Modal */}
      {showDetails && selectedCard && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-3">
              <img
                src={getCardLogo(selectedCard.cardType || selectedCard.brand)}
                alt={`${selectedCard.cardType || selectedCard.brand} logo`}
                className="w-12 h-7 object-contain"
              />
              Card Details
            </h3>
            <div className="space-y-3 text-gray-700 text-base">
              <p>
                <strong>Card Number:</strong> **** **** **** {selectedCard.last4}
              </p>
              <p>
                <strong>Type:</strong> {selectedCard.cardType || selectedCard.brand}
              </p>
              <p>
                <strong>Expiration:</strong> {selectedCard.expMonth}/{selectedCard.expYear}
              </p>
              <p>
                <strong>Cardholder Name:</strong> {selectedCard.cardHolderName || "N/A"}
              </p>
              <p>
                <strong>CVV:</strong>{" "}
                {showCVV ? selectedCard.cvv || "N/A" : "***"}{" "}
                <button
                  onClick={() => setShowCVV((prev) => !prev)}
                  className="text-indigo-600 hover:text-indigo-900 transition ml-2 underline"
                >
                  {showCVV ? "Hide" : "Show"}
                </button>
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowDetails(false)}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Card Modal */}
      {isEditing && editCard && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-yellow-500 mb-6">Edit Card</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!isChanged()) {
                  alert("No changes detected.");
                  return;
                }
                saveEdit();
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="cardHolderName" className="block font-medium mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  id="cardHolderName"
                  name="cardHolderName"
                  value={editCard.cardHolderName || ""}
                  onChange={handleEditChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label htmlFor="cardType" className="block font-medium mb-1">
                  Card Type
                </label>
                <select
                  id="cardType"
                  name="cardType"
                  value={editCard.cardType || ""}
                  onChange={handleEditChange}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="" disabled>
                    Select card type
                  </option>
                  {cardTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="last4" className="block font-medium mb-1">
                  Last 4 Digits
                </label>
                <input
                  type="text"
                  id="last4"
                  name="last4"
                  value={editCard.last4 || ""}
                  onChange={handleEditChange}
                  maxLength={4}
                  minLength={4}
                  pattern="\d{4}"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="1234"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="expMonth" className="block font-medium mb-1">
                    Exp Month
                  </label>
                  <input
                    type="number"
                    id="expMonth"
                    name="expMonth"
                    value={editCard.expMonth || ""}
                    onChange={handleEditChange}
                    min={1}
                    max={12}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="expYear" className="block font-medium mb-1">
                    Exp Year
                  </label>
                  <input
                    type="number"
                    id="expYear"
                    name="expYear"
                    value={editCard.expYear || ""}
                    onChange={handleEditChange}
                    min={new Date().getFullYear()}
                    max={2100}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cvv" className="block font-medium mb-1">
                  CVV
                </label>
                <input
                  type="password"
                  id="cvv"
                  name="cvv"
                  value={editCard.cvv || ""}
                  onChange={handleEditChange}
                  maxLength={4}
                  minLength={3}
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditCard(null);
                  }}
                  className="px-5 py-2 border border-gray-400 rounded-md hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isChanged()}
                  className={`px-5 py-2 rounded-md text-white ${
                    isChanged() ? "bg-yellow-500 hover:bg-yellow-600" : "bg-yellow-300 cursor-not-allowed"
                  } transition`}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCardList;

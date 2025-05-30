import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import CreditCard from "./CreditCard";

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

  const openEdit = (card) => {
    setEditCard({ ...card });
    setOriginalCard({ ...card });
    setIsEditing(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditCard((prev) => ({ ...prev, [name]: value }));
  };

  const isChanged = () => {
    return JSON.stringify(editCard) !== JSON.stringify(originalCard);
  };

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
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-center text-3xl font-semibold text-indigo-700 mb-8">Your Credit Cards</h2>

      {cards.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No cards found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-center">
          {cards.map((card) => (
  <div
    key={card.id}
    className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm min-h-[320px] flex flex-col"
  >
    <img
      src={getCardLogo(card.cardType)}
      alt={`${card.cardType} logo`}
      className="w-16 h-10 object-contain mb-4"
    />
    <CreditCard card={{ ...card, cardNumber: maskCardNumber(card.cardNumber) }} />

    <div className="mt-auto flex justify-between gap-3 pt-6 border-t border-gray-200">
      <button
        onClick={() => viewDetails(card)}
        className="flex-1 px-3 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
      >
        Details
      </button>
      <button
        onClick={() => openEdit(card)}
        className="flex-1 px-3 py-2 bg-yellow-400 text-black font-semibold rounded-lg shadow hover:bg-yellow-500 transition"
      >
        Edit
      </button>
      <button
        onClick={() => handleDelete(card.id)}
        className="flex-1 px-3 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition"
      >
        Delete
      </button>
    </div>
  </div>
))}

        </div>
      )}

      {showDetails && selectedCard && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-semibold mb-6 text-indigo-700 flex items-center gap-3">
              <img
                src={getCardLogo(selectedCard.cardType)}
                alt={`${selectedCard.cardType} logo`}
                className="w-12 h-7 object-contain"
              />
              Card Details
            </h3>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Card Number:</strong> {maskCardNumber(selectedCard.cardNumber)}
              </p>
              <p>
                <strong>Type:</strong> {selectedCard.cardType}
              </p>
              <p>
                <strong>Expiration:</strong>{" "}
                {new Date(selectedCard.expirationDate).toLocaleDateString()}
              </p>
              <p>
                <strong>CVV:</strong>{" "}
                {showCVV ? selectedCard.cvv : "•••"}{" "}
                <button
                  onClick={() => setShowCVV((prev) => !prev)}
                  className="text-indigo-600 ml-2 text-sm"
                >
                  {showCVV ? "Hide" : "Show"}
                </button>
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(selectedCard.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => setShowDetails(false)}
              className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {isEditing && editCard && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-semibold mb-6 text-indigo-700">Edit Card</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveEdit();
              }}
              className="space-y-5"
            >
              <div>
                <label className="block mb-1 font-medium">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={editCard.cardNumber}
                  onChange={handleEditChange}
                  maxLength={16}
                  minLength={13}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Expiration Date</label>
                <input
                  type="date"
                  name="expirationDate"
                  value={editCard.expirationDate.slice(0, 10)}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={editCard.cvv}
                  onChange={handleEditChange}
                  maxLength={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Card Type</label>
                <select
                  name="cardType"
                  value={editCard.cardType}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  {cardTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isChanged()}
                  className={`px-5 py-2 rounded-lg text-white ${
                    isChanged()
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
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

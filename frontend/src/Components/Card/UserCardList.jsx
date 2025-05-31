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


  useEffect(() => {
    // Don't redirect if userRole is undefined or null (maybe still loading)
    if (!role) return;

    if (role !== "Admin" || role !== "User") {
      navigate("/");
      return; // no need to set interval if redirecting immediately
    }

    const intervalId = setInterval(() => {
    if (role !== "Admin" || role !== "User") {
        navigate("/");
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [role, navigate]);

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
              <CreditCard card={{ ...card, cardNumber: maskCardNumber(card.cardNumber) }} />
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
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowDetails(false)}>
        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-3">
            <img
              src={getCardLogo(selectedCard.cardType)}
              alt={`${selectedCard.cardType} logo`}
              className="w-12 h-7 object-contain"
            />
            Card Details
          </h3>
          <div className="space-y-3 text-gray-700 text-base">
            <p><strong>Card Number:</strong> {maskCardNumber(selectedCard.cardNumber)}</p>
            <p><strong>Type:</strong> {selectedCard.cardType}</p>
            <p><strong>Expiration:</strong> {new Date(selectedCard.expirationDate).toLocaleDateString()}</p>
            <p>
              <strong>CVV:</strong> {showCVV ? selectedCard.cvv : "•••"}
              <button onClick={() => setShowCVV((prev) => !prev)} className="ml-2 text-indigo-600 text-sm">
                {showCVV ? "Hide" : "Show"}
              </button>
            </p>
            <p><strong>Created At:</strong> {new Date(selectedCard.createdAt).toLocaleString()}</p>
          </div>
          <button
            onClick={() => setShowDetails(false)}
            className="mt-6 w-full px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    )}

    {/* Edit Card Modal */}
    {isEditing && editCard && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setIsEditing(false)}>
        <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-2xl font-bold text-indigo-700 mb-6">Edit Card</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveEdit();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-1">Card Number</label>
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
              <label className="block text-sm font-medium mb-1">Expiration Date</label>
              <input
                type="date"
                name="expirationDate"
                value={editCard.expirationDate.slice(0, 10)}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">CVV</label>
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
              <label className="block text-sm font-medium mb-1">Card Type</label>
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

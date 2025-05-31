import React, { useEffect, useState } from "react";
import api from "../api";
import CreditCard from "./CreditCard"; // import your styled card component

const CardSelectorModal = ({ userId, showCardSelector, onClose, onSelectCard }) => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchUserCards = async () => {
      try {
        if (!userId) return; // guard clause

        const response = await api.get(`/Card/user/${userId}`);

        setCards(response.data || []);
      } catch (error) {
        console.error("Error fetching cards:", error);
        setCards([]); // clear on error for safety
      }
    };

    if (showCardSelector) {
      fetchUserCards();
    } else {
      setCards([]); // clear cards when modal is hidden
    }
  }, [showCardSelector, userId]);



  const maskCardNumber = (number) => {
  const clean = number.replace(/\D/g, ''); // Remove non-digit chars
  if (clean.length < 4) return clean;

  // First 4 digits shown, rest masked
  const firstFour = clean.slice(0, 4);
  // For simplicity mask rest as groups of **** (total 16 digits assumed)
  const masked = "**** **** ****";

  return `${firstFour} ${masked}`;
};


  if (!showCardSelector) return null;

 return (
<div className="bg-gray-100 bg-opacity-50 p-6 rounded-lg shadow-lg max-w-xl mx-auto">
    <h3 className="text-2xl font-bold text-center mb-6">
      Select a Card
    </h3>

    <p className="mb-6 text-gray-700 text-center">
      Which card do you want to use for placing this order?
    </p>

    {cards.length === 0 ? (
      <p className="text-gray-500 text-center">
        No cards available. Please add one first.
      </p>
    ) : (
      <div className="flex justify-center">
        <div className="flex space-x-6 overflow-x-auto pb-2">
  {cards.map((card) => (
    <div
      key={card.id}
      className="flex-shrink-0 cursor-pointer transform hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
      onClick={() => {
        onSelectCard(card.id);
        onClose();
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelectCard(card.id);
          onClose();
        }
      }}
    >
      <CreditCard
        card={{
          ...card,
          cardNumber: maskCardNumber(card.cardNumber),
        }}
      />
    </div>
  ))}
</div>




      </div>
    )}

    <button
      onClick={onClose}
      className="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 block mx-auto"
    >
      Cancel
    </button>
  </div>
);

};

export default CardSelectorModal;

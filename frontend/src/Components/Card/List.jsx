import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const CardList = () => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUsername = Cookies.get('username');
    if (storedUsername) {
      setIsLoggedIn(true);
      fetchCards();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch('http://localhost:5108/api/Card');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const text = await response.text();
      const data = text ? JSON.parse(text) : [];
      setCards(data);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  const deleteCard = async (id) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      const res = await fetch(`http://localhost:5108/api/Card/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setCards(cards.filter(c => c.id !== id));
      } else {
        alert('Failed to delete card.');
      }
    }
  };

  const handleEdit = (card) => {
    setSelectedCard(card);
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedCard(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    const res = await fetch(`http://localhost:5108/api/Card/${selectedCard.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedCard),
    });

    if (res.ok) {
      alert('Card updated!');
      setEditMode(false);
      fetchCards();
    } else {
      alert('Failed to update.');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-red-600 text-lg text-center">
          You must be logged in to see a cardlist and manage.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow">
      <h2 className="text-xl font-bold mb-4 text-center text-blue-600">All Cards</h2>

      {cards.length === 0 ? (
        <p className="text-gray-600 text-center">No cards available.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Card Number</th>
              <th className="p-2 border">Card Type</th>
              <th className="p-2 border">Expiration</th>
              <th className="p-2 border">CVV</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cards.map(card => (
              <tr key={card.id} className="text-center">
                <td className="p-2 border">{card.cardNumber}</td>
                <td className="p-2 border">{card.cardType}</td>
                <td className="p-2 border">{new Date(card.expirationDate).toLocaleDateString()}</td>
                <td className="p-2 border">{card.cvv}</td>
                <td className="p-2 border space-x-2">
                  <button
                    className="px-3 py-1 bg-yellow-400 text-white rounded"
                    onClick={() => handleEdit(card)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded"
                    onClick={() => deleteCard(card.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editMode && selectedCard && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Edit Card</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="cardNumber"
              value={selectedCard.cardNumber}
              onChange={handleInputChange}
              className="border p-2 rounded"
              placeholder="Card Number"
            />
            <input
              type="text"
              name="cvv"
              value={selectedCard.cvv}
              onChange={handleInputChange}
              className="border p-2 rounded"
              placeholder="CVV"
            />
            <input
              type="month"
              name="expirationDate"
              value={selectedCard.expirationDate.slice(0, 7)}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <select
              name="cardType"
              value={selectedCard.cardType}
              onChange={handleInputChange}
              className="border p-2 rounded"
            >
              <option value="Visa">Visa</option>
              <option value="MasterCard">MasterCard</option>
              <option value="American Express">American Express</option>
            </select>
          </div>
          <div className="mt-4">
            <button
              className="bg-green-600 text-white px-4 py-2 rounded mr-2"
              onClick={handleUpdate}
            >
              Update
            </button>
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardList;

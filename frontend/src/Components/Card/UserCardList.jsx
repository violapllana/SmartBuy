import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const UserCardList = () => {
  const [cards, setCards] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedCard, setSelectedCard] = useState(null);
  const [editCard, setEditCard] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const storedUsername = Cookies.get('username');
    if (storedUsername) {
      fetchUserId(storedUsername);
    } else {
      setLoading(false); // nuk ka user, mbaron ngarkimi
    }
  }, []);

  const fetchUserId = async (username) => {
    try {
      const res = await fetch(`http://localhost:5108/users/by-username?username=${username}`);
      if (!res.ok) throw new Error('Failed to fetch user ID');
      const data = await res.json();
      setUserId(data.id);
      fetchCards(data.id);
    } catch (err) {
      console.error('Failed to fetch user ID:', err);
      setLoading(false);
    }
  };

  const fetchCards = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5108/api/Card/user/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch cards');
      const data = await res.json();
      setCards(data);
    } catch (err) {
      console.error('Failed to fetch cards:', err);
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  // DELETE Card me konfirmim
  const handleDelete = async (cardId) => {
    const confirm = window.confirm('Are you sure you want to delete this card?');
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5108/api/Card/${cardId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete card');

      // Hiq kartën nga lista lokalisht
      setCards(cards.filter(card => card.id !== cardId));
    } catch (err) {
      alert('Error deleting card');
      console.error(err);
    }
  };

  // OPEN edit form
  const openEdit = (card) => {
    setEditCard({...card}); // klonojme kartën për editim
    setIsEditing(true);
  };

  // HANDLE CHANGE në form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditCard(prev => ({ ...prev, [name]: value }));
  };

  // SAVE edit
  const saveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:5108/api/Card/${editCard.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editCard)
      });

      if (!res.ok) throw new Error('Failed to update card');

      // Përditëso kartën në listë
      setCards(cards.map(card => card.id === editCard.id ? editCard : card));
      setIsEditing(false);
      setEditCard(null);
    } catch (err) {
      alert('Error updating card');
      console.error(err);
    }
  };

  // SHOW details
  const viewDetails = (card) => {
    setSelectedCard(card);
    setShowDetails(true);
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading cards...</p>;
  }

  if (!userId) {
    return <p className="text-center text-red-500">User not found or not logged in.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-center mb-4 text-blue-700">Your Credit Cards</h2>

      {cards.length === 0 ? (
        <p className="text-center text-gray-500">No cards found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {cards.map((card) => (
            <div key={card.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <p><strong>Card Number:</strong> {card.cardNumber}</p>
              <p><strong>Type:</strong> {card.cardType}</p>
              <p><strong>Expiration:</strong> {new Date(card.expirationDate).toLocaleDateString()}</p>
              <p><strong>CVV:</strong> {card.cvv}</p>

              <div className="mt-4 flex gap-2">
                <button onClick={() => viewDetails(card)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Details</button>
                <button onClick={() => openEdit(card)} className="px-3 py-1 bg-yellow-400 text-black rounded hover:bg-yellow-500">Edit</button>
                <button onClick={() => handleDelete(card.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal për Details */}
      {showDetails && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            <button onClick={() => setShowDetails(false)} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-xl">&times;</button>
            <h3 className="text-xl font-bold mb-4">Card Details</h3>
            <p><strong>Card Number:</strong> {selectedCard.cardNumber}</p>
            <p><strong>Type:</strong> {selectedCard.cardType}</p>
            <p><strong>Expiration:</strong> {new Date(selectedCard.expirationDate).toLocaleDateString()}</p>
            <p><strong>CVV:</strong> {selectedCard.cvv}</p>
            <p><strong>Created At:</strong> {new Date(selectedCard.createdAt).toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Modal për Edit */}
      {isEditing && editCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            <button onClick={() => setIsEditing(false)} className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-xl">&times;</button>
            <h3 className="text-xl font-bold mb-4">Edit Card</h3>

            <label className="block mb-2">
              Card Number:
              <input
                type="text"
                name="cardNumber"
                value={editCard.cardNumber}
                onChange={handleEditChange}
                className="border rounded w-full p-2"
                maxLength={16}
                minLength={13}
              />
            </label>

            <label className="block mb-2">
              Expiration Date:
              <input
                type="date"
                name="expirationDate"
                value={editCard.expirationDate.slice(0,10)}
                onChange={handleEditChange}
                className="border rounded w-full p-2"
              />
            </label>

            <label className="block mb-2">
              CVV:
              <input
                type="text"
                name="cvv"
                value={editCard.cvv}
                onChange={handleEditChange}
                className="border rounded w-full p-2"
                maxLength={3}
              />
            </label>

            <label className="block mb-2">
              Card Type:
              <input
                type="text"
                name="cardType"
                value={editCard.cardType}
                onChange={handleEditChange}
                className="border rounded w-full p-2"
              />
            </label>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
              <button onClick={saveEdit} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCardList;

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const AddCard = () => {
  const [cardData, setCardData] = useState({
    cardNumber: '',
    CVV: '',
    cardType: '',
    userId: '',
    expirationDate: '',  
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUsername = Cookies.get('username');
    if (storedUsername) {
      setIsLoggedIn(true);
      fetchUserIdFromUsername(storedUsername); 
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const fetchUserIdFromUsername = async (username) => {
    try {
      const response = await fetch(`http://localhost:5108/users/by-username?username=${username}`);
      if (!response.ok) {
        throw new Error('User not found!');
      }
      const data = await response.json();
      setCardData(prev => ({
        ...prev,
        userId: data.id, 
      }));
    } catch (error) {
      console.error('Error fetching userId:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardData({ ...cardData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const key in cardData) {
      if (!cardData[key]) {
        alert(`Please fill in the ${key} field.`);
        return;
      }
    }

    try {
      const payload = {
        CardNumber: cardData.cardNumber,
        ExpirationDate: new Date(cardData.expirationDate),  
        CVV: cardData.CVV,
        CardType: cardData.cardType,
        UserId: cardData.userId,
      };

      const res = await fetch('http://localhost:5108/api/Card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (res.ok) {
        setSuccessMessage('Card created successfully!');
        setCardData({
          cardNumber: '',
          CVV: '',
          cardType: '',
          userId: cardData.userId,
          expirationDate: '',
        });
      } else {
        alert('Failed to add card.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong.');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">You must be logged in to add a card.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-xl w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-blue-600">SmartBuy</h1>
          <div className="bg-gray-100 text-gray-700 mt-4 p-3 rounded-md">
            <h2 className="text-lg font-medium">Credit Card Payment Form</h2>
            <p className="text-sm">Add your information below to pay by credit card.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Card Number*</label>
            <input
              type="text"
              name="cardNumber"
              value={cardData.cardNumber}
              onChange={handleChange}
              required
              minLength={13}
              maxLength={16}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter card number"
            />
          </div>

          {/* Expiration Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Expiration Date*</label>
            <input
              type="month"              
              name="expirationDate"
              value={cardData.expirationDate}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* CVV */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">CVV*</label>
            <input
              type="text"
              name="CVV"
              value={cardData.CVV}
              onChange={handleChange}
              required
              maxLength={3}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="CVV"
            />
          </div>

          {/* Card Type */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Card Type*</label>
            <select
              name="cardType"
              value={cardData.cardType}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select type</option>
              <option value="Visa">Visa</option>
              <option value="MasterCard">MasterCard</option>
              <option value="American Express">American Express</option>
            </select>
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300">
            Submit
          </button>
        </form>

        {/* Success Message */}
        {successMessage && (
          <p className="mt-4 text-green-600 text-center font-medium">{successMessage}</p>
        )}
      </div>
    </div>
  );
};

export default AddCard;

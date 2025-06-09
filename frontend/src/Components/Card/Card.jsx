import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe outside component to avoid recreating on every render
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const AddCardForm = ({ userId }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [successMessage, setSuccessMessage] = useState('');

  const [loading, setLoading] = useState(false);

  console.log('Stripe key:', process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!stripe || !elements) {
    alert('Stripe.js has not loaded yet.');
    return;
  }

  setLoading(true);

  const cardElement = elements.getElement(CardElement);

  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
  });

  if (error) {
    alert(error.message);
    setLoading(false);
    return;
  }

  // Get the card brand from paymentMethod.card.brand
  const brand = paymentMethod.card.brand; // e.g. "mastercard"
  
  // Format brand with first letter uppercase, rest lowercase (if needed)
  const formattedCardType = brand.charAt(0).toUpperCase() + brand.slice(1);

  const payload = {
    cardType: formattedCardType,               // note lowercase "cardType"
    stripePaymentMethodId: paymentMethod.id,
    userId,
  };

  try {
    const res = await fetch('http://localhost:5108/api/Card', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    if (res.ok) {
      setSuccessMessage('Card created successfully!');
      elements.getElement(CardElement).clear();
    } else {
      const errorText = await res.text();
      alert('Failed to add card: ' + errorText);
    }
  } catch (err) {
    console.error(err);
    alert('Something went wrong.');
  }

  setLoading(false);
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Stripe Card Input */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Card Details*</label>
        <div className="p-3 border border-gray-300 rounded-md bg-white">
          <CardElement options={{hidePostalCode: true}} />
        </div>
      </div>

     

     

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300"
      >
        {loading ? 'Processing...' : 'Submit'}
      </button>

      {/* Success Message */}
      {successMessage && (
        <p className="mt-4 text-green-600 text-center font-medium">{successMessage}</p>
      )}
    </form>
  );
};

const AddCard = () => {
  const [userId, setUserId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const username = Cookies.get('username');
    if (username) {
      setIsLoggedIn(true);
      fetchUserIdFromUsername(username);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const fetchUserIdFromUsername = async (username) => {
    try {
      const response = await fetch(`http://localhost:5108/users/by-username?username=${username}`);
      if (!response.ok) throw new Error('User not found!');
      const data = await response.json();
      setUserId(data.id);
    } catch (error) {
      console.error('Error fetching userId:', error);
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

<Elements stripe={stripePromise}>
      <AddCardForm userId={userId} />
    </Elements>
      </div>
    </div>
  );
};

export default AddCard;

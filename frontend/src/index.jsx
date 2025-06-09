import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MessageProvider } from './Contexts/MessageContext';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Load Stripe using your publishable key from env
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Get userId from localStorage or elsewhere
const userId = localStorage.getItem("userId");

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MessageProvider userId={userId}>
    <Elements stripe={stripePromise}>
      <App />
    </Elements>
  </MessageProvider>
);

reportWebVitals();

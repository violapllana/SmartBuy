import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MessageProvider } from './Contexts/MessageContext'; // Import the provider

// Get the userId from localStorage (or use another method to get the logged-in user)
const userId = localStorage.getItem("userId");  // Replace this if you're getting it elsewhere

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <MessageProvider userId={userId}>  {/* Wrap your app with the provider */}
    <App />
  </MessageProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

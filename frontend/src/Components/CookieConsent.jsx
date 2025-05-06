import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const consent = Cookies.get('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set('cookieConsent', 'accepted', { expires: 365 });
    setIsExiting(true);
    setTimeout(() => setIsVisible(false), 1000); // Matches the exit animation duration
  };

  const handleDecline = () => {
    Cookies.set('cookieConsent', 'declined', { expires: 365 });
    setIsExiting(true);
    setTimeout(() => setIsVisible(false), 1000); // Matches the exit animation duration
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 right-0 m-6 max-w-md w-full bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 text-white rounded-2xl p-6 shadow-2xl z-50 
        ${isExiting ? 'animate-snakeOut' : 'animate-snake'} `}
    >
      <h2 className="text-2xl font-bold mb-2">We Value Your Privacy</h2>
      <p className="text-sm mb-4">
        Our site uses cookies to enhance your experience. Click "Accept" to agree, or "Decline" to opt out.
      </p>
      <div className="flex justify-end gap-4">
        <Button onClick={handleDecline} variant="outline">
          Decline
        </Button>
        <Button onClick={handleAccept} variant="solid">
          Accept
        </Button>
      </div>
    </div>
  );
};

const Button = ({ onClick, variant, children }) => {
  const base =
    'px-5 py-2 rounded-full font-semibold transition-transform duration-300 hover:scale-110 focus:outline-none';
  const styles = {
    solid: 'bg-white text-green-700 hover:bg-gray-100',
    outline: 'border border-white text-white hover:bg-white hover:text-green-700',
  };
  return (
    <button onClick={onClick} className={`${base} ${styles[variant]}`}>
      {children}
    </button>
  );
};

export default CookieConsent;

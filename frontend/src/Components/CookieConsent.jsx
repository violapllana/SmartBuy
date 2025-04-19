import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Check if consent cookie exists
  useEffect(() => {
    const consent = Cookies.get('cookieConsent');
    if (consent === undefined) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, []);

  // Handle accepting the cookies
  const handleAccept = () => {
    Cookies.set('cookieConsent', 'accepted', { expires: 365 });
    setIsVisible(false);
  };

  // Handle declining the cookies
  const handleDecline = () => {
    Cookies.set('cookieConsent', 'declined', { expires: 365 });
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full py-12 px-10 shadow-xl z-50"
         style={{
           background: "linear-gradient(to right, rgba(106, 13, 173, 0.8), rgba(244, 114, 182, 0.8), rgba(239, 68, 68, 0.8))", // Transparent gradient
         }}>
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-6 sm:space-y-0 sm:space-x-8">
        <div className="text-center sm:text-left">
          <h2 className="text-3xl sm:text-4xl font-semibold mb-4">Përdorim Cookies për Përmirësimin e Përvojës Tuaj</h2>
          <p className="text-lg sm:text-xl mb-6">
            Faqja jonë përdor cookies për të përmirësuar përvojën tuaj. Duke vazhduar të vizitoni këtë faqe, pajtoheni me përdorimin e cookies.
          </p>
        </div>
        <div className="flex space-x-4 justify-center sm:justify-start">
          <Button onClick={handleAccept} color="purple">Prano</Button>
          <Button onClick={handleDecline} color="red">Refuzo</Button>
        </div>
      </div>
    </div>
  );
};

// Button Component
const Button = ({ onClick, color, children }) => {
  const colorClasses = {
    purple: 'bg-purple-500 hover:bg-purple-600',
    red: 'bg-red-500 hover:bg-red-600',
  };

  return (
    <button
      onClick={onClick}
      className={`text-white py-4 px-10 rounded-full text-lg shadow-lg transition-all duration-300 transform hover:scale-110 ${colorClasses[color]}`}
    >
      {children}
    </button>
  );
};

export default CookieConsent;

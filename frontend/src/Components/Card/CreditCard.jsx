import React, { useEffect } from "react";

// Logos (same as before)
const VisaLogo = () => (
  <svg width="48" height="20" viewBox="0 0 48 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill="#1A1F71" d="M0 0h48v20H0z" fillOpacity="0" />
    <path d="M10.73 14.9h-2.45l2.1-9.8h2.46l-2.1 9.8zM17.7 14.9h-2.5l1.1-5.3-2.55-4.5h2.7l1.2 4.3 1.3-4.3h2.5l-3 9.8h-2.55zM30.5 14.9h-2.9l-2.2-4.3-1 2.5-1.5 1.8-3.7-9.8h3.1l2.2 5.3 1-2.5 1.4-1.8h3l-3.4 7.5z" fill="#1A1F71" />
  </svg>
);

const MasterCardLogo = () => (
  <svg width="48" height="20" viewBox="0 0 48 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="10" r="8" fill="#EB001B" />
    <circle cx="30" cy="10" r="8" fill="#F79E1B" />
    <path d="M23 10a7.996 7.996 0 01-5.2 7.4 8.04 8.04 0 0010.4-14.8A7.996 7.996 0 0123 10z" fill="#FF5F00" />
  </svg>
);

const AmexLogo = () => (
  <svg width="48" height="20" viewBox="0 0 48 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="20" fill="#2E77BC" rx="3" />
    <text x="24" y="15" fill="white" fontSize="12" fontWeight="700" fontFamily="Arial, sans-serif" textAnchor="middle">AMEX</text>
  </svg>
);

const getCardLogo = (type) => {
  switch ((type || "").toLowerCase()) {
    case "visa":
      return <VisaLogo />;
    case "mastercard":
      return <MasterCardLogo />;
    case "amex":
    case "american express":
      return <AmexLogo />;
    default:
      return null;
  }
};

const getDefaultGradient = (type) => {
  switch ((type || "").toLowerCase()) {
    case "visa":
      return "from-blue-600 via-blue-800 to-indigo-900";
    case "mastercard":
      return "from-yellow-500 via-red-500 to-pink-600";
    case "amex":
      return "from-cyan-600 via-blue-700 to-blue-900";
    default:
      return "from-gray-700 via-gray-800 to-gray-900";
  }
};

const CreditCard = ({ card }) => {
  useEffect(() => {
    console.log("Card prop received:", card);

    const cardGradient = card.gradient || getDefaultGradient(card.cardType);
    console.log("Using gradient:", cardGradient);

    const maskedNumber = `**** **** **** ${card.last4 || "0000"}`;
    console.log("Masked card number:", maskedNumber);

    const expMonth = card.expMonth?.toString().padStart(2, "0") || "00";
    const expYear = card.expYear ? card.expYear.toString().slice(-2) : "00";
    console.log("Expiration:", expMonth + "/" + expYear);
  }, [card]);

  const cardGradient = card.gradient || getDefaultGradient(card.cardType);
  const maskedNumber = `**** **** **** ${card.last4 || "0000"}`;
  const expMonth = card.expMonth?.toString().padStart(2, "0") || "00";
  const expYear = card.expYear ? card.expYear.toString().slice(-2) : "00";

  return (
    <div
      className={`
        w-80 h-48 p-6 rounded-xl shadow-2xl text-white overflow-hidden
        flex flex-col justify-between relative font-sans
        bg-gradient-to-r ${cardGradient}
      `}
    >
      {/* Chip */}
      <div className="absolute top-6 left-6 w-12 h-9 bg-yellow-400 rounded-md shadow-md flex items-center justify-center">
        <div className="w-8 h-6 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-sm" />
      </div>

      {/* Logo */}
      <div className="absolute top-6 right-6">{getCardLogo(card.cardType)}</div>

      {/* Card number */}
      <div className="mt-12 font-mono text-xl tracking-widest break-words select-none">
        {maskedNumber}
      </div>

      {/* Cardholder name */}
      {card.cardholderName && (
        <div className="uppercase text-sm tracking-widest mt-2 select-none">
          {card.cardholderName}
        </div>
      )}

      {/* Expiration */}
      <div className="flex justify-between text-sm mt-6 select-none">
        <div>
          <span className="block text-gray-300 text-xs">Expires</span>
          {`${expMonth}/${expYear}`}
        </div>
      </div>
    </div>
  );
};

export default CreditCard;

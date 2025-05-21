import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomNotification = ({ message, onClose }) => {
  const [jumping, setJumping] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const jumpTimer = setInterval(() => {
      setJumping(prev => !prev);
    }, 5000);

    return () => clearInterval(jumpTimer);
  }, []);

  const handleClick = () => {
    navigate('/chatcomponent');
    if (onClose) onClose();
  };

  return (
    <div
      onClick={handleClick}
      className={`fixed bottom-5 left-5 flex items-center gap-4 px-8 py-5 bg-gradient-to-r from-green-600 via-green-500 to-yellow-300 text-white font-semibold text-lg rounded-xl shadow-2xl cursor-pointer transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-xl hover:rounded-2xl ${jumping ? 'animate-[bounce_1s_ease-in-out]' : ''} z-50 max-w-md w-full`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="yellow"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
        />
      </svg>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default CustomNotification;

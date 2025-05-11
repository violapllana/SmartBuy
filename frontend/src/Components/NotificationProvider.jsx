// NotificationContext.js
import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  const triggerNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 5000); // Clear after 5 seconds
  };

  return (
    <NotificationContext.Provider value={{ notification, triggerNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

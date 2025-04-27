// AdminNotificationBar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminNotificationBar = ({ startChatWithUser }) => {
  const [notifications, setNotifications] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);  // To check if the user is an admin

  // Fetch notifications when the component loads
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('/api/chat/GetNotificationsForAdmin');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    // Check if user is an admin (can be done via the backend or localStorage/localState)
    const role = localStorage.getItem('role');  // Or get this from your auth state
    if (role === 'Admin') {
      setIsAdmin(true);
      fetchNotifications();  // Fetch notifications for Admin
    }
  }, []); // Empty dependency array ensures it runs only once

  // Handle click event to start a chat with the selected user
  const handleNotificationClick = (userId, notificationId) => {
    startChatWithUser(userId, notificationId);
  };

  return (
    isAdmin && (
      <div className="fixed top-0 left-0 w-full bg-yellow-400 text-gray-800 p-4 z-50 shadow-lg">
        <div className="space-y-2">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-yellow-500 p-2 rounded-md cursor-pointer hover:bg-yellow-600"
                onClick={() => handleNotificationClick(notification.userId, notification.id)}
              >
                New message from User {notification.userId}
              </div>
            ))
          ) : (
            <p className="text-center text-lg">No new messages</p>
          )}
        </div>
      </div>
    )
  );
};

export default AdminNotificationBar;

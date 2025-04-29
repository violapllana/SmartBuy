import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import navigate

function NotificationBar({ username }) {
  const [unreadMessages, setUnreadMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();  // Initialize navigate

  const fetchUserId = useCallback(async () => {
    if (username) {
      try {
        const response = await axios.get(`http://localhost:5108/users/by-username?username=${username}`);
        if (response.data?.id) {
          setUserId(response.data.id);
        } else {
          console.error('User ID not found');
          setUserId('');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
        setUserId('');
      }
    }
  }, [username]);

  useEffect(() => {
    setUnreadMessages([]);
    setLoading(true);
    fetchUserId();
  }, [username, fetchUserId]);

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5108/api/Chat/unread/${userId}`);
        if (response.status === 200) {
          setUnreadMessages(response.data);
        } else {
          setUnreadMessages([]);
        }
      } catch (error) {
        if (error.response && error.response.status === 204) {
          setUnreadMessages([]);
        } else {
          console.error('Error fetching unread notifications:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUnreadMessages();
    }
  }, [userId]);

  // This is the function that handles the click on a notification
  const handleNotificationClick = (senderId) => {
    // Log the userId and senderId to check which one is which
    console.log('Logged in userId:', userId);  // this is the logged-in user
    console.log('Notification senderId:', senderId);  // this is the user who sent the message
  
    // If the senderId (the one who sent the message) is the same as the logged-in userId, prevent chat
    if (senderId === userId) {
      console.error('Cannot chat with yourself!');
      return;  // Prevent navigation
    }
  
    // Navigate to the chat page using the logged-in userId and the senderId
    navigate(`/chat/${userId}/${senderId}`);
  };
  
  return (
    <div className="bg-white shadow-md rounded p-4 mb-4">
      <h2 className="text-lg font-semibold mb-2">Unread Messages</h2>
      {loading ? (
        <p>Loading...</p>
      ) : unreadMessages.length === 0 ? (
        <p className="text-gray-500">No unread messages.</p>
      ) : (
        <ul className="space-y-2">
          {[...unreadMessages].reverse().map((message) => (
            <li
              key={message.id}
              className="border-b pb-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
              onClick={() => handleNotificationClick(message.userId)}  // <-- Use message.userId (sender) here
            >
              <p className="text-sm text-gray-800">{message.messageContent}</p>
              <p className="text-xs text-gray-400">{new Date(message.sentAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  
}

export default NotificationBar;

import React, { useEffect, useState, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import logo from "../Images/SmartBuyLogo.webp";
import api from '../Components/api';
import axios from 'axios';

const Contact = ({ username, role }) => {
  const [connection, setConnection] = useState(null);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState([]); // List of all users (for admin)
  const [selectedUserId, setSelectedUserId] = useState(''); // Admin selects user

  // Fetch your own user ID
  const fetchUserId = useCallback(async () => {
    if (username) {
      try {
        const response = await axios.get(`http://localhost:5108/users/by-username?username=${username}`);
        if (response.data?.id) {
          setUserId(response.data.id);
        } else {
          console.error('User ID not found');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    }
  }, [username]);

  // Fetch list of users (only if Admin)
  const fetchUsers = useCallback(async () => {
    if (role === "Admin") {
      try {
        const response = await axios.get('http://localhost:5108/users');
        if (response.data && Array.isArray(response.data)) {
          setUsers(response.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  }, [role]);

  // Fetch chat messages
  const fetchMessages = useCallback(async () => {
    if (!userId) return;
    try {
      let response;

      if (role === "Admin" && selectedUserId) {
        response = await api.get(`/Chat/GetMessagesWithUser/${selectedUserId}`);
      } else {
        response = await api.get(`/Chat/GetMessagesWithAdmin`);
      }

      setChat(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [role, selectedUserId, userId]);

  // Initialize SignalR
  useEffect(() => {
    const connect = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5108/chatHub", { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    connect
      .start()
      .then(() => {
        console.log('Connected to SignalR');
        setConnection(connect);

        connect.on("ReceiveMessage", (senderId, receiverId, messageContent) => {
          // If the message involves the current user
          if (senderId === userId || receiverId === userId) {
            setChat(prev => [...prev, { senderId, receiverId, messageContent }]);
          }
        });

      })
      .catch(error => console.error('Connection failed:', error));
  }, [userId]);

  // Send a message
  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      if (role === "Admin" && selectedUserId) {
        await connection.invoke("SendMessageAsync", userId, selectedUserId, message);
      } else {
        // Normal user sends to all admins
        const adminsResponse = await axios.get('http://localhost:5108/users/admins');
        const adminList = adminsResponse.data;

        for (const admin of adminList) {
          await connection.invoke("SendMessageAsync", userId, admin.id, message);
        }
      }
      setMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchUserId();
    fetchUsers();
  }, [fetchUserId, fetchUsers]);

  useEffect(() => {
    if (userId) {
      fetchMessages();
    }
  }, [userId, selectedUserId, fetchMessages]);

  return (
    <div className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 min-h-screen flex flex-col items-center py-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-6">Contact Us</h2>

        {role === "Admin" && (
          <div className="mb-4">
            <h3 className="font-semibold text-green-700 mb-2">Select a User to Chat</h3>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="border p-2 rounded-lg"
            >
              <option value="">-- Select a User --</option>
              {users
                .filter(u => u.role === "User")
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
            </select>
          </div>
        )}

        <div className="overflow-y-auto h-64 mb-4 p-4 bg-gray-50 rounded-xl shadow-md">
          {chat.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'} mb-3`}>
              <div className="flex items-center space-x-3">
                {msg.senderId === userId ? (
                  <FontAwesomeIcon icon={faUser} size="2x" className="text-blue-600" />
                ) : (
                  <img src={logo} alt="Profile" className="w-10 h-10 rounded-full" />
                )}
                <div className={`p-3 rounded-lg text-sm max-w-xs ${msg.senderId === userId ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                  <span>{msg.messageContent}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type your message"
            className="flex-1 p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;

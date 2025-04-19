import React, { useEffect, useState, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import logo from "../Images/SmartBuyLogo.webp";

const Contact = ({ username, role }) => {
  const [connection, setConnection] = useState(null);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [userId, setUserId] = useState('');
  const [adminIds, setAdminIds] = useState([]);

  // Fetch user ID by username
  const fetchUserId = useCallback(async () => {
    if (username) {
      try {
        const response = await axios.get(`http://localhost:5108/users/by-username?username=${username}`);
        if (response.data && response.data.id) {
          setUserId(response.data.id);
        } else {
          console.error('User ID not found');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    }
  }, [username]);

  // Fetch messages and filter for the current user
  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5108/api/Chat/GetMessages');
      const filteredMessages = response.data.filter(msg =>
        msg.senderId === userId || msg.receiverId === userId
      );
      setChat(filteredMessages);
    } catch (e) {
      console.error("❌ Error fetching messages: ", e);
    }
  }, [userId]);

  // Initialize SignalR connection
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5108/chatHub", { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("✅ Connected to SignalR");
        setConnection(newConnection);

        newConnection.off("ReceiveMessage");
        newConnection.on("ReceiveMessage", (senderId, receiverId, messageContent) => {
          if (senderId !== userId) {
            setChat(prev => [...prev, { senderId, messageContent }]);
          }
        });
      })
      .catch(e => console.log("❌ Connection failed: ", e));
  }, [userId]);

  // Send message to all admins
  const sendMessage = async () => {
    if (!connection || connection.state !== "Connected" || !userId) {
      alert("⚠️ No connection to server yet.");
      return;
    }

    try {
      let finalAdminIds = adminIds;

      if (finalAdminIds.length === 0) {
        console.log("⚠️ Admin IDs are empty. Fetching...");
        const response = await axios.get('http://localhost:5108/users/admins');
        finalAdminIds = response.data.map(admin => admin.id);
        setAdminIds(finalAdminIds);
      }

      if (finalAdminIds.length === 0) {
        console.log("⚠️ Still no admin IDs found.");
        return;
      }

      for (const adminId of finalAdminIds) {
        console.log(`📤 Sending message to admin ID: ${adminId}`);
        await connection.invoke("SendMessage", userId, adminId, message);
      }

      setMessage('');
      fetchMessages();

    } catch (e) {
      console.error("❌ Send failed: ", e);
    }
  };

  // Fetch messages and userId when component mounts
  useEffect(() => {
    fetchMessages();
    fetchUserId();
  }, [fetchMessages, fetchUserId]);

  return (
    <div className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 min-h-screen flex flex-col items-center py-6">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center text-green-600 mb-6">Contact Us</h2>
        
        <div className="overflow-y-auto h-64 mb-4 p-4 bg-gray-50 rounded-xl shadow-md">
          {chat.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'} mb-3`}>
              <div className={`flex items-center space-x-3 ${msg.senderId === userId ? 'text-right' : ''}`}>
                {msg.senderId === userId ? (
                  <FontAwesomeIcon icon={faUser} size="2x" className="text-blue-600" />
                ) : (
                  <img src={logo} alt="Admin" className="w-10 h-10 rounded-full" />
                )}
                <div className={`p-3 rounded-lg text-sm max-w-xs ${msg.senderId === userId ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                  <span>{msg.messageContent}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-3 mb-4">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type your message"
            className="flex-1 p-3 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button 
            onClick={sendMessage} 
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out flex items-center"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;

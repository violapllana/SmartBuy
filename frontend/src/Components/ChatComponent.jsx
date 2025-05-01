import { HubConnectionBuilder } from "@microsoft/signalr";
import Cookies from "js-cookie";
import { useEffect, useState, useCallback } from "react";
import api from "./api";
import { FaRegUser, FaCommentDots, FaPaperPlane } from "react-icons/fa"; // Import icons
import logo from "../Images/SmartBuyLogo.webp"; // Ensure this is the correct path

const ChatComponent = ({ username }) => {  // Add `role` prop
  const [connection, setConnection] = useState(null);
  const [userId, setUserId] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [receiverUsername, setReceiverUsername] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [uniqueSenders, setUniqueSenders] = useState([]);
  const [senderUsernames, setSenderUsernames] = useState({});
  const [role, setRole] = useState('');

  const fetchUserId = useCallback(async () => {
    if (!username) return;
    try {
      const res = await api.get(`http://localhost:5108/users/by-username?username=${username}`);
      setUserId(res.data.id);
    } catch (err) {
      console.error("Failed to fetch user ID", err);
    }
  }, [username]);

  const fetchUserRole = useCallback(async () => {
    try {
      const thisrole = Cookies.get("role");
      setRole(thisrole);
      console.log("Your role is: " + role);
    } catch (err) {
      console.error("Failed to fetch user role", err);

    }
  }, [role])

  const fetchMessages = useCallback(async () => {
    if (!userId) return;

    try {
      const res = await api.get(`http://localhost:5108/api/Chat/GetMessagesByReceiver/${userId}`);
      const messages = res.data;
      setAllMessages(messages);
      const senders = [...new Set(messages.map(m => m.userId))];
      setUniqueSenders(senders);

      const usernameMap = {};
      await Promise.all(
        senders.map(async (senderId) => {
          try {
            const userRes = await api.get(`http://localhost:5108/users/getusernamefromid/${senderId}`);
            usernameMap[senderId] = userRes.data;
          } catch (err) {
            console.error(`Failed to fetch username for ${senderId}`, err);
          }
        })
      );
      setSenderUsernames(usernameMap);
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  }, [userId]);

  const fetchChatMessages = useCallback(async () => {
    if (!userId || !receiverId) return;

    try {
      const res = await api.get(`http://localhost:5108/api/Chat/GetMessagesAsync?userId=${userId}&otherUserId=${receiverId}`);
      setChatMessages(res.data);
    } catch (err) {
      console.error("Failed to fetch chat messages", err);
    }
  }, [userId, receiverId]);

  const fetchReceiverUsername = useCallback(async () => {
    if (!receiverId) return;
    try {
      const res = await api.get(`http://localhost:5108/users/getusernamefromid/${receiverId}`);
      setReceiverUsername(res.data);
    } catch (err) {
      console.error("Failed to fetch receiver username", err);
    }
  }, [receiverId]);

  useEffect(() => {
    const filtered = allMessages.filter(
      m => (m.userId === receiverId && m.receiverId === userId) ||
           (m.userId === userId && m.receiverId === receiverId)
    );
    setChatMessages(filtered);
  }, [receiverId, allMessages, userId]);

  useEffect(() => {
    if (!userId) return;

    const newConnection = new HubConnectionBuilder()
      .withUrl(`http://localhost:5108/chathub?userId=${userId}`, {
        accessTokenFactory: () => Cookies.get("accessToken")
      })
      .withAutomaticReconnect()
      .build();

    newConnection.start()
      .then(() => {
        console.log("Connected to SignalR");
        newConnection.on("ReceiveMessage", (senderName, message) => {
          const newMsg = {
            id: Date.now(),
            userId: senderName,
            receiverId: userId,
            messageContent: message,
            sentAt: new Date().toISOString()
          };

          setChatMessages(prev => [...prev, newMsg]);
          setAllMessages(prev => [...prev, newMsg]);
        });
      })
      .catch(err => console.error("SignalR error:", err));

    setConnection(newConnection);

    return () => {
      if (newConnection) {
        newConnection.stop().catch(err => console.error("Error stopping SignalR connection", err));
      }
    };
  }, [userId]);

  const sendMessage = async () => {
    if (!connection || !messageInput || !receiverId) return;

    try {
      await connection.invoke("SendPrivateMessage", receiverId, userId, messageInput);
      const newMsg = {
        id: Date.now(),
        userId: userId,
        receiverId: receiverId,
        messageContent: messageInput,
        sentAt: new Date().toISOString()
      };

      setChatMessages(prev => [...prev, newMsg]);
      setMessageInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };
  useEffect(() => {
    fetchUserRole();
  }, [fetchUserRole]);

  useEffect(() => {
    fetchUserId();
  }, [fetchUserId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    fetchReceiverUsername();
  }, [receiverId, fetchReceiverUsername]);

  useEffect(() => {
    fetchChatMessages();
  }, [fetchChatMessages]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-1/3 bg-green-600 text-white p-6 overflow-y-auto">
        <h3 className="text-2xl font-bold mb-6">Messages</h3>
        <div className="flex items-center mb-6">
        {role === "Admin" ? (
  <span className="flex items-center">
    <img 
      src={logo} 
      alt="Logo" 
      className="w-10 h-10 object-contain rounded-full mr-2" 
    />
    <span className="text-xl font-mono">{username} [Admin]</span>
  </span>
) : (
  <span className="flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-500 mr-2">
  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
</svg>

    <span className="text-xl font-mono">{username}</span>
  </span>
)}


        </div>
        <ul className="space-y-4">
          {uniqueSenders.map(sender => (
            <li
              key={sender}
              onClick={() => setReceiverId(sender)}
              className="cursor-pointer hover:bg-green-700 rounded-md p-3 flex items-center space-x-3 transition"
            >
              <FaRegUser className="text-xl" />
              <span>{senderUsernames[sender] || sender}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="w-2/3 bg-white p-6 flex flex-col">
        {receiverId ? (
          <>
            <h4 className="text-3xl font-semibold mb-6 text-green-700">Chat with {receiverUsername}</h4>
            <div className="flex-1 overflow-y-auto mb-6 border border-gray-300 rounded-lg p-6 bg-gray-50">
              <div className="space-y-4">
              {chatMessages.map((msg, i) => (
  <div key={i} className={`text-sm ${msg.userId === userId ? 'text-right' : 'text-left'}`} style={{ display: 'flex', alignItems: 'center', justifyContent: msg.userId === userId ? 'flex-end' : 'flex-start' }}>
    <p style={{ marginRight: msg.userId === userId ? '20px' : '0', marginLeft: msg.userId !== userId ? '10px' : '0', display: 'flex', alignItems: 'center' }}>
      {msg.userId === userId ? (
        // If the message is from the logged-in user, show "You" or the Admin logo if the role is Admin
        <>
          {role === "Admin" ? (
            <img 
              src={logo} 
              alt="Admin Logo" 
              style={{
                width: "35px", // Size of the logo
                height: "35px", 
                borderRadius: "50%", // Circle shape
                border: "3px solid #4CAF50", // Green border for a cool effect
                marginRight: "15px", // More space to the right
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Adding a subtle shadow for depth
                verticalAlign: 'middle'
              }} 
            />
          ) : (
            <strong>You:</strong>
          )}
        </>
      ) : (
        // If the message is from the other user, show the receiver's username
        <strong>{receiverUsername}:</strong>
      )}
      {msg.messageContent}
    </p>
  </div>
))}

              </div>
            </div>

            {/* Message Input */}
            <div className="flex items-center space-x-4 mt-6">
              <input
                type="text"
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                placeholder="Type your message"
                className="flex-1 border border-green-600 rounded-lg p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={sendMessage}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center space-x-2 transition"
              >
                <FaPaperPlane className="text-lg" />
                <span>Send</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500">
            <FaCommentDots className="text-5xl mb-4" />
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;

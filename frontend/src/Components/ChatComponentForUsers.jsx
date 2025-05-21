import { HubConnectionBuilder } from "@microsoft/signalr";
import Cookies from "js-cookie";
import { useEffect, useState, useCallback } from "react";
import api from "./api";
import { FaPaperPlane } from "react-icons/fa";
import logo from "../Images/SmartBuyLogo.webp";

const ChatComponentForUsers = ({ username }) => {
  const [connection, setConnection] = useState(null);
  const [userId, setUserId] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [adminIds, setAdminIds] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  const fetchUserId = useCallback(async () => {
    if (!username) return;
    try {
      const res = await api.get(`http://localhost:5108/users/by-username?username=${username}`);
      setUserId(res.data.id);
    } catch (err) {
      console.error("Failed to fetch user ID", err);
    }
  }, [username]);

  const fetchAdminIds = useCallback(async () => {
    try {
      const res = await api.get('http://localhost:5108/users/admins');
      const ids = res.data.map(admin => admin.id);
      setAdminIds(ids);
    } catch (err) {
      console.error("Failed to fetch admin IDs", err);
    }
  }, []);

  useEffect(() => {
    fetchAdminIds();
  }, [fetchAdminIds]);

  // Helper to get messages safely, returns [] on 404
  const getMessagesSafe = async (url) => {
    try {
      const res = await api.get(url);
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      if (err.response?.status === 404) {
        // No messages found for this user — return empty array instead of throwing
        return [];
      }
      throw err; // rethrow for other errors
    }
  };

  const fetchMessages = useCallback(async () => {
    if (!userId) return;

    try {
      // Fetch both received and sent messages safely
      const [receivedMessages, sentMessages] = await Promise.all([
        getMessagesSafe(`http://localhost:5108/api/Chat/GetMessagesByReceiver/${userId}`),
        getMessagesSafe(`http://localhost:5108/api/Chat/GetMessagesBySender/${userId}`)
      ]);

      const allMessages = [...receivedMessages, ...sentMessages];

      // Sort messages by sentAt ascending
      allMessages.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));

      setChatMessages(allMessages);
    } catch (err) {
      console.error("Failed to fetch messages", err);
      setChatMessages([]);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserId();
  }, [fetchUserId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);





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
           userId: senderName,
           messageContent: message
          };

          setChatMessages(prev => [...prev, newMsg]);
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









  const sendMessageToAdmins = async () => {
    if (!connection || !messageInput || !adminIds || adminIds.length === 0) return;

    try {
      // Send message to each admin
      for (const adminId of adminIds) {
        try {
          await connection.invoke("SendPrivateMessage", adminId, userId, messageInput);

          const newMsg = {
            id: `${userId}-${adminId}-${Date.now()}`, // Unique id per message sent
            userId: userId,
            receiverId: adminId,
            messageContent: messageInput,
            sentAt: new Date().toISOString(),
          };

          setChatMessages(prev => [...prev, newMsg]);
        } catch (err) {
          console.error(`Failed to send message to admin ${adminId}:`, err);
        }
      }
      setMessageInput(""); // Clear input after sending
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-full bg-white p-6 flex flex-col">
        <h4 className="text-3xl font-semibold mb-6 text-green-700">Chat with us</h4>
        <div className="flex-1 overflow-y-auto mb-6 border border-gray-300 rounded-lg p-6 bg-gray-50">
          <div className="space-y-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`text-sm ${msg.userId === userId ? 'text-right' : 'text-left'}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: msg.userId === userId ? 'flex-end' : 'flex-start' }}
              >
                <p
                  style={{
                    marginRight: msg.userId === userId ? '20px' : '0',
                    marginLeft: msg.userId !== userId ? '10px' : '0',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {msg.userId === userId ? (
                    <strong>You:</strong>
                  ) : (
                    <img
                      src={logo}
                      alt="Admin Logo"
                      style={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        border: "3px solid #4CAF50",
                        marginRight: "15px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        verticalAlign: 'middle'
                      }}
                    />
                  )}
                  {msg.messageContent}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4 mt-6">
          <input
            type="text"
            value={messageInput}
            onChange={e => setMessageInput(e.target.value)}
            placeholder="Type your message"
            className="flex-1 border border-green-600 rounded-lg p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={sendMessageToAdmins}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center space-x-2 transition"
          >
            <FaPaperPlane className="text-lg" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponentForUsers;

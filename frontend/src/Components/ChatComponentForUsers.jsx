import { HubConnectionBuilder } from "@microsoft/signalr";
import Cookies from "js-cookie";
import { useEffect, useState, useCallback } from "react";
import api from "./api";
import { FaPaperPlane } from "react-icons/fa"; // Import icons
import logo from "../Images/SmartBuyLogo.webp"; // Ensure this is the correct path

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
      console.log(adminIds)
    } catch (err) {
      console.error("Failed to fetch user ID", err);
    }
  }, [username]);

 // Callback to fetch admin IDs
const fetchAdminIds = useCallback(async () => {
    try {
      const res = await api.get('http://localhost:5108/users/admins');
      
      // Log the full response to see the structure
      console.log(res.data);
  
      // Extract only the admin IDs from the response
      const ids = res.data.map(admin => admin.id); 
      console.log("Admin IDs:", ids); // Log the ids to confirm
  
      setAdminIds(ids); // Set the adminIds in state
    } catch (err) {
      console.error("Failed to fetch admin IDs", err);
    }
  }, []);  // Empty array means this function is created only once on mount
  
  // Effect to trigger the fetch when the component mounts
  useEffect(() => {
    fetchAdminIds();  // Call the fetchAdminIds function
  }, [fetchAdminIds]);  // Include fetchAdminIds in dependencies for effect
  
  

  const fetchMessages = useCallback(async () => {
    if (!userId) return;

    try {
      // Fetch messages sent to the user
      const receivedMessagesRes = await api.get(`http://localhost:5108/api/Chat/GetMessagesByReceiver/${userId}`);
      // Fetch messages sent by the user
      const sentMessagesRes = await api.get(`http://localhost:5108/api/Chat/GetMessagesBySender/${userId}`);
      
      const allMessages = [
        ...receivedMessagesRes.data,
        ...sentMessagesRes.data
      ];

      // Sort messages by sentAt (ascending order)
      allMessages.sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
      
      setChatMessages(allMessages);
    } catch (err) {
      console.error("Failed to fetch messages", err);
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
            id: Date.now(),
            userId: senderName,
            receiverId: userId,
            messageContent: message,
            sentAt: new Date().toISOString()
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
      // Loop through each admin ID and send the message
      adminIds.forEach(async (adminId) => {
        try {
          await connection.invoke("SendPrivateMessage", adminId, userId, messageInput);
  
          const newMsg = {
            id: Date.now(),
            userId: userId,
            receiverId: adminId,
            messageContent: messageInput,
            sentAt: new Date().toISOString(),
          };
  
          setChatMessages((prev) => [...prev, newMsg]);
        } catch (err) {
          console.error(`Failed to send message to admin ${adminId}:`, err);
        }
      });
  
      setMessageInput(""); // Clear the input field after sending the message
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };
  

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Chat Window */}
      <div className="w-full bg-white p-6 flex flex-col">
        <h4 className="text-3xl font-semibold mb-6 text-green-700">Chat with us</h4>
        <div className="flex-1 overflow-y-auto mb-6 border border-gray-300 rounded-lg p-6 bg-gray-50">
          <div className="space-y-4">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`text-sm ${msg.userId === userId ? 'text-right' : 'text-left'}`} style={{ display: 'flex', alignItems: 'center', justifyContent: msg.userId === userId ? 'flex-end' : 'flex-start' }}>
                <p style={{ marginRight: msg.userId === userId ? '20px' : '0', marginLeft: msg.userId !== userId ? '10px' : '0', display: 'flex', alignItems: 'center' }}>
                  {msg.userId === userId ? (
                    // If the message is from the logged-in user, show "You"
                    <strong>You:</strong>
                  ) : (
                    // If the message is from the admin
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
                  />                  )}
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

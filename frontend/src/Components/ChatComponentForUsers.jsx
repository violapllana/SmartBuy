import { HubConnectionBuilder } from "@microsoft/signalr";
import Cookies from "js-cookie";
import { useEffect, useState, useCallback } from "react";
import api from "./api";
import { FaPaperPlane, FaCommentDots, FaRegUser } from "react-icons/fa";
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
        return [];
      }
      throw err;
    }
  };

  const fetchMessages = useCallback(async () => {
    if (!userId) return;
    try {
      const [receivedMessages, sentMessages] = await Promise.all([
        getMessagesSafe(`http://localhost:5108/api/Chat/GetMessagesByReceiver/${userId}`),
        getMessagesSafe(`http://localhost:5108/api/Chat/GetMessagesBySender/${userId}`)
      ]);

      const allMessages = [...receivedMessages, ...sentMessages];
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
            messageContent: message,
            sentAt: new Date().toISOString(),
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
      for (const adminId of adminIds) {
        try {
          await connection.invoke("SendPrivateMessage", adminId, userId, messageInput);
          const newMsg = {
            id: `${userId}-${adminId}-${Date.now()}`,
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
      setMessageInput("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-500/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-400/5 rounded-full blur-xl animate-bounce" />
      </div>

      {/* Sidebar */}
      <div className="w-full md:w-1/3 bg-gradient-to-b from-green-600/90 to-emerald-700/90 backdrop-blur-md border-r border-green-500/20 text-white p-4 md:p-6 overflow-y-auto relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30" />
        
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-300 bg-clip-text text-transparent">
            Support Chat
          </h3>

          {/* User Profile Section */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center border-2 border-white/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-white"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
              </div>
              <div className="ml-3">
                <span className="text-lg font-semibold text-white">{username}</span>
                <div className="text-green-300 text-sm">Online</div>
              </div>
            </div>
          </div>

          {/* Support Info */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-6">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="Support"
                  className="w-6 h-6 object-contain rounded-full"
                />
              </div>
              <div className="ml-3">
                <h4 className="text-white font-semibold">Customer Support</h4>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-300 text-sm">Available 24/7</span>
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              Our support team is here to help you with any questions or issues you may have.
            </p>
          </div>

          {/* Quick Help Topics */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              Quick Help
            </h4>
            
            {[
              { icon: "🛒", title: "Order Issues", desc: "Track orders, returns, refunds" },
              { icon: "💳", title: "Payment Help", desc: "Billing questions, payment methods" },
              { icon: "📦", title: "Product Info", desc: "Specifications, availability" },
              { icon: "🔧", title: "Technical Support", desc: "Account issues, troubleshooting" }
            ].map((topic, index) => (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 hover:border-green-400/50 cursor-pointer rounded-xl p-3 transition-all duration-300 hover:scale-105 hover:bg-white/15"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{topic.icon}</span>
                  <div>
                    <div className="text-white font-medium text-sm">{topic.title}</div>
                    <div className="text-gray-400 text-xs">{topic.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="w-full md:w-2/3 bg-white/95 backdrop-blur-md p-4 md:p-6 flex flex-col relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-gray-100/50" />
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-xl mb-6 shadow-lg">
            <h4 className="text-2xl font-semibold flex items-center gap-3">
              <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse" />
              Customer Support Chat
              <div className="ml-auto text-sm bg-white/20 px-3 py-1 rounded-full">
                Live Support
              </div>
            </h4>
            <p className="text-green-100 text-sm mt-1">
              We typically respond within a few minutes
            </p>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto mb-6 bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-xl p-6 shadow-inner">
            {chatMessages.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-200 w-24 h-24 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                    <FaCommentDots className="text-4xl text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Start a conversation</h3>
                  <p className="text-gray-500">Send us a message and we'll get back to you right away!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.userId === userId ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 ${
                        msg.userId === userId
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-br-sm'
                          : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {msg.userId === userId ? (
                          <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-bold">
                              {username?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                        ) : (
                          <img
                            src={logo || "/placeholder.svg"}
                            alt="Support"
                            className="w-6 h-6 rounded-full border border-green-200"
                          />
                        )}
                        <div className="flex-1">
                          <div className={`text-xs mb-1 ${
                            msg.userId === userId ? 'text-green-100' : 'text-gray-500'
                          }`}>
                            {msg.userId === userId ? 'You' : 'Support Team'}
                          </div>
                          <p className="text-sm leading-relaxed">{msg.messageContent}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-lg">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && sendMessageToAdmins()}
                placeholder="Type your message..."
                className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              />
              <button
                onClick={sendMessageToAdmins}
                disabled={!messageInput.trim()}
                className="group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                <FaPaperPlane className="text-sm group-hover:translate-x-1 transition-transform" />
                <span className="font-semibold">Send</span>
              </button>
            </div>
            <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Press Enter to send • Our team is online and ready to help
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponentForUsers;
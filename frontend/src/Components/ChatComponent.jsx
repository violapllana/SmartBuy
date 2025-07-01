import { HubConnectionBuilder } from "@microsoft/signalr";
import Cookies from "js-cookie";
import { useEffect, useState, useCallback, useContext} from "react";
import api from "./api";
import { FaRegUser, FaCommentDots, FaPaperPlane, FaBell} from "react-icons/fa"; // Import icons
import logo from "../Images/SmartBuyLogo.webp"; // Ensure this is the correct path
import CustomNotification from "./NotificationUtil";
import { MessageContext } from "../Contexts/MessageContext";
import { useNavigate } from "react-router-dom";


const ChatComponent = ({ username }) => {  // Add role prop
  const [connection, setConnection] = useState(null);
  const [userId, setUserId] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [receiverUsername, setReceiverUsername] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const {chatMessages, setChatMessages} = useContext(MessageContext);
  const [uniqueSenders, setUniqueSenders] = useState([]);
  const [senderUsernames, setSenderUsernames] = useState({});

  const [loading, setLoading] = useState(true);
const [showPopup, setShowPopup] = useState(false);
const [notificationMessage, setNotificationMessage] = useState('');
const [showNotificationBar, setShowNotificationBar] = useState(false);
  const [role, setRole] = useState('') ;
  const { newMessageSenders, setNewMessageSenders } = useContext(MessageContext);
  const navigate = useNavigate();






const triggerNotification = (sender) => {
  setNotificationMessage(`You have a new message from ${sender}`);
  setShowPopup(true);
};


  const fetchUserId = useCallback(async () => {
    if (!username) return;
    try {
      const res = await api.get(`http://localhost:5108/users/by-username?username=${username}`);
      setUserId(res.data.id);
      localStorage.setItem('selectedUserId', res.data.id);

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

useEffect(() => {
    // Don't redirect if userRole is undefined or null (maybe still loading)
    if (!role) return;

    if (role !== "Admin") {
      navigate("/");
      return; // no need to set interval if redirecting immediately
    }

    const intervalId = setInterval(() => {
      if (role !== "Admin") {
        navigate("/");
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [role, navigate]);



 const fetchMessages = useCallback(async (id) => {
  const targetUserId = id || userId;
  if (!targetUserId) return;

  try {
    const res = await api.get(`http://localhost:5108/api/Chat/GetMessagesByReceiver/${targetUserId}`);
    const messages = res.data;
    setAllMessages(messages);

    // Extract senders and filter out duplicates
    const senders = Array.from(new Set(messages.map(m => m.userId)));
    setUniqueSenders(senders);

    // Identify unread senders by checking 'viewedByAdmin'
    const unreadSenders = new Set(
      messages.filter(m => m.viewedByAdmin === false).map(m => m.userId)
    );

    // Retrieve the existing newMessageSenders from localStorage

    // Update newMessageSenders with unread senders not already in the list
    setNewMessageSenders(prev => {
      const updatedSenders = [...prev];
      unreadSenders.forEach(senderId => {
        const senderUsername = messages.find(m => m.userId === senderId)?.senderUsername;
        if (senderUsername && !updatedSenders.includes(senderUsername)) {
          updatedSenders.push(senderUsername);
        }
      });

      // Sync with localStorage
      localStorage.setItem('newMessageSenders', JSON.stringify(updatedSenders));

      return updatedSenders;
    });

    // Fetch usernames for senders
    const usernameMap = {};
    for (const senderId of senders) {
      try {
        const userRes = await api.get(`http://localhost:5108/users/getusernamefromid/${senderId}`);
        usernameMap[senderId] = userRes.data;
      } catch (error) {
        console.error("Failed to fetch username for userId:", senderId, error);
      }
    }
    setSenderUsernames(usernameMap);

    // Map messages to include the sender's username
    const mappedMessages = messages.map(message => ({
      ...message,
      senderUsername: usernameMap[message.userId] || 'Unknown',
    }));
    setChatMessages(mappedMessages);

  } catch (error) {
    console.error("Error fetching messages:", error);
  }
}, [userId]);


  


  
  // Update newMessageSenders when new messages arrive via SignalR
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
          sentAt: new Date().toISOString(),
        };

        // Update chat and all messages
        setChatMessages((prevMessages) => [...prevMessages, newMsg]);
        setAllMessages((prevMessages) => [...prevMessages, newMsg]);

        const readSenders = JSON.parse(localStorage.getItem("readSenders")) || [];
        // Handle new message senders
        if (!readSenders.includes(senderName)) {
          setNewMessageSenders((prevSenders) => {
            if (!prevSenders.includes(senderName)) {
              const updatedSenders = [...prevSenders, senderName];
              localStorage.setItem('newMessageSenders', JSON.stringify(updatedSenders));
              return updatedSenders;
            }
            return prevSenders;
          });
        }
      });
    })
    .catch((err) => console.error("SignalR error:", err));

  // Save connection state
  setConnection(newConnection);

  // Cleanup the connection on component unmount or userId change
  return () => {
    if (newConnection) {
      newConnection.stop().catch((err) => console.error("Error stopping SignalR connection", err));
    }
  };
}, [userId]);




useEffect(() => {
  const interval = setInterval(async () => {
    const savedSenders = JSON.parse(localStorage.getItem('newMessageSenders')) || [];
    const updatedSenders = [];

    for (const sender of savedSenders) {
      try {
        const res = await api.get(`http://localhost:5108/api/Chat/view-latest/${sender}`);
        const latestMsg = res.data;

        if (!latestMsg.viewedByAdmin) {
          updatedSenders.push(sender);
                    triggerNotification && triggerNotification(sender);

        }
      } catch (err) {
        console.error(`Error checking message for ${sender}:`, err);
        updatedSenders.push(sender);
      }
    }

    setNewMessageSenders(updatedSenders);
    localStorage.setItem('newMessageSenders', JSON.stringify(updatedSenders));
    setShowNotificationBar(updatedSenders.length > 0); // ✅ show or hide
  }, 5000);

  return () => clearInterval(interval);
}, []);





useEffect(() => {
  const savedSenders = JSON.parse(localStorage.getItem('newMessageSenders')) || [];
  setShowNotificationBar(savedSenders.length > 0);
}, []);
//   // Update newMessageSenders when new messages arrive via SignalR
// useEffect(() => {
//   if (!connection) return;

//   connection.on("ReceiveMessage", (senderName, message) => {
//     const newMsg = {
//       id: Date.now(),
//       userId: senderName,
//       receiverId: userId,
//       messageContent: message,
//       sentAt: new Date().toISOString(),
//       viewedByAdmin: false, // Assuming new messages are unread
//     };

//     // Add the new message to the chat and all messages
//     setChatMessages(prev => [...prev, newMsg]);
//     setAllMessages(prev => [...prev, newMsg]);

//     // Update the unread senders
//     setNewMessageSenders(prev => {
//       if (!prev.includes(senderName)) {
//         const updatedSenders = [...prev, senderName];
//         // Persist the updated new message senders to localStorage
//         localStorage.setItem('newMessageSenders', JSON.stringify(updatedSenders));
//         return updatedSenders;
//       }
//       return prev;
//     });
//   });
// }, [connection, userId]);






  
const handleSenderClick = async (sender) => {
  setReceiverId(sender);
  setReceiverUsername(senderUsernames[sender] || sender);

  // Mark as read
  const readSenders = JSON.parse(localStorage.getItem("readSenders")) || [];
  if (!readSenders.includes(sender)) {
    const updatedReadSenders = [...readSenders, sender];
    localStorage.setItem("readSenders", JSON.stringify(updatedReadSenders));
  }




  // ✅ Remove sender from newMessageSenders and save to localStorage
  // Remove from newMessageSenders
  setNewMessageSenders(prev => {
    const updatedSenders = prev.filter(s => s !== sender);
    localStorage.setItem("newMessageSenders", JSON.stringify(updatedSenders));
    return updatedSenders;
  });

  if(!sender.viewedByAdmin){

  // ✅ CALL THE BACKEND ENDPOINT to mark latest message as viewed
  try {
    await api.put(`http://localhost:5108/api/Chat/view-latest/${sender}`);
    console.log("Marked latest message as viewed for:", sender);
  } catch (error) {
    console.error("Failed to mark message as viewed:", error);
  }
}
};






useEffect(() => {
  const readSenders = JSON.parse(localStorage.getItem('readSenders')) || [];
  const storedNewMessageSenders = JSON.parse(localStorage.getItem('newMessageSenders')) || [];
});








useEffect(() => {
  if (newMessageSenders.length > 0 ) {
    console.log("Saving newMessageSenders to localStorage", newMessageSenders);
    localStorage.setItem('newMessageSenders', JSON.stringify(newMessageSenders));
  }
}, [newMessageSenders]); // This will run whenever `newMessageSenders` changes

  
    useEffect(() => {
    console.log("Checking localStorage after page load:", localStorage.getItem('newMessageSenders'));
  }, []);

  
  
  
  
  
  

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
    const savedUserId = localStorage.getItem('selectedUserId');
    if (savedUserId) {
      setUserId(savedUserId);
      fetchMessages(savedUserId); // Pass it directly
    }
  }, [fetchMessages]);





  

  useEffect(() => {
    fetchReceiverUsername();
  }, [receiverId, fetchReceiverUsername]);






  useEffect(() => {
    fetchChatMessages();
  }, [fetchChatMessages]);



 return (
  <>
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
            Messages
          </h3>

          {/* User Profile Section */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center">
              {role === "Admin" ? (
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      src={logo || "/placeholder.svg"}
                      alt="Logo"
                      className="w-12 h-12 object-contain rounded-full border-2 border-yellow-400 shadow-lg"
                    />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white animate-pulse" />
                  </div>
                  <div className="ml-3">
                    <span className="text-lg font-semibold text-white">{username}</span>
                    <div className="text-yellow-300 text-sm font-bold animate-pulse">[ADMIN]</div>
                  </div>
                </div>
              ) : (
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
              )}
            </div>
          </div>

          {/* New Messages */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              New Messages
            </h4>
            <ul className="space-y-2">
              {uniqueSenders
                .filter(sender => newMessageSenders.includes(sender))
                .map(sender => (
                  <li
                    key={sender}
                    onClick={() => handleSenderClick(sender)}
                    className="group bg-white/10 backdrop-blur-sm border border-yellow-400/30 hover:border-yellow-400/60 text-yellow-300 cursor-pointer rounded-xl p-4 flex items-center space-x-3 transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-lg hover:shadow-yellow-400/20"
                  >
                    <div className="relative">
                      <FaRegUser className="text-lg" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                    </div>
                    <span className="font-semibold flex-1">
                      {senderUsernames[sender] || sender}
                    </span>
                    <FaBell className="text-yellow-400 animate-bounce" />
                  </li>
                ))}
            </ul>
          </div>

          {/* Old Messages */}
          <div>
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
              Previous Conversations
            </h4>
            <ul className="space-y-2">
              {uniqueSenders
                .filter(sender => !newMessageSenders.includes(sender))
                .map(sender => (
                  <li
                    key={sender}
                    onClick={() => handleSenderClick(sender)}
                    className="group bg-white/5 backdrop-blur-sm border border-white/10 hover:border-green-400/50 cursor-pointer rounded-xl p-4 flex items-center space-x-3 transition-all duration-300 hover:scale-105 hover:bg-white/15 hover:shadow-lg hover:shadow-green-400/10"
                  >
                    <FaRegUser className="text-lg text-gray-300 group-hover:text-green-300 transition-colors" />
                    <span className="text-gray-200 group-hover:text-white transition-colors">
                      {senderUsernames[sender] || sender}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="w-full md:w-2/3 bg-white/95 backdrop-blur-md p-4 md:p-6 flex flex-col relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-gray-100/50" />
        
        <div className="relative z-10 flex flex-col h-full">
          {receiverId ? (
            <>
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-xl mb-6 shadow-lg">
                <h4 className="text-2xl font-semibold flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse" />
                  Chat with {receiverUsername}
                  <div className="ml-auto text-sm bg-white/20 px-3 py-1 rounded-full">
                    Active now
                  </div>
                </h4>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto mb-6 bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-xl p-6 shadow-inner">
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
                            role === 'Admin' && (
                              <img
                                src={logo || "/placeholder.svg"}
                                alt="Admin"
                                className="w-6 h-6 rounded-full border border-white/50"
                              />
                            )
                          ) : (
                            <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white font-bold">
                                {receiverUsername?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="flex-1">
                            <div className={`text-xs mb-1 ${
                              msg.userId === userId ? 'text-green-100' : 'text-gray-500'
                            }`}>
                              {msg.userId === userId ? 'You' : receiverUsername}
                            </div>
                            <p className="text-sm leading-relaxed">{msg.messageContent}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                  />
                  <button
                    onClick={sendMessage}
                    className="group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
                  >
                    <FaPaperPlane className="text-sm group-hover:translate-x-1 transition-transform" />
                    <span className="font-semibold">Send</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-full">
              <div className="text-center">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-24 h-24 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                  <FaCommentDots className="text-4xl text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No conversation selected</h3>
                <p className="text-gray-500">Choose a conversation from the sidebar to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </>
);

};

export default ChatComponent;
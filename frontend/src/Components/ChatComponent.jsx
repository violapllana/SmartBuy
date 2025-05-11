import { HubConnectionBuilder } from "@microsoft/signalr";
import Cookies from "js-cookie";
import { useEffect, useState, useCallback } from "react";
import api from "./api";
import { FaRegUser, FaCommentDots, FaPaperPlane, FaBell} from "react-icons/fa"; // Import icons
import logo from "../Images/SmartBuyLogo.webp"; // Ensure this is the correct path

const ChatComponent = ({ username }) => {  // Add role prop
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
  const [newMessageSenders, setNewMessageSenders] = useState([]);
  const [loading, setLoading] = useState(true);



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
  if (!connection) return;

  connection.on("ReceiveMessage", (senderName, message) => {
    const newMsg = {
      id: Date.now(),
      userId: senderName,
      receiverId: userId,
      messageContent: message,
      sentAt: new Date().toISOString(),
      viewedByAdmin: false, // Assuming new messages are unread
    };

    // Add the new message to the chat and all messages
    setChatMessages(prev => [...prev, newMsg]);
    setAllMessages(prev => [...prev, newMsg]);

    // Update the unread senders
    setNewMessageSenders(prev => {
      if (!prev.includes(senderName)) {
        const updatedSenders = [...prev, senderName];
        // Persist the updated new message senders to localStorage
        localStorage.setItem('newMessageSenders', JSON.stringify(updatedSenders));
        return updatedSenders;
      }
      return prev;
    });
  });
}, [connection, userId]);






  
  // Update unread senders when messages are marked as read
const handleSenderClick = (sender) => {
  // Set receiver info
  setReceiverId(sender);
  setReceiverUsername(senderUsernames[sender] || sender);

  // ✅ Mark as read and save to localStorage
  const readSenders = JSON.parse(localStorage.getItem('readSenders')) || [];
  if (!readSenders.includes(sender)) {
    const updatedReadSenders = [...readSenders, sender];
    localStorage.setItem('readSenders', JSON.stringify(updatedReadSenders));
  }

  // ✅ Remove sender from newMessageSenders and save to localStorage
  setNewMessageSenders(prev => {
    const updatedSenders = prev.filter(s => s !== sender);
    localStorage.setItem('newMessageSenders', JSON.stringify(updatedSenders));
    return updatedSenders;
  });
};

useEffect(() => {
  const readSenders = JSON.parse(localStorage.getItem('readSenders')) || [];
  const storedNewMessageSenders = JSON.parse(localStorage.getItem('newMessageSenders')) || [];

  // Use stored senders if available, otherwise calculate from uniqueSenders
  const initialNewSenders = storedNewMessageSenders.length > 0
    ? storedNewMessageSenders
    : uniqueSenders.filter(sender => !readSenders.includes(sender));

  setNewMessageSenders(initialNewSenders);
  setLoading(false);
}, []);







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

        setChatMessages(prev => [...prev, newMsg]);
        setAllMessages(prev => [...prev, newMsg]);

        const readSenders = JSON.parse(localStorage.getItem("readSenders")) || [];

        // Add to newMessageSenders only if not already read
        if (!readSenders.includes(senderName)) {
          setNewMessageSenders(prev => {
            if (!prev.includes(senderName)) {
              const updatedSenders = [...prev, senderName];
              // Save the updated newMessageSenders to localStorage immediately after updating the state
              localStorage.setItem('newMessageSenders', JSON.stringify(updatedSenders));
              return updatedSenders;
            }
            return prev;
          });
        }
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


if (loading) {
  return <div>Loading...</div>; // You can replace this with a loading spinner or something else
}
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-yellow-500 mr-2"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xl font-mono">{username}</span>
          </span>
        )}
      </div>

      {/* New Messages */}
     <h4 className="text-xl font-semibold mb-2">New Messages</h4>
<ul className="space-y-2 mb-6">
  {uniqueSenders
    .filter(sender => newMessageSenders.includes(sender))
    .map(sender => (
      <li
        key={sender}
        onClick={() => handleSenderClick(sender)}
        className="text-yellow-400 cursor-pointer rounded-md p-3 flex items-center space-x-3 transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-green-700 hover:ring-2 hover:ring-green-500 focus:ring-4 focus:ring-green-300 focus:outline-none transform active:scale-95"
      >
        <FaRegUser className="text-xl" />
        <span className="font-semibold">
          {senderUsernames[sender] || sender}
        </span>
        <FaBell className="text-yellow-400 ml-2 animate-ping" />
      </li>
    ))}
</ul>

<h4 className="text-xl font-semibold mb-2">Old Messages</h4>
<ul className="space-y-4">
  {uniqueSenders
    .filter(sender => !newMessageSenders.includes(sender))
    .map(sender => (
      <li
        key={sender}
        onClick={() => handleSenderClick(sender)}
        className="cursor-pointer rounded-md p-3 flex items-center space-x-3 transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-green-700 hover:ring-2 hover:ring-green-500 focus:ring-4 focus:ring-green-300 focus:outline-none transform active:scale-95"
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
          <h4 className="text-3xl font-semibold mb-6 text-green-700">
            Chat with {receiverUsername}
          </h4>
          <div className="flex-1 overflow-y-auto mb-6 border border-gray-300 rounded-lg p-6 bg-gray-50">
            <div className="space-y-4">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`text-sm ${
                    msg.userId === userId ? 'text-right' : 'text-left'
                  }`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:
                      msg.userId === userId ? 'flex-end' : 'flex-start',
                  }}
                >
                  <p
                    style={{
                      marginRight: msg.userId === userId ? '20px' : '0',
                      marginLeft: msg.userId !== userId ? '10px' : '0',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {msg.userId === userId ? (
                      <>
                        {role === 'Admin' ? (
                          <img
                            src={logo}
                            alt="Admin Logo"
                            style={{
                              width: '35px',
                              height: '35px',
                              borderRadius: '50%',
                              border: '3px solid #4CAF50',
                              marginRight: '15px',
                              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                              verticalAlign: 'middle',
                            }}
                          />
                        ) : (
                          <strong>You:</strong>
                        )}
                      </>
                    ) : (
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
        <div className="flex justify-center items-center h-full text-gray-500 flex-col">
          <FaCommentDots className="text-5xl mb-4" />
          <p>Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  </div>
);

};

export default ChatComponent;
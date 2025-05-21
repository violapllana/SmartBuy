import React, { createContext, useState, useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import Cookies from "js-cookie";
import api from "../Components/api";  // Assuming API utilities exist

export const MessageContext = createContext();

export const MessageProvider = ({ children, username, triggerNotification }) => {
  const [connection, setConnection] = useState(null);
  const [userId, setUserId] = useState("");
  const [newMessageSenders, setNewMessageSenders] = useState([]);
    const [role, setRole] = useState("");
    const [chatMessages, setChatMessages] = useState([]);




useEffect(() => {
    const storedRole = Cookies.get('role');
    setRole(storedRole);
}, []);


  // Fetch user ID based on the username
  useEffect(() => {
    const fetchUserId = async () => {
      if (!username) return;

      try {
        const response = await api.get(`http://localhost:5108/users/by-username?username=${username}`);
        if (response.data && response.data.id) {
          setUserId(response.data.id);
        }
      } catch (err) {
        console.error("Failed to fetch userId:", err);
      }
    };

    fetchUserId();
  }, [username]);

  // Load new message senders from localStorage
  useEffect(() => {
    const storedSenders = JSON.parse(localStorage.getItem("newMessageSenders")) || [];
    setNewMessageSenders(storedSenders);
  }, []);

  // Setup SignalR connection
  useEffect(() => {
    if (!userId) return;

    const connect = new HubConnectionBuilder()
      .withUrl(`http://localhost:5108/chathub?userId=${userId}`, {
        accessTokenFactory: () => Cookies.get("accessToken"),
      })
      .withAutomaticReconnect()
      .build();

    connect.start()
      .then(() => {
        console.log("Connected to SignalR Hub");
        setConnection(connect);

        connect.on("ReceiveMessage", (senderId, message) => {
            console.log("Raw message received:", message);

setChatMessages(prev => [
    ...prev,
    {
      userId: senderId,
      messageContent: message // <== match this to your JSX
    }
  ]);
          console.log("Message received globally:", message);
          if(message.viewedByAdmin === true) return;
                    if(role !== "Admin") return;
                    if(!username)return;


          // Save to localStorage and update senders
          const stored = JSON.parse(localStorage.getItem("newMessageSenders")) || [];
          const updatedSenders = [...new Set([...stored, senderId])];

          try {
            api.get(`http://localhost:5108/users/getusernamefromid/${senderId}`).then(response => {
              const senderUsername = response.data;
              triggerNotification(senderUsername); // Show notification with sender's username
            });
          } catch (error) {
            console.error("Failed to fetch sender username", error);
            triggerNotification("Unknown User");
          }
            // Update localStorage and state
          localStorage.setItem("newMessageSenders", JSON.stringify(updatedSenders));
          setNewMessageSenders(updatedSenders);
          
        });
      })
      .catch(err => console.error("Connection failed", err));

    return () => {
      connect.stop();
    };
  }, [userId, role]);






  


useEffect(() => {
  // Define the async function to check viewedByAdmin status
  const checkLatestMessageViewed = async () => {
    const storedSenders = JSON.parse(localStorage.getItem("newMessageSenders")) || [];
    const stillUnviewed = [];

    for (const senderId of storedSenders) {
      try {
        const response = await api.get(`http://localhost:5108/api/Chat/view-latest/${senderId}`);
        const latestMessage = response.data;

        if (latestMessage?.viewedByAdmin === true) {
          console.log(`Sender ${senderId} messages viewed by admin, removing from localStorage`);
          // Skip adding this senderId to stillUnviewed — removing it
        } else {
          stillUnviewed.push(senderId); // Keep this senderId
        }
      } catch (error) {
        console.error(`Failed to check latest message for sender ${senderId}`, error);
        // On error, keep the sender to be safe
        stillUnviewed.push(senderId);
      }
    }

    // Update localStorage and state
    localStorage.setItem("newMessageSenders", JSON.stringify(stillUnviewed));
    setNewMessageSenders(stillUnviewed);
  };

  // Setup interval and save id
  const intervalId = setInterval(() => {
    checkLatestMessageViewed().catch(console.error);
  }, 10000); // every 10 seconds

  // Cleanup on unmount
  return () => clearInterval(intervalId);
}, []);











  

  return (
    <MessageContext.Provider value={{ 
  newMessageSenders, 
  setNewMessageSenders,
  chatMessages,
  setChatMessages
}}>
  {children}
</MessageContext.Provider>

  );
};

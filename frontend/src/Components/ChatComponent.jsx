import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { HubConnectionBuilder } from '@microsoft/signalr';

function ChatComponent() {
  const { userId, receiverId } = useParams();  // Get userId and receiverId from the URL
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageContent, setMessageContent] = useState('');
  const [connection, setConnection] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(''); // Add state for connection status

  // Set up SignalR connection and listen for incoming messages first
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5108/chatHub', {
        withCredentials: true, // Ensures credentials (cookies) are sent with the request
      })
      .build();

    newConnection
      .start()
      .then(() => {
        setConnectionStatus('SignalR connection established'); // Show this message first
        console.log('SignalR connection established');
        setConnection(newConnection);

        // Listen for incoming messages
        newConnection.on('ReceiveMessage', (senderId, messageContent, sentAt) => {
          if (senderId && messageContent && sentAt) {
            setMessages((prevMessages) => [
              ...prevMessages,
              { userId: senderId, messageContent, sentAt }
            ]);
          }
        });
      })
      .catch((error) => {
        setConnectionStatus(`Error while establishing connection: ${error.message}`); // Show error status
        console.error('Error while establishing connection:', error);
      });

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []); // Run only once when component mounts

  // Fetch existing messages when user or receiver changes (this happens after the connection is established)
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await axios.get(
          `http://localhost:5108/api/Chat/GetMessagesAsync?userId=${userId}&otherUserId=${receiverId}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    if (userId && receiverId) {
      fetchMessages();  // Fetch the messages between the user and the receiver
    }
  }, [userId, receiverId]); // Re-fetch messages if user or receiver changes

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;  // Don't send empty messages

    const messageDto = {
      userId,          // Logged-in user
      receiverId,      // Receiver from URL
      messageContent,  // The message content
      sentAt: new Date().toISOString(), // Current timestamp
      viewedByAdmin: false // You can modify based on your needs
    };

    try {
      // Send the message DTO to the backend to save and broadcast via SignalR
      if (connection) {
        await connection.invoke('SendMessage', messageDto);
        setMessages((prevMessages) => [...prevMessages, messageDto]); // Optionally update the UI immediately
        setMessageContent(''); // Clear the input field
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex flex-col p-4 bg-blue-600 text-white">
        <h2 className="text-xl">Chat with {receiverId}</h2>
      </div>

      {/* Display the connection status */}
      <div className="text-center text-gray-500 p-4">
        {connectionStatus ? <p>{connectionStatus}</p> : null}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-center text-gray-500">Loading messages...</div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.userId === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg text-sm ${message.userId === userId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  <p className="font-semibold">{message.userId}</p>
                  <p>{message.messageContent}</p>
                  <p className="text-xs text-gray-400">{new Date(message.sentAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 bg-white shadow-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <input
            type="text"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type a message"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="mt-2 w-full p-3 bg-blue-600 text-white rounded-lg focus:outline-none hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatComponent;

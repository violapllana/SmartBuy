import React, { useEffect, useState } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import Cookies from 'js-cookie';

const SendMessage = () => {
    const [connection, setConnection] = useState(null);
    const [messageContent, setMessageContent] = useState('');
    const [receiverId, setReceiverId] = useState('');
    const [status, setStatus] = useState('Disconnected');

    useEffect(() => {
        // Establish the connection to SignalR
        const newConnection = new HubConnectionBuilder()
            .withUrl("http://localhost:5132/chatHub", {
                withCredentials: true,
            })
            .configureLogging(LogLevel.Information)
            .build();

        newConnection.start()
            .then(() => {
                setStatus('Connected');
            })
            .catch((err) => {
                setStatus('Connection failed');
                console.error("SignalR Connection Error: ", err);
            });

        setConnection(newConnection);

        // Handle incoming messages
        newConnection.on("ReceiveMessage", (message) => {
            console.log("Received message: ", message);
            // You can handle the incoming message here (e.g., display it in the UI)
        });

        return () => {
            newConnection.stop(); // Stop the connection when the component unmounts
        };
    }, []);

    const sendMessage = async () => {
        const userId = Cookies.get("userId"); // Assuming you store userId in cookies
        if (connection && userId && receiverId && messageContent) {
            try {
                // Call the SendMessage method on the server (SignalR Hub)
                await connection.invoke("SendMessage", userId, receiverId, messageContent);
                console.log('Message sent successfully!');
            } catch (err) {
                console.error("Error sending message: ", err);
            }
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-2xl font-semibold mb-4">Send Message</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium">Receiver ID</label>
                <input
                    type="text"
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    value={receiverId}
                    onChange={(e) => setReceiverId(e.target.value)}
                    placeholder="Enter receiver ID"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium">Message</label>
                <textarea
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Enter your message"
                ></textarea>
            </div>
            <button
                className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                onClick={sendMessage}
            >
                Send Message
            </button>
            <p className="mt-2 text-sm text-gray-500">Status: {status}</p>
        </div>
    );
};

export default SendMessage;

import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Components/Header"; // Import your header component
import Footer from "./Components/Footer"; // Import your footer component
import Cookies from 'js-cookie';
import { api, setupInterceptors } from './Components/AxiosConfig';
import Login from "./Pages/Login"; // Import Login page
import Register from "./Pages/Register"; // Import Register page
import Home from './Pages/Home';
import { jwtDecode } from 'jwt-decode';  // Correct named import for jwt-decode
import CookieConsent from './Components/CookieConsent';
import Profile from './Pages/Profile';
import Settings from './Pages/Settings';
import AddCard from './Components/Card/Card';
import ChatComponent from './Components/ChatComponent';
import ChatComponentForUsers from './Components/ChatComponentForUsers';
<<<<<<< HEAD
import CustomNotification from './Components/NotificationUtil';
=======
import { MessageProvider } from './Contexts/MessageContext';
import CustomNotification from './Components/CustomNotification';
>>>>>>> e2f26a0 (20 Maj)

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!document.cookie.includes('authToken'); // Example for cookies
  });
  const [username, setUsername] = useState('');
  const [role, setRole] = useState(''); // New state for role
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(false); // State to handle redirection
  const [storedAuthToken, setStoredAuthToken] = useState('');
<<<<<<< HEAD
const [notificationMessage, setNotificationMessage] = useState('');
const [showNotification, setShowNotification] = useState(false);



=======
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
>>>>>>> e2f26a0 (20 Maj)

  const fetchUserId = useCallback(async () => {
    if (username) {
      try {
        const response = await api.get(`http://localhost:5108/users/by-username?username=${username}`);
        if (response.data && response.data.id) {
          console.log('User ID:', response.data.id); // Log user ID for debugging
        } else {
          console.error('User ID not found');
        }
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    }
  }, [username]);

  useEffect(() => {
    setupInterceptors(handleLogout);

    // Load username and role from cookies if they exist
    const storedAuthToken = Cookies.get('authToken');
    const storedUsername = Cookies.get('username');
    const storedRole = Cookies.get('role'); // Retrieve role from cookies
    setStoredAuthToken(storedAuthToken); // Set the auth token here

    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
    if (storedRole) {
      setRole(storedRole); // Set the role from cookies
    }

    fetchUserId().finally(() => setLoading(false));
  }, [fetchUserId]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setRole('');  // Reset the role on logout

    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    Cookies.remove('username');
    Cookies.remove('role'); // Remove role from cookies

    setRedirect(true);  // Trigger redirect
    window.location.href = '/'; // This will navigate to the homepage and reload the page
  };

<<<<<<< HEAD


 

=======
>>>>>>> e2f26a0 (20 Maj)
  const handleLogin = async (username, password) => {
    try {
      const response = await api.post('http://localhost:5108/login', { username, password });

      if (response.status === 200) {
        const { accessToken, refreshToken, userName } = response.data;

        Cookies.set('accessToken', accessToken, { expires: 1 });
        Cookies.set('refreshToken', refreshToken, { expires: 7 });
        Cookies.set('username', userName);
        
        setIsLoggedIn(true);
        setUsername(userName);

        // Decode the token to get the role
        const decodedToken = jwtDecode(accessToken); // Decode JWT token
        console.log("Decoded Token:", decodedToken);
        setRole(decodedToken.role); // Set the role in state
        Cookies.set('role', decodedToken.role); // Save role in cookies

        fetchUserId();
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  const handleRegister = async (username, email, password) => {
    try {
      const response = await api.post('http://localhost:5108/register', { username, email, password });

      if (response.status === 200) {
        alert('Registration successful! You can now log in.');
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Error registering:', error.message);
    }
  };

<<<<<<< HEAD
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
        }
      } catch (err) {
        updatedSenders.push(sender); // Still add to show error or retry later
      }
    }

    localStorage.setItem('newMessageSenders', JSON.stringify(updatedSenders));

    if (updatedSenders.length > 0) {
      try {
       
         updatedSenders.length > 1? setNotificationMessage(`You have new messages`) : setNotificationMessage(`You have a new message`)

        setShowNotification(true);
      } catch (err) {
        console.error('Failed to fetch username:', err);
      }
    }
  }, 5000);

  return () => clearInterval(interval);
}, []);


=======
  const triggerNotification = (sender) => {
          const storedSenders = JSON.parse(localStorage.getItem("newMessageSenders")) || [];
if(storedSenders.length > 1){
    setNotificationMessage(`You got a new message from ${sender} and others`);
}
else{
      setNotificationMessage(`You got a new message from ${sender}`);

}
    setShowNotification(true);
  };



   useEffect(() => {
    const fetchAndTriggerNotification = async () => {
      const storedSenders = JSON.parse(localStorage.getItem("newMessageSenders")) || [];

      if (storedSenders.length > 0) {
        const senderId = storedSenders[0]; // You can handle multiple if you want

        try {
          const response = await api.get(`http://localhost:5108/users/getusernamefromid/${senderId}`);
          const username = response.data;
          triggerNotification(username);
        } catch (err) {
          console.error("Failed to get username:", err);
          triggerNotification("Unknown User");
        }
      }
    };

    fetchAndTriggerNotification();
  }, []);

   const handleNotificationClose = () => {
    setShowNotification(false);
  };

useEffect(() => {
    const checkLocalStorage = () => {
      const storedSenders = JSON.parse(localStorage.getItem("newMessageSenders")) || [];

      if (storedSenders.length === 0) {
        handleNotificationClose(); // Close notification if no senders left
      }
    };

    // Check for changes initially
    checkLocalStorage();

    // Set an interval to check localStorage periodically for changes
    const intervalId = setInterval(checkLocalStorage, 1000); // Check every second

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); 
>>>>>>> e2f26a0 (20 Maj)

  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to login page if logged out
  if (redirect) {
    window.location.href = '/login'; // This will navigate to the homepage and reload the page
    return null;  // Return nothing since navigation happens
  }

  return (
    <Router>
      <CookieConsent /> {/* Render the CookieConsent component */}

      <Header 
        isLoggedIn={isLoggedIn} 
        handleLogout={handleLogout} 
        role={role} // Pass the role to Header
        username={username} // Pass the username here
      />
<<<<<<< HEAD
     {showNotification && (
  <CustomNotification
    message={notificationMessage}
    onClose={() => setShowNotification(false)}
  />
)}





      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register handleRegister={handleRegister} onLogin={handleLogin}/>} />
          <Route path="/profile" element={<Profile username={username} role={role} handleLogout={handleLogout} />} />
          <Route path="/settings" element={<Settings  handleLogout={handleLogout} />} />
          {/* <Route path="/contact" element={<Contact username={username} storedrole={role} />} /> */}
          <Route path="/card" element={<AddCard username={username}  />} /> 
          <Route path="/chatcomponentforusers" element={<ChatComponentForUsers username={username}  />} /> 

<Route
  path="/chatcomponent"
  element={
    <ChatComponent
      username={username}
      triggerNotification={(sender) => {
        setNotificationMessage(`You got a new message from ${sender}`);
        setShowNotification(true);
      }}
    />
  }
/>

        </Routes>
        
=======

      {showNotification && (
        <CustomNotification
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
        />
      )}

      <div className="main-content">
<MessageProvider username={username} triggerNotification={triggerNotification}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register handleRegister={handleRegister} />} />
            <Route path="/profile" element={<Profile username={username} role={role} handleLogout={handleLogout} />} />
            <Route path="/settings" element={<Settings handleLogout={handleLogout} />} />
            <Route path="/card" element={<AddCard username={username} />} />
            <Route
              path="/chatcomponent"
              element={
                <ChatComponent
                  username={username}
                  triggerNotification={triggerNotification} // Pass the triggerNotification to ChatComponent
                />
              }
            />
            <Route path="/chatcomponentforusers" element={<ChatComponentForUsers username={username} />} />
          </Routes>
        </MessageProvider>
>>>>>>> e2f26a0 (20 Maj)
      </div>

      <Footer />
    </Router>
  );
}

export default App;

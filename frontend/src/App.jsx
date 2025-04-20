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
import Contact from './Pages/Contact';
import AddCard from './Components/Card/Card';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!document.cookie.includes('authToken'); // Example for cookies
  });
  const [username, setUsername] = useState('');
  const [role, setRole] = useState(''); // New state for role
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(false); // State to handle redirection
  const [storedAuthToken, setStoredAuthToken] = useState('');

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
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register handleRegister={handleRegister} />} />
          <Route path="/profile" element={<Profile username={username} role={role} handleLogout={handleLogout} />} />
          <Route path="/settings" element={<Settings  handleLogout={handleLogout} />} />
          <Route path="/contact" element={<Contact username={username} storedrole={role} />} />
          <Route path="/card" element={<AddCard username={username}  />} /> 
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;

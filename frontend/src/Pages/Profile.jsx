import React, { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaShieldAlt, FaCog, FaSignOutAlt } from "react-icons/fa";
import api from "../Components/api";

const Profile = ({ username, role, handleLogout }) => {
  const navigate = useNavigate();

  // Fetch user ID based on username
  const fetchUserId = useCallback(async () => {
    if (username) {
      try {
        const response = await api.get(`http://localhost:5177/users/by-username?username=${username}`);
        if (response.data && response.data.id) {
          return response.data.id; // Return the user ID
        } else {
          console.error("User ID not found");
          return null;
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
        return null;
      }
    }
  }, [username]); // Add username as dependency

  // Fetch user data or any additional info (if needed)
  const fetchUserData = useCallback(async () => {
    try {
      const userId = await fetchUserId(); // Fetch user ID
      if (userId) {
        // You can fetch additional user-related data here
        const response = await api.get(`http://localhost:5177/api/UserData/${userId}`);
        // Process the response as needed
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [fetchUserId]); // Add fetchUserId as a dependency

  // Fetch data on component mount or when username changes
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]); // Include fetchUserData as a dependency

  // Fix for role display based on role value
  const getRoleText = () => {
    if (role === "ADMIN") {
      return "Administrator";
    } else if (role === "USER") {
      return "User";
    } else {
      return "Unknown Role";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white flex flex-col items-center justify-center">
      {/* Profile Card */}
      <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg w-80 hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
        {/* Profile Header */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {username ? username[0].toUpperCase() : "U"}
          </div>
        </div>

        {/* Welcome Text */}
        <h1 className="text-2xl font-bold mb-4 text-center text-green-600">
          Welcome to Your Profile
        </h1>

        {/* Username and Role */}
        <div className="text-center">
          <p className="text-lg mb-2">
            <FaUserAlt className="inline-block text-green-600 mr-2" />
            <strong>Username:</strong> {username}
          </p>
          <p className="text-lg mb-4">
            <FaShieldAlt className="inline-block text-green-600 mr-2" />
            <strong>Role:</strong> {getRoleText()}
          </p>
        </div>

        {/* Settings and Logout Buttons */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/settings")}
            className="w-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white font-semibold py-2 rounded-md mb-3 transition duration-300 ease-in-out hover:opacity-90 flex items-center justify-center"
          >
            <FaCog className="mr-2" /> Settings
          </button>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white font-semibold py-2 rounded-md transition duration-300 ease-in-out hover:opacity-90 flex items-center justify-center"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaShieldAlt, FaCog, FaSignOutAlt } from "react-icons/fa";
import api from "../Components/api";

const Profile = ({ username, role, handleLogout }) => {
  const navigate = useNavigate();

  const fetchUserId = useCallback(async () => {
    if (username) {
      try {
        const response = await api.get(`http://localhost:5177/users/by-username?username=${username}`);
        return response.data?.id || null;
      } catch (error) {
        console.error("Error fetching user ID:", error);
        return null;
      }
    }
  }, [username]);

  const fetchUserData = useCallback(async () => {
    try {
      const userId = await fetchUserId();
      if (userId) {
        const response = await api.get(`http://localhost:5177/api/UserData/${userId}`);
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [fetchUserId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const getRoleText = () => {
    switch (role) {
      case "Admin":
        return "Administrator";
      case "User":
        return "User";
      default:
        return "Unknown Role";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-2xl rounded-xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        
        {/* Sidebar Profile Section */}
        <div className="bg-green-700 text-white flex flex-col items-center p-8 md:w-1/3">
          <div className="bg-white text-green-700 rounded-full w-24 h-24 flex items-center justify-center text-4xl font-bold shadow-md mb-4">
            {username ? username[0].toUpperCase() : "U"}
          </div>
          <h2 className="text-2xl font-semibold">{username}</h2>
          <p className="mt-1 text-sm text-green-100">{getRoleText()}</p>
        </div>

        {/* Details Section */}
        <div className="flex-1 p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile Overview</h1>

            <div className="space-y-4">
              <div className="flex items-center text-lg text-gray-700">
                <FaUserAlt className="mr-3 text-green-600" />
                <span><strong>Username:</strong> {username}</span>
              </div>
              <div className="flex items-center text-lg text-gray-700">
                <FaShieldAlt className="mr-3 text-green-600" />
                <span><strong>Role:</strong> {getRoleText()}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={() => navigate("/settings")}
              className="w-full flex items-center justify-center bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition"
            >
              <FaCog className="mr-2" /> Account Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

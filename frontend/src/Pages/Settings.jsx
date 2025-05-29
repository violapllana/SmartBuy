import React, { useState } from 'react';
import api from '../Components/api';

const Settings = ({ handleLogout }) => {
  const [usernameData, setUsernameData] = useState({ newUsername: "" });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUsernameChange = (e) => {
    setUsernameData({ ...usernameData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const updateUsername = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const response = await api.put("http://localhost:5177/users/update-username", usernameData);
      setMessage(response.data.Message);
      setUsernameData({ newUsername: "" });
      handleLogout();
    } catch (err) {
      setError(err.response?.data?.Message || "Failed to update username.");
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }
    try {
      const response = await api.put("http://localhost:5177/users/update-password", passwordData);
      setMessage(response.data.Message);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      handleLogout();
    } catch (err) {
      setError(err.response?.data?.Message || "Failed to update password.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-8">Account Settings</h1>

        {(message || error) && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message
                ? 'bg-green-100 text-green-800 border-green-300'
                : 'bg-red-100 text-red-800 border-red-300'
            }`}
          >
            {message || error}
          </div>
        )}

        {/* Username Update */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Change Username</h2>
          <form onSubmit={updateUsername}>
            <label htmlFor="newUsername" className="block font-medium text-gray-700 mb-1">
              New Username
            </label>
            <input
              type="text"
              name="newUsername"
              id="newUsername"
              value={usernameData.newUsername}
              onChange={handleUsernameChange}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Enter new username"
              required
            />
            <button
              type="submit"
              className="w-full p-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Update Username
            </button>
          </form>
        </div>

        {/* Password Update */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Change Password</h2>
          <form onSubmit={updatePassword}>
            <label htmlFor="currentPassword" className="block font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Enter current password"
              required
            />

            <label htmlFor="newPassword" className="block font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Enter new password"
              required
            />

            <label htmlFor="confirmPassword" className="block font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Confirm new password"
              required
            />

            <button
              type="submit"
              className="w-full p-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;

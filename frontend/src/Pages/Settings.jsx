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
    <div className="bg-gradient-to-b from-white via-gray-100 to-gray-200 min-h-screen">
      

      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
        <h1>Settings</h1>
        {message && (
          <div className="mb-4 p-4 text-green-800 bg-green-100 rounded-lg border border-green-300">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 text-red-800 bg-red-100 rounded-lg border border-red-300">
            {error}
          </div>
        )}

        {/* Update Username */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-green-900">Update Username</h2>
          <form onSubmit={updateUsername} className="mt-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="newUsername">
              New Username
            </label>
            <input
              type="text"
              name="newUsername"
              id="newUsername"
              value={usernameData.newUsername}
              onChange={handleUsernameChange}
              placeholder="Enter new username"
              className="w-full p-3 border border-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
              required
            />
            <button
              type="submit"
              className="mt-4 w-full p-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-lg hover:shadow-md hover:from-yellow-300 hover:to-yellow-500 transition duration-300"
              >
              Update Username
            </button>
          </form>
        </section>

        {/* Update Password */}
        <section>
          <h2 className="text-xl font-semibold text-green-900">Update Password</h2>
          <form onSubmit={updatePassword} className="mt-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="currentPassword">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              id="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
              className="w-full p-3 border border-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
              required
            />
            <label className="block text-gray-700 font-medium mt-4 mb-2" htmlFor="newPassword">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              className="w-full p-3 border border-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
              required
            />
            <label className="block text-gray-700 font-medium mt-4 mb-2" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
              className="w-full p-3 border border-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-900"
              required
            />
            <button
              type="submit"
              className="mt-4 w-full p-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-lg hover:shadow-md hover:from-yellow-300 hover:to-yellow-500 transition duration-300"
            >
              Update Password
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Settings;

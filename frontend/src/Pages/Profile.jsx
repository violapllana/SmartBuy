"use client"

import { useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
  FaUserAlt,
  FaShieldAlt,
  FaCog,
  FaSignOutAlt,
  FaCrown,
  FaUser,
  FaEdit,
  FaChartLine,
  FaCreditCard,
  FaPlus,
  FaEye,
} from "react-icons/fa"
import api from "../Components/api"

const Profile = ({ username, role, handleLogout }) => {
  const navigate = useNavigate()

  const fetchUserId = useCallback(async () => {
    if (username) {
      try {
        const response = await api.get(`http://localhost:5177/users/by-username?username=${username}`)
        return response.data?.id || null
      } catch (error) {
        console.error("Error fetching user ID:", error)
        return null
      }
    }
  }, [username])

  const fetchUserData = useCallback(async () => {
    try {
      const userId = await fetchUserId()
      if (userId) {
        const response = await api.get(`http://localhost:5177/api/UserData/${userId}`)
        console.log(response.data)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }, [fetchUserId])

  useEffect(() => {
    fetchUserData()
  }, [fetchUserData])

  const getRoleText = () => {
    switch (role) {
      case "Admin":
        return "Administrator"
      case "User":
        return "User"
      default:
        return "Unknown Role"
    }
  }

  const getRoleIcon = () => {
    return role === "Admin" ? <FaCrown className="w-5 h-5" /> : <FaUser className="w-5 h-5" />
  }

  const getRoleColor = () => {
    return role === "Admin" ? "from-yellow-400 to-amber-500" : "from-emerald-400 to-green-500"
  }

  const showNotification = (message, type = "success") => {
    const notification = document.createElement("div")
    notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse ${
      type === "success" ? "bg-green-500" : "bg-blue-500"
    } text-white`
    notification.textContent = message
    document.body.appendChild(notification)
    setTimeout(() => document.body.removeChild(notification), 3000)
  }

  const handleSettingsClick = () => {
    showNotification("Navigating to settings...", "success")
    setTimeout(() => navigate("/settings"), 1000)
  }

  const handleLogoutClick = () => {
    showNotification("Logging out...", "success")
    setTimeout(() => handleLogout(), 1000)
  }

  const handleAddCardClick = () => {
    showNotification("Opening add card form...", "success")
    setTimeout(() => navigate("/card"), 1000)
  }

  const handleViewCardsClick = () => {
    showNotification("Loading your cards...", "success")
    setTimeout(() => navigate("/usercardlist"), 1000)
  }

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        
        .animate-pulse {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-bounce {
          animation: bounce 4s infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-green-500/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-400/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-400/5 rounded-full blur-xl animate-bounce" />
          <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-emerald-300/10 rounded-full blur-lg animate-float" />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-2 h-2 bg-emerald-400 rounded-full opacity-60 animate-float" />
          <div className="absolute top-1/4 right-10 w-3 h-3 bg-yellow-400 rounded-full opacity-40 animate-float-delayed" />
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-green-300 rounded-full opacity-50 animate-float" />
          <div className="absolute bottom-10 right-1/4 w-4 h-4 bg-emerald-300 rounded-full opacity-30 animate-float-delayed" />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-10">
          <div className="w-full max-w-6xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 via-green-300 to-yellow-400 bg-clip-text text-transparent mb-4">
                User Profile
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-yellow-400 mx-auto rounded-full" />
            </div>

            {/* Main Profile Card */}
            <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:scale-[1.02]">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 px-8 py-12 relative overflow-hidden">
                {/* Header Background Pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                  {/* Avatar */}
                  <div className="relative group/avatar">
                    <div className="w-32 h-32 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-6xl font-bold text-white shadow-2xl border-4 border-white/30 group-hover/avatar:scale-110 transition-transform duration-300">
                      {username ? username[0].toUpperCase() : "U"}
                    </div>

                    {/* Status Indicator */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    </div>

                    {/* Role Badge */}
                    <div
                      className={`absolute -top-2 -right-2 bg-gradient-to-r ${getRoleColor()} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1`}
                    >
                      {getRoleIcon()}
                      {role === "Admin" ? "ADMIN" : "USER"}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="text-center md:text-left flex-1">
                    <h2 className="text-4xl font-bold text-white mb-2">{username}</h2>
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                      <FaShieldAlt className="text-emerald-200" />
                      <span className="text-xl text-emerald-100">{getRoleText()}</span>
                    </div>

                    {/* User Stats */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6">
                      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
                        <div className="text-2xl font-bold text-white">Active</div>
                        <div className="text-emerald-200 text-sm">Status</div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
                        <div className="text-2xl font-bold text-white">2024</div>
                        <div className="text-emerald-200 text-sm">Member Since</div>
                      </div>
                      {role === "Admin" && (
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2">
                          <div className="text-2xl font-bold text-yellow-300">∞</div>
                          <div className="text-emerald-200 text-sm">Privileges</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Content */}
              <div className="p-8 md:p-12">
                {/* Account Details Section */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-emerald-300 mb-6 flex items-center gap-3">
                    <FaUserAlt className="text-emerald-400" />
                    Account Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center">
                          <FaUserAlt className="text-white" />
                        </div>
                        <div>
                          <div className="text-gray-300 text-sm">Username</div>
                          <div className="text-white font-semibold text-lg">{username}</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 bg-gradient-to-br ${getRoleColor()} rounded-lg flex items-center justify-center`}
                        >
                          {getRoleIcon()}
                        </div>
                        <div>
                          <div className="text-gray-300 text-sm">Account Type</div>
                          <div className="text-white font-semibold text-lg">{getRoleText()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Methods Section */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-emerald-300 mb-6 flex items-center gap-3">
                    <FaCreditCard className="text-emerald-400" />
                    Payment Methods
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Add New Card */}
                    <div
                      onClick={handleAddCardClick}
                      className="group/card bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-600 rounded-lg flex items-center justify-center group-hover/card:scale-110 transition-transform duration-300">
                          <FaPlus className="text-white" />
                        </div>
                        <div>
                          <div className="text-white font-semibold">Add New Card</div>
                          <div className="text-gray-300 text-sm">Add a payment method</div>
                        </div>
                      </div>
                      <div className="text-emerald-400 text-xs font-medium">Click to add →</div>
                    </div>

                    {/* View Cards */}
                    <div
                      onClick={handleViewCardsClick}
                      className="group/card bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg flex items-center justify-center group-hover/card:scale-110 transition-transform duration-300">
                          <FaEye className="text-white" />
                        </div>
                        <div>
                          <div className="text-white font-semibold">Manage Cards</div>
                          <div className="text-gray-300 text-sm">View and edit your cards</div>
                        </div>
                      </div>
                      <div className="text-blue-400 text-xs font-medium">Click to view →</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Section */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-emerald-300 mb-6 flex items-center gap-3">
                    <FaChartLine className="text-emerald-400" />
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Edit Profile */}
                    <div className="group/card bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center group-hover/card:scale-110 transition-transform duration-300">
                          <FaEdit className="text-white" />
                        </div>
                        <div>
                          <div className="text-white font-semibold">Edit Profile</div>
                          <div className="text-gray-300 text-sm">Update your information</div>
                        </div>
                      </div>
                    </div>

                    {/* View Activity */}
                    <div className="group/card bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-600 rounded-lg flex items-center justify-center group-hover/card:scale-110 transition-transform duration-300">
                          <FaChartLine className="text-white" />
                        </div>
                        <div>
                          <div className="text-white font-semibold">View Activity</div>
                          <div className="text-gray-300 text-sm">Check your recent actions</div>
                        </div>
                      </div>
                    </div>

                    {/* Security Settings */}
                    <div className="group/card bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-lg flex items-center justify-center group-hover/card:scale-110 transition-transform duration-300">
                          <FaShieldAlt className="text-white" />
                        </div>
                        <div>
                          <div className="text-white font-semibold">Security</div>
                          <div className="text-gray-300 text-sm">Manage security settings</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-white/10 pt-8">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleSettingsClick}
                      className="group flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-3"
                    >
                      <FaCog className="group-hover:rotate-180 transition-transform duration-500" />
                      Account Settings
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    <button
                      onClick={handleLogoutClick}
                      className="group bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-3"
                    >
                      <FaSignOutAlt className="group-hover:scale-110 transition-transform" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {/* Account Security */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                    <FaShieldAlt className="text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">Security Status</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Two-Factor Auth</span>
                    <span className="text-green-400 text-sm font-semibold">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Last Login</span>
                    <span className="text-gray-300 text-sm">Today</span>
                  </div>
                </div>
              </div>

              {/* Account Activity */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <FaChartLine className="text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">Activity</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Sessions Today</span>
                    <span className="text-blue-400 text-sm font-semibold">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Total Logins</span>
                    <span className="text-gray-300 text-sm">127</span>
                  </div>
                </div>
              </div>

              {/* Account Preferences */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                    <FaCog className="text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">Preferences</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Theme</span>
                    <span className="text-purple-400 text-sm font-semibold">Dark</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Notifications</span>
                    <span className="text-gray-300 text-sm">Enabled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile

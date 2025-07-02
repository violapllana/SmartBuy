"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import logo from "../Images/SmartBuyLogo2.png"
import {
  FaUserCircle,
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaHeart,
  FaHome,
  FaComments,
  FaBox,
  FaListAlt,
  FaSignOutAlt,
  FaSignInAlt,
} from "react-icons/fa"

const Header = ({ isLoggedIn, handleLogout, role, username }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Navigation helpers
  const navigateAndCloseMenu = (path) => {
    navigate(path)
    setMenuOpen(false)
  }

  const toggleMenu = () => setMenuOpen((prev) => !prev)
  const closeMenu = () => setMenuOpen(false)

  // Navigation items
  const navItems = [
    { name: "Home", path: "/", icon: <FaHome /> },
    {
      name: "Contact",
      path: role === "Admin" ? "/chatcomponent" : "/chatcomponentforusers",
      icon: <FaComments />,
    },
    { name: "Products", path: "/productlist", icon: <FaBox /> },
    {name: "My Shipments", path: "/myshipment"}
  ]

  // Admin-only navigation items
  const adminNavItems = [
    { name: "Order List", path: "/orderforadmins", icon: <FaListAlt /> },
    { name: "Products List", path: "/products", icon: <FaBox /> },
        { name: "Shipment Manager", path: "/shipment", icon: <FaBox /> },

  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/80 backdrop-blur-md border-b border-emerald-500/20 shadow-2xl shadow-emerald-500/10"
            : "bg-gradient-to-r from-black via-gray-900 to-green-900"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 lg:px-8 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="group relative cursor-pointer" onClick={() => navigateAndCloseMenu("/")}>
            <div className="absolute -inset-3 bg-gradient-to-r from-emerald-400 via-green-400 to-yellow-400 rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-all duration-500 animate-pulse" />
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500 to-yellow-500 rounded-lg blur opacity-0 group-hover:opacity-60 transition-all duration-300" />
            <div className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-md border-2 border-white/10 group-hover:border-emerald-400/50 transition-all duration-300 p-3 group-hover:bg-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img
                src={logo || "/placeholder.svg"}
                alt="SmartBuy Logo"
                className="relative z-10 w-24 h-16 object-contain transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-2 filter drop-shadow-lg group-hover:drop-shadow-2xl group-hover:brightness-125 group-hover:contrast-125"
                style={{
                  borderRadius: "6px",
                  mixBlendMode: "normal",
                }}
              />

              {/* Cool animated border effect */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 via-transparent to-yellow-400 p-[1px]">
                  <div className="w-full h-full rounded-xl bg-transparent" />
                </div>
              </div>

              {/* Sparkle effects */}
              <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300" />
              <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-emerald-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                className="group relative flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-semibold transition-all duration-300 hover:scale-105"
                onClick={() => navigateAndCloseMenu(item.path)}
              >
                <span className="text-sm opacity-70 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                {item.name}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-emerald-400 group-hover:w-full transition-all duration-300" />
              </button>
            ))}

            {role === "Admin" &&
              adminNavItems.map((item) => (
                <button
                  key={item.name}
                  className="group relative flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold transition-all duration-300 hover:scale-105"
                  onClick={() => navigateAndCloseMenu(item.path)}
                >
                  <span className="text-sm opacity-70 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                  {item.name}
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-yellow-400 group-hover:w-full transition-all duration-300" />
                </button>
              ))}
          </nav>

          {/* Desktop User Section */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Cart & Wishlist Icons */}
            {isLoggedIn && (
              <div className="flex items-center gap-3">
                <button
                  className="group relative p-2 text-white hover:text-yellow-400 transition-all duration-300 hover:scale-110"
                  onClick={() => navigateAndCloseMenu("/order")}
                  aria-label="Shopping Cart"
                >
                  <div className="absolute inset-0 bg-yellow-400/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                  <FaShoppingCart className="w-5 h-5 relative z-10" />
                </button>
                <button
                  className="group relative p-2 text-white hover:text-red-400 transition-all duration-300 hover:scale-110"
                  onClick={() => navigateAndCloseMenu("/wishlist")}
                  aria-label="Wishlist"
                >
                  <div className="absolute inset-0 bg-red-400/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                  <FaHeart className="w-5 h-5 relative z-10" />
                </button>
              </div>
            )}

            {/* User Profile & Auth */}
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <button
                  className="group flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                  onClick={() => navigateAndCloseMenu("/profile")}
                >
                  <FaUserCircle className="w-8 h-8 text-white group-hover:text-yellow-400 transition-colors duration-300" />
                  <div className="text-left">
                    <div className="text-white text-sm font-medium">{username}</div>
                    {role === "Admin" && <div className="text-yellow-400 text-xs font-bold animate-pulse">ADMIN</div>}
                  </div>
                </button>

                <button
                  className="group relative flex items-center gap-2 px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            ) : (
              <button
                className="group relative flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
                onClick={() => navigateAndCloseMenu("/login")}
              >
                <FaSignInAlt className="w-4 h-4" />
                Log In
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden relative p-2 text-white hover:text-yellow-400 transition-colors duration-300"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              {menuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {menuOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={closeMenu} />}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-gradient-to-b from-gray-900 via-emerald-900/80 to-gray-900 backdrop-blur-md border-l border-emerald-500/20 shadow-2xl transform transition-transform duration-300 z-50 lg:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-emerald-500/20">
          <h2 className="text-xl font-bold text-white">Menu</h2>
          <button onClick={closeMenu} className="p-2 text-white hover:text-yellow-400 transition-colors duration-300">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex flex-col p-4 space-y-2">
          {navItems.map((item, index) => (
            <button
              key={item.name}
              className="group flex items-center gap-3 p-3 text-yellow-400 hover:text-yellow-300 hover:bg-white/10 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              onClick={() => navigateAndCloseMenu(item.path)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <span className="text-lg opacity-70 group-hover:opacity-100 transition-opacity">{item.icon}</span>
              {item.name}
            </button>
          ))}

          {role === "Admin" && (
            <>
              <div className="my-2 border-t border-emerald-500/20" />
              <div className="text-emerald-400 text-sm font-bold px-3 mb-2">Admin Panel</div>
              {adminNavItems.map((item, index) => (
                <button
                  key={item.name}
                  className="group flex items-center gap-3 p-3 text-emerald-400 hover:text-emerald-300 hover:bg-white/10 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                  onClick={() => navigateAndCloseMenu(item.path)}
                  style={{ animationDelay: `${(navItems.length + index) * 0.1}s` }}
                >
                  <span className="text-lg opacity-70 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </>
          )}
        </nav>

        {/* Mobile User Section */}
        <div className="mt-auto p-4 border-t border-emerald-500/20">
          {isLoggedIn ? (
            <div className="space-y-4">
              {/* Mobile Cart & Wishlist */}
              <div className="flex items-center gap-3">
                <button
                  className="flex-1 flex items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all duration-300"
                  onClick={() => navigateAndCloseMenu("/order")}
                >
                  <FaShoppingCart className="w-4 h-4" />
                  Cart
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all duration-300"
                  onClick={() => navigateAndCloseMenu("/wishlist")}
                >
                  <FaHeart className="w-4 h-4" />
                  Wishlist
                </button>
              </div>

              {/* Mobile Profile */}
              <button
                className="w-full flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all duration-300"
                onClick={() => navigateAndCloseMenu("/profile")}
              >
                <FaUserCircle className="w-6 h-6" />
                <div className="text-left">
                  <div className="font-medium">{username}</div>
                  {role === "Admin" && <div className="text-yellow-400 text-xs font-bold">ADMIN</div>}
                </div>
              </button>

              {/* Mobile Logout */}
              <button
                className="w-full flex items-center justify-center gap-2 p-3 bg-red-600/80 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-300"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="w-4 h-4" />
                Log Out
              </button>
            </div>
          ) : (
            <button
              className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold rounded-lg transition-all duration-300"
              onClick={() => navigateAndCloseMenu("/login")}
            >
              <FaSignInAlt className="w-4 h-4" />
              Log In
            </button>
          )}
        </div>
      </div>

      {/* Proper Spacer to prevent content from hiding behind fixed header */}
      <div className="h-24" />
    </>
  )
}

export default Header

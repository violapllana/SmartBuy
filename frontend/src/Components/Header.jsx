import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../Images/SmartBuyLogo.webp";
import {
  FaUserCircle,
  FaBars,
  FaTimes,
  FaArrowLeft,
  FaShoppingCart,
  FaHeart,
} from "react-icons/fa";

const Header = ({ isLoggedIn, handleLogout, role, username }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Navigation helpers
  const navigateAndCloseMenu = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-black via-black to-green-900 text-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo */}
        <div
          className="relative w-36 h-auto overflow-hidden cursor-pointer rounded-lg border-4 border-transparent hover:border-green-500 transition-all duration-300 ease-in-out"
          onClick={() => navigateAndCloseMenu("/")}
        >
          <img
            src={logo}
            alt="Logo"
            className="w-full h-auto transform transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:outline hover:outline-green-500 hover:shadow-green-500"
            style={{ borderRadius: "8px" }}
          />
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="text-2xl">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Back Arrow */}
        {menuOpen && (
          <div className="absolute top-4 left-4 lg:hidden z-50">
            <button onClick={closeMenu} className="text-xl text-white">
              <FaArrowLeft />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav
          className={`fixed top-0 left-0 w-full h-screen bg-green-800 bg-opacity-95 text-center transform ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 lg:static lg:w-auto lg:h-auto lg:bg-transparent lg:transform-none lg:flex lg:items-center lg:gap-6`}
        >
          <ul className="flex flex-col items-center gap-6 mt-20 lg:mt-0 lg:flex-row">
            <li>
              <button
                className="text-lg font-semibold text-yellow-400 hover:text-yellow-600 transform hover:-translate-y-1 transition-all"
                onClick={() => navigateAndCloseMenu("/")}
              >
                Home
              </button>
            </li>
            <li>
              <button
                className="text-lg font-semibold text-yellow-400 hover:text-yellow-600 transform hover:-translate-y-1 transition-all"
                onClick={() =>
                  navigateAndCloseMenu(
                    role === "Admin" ? "/chatcomponent" : "/chatcomponentforusers"
                  )
                }
              >
                Contact
              </button>
            </li>
            <li>
              <button
                className="text-lg font-semibold text-yellow-400 hover:text-yellow-600 transform hover:-translate-y-1 transition-all"
                onClick={() => navigateAndCloseMenu("/productlist")}
              >
                Products
              </button>
            </li>
          </ul>

          {/* User Section & Icons */}
          <div className="mt-full lg:mt-0 lg:flex lg:items-center lg:gap-4">
            {/* Cart & Wishlist Icons */}
            {isLoggedIn && (
              <div className="flex items-center gap-4 mt-4 lg:mt-0 lg:ml-4">
                <button
                  className="text-white hover:text-yellow-400 transition transform hover:scale-110"
                  onClick={() => navigateAndCloseMenu("/order")}
                  aria-label="Shopping Cart"
                >
                  <FaShoppingCart className="w-6 h-6" />
                </button>
                <button
                  className="text-white hover:text-yellow-400 transition transform hover:scale-110"
                  onClick={() => navigateAndCloseMenu("/wishlist")}
                  aria-label="Wishlist"
                >
                  <FaHeart className="w-6 h-6" />
                </button>
              </div>
            )}

            {/* User Profile & Logout/Login */}
            {isLoggedIn ? (
              <div className="flex flex-col items-center lg:flex-row lg:items-center lg:gap-2">
                <FaUserCircle
                  className="w-10 h-10 text-white transition duration-400 ease-in-out transform cursor-pointer hover:text-yellow-400 hover:scale-110 hover:drop-shadow-md"
                  onClick={() => navigateAndCloseMenu("/profile")}
                  aria-label="User Profile"
                />
                <span>
                  {username}{" "}
                  {role === "Admin" && (
                    <span className="text-yellow-500 font-bold animate-pulse">
                      [ADMIN]
                    </span>
                  )}
                </span>

                <button
                  className="relative mt-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-lg transition-all duration-300 ease-in-out lg:mt-0 overflow-hidden group"
                  onClick={handleLogout}
                >
                  <span className="relative z-10">Log Out</span>
                  <span className="absolute inset-0 bg-red-500 opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-20"></span>
                  <span className="absolute inset-0 bg-red-500 transform scale-0 group-hover:scale-110 transition-all duration-300 ease-in-out"></span>
                </button>
              </div>
            ) : (
              <button
                className="relative mt-4 px-6 py-3 bg-green-800 text-yellow-400 font-semibold rounded-md shadow-lg transition-all duration-300 ease-in-out lg:mt-0 overflow-hidden group"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/login");
                }}
              >
                <span className="relative z-10">Log In</span>
                <span className="absolute inset-0 bg-green-500 opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-20"></span>
                <span className="absolute inset-0 bg-green-500 transform scale-0 group-hover:scale-110 transition-all duration-300 ease-in-out"></span>
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;

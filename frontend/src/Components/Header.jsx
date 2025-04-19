import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../Images/SmartBuyLogo.webp";
import { FaUserCircle, FaBars, FaTimes, FaArrowLeft } from "react-icons/fa"; // Added FaArrowLeft

const Header = ({ isLoggedIn, handleLogout, role, username }) => {
  const [menuOpen, setMenuOpen] = useState(false); // For toggling menu on mobile
  const navigate = useNavigate();

  // Handle login click - redirects to login page
  const handleLoginClick = () => {
    setMenuOpen(false);  // Close the mobile menu
    navigate("/login");  // Navigate to the login page
  };

  // Toggle menu on small screens
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Close the menu when the back arrow is clicked
  const handleBackClick = () => {
    setMenuOpen(false); // Close the menu
  };

  // Render the header UI
  return (
<header className="sticky top-0 z-50 bg-gradient-to-r from-black via-black to-green-900 text-white shadow-md">
<div className="flex items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo */}
        <div
  className="relative w-36 h-auto overflow-hidden cursor-pointer rounded-lg border-4 border-transparent hover:border-green-500 transition-all duration-300 ease-in-out"
  onClick={() => navigate("/")}
>
  <img
    src={logo}
    alt="Logo"
    className="w-full h-auto transform transition-transform duration-300 hover:scale-110 hover:shadow-lg hover:outline hover:outline-green-500 hover:shadow-green-500"
    style={{
      borderRadius: "8px", // Keeping the logo with rounded corners
    }}
  />
</div>



        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden">
          <button onClick={toggleMenu} className="text-2xl">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Back Arrow */}
        {menuOpen && (
          <div className="absolute top-4 left-4 lg:hidden z-50">
            <button onClick={handleBackClick} className="text-xl text-white">
              <FaArrowLeft />
            </button>
          </div>
        )}

        {/* Desktop Navigation */}
        <nav
          className={`fixed top-0 left-0 w-full h-screen bg-green-800 bg-opacity-95 text-center transform ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 lg:static lg:w-auto lg:h-auto lg:bg-transparent lg:transform-none lg:flex lg:items-center lg:gap-6`}
        >
          <ul className="flex flex-col items-center gap-6 mt-20 lg:mt-0 lg:flex-row">
          <li>
          <button
  className="text-lg font-semibold text-yellow-400 hover:text-yellow-600 transform hover:translate-y-[-4px] transition-all"
  onClick={() => {
    navigate("/");
    setMenuOpen(false);
  }}
>
  Home
</button>

</li>

           
           
          
            
            <li>
            <button
  className="text-lg font-semibold text-yellow-400 hover:text-yellow-600 transform hover:translate-y-[-4px] transition-all"
  onClick={() => {
    navigate("/contact");
    setMenuOpen(false);
  }}
>
  Contact
</button>
            </li>
          </ul>

          {/* Admin Section */}
          {role === "Admin" && (
            <div className="mt-20 lg:mt-0 lg:flex lg:items-center lg:gap-4">
              <div className="relative group">
                {/* <button className="text-lg font-semibold hover:text-gray-300 transition">
                  Admin Dashboard
                </button> */}
                {/* Dropdown menu */}
                <ul className="absolute left-0 mt-2 space-y-2 bg-gradient-to-r from-purple-700 via-pink-500 to-red-500 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:block transition-all duration-300 ease-in-out">
                  <li>
                    <button
                      className="block px-4 py-2 text-lg hover:text-gray-400 transition"
                      onClick={() => {
                        navigate("/ushqimi");
                      }}
                    >
                      Menaxhmenti i Ushqimeve
                    </button>
                  </li>
                  <li>
                    <button
                      className="block px-4 py-2 text-lg hover:text-gray-400 transition"
                      onClick={() => {
                        navigate("/dieta");
                      }}
                    >
                      Menaxhmenti i Dietave
                    </button>
                  </li>
                  <li>
                    <button
                      className="block px-4 py-2 text-lg hover:text-gray-400 transition"
                      onClick={() => {
                        navigate("/receta");
                      }}
                    >
                      Menaxhmenti i Recetave
                    </button>
                  </li>
                 
                </ul>
              </div>
            </div>
          )}

          {/* User Section */}
          <div className="mt-full lg:mt-0 lg:flex lg:items-center lg:gap-4">
          {isLoggedIn ? (
              <div className="flex flex-col items-center lg:flex-row lg:items-center lg:gap-2">
                <FaUserCircle
                  className="w-10 h-10 text-white hover:text-gray-300 transition cursor-pointer"
                  onClick={() => {
                    navigate("/profile");
                    setMenuOpen(false);
                  }}
                />
                <span>{role === "Admin" ? `${username} (Admin)` : username}</span>

                {/* Log Out Button with hover effect */}
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
              // Log In Button with hover effect
              <button
              className="relative mt-4 px-6 py-3 bg-green-800 text-yellow-400 font-semibold rounded-md shadow-lg transition-all duration-300 ease-in-out lg:mt-0 overflow-hidden group"
              onClick={handleLoginClick}
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

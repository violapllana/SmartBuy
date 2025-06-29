"use client"

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faTwitter, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faMapMarkerAlt, faEnvelope, faPhone, faHeart } from '@fortawesome/free-solid-svg-icons'
import Cookies from 'js-cookie'

const Footer = () => {
  const role = Cookies.get("role")

  const quickLinks = [
    { label: "Home", href: "/" },
    { 
      label: "Contact", 
      href: role === "Admin" ? "/chatcomponent" : "/chatcomponentforusers" 
    },
    { label: "Products", href: "/productlist" },
  ]

  const socialLinks = [
    { icon: faFacebook, href: 'https://facebook.com', color: 'hover:text-blue-400' },
    { icon: faTwitter, href: 'https://twitter.com', color: 'hover:text-sky-400' },
    { icon: faInstagram, href: 'https://instagram.com', color: 'hover:text-pink-400' },
    { icon: faYoutube, href: 'https://youtube.com', color: 'hover:text-red-400' },
  ]

  return (
    <footer className="relative bg-gradient-to-br from-black via-gray-900 to-green-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-400/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-400/5 rounded-full blur-xl animate-bounce" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30" />

      <div className="relative container mx-auto px-4 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Company Section */}
          <div className="group">
            <div className="relative">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">
                Smart Buy
              </h2>
              <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-yellow-400 group-hover:w-full transition-all duration-500" />
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm border border-emerald-500/20 rounded-lg p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <p className="text-emerald-300 font-semibold text-center flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faHeart} className="text-red-400 animate-pulse" />
                Delivering love since 2007
                <FontAwesomeIcon icon={faHeart} className="text-red-400 animate-pulse" />
              </p>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="group">
            <div className="relative">
              <h2 className="text-xl font-bold mb-6 text-white group-hover:text-emerald-300 transition-colors duration-300">
                Quick Links
              </h2>
              <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-emerald-400 group-hover:w-full transition-all duration-500" />
            </div>
            
            <ul className="space-y-3">
              {quickLinks.map(({ label, href }, i) => (
                <li key={i}>
                  <a
                    href={href}
                    className="group/link flex items-center gap-2 text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-emerald-400 hover:via-yellow-400 hover:to-emerald-500 transition-all duration-300 hover:translate-x-2"
                  >
                    <div className="w-1 h-1 bg-emerald-400 rounded-full opacity-0 group-hover/link:opacity-100 transition-opacity duration-300" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information Section */}
          <div className="group">
            <div className="relative">
              <h2 className="text-xl font-bold mb-6 text-white group-hover:text-emerald-300 transition-colors duration-300">
                Contact Info
              </h2>
              <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-400 to-yellow-400 group-hover:w-full transition-all duration-500" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-lg hover:border-emerald-400/50 transition-all duration-300 hover:scale-105">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-emerald-400 mt-1 flex-shrink-0" />
                <p className="text-gray-300 text-sm leading-relaxed">
                  Rruga Adem Jashari<br />
                  Qyteti Vushtrri, 42000
                </p>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-lg hover:border-emerald-400/50 transition-all duration-300 hover:scale-105">
                <FontAwesomeIcon icon={faEnvelope} className="text-yellow-400 flex-shrink-0" />
                <a href="mailto:smartbuy@gmail.com" className="text-gray-300 text-sm hover:text-yellow-300 transition-colors">
                  smartbuy@gmail.com
                </a>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-lg hover:border-emerald-400/50 transition-all duration-300 hover:scale-105">
                <FontAwesomeIcon icon={faPhone} className="text-emerald-400 flex-shrink-0" />
                <a href="tel:+38349456780" className="text-gray-300 text-sm hover:text-emerald-300 transition-colors">
                  +383 49 456 780
                </a>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="group">
            <div className="relative">
              <h2 className="text-xl font-bold mb-6 text-white group-hover:text-emerald-300 transition-colors duration-300">
                Follow Us
              </h2>
              <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-emerald-400 group-hover:w-full transition-all duration-500" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {socialLinks.map(({ icon, href, color }, index) => (
                <a
                  key={index}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group/social flex items-center justify-center p-4 bg-white/5 backdrop-blur-sm border border-gray-700/50 rounded-lg transition-all duration-300 hover:scale-110 hover:border-emerald-400/50 ${color}`}
                >
                  <FontAwesomeIcon 
                    icon={icon} 
                    size="lg" 
                    className="group-hover/social:scale-125 transition-transform duration-300" 
                  />
                </a>
              ))}
            </div>
            
            {/* Newsletter Signup */}
            <div className="mt-6 p-4 bg-gradient-to-r from-emerald-900/30 to-green-900/30 backdrop-blur-sm border border-emerald-500/20 rounded-lg">
              <p className="text-sm text-emerald-300 mb-3 font-semibold">Stay Updated!</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-white/10 border border-gray-600 rounded text-sm text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 transition-colors"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white text-sm font-semibold rounded transition-all duration-300 hover:scale-105">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gradient-to-r from-transparent via-emerald-500/30 to-transparent pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <p className="text-gray-300 text-sm">
                &copy; 2007 - {new Date().getFullYear()} SmartBuy. All rights reserved.
              </p>
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <a href="/privacy" className="hover:text-emerald-400 transition-colors duration-300">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="/terms" className="hover:text-emerald-400 transition-colors duration-300">
                Terms of Service
              </a>
              <span>•</span>
              <a href="/cookies" className="hover:text-emerald-400 transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
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
        
        .animate-pulse {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-bounce {
          animation: bounce 4s infinite;
        }
      `}</style>
    </footer>
  )
}

export default Footer

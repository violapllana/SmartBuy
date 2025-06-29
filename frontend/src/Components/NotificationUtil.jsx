"use client"

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CustomNotification = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Smooth entrance animation
    setTimeout(() => setIsVisible(true), 100);

    // Enhanced pulse animation every 4 seconds
    const pulseTimer = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 1200);
    }, 4000);

    return () => clearInterval(pulseTimer);
  }, []);

  const handleClick = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate('/chatcomponent');
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible && !isExiting) return null;

  return (
    <>
      {/* Backdrop glow */}
      <div 
        className={`fixed bottom-5 left-5 w-96 h-24 bg-gradient-to-r from-emerald-500/20 via-green-500/20 to-yellow-400/20 rounded-3xl blur-2xl transition-all duration-700 z-40 ${
          isPulsing ? 'scale-110 opacity-80' : 'scale-100 opacity-60'
        }`}
      />

      {/* Main notification container */}
      <div
        onClick={handleClick}
        className={`
          fixed bottom-5 left-5 max-w-md w-full mx-4 z-50 cursor-pointer
          transition-all duration-800 ease-out group
          ${isExiting 
            ? "translate-x-full translate-y-4 opacity-0 scale-95 rotate-3" 
            : isVisible 
              ? "translate-x-0 translate-y-0 opacity-100 scale-100 rotate-0" 
              : "translate-x-full translate-y-8 opacity-0 scale-90 rotate-6"
          }
        `}
      >
        {/* Main Card */}
        <div className="group relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500">
          
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-2 right-2 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute bottom-2 left-2 w-12 h-12 bg-yellow-400/10 rounded-full blur-lg animate-pulse" />
          </div>

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30" />

          {/* Header Section */}
          <div className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 border-b border-white/10 p-4 relative">
            <div className="flex items-center gap-4">
              {/* Icon with glow effect */}
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6 text-white drop-shadow-lg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  />
                </svg>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">New Notification</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-emerald-200 text-sm">Just now</span>
                </div>
              </div>

              {/* Action indicator */}
              <div className="flex flex-col items-center gap-1 opacity-60 group-hover:opacity-100 transition-all duration-300">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-4 relative z-10">
            <div className="mb-4">
              <p className="text-gray-200 text-sm leading-relaxed mb-3">
                {message}
              </p>
              
              {/* Action hint */}
              <div className="flex items-center gap-2 p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                <span className="text-gray-300 text-xs">Click to view details</span>
                <svg className="w-3 h-3 text-emerald-300 ml-auto animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 opacity-20">
            <svg
              className="w-8 h-8 text-emerald-400 animate-spin-slow"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

          {/* Floating Particles */}
          <div className="absolute bottom-2 left-8 w-1 h-1 bg-emerald-400 rounded-full opacity-60 animate-float" />
          <div className="absolute top-8 right-12 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-40 animate-float-delayed" />
          <div className="absolute top-6 left-16 w-0.5 h-0.5 bg-green-400 rounded-full opacity-50 animate-float" />

          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        </div>
      </div>

      {/* Custom styles matching your CookieConsent */}
      <style jsx="true">{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-pulse {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .group:hover {
          animation: float 3s ease-in-out infinite;
        }
        
        .group:active {
          transform: scale(0.98);
        }
      `}</style>
    </>
  );
};

export default CustomNotification;
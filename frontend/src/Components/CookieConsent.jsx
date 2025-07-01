"use client"

import { useState, useEffect } from "react"
import Cookies from "js-cookie"

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const consent = Cookies.get("cookieConsent")
    if (!consent) {
      // Delay showing the consent to make it feel more natural
      setTimeout(() => setIsVisible(true), 2000)
    }
  }, [])

  const handleAccept = () => {
    Cookies.set("cookieConsent", "accepted", { expires: 365 })
    setIsExiting(true)
    setTimeout(() => setIsVisible(false), 800)
  }

  const handleDecline = () => {
    Cookies.set("cookieConsent", "declined", { expires: 365 })
    setIsExiting(true)
    setTimeout(() => setIsVisible(false), 800)
  }

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-800 ${
          isExiting ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Cookie Consent Modal */}
      <div
        className={`fixed bottom-6 right-6 max-w-md w-full mx-4 z-50 transition-all duration-800 ease-out ${
          isExiting
            ? "translate-x-full translate-y-4 opacity-0 scale-95 rotate-3"
            : isVisible
              ? "translate-x-0 translate-y-0 opacity-100 scale-100 rotate-0"
              : "translate-x-full translate-y-8 opacity-0 scale-90 rotate-6"
        }`}
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

          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600/20 to-green-600/20 border-b border-white/10 p-6 relative">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">We Value Your Privacy</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-emerald-200 text-sm">Secure & Transparent</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 relative z-10">
            <div className="mb-6">
              <p className="text-gray-200 text-sm leading-relaxed mb-4">
                Our site uses cookies to enhance your browsing experience, analyze site traffic, and personalize
                content. Your privacy matters to us.
              </p>

              {/* Cookie Types */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-3 p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-gray-300 text-xs">Essential cookies (always active)</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                  <span className="text-gray-300 text-xs">Analytics & performance cookies</span>
                </div>
              </div>

              <div className="text-center">
                <a
                  href="/privacy-policy"
                  className="text-emerald-300 hover:text-emerald-200 text-xs underline transition-colors duration-300"
                >
                  Learn more about our privacy policy
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleDecline} variant="outline">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Decline
              </Button>
              <Button onClick={handleAccept} variant="solid">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Accept All
              </Button>
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
      `}</style>
    </>
  )
}

const Button = ({ onClick, variant, children }) => {
  const baseClasses =
    "group relative flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-transparent"

  const variantClasses = {
    solid: `
      bg-gradient-to-r from-emerald-500 to-green-500 
      hover:from-emerald-600 hover:to-green-600 
      text-white shadow-lg hover:shadow-emerald-500/25
      border border-emerald-400/20
    `,
    outline: `
      bg-white/10 backdrop-blur-sm border border-white/30 
      hover:bg-white/20 hover:border-white/40 
      text-white hover:text-emerald-100
      shadow-lg hover:shadow-white/10
    `,
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant]}`}>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <span className="relative z-10 flex items-center">{children}</span>
    </button>
  )
}

export default CookieConsent

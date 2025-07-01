"use client"

import { useEffect } from "react"
import { Wifi, Shield, Star } from "lucide-react"

// Premium brand logos with modern styling
const VisaLogo = () => (
  <svg width="64" height="20" viewBox="0 0 64 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="visaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1A1F71" />
        <stop offset="100%" stopColor="#2E3A87" />
      </linearGradient>
    </defs>
    <rect width="64" height="20" fill="url(#visaGrad)" rx="4" />
    <text
      x="32"
      y="14"
      fill="white"
      fontSize="11"
      fontWeight="700"
      fontFamily="Arial, sans-serif"
      textAnchor="middle"
      letterSpacing="1px"
    >
      VISA
    </text>
  </svg>
)

const MasterCardLogo = () => (
  <svg width="64" height="40" viewBox="0 0 64 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mcRed" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#EB001B" />
        <stop offset="100%" stopColor="#C5001A" />
      </linearGradient>
      <linearGradient id="mcYellow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F79E1B" />
        <stop offset="100%" stopColor="#E6891A" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="16" fill="url(#mcRed)" />
    <circle cx="44" cy="20" r="16" fill="url(#mcYellow)" />
    <path d="M32 8a15.9 15.9 0 00-8 12 15.9 15.9 0 008 12 15.9 15.9 0 008-12 15.9 15.9 0 00-8-12z" fill="#FF5F00" />
  </svg>
)

const AmexLogo = () => (
  <svg width="64" height="24" viewBox="0 0 64 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="amexGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#006FCF" />
        <stop offset="100%" stopColor="#2E77BC" />
      </linearGradient>
    </defs>
    <rect width="64" height="24" fill="url(#amexGrad)" rx="4" />
    <text x="32" y="16" fill="white" fontSize="8" fontWeight="700" fontFamily="Arial, sans-serif" textAnchor="middle">
      AMERICAN EXPRESS
    </text>
  </svg>
)

const getCardLogo = (type) => {
  switch ((type || "").toLowerCase()) {
    case "visa":
      return <VisaLogo />
    case "mastercard":
      return <MasterCardLogo />
    case "amex":
    case "american express":
      return <AmexLogo />
    default:
      return (
        <div className="w-16 h-10 bg-gradient-to-r from-slate-600 to-slate-800 rounded-lg flex items-center justify-center border border-white/20">
          <span className="text-white text-xs font-bold tracking-wider">PREMIUM</span>
        </div>
      )
  }
}

const getCardTheme = (type) => {
  switch ((type || "").toLowerCase()) {
    case "visa":
      return {
        gradient: "from-slate-900 via-blue-900 to-indigo-900",
        accent: "from-blue-400 to-indigo-500",
        glow: "shadow-blue-500/20",
        pattern: "bg-blue-500/5",
      }
    case "mastercard":
      return {
        gradient: "from-gray-900 via-red-900 to-orange-900",
        accent: "from-red-400 to-orange-500",
        glow: "shadow-red-500/20",
        pattern: "bg-red-500/5",
      }
    case "amex":
      return {
        gradient: "from-slate-900 via-gray-800 to-zinc-900",
        accent: "from-gray-300 to-white",
        glow: "shadow-gray-500/20",
        pattern: "bg-gray-500/5",
      }
    default:
      return {
        gradient: "from-black via-gray-900 to-slate-900",
        accent: "from-purple-400 to-pink-500",
        glow: "shadow-purple-500/20",
        pattern: "bg-purple-500/5",
      }
  }
}

const CreditCard = ({ card }) => {
  useEffect(() => {
    console.log("Card prop received:", card)
  }, [card])

  const theme = getCardTheme(card.cardType)
  const maskedNumber = card.cardNumber || `**** **** **** ${card.last4 || "0000"}`
  const expMonth = card.expMonth?.toString().padStart(2, "0") || card.expiryMonth?.toString().padStart(2, "0") || "00"
  const expYear = card.expYear
    ? card.expYear.toString().slice(-2)
    : card.expiryYear
      ? card.expiryYear.toString().slice(-2)
      : "00"

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-8px) rotate(180deg);
          }
        }
        
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-6px) rotate(-180deg);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite 1s;
        }
      `}</style>

      <div className="group relative cursor-pointer transition-all duration-500 hover:scale-105">
        {/* Enhanced shadow system */}
        <div
          className={`absolute inset-0 bg-black/30 rounded-3xl blur-2xl translate-y-4 group-hover:translate-y-6 transition-all duration-500 ${theme.glow}`}
        />
        <div className="absolute inset-0 bg-black/10 rounded-3xl blur-xl translate-y-2 group-hover:translate-y-3 transition-all duration-500" />

        {/* Main card container */}
        <div
          className={`
            relative w-[380px] h-[240px] rounded-3xl text-white overflow-hidden
            bg-gradient-to-br ${theme.gradient}
            border border-white/10 group-hover:border-white/20
            transition-all duration-500
            shadow-2xl group-hover:shadow-3xl
          `}
        >
          {/* Sophisticated background patterns */}
          <div className="absolute inset-0">
            {/* Mesh gradient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_50%)]" />

            {/* Geometric pattern */}
            <div className={`absolute inset-0 ${theme.pattern} opacity-20`}>
              <svg className="w-full h-full" viewBox="0 0 380 240" fill="none">
                <defs>
                  <pattern id="hexPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                      d="M20 5L35 15L35 25L20 35L5 25L5 15Z"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      fill="none"
                      opacity="0.3"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hexPattern)" />
              </svg>
            </div>
          </div>

          {/* Top section with premium elements */}
          <div className="relative z-10 p-8">
            <div className="flex justify-between items-start mb-6">
              {/* Premium badge */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-r ${theme.accent} flex items-center justify-center`}
                >
                  <Star className="w-4 h-4 text-white" fill="currentColor" />
                </div>
                <div>
                  <div className="text-xs font-medium text-white/80 tracking-wider">PREMIUM</div>
                  <div className="text-[10px] text-white/60 uppercase tracking-widest">
                    {card.bankName || "Elite Banking"}
                  </div>
                </div>
              </div>

              {/* Security features */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] text-emerald-400 font-medium">SECURE</span>
                </div>
                <Wifi className="w-5 h-5 text-white/60 rotate-90" />
              </div>
            </div>

            {/* Enhanced EMV chip */}
            <div className="absolute top-20 left-8">
              <div className="relative">
                {/* Chip glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-amber-400 rounded-xl blur-md opacity-60" />

                {/* Main chip */}
                <div className="relative w-14 h-11 bg-gradient-to-br from-yellow-200 via-yellow-300 to-amber-400 rounded-xl shadow-xl border border-yellow-200/50">
                  {/* Chip circuitry pattern */}
                  <div className="absolute inset-2 bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-lg">
                    <div className="grid grid-cols-4 gap-0.5 p-1.5 h-full">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="bg-yellow-400/60 rounded-sm" />
                      ))}
                    </div>
                  </div>

                  {/* Chip highlight */}
                  <div className="absolute top-1 left-1 w-3 h-2 bg-white/40 rounded-sm blur-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Card number with enhanced typography */}
          <div className="relative z-10 px-8 mb-8">
            <div className="font-mono text-2xl tracking-[0.2em] text-white font-light">
              {maskedNumber.split(" ").map((group, index) => (
                <span key={index} className="inline-block mr-4 last:mr-0">
                  {group}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom section with refined layout */}
          <div className="relative z-10 px-8 pb-8">
            <div className="flex justify-between items-end">
              <div className="flex gap-12">
                {/* Cardholder */}
                {/* <div>
                  <div className="text-[10px] text-white/50 uppercase tracking-[0.1em] mb-2 font-medium">
                    Cardholder Name
                  </div>
                  <div className="text-base font-medium text-white uppercase tracking-wider">
                    {userna || card.holderName || "JOHN DOE"}
                  </div>
                </div> */}

                {/* Expiration */}
                <div>
                  <div className="text-[10px] text-white/50 uppercase tracking-[0.1em] mb-2 font-medium">
                    Valid Thru
                  </div>
                  <div className="text-base font-medium text-white font-mono tracking-wider">{`${expMonth}/${expYear}`}</div>
                </div>
              </div>

              {/* Card brand logo */}
              <div className="flex-shrink-0 transform group-hover:scale-110 transition-transform duration-300">
                {getCardLogo(card.cardType)}
              </div>
            </div>
          </div>

          {/* Premium holographic effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]" />

          {/* Edge lighting effect */}
          <div
            className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${theme.accent} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm`}
          />

          {/* Floating particles */}
          <div className="absolute top-4 right-12 w-1 h-1 bg-white/60 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-6 left-12 w-0.5 h-0.5 bg-yellow-400/80 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute top-1/3 right-8 w-0.5 h-0.5 bg-emerald-400/60 rounded-full animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>

        {/* Reflection effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>
    </>
  )
}

export default CreditCard

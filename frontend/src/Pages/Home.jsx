"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import RandomProducts from "../Components/Products/RandomProducts"

// Import icons from a React icon library like react-icons
// For this example, I'll create simple icon components
const Sparkles = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </svg>
)

const Zap = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

const Shield = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
  </svg>
)

const Headphones = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
)

const ArrowRight = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

const Home = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Feature card data
  const features = [
    {
      icon: <Sparkles />,
      title: "Curated Selection",
      description: "We handpick the latest and greatest in tech — from trusted brands and emerging innovators alike.",
      color: "emerald",
    },
    {
      icon: <Zap />,
      title: "Fast & Secure Checkout",
      description:
        "Experience a smooth, fast, and safe shopping process with multiple payment options and quick delivery.",
      color: "yellow",
    },
    {
      icon: <Headphones />,
      title: "Smart Support",
      description: "Got questions? Our support team is tech-savvy, friendly, and always ready to help.",
      color: "emerald",
    },
  ]

  // Tech tips data
  const techTips = [
    "Keep your software updated — it's the easiest way to stay secure.",
    "Use a surge protector to safeguard your electronics during storms.",
    "Organize your cables with simple ties or a cable box to avoid tangles.",
    "Clean your screens regularly with microfiber cloths to extend their life.",
  ]

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transition: "all 0.3s ease-out",
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-400/5 rounded-full blur-2xl animate-bounce" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-400/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Main Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-emerald-900/80 to-gray-800 text-white py-32 overflow-hidden">
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

        <div className="relative max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-full px-4 py-2 mb-8">
            <span className="text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Latest Tech & Gadgets
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-yellow-300 bg-clip-text text-transparent">
              Welcome to Your Go-To Destination for the Latest Tech & Gadgets!
            </span>
          </h1>

          <p className="text-lg sm:text-xl mb-12 text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Explore powerful features that make your shopping experience smarter, faster, and more enjoyable.
            <span className="text-emerald-300 font-semibold"> Tech has never been this accessible!</span>
          </p>

          <div className="group relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <Link
              to="/productlist"
              className="relative flex items-center justify-center bg-gradient-to-r from-yellow-400 to-amber-500 text-black py-3 px-8 sm:py-4 sm:px-10 rounded-full text-lg font-semibold hover:scale-105 transform transition-all duration-300 shadow-2xl hover:shadow-yellow-400/25"
            >
              <span className="flex items-center">
                Start Shopping
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Floating Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            {[
              { number: "10K+", label: "Happy Customers" },
              { number: "500+", label: "Tech Products" },
              { number: "24/7", label: "Support" },
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 p-6 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400 mb-2">{stat.number}</div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
       <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
        <RandomProducts />
      </section>

      {/* Highlights Section */}
      <section className="relative bg-gray-900 py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/20 to-transparent" />

        <div className="relative max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-5 h-5 bg-emerald-400/30 rounded-full"></div>
            <h2 className="text-3xl sm:text-4xl font-bold text-emerald-300">Tech That Inspires</h2>
            <div className="w-5 h-5 bg-emerald-400/30 rounded-full"></div>
          </div>

          <div className="space-y-8 max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur-sm border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10 p-8 rounded-lg">
              <p className="text-lg text-gray-300 leading-relaxed">
                Did you know the average person interacts with over{" "}
                <span className="text-yellow-400 font-semibold">30 gadgets</span> a day? It's time to make yours
                smarter.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-emerald-400/40 transition-all duration-500 hover:scale-105 p-6 rounded-lg">
                <p className="text-gray-300 leading-relaxed">
                  Discover the tools that power your productivity, enhance your entertainment, and bring your ideas to
                  life.
                </p>
              </div>

              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 hover:border-emerald-400/40 transition-all duration-500 hover:scale-105 p-6 rounded-lg">
                <p className="text-gray-300 leading-relaxed">
                  From cutting-edge laptops to smart home essentials — we've got what you need to
                  <span className="text-emerald-400 font-semibold"> stay ahead</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Why Shop With Us?</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-emerald-400 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 hover:border-emerald-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-400/10 p-8 rounded-lg text-center"
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                    feature.color === "yellow"
                      ? "bg-gradient-to-br from-yellow-400/20 to-amber-500/20 border border-yellow-400/30"
                      : "bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 border border-emerald-400/30"
                  } group-hover:scale-110 transition-transform duration-300`}
                >
                  <span className={feature.color === "yellow" ? "text-yellow-400" : "text-emerald-400"}>
                    {feature.icon}
                  </span>
                </div>

                <h3
                  className={`text-2xl font-semibold mb-4 ${
                    feature.color === "yellow" ? "text-yellow-400" : "text-emerald-400"
                  }`}
                >
                  {feature.title}
                </h3>

                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Tips Section */}
      <section className="relative bg-gradient-to-r from-emerald-950 via-emerald-900/80 to-emerald-950 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-amber-300 mb-4">Quick Tech Tips</h2>
            <div className="w-20 h-1 bg-amber-400 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {techTips.map((tip, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-emerald-400/20 hover:bg-white/10 transition-all duration-300 hover:scale-105 p-6 rounded-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-gray-100 leading-relaxed">{tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-green-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

        <div className="relative max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-full px-4 py-2 mb-8">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-300">Secure & Trusted</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-white via-green-200 to-yellow-300 bg-clip-text text-transparent">
              Ready to Upgrade Your Tech?
            </span>
          </h2>

          <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Join us and experience the smartest way to shop for cutting-edge technology!
          </p>

          <div className="group relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <Link
              to="/register"
              className="relative flex items-center justify-center bg-gradient-to-r from-yellow-400 to-amber-500 text-black py-3 px-8 sm:py-4 sm:px-10 rounded-full text-lg font-semibold hover:scale-105 transform transition-all duration-300 shadow-2xl hover:shadow-yellow-400/25"
            >
              <span className="flex items-center">
                <Shield className="mr-2 w-5 h-5" />
                Register Now
              </span>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-12 text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-sm">Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span className="text-sm">5-Star Support</span>
            </div>
          </div>
        </div>
      </section>

      <style jsx="true">{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 0.8;
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-bounce {
          animation: bounce 5s infinite;
        }
      `}</style>
    </div>
  )
}

export default Home

"use client"

import { Search, Target, TrendingUp, BarChart3 } from "lucide-react"
import { useState, useEffect } from "react"
import { Agent } from "./agent"

export default function AgentWrapper() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])




  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-shift px-4 sm:py-8 py-16 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-1 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-10 animate-float blur-xl"></div>
        <div className="absolute top-40 right-2 w-24 h-24 bg-gradient-to-r from-pink-400 to-blue-500 rounded-full opacity-15 animate-float-delayed blur-lg"></div>
        <div className="absolute bottom-32 left-2 w-40 h-40 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-8 animate-float-slow blur-2xl"></div>


        <div className="absolute -bottom-0 -right-20 w-32 h-32 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-5 -right-16 w-48 h-48 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/20 rounded-full animate-pulse"></div>

        {/* Geometric Shapes */}
        <div className="absolute top-4 right-1/4 w-16 h-16 bg-gradient-to-r from-indigo-400 to-purple-500 opacity-20 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-2 left-1/4 w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 opacity-25 animate-pulse"></div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-30 animate-pulse"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Sparkle Effects */}
        <div className="absolute top-1/3 left-1/3 animate-ping">
          <Target className="w-4 h-4 text-purple-400 opacity-60" />
        </div>
        <div className="absolute bottom-1/3 right-1/3 animate-ping delay-1000">
          <TrendingUp className="w-3 h-3 text-blue-400 opacity-60" />
        </div>
      </div>

      {/* Mouse Follower */}
      <div
        className="absolute w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 pointer-events-none transition-all duration-200 ease-out z-10"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
        }}
      ></div>

      <div className=" sm:w-[80%] w-full mx-auto grid lg:grid-cols-5 gap-8 items-center min-h-screen relative z-20">
        {/* Left Side - Promotional Card */}
        <div className="relative overflow-hidden md:col-span-2 col-span-1 h-[700px] rounded-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 animate-slide-in-left">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-shift"></div>

          {/* Decorative Circles */}
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-0 -right-20 w-32 h-32 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-5 -right-16 w-48 h-48 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/20 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-0 -left-10 w-48 h-48 bg-white/20 rounded-full animate-pulse"></div>

          <div className="absolute -top-8 -left-8 w-24 h-24 bg-white/10 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 right-8 w-16 h-16 bg-white/15 rounded-full animate-float"></div>
          <div className="absolute bottom-1/4 left-1/4 w-20 h-20 bg-white/10 rounded-full animate-float-delayed"></div>

          <div className="relative z-10 p-8 lg:p-12 text-white">
            <div className="space-y-6">
              <div className="flex items-center space-x-2 animate-fade-in-up">
                <Search className="w-8 h-8 text-yellow-300 animate-pulse" />
                <Target className="w-6 h-6 text-cyan-300 animate-spin-slow" />
                <BarChart3 className="w-7 h-7 text-green-300 animate-bounce" />
              </div>

              {/* <h2 className="text-4xl lg:text-5xl font-bold leading-tight animate-fade-in-up delay-300">
                Try It Now — Discover High‑Intent
                <br />
                <span className="bg-gradient-to-r from-yellow-300 to-cyan-300 bg-clip-text text-transparent animate-gradient-x">
                  Keywords Instantly
                </span>
              </h2> */}

              <h2 className="text-3xl lg:text-4xl font-bold leading-tight animate-fade-in-up delay-300">
                Try It Now,
                <br />
                <span className="bg-gradient-to-r from-yellow-300 to-cyan-300 bg-clip-text text-transparent animate-gradient-x">
                  Discover
                </span> {""}
                High-Intent
                <br />
                <span className="bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent animate-gradient-x delay-500">
                  Keywords
                </span> {""}
                Instantly
              </h2>

              <p className="text-lg lg:text-xl text-white leading-relaxed animate-fade-in-up delay-500">
                Enter a keyword or topic, and our AI will find the best high‑intent searches your ideal customers are looking for.
              </p>

              <div className="space-y-4 animate-fade-in-up delay-700">
                <div className="flex items-center space-x-3 text-blue-100">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>AI-Powered Analysis</span>
                </div>
                <div className="flex items-center space-x-3 text-blue-100">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-200"></div>
                  <span>High-Intent Keywords</span>
                </div>
                <div className="flex items-center space-x-3 text-blue-100">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-400"></div>
                  <span>Instant Results</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 animate-fade-in-up delay-900">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-white animate-pulse"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full border-2 border-white animate-pulse delay-200"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full border-2 border-white animate-pulse delay-400"></div>
                </div>
                <span className="text-sm text-blue-200">Trusted by 25k+ marketers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Interactive Form */}
        <div className="md:col-span-3 col-span-1">
            <Agent />
        </div>

      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-180deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(90deg); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-size: 200% 200%; background-position: left center; }
          50% { background-size: 200% 200%; background-position: right center; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
        .animate-gradient-shift { animation: gradient-shift 8s ease infinite; background-size: 400% 400%; }
        .animate-gradient-x { animation: gradient-x 3s ease infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-slide-in-left { animation: slide-in-left 0.8s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.8s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-900 { animation-delay: 900ms; }
        .delay-1000 { animation-delay: 1000ms; }
      `}</style>
    </div>
  )
}

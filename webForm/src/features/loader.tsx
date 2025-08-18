"use client"
import { useEffect, useState } from 'react';

export default function Loader() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
      <div className="relative w-20 h-20 flex items-center justify-center">
        {/* Central Dot */}
        <div className="w-6 h-6 bg-primary rounded-full z-10"></div>
        {/* Orbiting Dot */}
        <div className="absolute w-full h-full border-t-2 border-primary rounded-full animate-spin"></div>
      </div>

      <style jsx global>{`
        @keyframes orbit {
          0% {
            transform: rotate(0deg) translateX(20px) rotate(0deg);
          }
          100% {
            transform: rotate(360deg) translateX(20px) rotate(-360deg);
          }
        }
        .animate-orbit {
          animation: orbit 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}

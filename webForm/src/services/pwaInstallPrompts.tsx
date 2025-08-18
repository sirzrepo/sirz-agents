"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Zap, Wifi, Download, Share2, Sparkles, Globe2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Only add beforeinstallprompt listener for non-iOS devices
    if (!isIOSDevice) {
      const handler = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowPrompt(true);
      };

      window.addEventListener("beforeinstallprompt", handler);

      return () => {
        window.removeEventListener("beforeinstallprompt", handler);
      };
    } else {
      // For iOS, show the prompt if the user hasn't installed the PWA
      // and is using Safari (where "Add to Home Screen" is available)
      const isStandalone = "standalone" in window.navigator && (window.navigator as any).standalone;
      const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      if (!isStandalone && isSafari) {
        setShowPrompt(true);
      }
    }
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      // For iOS, we can't programmatically trigger the install,
      // so we just show instructions
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="fixed right-4 left-2 top-4 z-50 "
      >
        <motion.div className="">
        <Card className="w-[380px] overflow-hidden bg-white shadow-xl border-2 border-gray-100 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
          <button
            onClick={() => setShowPrompt(false)}
            className="absolute right-2 top-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors z-50"
            aria-label="Close install prompt"
          >
            <X size={18} className="text-gray-500" />
          </button>
          <motion.div
            animate={{ 
              background: [
                'linear-gradient(45deg, rgba(59,130,246,0.08) 0%, rgba(147,51,234,0.08) 100%)',
                'linear-gradient(45deg, rgba(147,51,234,0.08) 0%, rgba(59,130,246,0.08) 100%)'
              ],
            }}
            transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute inset-0"
          />

          <CardHeader className="pb-3 relative">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-2"
            >
              <div className="p-3 rounded-xl bg-white from-primary/10 to-secondary/10 text-secondary shadow-md">
                {isIOS ? <Share2 size={24} /> : <Download size={24} />}
              </div>
              <div>
                <CardTitle className="text-xl text-gray-800 font-bold">
                  {isIOS ? "Install on iPhone" : "Get the App"}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Level up your experience
                </CardDescription>
              </div>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-4 relative">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-3"
            >
              <div className="group flex items-center gap-2 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-300 cursor-default border border-blue-100">
                <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-primary">Super Fast</span>
              </div>
              <div className="group flex items-center gap-2 p-3 rounded-xl bg-purple-50 hover:bg-purple-100 transition-all duration-300 cursor-default border border-purple-100">
                <div className="p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                  <Globe2 className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-primary">Anywhere</span>
              </div>
            </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {isIOS ? (
              <div className="space-y-3 bg-white p-5 rounded-xl border border-blue-100">
                <p className="text-base font-medium text-gray-800 mb-4">
                  Quick Install Guide:
                </p>
                <ol className="space-y-3 text-sm text-gray-600">
                  {[
                    "Tap the Share button in Safari",
                    "Find 'Add to Home Screen'",
                    "Tap 'Add' to finish"
                  ].map((step, index) => (
                    <motion.li 
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + (index * 0.1) }}
                      className="flex items-center gap-3 group"
                    >
                      <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold shadow-sm group-hover:bg-blue-600 transition-all duration-300">
                        {index + 1}
                      </div>
                      <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{step}</span>
                    </motion.li>
                  ))}
                </ol>
              </div>
            ) : (
              <div className="space-y-4">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100"
                >
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                    <Smartphone className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm text-gray-700">Native app experience without the store</span>
                </motion.div>

                <motion.button
                  onClick={handleInstallClick}
                  className="w-full py-3 px-4 bg-primary hover:bg-primary/80 text-white rounded-xl
                    shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-5 h-5" />
                  <span className="font-medium ">Install Now</span>
                </motion.button>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-xs text-center text-gray-500 px-3"
                >
                  ✨ Lightweight • 🚀 Instant updates • 💫 No app store needed
                </motion.p>
              </div>
            )}
          </motion.div>
        </CardContent>
      </Card>
        </motion.div>
    </motion.div>
    </AnimatePresence>
  );
};

export default PwaInstallPrompt;

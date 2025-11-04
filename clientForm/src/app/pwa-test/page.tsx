'use client';

import { useState, useEffect } from 'react';
import PushNotificationManager from '@/components/PushNotificationManager';
import { Download, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export default function PWATestPage() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if the app is running in standalone mode
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if the app is installable
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const handleRefreshClick = () => {
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">PWA Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">PWA Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Installable:</span>
              <div className="flex items-center">
                {isInstallable ? (
                  <>
                    <CheckCircle className="text-green-500 mr-2" size={20} />
                    <span className="text-green-500">Yes</span>
                  </>
                ) : (
                  <>
                    <XCircle className="text-red-500 mr-2" size={20} />
                    <span className="text-red-500">No</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Standalone Mode:</span>
              <div className="flex items-center">
                {isStandalone ? (
                  <>
                    <CheckCircle className="text-green-500 mr-2" size={20} />
                    <span className="text-green-500">Yes</span>
                  </>
                ) : (
                  <>
                    <XCircle className="text-red-500 mr-2" size={20} />
                    <span className="text-red-500">No</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Online Status:</span>
              <div className="flex items-center">
                {isOnline ? (
                  <>
                    <CheckCircle className="text-green-500 mr-2" size={20} />
                    <span className="text-green-500">Online</span>
                  </>
                ) : (
                  <>
                    <XCircle className="text-red-500 mr-2" size={20} />
                    <span className="text-red-500">Offline</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex flex-col space-y-2 mt-4">
              {isInstallable && (
                <button
                  onClick={handleInstallClick}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                >
                  <Download size={18} />
                  <span>Install App</span>
                </button>
              )}
              
              <button
                onClick={handleRefreshClick}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                <RefreshCw size={18} />
                <span>Refresh Page</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Push Notifications</h2>
          <PushNotificationManager />
        </div> */}
      </div>
      
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Bell, BellOff } from 'lucide-react';

export default function PushNotificationManager() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      setIsLoading(true);
      
      // Check if the browser supports push notifications
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.log('Push notifications are not supported in this browser');
        setIsSubscribed(false);
        setIsLoading(false);
        return;
      }

      // Check if the service worker is registered
      const registration = await navigator.serviceWorker.ready;
      
      // Get the current subscription
      const existingSubscription = await registration.pushManager.getSubscription();
      
      if (existingSubscription) {
        setSubscription(existingSubscription);
        setIsSubscribed(true);
      } else {
        setIsSubscribed(false);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
      toast.error('Failed to check notification subscription status');
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToNotifications = async () => {
    try {
      setIsLoading(true);
      
      // Check if the browser supports push notifications
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        toast.error('Push notifications are not supported in this browser');
        return;
      }

      // Check if the service worker is registered
      const registration = await navigator.serviceWorker.ready;
      
      // Request permission
      const permission = await Notification.requestPermission();
      
      if (permission !== 'granted') {
        toast.error('Notification permission was denied');
        return;
      }
      
      // Subscribe to push notifications
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });
      
      // Send the subscription to the server
      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSubscription),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save subscription on server');
      }
      
      setSubscription(newSubscription);
      setIsSubscribed(true);
      toast.success('Successfully subscribed to push notifications');
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      toast.error('Failed to subscribe to notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribeFromNotifications = async () => {
    try {
      setIsLoading(true);
      
      if (!subscription) {
        return;
      }
      
      // Unsubscribe from push notifications
      await subscription.unsubscribe();
      
      // Remove the subscription from the server
      const response = await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove subscription from server');
      }
      
      setSubscription(null);
      setIsSubscribed(false);
      toast.success('Successfully unsubscribed from push notifications');
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
      toast.error('Failed to unsubscribe from notifications');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-gray-700">Push Notifications:</span>
        <div className="flex items-center">
          {isSubscribed ? (
            <span className="text-green-500 flex items-center">
              <Bell className="mr-2" size={20} />
              <span>Enabled</span>
            </span>
          ) : (
            <span className="text-red-500 flex items-center">
              <BellOff className="mr-2" size={20} />
              <span>Disabled</span>
            </span>
          )}
        </div>
      </div>
      
      <div className="flex justify-center">
        {isSubscribed ? (
          <button
            onClick={unsubscribeFromNotifications}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BellOff size={18} />
            <span>{isLoading ? 'Processing...' : 'Disable Notifications'}</span>
          </button>
        ) : (
          <button
            onClick={subscribeToNotifications}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Bell size={18} />
            <span>{isLoading ? 'Processing...' : 'Enable Notifications'}</span>
          </button>
        )}
      </div>
      
      <div className="text-sm text-gray-500 text-center">
        {isSubscribed 
          ? 'You will receive notifications about your orders and promotions.' 
          : 'Enable notifications to receive updates about your orders and promotions.'}
      </div>
    </div>
  );
} 
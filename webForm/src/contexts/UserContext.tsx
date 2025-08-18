'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { apiService } from '@/services/apiService';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addresses: Address[];
  notifications: Notification[];
}

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  datetime: Date;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id' | 'addresses' | 'notifications'> & { password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  getCurrentLocation: () => Promise<{ latitude: number; longitude: number }>;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;
  getUnreadNotificationsCount: () => number;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deactivateAccount: (email: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Sample notifications data
const sampleNotifications = [
  {
    id: '1',
    type: 'order',
    title: 'Your order has been delivered!',
    message: 'Order #ORD-20230601-0001 has been delivered successfully.',
    isRead: false,
    datetime: new Date(2023, 5, 1, 15, 30),
  },
  {
    id: '2',
    type: 'promo',
    title: 'Weekend Special: 20% Off!',
    message: 'Use code WEEKEND20 for 20% off your next order this weekend.',
    isRead: true,
    datetime: new Date(2023, 5, 15, 10, 0),
  },
  {
    id: '3',
    type: 'account',
    title: 'Profile updated successfully',
    message: 'Your account details have been updated.',
    isRead: false,
    datetime: new Date(2023, 6, 10, 8, 45),
  },
  {
    id: '4',
    type: 'order',
    title: 'New order confirmed',
    message: 'Your order #ORD-20230710-0007 has been confirmed and is being processed.',
    isRead: true,
    datetime: new Date(2023, 6, 10, 14, 20),
  },
  {
    id: '5',
    type: 'promo',
    title: 'New items added to our menu!',
    message: 'Check out our new seasonal items just added to the menu.',
    isRead: false,
    datetime: new Date(2023, 6, 20, 9, 15),
  },
];

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Ensure user has a notifications array
        if (!parsedUser.notifications) {
          parsedUser.notifications = [];
        }
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // First try to authenticate with API
      const isAuthenticated = await apiService.getAuthenticatedUser();
      
      if (isAuthenticated) {
        // If authenticated, create a mock user for now
        const mockUser: User = {
          id: 'api-user-id',
          firstName: 'API',
          lastName: 'User',
          email,
          phone: '',
          addresses: [],
          notifications: [...sampleNotifications]
        };
        
        setUser(mockUser);
        toast.success('Login successful!');
        return;
      }
      
      // If no API user, fall back to local authentication
      // For demo purposes, accept any email/password
      const mockUser: User = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email,
        phone: '123-456-7890',
        addresses: [],
        notifications: [...sampleNotifications]
      };
      
      setUser(mockUser);
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id' | 'addresses' | 'notifications'> & { password: string }) => {
    setIsLoading(true);
    try {
      // Try to register with API
      const result = await apiService.registerUser({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.password
      });
      
      if (result.success) {
        // If registration was successful, create a user object
        const newUser: User = {
          id: result.userId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          addresses: [],
          notifications: []
        };
        
        setUser(newUser);
        toast.success('Registration successful!');
        return;
      }
      
      // Fall back to local registration if API fails
      const newUser: User = {
        id: Date.now().toString(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        addresses: [],
        notifications: []
      };
      
      setUser(newUser);
      toast.success('Registration successful!');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    toast.info('You have been logged out');
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Update user data
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addAddress = async (address: Omit<Address, 'id'>) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Create new address with ID
      const newAddress: Address = {
        ...address,
        id: Date.now().toString()
      };
      
      // Update user with new address
      const updatedUser = {
        ...user,
        addresses: [...user.addresses, newAddress]
      };
      
      setUser(updatedUser);
      toast.success('Address added successfully!');
    } catch (error) {
      console.error('Add address error:', error);
      toast.error('Failed to add address. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = async (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          reject(error);
        }
      );
    });
  };

  const markNotificationAsRead = (id: string) => {
    if (!user) return;
    
    // Ensure notifications array exists
    const currentNotifications = user.notifications || [];
    
    const updatedNotifications = currentNotifications.map(notification => 
      notification.id === id 
        ? { ...notification, isRead: true } 
        : notification
    );
    
    setUser({
      ...user,
      notifications: updatedNotifications
    });
  };

  const markAllNotificationsAsRead = () => {
    if (!user) return;
    
    // Ensure notifications array exists
    const currentNotifications = user.notifications || [];
    
    const updatedNotifications = currentNotifications.map(notification => ({
      ...notification,
      isRead: true
    }));
    
    setUser({
      ...user,
      notifications: updatedNotifications
    });
  };

  const deleteNotification = (id: string) => {
    if (!user) return;
    
    // Ensure notifications array exists
    const currentNotifications = user.notifications || [];
    
    const updatedNotifications = currentNotifications.filter(
      notification => notification.id !== id
    );
    
    setUser({
      ...user,
      notifications: updatedNotifications
    });
  };

  const getUnreadNotificationsCount = () => {
    if (!user) return 0;
    // Ensure notifications array exists
    const notifications = user.notifications || [];
    return notifications.filter(notification => !notification.isRead).length;
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) throw new Error('Not logged in');
    
    setIsLoading(true);
    try {
      // In a real app, we would call an API endpoint to verify the current password and update it
      // For demo, we're just simulating a successful password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, we would update any necessary auth tokens or session data
      toast.success('Password changed successfully');
    } catch (error) {
      console.error('Password change error:', error);
      toast.error('Failed to change password. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deactivateAccount = async (email: string) => {
    if (!user) throw new Error('Not logged in');
    
    // Verify email matches the user's email for confirmation
    if (email !== user.email) {
      throw new Error('Email confirmation does not match your account email');
    }
    
    setIsLoading(true);
    try {
      // In a real app, we would call an API endpoint to deactivate the account
      // For demo, we're just simulating deactivation by logging out
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Perform logout
      logout();
      toast.info('Your account has been deactivated');
    } catch (error) {
      console.error('Account deactivation error:', error);
      toast.error('Failed to deactivate account. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        getCurrentLocation,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        deleteNotification,
        getUnreadNotificationsCount,
        changePassword,
        deactivateAccount
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 
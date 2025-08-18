'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useDispatch } from 'react-redux';
import { login as loginUserRedux, logout as logoutUserRedux, updateUser } from '../store/user';
import { IUser } from '@/types/types';
import { useQuery, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  userId: string | null;
  user: IUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<{ userId: string }>;
  verifyOTP: (userId: string, otp: string) => Promise<void>;
  resendOTP: (userId: string, email?: string) => Promise<void>;
  updateUserProfile: (userData: { first_name?: string; last_name?: string; image?: string }) => Promise<{ 
    success: boolean; 
    data?: any; 
    message?: string 
  }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  
  // Get the signOut action from Convex
  const signOutAction = useAction(api.auth.signOut);
  
  // Determine auth status using user query
  const convexUser = useQuery(api.resources.users.authenticated);
  const convexUserLoading = convexUser === undefined;
  
  // Update local state when convexUser changes
  useEffect(() => {
    const checkAuth = async () => {
      console.log("Authenticated user still loading:", convexUser);
      if (convexUserLoading) return; // still loading, wait!
      
      try {
        console.log("Authenticated user data:", convexUser);

        if (convexUser) {
          setIsAuthenticated(true);
          setUserId(convexUser._id);
          
          // Transform Convex user to match IUser interface
          const transformedUser: IUser = {
            id: convexUser._id,
            email: convexUser.email || '',
            first_name: convexUser.name?.split(' ')[0] || '',
            last_name: convexUser.name?.split(' ')[1] || '',
            image: convexUser.image || ''
          };
          
          setUser(transformedUser);
          
          // Update Redux store
          dispatch(loginUserRedux({
            id: convexUser._id,
            email: convexUser.email || '',
            firstName: convexUser.name?.split(' ')[0] || '',
            lastName: convexUser.name?.split(' ')[1] || '',
            image: convexUser.image || '',
          }));
        } else {
          // If we don't have a user from Convex, check if we're still loading
          // or if we truly don't have a user
          setIsAuthenticated(false);
          setUserId(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
        setUserId(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [convexUser,convexUserLoading, dispatch]);


  // Legacy login function - kept for backward compatibility
  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      // Login is now handled by Convex auth directly
      // This function remains for backward compatibility
      setError('Please use Convex auth directly');
      throw new Error('Please use Convex auth directly');
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Legacy register function - kept for backward compatibility
  const register = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      // Registration is now handled by Convex auth directly
      // This function remains for backward compatibility
      setError('Please use Convex auth directly');
      throw new Error('Please use Convex auth directly');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Legacy verifyOTP function - kept for backward compatibility
  const verifyOTP = async (userId: string, otp: string) => {
    try {
      setError(null);
      setIsLoading(true);
      // OTP verification is now handled by Convex auth directly
      // This function remains for backward compatibility
      setError('Please use Convex auth directly');
      throw new Error('Please use Convex auth directly');
    } catch (err: any) {
      setError(err.message || 'OTP verification failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Legacy resendOTP function - kept for backward compatibility
  const resendOTP = async (userId: string, email?: string) => {
    try {
      setError(null);
      setIsLoading(true);
      // OTP resend is now handled by Convex auth directly
      // This function remains for backward compatibility
      setError('Please use Convex auth directly');
      throw new Error('Please use Convex auth directly');
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Use Convex auth API for logout
  const logout = async () => {
    try {
      // First, call Convex signOut action
      await signOutAction();
      
      // Clear authentication tokens from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('convex-auth-token');
        localStorage.removeItem('convex-refresh-token');
      }
      
      // Then clean up local state
      setIsAuthenticated(false);
      setUserId(null);
      setUser(null);
      dispatch(logoutUserRedux());
      
      // Redirect to login page
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Error during logout:', error);
      
      // Even if Convex logout fails, clear tokens and local state
      if (typeof window !== 'undefined') {
        localStorage.removeItem('convex-auth-token');
        localStorage.removeItem('convex-refresh-token');
      }
      
      setIsAuthenticated(false);
      setUserId(null);
      setUser(null);
      dispatch(logoutUserRedux());
      window.location.href = '/auth/login';
    }
  };

  const updateUserProfile = async (userData: { first_name?: string; last_name?: string; image?: string }) => {
    if (!userId) return { success: false, message: "No user ID found" };
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authAPI.updateUser(userId, userData);
      console.log("API response:", response);
      
      // Update local user state
      if (user) {
        const updatedUser = { 
          ...user,
          first_name: userData.first_name || user.first_name,
          last_name: userData.last_name || user.last_name,
          image: userData.image || user.image
        };
        
        console.log("Updating user state to:", updatedUser);
        setUser(updatedUser);
        
        // Update Redux state
        dispatch(updateUser({
          firstName: userData.first_name || user.first_name,
          lastName: userData.last_name || user.last_name,
          image: userData.image || user.image,
        }));
        
        return { success: true, data: updatedUser };
      }
      
      return { success: true, data: response.data };
    } catch (err: any) {
      console.error("Update profile error:", err);
      setError(err.response?.data?.message || 'Failed to update profile');
      return { success: false, message: err.response?.data?.message || 'Failed to update profile' };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        isLoading, 
        error,
        userId,
        user,
        login, 
        logout, 
        register, 
        verifyOTP, 
        resendOTP,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
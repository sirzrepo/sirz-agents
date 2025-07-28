import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authAPI } from '../services/api';
import { jwtDecode } from 'jwt-decode';
import { IUser } from '../types';
import { useDispatch } from 'react-redux';
import { login as loginUserRedux, logout as logoutUserRedux, updateUser } from '../store/userSlice';

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
  resendOTP: (userId: string) => Promise<void>;
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

  useEffect(() => {
    // Check for token on mount
    const token = localStorage.getItem('token');
    // setIsAuthenticated(!!token);

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const id = decodedToken.userId;   // Extract userId from token

        fetchUser(id);
        setUserId(id);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Invalid token', err);
        setIsAuthenticated(false);
        dispatch(logoutUserRedux())
      }
    }


    setIsLoading(false);
  }, []);

  // function to get user
  const fetchUser = async (userId: string) => {
    try {
      const response = await authAPI.getUser(userId);
      const userData = response.data;

      setUser(userData); // Store full user object

      dispatch(loginUserRedux({
        id: userData.id,
        firstName: userData.first_name || userData.email.split('@')[0],
        lastName: userData.last_name || "",
        email: userData.email,
        role: userData.role,
        image: userData.image || "",
      }))
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await authAPI.login(email, password);
      localStorage.setItem('token', response.token);

      // Decode token to get userId
      const decodedToken: any = jwtDecode(response.token);
      const id = decodedToken.userId;

      setUserId(id);
      setIsAuthenticated(true);
      await fetchUser(id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await authAPI.register(email, password);
      return { userId: response.userId };
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (userId: string, otp: string) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await authAPI.verifyOTP(userId, otp);

      localStorage.setItem('token', response.token);
      setIsAuthenticated(true);

      const decodedToken: any = jwtDecode(response.token);
      const id = decodedToken.userId;

      setUserId(id);
      await fetchUser(id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'OTP verification failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async (userId: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await authAPI.resendOTP(userId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserId(null);
    setUser(null);
    dispatch(logoutUserRedux());
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
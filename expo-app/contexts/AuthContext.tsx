// contexts/AuthContext.tsx - FIXED VERSION with guaranteed persistence
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import authService, { User, LoginData, RegisterData, AuthResponse } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  selectedAvatar: any | null;
  login: (data: LoginData) => Promise<void>;
  loginWithSSO: (response: AuthResponse, selectedAvatar?: any) => Promise<void>;
  register: (data: RegisterData, selectedAvatar?: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setSelectedAvatar: (avatar: any) => void;
  updateAvatar: (newAvatar: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // CRITICAL: Check auth on mount for persistence
  useEffect(() => {
    console.log('🚀 AuthProvider mounted - checking auth...');
    checkAuth();
  }, []);

  // Debug user state changes
  useEffect(() => {
    console.log('👤 User state changed:', user ? user.username : 'null');
    console.log('🔐 Is authenticated:', !!user);
  }, [user]);

  /**
   * Check authentication status on app start
   * CRITICAL: This provides persistence across app restarts
   */
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      
      console.log('🔍 Checking authentication status...');
      
      // Check for token in storage
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('❌ No token found - user not authenticated');
        setUser(null);
        setIsLoading(false);
        return;
      }

      console.log('✅ Token found - loading user...');

      // Get user from storage first (faster UX)
      const storedUser = await authService.getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
        console.log('✅ User restored from storage:', storedUser.username);
      } else {
        console.log('⚠️ Token exists but no user in storage');
      }

      // Validate token with backend (background refresh)
      try {
        const currentUser = await authService.getMe();
        setUser(currentUser);
        console.log('✅ User validated with server:', currentUser.username);
      } catch (error) {
        // Token invalid/expired - clear storage
        console.error('❌ Token validation failed:', error);
        await authService.logout();
        setUser(null);
      }

      // Load saved avatar if exists
      const savedAvatarJson = await AsyncStorage.getItem('selectedAvatar');
      const savedAvatar = savedAvatarJson ? JSON.parse(savedAvatarJson) : null;
      if (savedAvatar) {
        setSelectedAvatar(savedAvatar);
        console.log('✅ Avatar loaded from storage');
      }
    } catch (error) {
      console.error('❌ Auth check error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
      console.log('✅ Auth check complete');
    }
  };

  /**
   * Login with email/password
   * CRITICAL: Must wait for authService to complete before returning
   */
  const login = async (data: LoginData) => {
    try {
      setIsLoading(true);
      console.log('🔐 Starting login process...');
      
      // CRITICAL: Wait for login to complete fully
      const response = await authService.login(data);
      
      // Verify token was saved
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Login failed - token not saved');
      }
      
      setUser(response.user);
      
      // Persist avatar if available
      if (selectedAvatar) {
        await AsyncStorage.setItem('selectedAvatar', JSON.stringify(selectedAvatar));
      }

      console.log('✅ Login complete:', response.user.username);
    } catch (error) {
      console.error('❌ Login failed:', error);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login with SSO (Google/Apple)
   */
  const loginWithSSO = async (response: AuthResponse, selectedAvatar?: any) => {
    try {
      setIsLoading(true);
      console.log('🔐 SSO login process...');
      
      // Auth data is already saved by authService.oauthLogin
      setUser(response.user);

      // Save avatar if provided
      if (selectedAvatar) {
        await AsyncStorage.setItem('selectedAvatar', JSON.stringify(selectedAvatar));
        setSelectedAvatar(selectedAvatar);
      }

      console.log('✅ SSO Login complete:', response.user.username);
    } catch (error) {
      console.error('❌ SSO Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register new user
   * CRITICAL: Must wait for registration to complete before returning
   */
  const register = async (data: RegisterData, selectedAvatar?: any) => {
    try {
      setIsLoading(true);
      console.log('📝 Starting registration process...');
      
      // Include avatar in registration
      const registerData = {
        ...data,
        avatar: selectedAvatar?.id || '',
      };

      // CRITICAL: Wait for registration to complete fully (auto-logs in)
      const response = await authService.register(registerData as any);
      
      // Verify token was saved
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Registration failed - token not saved');
      }
      
      setUser(response.user);

      // Save avatar
      if (selectedAvatar) {
        await AsyncStorage.setItem('selectedAvatar', JSON.stringify(selectedAvatar));
        setSelectedAvatar(selectedAvatar);
      }

      console.log('✅ Registration complete:', response.user.username);
    } catch (error) {
      console.error('❌ Registration failed:', error);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      console.log('👋 Logging out...');
      
      await authService.logout();
      setUser(null);
      setSelectedAvatar(null);
      
      console.log('✅ Logout complete');
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh user data from server
   */
  const refreshUser = async () => {
    try {
      console.log('🔄 Refreshing user...');
      const updatedUser = await authService.getMe();
      setUser(updatedUser);
      console.log('✅ User refreshed');
    } catch (error) {
      console.error('❌ Refresh user error:', error);
      // If refresh fails (e.g., token expired), logout the user
      await logout();
      throw error;
    }
  };

  /**
   * Update user avatar
   */
  const updateAvatar = async (newAvatar: string) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      console.log('💾 Updating avatar for user:', user.id);
      
      const updatedUser = await authService.updateProfile(user.id, { avatar: newAvatar });
      
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      console.log('✅ Avatar updated successfully:', updatedUser.avatar);
    } catch (error) {
      console.error('❌ Update avatar error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    selectedAvatar,
    login,
    loginWithSSO,
    register,
    logout,
    refreshUser,
    setSelectedAvatar,
    updateAvatar,
  };

  return (
    <AuthContext.Provider value={value}>
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
// services/authService.ts - FIXED VERSION with guaranteed persistence
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface OAuthData {
  token: string;
  provider: 'google' | 'apple';
  username?: string;
  avatar?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  auth_provider?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  message?: string;
  token: string;
  user: User;
}

class AuthService {
  /**
   * Register a new user with email/password
   * CRITICAL: This auto-logs in after registration
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('📝 Registering user:', { username: data.username, email: data.email });
      
      const response = await api.post<{ message: string; user: User }>('/register', {
        username: data.username,
        email: data.email,
        password: data.password,
        avatar: data.avatar,
      });

      console.log('✅ Registration successful - auto-logging in...');

      // CRITICAL: Auto-login after successful registration
      const loginResponse = await this.login({ 
        email: data.email, 
        password: data.password 
      });

      return loginResponse;
    } catch (error: any) {
      console.error('❌ Registration error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || error.message || 'Registration failed';
      throw new Error(errorMessage);
    }
  }

  /**
   * Login user with email/password
   * CRITICAL: Uses multiSet for atomic save
   */
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      console.log('🔐 Logging in user:', data.email);
      
      const response = await api.post<AuthResponse>('/login', data);

      console.log('✅ Login successful');
      console.log('📦 Response:', {
        hasToken: !!response.data.token,
        hasUser: !!response.data.user,
        username: response.data.user?.username
      });

      // CRITICAL: Save token and user ATOMICALLY before anything else
      if (response.data.token && response.data.user) {
        await this.saveAuthData(response.data);
        
        // VERIFY it was saved
        const savedToken = await AsyncStorage.getItem('token');
        const savedUser = await AsyncStorage.getItem('user');
        
        console.log('💾 Save verification:', {
          tokenSaved: !!savedToken,
          userSaved: !!savedUser
        });
        
        if (!savedToken || !savedUser) {
          throw new Error('Failed to save auth data to storage');
        }
      } else {
        throw new Error('Invalid response from server - missing token or user');
      }

      return response.data;
    } catch (error: any) {
      console.error('❌ Login error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  }

  /**
   * OAuth login (Google or Apple)
   */
  async oauthLogin(data: OAuthData): Promise<AuthResponse> {
    try {
      console.log(`🔐 OAuth login with ${data.provider}`);
      const endpoint = data.provider === 'google' ? '/auth/google' : '/auth/apple';
      
      const response = await api.post<AuthResponse>(endpoint, data);
      
      console.log('✅ OAuth login successful:', response.data.user.username);
      
      // CRITICAL: Save credentials with persistence
      if (response.data.token) {
        await this.saveAuthData(response.data);
        
        // VERIFY
        const savedToken = await AsyncStorage.getItem('token');
        console.log('💾 OAuth token saved:', !!savedToken);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ OAuth login error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || error.message || 'OAuth login failed';
      throw new Error(errorMessage);
    }
  }

  /**
   * Save auth data to AsyncStorage for persistence
   * CRITICAL: Uses multiSet for atomic operation
   */
  private async saveAuthData(authResponse: AuthResponse): Promise<void> {
    try {
      console.log('💾 Saving auth data...');
      
      // Use multiSet for atomic save
      await AsyncStorage.multiSet([
        ['token', authResponse.token],
        ['user', JSON.stringify(authResponse.user)],
      ]);
      
      console.log('✅ Auth data saved successfully');
      
      // Double check it saved
      const check = await AsyncStorage.multiGet(['token', 'user']);
      console.log('🔍 Verification:', {
        token: check[0][1] ? 'SAVED' : 'MISSING',
        user: check[1][1] ? 'SAVED' : 'MISSING'
      });
    } catch (error) {
      console.error('❌ Failed to save auth data:', error);
      throw new Error('Failed to save authentication data');
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      console.log('👋 Logging out...');
      await AsyncStorage.multiRemove(['token', 'user', 'selectedAvatar']);
      console.log('✅ User logged out and storage cleared');
    } catch (error) {
      console.error('❌ Logout error:', error);
      throw error;
    }
  }

  /**
   * Get current user from storage
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (!userJson) {
        console.log('❌ No user in storage');
        return null;
      }
      const user = JSON.parse(userJson);
      console.log('✅ User loaded from storage:', user.username);
      return user;
    } catch (error) {
      console.error('❌ Get current user error:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('token');
      const hasToken = !!token;
      console.log('🔍 Auth check:', hasToken ? 'AUTHENTICATED' : 'NOT AUTHENTICATED');
      return hasToken;
    } catch (error) {
      console.error('❌ Auth check error:', error);
      return false;
    }
  }

  /**
   * Get auth token
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('token');
    } catch (error) {
      console.error('❌ Get token error:', error);
      return null;
    }
  }

  /**
   * Get user profile from API (refreshes local data)
   */
  async getMe(): Promise<User> {
    try {
      console.log('🔄 Fetching user from server...');
      const response = await api.get<User>('/me');
      await AsyncStorage.setItem('user', JSON.stringify(response.data));
      console.log('✅ User refreshed:', response.data.username);
      return response.data;
    } catch (error: any) {
      console.error('❌ Get me error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || 'Failed to get user profile';
      throw new Error(errorMessage);
    }
  }

  /**
   * Update user profile (avatar, bio, etc.)
   */
  async updateProfile(userId: number, data: Partial<User>): Promise<User> {
    try {
      console.log('✏️ Updating profile...', data);
      
      const response = await api.put<User>(`/users/${userId}`, data);
      
      // Update stored user
      await AsyncStorage.setItem('user', JSON.stringify(response.data));
      
      console.log('✅ Profile updated');
      return response.data;
    } catch (error: any) {
      console.error('❌ Update profile error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || 'Failed to update profile';
      throw new Error(errorMessage);
    }
  }

  /**
   * Update user avatar
   */
  async updateAvatar(userId: number, avatarId: string): Promise<User> {
    return this.updateProfile(userId, { avatar: avatarId });
  }

  /**
   * Get selected avatar from storage
   */
  async getSelectedAvatar(): Promise<any | null> {
    try {
      const avatarJson = await AsyncStorage.getItem('selectedAvatar');
      return avatarJson ? JSON.parse(avatarJson) : null;
    } catch (error) {
      console.error('❌ Get selected avatar error:', error);
      return null;
    }
  }

  /**
   * Save selected avatar to storage
   */
  async setSelectedAvatar(avatar: any): Promise<void> {
    try {
      await AsyncStorage.setItem('selectedAvatar', JSON.stringify(avatar));
      console.log('✅ Avatar saved to storage');
    } catch (error) {
      console.error('❌ Set selected avatar error:', error);
      throw error;
    }
  }

  /**
   * Clear all stored auth data (for debugging or full reset)
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['token', 'user', 'selectedAvatar']);
      console.log('🧹 All auth data cleared');
    } catch (error) {
      console.error('❌ Clear all error:', error);
      throw error;
    }
  }

  /**
   * Debug function - print all stored auth data
   */
  async debugStorage(): Promise<void> {
    try {
      const [token, user, avatar] = await AsyncStorage.multiGet(['token', 'user', 'selectedAvatar']);
      console.log('=== DEBUG STORAGE ===');
      console.log('Token:', token[1] ? 'EXISTS' : 'MISSING');
      console.log('User:', user[1] ? JSON.parse(user[1]) : 'MISSING');
      console.log('Avatar:', avatar[1] ? JSON.parse(avatar[1]) : 'MISSING');
      console.log('====================');
    } catch (error) {
      console.error('❌ Debug storage error:', error);
    }
  }
}

export default new AuthService();
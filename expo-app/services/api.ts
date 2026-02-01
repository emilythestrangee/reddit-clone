// services/api.ts - Complete API service with interceptors and persistence
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://backend-green-fog-6124-production.up.railway.app/api';

class ApiService {
  private api: any;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    console.log('📡 API Service initialized with base URL:', API_URL);
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token to every request
    this.api.interceptors.request.use(
      async (config: any) => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('🔐 Token attached to request:', config.url);
          }
        } catch (error) {
          console.error('❌ Error getting token:', error);
        }
        return config;
      },
      (error: any) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle errors globally
    this.api.interceptors.response.use(
      (response: any) => {
        console.log('✅ API Response:', response.config.url, response.status);
        return response;
      },
      async (error: any) => {
        console.error('❌ API Error:', error.config?.url, error.response?.status);
        
        if (error.response?.status === 401) {
          // Token expired or invalid - clear storage
          console.log('🔴 Token expired - clearing storage');
          await AsyncStorage.multiRemove(['token', 'user', 'selectedAvatar']);
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Generic HTTP methods
  async get<T>(url: string, config = {}): Promise<{ data: T }> {
    return this.api.get(url, config);
  }

  async post<T>(url: string, data?: any, config = {}): Promise<{ data: T }> {
    return this.api.post(url, data, config);
  }

  async put<T>(url: string, data?: any, config = {}): Promise<{ data: T }> {
    return this.api.put(url, data, config);
  }

  async delete<T>(url: string, config = {}): Promise<{ data: T }> {
    return this.api.delete(url, config);
  }

  async patch<T>(url: string, data?: any, config = {}): Promise<{ data: T }> {
    return this.api.patch(url, data, config);
  }

  // Helper to check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('token');
      return !!token;
    } catch {
      return false;
    }
  }

  // Helper to get current token
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('token');
    } catch {
      return null;
    }
  }
}

const apiService = new ApiService();

// Export user API helper
export const userAPI = {
  getProfile: (userId: number) => apiService.get(`/users/${userId}`),
  updateProfile: (userId: number, username?: string, bio?: string, avatar?: string) =>
    apiService.put(`/users/${userId}`, { username, bio, avatar }),
  followUser: (userId: number) => apiService.post(`/users/${userId}/follow`),
  unfollowUser: (userId: number) => apiService.delete(`/users/${userId}/follow`),
  getFollowers: (userId: number) => apiService.get(`/users/${userId}/followers`),
  getFollowing: (userId: number) => apiService.get(`/users/${userId}/following`),
};

export default apiService;
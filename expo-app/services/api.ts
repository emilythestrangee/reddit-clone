import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Change this to your computer's IP address when testing on physical device
// For emulator, use localhost
const API_URL = __DEV__ 
  ? 'http://localhost:8080/api'  // For iOS simulator
  // ? 'http://10.0.2.2:8080/api'  // For Android emulator
  // ? 'http://192.168.1.XXX:8080/api'  // For physical device (replace with your IP)
  : 'https://your-production-api.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (username: string, email: string, password: string) =>
    api.post('/register', { username, email, password }),
  
  login: (email: string, password: string) =>
    api.post('/login', { email, password }),
  
  getMe: () =>
    api.get('/me'),
};

// Post APIs
export const postAPI = {
  getPosts: () =>
    api.get('/posts'),
  
  getPost: (id: number) =>
    api.get(`/posts/${id}`),
  
  createPost: (title: string, body: string) =>
    api.post('/posts', { title, body }),
  
  updatePost: (id: number, title: string, body: string) =>
    api.put(`/posts/${id}`, { title, body }),
  
  deletePost: (id: number) =>
    api.delete(`/posts/${id}`),
  
  votePost: (id: number, voteType: number) =>
    api.post(`/posts/${id}/vote`, { vote_type: voteType }),
};

// Comment APIs
export const commentAPI = {
  getComments: (postId: number) =>
    api.get(`/posts/${postId}/comments`),
  
  createComment: (postId: number, body: string) =>
    api.post(`/posts/${postId}/comments`, { body }),
  
  updateComment: (commentId: number, body: string) =>
    api.put(`/comments/${commentId}`, { body }),
  
  deleteComment: (commentId: number) =>
    api.delete(`/comments/${commentId}`),
};

// User APIs
export const userAPI = {
  getProfile: (userId: number) =>
    api.get(`/users/${userId}`),
  
  updateProfile: (userId: number, username?: string, bio?: string, avatar?: string) =>
    api.put(`/users/${userId}`, { username, bio, avatar }),
  
  followUser: (userId: number) =>
    api.post(`/users/${userId}/follow`),
  
  unfollowUser: (userId: number) =>
    api.delete(`/users/${userId}/follow`),
  
  getFollowers: (userId: number) =>
    api.get(`/users/${userId}/followers`),
  
  getFollowing: (userId: number) =>
    api.get(`/users/${userId}/following`),
};

export default api;
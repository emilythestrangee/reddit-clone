import api from './api';

export interface User {
  id: number;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  created_at: string;
}

export interface UserProfile {
  user: User;
  posts: any[];
  follower_count: number;
  following_count: number;
}

export interface UpdateUserData {
  username?: string;
  bio?: string;
  avatar?: string;
}

class UserService {
    /**
   * Search users by username
   */
  async searchUsers(query: string): Promise<User[]> {
    try {
      const response = await api.get<User[]>(`/users/search?query=${query}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to search users');
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: number): Promise<UserProfile> {
    try {
      const response = await api.get<UserProfile>(`/api/users/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch user profile');
    }
  }

  /**
   * Update user profile (requires authentication)
   */
  async updateUserProfile(userId: number, data: UpdateUserData): Promise<User> {
    try {
      const response = await api.put<User>(`/api/users/${userId}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to update profile');
    }
  }

  /**
   * Follow user (requires authentication)
   */
  async followUser(userId: number): Promise<void> {
    try {
      await api.post(`/api/users/${userId}/follow`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to follow user');
    }
  }

  /**
   * Unfollow user (requires authentication)
   */
  async unfollowUser(userId: number): Promise<void> {
    try {
      await api.delete(`/api/users/${userId}/follow`);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to unfollow user');
    }
  }

  /**
   * Get user followers
   */
  async getFollowers(userId: number): Promise<User[]> {
    try {
      const response = await api.get<User[]>(`/api/users/${userId}/followers`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch followers');
    }
  }

  /**
   * Get user following
   */
  async getFollowing(userId: number): Promise<User[]> {
    try {
      const response = await api.get<User[]>(`/api/users/${userId}/following`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to fetch following');
    }
  }


  /**
   * Check if following a user
   */
  async isFollowing(userId: number): Promise<boolean> {
    try {
      const response = await api.get<{ following: boolean }>(`/users/${userId}/following-status`);
      return response.data.following;
    } catch (error: any) {
      return false;
    }
  }
}

export default new UserService();
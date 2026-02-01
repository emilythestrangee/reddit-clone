import api from './api';

export interface Post {
  id: number;
  title: string;
  content?: string;
  body?: string;
  image?: string;
  user_id: number;
  author_id: number;
  user: {
    id: number;
    username: string;
    avatar?: string;
  };
  upvotes: number;
  downvotes: number;
  created_at: string;
  updated_at?: string;
  comments?: number;
}

export interface CreatePostData {
  title: string;
  content?: string;
  body?: string;
  image?: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  body?: string;
}

class PostService {
  /**
   * Get all posts
   */
  async getPosts(): Promise<Post[]> {
    try {
      console.log('📥 Fetching all posts...');
      const response = await api.get<Post[]>('/posts');
      console.log(`✅ Fetched ${response.data.length} posts`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Get posts error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to fetch posts');
    }
  }

  /**
   * Get single post by ID
   */
  async getPost(postId: number): Promise<Post> {
    try {
      console.log('📥 Fetching post:', postId);
      const response = await api.get<Post>(`/posts/${postId}`);
      console.log('✅ Post fetched:', response.data.title);
      return response.data;
    } catch (error: any) {
      console.error('❌ Get post error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to fetch post');
    }
  }

  /**
   * Create new post (requires authentication)
   */
  async createPost(data: CreatePostData): Promise<Post> {
    try {
      console.log('📝 Creating post:', data.title);
      
      let imageUrl = data.image;
      
      // Upload image to Cloudinary if provided
      if (data.image && data.image.startsWith('file://')) {
        console.log('📸 Uploading image to Cloudinary...');
        imageUrl = await this.uploadImageToCloudinary(data.image);
        console.log('✅ Image uploaded:', imageUrl);
      }
      
      const postData = {
        title: data.title,
        content: data.content || data.body || '',
        body: data.content || data.body || '',
        image: imageUrl || '', // Use Cloudinary URL
      };

      const response = await api.post<Post>('/posts', postData);
      console.log('✅ Post created successfully:', response.data.id);
      return response.data;
    } catch (error: any) {
      console.error('❌ Create post error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to create post');
    }
  }

  private async uploadImageToCloudinary(imageUri: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/gif', // or detect type
        name: 'post-image.gif',
      } as any);
      formData.append('upload_preset', 'reddit_clone');
      formData.append('cloud_name', 'dougqcma4');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dougqcma4/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Image upload failed, using local path:', error);
      return imageUri; // Fallback to local
    }
  }

  /**
   * Update post (requires authentication + ownership)
   */
  async updatePost(postId: number, data: UpdatePostData): Promise<Post> {
    try {
      console.log('✏️ Updating post:', postId);
      
      const response = await api.put<Post>(`/posts/${postId}`, data);
      console.log('✅ Post updated successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Update post error:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        throw new Error('You must be logged in to update posts');
      } else if (error.response?.status === 403) {
        throw new Error('You can only edit your own posts');
      } else if (error.response?.status === 404) {
        throw new Error('Post not found');
      } else {
        throw new Error(error.response?.data?.error || 'Failed to update post');
      }
    }
  }

  /**
   * Delete post (requires authentication + ownership)
   */
  async deletePost(postId: number): Promise<void> {
    try {
      console.log('🗑️ Deleting post:', postId);
      
      await api.delete(`/posts/${postId}`);
      console.log('✅ Post deleted successfully');
    } catch (error: any) {
      console.error('❌ Delete post error:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        throw new Error('You must be logged in to delete posts');
      } else if (error.response?.status === 403) {
        throw new Error('You can only delete your own posts');
      } else if (error.response?.status === 404) {
        throw new Error('Post not found');
      } else {
        throw new Error(error.response?.data?.error || 'Failed to delete post');
      }
    }
  }

  /**
   * Vote on post (upvote or downvote) - requires authentication
   */
  async votePost(postId: number, voteType: 1 | -1): Promise<Post> {
    try {
      console.log('👍 Voting on post:', postId, voteType === 1 ? 'upvote' : 'downvote');
      
      await api.post(`/posts/${postId}/vote`, {
        vote_type: voteType
      });
      
      // Fetch updated post with new vote counts
      const response = await api.get<Post>(`/posts/${postId}`);
      console.log('✅ Vote recorded, updated post:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Vote error:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        throw new Error('You must be logged in to vote');
      } else if (error.response?.status === 404) {
        throw new Error('Post not found');
      } else {
        throw new Error(error.response?.data?.error || 'Failed to vote');
      }
    }
  }

  /**
   * Get posts by user
   */
  async getUserPosts(userId: number): Promise<Post[]> {
    try {
      console.log('📥 Fetching posts for user:', userId);
      const response = await api.get<Post[]>(`/users/${userId}/posts`);
      console.log(`✅ Fetched ${response.data.length} posts for user`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Get user posts error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to fetch user posts');
    }
  }

  /**
   * Upload image (helper method)
   */
  async uploadImage(imageUri: string): Promise<string> {
    try {
      // For now, return the URI as-is
      // In production, upload to cloud storage (Cloudinary, S3, etc.)
      // and return the URL
      
      // TODO: Implement actual image upload
      console.log('📸 Image upload - using local URI for now');
      return imageUri;
    } catch (error: any) {
      console.error('❌ Image upload error:', error);
      throw new Error('Failed to upload image');
    }
  }
}

export default new PostService();
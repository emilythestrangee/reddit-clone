import api from './api';

export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  body?: string;
  user: {
    id: number;
    username: string;
    avatar?: string;
  };
  created_at: string;
}

class CommentService {
  async getComments(postId: number): Promise<Comment[]> {
    try {
      const response = await api.get<Comment[]>(`/posts/${postId}/comments`);
      return response.data;
    } catch (error: any) {
      console.error('❌ Get comments error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to fetch comments');
    }
  }

  async createComment(postId: number, content: string): Promise<Comment> {
    try {
      const response = await api.post<Comment>(`/posts/${postId}/comments`, { content, body: content });
      console.log('✅ Comment created');
      return response.data;
    } catch (error: any) {
      console.error('❌ Create comment error:', error.response?.data || error.message);
      if (error.response?.status === 401) throw new Error('You must be logged in to comment');
      throw new Error(error.response?.data?.error || 'Failed to post comment');
    }
  }

  async updateComment(commentId: number, content: string): Promise<Comment> {
    try {
      const response = await api.put<Comment>(`/comments/${commentId}`, { body: content });
      console.log('✅ Comment updated');
      return response.data;
    } catch (error: any) {
      console.error('❌ Update comment error:', error.response?.data || error.message);
      if (error.response?.status === 403) throw new Error('You can only edit your own comments');
      throw new Error(error.response?.data?.error || 'Failed to update comment');
    }
  }

  async deleteComment(commentId: number): Promise<void> {
    try {
      await api.delete(`/comments/${commentId}`);
      console.log('✅ Comment deleted');
    } catch (error: any) {
      console.error('❌ Delete comment error:', error.response?.data || error.message);
      if (error.response?.status === 403) throw new Error('You can only delete your own comments');
      throw new Error(error.response?.data?.error || 'Failed to delete comment');
    }
  }

  async upvoteComment(commentId: number): Promise<void> {
    try {
      await api.post(`/comments/${commentId}/upvote`, {});
      console.log('✅ Comment upvoted');
    } catch (error: any) {
      console.error('❌ Upvote error:', error.response?.data || error.message);
      if (error.response?.status === 401) throw new Error('You must be logged in to upvote');
      throw new Error(error.response?.data?.error || 'Failed to upvote comment');
    }
  }

  async downvoteComment(commentId: number): Promise<void> {
    try {
      await api.post(`/comments/${commentId}/downvote`, {});
      console.log('✅ Comment downvoted');
    } catch (error: any) {
      console.error('❌ Downvote error:', error.response?.data || error.message);
      if (error.response?.status === 401) throw new Error('You must be logged in to downvote');
      throw new Error(error.response?.data?.error || 'Failed to downvote comment');
    }
  }
}

export default new CommentService();
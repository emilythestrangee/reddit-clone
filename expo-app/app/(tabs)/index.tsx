import { View, FlatList, Text, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import PostListItem from '@/components/PostListItem';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import postService, { Post } from '../../services/postService';
import placeholderPosts from '../assets/data/posts.json';

export default function HomeScreen() {
  const { theme } = useTheme();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const bgColor = theme === 'dark' ? '#030303' : '#ffffff';
  const textColor = theme === 'dark' ? '#d7dadc' : '#030303';

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch posts from API
  const fetchPosts = async (isRefresh = false) => {
    try {
      if (!isRefresh) {
        setLoading(true);
      }
      setError(null);

      console.log('📥 Fetching posts from backend...');
      const fetchedPosts = await postService.getPosts();
      
      console.log(`✅ Fetched ${fetchedPosts.length} posts`);
      setPosts([...fetchedPosts, ...(placeholderPosts as any[])]);
    } catch (err: any) {
      console.error('❌ Error fetching posts:', err);
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch posts on mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts(true);
  };

  // Prompt for login when trying to create post
  const handleCreatePost = () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'You need to be logged in to create a post',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Login', 
            onPress: () => router.push('/auth/page' as any)
          }
        ]
      );
      return;
    }
    router.push('/(tabs)/create' as any);
  };

  // Loading state
  if (loading && !refreshing) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: bgColor, 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <ActivityIndicator size="large" color="#FF5700" />
        <Text style={{ color: textColor, marginTop: 16 }}>Loading posts...</Text>
      </View>
    );
  }

  // Error state
  if (error && !refreshing) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: bgColor, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20
      }}>
        <Text style={{ color: '#FF6B6B', fontSize: 18, marginBottom: 8 }}>
          Failed to load posts
        </Text>
        <Text style={{ color: textColor, textAlign: 'center', marginBottom: 16 }}>
          {error}
        </Text>
        <Text 
          style={{ color: '#FF5700', fontSize: 16 }} 
          onPress={() => fetchPosts()}
        >
          Tap to retry
        </Text>
      </View>
    );
  }

  // Empty state
  if (posts.length === 0 && !loading) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: bgColor, 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20
      }}>
        <Text style={{ color: textColor, fontSize: 18, marginBottom: 8 }}>
          No posts yet
        </Text>
        <Text style={{ color: theme === 'dark' ? '#818384' : '#7c7c7c', textAlign: 'center' }}>
          {isAuthenticated 
            ? 'Be the first to create a post!' 
            : 'Login to create your first post!'}
        </Text>
        {isAuthenticated && (
          <Text 
            style={{ color: '#FF5700', fontSize: 16, marginTop: 16 }} 
            onPress={() => router.push('/(tabs)/create' as any)}
          >
            Create Post
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostListItem post={item} />}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF5700"
            colors={['#FF5700']}
          />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
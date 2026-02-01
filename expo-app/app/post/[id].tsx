import { useState, useRef, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, View, TextInput, Pressable, KeyboardAvoidingView, Platform, FlatList, ActivityIndicator, Alert, StyleSheet } from "react-native";
import placeholderPosts from '../assets/data/posts.json';
import placeholderComments from '../assets/data/comments.json';
import PostListItem from '@/components/PostListItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import postService from '../../services/postService';
import commentService from '../../services/commentService';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function PostDetailed() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [comment, setComment] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [commentVotes, setCommentVotes] = useState<Record<number, { state: 1 | -1 | 0, upvotes: number, downvotes: number }>>({});
  const inputRef = useRef<TextInput | null>(null);

  const colors = {
    dark: { bg: '#030303', text: '#d7dadc', secondaryText: '#818384', border: '#343536', inputBg: '#1a1a1b', commentBg: '#1a1a1b' },
    light: { bg: '#ffffff', text: '#030303', secondaryText: '#7c7c7c', border: '#e5e5e5', inputBg: '#f6f7f8', commentBg: '#f6f7f8' },
  };
  const currentColors = colors[theme];

useEffect(() => {
    const loadPost = async () => {
      try {
        setIsLoading(true);
        const postId = String(id);

        // First check if it's a placeholder post
        const localPost = (placeholderPosts as any[]).find(
          p => String(p.id) === postId
        );

        if (localPost) {
          // It's a placeholder post — use local data
          setPost(localPost);
          const localComments = (placeholderComments as any[]).filter(
            c => String(c.post_id) === postId
          );
          setComments(localComments);
          console.log('✅ Loaded placeholder post:', localPost.title);
        } else {
          // It's an API post — fetch from server
          console.log('📥 Fetching API post:', postId);
          const fetched = await postService.getPost(Number(postId));
          setPost(fetched);

          try {
            const fetched_comments = await commentService.getComments(Number(postId));
            setComments(fetched_comments);
            console.log('✅ Loaded comments:', fetched_comments.length);
          } catch (error) {
            console.log('No comments yet or error fetching');
            setComments([]);
          }
        }
      } catch (error: any) {
        console.error('❌ Failed to load post:', error);
        Alert.alert('Error', 'Failed to load post');
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    if (id) loadPost();
  }, [id]);

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;
    if (!isAuthenticated) {
      Alert.alert('Sign In Required', 'You must sign in to comment', [
        { text: 'Cancel' },
        { text: 'Sign In', onPress: () => router.push('../auth/page') }
      ]);
      return;
    }
    try {
      setIsSending(true);
      const newComment = await commentService.createComment(Number(id), comment.trim());
      setComments(prev => [newComment, ...prev]);
      setComment('');
      setIsInputFocused(false);
      inputRef.current?.blur();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to post comment');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: currentColors.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF4500" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={{ flex: 1, backgroundColor: currentColors.bg, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: currentColors.text, fontSize: 18 }}>Post Not Found</Text>
      </View>
    );
  }

const renderComment = ({ item }: { item: any }) => {
    const isOwnComment = isAuthenticated && item.user?.id === user?.id;
    const voteData = commentVotes[item.id] || { state: 0, upvotes: item.upvotes || 0, downvotes: item.downvotes || 0 };
    const voteState = voteData.state;
    const localUpvotes = voteData.upvotes;
    const localDownvotes = voteData.downvotes;

    const handleEdit = async () => {
      if (!editText.trim()) return;
      try {
        setIsEditing(true);
        const updated = await commentService.updateComment(item.id, editText.trim());
        setComments(prev => prev.map(c => c.id === item.id ? updated : c));
        setEditingId(null);
        setEditText('');
      } catch (err: any) {
        Alert.alert('Error', err.message);
      } finally {
        setIsEditing(false);
      }
    };

    const handleDelete = async () => {
      Alert.alert('Delete Comment', 'Are you sure?', [
        { text: 'Cancel' },
        { 
          text: 'Delete', 
          onPress: async () => {
            try {
              await commentService.deleteComment(item.id);
              setComments(prev => prev.filter(c => c.id !== item.id));
            } catch (err: any) {
              Alert.alert('Error', err.message);
            }
          },
          style: 'destructive'
        }
      ]);
    };

    const handleUpvote = async () => {
      if (!isAuthenticated) {
        Alert.alert('Sign In Required', 'You must sign in to upvote', [
          { text: 'Cancel' },
          { text: 'Sign In', onPress: () => router.push('../auth/page') }
        ]);
        return;
      }

      try {
        // Optimistic update
        setCommentVotes(prev => ({
          ...prev,
          [item.id]: {
            state: voteState === 1 ? 0 : 1,
            upvotes: voteState === 1 ? localUpvotes - 1 : (voteState === -1 ? localUpvotes + 1 : localUpvotes + 1),
            downvotes: voteState === -1 ? localDownvotes - 1 : localDownvotes
          }
        }));

        await commentService.upvoteComment(item.id);
      } catch (err: any) {
        // Revert
        setCommentVotes(prev => ({
          ...prev,
          [item.id]: { state: 0, upvotes: item.upvotes || 0, downvotes: item.downvotes || 0 }
        }));
        Alert.alert('Error', err.message);
      }
    };

    const handleDownvote = async () => {
      if (!isAuthenticated) {
        Alert.alert('Sign In Required', 'You must sign in to downvote', [
          { text: 'Cancel' },
          { text: 'Sign In', onPress: () => router.push('../auth/page') }
        ]);
        return;
      }

      try {
        // Optimistic update
        setCommentVotes(prev => ({
          ...prev,
          [item.id]: {
            state: voteState === -1 ? 0 : -1,
            upvotes: voteState === 1 ? localUpvotes - 1 : localUpvotes,
            downvotes: voteState === -1 ? localDownvotes - 1 : (voteState === 1 ? localDownvotes + 1 : localDownvotes + 1)
          }
        }));

        await commentService.downvoteComment(item.id);
      } catch (err: any) {
        // Revert
        setCommentVotes(prev => ({
          ...prev,
          [item.id]: { state: 0, upvotes: item.upvotes || 0, downvotes: item.downvotes || 0 }
        }));
        Alert.alert('Error', err.message);
      }
    };

    if (editingId === item.id) {
      return (
        <View style={[styles.commentContainer, { borderBottomColor: currentColors.border, backgroundColor: currentColors.commentBg }]}>
          <TextInput
            value={editText}
            onChangeText={setEditText}
            placeholder="Edit comment..."
            placeholderTextColor={currentColors.secondaryText}
            style={[styles.textInput, { backgroundColor: currentColors.inputBg, color: currentColors.text, marginBottom: 8 }]}
            multiline
          />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable 
              onPress={handleEdit} 
              disabled={isEditing}
              style={{ flex: 1, backgroundColor: '#0d469b', padding: 8, borderRadius: 6, alignItems: 'center' }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>{isEditing ? 'Saving...' : 'Save'}</Text>
            </Pressable>
            <Pressable 
              onPress={() => setEditingId(null)}
              style={{ flex: 1, backgroundColor: currentColors.border, padding: 8, borderRadius: 6, alignItems: 'center' }}
            >
              <Text style={{ color: currentColors.text }}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.commentContainer, { borderBottomColor: currentColors.border, backgroundColor: currentColors.commentBg }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <View style={[styles.commentAvatar, { backgroundColor: '#FF4500' }]}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
              {(item.user?.username || item.user?.name || 'u')[0].toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.commentUsername, { color: '#2E5DAA' }]}>
            u/{item.user?.username || item.user?.name || 'unknown'}
          </Text>
          <Text style={{ color: currentColors.secondaryText, fontSize: 12 }}>• just now</Text>
        </View>
        <Text style={[styles.commentText, { color: currentColors.text }]}>
          {item.content || item.body || item.text}
        </Text>

        {/* Comment Actions */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8, paddingLeft: 36 }}>
          {/* Upvote */}
          <Pressable onPress={handleUpvote} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MaterialCommunityIcons 
              name={voteState === 1 ? "arrow-up-bold" : "arrow-up-bold-outline"} 
              size={16} 
              color={voteState === 1 ? '#FF4500' : currentColors.secondaryText} 
            />
            <Text style={{ color: voteState === 1 ? '#FF4500' : currentColors.secondaryText, fontSize: 13, fontWeight: '600' }}>
              {localUpvotes}
            </Text>
          </Pressable>

          {/* Downvote */}
          <Pressable onPress={handleDownvote} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MaterialCommunityIcons 
              name={voteState === -1 ? "arrow-down-bold" : "arrow-down-bold-outline"} 
              size={16} 
              color={voteState === -1 ? '#7193FF' : currentColors.secondaryText} 
            />
            <Text style={{ color: voteState === -1 ? '#7193FF' : currentColors.secondaryText, fontSize: 13, fontWeight: '600' }}>
              {localDownvotes}
            </Text>
          </Pressable>

          {/* Reply */}
          <Pressable onPress={() => inputRef.current?.focus()}>
            <Text style={{ color: currentColors.secondaryText, fontSize: 13, fontWeight: '600' }}>Reply</Text>
          </Pressable>

          {/* Edit/Delete (owner only) */}
          {isOwnComment && (
            <>
              <Pressable onPress={() => { setEditingId(item.id); setEditText(item.body || item.content || ''); }}>
                <Text style={{ color: currentColors.secondaryText, fontSize: 13, fontWeight: '600' }}>Edit</Text>
              </Pressable>
              <Pressable onPress={handleDelete}>
                <Text style={{ color: '#dc3545', fontSize: 13, fontWeight: '600' }}>Delete</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    );
  };

return (
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    style={{ flex: 1, backgroundColor: currentColors.bg }}
    keyboardVerticalOffset={insets.top + 10}
  >
    <FlatList
      ListHeaderComponent={<PostListItem post={post} isDetailedPost />}
      data={comments}
      renderItem={renderComment}
      keyExtractor={(item, index) => item?.id?.toString() || `comment-${index}`}
      ListEmptyComponent={
        <View style={{ padding: 30, alignItems: 'center' }}>
          <Text style={{ color: currentColors.secondaryText, fontSize: 15 }}>No comments yet. Be the first!</Text>
        </View>
      }
      style={{ backgroundColor: currentColors.bg }}
    />

    {/* Comment Input - stays attached */}
    <View style={[styles.commentInput, { borderTopColor: currentColors.border, backgroundColor: currentColors.bg, paddingBottom: insets.bottom + 5 }]}>
      <TextInput
        placeholder="Join the conversation"
        placeholderTextColor={currentColors.secondaryText}
        ref={inputRef}
        value={comment}
        onChangeText={setComment}
        style={[styles.textInput, { backgroundColor: currentColors.inputBg, color: currentColors.text }]}
        multiline
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
      />
      {isInputFocused && (
        <Pressable
          disabled={!comment.trim() || isSending}
          onPress={handleSubmitComment}
          style={[styles.replyBtn, { backgroundColor: !comment.trim() || isSending ? currentColors.border : '#0d469b' }]}
        >
          <Text style={styles.replyText}>{isSending ? 'Posting...' : 'Reply'}</Text>
        </Pressable>
      )}
    </View>
  </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
  commentContainer: {
    padding: 12,
    borderBottomWidth: 0.5,
  },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentUsername: { fontSize: 13, fontWeight: '600' },
  commentText: { fontSize: 14, lineHeight: 20, paddingLeft: 36 },
  commentInput: {
    padding: 10,
    paddingBottom: 5, 
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  textInput: {
    padding: 8,
    borderRadius: 8,
    minHeight: 40,
  },
  replyBtn: {
    borderRadius: 15,
    alignSelf: 'flex-end',
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 16,
  },
  replyText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});
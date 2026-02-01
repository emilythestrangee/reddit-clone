import { Image, Pressable, Text, View, StyleSheet, Alert, TextInput } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { formatDistanceToNowStrict } from 'date-fns';
import { Link, useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import postService from '../services/postService';

type PostListItemProps = {
  post: any;
  isDetailedPost?: boolean;
}

export default function PostListItem({ post, isDetailedPost }: PostListItemProps) {
  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Normalize both local JSON and API shapes
  const postId = Number(post.id);
  const title = post.title || '';
  const description = post.description || post.body || post.content || '';
  const image = post.image || null;
  const createdAt = post.created_at || new Date().toISOString();
  const communityName = post.community || post.group?.name || 'r/Community';
  const communityImage = post.group?.image || 'https://via.placeholder.com/50?text=r';
  const username = post.user?.username || post.user?.name || 'unknown';
  const commentCount = post.nr_of_comments || post.comments || 0;
  const isLocalPost = !!post.group;

  const [upvotes, setUpvotes] = useState<number>(post.upvotes || 0);
  const [voteState, setVoteState] = useState<1 | -1 | 0>(0);
  const [showMenu, setShowMenu] = useState(false);

  // Inline edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editBody, setEditBody] = useState(description);
  const [isSaving, setIsSaving] = useState(false);

  const isOwner = isAuthenticated && user?.id === (post.user_id || post.author_id || post.user?.id);

  const colors = {
    dark: { bg: '#1a1a1b', text: '#d7dadc', secondaryText: '#818384', border: '#343536', menuBg: '#272729', inputBg: '#272729' },
    light: { bg: '#ffffff', text: '#030303', secondaryText: '#7c7c7c', border: '#e5e5e5', menuBg: '#f6f7f8', inputBg: '#f0f0f0' },
  };
  const currentColors = colors[theme];

  const handleVote = async (type: 1 | -1) => {
    if (!isAuthenticated) {
      Alert.alert('Sign In Required', 'You must sign in to vote', [
        { text: 'Cancel' },
        { text: 'Sign In', onPress: () => router.push('../auth/page') }
      ]);
      return;
    }
    if (isLocalPost) return;

    try {
      if (voteState === type) {
        setUpvotes(prev => prev - type);
        setVoteState(0);
        await postService.votePost(postId, type === 1 ? -1 : 1);
      } else {
        if (voteState !== 0) setUpvotes(prev => prev - voteState);
        setUpvotes(prev => prev + type);
        setVoteState(type);
        await postService.votePost(postId, type);
      }
    } catch {
      setUpvotes(post.upvotes || 0);
      setVoteState(0);
    }
  };

  const handleDelete = async () => {
    setShowMenu(false);
    Alert.alert('Delete Post', 'Are you sure? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await postService.deletePost(postId);
            Alert.alert('Deleted', 'Post has been deleted.');
            router.back();
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to delete');
          }
        }
      }
    ]);
  };

  // Start editing — prefill with current values
  const handleEditPress = () => {
    setShowMenu(false);
    setEditTitle(title);
    setEditBody(description);
    setIsEditing(true);
  };

  // Save edits
  const handleSave = async () => {
    if (!editTitle.trim()) {
      Alert.alert('Error', 'Title cannot be empty');
      return;
    }
    setIsSaving(true);
    try {
      await postService.updatePost(postId, {
        title: editTitle.trim(),
        body: editBody.trim(),
        content: editBody.trim(),
      });
      setIsEditing(false);
      Alert.alert('Success', 'Post updated!');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update');
    } finally {
      setIsSaving(false);
    }
  };

  const shouldShowImage = isDetailedPost || image;
  const shouldShowDescription = isDetailedPost || !image;

  // ─── EDITING MODE ───
  if (isEditing) {
    return (
      <View style={{ paddingHorizontal: 15, paddingVertical: 14, gap: 10, borderBottomColor: currentColors.border, borderBottomWidth: 0.5, backgroundColor: currentColors.bg }}>
        <Text style={{ color: currentColors.secondaryText, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>Editing Post</Text>

        <Text style={{ color: currentColors.secondaryText, fontSize: 13, marginTop: 4 }}>Title</Text>
        <TextInput
          value={editTitle}
          onChangeText={setEditTitle}
          placeholder="Title"
          placeholderTextColor={currentColors.secondaryText}
          style={{
            backgroundColor: currentColors.inputBg,
            color: currentColors.text,
            padding: 10,
            borderRadius: 8,
            fontSize: 16,
            fontWeight: '600',
            borderWidth: 1,
            borderColor: currentColors.border,
          }}
          multiline
          scrollEnabled={false}
        />

        <Text style={{ color: currentColors.secondaryText, fontSize: 13, marginTop: 4 }}>Body</Text>
        <TextInput
          value={editBody}
          onChangeText={setEditBody}
          placeholder="Body text (optional)"
          placeholderTextColor={currentColors.secondaryText}
          style={{
            backgroundColor: currentColors.inputBg,
            color: currentColors.text,
            padding: 10,
            borderRadius: 8,
            fontSize: 14,
            minHeight: 80,
            borderWidth: 1,
            borderColor: currentColors.border,
          }}
          multiline
          scrollEnabled={false}
        />

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
          <Pressable
            onPress={handleSave}
            disabled={isSaving}
            style={{ flex: 1, backgroundColor: isSaving ? currentColors.border : '#FF4500', padding: 10, borderRadius: 20, alignItems: 'center' }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>{isSaving ? 'Saving...' : 'Save'}</Text>
          </Pressable>
          <Pressable
            onPress={() => setIsEditing(false)}
            style={{ flex: 1, backgroundColor: currentColors.border, padding: 10, borderRadius: 20, alignItems: 'center' }}
          >
            <Text style={{ color: currentColors.text, fontWeight: 'bold', fontSize: 14 }}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ─── NORMAL VIEW ───
  const content = (
    <View style={{ paddingHorizontal: 15, paddingVertical: 10, gap: 7, borderBottomColor: currentColors.border, borderBottomWidth: 0.5, backgroundColor: currentColors.bg }}>
      {/* HEADER */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={{ uri: communityImage }} style={{ width: 20, height: 20, borderRadius: 10, marginRight: 5 }} />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 13, color: currentColors.text }}>{communityName}</Text>
            <Text style={{ color: currentColors.secondaryText, fontSize: 13 }}>
              {formatDistanceToNowStrict(new Date(createdAt))}
            </Text>
          </View>
          <Text style={{ fontSize: 13, color: '#2E5DAA', marginTop: 1 }}>u/{username}</Text>
        </View>

        {/* 3-dot menu */}
        {isOwner && !isLocalPost && (
          <View>
            <Pressable onPress={() => setShowMenu(!showMenu)} style={{ padding: 4 }}>
              <MaterialCommunityIcons name="dots-vertical" size={20} color={currentColors.secondaryText} />
            </Pressable>
            {showMenu && (
              <View style={[styles.menu, { backgroundColor: currentColors.menuBg, borderColor: currentColors.border }]}>
                <Pressable onPress={handleEditPress} style={styles.menuItem}>
                  <MaterialCommunityIcons name="pencil" size={16} color={currentColors.text} />
                  <Text style={[styles.menuText, { color: currentColors.text }]}>Edit</Text>
                </Pressable>
                <Pressable onPress={handleDelete} style={styles.menuItem}>
                  <MaterialCommunityIcons name="delete" size={16} color="#EA0027" />
                  <Text style={[styles.menuText, { color: '#EA0027' }]}>Delete</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </View>

      {/* TITLE */}
      <Text style={{ fontWeight: 'bold', fontSize: 17, letterSpacing: 0.5, color: currentColors.text }}>{title}</Text>

      {/* IMAGE */}
      {shouldShowImage && image && (
        <Image source={{ uri: image }} style={{ width: '100%', aspectRatio: 4 / 3, borderRadius: 15 }} />
      )}

      {/* DESCRIPTION */}
      {shouldShowDescription && description ? (
        <Text numberOfLines={isDetailedPost ? undefined : 4} style={{ color: currentColors.text }}>
          {description}
        </Text>
      ) : null}

      {/* FOOTER */}
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={[styles.iconBox, { flexDirection: 'row', alignItems: 'center', borderColor: currentColors.border }]}>
            <Pressable onPress={() => handleVote(1)} hitSlop={8}>
              <MaterialCommunityIcons name="arrow-up-bold-outline" size={19} color={voteState === 1 ? '#FF4500' : currentColors.text} />
            </Pressable>
            <Text style={{ fontWeight: '500', marginHorizontal: 6, color: currentColors.text }}>{upvotes}</Text>
            <View style={{ width: 1, backgroundColor: currentColors.border, height: 14 }} />
            <Pressable onPress={() => handleVote(-1)} hitSlop={8}>
              <MaterialCommunityIcons name="arrow-down-bold-outline" size={19} color={voteState === -1 ? '#7193FF' : currentColors.text} />
            </Pressable>
          </View>

          <View style={[styles.iconBox, { flexDirection: 'row', alignItems: 'center', borderColor: currentColors.border }]}>
            <MaterialCommunityIcons name="comment-outline" size={19} color={currentColors.text} />
            <Text style={{ fontWeight: '500', marginLeft: 5, color: currentColors.text }}>{commentCount}</Text>
          </View>
        </View>

        <View style={{ marginLeft: 'auto', flexDirection: 'row', gap: 10 }}>
          <MaterialCommunityIcons name="trophy-outline" size={19} color={currentColors.text} style={styles.iconBox} />
          <MaterialCommunityIcons name="share-outline" size={19} color={currentColors.text} style={styles.iconBox} />
        </View>
      </View>
    </View>
  );

  if (isDetailedPost) return content;

  return (
    <Link href={`/post/${postId}` as any} asChild>
      <Pressable>{content}</Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    borderWidth: 0.5,
    borderColor: '#D4D4D4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  menu: {
    position: 'absolute',
    top: 28,
    right: 0,
    borderWidth: 1,
    borderRadius: 8,
    padding: 4,
    zIndex: 10,
    minWidth: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
    borderRadius: 6,
  },
  menuText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
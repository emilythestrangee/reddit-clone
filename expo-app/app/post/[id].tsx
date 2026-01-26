import { useState, useRef, useCallback } from 'react'
import { useLocalSearchParams } from "expo-router";
import { Text, View, TextInput, Pressable, KeyboardAvoidingView, Platform, FlatList } from "react-native";
import posts from '../assets/data/posts.json';
import PostListItem from '@/components/PostListItem';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import comments from '../assets/data/comments.json';
import CommentListItem from '@/components/CommentListItem';
import { useTheme } from '../../contexts/ThemeContext';


export default function PostDetailed() {
  const { id } = useLocalSearchParams()
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const [comment, setComment] = useState<string>('')
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false)
  const inputRef = useRef<TextInput | null>(null);

  const colors = {
    dark: { bg: '#030303', text: '#d7dadc', secondaryText: '#818384', border: '#343536', inputBg: '#1a1a1b' },
    light: { bg: '#ffffff', text: '#030303', secondaryText: '#7c7c7c', border: '#e5e5e5', inputBg: '#f6f7f8' },
  };
  const currentColors = colors[theme];

  const detailedPost = posts.find((post) => post.id === id)
  const postComments = comments.filter(
    (comment) => comment.post_id === detailedPost?.id
  );

  if (!detailedPost) {
    return <Text>Post Not Found!</Text>;
  }

  // useCallback with memo inside CommentListItem prevents re-renders when replying to a comment
  const handleReplyPress = useCallback((commentId: string) => {
    console.log(commentId)
    inputRef.current?.focus();
  }, []);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: currentColors.bg }} keyboardVerticalOffset={insets.top + 10}>
      <FlatList
        ListHeaderComponent={
          <PostListItem post={detailedPost} isDetailedPost />
        }
        data={postComments}
        renderItem={({ item }) => <CommentListItem comment={item} depth={0} handleReplyPress={handleReplyPress} />}
        style={{ backgroundColor: currentColors.bg }}
      />
      {/* POST A COMMENT */}
      <View style={{
        paddingBottom: insets.bottom, borderBottomWidth: 1, borderBottomColor: currentColors.border, padding: 10, backgroundColor: currentColors.bg, borderRadius: 10, shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: -3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,

        elevation: 4,
      }}>
        <TextInput
          placeholder="Join the conversation"
          placeholderTextColor={currentColors.secondaryText}
          ref={inputRef}
          value={comment}
          onChangeText={(text) => setComment(text)}
          style={{ backgroundColor: currentColors.inputBg, padding: 5, borderRadius: 5, color: currentColors.text }}
          multiline
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />
        {isInputFocused &&
          <Pressable disabled={!comment} onPress={() => console.error('Pressed')} style={{ backgroundColor: !comment ? currentColors.border : '#0d469b', borderRadius: 15, marginLeft: 'auto', marginTop: 15 }}>
            <Text style={{ color: 'white', paddingVertical: 5, paddingHorizontal: 10, fontWeight: 'bold', fontSize: 13 }}>Reply</Text>
          </Pressable>
        }
      </View>
    </KeyboardAvoidingView>
  )
}
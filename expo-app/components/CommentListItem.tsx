import { useState, memo } from "react";
import { View, Text, Image, FlatList, Pressable } from "react-native";
import { Entypo, Octicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDistanceToNowStrict } from 'date-fns';
import { Comment } from '@/types/types';
import { useTheme } from '../contexts/ThemeContext';

type CommentListItemProps = {
  comment: Comment;
  depth: number;
  handleReplyPress: (commentId: string) => void;
}

const CommentListItem = ({ comment, depth, handleReplyPress }: CommentListItemProps) => {
  const [showReplies, setShowReplies] = useState(false);
  const { theme } = useTheme();

  const colors = {
    dark: { bg: '#030303', text: '#d7dadc', secondaryText: '#818384', border: '#343536', btnBg: '#1a1a1b' },
    light: { bg: '#ffffff', text: '#030303', secondaryText: '#7c7c7c', border: '#e5e5e5', btnBg: '#ededed' },
  };
  const currentColors = colors[theme];

  return (
    <View
      style={{
        backgroundColor: currentColors.bg,
        marginTop: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        gap: 10,
        borderLeftWidth: depth > 0 ? 1 : 0,
        borderLeftColor: currentColors.border,
      }}
    >
      {/* User Info */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
        <Image
          source={{
            uri: comment.user.image || "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/3.jpg",
          }}
          style={{ width: 28, height: 28, borderRadius: 15, marginRight: 4 }}
        />
        <Text style={{ fontWeight: "600", color: currentColors.secondaryText, fontSize: 13 }}>{comment.user.name}</Text>
        <Text style={{ color: currentColors.secondaryText, fontSize: 13 }}>&#x2022;</Text>
        <Text style={{ color: currentColors.secondaryText, fontSize: 13 }}>
          {formatDistanceToNowStrict(new Date(comment.created_at))}
        </Text>
      </View>

      {/* Comment Content */}
      <Text style={{ color: currentColors.text }}>{comment.comment}</Text>

      {/* Comment Actions */}
      <View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 14 }}>
        <Entypo name="dots-three-horizontal" size={15} color={currentColors.secondaryText} />
        <Octicons name="reply" size={16} color={currentColors.secondaryText} onPress={() => handleReplyPress(comment.id)}/>
        <MaterialCommunityIcons name="trophy-outline" size={16} color={currentColors.secondaryText} />
        <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
          <MaterialCommunityIcons name="arrow-up-bold-outline" size={18} color={currentColors.secondaryText} />
          <Text style={{ fontWeight: "500", color: currentColors.secondaryText }}>{comment.upvotes}</Text>
          <MaterialCommunityIcons name="arrow-down-bold-outline" size={18} color={currentColors.secondaryText} />
        </View>
      </View>

      {/* Show Replies Button */}
      {(comment.replies.length > 0 && depth < 5 && !showReplies) && (
        <Pressable onPress={() => setShowReplies(true)} style={{ backgroundColor: currentColors.btnBg, borderRadius: 3, paddingVertical: 3, alignItems: 'center'}}>
          <Text style={{ fontSize: 12, letterSpacing: 0.5, fontWeight: '500', color: currentColors.secondaryText}}>Show Replies</Text>
        </Pressable>
      )}

      {/* Nested Replies */}
      {showReplies && (
        <FlatList
          data={comment.replies}
          keyExtractor={(reply) => reply.id}
          renderItem={({ item }) => <CommentListItem comment={item} depth={depth + 1} handleReplyPress={handleReplyPress} />}
        />
      )}
    </View>

  )
};

export default memo(CommentListItem);
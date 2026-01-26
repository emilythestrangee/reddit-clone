import { Image, Pressable, Text, View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Post } from '../types/types';
import { formatDistanceToNowStrict } from 'date-fns';
import { Link } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

type PostListItemProps = {
  post: Post;
  isDetailedPost?: boolean;
}

export default function PostListItem({ post, isDetailedPost }: PostListItemProps) {
  const { theme } = useTheme();
  const shouldShowImage = isDetailedPost || post.image;
  const shouldShowDescription = isDetailedPost || !post.image;
  const colors = {
    dark: { bg: '#1a1a1b', text: '#d7dadc', secondaryText: '#818384', border: '#343536' },
    light: { bg: '#ffffff', text: '#030303', secondaryText: '#7c7c7c', border: '#e5e5e5' },
  };
  const currentColors = colors[theme];

  return (
    <Link href={`/post/${post.id}` as any}>
      <View style={{ paddingHorizontal: 15, paddingVertical: 10, gap: 7, borderBottomColor: currentColors.border, borderBottomWidth: 0.5, backgroundColor: currentColors.bg }}>
      {/* HEADER */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image source={{ uri: post.group.image }} style={{ width: 20, height: 20, borderRadius: 10, marginRight: 5 }} />
          <View>
            <View style={{ flexDirection: 'row', gap: 5 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 13, color: currentColors.text }}>{post.group.name}</Text>
              <Text style={{ color: currentColors.secondaryText, fontSize: 13, alignSelf: 'flex-start' }}>{formatDistanceToNowStrict(new Date(post.created_at))}</Text>
            </View>
            {isDetailedPost && <Text style={{ fontSize: 13, color: '#2E5DAA' }}>{post.user.name}</Text>}
          </View>
          <Pressable onPress={() => console.error('Pressed')} style={{ marginLeft: 'auto', backgroundColor: '#0d469b', borderRadius: 10 }}>
            <Text style={{ color: 'white', paddingVertical: 2, paddingHorizontal: 7, fontWeight: 'bold', fontSize: 13 }}>Join</Text>
          </Pressable>
        </View>

        {/* CONTENT */}
        <Text style={{ fontWeight: 'bold', fontSize: 17, letterSpacing: 0.5, color: currentColors.text }}>{post.title}</Text>
        {shouldShowImage && post.image && (
          <Image source={{ uri: post.image }} style={{ width: "100%", aspectRatio: 4 / 3, borderRadius: 15 }} />
        )}

        {shouldShowDescription && post.description && (
          <Text numberOfLines={isDetailedPost ? undefined : 4} style={{ color: currentColors.text }}>
            {post.description}
          </Text>
        )}

        {/* FOOTER */}
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={[{ flexDirection: 'row' }, styles.iconBox, { borderColor: currentColors.border }]}>
              <MaterialCommunityIcons name="arrow-up-bold-outline" size={19} color={currentColors.text} />
              <Text style={{ fontWeight: '500', marginLeft: 5, alignSelf: 'center', color: currentColors.text }}>{post.upvotes}</Text>
              <View style={{ width: 1, backgroundColor: currentColors.border, height: 14, marginHorizontal: 7, alignSelf: 'center' }} />
              <MaterialCommunityIcons name="arrow-down-bold-outline" size={19} color={currentColors.text} />
            </View>
            <View style={[{ flexDirection: 'row' }, styles.iconBox, { borderColor: currentColors.border }]}>
              <MaterialCommunityIcons name="comment-outline" size={19} color={currentColors.text} />
              <Text style={{ fontWeight: '500', marginLeft: 5, alignSelf: 'center', color: currentColors.text }}>{post.nr_of_comments}</Text>
            </View>
          </View>
          <View style={{ marginLeft: 'auto', flexDirection: 'row', gap: 10 }}>
            <MaterialCommunityIcons name="trophy-outline" size={19} color={currentColors.text} style={styles.iconBox} />
            <MaterialCommunityIcons name="share-outline" size={19} color={currentColors.text} style={styles.iconBox} />
          </View>
        </View>
      </View>
    </Link>
  )
}

const styles = StyleSheet.create({
  iconBox: {
    borderWidth: 0.5,
    borderColor: '#D4D4D4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20
  },
});
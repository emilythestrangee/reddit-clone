import { View, FlatList } from 'react-native';
import PostListItem from '@/components/PostListItem';
import posts from '../assets/data/posts.json';
import { useTheme } from '../../contexts/ThemeContext';

export default function HomeScreen() {
  const { theme } = useTheme();
  const bgColor = theme === 'dark' ? '#030303' : '#ffffff';

  return (
    <View style={{ flex: 1, backgroundColor: bgColor }}>
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostListItem post={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

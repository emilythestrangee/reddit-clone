import { View, TextInput, StyleSheet, Text, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useState } from "react";
import { useRouter, Stack } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import posts from '../assets/data/posts.json';
import PostListItem from '../../components/PostListItem';

export default function SearchScreen() {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("posts");
  const router = useRouter(); // FIXED: use expo-router
  const insets = useSafeAreaInsets();

  const colors = {
    dark: { 
      bg: '#030303', 
      text: '#d7dadc', 
      secondaryText: '#818384',
      inputBg: '#1a1a1b',
      border: '#343536',
      tabBg: '#272729',
      activeTabBg: '#343536'
    },
    light: { 
      bg: '#ffffff', 
      text: '#030303', 
      secondaryText: '#7c7c7c',
      inputBg: '#f6f7f8',
      border: '#e5e5e5',
      tabBg: '#f6f7f8',
      activeTabBg: '#e5e5e5'
    },
  };

  const currentColors = colors[theme];

  const tabs = [
    { id: 'posts', label: 'Posts' },
    { id: 'communities', label: 'Communities' },
    { id: 'people', label: 'People' },
    { id: 'comments', label: 'Comments' },
    { id: 'media', label: 'Media' },
  ];

  // Search logic against local data
  const filteredPosts = query.length > 0
    ? (posts as any[]).filter(p =>
        p.title?.toLowerCase().includes(query.toLowerCase()) ||
        p.body?.toLowerCase().includes(query.toLowerCase()) ||
        p.content?.toLowerCase().includes(query.toLowerCase()) ||
        p.community?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredCommunities = query.length > 0
    ? [...new Set((posts as any[]).map(p => p.community).filter(Boolean))]
        .filter((c: string) => c.toLowerCase().includes(query.toLowerCase()))
    : [];

  const filteredUsers = query.length > 0
    ? [...new Set((posts as any[]).map(p => p.user?.username).filter(Boolean))]
        .filter((u: string) => u.toLowerCase().includes(query.toLowerCase()))
    : [];

  const getResults = () => {
    switch (activeTab) {
      case 'posts': return filteredPosts;
      case 'communities': return filteredCommunities;
      case 'people': return filteredUsers;
      default: return filteredPosts;
    }
  };

  const results = getResults();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: currentColors.bg }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: currentColors.bg, paddingTop: insets.top + 8 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={currentColors.text} />
          </TouchableOpacity>
          <View style={[styles.inputContainer, { backgroundColor: currentColors.inputBg }]}>
            <MaterialIcons name="search" size={24} color={currentColors.secondaryText} />
            <TextInput
              autoFocus
              placeholder="Search Reddit"
              placeholderTextColor={currentColors.secondaryText}
              value={query}
              onChangeText={setQuery}
              style={[styles.input, { color: currentColors.text }]}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")}>
                <MaterialIcons name="close" size={20} color={currentColors.secondaryText} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Tabs */}
        <View style={[styles.tabsWrapper, { backgroundColor: currentColors.bg, borderBottomColor: currentColors.border }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, { backgroundColor: activeTab === tab.id ? currentColors.activeTabBg : 'transparent' }]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text style={[styles.tabText, { color: activeTab === tab.id ? '#FF4500' : currentColors.secondaryText }]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Results */}
        <View style={styles.content}>
          {query.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="search" size={64} color={currentColors.secondaryText} />
              <Text style={[styles.emptyTitle, { color: currentColors.text }]}>Search Reddit</Text>
              <Text style={[styles.emptySubtitle, { color: currentColors.secondaryText }]}>
                Find posts, communities, people, comments, and media
              </Text>
            </View>
          ) : results.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="search-off" size={64} color={currentColors.secondaryText} />
              <Text style={[styles.emptyTitle, { color: currentColors.text }]}>No results found</Text>
              <Text style={[styles.emptySubtitle, { color: currentColors.secondaryText }]}>Try different keywords</Text>
            </View>
          ) : activeTab === 'posts' ? (
            <FlatList
              data={results}
              renderItem={({ item }) => <PostListItem post={item} />}
              keyExtractor={(item: any) => item.id?.toString()}
            />
          ) : activeTab === 'communities' ? (
            <FlatList
              data={results}
              renderItem={({ item }) => (
                <TouchableOpacity style={[styles.resultItem, { borderBottomColor: currentColors.border }]}>
                  <View style={[styles.resultAvatar, { backgroundColor: '#FF4500' }]}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>r</Text>
                  </View>
                  <View>
                    <Text style={[styles.resultTitle, { color: currentColors.text }]}>r/{item}</Text>
                    <Text style={[styles.resultSub, { color: currentColors.secondaryText }]}>Community</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item: any, i) => `community-${i}`}
            />
          ) : activeTab === 'people' ? (
            <FlatList
              data={results}
              renderItem={({ item }) => (
                <TouchableOpacity style={[styles.resultItem, { borderBottomColor: currentColors.border }]}>
                  <View style={[styles.resultAvatar, { backgroundColor: '#0079D3' }]}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>u</Text>
                  </View>
                  <View>
                    <Text style={[styles.resultTitle, { color: currentColors.text }]}>u/{item}</Text>
                    <Text style={[styles.resultSub, { color: currentColors.secondaryText }]}>User</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item: any, i) => `user-${i}`}
            />
          ) : (
            <FlatList
              data={results}
              renderItem={({ item }) => <PostListItem post={item} />}
              keyExtractor={(item: any) => item.id?.toString()}
            />
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backButton: { padding: 4 },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    gap: 12,
  },
  input: { flex: 1, fontSize: 16 },
  tabsWrapper: {
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabText: { fontSize: 15, fontWeight: '600' },
  content: { flex: 1 },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 0.5,
    gap: 12,
  },
  resultAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultTitle: { fontSize: 16, fontWeight: '600' },
  resultSub: { fontSize: 13, marginTop: 2 },
});
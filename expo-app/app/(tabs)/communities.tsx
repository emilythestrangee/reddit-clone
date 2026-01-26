import { useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Mock community data
const COMMUNITIES = [
  { id: '1', name: 'AskReddit', members: '45.2M', icon: '💭', description: 'Ask and answer thought-provoking questions' },
  { id: '2', name: 'funny', members: '52.1M', icon: '😂', description: 'Reddit\'s largest humor depository' },
  { id: '3', name: 'gaming', members: '38.5M', icon: '🎮', description: 'A subreddit for gaming news and discussion' },
  { id: '4', name: 'aww', members: '35.8M', icon: '🐾', description: 'Things that make you go AWW!' },
  { id: '5', name: 'pics', members: '30.2M', icon: '📷', description: 'A place for photographs and pictures' },
  { id: '6', name: 'worldnews', members: '31.5M', icon: '🌍', description: 'A place for major news from around the world' },
  { id: '7', name: 'todayilearned', members: '32.1M', icon: '📚', description: 'You learn something new every day' },
  { id: '8', name: 'movies', members: '28.9M', icon: '🎬', description: 'News & Discussion about Major Motion Pictures' },
  { id: '9', name: 'Music', members: '32.8M', icon: '🎵', description: 'The musical community of reddit' },
  { id: '10', name: 'science', members: '29.4M', icon: '🔬', description: 'This community is for scientific discussion' },
];

export default function GroupSelector() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);

  const filteredCommunities = COMMUNITIES.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCommunity = (communityName: string) => {
    setSelectedCommunity(communityName);
    // You can pass the selected community back to the create screen
    // For now, just go back
    setTimeout(() => {
      router.back();
    }, 200);
  };

  const renderCommunityItem = ({ item }: { item: typeof COMMUNITIES[0] }) => (
    <Pressable
      style={[
        styles.communityItem,
        selectedCommunity === item.name && styles.selectedCommunity
      ]}
      onPress={() => handleSelectCommunity(item.name)}
    >
      <View style={styles.communityIcon}>
        <Text style={styles.iconText}>{item.icon}</Text>
      </View>
      <View style={styles.communityInfo}>
        <Text style={styles.communityName}>r/{item.name}</Text>
        <Text style={styles.communityDescription} numberOfLines={1}>
          {item.description}
        </Text>
        <Text style={styles.memberCount}>{item.members} members</Text>
      </View>
      {selectedCommunity === item.name && (
        <AntDesign name="check" size={24} color="#FF4500" />
      )}
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <AntDesign name="close" size={24} color="white" />
        </Pressable>
        <Text style={styles.headerTitle}>Choose a community</Text>
        <View style={styles.headerRight}>
          <MaterialIcons name="search" size={24} color="white" style={{ marginRight: 12 }} />
          <MaterialIcons name="filter-list" size={24} color="white" style={{ marginRight: 12 }} />
          <MaterialIcons name="more-vert" size={24} color="white" />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="#7C7C7C" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search communities"
          placeholderTextColor="#7C7C7C"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <AntDesign name="close" size={18} color="#7C7C7C" />
          </Pressable>
        )}
      </View>

      {/* Communities List */}
      <FlatList
        data={filteredCommunities}
        renderItem={renderCommunityItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No communities found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FF4500',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    flex: 1,
    marginLeft: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F7F8',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 25,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  communityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedCommunity: {
    backgroundColor: '#FFF4F0',
  },
  communityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0079D3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  communityInfo: {
    flex: 1,
  },
  communityName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  communityDescription: {
    fontSize: 13,
    color: '#7C7C7C',
    marginBottom: 2,
  },
  memberCount: {
    fontSize: 12,
    color: '#7C7C7C',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#7C7C7C',
  },
});
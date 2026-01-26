import { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

// Mock chat data
const CHATS = [
  {
    id: '1',
    username: 'u/TechEnthusiast',
    avatar: '👨‍💻',
    lastMessage: 'Thanks for the help with that React Native issue!',
    timestamp: '2m',
    unread: true,
    unreadCount: 2,
  },
  {
    id: '2',
    username: 'u/GamingPro2024',
    avatar: '🎮',
    lastMessage: 'Did you see the new game announcement?',
    timestamp: '15m',
    unread: false,
  },
  {
    id: '3',
    username: 'u/PhotoLover',
    avatar: '📸',
    lastMessage: 'Those landscape photos are amazing!',
    timestamp: '1h',
    unread: true,
    unreadCount: 1,
  },
  {
    id: '4',
    username: 'u/CodingNinja',
    avatar: '⚡',
    lastMessage: 'Check out this algorithm I came up with',
    timestamp: '3h',
    unread: false,
  },
  {
    id: '5',
    username: 'u/FitnessFreak',
    avatar: '💪',
    lastMessage: 'Want to join me for a workout tomorrow?',
    timestamp: '5h',
    unread: false,
  },
  {
    id: '6',
    username: 'u/MovieBuff',
    avatar: '🎬',
    lastMessage: 'Have you watched the new sci-fi movie?',
    timestamp: '1d',
    unread: false,
  },
  {
    id: '7',
    username: 'u/MusicMania',
    avatar: '🎵',
    lastMessage: 'This album is fire! 🔥',
    timestamp: '2d',
    unread: false,
  },
  {
    id: '8',
    username: 'u/BookReader',
    avatar: '📚',
    lastMessage: 'Just finished reading that book you recommended',
    timestamp: '3d',
    unread: false,
  },
];

export default function ChatScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredChats = CHATS.filter(chat =>
    chat.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderChatItem = ({ item }: { item: typeof CHATS[0] }) => (
    <Pressable style={styles.chatItem}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{item.avatar}</Text>
        {item.unread && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <View style={styles.messageRow}>
          <Text 
            style={[styles.lastMessage, item.unread && styles.unreadMessage]} 
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unread && item.unreadCount && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {showSearch ? (
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={24} color="#7C7C7C" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search chats"
              placeholderTextColor="#7C7C7C"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <Pressable onPress={() => {
              setShowSearch(false);
              setSearchQuery('');
            }}>
              <MaterialIcons name="close" size={24} color="#7C7C7C" />
            </Pressable>
          </View>
        ) : (
          <>
            <Text style={styles.headerTitle}>Chats</Text>
            <View style={styles.headerRight}>
              <Pressable onPress={() => setShowSearch(true)} style={styles.iconButton}>
                <MaterialIcons name="search" size={24} color="black" />
              </Pressable>
              <Pressable style={styles.iconButton}>
                <Ionicons name="create-outline" size={24} color="black" />
              </Pressable>
              <Pressable style={styles.iconButton}>
                <MaterialIcons name="more-vert" size={24} color="black" />
              </Pressable>
            </View>
          </>
        )}
      </View>

      {/* Chats List */}
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color="#D0D0D0" />
            <Text style={styles.emptyTitle}>No chats yet</Text>
            <Text style={styles.emptySubtitle}>Start a conversation with someone!</Text>
          </View>
        }
      />

      {/* Floating Action Button */}
      <Pressable style={styles.fab}>
        <Ionicons name="create" size={24} color="white" />
      </Pressable>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconButton: {
    padding: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F7F8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 25,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  listContainer: {
    flexGrow: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 40,
    width: 50,
    height: 50,
    textAlign: 'center',
    lineHeight: 50,
    backgroundColor: '#F0F0F0',
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#46D160',
    borderWidth: 2,
    borderColor: 'white',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 15,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 13,
    color: '#7C7C7C',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 14,
    color: '#7C7C7C',
    flex: 1,
  },
  unreadMessage: {
    color: 'black',
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#FF4500',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginLeft: 8,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    color: '#1C1C1C',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#7C7C7C',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF4500',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
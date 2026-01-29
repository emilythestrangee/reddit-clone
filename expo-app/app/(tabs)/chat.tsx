import { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

// Mock chat data
const CHATS = [
  {
    id: '1',
    username: 'TechEnthusiast',
    displayName: 'John Doe',
    avatar: '👨‍💻',
    lastMessage: 'Thanks for the help with that React Native issue!',
    timestamp: '2m',
    unread: true,
    unreadCount: 3,
    isDirect: true,
  },
  {
    id: '2',
    username: 'GamingPro2024',
    displayName: 'GamerPro',
    avatar: '🎮',
    lastMessage: 'Check out this new game trailer!',
    timestamp: '15m',
    unread: false,
    isDirect: true,
  },
];


export default function ChatScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const colors = {
    dark: {
      bg: '#030303',
      text: '#d7dadc',
      secondaryText: '#818384',
      border: '#343536',
      inputBg: '#1a1a1b',
      cardBg: '#1a1a1b',
    },
    light: {
      bg: '#ffffff',
      text: '#030303',
      secondaryText: '#7c7c7c',
      border: '#e5e5e5',
      inputBg: '#f6f7f8',
      cardBg: '#ffffff',
    },
  };

  const currentColors = colors[theme];

  const filteredChats = CHATS.filter(
    chat =>
      chat.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderChatItem = ({ item }: any) => (
    <Pressable
      style={[
        styles.chatItem,
        {
          backgroundColor: item.unread
            ? theme === 'dark'
              ? '#1a2c3a'
              : '#FFF4F0'
            : currentColors.cardBg,
          borderBottomColor: currentColors.border,
        },
      ]}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.avatar}</Text>
        {item.unread && <View style={styles.unreadDot} />}
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={[styles.displayName, { color: currentColors.text }]}>
            {item.displayName}
          </Text>
          <Text style={[styles.timestamp, { color: currentColors.secondaryText }]}>
            {item.timestamp}
          </Text>
        </View>

        <View style={styles.messageRow}>
          <Text
            numberOfLines={1}
            style={[
              styles.lastMessage,
              {
                color: item.unread
                  ? currentColors.text
                  : currentColors.secondaryText,
                fontWeight: item.unread ? '600' : '400',
              },
            ]}
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
    <SafeAreaView
      style={[styles.container, { backgroundColor: currentColors.bg }]}
      edges={['left', 'right']} // 🔥 NO TOP, NO BOTTOM SAFE AREA
    >
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: currentColors.inputBg }]}>
        <MaterialIcons name="search" size={22} color={currentColors.secondaryText} />
        <TextInput
          style={[styles.searchInput, { color: currentColors.text }]}
          placeholder="Search messages"
          placeholderTextColor={currentColors.secondaryText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <MaterialIcons name="close" size={20} color={currentColors.secondaryText} />
          </Pressable>
        )}
      </View>

      {/* Chat List */}
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }} // 🔥 NO BLACK BAR
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="chatbubbles-outline"
              size={64}
              color={currentColors.secondaryText}
            />
            <Text style={[styles.emptyTitle, { color: currentColors.text }]}>
              No messages
            </Text>
          </View>
        }
      />

      {/* FAB */}
      <Pressable style={styles.fab}>
        <Ionicons name="create-outline" size={24} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },

  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 22,
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#46D160',
  },

  chatContent: { flex: 1 },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
  },

  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    marginRight: 8,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF4500',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
  },

  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF4500',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});

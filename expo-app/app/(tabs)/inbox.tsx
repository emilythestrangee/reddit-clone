import { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

type NotificationType = 'upvote' | 'comment' | 'reply' | 'award' | 'mention' | 'follow';

interface Notification {
  id: string;
  type: NotificationType;
  username: string;
  avatar: string;
  content: string;
  post?: string;
  timestamp: string;
  isRead: boolean;
}

// Mock notification data
const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'upvote',
    username: 'u/TechGuru',
    avatar: '👨‍💻',
    content: 'and 23 others upvoted your post',
    post: 'Why React Native is the best?',
    timestamp: '5m',
    isRead: false,
  },
  {
    id: '2',
    type: 'comment',
    username: 'u/CodeMaster',
    avatar: '⚡',
    content: 'commented on your post',
    post: 'Best practices for React hooks?',
    timestamp: '1h',
    isRead: false,
  },
  {
    id: '3',
    type: 'reply',
    username: 'u/DevExpert',
    avatar: '🔥',
    content: 'replied to your comment in r/ReactNative',
    post: 'I totally agree with your point about...',
    timestamp: '2h',
    isRead: false,
  },
  {
    id: '4',
    type: 'award',
    username: 'u/GenerousUser',
    avatar: '🎁',
    content: 'gave you the Helpful Award',
    post: 'Tutorial: Building a Reddit clone',
    timestamp: '3h',
    isRead: true,
  },
  {
    id: '5',
    type: 'mention',
    username: 'u/FriendlyDev',
    avatar: '👋',
    content: 'mentioned you in r/programming',
    post: 'Check out what @username built!',
    timestamp: '5h',
    isRead: true,
  },
  {
    id: '6',
    type: 'follow',
    username: 'u/NewFollower',
    avatar: '🌟',
    content: 'started following you',
    timestamp: '1d',
    isRead: true,
  },
  {
    id: '7',
    type: 'upvote',
    username: 'u/UpvoterPro',
    avatar: '👍',
    content: 'and 145 others upvoted your comment',
    post: 'This is exactly what I was looking for!',
    timestamp: '2d',
    isRead: true,
  },
  {
    id: '8',
    type: 'reply',
    username: 'u/HelpfulRedditor',
    avatar: '💡',
    content: 'replied to your comment in r/AskReddit',
    post: "Here's another perspective on that...",
    timestamp: '3d',
    isRead: true,
  },
];

const TABS = ['All', 'Mentions', 'Comments', 'Upvotes', 'Replies'];

export default function InboxScreen() {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState('All');
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const colors = {
    dark: { bg: '#030303', text: '#d7dadc', secondaryText: '#818384', border: '#343536', tabBg: '#1a1a1b', unreadBg: '#1a1a1b' },
    light: { bg: '#ffffff', text: '#030303', secondaryText: '#7c7c7c', border: '#e5e5e5', tabBg: '#f6f7f8', unreadBg: '#f8fafe' },
  };
  const currentColors = colors[theme];

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'upvote':
        return { name: 'arrow-upward', color: '#FF4500' };
      case 'comment':
        return { name: 'comment', color: '#0079D3' };
      case 'reply':
        return { name: 'reply', color: '#0079D3' };
      case 'award':
        return { name: 'emoji-events', color: '#FFD700' };
      case 'mention':
        return { name: 'alternate-email', color: '#FF4500' };
      case 'follow':
        return { name: 'person-add', color: '#46D160' };
      default:
        return { name: 'notifications', color: '#7C7C7C' };
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, isRead: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const icon = getNotificationIcon(item.type);
    
    return (
      <Pressable
        style={[styles.notificationItem, !item.isRead && styles.unreadNotification, { borderBottomColor: currentColors.border, backgroundColor: !item.isRead ? currentColors.unreadBg : currentColors.bg }]}
        onPress={() => markAsRead(item.id)}
      >
        <View style={styles.notificationLeft}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{item.avatar}</Text>
            <View style={[styles.iconBadge, { backgroundColor: icon.color }]}>
              <MaterialIcons name={icon.name as any} size={12} color="white" />
            </View>
          </View>
        </View>

        <View style={styles.notificationContent}>
          <Text style={[styles.notificationText, { color: currentColors.text }]}>
            <Text style={[styles.username, { color: currentColors.text }]}>{item.username}</Text>
            {' '}
            {item.content}
          </Text>
          {item.post && (
            <Text style={[styles.postSnippet, { color: currentColors.secondaryText }]} numberOfLines={2}>
              {item.post}
            </Text>
          )}
          <Text style={[styles.timestamp, { color: currentColors.secondaryText }]}>{item.timestamp} ago</Text>
        </View>

        {!item.isRead && <View style={styles.unreadDot} />}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentColors.bg }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: currentColors.border }]}>
        <Text style={[styles.headerTitle, { color: currentColors.text }]}>Inbox</Text>
        <View style={styles.headerRight}>
          <Pressable style={styles.iconButton}>
            <MaterialIcons name="search" size={24} color={currentColors.text} />
          </Pressable>
          {unreadCount > 0 && (
            <Pressable style={styles.iconButton} onPress={markAllAsRead}>
              <MaterialIcons name="done-all" size={24} color={currentColors.text} />
            </Pressable>
          )}
          <Pressable style={styles.iconButton}>
            <MaterialIcons name="more-vert" size={24} color={currentColors.text} />
          </Pressable>
        </View>
      </View>

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <View style={[styles.unreadBanner, { backgroundColor: theme === 'dark' ? '#1a1a1b' : '#FFF4F0' }]}>
          <MaterialIcons name="notifications-active" size={20} color="#FF4500" />
          <Text style={[styles.unreadBannerText, { color: theme === 'dark' ? '#818384' : '#FF4500' }]}>
            You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.tabsContainer, { borderBottomColor: currentColors.border }]}
        contentContainerStyle={styles.tabsContent}
      >
        {TABS.map(tab => (
          <Pressable
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.activeTab, { backgroundColor: selectedTab === tab ? '#0079D3' : currentColors.tabBg }]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText, { color: selectedTab === tab ? 'white' : currentColors.secondaryText }]}>
              {tab}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={64} color={currentColors.secondaryText} />
            <Text style={[styles.emptyTitle, { color: currentColors.text }]}>No notifications</Text>
            <Text style={[styles.emptySubtitle, { color: currentColors.secondaryText }]}>
              You're all caught up! Check back later.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
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
  unreadBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  unreadBannerText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabsContainer: {
    borderBottomWidth: 1,
  },
  tabsContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#0079D3',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
  },
  listContainer: {
    flexGrow: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  unreadNotification: {
  },
  notificationLeft: {
    marginRight: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarText: {
    fontSize: 36,
    width: 48,
    height: 48,
    textAlign: 'center',
    lineHeight: 48,
    backgroundColor: '#F0F0F0',
    borderRadius: 24,
  },
  iconBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 14,
    lineHeight: 20,
  },
  username: {
    fontWeight: '600',
  },
  postSnippet: {
    fontSize: 13,
    marginTop: 4,
    fontStyle: 'italic',
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0079D3',
    marginLeft: 8,
    marginTop: 8,
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
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
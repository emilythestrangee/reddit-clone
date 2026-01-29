import { useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ScrollView, TextInput } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

type NotificationType = 'upvote' | 'comment' | 'reply' | 'award' | 'mention' | 'follow' | 'post';

interface Notification {
  id: string;
  type: NotificationType;
  username: string;
  subreddit?: string;
  avatar: string;
  content: string;
  post?: string;
  timestamp: string;
  isRead: boolean;
  isMessage?: boolean;
}

// Mock notification data
const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'upvote',
    username: 'u/TechGuru',
    subreddit: 'r/ReactNative',
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
    subreddit: 'r/programming',
    avatar: '⚡',
    content: 'commented on your post',
    post: 'Best practices for React hooks? Great read!',
    timestamp: '1h',
    isRead: false,
  },
  {
    id: '3',
    type: 'reply',
    username: 'u/DevExpert',
    subreddit: 'r/ReactNative',
    avatar: '🔥',
    content: 'replied to your comment',
    post: 'I totally agree with your point about performance optimization...',
    timestamp: '2h',
    isRead: false,
  },
  {
    id: '4',
    type: 'award',
    username: 'u/GenerousUser',
    subreddit: 'r/webdev',
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
    subreddit: 'r/programming',
    avatar: '👋',
    content: 'mentioned you in a comment',
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
    subreddit: 'r/javascript',
    avatar: '👍',
    content: 'and 145 others upvoted your comment',
    post: 'This is exactly what I was looking for! Thanks!',
    timestamp: '2d',
    isRead: true,
  },
  {
    id: '8',
    type: 'reply',
    username: 'u/HelpfulRedditor',
    subreddit: 'r/AskReddit',
    avatar: '💡',
    content: 'replied to your comment',
    post: "Here's another perspective on that topic...",
    timestamp: '3d',
    isRead: true,
  },
  {
    id: '9',
    type: 'post',
    username: 'u/AutoModerator',
    subreddit: 'r/ReactNative',
    avatar: '🤖',
    content: 'Your post was approved',
    post: 'Weekly questions thread',
    timestamp: '4d',
    isRead: true,
  },
  {
    id: '10',
    type: 'post',
    username: 'u/Reddit',
    subreddit: 'r/announcements',
    avatar: '📢',
    content: 'New features coming to Reddit',
    post: 'Introducing the new notification center',
    timestamp: '1w',
    isRead: true,
  },
];

const TABS = [
  { id: 'all', label: 'All', icon: 'notifications' },
  { id: 'mentions', label: 'Mentions', icon: 'alternate-email' },
  { id: 'comments', label: 'Comments', icon: 'comment' },
  { id: 'upvotes', label: 'Upvotes', icon: 'arrow-upward' },
  { id: 'replies', label: 'Replies', icon: 'reply' },
  { id: 'messages', label: 'Messages', icon: 'chat-bubble' },
];

export default function InboxScreen() {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState('all');
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const colors = {
    dark: { 
      bg: '#030303', 
      text: '#d7dadc', 
      secondaryText: '#818384', 
      border: '#343536', 
      headerBg: '#1a1a1b',
      inputBg: '#1a1a1b',
      tabBg: '#272729',
      unreadBg: '#1a1a1b',
      sectionBg: '#272729',
    },
    light: { 
      bg: '#ffffff', 
      text: '#030303', 
      secondaryText: '#7c7c7c', 
      border: '#e5e5e5', 
      headerBg: '#ffffff',
      inputBg: '#f6f7f8',
      tabBg: '#f6f7f8',
      unreadBg: '#f8fafe',
      sectionBg: '#f6f7f8',
    },
  };
  const currentColors = colors[theme];

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'upvote':
        return { name: 'arrow-upward', color: '#FF4500', bgColor: 'rgba(255, 69, 0, 0.1)' };
      case 'comment':
        return { name: 'comment', color: '#0079D3', bgColor: 'rgba(0, 121, 211, 0.1)' };
      case 'reply':
        return { name: 'reply', color: '#0079D3', bgColor: 'rgba(0, 121, 211, 0.1)' };
      case 'award':
        return { name: 'emoji-events', color: '#FFD700', bgColor: 'rgba(255, 215, 0, 0.1)' };
      case 'mention':
        return { name: 'alternate-email', color: '#FF4500', bgColor: 'rgba(255, 69, 0, 0.1)' };
      case 'follow':
        return { name: 'person-add', color: '#46D160', bgColor: 'rgba(70, 209, 96, 0.1)' };
      case 'post':
        return { name: 'post-add', color: '#24A0ED', bgColor: 'rgba(36, 160, 237, 0.1)' };
      default:
        return { name: 'notifications', color: '#7C7C7C', bgColor: 'rgba(124, 124, 124, 0.1)' };
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

  const filteredNotifications = notifications.filter(notification => {
    if (searchQuery) {
      return notification.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
             notification.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
             (notification.post && notification.post.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    if (selectedTab === 'all') return true;
    if (selectedTab === 'upvotes') return notification.type === 'upvote';
    if (selectedTab === 'comments') return notification.type === 'comment';
    if (selectedTab === 'replies') return notification.type === 'reply';
    if (selectedTab === 'mentions') return notification.type === 'mention';
    if (selectedTab === 'messages') return notification.isMessage;
    return true;
  });

  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const icon = getNotificationIcon(item.type);
    
    return (
      <Pressable
        style={[
          styles.notificationItem,
          { 
            borderBottomColor: currentColors.border,
            backgroundColor: item.isRead ? currentColors.bg : currentColors.unreadBg,
          },
          !item.isRead && styles.unreadNotification,
        ]}
        onPress={() => markAsRead(item.id)}
      >
        <View style={styles.notificationLeft}>
          <View style={[styles.iconContainer, { backgroundColor: icon.bgColor }]}>
            <MaterialIcons name={icon.name as any} size={20} color={icon.color} />
          </View>
        </View>

        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={[styles.username, { color: currentColors.text }]}>
              {item.username}
            </Text>
            {item.subreddit && (
              <>
                <Text style={[styles.dot, { color: currentColors.secondaryText }]}>•</Text>
                <Text style={[styles.subreddit, { color: currentColors.secondaryText }]}>
                  {item.subreddit}
                </Text>
              </>
            )}
          </View>
          
          <Text style={[styles.contentText, { color: currentColors.text }]}>
            {item.content}
          </Text>
          
          {item.post && (
            <Text 
              style={[styles.postPreview, { color: currentColors.secondaryText }]} 
              numberOfLines={2}
            >
              {item.post}
            </Text>
          )}
          
          <View style={styles.notificationFooter}>
            <Text style={[styles.timestamp, { color: currentColors.secondaryText }]}>
              {item.timestamp}
            </Text>
            
            {!item.isRead && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>new</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  const TabButton = ({ tab }: { tab: typeof TABS[0] }) => (
    <Pressable
      style={[
        styles.tabButton,
        selectedTab === tab.id && styles.activeTabButton,
        { 
          backgroundColor: selectedTab === tab.id ? 
            (theme === 'dark' ? '#343536' : '#e5e5e5') : 
            'transparent' 
        }
      ]}
      onPress={() => setSelectedTab(tab.id)}
    >
      <MaterialIcons 
        name={tab.icon as any} 
        size={20} 
        color={selectedTab === tab.id ? '#FF4500' : currentColors.secondaryText} 
      />
      <Text style={[
        styles.tabLabel,
        { color: selectedTab === tab.id ? currentColors.text : currentColors.secondaryText }
      ]}>
        {tab.label}
      </Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: currentColors.bg }]}>
      {/* Tabs */}
      <View style={[styles.tabsContainer, { backgroundColor: currentColors.tabBg }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {TABS.map(tab => (
            <TabButton key={tab.id} tab={tab} />
          ))}
        </ScrollView>
      </View>

      {/* Inbox Stats */}
      <View style={[styles.statsContainer, { backgroundColor: currentColors.sectionBg }]}>
        <Text style={[styles.statsText, { color: currentColors.secondaryText }]}>
          • {unreadCount} unread • {notifications.length} total
        </Text>
        <Pressable onPress={markAllAsRead}>
          <Text style={[styles.markReadText, { color: '#FF4500' }]}>Mark all as read</Text>
        </Pressable>
      </View>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="notifications-none" size={64} color={currentColors.secondaryText} />
            <Text style={[styles.emptyTitle, { color: currentColors.text }]}>
              No notifications
            </Text>
            <Text style={[styles.emptySubtitle, { color: currentColors.secondaryText }]}>
              {searchQuery ? 'No results found' : 'You\'re all caught up!'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabsContainer: {
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#343536',
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  activeTabButton: {
    backgroundColor: 'rgba(255, 69, 0, 0.1)',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#343536',
  },
  statsText: {
    fontSize: 13,
    fontWeight: '500',
  },
  markReadText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  unreadNotification: {
    // Background is already set via backgroundColor prop
  },
  notificationLeft: {
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  username: {
    fontSize: 15,
    fontWeight: '600',
  },
  dot: {
    fontSize: 12,
    marginHorizontal: 4,
  },
  subreddit: {
    fontSize: 13,
    fontWeight: '500',
  },
  contentText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 6,
  },
  postPreview: {
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 8,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#343536',
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timestamp: {
    fontSize: 13,
    fontWeight: '500',
  },
  unreadBadge: {
    backgroundColor: '#FF4500',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
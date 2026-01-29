import { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Pressable, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign, MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';

// Mock data - in a real app, this would come from your backend/user data
const YOUR_COMMUNITIES = [
  { id: '1', name: 'AskReddit', members: '45.2M', icon: '💭', isFavorite: true },
  { id: '2', name: 'funny', members: '52.1M', icon: '😂', isFavorite: true },
  { id: '3', name: 'gaming', members: '38.5M', icon: '🎮', isFavorite: false },
  { id: '4', name: 'aww', members: '35.8M', icon: '🐾', isFavorite: true },
  { id: '5', name: 'pics', members: '30.2M', icon: '📷', isFavorite: false },
];

const RECENTLY_VISITED = [
  { id: 'r1', name: 'todayilearned', members: '32.1M', icon: '📚', visitedTime: '2h ago' },
  { id: 'r2', name: 'worldnews', members: '31.5M', icon: '🌍', visitedTime: '5h ago' },
  { id: 'r3', name: 'Music', members: '32.8M', icon: '🎵', visitedTime: '1d ago' },
  { id: 'r4', name: 'science', members: '29.4M', icon: '🔬', visitedTime: '2d ago' },
];

const ALL_COMMUNITIES = [
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
  { id: '11', name: 'Showerthoughts', members: '28.5M', icon: '🚿', description: 'A subreddit for sharing shower thoughts' },
  { id: '12', name: 'food', members: '27.8M', icon: '🍔', description: 'The hub for Food on Reddit' },
];

export default function GroupSelector() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'recent' | 'your' | 'all'>('recent');

  const colors = {
    dark: { 
      bg: '#030303', 
      text: '#d7dadc', 
      secondaryText: '#818384', 
      border: '#343536', 
      inputBg: '#1a1a1b',
      cardBg: '#1a1a1b',
      sectionHeaderBg: '#272729',
      headerBg: '#1A1A1B',
    },
    light: { 
      bg: '#ffffff', 
      text: '#030303', 
      secondaryText: '#7c7c7c', 
      border: '#e5e5e5', 
      inputBg: '#f6f7f8',
      cardBg: '#ffffff',
      sectionHeaderBg: '#f6f7f8',
      headerBg: '#ffffff',
    },
  };
  const currentColors = colors[theme];

  const filteredCommunities = ALL_COMMUNITIES.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    community.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCommunity = (communityName: string) => {
    setSelectedCommunity(communityName);
    setTimeout(() => {
      router.back();
    }, 200);
  };

  const renderSectionHeader = (title: string, count: number) => (
    <View style={[styles.sectionHeader, { backgroundColor: currentColors.sectionHeaderBg }]}>
      <Text style={[styles.sectionTitle, { color: currentColors.text }]}>{title}</Text>
      <Text style={[styles.sectionCount, { color: currentColors.secondaryText }]}>{count} •</Text>
    </View>
  );

  const renderCommunityItem = ({ item }: { item: any }) => (
    <Pressable
      style={[
        styles.communityItem,
        { backgroundColor: currentColors.cardBg },
        selectedCommunity === item.name && styles.selectedCommunity,
      ]}
      onPress={() => handleSelectCommunity(item.name)}
    >
      <View style={styles.communityIconContainer}>
        <View style={styles.communityIcon}>
          <Text style={styles.iconText}>{item.icon}</Text>
        </View>
      </View>
      <View style={styles.communityInfo}>
        <View style={styles.communityNameRow}>
          <Text style={[styles.communityName, { color: currentColors.text }]}>r/{item.name}</Text>
          {item.isFavorite && (
            <AntDesign name="star" size={14} color="#FFB000" style={styles.favoriteIcon} />
          )}
        </View>
        <View style={styles.communityMeta}>
          <Text style={[styles.memberCount, { color: currentColors.secondaryText }]}>
            {item.members} members
          </Text>
          {item.visitedTime && (
            <>
              <Text style={[styles.dot, { color: currentColors.secondaryText }]}>•</Text>
              <Text style={[styles.visitedTime, { color: currentColors.secondaryText }]}>
                {item.visitedTime}
              </Text>
            </>
          )}
        </View>
        {item.description && searchQuery.length === 0 && (
          <Text style={[styles.communityDescription, { color: currentColors.secondaryText }]} numberOfLines={1}>
            {item.description}
          </Text>
        )}
      </View>
      <View style={styles.chevronContainer}>
        <MaterialIcons name="keyboard-arrow-right" size={24} color={currentColors.secondaryText} />
      </View>
    </Pressable>
  );

  const renderSectionButton = (title: string, section: 'recent' | 'your' | 'all', icon: any) => (
    <Pressable
      style={[
        styles.sectionButton,
        activeSection === section && styles.activeSectionButton,
        { borderColor: currentColors.border }
      ]}
      onPress={() => setActiveSection(section)}
    >
      <View style={styles.sectionButtonContent}>
        {icon}
        <Text style={[
          styles.sectionButtonText,
          { color: activeSection === section ? '#FF4500' : currentColors.secondaryText }
        ]}>
          {title}
        </Text>
      </View>
    </Pressable>
  );

  const getDataForSection = () => {
    if (searchQuery.length > 0) {
      return filteredCommunities;
    }
    
    switch (activeSection) {
      case 'recent':
        return RECENTLY_VISITED;
      case 'your':
        return YOUR_COMMUNITIES;
      case 'all':
        return ALL_COMMUNITIES;
      default:
        return RECENTLY_VISITED;
    }
  };

  return (
   <SafeAreaView
  style={[styles.container, { backgroundColor: currentColors.bg }]}
  edges={["left", "right", "bottom"]} 
>
      {/* Header - Updated with theme colors */}
      <View style={[styles.header, { backgroundColor: currentColors.headerBg, borderBottomColor: currentColors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <AntDesign name="close" size={24} color={currentColors.text} />
        </Pressable>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={24} color={currentColors.secondaryText} />
          <TextInput
            style={[styles.searchInput, { color: currentColors.text }]}
            placeholder="Search communities"
            placeholderTextColor={currentColors.secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <AntDesign name="close-circle" size={18} color={currentColors.secondaryText} />
            </Pressable>
          )}
        </View>
        <View style={styles.headerRight}>
          <Pressable onPress={() => {}} style={styles.headerIcon}>
            <FontAwesome5 name="user-plus" size={20} color={currentColors.text} />
          </Pressable>
          <Pressable onPress={() => {}} style={styles.headerIcon}>
            <MaterialIcons name="sort" size={24} color={currentColors.text} />
          </Pressable>
        </View>
      </View>

      {/* Section Buttons - Only show when not searching */}
      {searchQuery.length === 0 && (
        <View style={styles.sectionButtonsContainer}>
          {renderSectionButton('Recent', 'recent', 
            <Ionicons name="time-outline" size={20} color={activeSection === 'recent' ? '#FF4500' : currentColors.secondaryText} />
          )}
          {renderSectionButton('Your', 'your', 
            <MaterialIcons name="people-alt" size={20} color={activeSection === 'your' ? '#FF4500' : currentColors.secondaryText} />
          )}
          {renderSectionButton('All', 'all', 
            <MaterialIcons name="explore" size={20} color={activeSection === 'all' ? '#FF4500' : currentColors.secondaryText} />
          )}
        </View>
      )}

      {/* Section Header */}
      {searchQuery.length === 0 && (
        renderSectionHeader(
          activeSection === 'recent' ? 'RECENTLY VISITED' :
          activeSection === 'your' ? 'YOUR COMMUNITIES' :
          'ALL COMMUNITIES',
          getDataForSection().length
        )
      )}

      {/* Communities List */}
      <FlatList
        data={getDataForSection()}
        renderItem={renderCommunityItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="search-off" size={48} color={currentColors.secondaryText} />
            <Text style={[styles.emptyTitle, { color: currentColors.text }]}>
              No communities found
            </Text>
            <Text style={[styles.emptyText, { color: currentColors.secondaryText }]}>
              Try searching for something else
            </Text>
          </View>
        }
        ListHeaderComponent={
          searchQuery.length > 0 && filteredCommunities.length > 0 ? (
            <View style={[styles.searchResultsHeader, { backgroundColor: currentColors.sectionHeaderBg }]}>
              <Text style={[styles.searchResultsText, { color: currentColors.secondaryText }]}>
                Search results for "{searchQuery}"
              </Text>
            </View>
          ) : null
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  closeButton: {
    padding: 4,
    marginRight: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f6f7f8', // Light mode default, dark mode will override
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerIcon: {
    padding: 4,
    marginLeft: 8,
  },
  sectionButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 12,
  },
  sectionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  activeSectionButton: {
    borderColor: '#FF4500',
    backgroundColor: 'rgba(255, 69, 0, 0.1)',
  },
  sectionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sectionCount: {
    fontSize: 12,
  },
  searchResultsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#343536',
  },
  searchResultsText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  communityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#343536',
  },
  selectedCommunity: {
    backgroundColor: 'rgba(255, 69, 0, 0.1)',
  },
  communityIconContainer: {
    marginRight: 12,
  },
  communityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0079D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  communityInfo: {
    flex: 1,
  },
  communityNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  communityName: {
    fontSize: 16,
    fontWeight: '600',
  },
  favoriteIcon: {
    marginLeft: 6,
  },
  communityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  memberCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  dot: {
    fontSize: 12,
    marginHorizontal: 4,
  },
  visitedTime: {
    fontSize: 12,
    fontWeight: '500',
  },
  communityDescription: {
    fontSize: 13,
    lineHeight: 16,
  },
  chevronContainer: {
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
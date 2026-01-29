import { View, TextInput, StyleSheet, Text, TouchableOpacity, ScrollView } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useState, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

export default function SearchScreen() {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("posts");
  const navigation = useNavigation();

  // Hide header on mount
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

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
    { id: 'comments', label: 'Comments' },
    { id: 'media', label: 'Media' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: currentColors.bg }]}>
      {/* Header with Search */}
      <View style={[styles.header, { backgroundColor: currentColors.bg, paddingTop: 50 }]}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={currentColors.text} 
          />
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

      {/* Tabs - Scrollable Pills Style */}
      <View style={[styles.tabsWrapper, { backgroundColor: currentColors.bg, borderBottomColor: currentColors.border }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                { backgroundColor: activeTab === tab.id ? currentColors.activeTabBg : 'transparent' }
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[
                styles.tabText,
                { color: activeTab === tab.id ? '#FF4500' : currentColors.secondaryText }
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content Area */}
      <View style={styles.content}>
        {query.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="search" size={64} color={currentColors.secondaryText} />
            <Text style={[styles.emptyTitle, { color: currentColors.text }]}>
              Search Reddit
            </Text>
            <Text style={[styles.emptySubtitle, { color: currentColors.secondaryText }]}>
              Find posts, communities, comments, and media
            </Text>
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={64} color={currentColors.secondaryText} />
            <Text style={[styles.emptyTitle, { color: currentColors.text }]}>
              No results found
            </Text>
            <Text style={[styles.emptySubtitle, { color: currentColors.secondaryText }]}>
              Try different keywords
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export const options = {
  headerShown: false,
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 25,
    gap: 12,
  },
  input: { 
    flex: 1,
    fontSize: 16,
  },
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
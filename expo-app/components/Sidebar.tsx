import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, StatusBar } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { MaterialIcons, Ionicons, FontAwesome5, Feather, Entypo, FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Image } from 'react-native';

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { theme, themeMode, setThemeMode } = useTheme();
  const { logout, user, isAuthenticated } = useAuth();
  const router = useRouter();

  const colors = {
    dark: { 
      bg: '#1a1a1b', 
      text: '#d7dadc', 
      secondaryText: '#818384', 
      border: '#343536', 
      active: '#272729',
      sectionBg: '#272729'
    },
    light: { 
      bg: '#ffffff', 
      text: '#030303', 
      secondaryText: '#7c7c7c', 
      border: '#ccc', 
      active: '#e5e5e5',
      sectionBg: '#f6f7f8'
    },
  };

  const getAvatarImage = (avatarId: string) => {
    const avatarMap: any = {
      '1': require('../assets/avators/avator1.png'),
      '2': require('../assets/avators/avator2.png'),
      '3': require('../assets/avators/avator3.png'),
      '4': require('../assets/avators/avator4.png'),
      '5': require('../assets/avators/avator5.png'),
      '6': require('../assets/avators/avator6.png'),
    };
    return avatarMap[avatarId] || null;
  };

  const currentColors = colors[theme];

  const renderSection = (title: string, items: any[], hasDivider = true) => (
    <View style={[styles.section, hasDivider && { borderBottomColor: currentColors.border }]}>
      <Text style={[styles.sectionTitle, { color: currentColors.secondaryText }]}>{title}</Text>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.sectionItem}
          onPress={() => {
            item.onPress?.();
            if (!item.keepOpen) onClose();
          }}
        >
          {item.icon}
          <Text style={[styles.sectionItemText, { color: currentColors.text }]}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.sidebar,
            {
              backgroundColor: currentColors.bg,
              paddingTop: StatusBar.currentHeight || 0,
            },
          ]}
        >
          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            {/* Close button at the top */}
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialIcons name="close" size={28} color={currentColors.text} />
            </TouchableOpacity>

            {/* Profile Section */}
            <View style={[styles.profileSection, { borderBottomColor: currentColors.border }]}>
              <View style={styles.profileHeader}>
                <View style={styles.avatar}>
                  {isAuthenticated && user?.avatar && getAvatarImage(user.avatar) ? (
                    <Image 
                      source={getAvatarImage(user.avatar)} 
                      style={{ width: 48, height: 48, borderRadius: 24 }}
                    />
                  ) : (
                    <FontAwesome5 name="user-circle" size={48} color="#818384" />
                  )}
                </View>
                <View style={styles.profileInfo}>
                  <Text style={[styles.username, { color: currentColors.text }]}>
                    {isAuthenticated && user ? `u/${user.username}` : 'Guest'}
                  </Text>
                  <Text style={[styles.karma, { color: currentColors.secondaryText }]}>
                    {isAuthenticated ? '1.2k karma' : 'Not logged in'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.profileActions}>
                {isAuthenticated ? (
                  <TouchableOpacity 
                    style={[styles.profileButton, { backgroundColor: currentColors.sectionBg }]}
                    onPress={() => {
                      // TODO: Create profile screen
                      // router.push(`/user/${user?.id}` as any);
                      onClose();
                    }}
                  >
                    <Text style={[styles.profileButtonText, { color: currentColors.text }]}>My Profile</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    style={[styles.profileButton, { backgroundColor: '#FF4500' }]}
                    onPress={() => {
                      router.push('../auth/page');
                      onClose();
                    }}
                  >
                    <Text style={[styles.profileButtonText, { color: '#FFF' }]}>Sign In</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Reddit Premium */}
            <TouchableOpacity style={[styles.premiumSection, { backgroundColor: '#FFD700' }]}>
              <View style={styles.premiumContent}>
                <MaterialIcons name="workspace-premium" size={24} color="#805500" />
                <View style={styles.premiumText}>
                  <Text style={styles.premiumTitle}>Reddit Premium</Text>
                  <Text style={styles.premiumSubtitle}>The best Reddit experience</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Game Section */}
            <View style={[styles.gameSection, { backgroundColor: currentColors.sectionBg }]}>
              <View style={styles.gameHeader}>
                <Ionicons name="game-controller-outline" size={24} color={currentColors.text} />
                <Text style={[styles.gameTitle, { color: currentColors.text }]}>Games</Text>
              </View>
              <TouchableOpacity style={styles.gameItem}>
                <View style={styles.gameIcon}>
                  <FontAwesome5 name="dice" size={16} color="white" />
                </View>
                <Text style={[styles.gameText, { color: currentColors.text }]}>r/place</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.gameItem}>
                <View style={styles.gameIcon}>
                  <FontAwesome5 name="robot" size={16} color="white" />
                </View>
                <Text style={[styles.gameText, { color: currentColors.text }]}>Snake</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.gameItem}>
                <View style={styles.gameIcon}>
                  <Entypo name="cross" size={16} color="white" />
                </View>
                <Text style={[styles.gameText, { color: currentColors.text }]}>Tic Tac Toe</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Links */}
            {renderSection('YOUR STUFF', [
              { icon: <MaterialIcons name="person-outline" size={24} color={currentColors.secondaryText} />, label: 'Create Community' },
              { icon: <MaterialIcons name="bookmark-border" size={24} color={currentColors.secondaryText} />, label: 'Saved' },
              { icon: <MaterialIcons name="history" size={24} color={currentColors.secondaryText} />, label: 'History' },
              { icon: <MaterialIcons name="content-copy" size={24} color={currentColors.secondaryText} />, label: 'Posts & Comments' },
            ])}

            {/* View Options - Simplified */}
            <View style={[styles.viewOptions, { borderBottomColor: currentColors.border }]}>
              <Text style={[styles.sectionTitle, { color: currentColors.secondaryText }]}>VIEW OPTIONS</Text>
              
              {/* Theme Selector Only */}
              <View style={styles.themeSection}>
                <View style={styles.themeHeader}>
                  <MaterialIcons name="palette" size={20} color={currentColors.secondaryText} />
                  <Text style={[styles.themeLabel, { color: currentColors.text }]}>Theme</Text>
                </View>
                <View style={styles.themeButtons}>
                  {(['light', 'dark', 'auto'] as const).map((mode) => (
                    <TouchableOpacity
                      key={mode}
                      onPress={() => setThemeMode(mode)}
                      style={[
                        styles.themeButton,
                        themeMode === mode && styles.activeThemeButton,
                        { backgroundColor: themeMode === mode ? currentColors.active : 'transparent' }
                      ]}
                    >
                      <MaterialIcons
                        name={mode === 'dark' ? 'dark-mode' : mode === 'light' ? 'light-mode' : 'brightness-auto'}
                        size={18}
                        color={themeMode === mode ? '#FF4500' : currentColors.secondaryText}
                      />
                      <Text style={[
                        styles.themeButtonText,
                        { color: themeMode === mode ? currentColors.text : currentColors.secondaryText }
                      ]}>
                        {mode === 'auto' ? 'Auto' : mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* More Stuff */}
            {renderSection('MORE STUFF', [
              { icon: <MaterialIcons name="help-outline" size={24} color={currentColors.secondaryText} />, label: 'Help Center' },
              { icon: <MaterialIcons name="feedback" size={24} color={currentColors.secondaryText} />, label: 'Send Feedback' },
            ])}

            {/* Legal Section */}
            <View style={[styles.legalSection, { borderBottomColor: currentColors.border }]}>
              <Text style={[styles.sectionTitle, { color: currentColors.secondaryText }]}>LEGAL</Text>
              <View style={styles.legalLinks}>
                <TouchableOpacity>
                  <Text style={[styles.legalLink, { color: currentColors.secondaryText }]}>Terms of Service</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={[styles.legalLink, { color: currentColors.secondaryText }]}>Privacy Policy</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={[styles.legalLink, { color: currentColors.secondaryText }]}>Content Policy</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* App Info - UPDATE LOGOUT */}
            <View style={styles.appInfo}>
              <Text style={[styles.version, { color: currentColors.secondaryText }]}>reddit v1.0.0</Text>
              {isAuthenticated && (
                <TouchableOpacity
                  style={styles.logoutButton}
                  onPress={async () => {
                    try {
                      await logout();
                      onClose();
                      router.replace('/'); // Go to splash/home
                    } catch (error) {
                      console.error('Logout error:', error);
                    }
                  }}
                >
                  <MaterialIcons name="logout" size={20} color="#FF4500" />
                  <Text style={[styles.logoutText, { color: '#FF4500' }]}>Log Out</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>

        <TouchableOpacity
          style={styles.overlayTouchable}
          activeOpacity={1}
          onPress={onClose}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  overlayTouchable: {
    flex: 1,
  },
  sidebar: {
    width: '85%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  closeBtn: {
    padding: 16,
    paddingTop: 8,
    alignSelf: 'flex-start',
  },
  profileSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  karma: {
    fontSize: 14,
  },
  profileActions: {
    flexDirection: 'row',
  },
  profileButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  profileButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  premiumSection: {
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumText: {
    marginLeft: 12,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#805500',
  },
  premiumSubtitle: {
    fontSize: 14,
    color: '#805500',
    opacity: 0.8,
  },
  gameSection: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  gameTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  gameItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  gameIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FF4500',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameText: {
    fontSize: 15,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 12,
    opacity: 0.7,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  sectionItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  viewOptions: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  themeSection: {
    marginBottom: 16,
  },
  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  themeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  themeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  activeThemeButton: {
    backgroundColor: 'rgba(255, 69, 0, 0.1)',
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  legalSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  legalLinks: {
    gap: 8,
  },
  legalLink: {
    fontSize: 14,
    paddingVertical: 8,
  },
  appInfo: {
    padding: 20,
    alignItems: 'center',
  },
  version: {
    fontSize: 12,
    marginBottom: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
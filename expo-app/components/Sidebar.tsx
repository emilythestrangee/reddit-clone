import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { theme, themeMode, setThemeMode } = useTheme();

  const colors = {
    dark: { bg: '#1a1a1b', text: '#d7dadc', border: '#343536', active: '#818384' },
    light: { bg: '#ffffff', text: '#030303', border: '#ccc', active: '#d0d0d0' },
  };

  const currentColors = colors[theme];

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.sidebar,
            {
              backgroundColor: currentColors.bg,
            },
          ]}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <MaterialIcons name="close" size={24} color={currentColors.text} />
          </TouchableOpacity>

          <Text style={[styles.section, { color: currentColors.text }]}>THEME</Text>

          {(['dark', 'light', 'auto'] as const).map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => {
                setThemeMode(mode);
                onClose();
              }}
              style={[
                styles.option,
                {
                  backgroundColor: themeMode === mode ? currentColors.active : 'transparent',
                },
              ]}
            >
              <MaterialIcons
                name={mode === 'dark' ? 'dark-mode' : mode === 'light' ? 'light-mode' : 'brightness-auto'}
                size={20}
                color={currentColors.text}
              />
              <Text style={[styles.optionText, { color: currentColors.text }]}>
                {mode === 'auto' ? 'Auto' : mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
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
    width: '70%',
    height: '100%',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  closeBtn: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  section: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 12,
    letterSpacing: 1,
    opacity: 0.7,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  optionText: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '500',
  },
});

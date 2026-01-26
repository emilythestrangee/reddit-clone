import React from 'react';
import { StatusBar } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export const ThemedStatusBar: React.FC = () => {
  const { theme } = useTheme();

  return (
    <StatusBar
      barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      backgroundColor={theme === 'dark' ? '#030303' : '#ffffff'}
    />
  );
};

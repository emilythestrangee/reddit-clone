import { Redirect, router, Stack } from 'expo-router';
import { View, TouchableOpacity, Text } from 'react-native';
import { AntDesign, MaterialIcons, Entypo } from '@expo/vector-icons';
import { useState } from 'react';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { Sidebar } from '../components/Sidebar';
import { ThemedStatusBar } from '../components/ThemedStatusBar';

function RootLayoutContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();

  const colors = {
    dark: { bg: '#030303', text: '#d7dadc', header: '#1a1a1b' },
    light: { bg: '#ffffff', text: '#030303', header: '#f6f6f7' },
  };

  const currentColors = colors[theme];

  return (
    <>
      <ThemedStatusBar />
      <Stack>
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="groupSelector" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="post/[id]" 
          options={{
            headerTitle: '',
            headerStyle: { backgroundColor: '#FF5700' },
            headerLeft: () => <AntDesign name="close" size={24} color="white" onPress={() => router.back()} />,
            headerRight: () => 
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <AntDesign name="search" size={24} color="white" />
                <MaterialIcons name="sort" size={24} color="white" />
                <Entypo name="dots-three-vertical" size={24} color="white" />
              </View>,
            animation: 'slide_from_bottom',
          }} 
        />
        <Stack.Screen 
          name="auth/page" 
          options={{ 
            headerShown: false 
          }} 
        />
      </Stack>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
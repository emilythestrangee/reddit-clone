// app/_layout.tsx - FIXED with auth routing
import { useEffect } from 'react';
import { Redirect, router, Stack, useSegments } from 'expo-router';
import { View, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { AntDesign, MaterialIcons, Entypo } from '@expo/vector-icons';
import { useState } from 'react';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { ThemedStatusBar } from '../components/ThemedStatusBar';
import SplashScreen from '../components/splashscreen/page';

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const [showSplash, setShowSplash] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (isLoading) return;

    const currentSegments = segments as string[];
    const inTabs = currentSegments[0] === '(tabs)';
    const inAuth = currentSegments[0] === 'auth';
    const inOnboarding = currentSegments[0] === 'onboardingscreen';
    // ALLOW these routes to exist without redirect
    const inSearch = currentSegments[0] === 'search';
    const inPost = currentSegments[0] === 'post';

    console.log('🔍 Navigation check:', {
      inTabs,
      isAuthenticated,
      segments: currentSegments.join('/'),
    });

    // Only redirect if on auth page while already logged in
    // but NOT if we're on search, post, or onboarding
    if (isAuthenticated && inAuth) {
      console.log('➡️ Redirecting to home (already logged in)');
      router.replace('/(tabs)');
    }

    // Only redirect to auth if in tabs and not authenticated
    // but NEVER redirect search or post routes
    if (!isAuthenticated && inTabs) {
      console.log('➡️ Redirecting to auth (not logged in)');
      router.replace('../auth/page');
    }
  }, [isAuthenticated, isLoading, segments]);


  // Show splash for 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Show splash screen while loading OR during initial 2.5s
  if (showSplash || isLoading) {
    return <SplashScreen />;
  }

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5700" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

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
        <Stack.Screen 
          name="onboardingscreen/page" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen
          name="search/page"
          options={{
            headerShown: false,
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
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    marginTop: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
});
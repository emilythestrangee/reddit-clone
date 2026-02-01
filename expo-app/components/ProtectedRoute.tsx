// components/ProtectedRoute.tsx - Route guard for authenticated routes
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Don't redirect while checking auth status
    if (isLoading) return;

    const inAuthGroup = segments[0] as string === '(auth)';
    const inTabsGroup = segments[0] as string === '(tabs)';

    if (!isAuthenticated && ((inTabsGroup || (segments as string[]).includes('create-post')))) {
      // User is not authenticated but trying to access protected route
      // Redirect to auth page
      router.replace('../auth/page');
    } else if (isAuthenticated && inAuthGroup) {
      // User is authenticated but on auth page
      // Redirect to home
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF5700" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
});


// Alternative: useProtectedRoute hook for individual screens
export function useProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('../auth/page');
    }
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated, isLoading };
}
// hooks/useOAuth.ts - FIXED with correct property name
import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { makeRedirectUri } from 'expo-auth-session';
import { Platform } from 'react-native';
import authService from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

// IMPORTANT: This must be called at the top level to dismiss the web popup
WebBrowser.maybeCompleteAuthSession();

export function useOAuth() {
  const { loginWithSSO } = useAuth();

  // Google OAuth Configuration - following Expo docs
  const [request, response, promptAsync] = Google.useAuthRequest({
    // Use appropriate client ID based on environment
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    // Let expo-auth-session handle redirect URI automatically
    redirectUri: makeRedirectUri({
      scheme: 'redditclone', // Must match app.json scheme
    }),
  });

  // Handle Google OAuth response
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.idToken) {
        handleGoogleLogin(authentication.idToken);
      } else if (authentication?.accessToken) {
        // Fallback to access token if ID token not available
        handleGoogleLogin(authentication.accessToken);
      }
    } else if (response?.type === 'error') {
      console.error('Google OAuth error:', response.error);
    } else if (response?.type === 'cancel') {
      console.log('Google OAuth cancelled by user');
    }
  }, [response]);

  const handleGoogleLogin = async (token: string, selectedAvatar?: any) => {
    try {
      console.log('🔐 Processing Google login...');
      
      const oauthResponse = await authService.oauthLogin({
        token: token,
        provider: 'google',
        avatar: selectedAvatar?.id || '',
      });
      
      console.log('✅ Google login successful');
      await loginWithSSO(oauthResponse, selectedAvatar);
    } catch (error: any) {
      console.error('❌ Google login failed:', error);
      throw error;
    }
  };

  const handleAppleLogin = async (selectedAvatar?: any) => {
    if (Platform.OS !== 'ios') {
      throw new Error('Apple Sign-In is only available on iOS');
    }

    try {
      console.log('🍎 Starting Apple Sign-In...');
      
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      
      if (credential.identityToken) {
        console.log('✅ Apple credential received');
        
        // Extract username from Apple credential if available
        const username = credential.fullName?.givenName || 
                        credential.fullName?.nickname || 
                        undefined;
        
        const oauthResponse = await authService.oauthLogin({
          token: credential.identityToken,
          provider: 'apple',
          username: username,
          avatar: selectedAvatar?.id || '',
        });
        
        console.log('✅ Apple login successful');
        await loginWithSSO(oauthResponse, selectedAvatar);
      } else {
        throw new Error('No identity token received from Apple');
      }
    } catch (error: any) {
      if (error.code === 'ERR_REQUEST_CANCELED') {
        console.log('Apple Sign-In cancelled by user');
        return; // Don't throw error for user cancellation
      }
      console.error('❌ Apple login failed:', error);
      throw error;
    }
  };

  // Warm up browser on Android for better UX (from Expo docs)
  useEffect(() => {
    if (Platform.OS === 'android') {
      WebBrowser.warmUpAsync();
      return () => {
        WebBrowser.coolDownAsync();
      };
    }
  }, []);

  return {
    // Google login - promptAsync is already bound to the correct handler
    handleGoogleLogin: (selectedAvatar?: any) => {
      promptAsync().catch((error) => {
        console.error('Google OAuth prompt error:', error);
      });
    },
    // Apple login
    handleAppleLogin,
    // FIXED: Changed from isGoogleLoading to googleLoading
    googleLoading: !request,
  };
}
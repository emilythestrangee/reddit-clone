import { useState } from 'react';

export function useOAuth() {
  const [googleLoading] = useState(false);

  const handleGoogleLogin = async (selectedAvatar?: any) => {
    console.log('ℹ️ OAuth not configured - skipping Google login');
    return;
  };

  const handleAppleLogin = async (selectedAvatar?: any) => {
    console.log('ℹ️ OAuth not configured - skipping Apple login');
    return;
  };

  return {
    handleGoogleLogin,
    handleAppleLogin,
    googleLoading,
  };
}
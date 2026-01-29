// app/auth/page.tsx - With Dark Theme Support and Onboarding
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';

export default function AuthPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    setIsLoading(true);
    setError('');

    // Simple validation
    if (isLogin) {
      if (!email || !password) {
        setError('Please enter email and password');
        setIsLoading(false);
        return;
      }
    } else {
      if (!username || !email || !password) {
        setError('Please fill in all fields');
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setIsLoading(false);
        return;
      }
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsLoading(false);
    
    // If signing up, go to onboarding. If logging in, go back
    if (!isLogin) {
      router.push('../../onboardingscreen/page');
    } else {
      router.back();
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    // For social login during signup, go to onboarding
    // For login, just go back
    if (!isLogin) {
      router.push('../../onboardingscreen/page');
    } else {
      router.back();
    }
  };

  // Theme colors
  const colors = {
    background: isDark ? '#000000' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#1A1A1B',
    textSecondary: isDark ? '#B8B8B8' : '#878A8C',
    border: isDark ? '#343536' : '#EDEDED',
    inputBg: isDark ? '#1A1A1B' : '#FAFAFA',
    inputBorder: isDark ? '#343536' : '#E9E9E9',
    errorBg: isDark ? '#3D1518' : '#FFEBEE',
    errorText: isDark ? '#FF6B6B' : '#EA0027',
    divider: isDark ? '#343536' : '#E9E9E9',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={[styles.header, { paddingTop: 30, borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Ionicons name="logo-reddit" size={28} color="#FF5700" />
              <Text style={styles.logoText}>reddit</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>

          {/* Auth Form */}
          <View style={styles.formContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              {isLogin ? 'Log in to Reddit' : 'Join Reddit'}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {isLogin
                ? 'By continuing, you agree to our User Agreement and Privacy Policy.'
                : 'Create your account to join the conversation.'}
            </Text>

            {error ? (
              <View style={[styles.errorContainer, { backgroundColor: colors.errorBg }]}>
                <MaterialIcons name="error-outline" size={20} color={colors.errorText} />
                <Text style={[styles.errorText, { color: colors.errorText }]}>{error}</Text>
              </View>
            ) : null}

            {/* Signup Fields */}
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>USERNAME</Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: colors.inputBg,
                      borderColor: colors.inputBorder,
                      color: colors.text
                    }
                  ]}
                  placeholder="Choose a username"
                  placeholderTextColor={colors.textSecondary}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  editable={!isLoading}
                />
              </View>
            )}

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>EMAIL</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: colors.inputBg,
                    borderColor: colors.inputBorder,
                    color: colors.text
                  }
                ]}
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!isLoading}
              />
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>PASSWORD</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      flex: 1,
                      paddingRight: 50,
                      backgroundColor: colors.inputBg,
                      borderColor: colors.inputBorder,
                      color: colors.text
                    }
                  ]}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {!isLogin && (
                <Text style={[styles.passwordHint, { color: colors.textSecondary }]}>
                  Password must be at least 6 characters
                </Text>
              )}
            </View>

            {/* Auth Button */}
            <TouchableOpacity
              style={[styles.authButton, isLoading && styles.authButtonDisabled]}
              onPress={handleAuth}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.authButtonText}>
                  {isLogin ? 'Log In' : 'Continue'}
                </Text>
              )}
            </TouchableOpacity>

            {/* OR Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
              <Text style={[styles.dividerText, { color: colors.textSecondary }]}>OR</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialContainer}>
              {/* Google */}
              <TouchableOpacity
                style={[styles.socialButton, styles.googleButton]}
                onPress={() => handleSocialLogin('google')}
                disabled={isLoading}
              >
                <FontAwesome name="google" size={20} color="#FFFFFF" />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </TouchableOpacity>

              {/* Apple */}
              <TouchableOpacity
                style={[styles.socialButton, styles.appleButton]}
                onPress={() => handleSocialLogin('apple')}
                disabled={isLoading}
              >
                <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
              </TouchableOpacity>

              {/* Facebook */}
              <TouchableOpacity
                style={[styles.socialButton, styles.facebookButton]}
                onPress={() => handleSocialLogin('facebook')}
                disabled={isLoading}
              >
                <FontAwesome name="facebook" size={20} color="#FFFFFF" />
                <Text style={styles.socialButtonText}>Continue with Facebook</Text>
              </TouchableOpacity>
            </View>

            {/* Switch between Login/Signup */}
            <View style={styles.switchContainer}>
              <Text style={[styles.switchText, { color: colors.textSecondary }]}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                disabled={isLoading}
              >
                <Text style={styles.switchLink}>
                  {isLogin ? 'Sign up' : 'Log in'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Terms */}
            <View style={styles.termsContainer}>
              <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                By continuing, you agree to our{' '}
                <Text style={styles.termsLink}>User Agreement</Text> and acknowledge
                that you understand the{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF5700',
    marginLeft: 8,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    padding: 10,
  },
  passwordHint: {
    fontSize: 12,
    marginTop: 6,
  },
  authButton: {
    backgroundColor: '#FF5700',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  authButtonDisabled: {
    opacity: 0.7,
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  socialContainer: {
    gap: 12,
    marginBottom: 32,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  appleButton: {
    backgroundColor: '#000000',
  },
  facebookButton: {
    backgroundColor: '#1877F2',
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  switchText: {
    fontSize: 14,
  },
  switchLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0079D3',
  },
  termsContainer: {
    paddingHorizontal: 16,
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  termsLink: {
    color: '#0079D3',
    textDecorationLine: 'underline',
  },
});
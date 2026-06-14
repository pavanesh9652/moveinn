import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthInput } from '@/components/auth/AuthInput';
import { ADMIN_ONBOARD_ROUTE } from '@/constants/routes';
import { theme } from '@/constants/theme';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminLoginScreen() {
  const router = useRouter();
  const { signIn } = useAdminAuth();
  const [email, setEmail] = useState('admin@rentrent.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await signIn(email.trim().toLowerCase(), password);
      router.replace(ADMIN_ONBOARD_ROUTE);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <AuthHeader />

          <View style={styles.card}>
            <Text style={styles.badge}>Admin</Text>
            <Text style={styles.title}>PG onboarding</Text>
            <Text style={styles.subtitle}>Sign in to add new properties</Text>

            {error ? <Text style={styles.formError}>{error}</Text> : null}

            <AuthInput
              label="Email"
              icon="mail-outline"
              placeholder="admin@rentrent.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoComplete="email"
            />

            <AuthInput
              label="Password"
              icon="lock-closed-outline"
              placeholder="Enter admin password"
              value={password}
              onChangeText={setPassword}
              isPassword
              autoComplete="password"
            />

            <Pressable
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Sign in</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  card: {
    flex: 1,
    marginTop: -16,
    paddingHorizontal: theme.spacing.xxl,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xxl,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
  },
  badge: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  formError: {
    fontSize: 13,
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.radius.md,
  },
  primaryButton: {
    backgroundColor: theme.colors.primaryDark,
    paddingVertical: 16,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    ...theme.shadow.card,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

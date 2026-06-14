import { useRouter, useSegments } from 'expo-router';
import { useEffect, type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { theme } from '@/constants/theme';
import { useAdminAuth } from '@/context/AdminAuthContext';

type AdminRouteGuardProps = {
  children: ReactNode;
};

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const router = useRouter();
  const segments = useSegments();
  const { isAdmin, ready } = useAdminAuth();

  const lastSegment = segments[segments.length - 1];
  const onLoginScreen = lastSegment === 'admin' || lastSegment === 'index';

  useEffect(() => {
    if (!ready) return;

    if (!isAdmin && !onLoginScreen) {
      router.replace('/admin');
      return;
    }

    if (isAdmin && onLoginScreen) {
      router.replace('/admin/onboard');
    }
  }, [ready, isAdmin, onLoginScreen, router]);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
});

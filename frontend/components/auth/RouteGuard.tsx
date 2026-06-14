import { useRouter, useSegments } from 'expo-router';
import { useEffect, type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { LOGIN_ROUTE, isProtectedRoute } from '@/constants/routes';
import { theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

type RouteGuardProps = {
  children: ReactNode;
};

export function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, ready } = useAuth();

  useEffect(() => {
    if (!ready) return;
    if (segments[0] === 'admin') return;
    if (isAuthenticated) return;
    if (!isProtectedRoute(segments)) return;

    router.replace(LOGIN_ROUTE);
  }, [ready, isAuthenticated, segments, router]);

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

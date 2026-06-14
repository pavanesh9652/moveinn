import { useRouter, useSegments } from 'expo-router';
import { useEffect, type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { HOME_ROUTE, LOGIN_ROUTE, isAuthScreen, isProtectedRoute } from '@/constants/routes';
import { theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

type RouteGuardProps = {
  children: ReactNode;
};

export function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, ready, refresh } = useAuth();

  useEffect(() => {
    if (!ready) return;
    if (segments[0] === 'admin') return;
    void refresh();
  }, [ready, refresh, segments]);

  useEffect(() => {
    if (!ready) return;
    if (segments[0] === 'admin') return;

    const onProtectedRoute = isProtectedRoute(segments);
    const onAuthScreen = isAuthScreen(segments);

    if (onProtectedRoute && !isAuthenticated) {
      router.replace(LOGIN_ROUTE);
      return;
    }

    if (onAuthScreen && isAuthenticated) {
      router.replace(HOME_ROUTE);
    }
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

import { usePathname, useRouter } from 'expo-router';
import { useEffect, type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import {
  ADMIN_LOGIN_ROUTE,
  isAdminOnboardPath,
} from '@/constants/routes';
import { theme } from '@/constants/theme';
import { useAdminAuth } from '@/context/AdminAuthContext';

type AdminRouteGuardProps = {
  children: ReactNode;
};

export function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAdmin, ready } = useAdminAuth();

  useEffect(() => {
    if (!ready) return;

    if (!isAdmin && isAdminOnboardPath(pathname)) {
      router.replace(ADMIN_LOGIN_ROUTE);
    }
  }, [ready, isAdmin, pathname, router]);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!isAdmin && isAdminOnboardPath(pathname)) {
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

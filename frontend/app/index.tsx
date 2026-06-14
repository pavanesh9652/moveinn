import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { LoginScreen } from '@/components/auth/LoginScreen';
import { HOME_ROUTE } from '@/constants/routes';
import { theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function Index() {
  const { isAuthenticated, ready } = useAuth();

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href={HOME_ROUTE} />;
  }

  return <LoginScreen />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
});

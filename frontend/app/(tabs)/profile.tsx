import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { LocationHeader } from '@/components/home/LocationHeader';
import { MenuItem } from '@/components/profile/MenuItem';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { config, userData } = useData();

  const handleMenuPress = (id: string) => {
    if (id === 'saved') {
      router.push('/saved');
    }
  };

  const handleSignOut = () => {
    void signOut();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LocationHeader location={config.currentLocation} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <ProfileCard user={userData.user} />

        {userData.profileMenu.map((item) => (
          <MenuItem
            key={item.id}
            label={item.label}
            icon={item.icon as keyof typeof Ionicons.glyphMap}
            count={'count' in item ? item.count : undefined}
            onPress={() => handleMenuPress(item.id)}
          />
        ))}

        <Pressable
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={20} color={theme.colors.primary} />
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>

        <Text style={styles.version}>MoveInn v1.0 · Move Better. Stay Smarter.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: theme.spacing.xxl,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    paddingVertical: 14,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  version: {
    fontSize: 12,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
});

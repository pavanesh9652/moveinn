import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ListingOnboardForm } from '@/components/admin/ListingOnboardForm';
import { theme } from '@/constants/theme';
import { useAdminAuth } from '@/context/AdminAuthContext';

export default function AdminOnboardScreen() {
  const { signOut } = useAdminAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [lastCreatedId, setLastCreatedId] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Add PG / Co-Living</Text>
          <Text style={styles.subtitle}>Enter all property details for onboarding</Text>
        </View>
        <Pressable
          style={styles.signOut}
          disabled={signingOut}
          onPress={async () => {
            setSigningOut(true);
            try {
              await signOut();
            } finally {
              setSigningOut(false);
            }
          }}
        >
          <Ionicons name="log-out-outline" size={18} color={theme.colors.primary} />
        </Pressable>
      </View>

      {lastCreatedId ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Last created listing id: {lastCreatedId}</Text>
        </View>
      ) : null}

      <ListingOnboardForm onSuccess={setLastCreatedId} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    gap: theme.spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.primaryDark,
  },
  subtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  signOut: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.verifiedBg,
  },
  bannerText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.verified,
  },
});

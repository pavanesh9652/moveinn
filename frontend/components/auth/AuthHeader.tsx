import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '@/constants/theme';

type AuthHeaderProps = {
  showBack?: boolean;
  onBack?: () => void;
};

export function AuthHeader({ showBack, onBack }: AuthHeaderProps) {
  return (
    <View style={styles.hero}>
      {showBack ? (
        <Pressable style={styles.backButton} onPress={onBack} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
      ) : null}
      <View style={styles.brandRow}>
        <View style={styles.logoWrap}>
          <Ionicons name="business" size={22} color="#FFFFFF" />
        </View>
        <Text style={styles.brand}>MoveInn</Text>
      </View>
      <Text style={styles.tagline}>Move Better. Stay Smarter.</Text>
      <View style={styles.verifiedRow}>
        <Ionicons name="shield-checkmark" size={16} color={theme.colors.verified} />
        <Text style={styles.verifiedText}>Verified PG & co-living stays</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: theme.colors.primaryDark,
    paddingHorizontal: theme.spacing.xxl,
    paddingTop: theme.spacing.xxl,
    paddingBottom: 32,
    borderBottomLeftRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  logoWrap: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: theme.spacing.lg,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.full,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  verifiedText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
  },
});

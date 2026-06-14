import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '@/constants/theme';

type ProfileCardProps = {
  user: {
    name: string;
    email: string;
    mobile?: string;
    initial: string;
    verifiedSince: string;
  };
};

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user.initial}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          {user.mobile ? <Text style={styles.mobile}>+91 {user.mobile}</Text> : null}
        </View>
        <Pressable style={styles.editButton}>
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
      </View>
      <View style={styles.verifiedRow}>
        <Ionicons name="checkmark-circle" size={16} color={theme.colors.verified} />
        <Text style={styles.verifiedText}>Verified user · since {user.verifiedSince}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primaryDark,
    borderRadius: theme.radius.xl,
    ...theme.shadow.card,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(167, 139, 250, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  email: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  mobile: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  editButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  editText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  verifiedText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
});

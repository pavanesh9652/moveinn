import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { NotificationBell } from '@/components/ui/NotificationBell';
import { theme } from '@/constants/theme';

interface LocationHeaderProps {
  location: string;
}

export function LocationHeader({ location }: LocationHeaderProps) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.locationPressable}>
        <Text style={styles.label}>CURRENT LOCATION</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={16} color={theme.colors.primary} />
          <Text style={styles.location}>{location}</Text>
          <Ionicons name="chevron-down" size={14} color={theme.colors.text} />
        </View>
      </Pressable>
      <NotificationBell />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  locationPressable: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  label: {
    fontSize: 11,
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  location: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
});

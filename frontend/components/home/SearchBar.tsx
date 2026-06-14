import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '@/constants/theme';

interface SearchBarProps {
  onPress?: () => void;
}

export function SearchBar({ onPress }: SearchBarProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Ionicons name="search" size={18} color={theme.colors.textMuted} />
      <Text style={styles.placeholder}>Search by area, office or PG name…</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 14,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  placeholder: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.textMuted,
  },
});

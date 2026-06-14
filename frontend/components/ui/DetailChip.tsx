import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '@/constants/theme';

interface DetailChipProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}

export function DetailChip({ icon, label }: DetailChipProps) {
  return (
    <View style={styles.chip}>
      <Ionicons name={icon} size={12} color={theme.colors.textMuted} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});

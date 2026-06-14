import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '@/constants/theme';

const CHIP_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  'Co-Living': 'business',
  PG: 'home',
  'Near Office': 'briefcase',
  'Andhra Food': 'restaurant',
  'Strong Wi-Fi': 'wifi',
  Premium: 'diamond',
};

interface FilterChipsProps {
  chips: readonly string[];
}

export function FilterChips({ chips }: FilterChipsProps) {
  const [active, setActive] = useState<string>('Co-Living');

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {chips.map((chip) => {
        const isActive = active === chip;
        const icon = CHIP_ICONS[chip] ?? 'ellipse';
        return (
          <Pressable
            key={chip}
            onPress={() => setActive(chip)}
            style={[styles.chip, isActive && styles.chipActive]}
          >
            <Ionicons
              name={icon}
              size={14}
              color={isActive ? theme.colors.chipActiveText : theme.colors.text}
            />
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{chip}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.chipBg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  chipActive: {
    backgroundColor: theme.colors.chipActiveBg,
    borderColor: theme.colors.chipActiveBg,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.text,
  },
  chipTextActive: {
    color: theme.colors.chipActiveText,
  },
});

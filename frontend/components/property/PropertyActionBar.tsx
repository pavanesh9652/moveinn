import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { formatCurrency } from '@/lib/propertyDetails';
import { theme } from '@/constants/theme';

type PropertyActionBarProps = {
  price: number;
  responseMinutes: number;
};

export function PropertyActionBar({ price, responseMinutes }: PropertyActionBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, theme.spacing.md) }]}>
      <View style={styles.priceBlock}>
        <Text style={styles.priceLabel}>STARTING FROM</Text>
        <Text style={styles.price}>{formatCurrency(price)}/mo</Text>
        <Text style={styles.response}>Replies in ~{responseMinutes} min</Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={[styles.iconButton, styles.phoneButton]}>
          <Ionicons name="call" size={20} color="#FFFFFF" />
        </Pressable>
        <Pressable style={[styles.iconButton, styles.whatsappButton]}>
          <Ionicons name="logo-whatsapp" size={22} color="#FFFFFF" />
        </Pressable>
        <Pressable style={styles.scheduleButton}>
          <Ionicons name="calendar" size={18} color="#FFFFFF" />
          <Text style={styles.scheduleText}>Schedule Visit</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    ...theme.shadow.card,
  },
  priceBlock: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.6,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: 2,
  },
  response: {
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneButton: {
    backgroundColor: theme.colors.primaryDark,
  },
  whatsappButton: {
    backgroundColor: '#22C55E',
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    borderRadius: theme.radius.full,
  },
  scheduleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '@/constants/theme';

type BadgeVariant = 'verified' | 'rating' | 'type' | 'featured';

interface ImageOverlayBadgeProps {
  variant: BadgeVariant;
  label: string;
  sublabel?: string;
  style?: ViewStyle;
}

export function ImageOverlayBadge({ variant, label, sublabel, style }: ImageOverlayBadgeProps) {
  return (
    <View style={[styles.base, styles[variant], style]}>
      {variant === 'verified' ? (
        <Ionicons name="shield-checkmark" size={11} color={theme.colors.verified} />
      ) : null}
      {variant === 'rating' ? (
        <Ionicons name="star" size={10} color={theme.colors.star} />
      ) : null}
      {variant === 'featured' ? (
        <Ionicons name="sparkles" size={10} color="#FFFFFF" />
      ) : null}
      <Text
        style={[
          styles.text,
          variant === 'verified' && styles.verifiedText,
          variant === 'rating' && styles.ratingText,
          variant === 'type' && styles.typeText,
          variant === 'featured' && styles.featuredText,
        ]}
      >
        {label}
        {sublabel ? ` ${sublabel}` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  verified: {
    backgroundColor: theme.colors.verifiedBg,
  },
  rating: {
    backgroundColor: theme.colors.overlayDark,
  },
  type: {
    backgroundColor: theme.colors.overlayDark,
  },
  featured: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  text: {
    fontSize: 10,
    fontWeight: '600',
  },
  verifiedText: {
    color: theme.colors.verified,
  },
  ratingText: {
    color: '#FFFFFF',
  },
  typeText: {
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  featuredText: {
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

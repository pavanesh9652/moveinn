import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { VerifiedBadge } from '@/components/VerifiedBadge';
import { theme } from '@/constants/theme';
import { Listing } from '@/types/listing';

interface ListingCardProps {
  listing: Listing;
  onPress?: () => void;
}

function formatPrice(price: number) {
  return `₹${price.toLocaleString('en-IN')}/mo`;
}

export function ListingCard({ listing, onPress }: ListingCardProps) {
  const travelInfo =
    listing.travelMinutes != null
      ? `${listing.travelMinutes} min · ${listing.distanceKm} km`
      : `${listing.distanceKm} km`;

  const meta = [
    listing.gender,
    listing.cuisine,
    listing.roomTypes.join(', '),
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image source={{ uri: listing.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {listing.name}
          </Text>
          <VerifiedBadge compact />
        </View>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={12} color={theme.colors.star} />
          <Text style={styles.rating}>{listing.rating.toFixed(1)}</Text>
          {listing.reviewCount != null ? (
            <Text style={styles.reviews}>({listing.reviewCount})</Text>
          ) : null}
          <View style={styles.typePill}>
            <Text style={styles.typeText}>{listing.type}</Text>
          </View>
        </View>

        <Text style={styles.priceLabel}>Starting</Text>
        <Text style={styles.price}>{formatPrice(listing.price)}</Text>

        <Text style={styles.location} numberOfLines={1}>
          {listing.name} {listing.area}, {listing.city}
        </Text>
        <Text style={styles.travel}>{travelInfo}</Text>
        {meta ? <Text style={styles.meta} numberOfLines={1}>{meta}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: theme.colors.surface,
  },
  content: {
    padding: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
    marginBottom: 6,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text,
  },
  reviews: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginRight: 6,
  },
  typePill: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
  priceLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 6,
  },
  location: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  travel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginBottom: 2,
  },
  meta: {
    fontSize: 11,
    color: theme.colors.textMuted,
  },
});

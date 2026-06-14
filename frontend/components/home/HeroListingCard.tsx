import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { DetailChip } from '@/components/ui/DetailChip';
import { ImageOverlayBadge } from '@/components/ui/ImageOverlayBadge';
import { theme } from '@/constants/theme';
import { Listing } from '@/types/listing';

interface HeroListingCardProps {
  listing: Listing;
  fullWidth?: boolean;
  onPress?: () => void;
}

function formatPrice(price: number) {
  return `₹${price.toLocaleString('en-IN')}/mo`;
}

export function HeroListingCard({ listing, fullWidth = false, onPress }: HeroListingCardProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cardWidth = fullWidth ? width - theme.spacing.lg * 2 : width * 0.92;

  const travelInfo =
    listing.travelMinutes != null
      ? `${listing.travelMinutes} min · ${listing.distanceKm} km`
      : `${listing.distanceKm} km`;

  const foodLabel = listing.cuisine ?? listing.gender ?? 'Mixed';

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    router.push(`/property/${listing.id}`);
  };

  return (
    <Pressable
      style={[styles.card, { width: cardWidth }, theme.shadow.card]}
      onPress={handlePress}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: listing.imageUrl }} style={styles.image} />
        <View style={styles.imageGradient} />

        <ImageOverlayBadge
          variant="verified"
          label="MoveInn Verified"
          style={styles.badgeTopLeft}
        />
        <ImageOverlayBadge
          variant="rating"
          label={listing.rating.toFixed(1)}
          sublabel={listing.reviewCount != null ? `(${listing.reviewCount})` : undefined}
          style={styles.badgeTopRight}
        />
        <ImageOverlayBadge
          variant="type"
          label={listing.type}
          style={styles.badgeBottomLeft}
        />
        <View style={styles.priceOverlay}>
          <Text style={styles.priceLabel}>STARTING</Text>
          <Text style={styles.priceValue}>{formatPrice(listing.price)}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{listing.name}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={13} color={theme.colors.primary} />
          <Text style={styles.location}>
            {listing.area}, {listing.city}
          </Text>
        </View>
        <View style={styles.detailsRow}>
          <DetailChip icon="time-outline" label={travelInfo} />
          <DetailChip icon="restaurant-outline" label={foodLabel} />
          <DetailChip icon="people-outline" label={listing.roomTypes.join(', ')} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  imageWrap: {
    height: 220,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.surface,
  },
  imageGradient: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'transparent',
    // Bottom gradient simulated via price overlay positioning
  },
  badgeTopLeft: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  badgeTopRight: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  badgeBottomLeft: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  priceOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    alignItems: 'flex-end',
    backgroundColor: theme.colors.imageGradient,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
  },
  priceLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.5,
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  content: {
    padding: theme.spacing.lg,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: theme.spacing.md,
  },
  location: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
});

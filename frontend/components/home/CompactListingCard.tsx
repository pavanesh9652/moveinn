import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ImageOverlayBadge } from '@/components/ui/ImageOverlayBadge';
import { theme } from '@/constants/theme';
import { Listing } from '@/types/listing';

interface CompactListingCardProps {
  listing: Listing;
  onPress?: () => void;
}

function formatPrice(price: number) {
  return `₹${price.toLocaleString('en-IN')}/mo`;
}

export function CompactListingCard({ listing, onPress }: CompactListingCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    router.push(`/property/${listing.id}`);
  };

  return (
    <Pressable style={[styles.card, theme.shadow.card]} onPress={handlePress}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: listing.imageUrl }} style={styles.image} />
        <ImageOverlayBadge
          variant="verified"
          label="MoveInn Verified"
          style={styles.badgeTopLeft}
        />
        <ImageOverlayBadge
          variant="rating"
          label={listing.rating.toFixed(1)}
          style={styles.badgeTopRight}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {listing.name}
        </Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={11} color={theme.colors.textMuted} />
          <Text style={styles.location} numberOfLines={1}>
            {listing.area} · {listing.distanceKm} km
          </Text>
        </View>
        <Text style={styles.price}>{formatPrice(listing.price)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  imageWrap: {
    height: 120,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.surface,
  },
  badgeTopLeft: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  badgeTopRight: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  content: {
    padding: theme.spacing.md,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 6,
  },
  location: {
    flex: 1,
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
});

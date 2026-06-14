import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { ImageOverlayBadge } from '@/components/ui/ImageOverlayBadge';
import { theme } from '@/constants/theme';
import { Listing } from '@/types/listing';

interface FeaturedCardProps {
  listing: Listing;
  onPress?: () => void;
}

function formatPrice(price: number) {
  return `₹${price.toLocaleString('en-IN')}/mo`;
}

export function FeaturedCard({ listing, onPress }: FeaturedCardProps) {
  const router = useRouter();

  const handleExplore = () => {
    if (onPress) {
      onPress();
      return;
    }
    router.push(`/property/${listing.id}`);
  };

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#1A1C3D', '#2D3250', '#1A1C3D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <ImageOverlayBadge variant="featured" label="Featured" style={styles.badge} />
        <Text style={styles.title}>{listing.name}</Text>
        {listing.featuredTagline ? (
          <Text style={styles.tagline}>{listing.featuredTagline}</Text>
        ) : null}
        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>STARTING</Text>
            <Text style={styles.price}>{formatPrice(listing.price)}</Text>
          </View>
          <Pressable style={styles.ctaButton} onPress={handleExplore}>
            <Text style={styles.ctaText}>Explore →</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  card: {
    borderRadius: theme.radius.xl,
    padding: theme.spacing.lg,
    minHeight: 200,
    justifyContent: 'flex-end',
    ...theme.shadow.card,
  },
  badge: {
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: theme.spacing.lg,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ctaButton: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

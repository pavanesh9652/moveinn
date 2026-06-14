import { ScrollView, StyleSheet, useWindowDimensions } from 'react-native';

import { CompactListingCard } from '@/components/home/CompactListingCard';
import { HeroListingCard } from '@/components/home/HeroListingCard';
import { theme } from '@/constants/theme';
import { Listing } from '@/types/listing';

interface ListingCarouselProps {
  listings: Listing[];
  variant?: 'hero' | 'compact';
}

export function ListingCarousel({ listings, variant = 'hero' }: ListingCarouselProps) {
  const { width } = useWindowDimensions();
  const heroCardWidth = width * 0.92;
  const snapInterval = heroCardWidth + theme.spacing.md;

  if (variant === 'compact') {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {listings.map((listing) => (
          <CompactListingCard key={listing.id} listing={listing} />
        ))}
      </ScrollView>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={snapInterval}
      snapToAlignment="start"
      contentContainerStyle={styles.container}
    >
      {listings.map((listing) => (
        <HeroListingCard key={listing.id} listing={listing} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
});

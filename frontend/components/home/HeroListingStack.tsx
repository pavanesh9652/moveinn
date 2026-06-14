import { StyleSheet, View } from 'react-native';

import { HeroListingCard } from '@/components/home/HeroListingCard';
import { theme } from '@/constants/theme';
import { Listing } from '@/types/listing';

interface HeroListingStackProps {
  listings: Listing[];
}

export function HeroListingStack({ listings }: HeroListingStackProps) {
  return (
    <View style={styles.container}>
      {listings.map((listing) => (
        <HeroListingCard key={listing.id} listing={listing} fullWidth />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
});

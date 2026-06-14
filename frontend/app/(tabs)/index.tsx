import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { FeaturedCard } from '@/components/home/FeaturedCard';
import { FilterChips } from '@/components/home/FilterChips';
import { HeroListingStack } from '@/components/home/HeroListingStack';
import { ListingCarousel } from '@/components/home/ListingCarousel';
import { LocationHeader } from '@/components/home/LocationHeader';
import { SearchRow } from '@/components/home/SearchRow';
import { SectionHeader } from '@/components/home/SectionHeader';
import { VerifiedBanner } from '@/components/home/VerifiedBanner';
import { theme } from '@/constants/theme';
import { useData } from '@/context/DataContext';
import { filtersToParams, type SearchFilters } from '@/utils/filterListings';

export default function HomeScreen() {
  const router = useRouter();
  const { listings, config } = useData();

  const seeAll = (partial: Partial<SearchFilters>) => {
    router.push({ pathname: '/search', params: filtersToParams(partial) });
  };
  const nearYou = listings.slice(0, 2);
  const bestRated = [...listings].sort((a, b) => b.rating - a.rating);
  const mostPopular = [listings[0], listings[1], listings[3]];
  const coLiving = listings.filter((l) => l.type === 'Co-Living').slice(0, 2);
  const recentlyVerified = [listings[1], listings[5], listings[3], listings[4]];
  const featured = listings[0];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <LocationHeader location={config.currentLocation} />
        <SearchRow />
        <VerifiedBanner />
        <FilterChips chips={config.filterChips} />

        <SectionHeader
          title="Near you"
          subtitle="6 stays within 10 km of Gachibowli"
          onSeeAll={() => seeAll({ sortBy: 'Distance' })}
        />
        <ListingCarousel listings={nearYou} variant="hero" />

        <SectionHeader
          title="Best rated near you"
          subtitle="Top stays from real residents"
          onSeeAll={() => seeAll({ sortBy: 'Rating' })}
        />
        <ListingCarousel listings={bestRated} variant="compact" />

        <FeaturedCard listing={featured} />

        <SectionHeader
          title="Most popular near you"
          subtitle="What residents are loving"
          onSeeAll={() => seeAll({ sortBy: 'Popularity' })}
        />
        <ListingCarousel listings={mostPopular} variant="compact" />

        <SectionHeader
          title="Co-Living near you"
          subtitle="Curated for professionals & remote workers"
          onSeeAll={() => seeAll({ type: 'Co-Living', sortBy: 'Distance' })}
        />
        <HeroListingStack listings={coLiving} />

        <SectionHeader
          title="Recently verified"
          subtitle="Just passed our 7-point check"
          onSeeAll={() => seeAll({ sortBy: 'Rating' })}
        />
        <ListingCarousel listings={recentlyVerified} variant="compact" />

        <View style={styles.footer}>
          <Ionicons name="business" size={14} color={theme.colors.primary} />
          <Text style={styles.footerText}>MoveInn · Move Better. Stay Smarter.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: theme.spacing.xxl,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  footerText: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
});

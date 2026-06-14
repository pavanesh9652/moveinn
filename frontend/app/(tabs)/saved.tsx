import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { HeroListingStack } from '@/components/home/HeroListingStack';
import { LocationHeader } from '@/components/home/LocationHeader';
import { theme } from '@/constants/theme';
import { useData } from '@/context/DataContext';

export default function SavedScreen() {
  const { listings, config, userData } = useData();
  const savedListings = listings.filter((l) => userData.savedListingIds.includes(l.id));

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <LocationHeader location={config.currentLocation} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <Ionicons name="heart" size={22} color={theme.colors.primary} />
          <Text style={styles.title}>Saved stays</Text>
        </View>
        <Text style={styles.subtitle}>
          {savedListings.length} saved {savedListings.length === 1 ? 'property' : 'properties'}
        </Text>
        <HeroListingStack listings={savedListings} />
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
});

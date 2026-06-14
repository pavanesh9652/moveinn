import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { FoodTab } from '@/components/property/FoodTab';
import { PropertyActionBar } from '@/components/property/PropertyActionBar';
import { QualityScoreCard } from '@/components/property/QualityScoreCard';
import { ReviewsTab } from '@/components/property/ReviewsTab';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { theme } from '@/constants/theme';
import { useData } from '@/context/DataContext';
import {
  formatCurrency,
  getPropertyDetails,
  type PropertyTab,
} from '@/lib/propertyDetails';

const TABS: { id: PropertyTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'food', label: 'Food' },
  { id: 'reviews', label: 'Reviews' },
];

const AMENITY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  wifi: 'wifi',
  videocam: 'videocam',
  business: 'business',
  car: 'car',
  shirt: 'shirt',
  barbell: 'barbell',
  flash: 'flash',
  water: 'water',
};

export default function PropertyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getListingById, userData } = useData();
  const [activeTab, setActiveTab] = useState<PropertyTab>('overview');
  const [saved, setSaved] = useState(
    () => userData.savedListingIds.includes(id ?? ''),
  );

  const listing = getListingById(id ?? '');

  if (!listing) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.errorText}>Property not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const details = getPropertyDetails(listing);
  const travelInfo =
    listing.travelMinutes != null
      ? `${listing.travelMinutes} min · ${listing.distanceKm} km`
      : `${listing.distanceKm} km`;
  const foodLabel = listing.cuisine ?? listing.gender ?? 'Mixed';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.screen}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.gallery}>
            <Image source={{ uri: listing.imageUrl }} style={styles.heroImage} />
            <SafeAreaView style={styles.galleryHeader} edges={['top']}>
              <Pressable onPress={() => router.back()} style={styles.roundButton}>
                <Ionicons name="arrow-back" size={22} color={theme.colors.text} />
              </Pressable>
              <View style={styles.galleryActions}>
                <Pressable style={styles.roundButton}>
                  <Ionicons name="share-outline" size={20} color={theme.colors.text} />
                </Pressable>
                <Pressable style={styles.roundButton} onPress={() => setSaved((v) => !v)}>
                  <Ionicons
                    name={saved ? 'heart' : 'heart-outline'}
                    size={20}
                    color={saved ? theme.colors.primary : theme.colors.text}
                  />
                </Pressable>
              </View>
            </SafeAreaView>
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>1/{details.imageCount}</Text>
            </View>
          </View>

          <View style={styles.body}>
            <View style={styles.typeTag}>
              <Text style={styles.typeTagText}>{listing.type.toUpperCase()}</Text>
            </View>

            <View style={styles.titleRow}>
              <Text style={styles.title}>{listing.name}</Text>
              <View style={styles.ratingPill}>
                <Ionicons name="star" size={12} color={theme.colors.star} />
                <Text style={styles.ratingText}>{listing.rating.toFixed(1)}</Text>
                {listing.reviewCount != null ? (
                  <Text style={styles.reviewCount}>{listing.reviewCount} reviews</Text>
                ) : null}
              </View>
            </View>

            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={theme.colors.textSecondary} />
              <Text style={styles.location}>
                {listing.area}, {listing.city}
              </Text>
            </View>

            <View style={styles.metaRow}>
              <MetaItem icon="time-outline" label={travelInfo} />
              <MetaItem icon="restaurant-outline" label={foodLabel} />
              <MetaItem
                icon="ellipse"
                label={details.availability}
                dotColor={details.availability === 'Few Left' ? theme.colors.star : theme.colors.verified}
              />
            </View>

            <VerifiedBadge />
          </View>

          <QualityScoreCard score={details.qualityScore} breakdown={details.qualityBreakdown} />

          <View style={styles.tabs}>
            {TABS.map((tab) => (
              <Pressable
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.tabActive]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {activeTab === 'overview' ? (
            <View style={styles.tabContent}>
              <Section title="360° Walkthrough" subtitle="Watch the real space before you visit.">
                <View style={styles.walkthrough}>
                  <Ionicons name="play-circle" size={48} color="rgba(255,255,255,0.85)" />
                </View>
              </Section>

              <Section title="Pricing">
                <View style={styles.pricingGrid}>
                  <PricingCard label="STARTING RENT" value={`${formatCurrency(listing.price)}/mo`} />
                  <PricingCard label="DEPOSIT" value={formatCurrency(details.deposit)} />
                  <PricingCard label="MAINTENANCE" value={details.maintenance} />
                  <PricingCard label="ELECTRICITY" value={details.electricity} />
                </View>
              </Section>

              <Section title="Amenities">
                <View style={styles.amenitiesGrid}>
                  {details.amenities.map((amenity) => (
                    <View key={amenity.label} style={styles.amenityItem}>
                      <View style={styles.amenityIcon}>
                        <Ionicons
                          name={AMENITY_ICONS[amenity.icon] ?? 'checkmark-circle'}
                          size={20}
                          color={theme.colors.primary}
                        />
                      </View>
                      <Text style={styles.amenityLabel}>{amenity.label}</Text>
                    </View>
                  ))}
                </View>
              </Section>

              <Section title="Explore the neighbourhood" subtitle={`Within 10 km of ${listing.area}`}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.nearbyRow}>
                    {details.nearbyPlaces.map((place) => (
                      <View key={place.name} style={styles.nearbyCard}>
                        <Text style={styles.nearbyName}>{place.name}</Text>
                        <Text style={styles.nearbyMeta}>
                          {place.travelMinutes} min · {place.distanceKm} km
                        </Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </Section>
            </View>
          ) : null}

          {activeTab === 'food' ? (
            <View style={styles.tabContent}>
              <FoodTab menu={details.weeklyMenu} />
            </View>
          ) : null}

          {activeTab === 'reviews' ? (
            <View style={styles.tabContent}>
              <ReviewsTab
                rating={listing.rating}
                reviewCount={listing.reviewCount ?? details.reviews.length}
                categoryScores={details.reviewCategoryScores}
                reviews={details.reviews}
              />
            </View>
          ) : null}
        </ScrollView>

        <PropertyActionBar price={listing.price} responseMinutes={details.responseMinutes} />
      </View>
    </>
  );
}

function MetaItem({
  icon,
  label,
  dotColor,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  dotColor?: string;
}) {
  return (
    <View style={styles.metaItem}>
      {dotColor ? (
        <View style={[styles.dot, { backgroundColor: dotColor }]} />
      ) : (
        <Ionicons name={icon} size={13} color={theme.colors.textMuted} />
      )}
      <Text style={styles.metaLabel}>{label}</Text>
    </View>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

function PricingCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.pricingCard}>
      <Text style={styles.pricingLabel}>{label}</Text>
      <Text style={styles.pricingValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.lg,
  },
  gallery: {
    height: 300,
    backgroundColor: theme.colors.surface,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  galleryHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
  },
  galleryActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.card,
  },
  imageCounter: {
    position: 'absolute',
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
    backgroundColor: theme.colors.overlayDark,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  imageCounterText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  body: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  typeTag: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
  },
  typeTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: 0.6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.primaryDark,
    lineHeight: 30,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
  },
  reviewCount: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: theme.radius.full,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.xl,
    padding: 4,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.full,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: theme.radius.full,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: theme.colors.background,
    ...theme.shadow.card,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textMuted,
  },
  tabTextActive: {
    color: theme.colors.text,
  },
  tabContent: {
    paddingTop: theme.spacing.lg,
    gap: theme.spacing.xl,
  },
  section: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  walkthrough: {
    height: 180,
    borderRadius: theme.radius.lg,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pricingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  pricingCard: {
    width: '47%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    gap: 6,
  },
  pricingLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textMuted,
    letterSpacing: 0.5,
  },
  pricingValue: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  amenityItem: {
    width: '22%',
    alignItems: 'center',
    gap: 6,
  },
  amenityIcon: {
    width: 52,
    height: 52,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amenityLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  nearbyRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingRight: theme.spacing.lg,
  },
  nearbyCard: {
    width: 180,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 6,
  },
  nearbyName: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  nearbyMeta: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: 40,
  },
  backLink: {
    fontSize: 14,
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: theme.spacing.md,
  },
});

import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AuthInput } from '@/components/auth/AuthInput';
import {
  AMENITY_OPTIONS,
  createDefaultListingDetails,
} from '@/constants/listingDefaults';
import { theme } from '@/constants/theme';
import { createListingAsAdmin } from '@/lib/adminAuth';
import type { ListingType } from '@/types/listing';
import type { NearbyPlace, SampleReview, WeekMenuDay } from '@/types/listingDetails';

type ListingOnboardFormProps = {
  onSuccess: (listingId: string) => void;
};

export function ListingOnboardForm({ onSuccess }: ListingOnboardFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<ListingType>('PG');
  const [price, setPrice] = useState('12500');
  const [rating, setRating] = useState('4.8');
  const [reviewCount, setReviewCount] = useState('0');
  const [area, setArea] = useState('Gachibowli');
  const [city, setCity] = useState('Hyderabad');
  const [distanceKm, setDistanceKm] = useState('1.2');
  const [travelMinutes, setTravelMinutes] = useState('6');
  const [cuisine, setCuisine] = useState('Andhra');
  const [gender, setGender] = useState<'Women' | 'Mixed'>('Mixed');
  const [roomTypes, setRoomTypes] = useState('Single, Double, Triple');
  const [imageFilename, setImageFilename] = useState('listing-1.jpg');
  const [featuredTagline, setFeaturedTagline] = useState('');
  const [deposit, setDeposit] = useState('25000');
  const [maintenance, setMaintenance] = useState('Included');
  const [electricity, setElectricity] = useState('On actuals');
  const [availability, setAvailability] = useState('Available');
  const [responseMinutes, setResponseMinutes] = useState('10');
  const [amenities, setAmenities] = useState<string[]>([...AMENITY_OPTIONS]);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>(
    createDefaultListingDetails().nearbyPlaces,
  );
  const [weeklyMenu, setWeeklyMenu] = useState<WeekMenuDay[]>(
    createDefaultListingDetails().weeklyMenu,
  );
  const [sampleReviews, setSampleReviews] = useState<SampleReview[]>(
    createDefaultListingDetails().sampleReviews,
  );
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const parsedPrice = useMemo(() => Number(price) || 0, [price]);

  const toggleAmenity = (label: string) => {
    setAmenities((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label],
    );
  };

  const updateNearby = (index: number, field: keyof NearbyPlace, value: string) => {
    setNearbyPlaces((current) =>
      current.map((place, i) =>
        i === index
          ? {
              ...place,
              [field]: field === 'name' ? value : Number(value) || 0,
            }
          : place,
      ),
    );
  };

  const updateMenuDay = (index: number, field: keyof WeekMenuDay, value: string) => {
    setWeeklyMenu((current) =>
      current.map((day, i) => (i === index ? { ...day, [field]: value } : day)),
    );
  };

  const updateReview = (index: number, field: keyof SampleReview, value: string) => {
    setSampleReviews((current) =>
      current.map((review, i) =>
        i === index
          ? {
              ...review,
              [field]: field === 'rating' ? Number(value) || 1 : field === 'verified' ? value === 'true' : value,
            }
          : review,
      ),
    );
  };

  const handleSubmit = async () => {
    if (!name.trim() || !parsedPrice || !area.trim() || !city.trim() || !imageFilename.trim()) {
      setError('Fill in name, price, area, city, and image filename');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const listing = await createListingAsAdmin({
        name: name.trim(),
        type,
        rating: Number(rating) || 4.5,
        reviewCount: Number(reviewCount) || 0,
        price: parsedPrice,
        area: area.trim(),
        city: city.trim(),
        distanceKm: Number(distanceKm) || 0,
        travelMinutes: travelMinutes ? Number(travelMinutes) : undefined,
        cuisine: cuisine.trim() || undefined,
        roomTypes: roomTypes.split(',').map((item) => item.trim()).filter(Boolean),
        gender,
        imageFilename: imageFilename.trim(),
        featuredTagline: featuredTagline.trim() || undefined,
        details: {
          deposit: Number(deposit) || parsedPrice * 2,
          maintenance: maintenance.trim(),
          electricity: electricity.trim(),
          availability: availability.trim(),
          responseMinutes: Number(responseMinutes) || 10,
          amenities,
          nearbyPlaces,
          weeklyMenu,
          sampleReviews,
        },
      });

      setSuccess(`"${listing.name}" created with id ${listing.id}`);
      onSuccess(listing.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.form} keyboardShouldPersistTaps="handled">
      <Section title="Basic details">
        <AuthInput label="Property name" icon="business-outline" value={name} onChangeText={setName} />
        <Field label="Type">
          <View style={styles.chipRow}>
            {(['PG', 'Co-Living'] as ListingType[]).map((option) => (
              <Pressable
                key={option}
                style={[styles.chip, type === option && styles.chipActive]}
                onPress={() => setType(option)}
              >
                <Text style={[styles.chipText, type === option && styles.chipTextActive]}>{option}</Text>
              </Pressable>
            ))}
          </View>
        </Field>
        <FieldRow>
          <Field label="Monthly rent (₹)" flex>
            <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />
          </Field>
          <Field label="Rating" flex>
            <TextInput style={styles.input} value={rating} onChangeText={setRating} keyboardType="decimal-pad" />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field label="Review count" flex>
            <TextInput style={styles.input} value={reviewCount} onChangeText={setReviewCount} keyboardType="numeric" />
          </Field>
          <Field label="Gender" flex>
            <View style={styles.chipRow}>
              {(['Mixed', 'Women'] as const).map((option) => (
                <Pressable
                  key={option}
                  style={[styles.chip, gender === option && styles.chipActive]}
                  onPress={() => setGender(option)}
                >
                  <Text style={[styles.chipText, gender === option && styles.chipTextActive]}>{option}</Text>
                </Pressable>
              ))}
            </View>
          </Field>
        </FieldRow>
        <FieldRow>
          <Field label="Area" flex>
            <TextInput style={styles.input} value={area} onChangeText={setArea} />
          </Field>
          <Field label="City" flex>
            <TextInput style={styles.input} value={city} onChangeText={setCity} />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field label="Distance (km)" flex>
            <TextInput style={styles.input} value={distanceKm} onChangeText={setDistanceKm} keyboardType="decimal-pad" />
          </Field>
          <Field label="Travel (min)" flex>
            <TextInput style={styles.input} value={travelMinutes} onChangeText={setTravelMinutes} keyboardType="numeric" />
          </Field>
        </FieldRow>
        <Field label="Cuisine">
          <TextInput style={styles.input} value={cuisine} onChangeText={setCuisine} placeholder="Andhra, North Indian..." />
        </Field>
        <Field label="Room types (comma separated)">
          <TextInput style={styles.input} value={roomTypes} onChangeText={setRoomTypes} />
        </Field>
        <Field label="Image filename">
          <TextInput style={styles.input} value={imageFilename} onChangeText={setImageFilename} placeholder="listing-1.jpg" />
        </Field>
        <Field label="Featured tagline">
          <TextInput style={styles.input} value={featuredTagline} onChangeText={setFeaturedTagline} />
        </Field>
      </Section>

      <Section title="Pricing & availability">
        <FieldRow>
          <Field label="Deposit (₹)" flex>
            <TextInput style={styles.input} value={deposit} onChangeText={setDeposit} keyboardType="numeric" />
          </Field>
          <Field label="Response (min)" flex>
            <TextInput style={styles.input} value={responseMinutes} onChangeText={setResponseMinutes} keyboardType="numeric" />
          </Field>
        </FieldRow>
        <Field label="Maintenance">
          <TextInput style={styles.input} value={maintenance} onChangeText={setMaintenance} />
        </Field>
        <Field label="Electricity">
          <TextInput style={styles.input} value={electricity} onChangeText={setElectricity} />
        </Field>
        <Field label="Availability">
          <TextInput style={styles.input} value={availability} onChangeText={setAvailability} placeholder="Available / Few Left" />
        </Field>
      </Section>

      <Section title="Amenities">
        <View style={styles.chipRow}>
          {AMENITY_OPTIONS.map((label) => (
            <Pressable
              key={label}
              style={[styles.chip, amenities.includes(label) && styles.chipActive]}
              onPress={() => toggleAmenity(label)}
            >
              <Text style={[styles.chipText, amenities.includes(label) && styles.chipTextActive]}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </Section>

      <Section title="Nearby places">
        {nearbyPlaces.map((place, index) => (
          <View key={index} style={styles.subCard}>
            <Field label="Name">
              <TextInput style={styles.input} value={place.name} onChangeText={(v) => updateNearby(index, 'name', v)} />
            </Field>
            <FieldRow>
              <Field label="Minutes" flex>
                <TextInput
                  style={styles.input}
                  value={String(place.travelMinutes)}
                  onChangeText={(v) => updateNearby(index, 'travelMinutes', v)}
                  keyboardType="numeric"
                />
              </Field>
              <Field label="Km" flex>
                <TextInput
                  style={styles.input}
                  value={String(place.distanceKm)}
                  onChangeText={(v) => updateNearby(index, 'distanceKm', v)}
                  keyboardType="decimal-pad"
                />
              </Field>
            </FieldRow>
          </View>
        ))}
      </Section>

      <Section title="Weekly menu">
        {weeklyMenu.map((day, index) => (
          <View key={day.day} style={styles.subCard}>
            <Text style={styles.subCardTitle}>{day.day}</Text>
            <Field label="Breakfast">
              <TextInput style={styles.input} value={day.breakfast} onChangeText={(v) => updateMenuDay(index, 'breakfast', v)} />
            </Field>
            <Field label="Lunch">
              <TextInput style={styles.input} value={day.lunch} onChangeText={(v) => updateMenuDay(index, 'lunch', v)} />
            </Field>
            <Field label="Dinner">
              <TextInput style={styles.input} value={day.dinner} onChangeText={(v) => updateMenuDay(index, 'dinner', v)} />
            </Field>
          </View>
        ))}
      </Section>

      <Section title="Sample reviews">
        {sampleReviews.map((review, index) => (
          <View key={index} style={styles.subCard}>
            <FieldRow>
              <Field label="Author" flex>
                <TextInput style={styles.input} value={review.author} onChangeText={(v) => updateReview(index, 'author', v)} />
              </Field>
              <Field label="Rating" flex>
                <TextInput
                  style={styles.input}
                  value={String(review.rating)}
                  onChangeText={(v) => updateReview(index, 'rating', v)}
                  keyboardType="numeric"
                />
              </Field>
            </FieldRow>
            <Field label="Time ago">
              <TextInput style={styles.input} value={review.timeAgo} onChangeText={(v) => updateReview(index, 'timeAgo', v)} />
            </Field>
            <Field label="Comment">
              <TextInput
                style={[styles.input, styles.textArea]}
                value={review.comment}
                onChangeText={(v) => updateReview(index, 'comment', v)}
                multiline
              />
            </Field>
          </View>
        ))}
      </Section>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}

      <Pressable style={[styles.submit, loading && styles.submitDisabled]} onPress={handleSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitText}>Publish listing</Text>}
      </Pressable>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Field({ label, children, flex }: { label: string; children: React.ReactNode; flex?: boolean }) {
  return (
    <View style={[styles.field, flex && styles.fieldFlex]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <View style={styles.fieldRow}>{children}</View>;
}

const styles = StyleSheet.create({
  form: {
    padding: theme.spacing.lg,
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  section: {
    gap: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  field: {
    gap: 6,
  },
  fieldFlex: {
    flex: 1,
  },
  fieldRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 12,
    fontSize: 14,
    color: theme.colors.text,
    backgroundColor: theme.colors.background,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  chipActive: {
    backgroundColor: theme.colors.primaryDark,
    borderColor: theme.colors.primaryDark,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  subCard: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    gap: theme.spacing.sm,
  },
  subCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.primaryDark,
  },
  error: {
    color: theme.colors.primary,
    fontSize: 13,
  },
  success: {
    color: theme.colors.verified,
    fontSize: 13,
    fontWeight: '600',
  },
  submit: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: theme.radius.full,
    alignItems: 'center',
  },
  submitDisabled: {
    opacity: 0.7,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

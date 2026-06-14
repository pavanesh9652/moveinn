import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeroListingStack } from '@/components/home/HeroListingStack';
import { FilterSection } from '@/components/search/FilterSection';
import { SearchHeader } from '@/components/search/SearchHeader';
import { theme } from '@/constants/theme';
import { useData } from '@/context/DataContext';
import {
  DEFAULT_FILTERS,
  filterListings,
  filtersFromParams,
  hasActiveFilters,
  SearchFilters,
} from '@/utils/filterListings';

const FILTER_OPTIONS = {
  type: ['PG', 'Co-Living'] as const,
  food: ['Andhra', 'Telugu', 'Tamil', 'Kerala', 'North Indian'] as const,
  sharing: ['Single', 'Double', 'Triple', 'Quad'] as const,
  budget: ['< 8k', '8k–12k', '12k–18k', '18k+'] as const,
  sortBy: ['Rating', 'Distance', 'Price', 'Popularity'] as const,
};

export default function SearchScreen() {
  const { listings } = useData();
  const params = useLocalSearchParams<Record<string, string>>();
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);

  useEffect(() => {
    setFilters(filtersFromParams(params));
  }, [params.type, params.food, params.sharing, params.budget, params.sortBy, params.query]);

  const results = useMemo(() => filterListings(listings, filters), [listings, filters]);

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <SearchHeader query={filters.query} onChangeQuery={(q) => updateFilter('query', q)} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <FilterSection
          label="TYPE"
          options={FILTER_OPTIONS.type}
          selected={filters.type}
          onSelect={(v) => updateFilter('type', filters.type === v ? null : v)}
        />
        <FilterSection
          label="FOOD"
          options={FILTER_OPTIONS.food}
          selected={filters.food}
          onSelect={(v) => updateFilter('food', filters.food === v ? null : v)}
        />
        <FilterSection
          label="SHARING"
          options={FILTER_OPTIONS.sharing}
          selected={filters.sharing}
          onSelect={(v) => updateFilter('sharing', filters.sharing === v ? null : v)}
        />
        <FilterSection
          label="BUDGET"
          options={FILTER_OPTIONS.budget}
          selected={filters.budget}
          onSelect={(v) => updateFilter('budget', filters.budget === v ? null : v)}
        />
        <FilterSection
          label="SORT BY"
          options={FILTER_OPTIONS.sortBy}
          selected={filters.sortBy}
          onSelect={(v) => updateFilter('sortBy', v)}
        />

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {results.length} {results.length === 1 ? 'property' : 'properties'}
          </Text>
          {hasActiveFilters(filters) ? (
            <Pressable onPress={clearFilters} hitSlop={8}>
              <Text style={styles.clearFilters}>Clear filters</Text>
            </Pressable>
          ) : null}
        </View>

        <HeroListingStack listings={results} />
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
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  clearFilters: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
});

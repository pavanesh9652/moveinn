import { useSegments } from 'expo-router';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import {
  AuthError,
  fetchConfig,
  fetchListings,
  fetchUserData,
  type AppConfig,
  type ProfileMenuItem,
  type UserData,
} from '@/lib/api';
import type { Listing } from '@/types/listing';

type DataContextValue = {
  listings: Listing[];
  config: AppConfig;
  userData: UserData;
  getListingById: (id: string) => Listing | undefined;
  refreshUserData: () => Promise<void>;
  ready: boolean;
};

const EMPTY_DATA: DataContextValue = {
  listings: [],
  config: { currentLocation: '', filterChips: [] },
  userData: {
    user: { name: '', email: '', initial: '?', verifiedSince: '' },
    profileMenu: [],
    savedListingIds: [],
  },
  getListingById: () => undefined,
  refreshUserData: async () => {},
  ready: false,
};

const DataContext = createContext<DataContextValue>(EMPTY_DATA);

export function DataProvider({ children }: { children: ReactNode }) {
  const segments = useSegments();
  const isAdminRoute = segments[0] === 'admin';
  const { isAuthenticated, ready: authReady, signOut } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAuthError = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const loadData = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const [listingsData, configData, user] = await Promise.all([
        fetchListings(),
        fetchConfig(),
        fetchUserData(),
      ]);
      setListings(listingsData);
      setConfig(configData);
      setUserData(user);
      setError(null);
    } catch (err) {
      if (err instanceof AuthError) {
        await handleAuthError();
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to load data');
    }
  }, [handleAuthError, isAuthenticated]);

  const refreshUserData = useCallback(async () => {
    try {
      const user = await fetchUserData();
      setUserData(user);
    } catch (err) {
      if (err instanceof AuthError) {
        await handleAuthError();
      }
    }
  }, [handleAuthError]);

  useEffect(() => {
    if (!authReady) return;

    if (!isAuthenticated) {
      setListings([]);
      setConfig(null);
      setUserData(null);
      setError(null);
      return;
    }

    loadData();
  }, [authReady, isAuthenticated, loadData]);

  const needsData = authReady && isAuthenticated && !isAdminRoute;
  const dataReady = needsData && config !== null && userData !== null && !error;
  const showLoadingOverlay = needsData && !dataReady && !error;
  const showErrorOverlay = needsData && !!error;

  const contextValue = useMemo<DataContextValue>(() => {
    if (!dataReady || !config || !userData) {
      return EMPTY_DATA;
    }

    return {
      listings,
      config,
      userData,
      getListingById: (id: string) => listings.find((listing) => listing.id === id),
      refreshUserData,
      ready: true,
    };
  }, [dataReady, listings, config, userData, refreshUserData]);

  return (
    <DataContext.Provider value={contextValue}>
      {children}
      {showLoadingOverlay ? (
        <View style={[styles.overlay, styles.centered]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : null}
      {showErrorOverlay ? (
        <View style={[styles.overlay, styles.centered]}>
          <Text style={styles.errorTitle}>Could not load data</Text>
          <Text style={styles.errorText}>
            Make sure the backend is running on port 3001.
          </Text>
        </View>
      ) : null}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}

export type { ProfileMenuItem };

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  errorText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

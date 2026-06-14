import { useSegments } from 'expo-router';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
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
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const segments = useSegments();
  const { isAuthenticated, ready: authReady, signOut } = useAuth();
  const isAdminRoute = segments[0] === 'admin';
  const [listings, setListings] = useState<Listing[]>([]);
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAuthError = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const loadData = useCallback(async () => {
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
  }, [handleAuthError]);

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
    if (!authReady || !isAuthenticated) {
      setListings([]);
      setConfig(null);
      setUserData(null);
      setError(null);
      return;
    }
    loadData();
  }, [authReady, isAuthenticated, loadData]);

  const needsData = authReady && isAuthenticated && !isAdminRoute;

  if (!needsData) {
    return <>{children}</>;
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Could not load data</Text>
        <Text style={styles.errorText}>
          Make sure the backend is running on port 3001.
        </Text>
      </View>
    );
  }

  if (!config || !userData) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const getListingById = (id: string) => listings.find((listing) => listing.id === id);

  return (
    <DataContext.Provider value={{ listings, config, userData, getListingById, refreshUserData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}

export type { ProfileMenuItem };

const styles = StyleSheet.create({
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

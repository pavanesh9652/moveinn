import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { AppState, Platform } from 'react-native';

import { clearToken, getToken } from '@/lib/auth';

type AuthContextValue = {
  isAuthenticated: boolean;
  ready: boolean;
  refresh: () => Promise<void>;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [ready, setReady] = useState(false);
  const signingOutRef = useRef(false);

  const refresh = useCallback(async () => {
    if (signingOutRef.current) return;
    const token = await getToken();
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    refresh().finally(() => setReady(true));
  }, [refresh]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void refresh();
      }
    });
    return () => subscription.remove();
  }, [refresh]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        void refresh();
      }
    };

    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [refresh]);

  const signIn = useCallback(async () => {
    await refresh();
  }, [refresh]);

  const signOut = useCallback(async () => {
    if (signingOutRef.current) return;
    signingOutRef.current = true;

    try {
      await clearToken();
      setIsAuthenticated(false);
    } finally {
      signingOutRef.current = false;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, ready, refresh, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

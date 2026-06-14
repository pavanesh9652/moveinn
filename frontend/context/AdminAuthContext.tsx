import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { adminLogin, adminLogout, getAdminToken, verifyAdminSession } from '@/lib/adminAuth';

type AdminAuthContextValue = {
  isAdmin: boolean;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const token = await getAdminToken();
    if (!token) {
      setIsAdmin(false);
      return;
    }
    setIsAdmin(await verifyAdminSession());
  }, []);

  useEffect(() => {
    refresh().finally(() => setReady(true));
  }, [refresh]);

  const signIn = useCallback(async (email: string, password: string) => {
    await adminLogin(email, password);
    setIsAdmin(true);
  }, []);

  const signOut = useCallback(async () => {
    await adminLogout();
    setIsAdmin(false);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAdmin, ready, signIn, signOut, refresh }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}

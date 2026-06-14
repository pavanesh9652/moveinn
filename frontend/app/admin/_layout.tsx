import { Stack } from 'expo-router';

import { AdminRouteGuard } from '@/components/admin/AdminRouteGuard';
import { AdminAuthProvider } from '@/context/AdminAuthContext';

export default function AdminLayout() {
  return (
    <AdminAuthProvider>
      <AdminRouteGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboard" />
        </Stack>
      </AdminRouteGuard>
    </AdminAuthProvider>
  );
}

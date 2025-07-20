import { Stack } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { UserRole } from '../../src/utils/auth';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function AdminLayout() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      // Check if user has admin or librarian role
      if (user.role !== UserRole.ADMIN && user.role !== UserRole.LIBRARIAN) {
        router.replace('/');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="analytics/index" options={{ headerShown: false }} />
      <Stack.Screen name="books/index" options={{ headerShown: false }} />
      <Stack.Screen name="books/new" options={{ headerShown: false }} />
      <Stack.Screen name="submissions/index" options={{ headerShown: false }} />
      <Stack.Screen name="users/index" options={{ headerShown: false }} />
    </Stack>
  );
}
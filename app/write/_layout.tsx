import { Stack } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function WriteLayout() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/(auth)/sign-in');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="new" />
      <Stack.Screen name="chapter/[id]" />
      <Stack.Screen name="project/[id]" />
    </Stack>
  );
}
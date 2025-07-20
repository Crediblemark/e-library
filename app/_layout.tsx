import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { Platform } from "react-native";
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '../src/lib/auth';
import { AuthProvider, useAuth as useAppAuth } from "../src/context/AuthContext";
import { UserRole } from "../src/utils/auth";
import { AppWrapper } from "../src/components/AppWrapper";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user, isLoading } = useAppAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded || isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const isAdminRoute = segments[0] === "admin";

    if (!isSignedIn && !inAuthGroup) {
      // User is not signed in and not in auth group, redirect to sign-in
      router.replace("/(auth)/sign-in");
    } else if (isSignedIn && inAuthGroup) {
      // User is signed in but in auth group, redirect to home
      router.replace("/");
    } else if (
      isSignedIn &&
      user &&
      isAdminRoute &&
      user.role !== UserRole.ADMIN &&
      user.role !== UserRole.LIBRARIAN
    ) {
      // User trying to access admin routes without proper permissions
      router.replace("/");
    }
  }, [isSignedIn, isLoaded, user, isLoading, segments, router]);

  return (
    <AppWrapper>
      <Stack
        screenOptions={({ route }) => ({
          headerShown: !route.name.startsWith("tempobook"),
        })}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="book/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="read/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="my-books" options={{ headerShown: false }} />
        <Stack.Screen name="achievements" options={{ headerShown: false }} />
        <Stack.Screen name="write" options={{ headerShown: false }} />
      </Stack>
    </AppWrapper>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });



  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error(
      'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
    );
  }

  // Clerk options for development
const clerkOptions = {
  tokenCache,
  // Disable CAPTCHA for development
  __unstable_disableCaptcha: __DEV__,
};

  return (
      <ClerkProvider publishableKey={publishableKey} {...clerkOptions}>
      <AuthProvider>
        <ThemeProvider value={DefaultTheme}>
          <RootLayoutNav />
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}

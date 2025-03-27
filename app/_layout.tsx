import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";
import { Platform } from "react-native";
import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { UserRole } from "../src/utils/auth";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const isAdminRoute = segments[0] === "admin";

    // If not logged in and not on login screen, redirect to login
    if (!user && !inAuthGroup && segments[0] !== "login") {
      router.replace("/login");
    }

    // If logged in and on login screen, redirect to home
    if (user && segments[0] === "login") {
      router.replace("/");
    }

    // If trying to access admin routes without proper permissions
    if (
      user &&
      isAdminRoute &&
      user.role !== UserRole.ADMIN &&
      user.role !== UserRole.LIBRARIAN
    ) {
      router.replace("/");
    }
  }, [user, segments, isLoading, router]);

  return (
    <Stack
      screenOptions={({ route }) => ({
        headerShown: !route.name.startsWith("tempobook"),
      })}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="book/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="read/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="admin"
        options={{
          headerShown: false,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="admin/books"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="admin/users"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (process.env.EXPO_PUBLIC_TEMPO && Platform.OS === "web") {
      const { TempoDevtools } = require("tempo-devtools");
      TempoDevtools.init();
    }
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={DefaultTheme}>
        <RootLayoutNav />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}

import "../global.css";
import { Stack, useRouter, useSegments } from "expo-router";
import { useTheme } from "@/src/context/ThemeContext";
import { ThemeProvider } from "@/src/context/ThemeContext";
import { AuthProvider, useAuth } from "@/src/context/AuthProvider";
import { View, Text } from "react-native";
import { useEffect } from "react";

function AppLayout() {
  const { user, loading } = useAuth();
  const { isDarkMode } = useTheme();
  const router = useRouter();
  const segments = useSegments();

  const colorScheme = isDarkMode ? "dark" : "light";

  // Sjekker om brukeren er logget inn og sender dem til riktig side
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // Send til login hvis man ikke er logget inn
      router.replace("/(auth)");
    } else if (user && inAuthGroup) {
      // Send til hovedsiden hvis man allerede er logget inn, replace hindrer at man kan gå tilbake
      router.replace("/(tabs)");
    }
  }, [user, loading, segments]);

  // Viser en enkel lasteskjerm mens vi venter på svar fra Firebase
  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-screen-light dark:bg-screen-dark">
        <Text className="text-text-light dark:text-text-dark">
          Laster inn bruker...
        </Text>
      </View>
    );

  return (
    /* Pakker inn hele appen i en View som styrer mørkt/lyst tema.
       Dette gjør at 'dark:'-klasser i Tailwind fungerer overalt. */
    <View style={{ flex: 1 }} className={colorScheme}>
      <Stack initialRouteName="(auth)" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        {/* Mappe for detaljsider og redigering av skader */}
        <Stack.Screen name="injury" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppLayout />
      </ThemeProvider>
    </AuthProvider>
  );
}

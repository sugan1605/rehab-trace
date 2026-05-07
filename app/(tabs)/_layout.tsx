import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/context/ThemeContext";

export default function TabsLayout() {
  const { isDarkMode } = useTheme();

  // console.log("sjekker fargematch mot tailwind.config...") //sjekker om temabytte aktiveres
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        // oppdaterer farger så de matcher tailwind.config nøyaktig, primary.500 er #0097A7 i configen min
        tabBarActiveTintColor: "#00ACC1",

        // bruker muted farger fra config for inaktive ikoner
        tabBarInactiveTintColor: isDarkMode ? "#94a3b8" : "#455A64",

        // bruker screen.light og screen.dark som bakgrunn

        tabBarStyle: {
          backgroundColor: isDarkMode ? "#012022" : "#E0F2F1",
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 10,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },

        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "help-circle";

          // navigerer fra oversikt og ny skaderegistrering 

          if (route.name === "index") {
            iconName = "home";
          } else if (route.name === "new-entry") {
            iconName = "add-circle";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Oversikt" }} />
      <Tabs.Screen name="new-entry" options={{ title: "Ny Skade" }} />
    </Tabs>
  );
}

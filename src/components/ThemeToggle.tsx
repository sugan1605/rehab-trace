import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/context/ThemeContext";

export function ThemeToggle() {
  // bruker de samme overflatene (surface) som resten av appen, for å holde stilen konsistent i både lyst og mørkt modus
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      className="w-12 h-12 items-center justify-center rounded-2xl bg-surface-light dark:bg-surface-dark shadow-cardShadow active:opacity-70"
    >
      <Ionicons
        // Bytter ikon og farge dynamisk på tema-status. Viser sola når det er mørkt, (for å bytte til lyst) og omvendt.
        name={isDarkMode ? "sunny" : "moon"}
        size={24}
        color={isDarkMode ? "#FFA000" : "#009747"}
      />
    </TouchableOpacity>
  );
}

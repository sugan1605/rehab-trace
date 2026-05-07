import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "nativewind";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {

  // henter ut funksjonalitet fra NativeWind for å styre fargetemaet i appen
  const { colorScheme, setColorScheme } = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === "dark");

  // funksjon som veksler mellom lyst og mørkt tema og oppdaterer tilstanden globalt
  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    setColorScheme(nextTheme);
  };

  // holder den lokale isDark-tilstanden synkronisert hvis systeminnstillingene på mobilen endres
  useEffect(() => {
    setIsDark(colorScheme === "dark");
  }, [colorScheme]);

  return (
    <ThemeContext.Provider value={{ isDarkMode: isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// custom hook som gjør det enkelt å sjekke om vi er i mørkt modus inne i andre komponenter
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
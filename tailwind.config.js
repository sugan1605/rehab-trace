/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#E0F7FA",
          100: "#B2EBF2",
          200: "#80DEEA",
          300: "#26C6DA",
          400: "#00ACC1",
          500: "#0097A7",
          600: "#00838F",
          700: "#006064",
          800: "#006064",
          900: "#013B3E",
        },
        ghost: {
          light: "rgba(0, 0, 0, 0.50)",
          dark: "rgba(255, 255, 255, 0.1)",
        },
        screen: {
          light: "#E0F2F1",
          dark: "#012022",
        },
        surface: {
          light: "#FFFFFF",
          dark: "#023033",
          soft: "#F0F9FA",
        },
        "text-light": "#1A373A",
        "text-light-muted": "#455A64",
        "text-dark": "#F8FAFC",
        "text-dark-muted": "#94A3B8",
        success: "#2E7D32",
        danger: "#D32F2F",
        warning: "#FFA000",
      },
      borderRadius: {
        xl: "18px",
        "2xl": "24px",
      },
      boxShadow: {
        glow: "0 0 24px rgba(0, 104, 119, 0.15)",
        cardShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  presets: [require("nativewind/preset")],
  plugins: [],
};
import type { Config } from "tailwindcss";
import { theme } from "./src/styles/theme";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize,
      colors: theme.colors,
      spacing: theme.spacing,
      borderRadius: theme.effects.borderRadius,
      boxShadow: theme.effects.boxShadow,
      backgroundImage: theme.effects.backgroundImage,
      keyframes: theme.animations.keyframes,
      animation: theme.animations.animation,
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
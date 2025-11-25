// themeContext.tsx
import { createContext, useContext } from "react";

interface ThemeContextType {
  dark: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeContext.Provider");
  }
  return ctx;
}

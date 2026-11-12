import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { ThemeMode, ThemeContextValue } from "./types";

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  initialMode?: ThemeMode;
  children: React.ReactNode;
}

/**
 * Manages UI Kit theming (light, dark, or system preference).
 * Injects CSS variables and html dark class dynamically.
 *
 * @param props.initialMode Initial theme mode preference
 * @param props.children React component subtree
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  initialMode = "system",
  children,
}) => {
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const updateTheme = () => {
      if (mode === "system") {
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        setResolvedTheme(prefersDark ? "dark" : "light");
      } else {
        setResolvedTheme(mode);
      }
    };

    updateTheme();

    if (mode === "system" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => updateTheme();
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [mode]);

  const toggleTheme = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const value = useMemo(
    () => ({
      theme: resolvedTheme,
      mode,
      setMode,
      toggleTheme,
    }),
    [resolvedTheme, mode]
  );

  return (
    <ThemeContext.Provider value={value}>
      <div data-pulse-theme={resolvedTheme} className={resolvedTheme === "dark" ? "pulse-dark" : "pulse-light"}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access current theme state and theme switching dispatchers.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a <ThemeProvider>.");
  }
  return context;
}


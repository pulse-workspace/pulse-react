/**
 * Theme configuration types for UI Kit.
 */
export type ThemeMode = "light" | "dark" | "system";

export interface ThemeContextValue {
  theme: "light" | "dark";
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}


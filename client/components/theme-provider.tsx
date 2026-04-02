"use client";

import * as React from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: Theme;
  setTheme: (theme: Theme) => void;
};

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const THEME_STORAGE_KEY = "theme";

const isThemeValue = (value: string | null): value is Theme =>
  value === "light" || value === "dark";

const applyThemeClass = (theme: Theme) => {
  const rootElement = document.documentElement;
  rootElement.classList.toggle("dark", theme === "dark");
};

export function ThemeProvider({
  children,
  defaultTheme = "light",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);

  React.useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const nextTheme = isThemeValue(storedTheme) ? storedTheme : defaultTheme;
    setThemeState(nextTheme);
    applyThemeClass(nextTheme);
  }, [defaultTheme]);

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyThemeClass(nextTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme: theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}

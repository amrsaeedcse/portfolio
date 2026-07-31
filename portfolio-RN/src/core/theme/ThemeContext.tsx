/// ThemeContext — provides semantic colors for the Dark Forge portfolio theme.
/// Rule 14: Colors MUST come from useAppTheme().colors.* — never raw hex in UI.
/// Rule: This is a static dark-only app — no light mode needed for a portfolio.

import React, { createContext, useContext } from 'react';

export interface AppColorsType {
  // Backgrounds
  surface: string;
  surfaceElevated: string;
  surfaceCard: string;
  glass: string;

  // Accent
  accent: string;
  accentDim: string;

  // Text
  primary: string;
  secondary: string;
  muted: string;
  textOnAccent: string;

  // Semantic palette
  blue: string;
  purple: string;
  green: string;
  amber: string;
  pink: string;

  // Borders
  border: string;
  borderMuted: string;
}

const darkTheme: AppColorsType = {
  surface: '#0a0a0f',
  surfaceElevated: '#0f0f18',
  surfaceCard: '#14141f',
  glass: 'rgba(15,15,24,0.75)',

  accent: '#00FFD1',
  accentDim: 'rgba(0,255,209,0.13)',

  primary: '#f4f4f5',
  secondary: '#9ca3af',
  muted: '#4b5563',
  textOnAccent: '#0a0a0f',

  blue: '#0ea5e9',
  purple: '#a855f7',
  green: '#10b981',
  amber: '#f59e0b',
  pink: '#ec4899',

  border: 'rgba(255,255,255,0.07)',
  borderMuted: 'rgba(255,255,255,0.04)',
};

interface AppThemeContextType {
  colors: AppColorsType;
}

const AppThemeContext = createContext<AppThemeContextType>({ colors: darkTheme });

/// Wraps the app root — must be applied once at the top level.
export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppThemeContext.Provider value={{ colors: darkTheme }}>
      {children}
    </AppThemeContext.Provider>
  );
}

/// Hook to access semantic theme colors anywhere in the component tree.
export function useAppTheme(): AppThemeContextType {
  return useContext(AppThemeContext);
}

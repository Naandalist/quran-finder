import React, { createContext, useContext, ReactNode } from 'react';
import { colors, Colors } from './colors';
import { spacing, Spacing } from './spacing';
import { typography } from './typography';
import { TextStyle } from 'react-native';

interface Theme {
  colors: Colors;
  spacing: Spacing;
  typography: Record<string, TextStyle>;
}

const theme: Theme = {
  colors,
  spacing,
  typography,
};

const ThemeContext = createContext<Theme>(theme);

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;

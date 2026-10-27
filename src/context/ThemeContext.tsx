import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, ThemeColors, AppearancePreference, ThemeMode } from '@/constants/theme';

const STORAGE_KEY = '@vehiclespot_appearance';

interface ThemeContextType {
  preference: AppearancePreference;
  themeMode: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  setPreference: (pref: AppearancePreference) => Promise<void>;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceColorScheme = useDeviceColorScheme();
  const [preference, setPreferenceState] = useState<AppearancePreference>('light');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadPreference() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved === 'light' || saved === 'dark' || saved === 'system') {
          setPreferenceState(saved);
        }
      } catch (err) {
        console.warn('Failed to load appearance preference', err);
      } finally {
        setIsReady(true);
      }
    }
    loadPreference();
  }, []);

  const setPreference = async (pref: AppearancePreference) => {
    setPreferenceState(pref);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, pref);
    } catch (err) {
      console.warn('Failed to save appearance preference', err);
    }
  };

  const resolvedMode: ThemeMode =
    preference === 'system'
      ? deviceColorScheme === 'dark'
        ? 'dark'
        : 'light'
      : preference;

  const colors = Colors[resolvedMode];
  const isDark = resolvedMode === 'dark';

  return (
    <ThemeContext.Provider
      value={{
        preference,
        themeMode: resolvedMode,
        colors,
        isDark,
        setPreference,
        isReady,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
}

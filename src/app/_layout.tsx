import React, { useEffect } from 'react';
import { Stack, DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useAppTheme } from '@/context/ThemeContext';
import { SavedProvider } from '@/context/SavedContext';
import { AuthProvider } from '@/context/AuthContext';
import { VehicleProvider } from '@/context/VehicleContext';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { isDark, isReady, colors } = useAppTheme();

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync().catch(console.warn);
    }
  }, [isReady]);

  const navTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          primary: colors.accent,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          primary: colors.accent,
        },
      };

  return (
    <NavThemeProvider value={navTheme}>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="appearance"
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
        <Stack.Screen
          name="vehicle/[id]"
          options={{
            headerShown: false,
            presentation: 'card',
          }}
        />
      </Stack>
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
      <AuthProvider><VehicleProvider><SavedProvider>
        <RootNavigator />
      </SavedProvider></VehicleProvider></AuthProvider>
    </ThemeProvider>
    </SafeAreaProvider>
  );
}
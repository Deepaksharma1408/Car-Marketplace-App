import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppTheme } from '@/context/ThemeContext';

export function useTheme() {
  const scheme = useColorScheme();
  try {
    const appTheme = useAppTheme();
    if (appTheme?.colors) {
      return appTheme.colors;
    }
  } catch {
    // Fallback if rendered outside ThemeProvider
  }
  const theme = scheme === 'unspecified' || !scheme ? 'light' : scheme;
  return Colors[theme === 'dark' ? 'dark' : 'light'];
}

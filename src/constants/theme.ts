import '@/global.css';
import { Platform } from 'react-native';

export const Colors = {
  "light": {
    "text": "#0F172A",
    "textSecondary": "#52657D",
    "textMuted": "#60738B",
    "background": "#F4F7FB",
    "surface": "#FFFFFF",
    "surfaceElevated": "#EDF3F9",
    "surfaceHighlight": "#E5EFF8",
    "border": "#D8E2EF",
    "borderSubtle": "#E5ECF5",
    "accent": "#0089C8",
    "accentLight": "#E6F4FB",
    "accentHover": "#0073AA",
    "action": "#0073AA",
    "link": "#0073AA",
    "onAccent": "#FFFFFF",
    "gold": "#C49B55",
    "goldText": "#80602B",
    "goldLight": "#FBF5E9",
    "verified": "#0089C8",
    "dealerBadge": "#C49B55",
    "danger": "#C73545",
    "success": "#18734A",
    "disabled": "#D8E2EF",
    "cardOverlay": "rgba(15,23,42,0.38)",
    "tabBarBackground": "#FFFFFF",
    "tabBarBorder": "#D8E2EF",
    "tabActive": "#0089C8",
    "tabInactive": "#52657D",
    "backgroundElement": "#EDF3F9",
    "backgroundSelected": "#E6F4FB"
  },
  "dark": {
    "text": "#F4F7FB",
    "textSecondary": "#B7C8DC",
    "textMuted": "#9DB1C9",
    "background": "#0F172A",
    "surface": "#172438",
    "surfaceElevated": "#203249",
    "surfaceHighlight": "#29415C",
    "border": "#354B66",
    "borderSubtle": "#293D55",
    "accent": "#0089C8",
    "accentLight": "#163B53",
    "accentHover": "#0073AA",
    "action": "#0073AA",
    "link": "#70CDF5",
    "onAccent": "#FFFFFF",
    "gold": "#C49B55",
    "goldText": "#E8C68A",
    "goldLight": "#3B3226",
    "verified": "#0089C8",
    "dealerBadge": "#C49B55",
    "danger": "#C73545",
    "success": "#18734A",
    "disabled": "#354B66",
    "cardOverlay": "rgba(15,23,42,0.38)",
    "tabBarBackground": "#172438",
    "tabBarBorder": "#354B66",
    "tabActive": "#0089C8",
    "tabInactive": "#B7C8DC",
    "backgroundElement": "#203249",
    "backgroundSelected": "#163B53"
  }
} as const;

export type ThemeMode = 'light' | 'dark';
export type AppearancePreference = 'light' | 'dark' | 'system';
export type ThemeColor = keyof typeof Colors.light;
export type ThemeColors = Record<ThemeColor, string>;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display, system-ui, -apple-system, sans-serif)',
    serif: 'var(--font-serif, Georgia, serif)',
    rounded: 'var(--font-rounded, system-ui)',
    mono: 'var(--font-mono, monospace)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  seven: 32,
  eight: 40,
  nine: 48,
} as const;

export const Radius = {
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/ThemeContext';
import { useSaved } from '@/context/SavedContext';
import type { ComponentProps } from 'react';
import { Tabs } from 'expo-router';
type BottomTabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const tabs = {
  index: { label: 'Discover', icon: 'compass-outline', active: 'compass' },
  search: { label: 'Search', icon: 'search-outline', active: 'search' },
  create: { label: 'Create', icon: 'add-circle-outline', active: 'add-circle' },
  saved: { label: 'Saved', icon: 'bookmark-outline', active: 'bookmark' },
  profile: { label: 'Profile', icon: 'person-outline', active: 'person' },
} as const;

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { savedIds } = useSaved();
  return (
    <View style={[styles.bar, { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: Math.max(insets.bottom, 8), paddingLeft: insets.left, paddingRight: insets.right }]}>
      <View style={styles.inner}>
        {state.routes.map((route, index) => {
          const tab = tabs[route.name as keyof typeof tabs];
          if (!tab) return null;
          const selected = index === state.index;
          const color = selected ? colors.accent : colors.textSecondary;
          return (
            <Pressable key={route.key} accessibilityRole="tab" accessibilityLabel={tab.label + ' tab'} accessibilityState={{ selected }}
              onPress={() => {
                const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!selected && !event.defaultPrevented) navigation.navigate(route.name, route.params);
              }}
              onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
              style={({ pressed }) => [styles.tab, { backgroundColor: pressed ? colors.accentLight : 'transparent' }]}>
              <View style={[styles.icon, { backgroundColor: selected ? colors.accentLight : 'transparent' }]}>
                <Ionicons name={selected ? tab.active : tab.icon} size={24} color={color} />
                {route.name === 'saved' && savedIds.length > 0 && <View style={[styles.badge, { backgroundColor: colors.accent }]}><Text style={[styles.count, { color: colors.onAccent }]}>{savedIds.length}</Text></View>}
              </View>
              <Text numberOfLines={1} style={[styles.label, { color: selected ? colors.link : colors.textSecondary, fontWeight: selected ? '700' : '500' }]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  bar: { borderTopWidth: 1, paddingTop: 8, shadowColor: '#0F172A', shadowOpacity: 0.04, shadowOffset: { width: 0, height: -2 }, shadowRadius: 10, elevation: 4 },
  inner: { width: '100%', maxWidth: 800, alignSelf: 'center', flexDirection: 'row', paddingHorizontal: 8 },
  tab: { flex: 1, minWidth: 0, minHeight: 56, alignItems: 'center', justifyContent: 'center', gap: 3, borderRadius: 12 },
  icon: { width: 48, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 11 },
  badge: { position: 'absolute', right: 0, top: -2, minWidth: 15, height: 15, borderRadius: 8, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  count: { fontSize: 9, fontWeight: '700' },
});

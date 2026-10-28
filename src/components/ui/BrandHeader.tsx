import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/ThemeContext';

export type DiscoverTab = 'all' | 'listings' | 'reels';

interface Props {
  activeTab: DiscoverTab;
  onSelectTab: (tab: DiscoverTab) => void;
  immersive?: boolean;
}

export function BrandHeader({ activeTab, onSelectTab, immersive = false }: Props) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  const tabs: { key: DiscoverTab; label: string }[] = [
    { key: 'reels', label: 'Reels' },
    { key: 'listings', label: 'For Sale' },
    { key: 'all', label: 'All Feed' },
  ];

  if (immersive) {
    return (
      <View style={[styles.immersiveHeader, { paddingTop: insets.top + 8 }]}>
        <View style={styles.brandRow}>
          <View style={styles.brandTitleWrap}>
            <Text style={styles.brandTitle}>
              VehicleSpot<Text style={{ color: colors.gold }}>.</Text>
            </Text>
            <Text style={styles.brandSubtitle}>DUBAI</Text>
          </View>
        </View>

        <View style={styles.immersiveTabs}>
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => onSelectTab(tab.key)}
                accessibilityRole="tab"
                accessibilityLabel={`${tab.label} feed`}
                accessibilityState={{ selected: isSelected }}
                style={({ pressed }) => [
                  styles.immersiveTabBtn,
                  {
                    backgroundColor: isSelected
                      ? colors.action
                      : pressed
                      ? 'rgba(255,255,255,0.25)'
                      : 'rgba(15, 23, 42, 0.45)',
                    borderColor: isSelected ? colors.accent : 'rgba(255,255,255,0.18)',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.immersiveTabText,
                    {
                      color: isSelected ? colors.onAccent : '#FFFFFF',
                      fontWeight: isSelected ? '800' : '600',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={() => router.push('/(tabs)/search')}
          accessibilityRole="button"
          accessibilityLabel="Open vehicle search"
          style={({ pressed }) => [
            styles.immersiveSearchBtn,
            { backgroundColor: pressed ? 'rgba(0,137,200,0.5)' : 'rgba(15, 23, 42, 0.45)' },
          ]}
        >
          <Ionicons name="search" size={20} color="#FFFFFF" />
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        paddingTop: insets.top,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderSubtle,
      }}
    >
      <View style={styles.inner}>
        <View style={styles.row}>
          <View style={[styles.mark, { backgroundColor: colors.accent }]}>
            <Ionicons name="car-sport" size={22} color={colors.onAccent} />
          </View>
          <View style={styles.brand}>
            <Text style={[styles.title, { color: colors.text }]}>
              VehicleSpot<Text style={{ color: colors.gold }}>.</Text>
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              DUBAI · EXCEPTIONAL DRIVES
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/(tabs)/search')}
            accessibilityLabel="Search vehicles"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.searchBtn,
              { backgroundColor: pressed ? colors.border : colors.accentLight },
            ]}
          >
            <Ionicons name="search" size={20} color={colors.link} />
          </Pressable>
        </View>

        <View style={styles.tabsRow}>
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => onSelectTab(tab.key)}
                accessibilityRole="tab"
                accessibilityLabel={`${tab.label} feed`}
                accessibilityState={{ selected: isSelected }}
                style={({ pressed }) => [
                  styles.tabBtn,
                  {
                    backgroundColor: isSelected
                      ? pressed
                        ? colors.accentHover
                        : colors.action
                      : pressed
                      ? colors.surfaceElevated
                      : colors.surfaceElevated,
                    borderColor: isSelected ? colors.accent : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    {
                      color: isSelected ? colors.onAccent : colors.text,
                      fontWeight: isSelected ? '800' : '600',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  immersiveHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 25,
    elevation: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitleWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.4,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 3,
  },
  brandSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  immersiveTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  immersiveTabBtn: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  immersiveTabText: {
    fontSize: 12,
  },
  immersiveSearchBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inner: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    padding: 16,
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mark: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginTop: 2,
  },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    minHeight: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  tabBtnText: {
    fontSize: 13,
  },
});

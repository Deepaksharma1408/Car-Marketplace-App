import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/ThemeContext';

export function BrandHeader({ immersive = false }: { immersive?: boolean }) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  return <View style={[immersive ? styles.immersiveHeader : { backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12 }, { paddingTop: insets.top + 8 }]}>
    <View><Text style={[styles.brandTitle, { color: immersive ? '#FFFFFF' : colors.text }]}>VehicleSpot<Text style={{ color: colors.gold }}>.</Text></Text>
      <Text style={{ color: immersive ? '#FFFFFF' : colors.textSecondary, fontSize: 10, letterSpacing: 2 }}>DUBAI · EXCEPTIONAL DRIVES</Text></View>
    <Pressable accessibilityRole="button" accessibilityLabel="Search vehicles" onPress={() => router.push('/(tabs)/search')} style={({ pressed }) => ({ padding: 12, borderRadius: 24, backgroundColor: pressed ? colors.accentHover : immersive ? 'rgba(15,23,42,0.5)' : colors.accentLight })}>
      <Ionicons name="search" size={22} color={immersive ? '#FFFFFF' : colors.link} />
    </Pressable>
  </View>;
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

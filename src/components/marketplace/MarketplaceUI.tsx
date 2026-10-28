import React, { type PropsWithChildren } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname, useIsFocused } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/ThemeContext';
import { Seller, Vehicle } from '@/types';

export function MarketplacePage({ title, children, showBack = true, scrollKey }: PropsWithChildren<{ title: string; showBack?: boolean; scrollKey?: string | number }>) {
  const { colors, isDark } = useAppTheme();
  const focused = useIsFocused();
  const insets = useSafeAreaInsets();
  return <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top, paddingLeft: insets.left, paddingRight: insets.right }}>
    {focused && <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />}
    <View style={[marketStyles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      {showBack && <Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={marketStyles.back}>
        <Ionicons name="arrow-back" size={24} color={colors.link} />
      </Pressable>}<Text style={[marketStyles.heading, { color: colors.text, flex: 1 }]}>{title}</Text>
    </View>
    <ScrollView key={scrollKey} keyboardShouldPersistTaps="handled" contentContainerStyle={[marketStyles.content, { paddingBottom: insets.bottom + 24 }]}>{children}</ScrollView>
  </View>;
}

export function SellerIdentity({ seller }: { seller: Seller }) {
  const { colors } = useAppTheme();
  const currentPath = usePathname();
  const isCurrentSeller = currentPath === `/seller/${seller.id}`;
  return <Pressable disabled={isCurrentSeller} accessibilityRole={isCurrentSeller ? undefined : "button"} accessibilityLabel={isCurrentSeller ? seller.name : `Open seller profile for ${seller.name}`} onPress={() => router.navigate({ pathname: '/seller/[id]', params: { id: seller.id } })} style={marketStyles.identity}>
    <Image source={{ uri: seller.avatar }} style={marketStyles.avatar} contentFit="cover" />
    <View style={{ flex: 1, gap: 3 }}><Text style={{ color: colors.text, fontWeight: '700' }}>{seller.name} {seller.verified ? '✓' : ''}</Text>
      <Text style={{ color: colors.link }}>@{seller.handle}</Text><Text style={{ color: colors.textSecondary }}>{seller.location}</Text></View>
    {!isCurrentSeller && <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />}
  </Pressable>;
}

export function MarketButton({ label, onPress, disabled = false }: { label: string; onPress: () => void; disabled?: boolean }) {
  const { colors } = useAppTheme();
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [marketStyles.button, { backgroundColor: disabled ? colors.disabled : pressed ? colors.accentHover : colors.action }]}>
    <Text style={{ color: colors.onAccent, fontWeight: '700', textAlign: 'center' }}>{label}</Text>
  </Pressable>;
}

export function MarketplaceCard({ vehicle }: { vehicle: Vehicle }) {
  const { colors } = useAppTheme();
  const forSale = vehicle.listingType === 'listing';
  return <View style={[marketStyles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
    <Pressable accessibilityRole="button" accessibilityLabel={`View details of ${vehicle.title}`} onPress={() => router.push({ pathname: '/vehicle/[id]', params: { id: vehicle.id } })}>
      <Image source={vehicle.posterAsset || { uri: vehicle.mediaUrls[0] }} style={marketStyles.carImage} contentFit="cover" />
      <View style={{ padding: 16, gap: 8 }}>
        <Text style={{ color: colors.link, fontSize: 11, fontWeight: '700' }}>{vehicle.localPost ? (forSale ? 'FOR SALE · LOCAL LISTING' : 'LOCAL VEHICLE VIDEO') : forSale ? 'FOR SALE · SAMPLE LISTING' : 'REEL · SAMPLE CONTENT'}</Text>
        <Text style={[marketStyles.heading, { color: colors.text }]}>{vehicle.title}</Text>
        {forSale && vehicle.priceAED != null && <Text style={{ color: colors.link, fontSize: 22, fontWeight: '800' }}>AED {vehicle.priceAED.toLocaleString()}</Text>}
        <Text style={{ color: colors.textSecondary }}>{vehicle.year} · {vehicle.mileageKm != null ? `${vehicle.mileageKm.toLocaleString()} km · ` : ''}{vehicle.specs.regionalSpecs}</Text>
        <Text style={{ color: colors.textSecondary }}>{vehicle.location}</Text>
      </View>
    </Pressable>
    <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 14 }}><SellerIdentity seller={vehicle.seller} />
      <MarketButton label="Contact Seller" onPress={() => router.push({ pathname: '/contact/[id]', params: { id: vehicle.id } })} />
    </View>
  </View>;
}

export const marketStyles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8, borderBottomWidth: 1 },
  back: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 19, fontWeight: '800' },
  content: { width: '100%', maxWidth: 720, alignSelf: 'center', padding: 16, gap: 16 },
  card: { borderWidth: 1, borderRadius: 20, overflow: 'hidden' },
  carImage: { width: '100%', aspectRatio: 1.7 },
  identity: { flexDirection: 'row', gap: 12, alignItems: 'center', minHeight: 60 },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  button: { minHeight: 48, padding: 14, borderRadius: 12, justifyContent: 'center' },
});

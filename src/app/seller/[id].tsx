import React from 'react';
import { Text, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
import { useVehicles } from '@/context/VehicleContext';
import { MarketplacePage, MarketplaceCard, SellerIdentity, MarketButton, marketStyles } from '@/components/marketplace/MarketplaceUI';

export default function SellerProfile() {
  const { vehicles: MOCK_VEHICLES } = useVehicles();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useAppTheme();
  const vehicles = MOCK_VEHICLES.filter(v => v.seller.id === id);
  const seller = vehicles[0]?.seller;
  if (!seller) return <MarketplacePage title="Seller profile"><Text style={{ color: colors.text }}>Seller not found.</Text></MarketplacePage>;
  const listings = vehicles.filter(v => v.listingType === 'listing');
  return <MarketplacePage title="Seller profile">
    <View style={[marketStyles.card, { padding: 18, gap: 16, backgroundColor: colors.surface, borderColor: colors.border }]}>
      <SellerIdentity seller={seller} />
      <Text style={{ color: colors.textSecondary }}>{seller.dealershipName || (seller.type === 'creator' ? 'Car enthusiast and content creator' : 'Independent car seller')}</Text>
      <Text style={{ color: colors.textSecondary }}>{seller.verified ? 'Verified profile' : 'Private seller'} · {listings.length} cars for sale · {vehicles.length - listings.length} reels</Text>
      <Text style={{ color: colors.textSecondary }}>{vehicles.some(v => v.localPost) ? 'Local seller profile. Posts are saved on this device.' : 'Sample profile for the VehicleSpot prototype. Contact the seller to ask about the car, viewing and availability.'}</Text>
      <MarketButton label="Contact Seller" onPress={() => router.push({ pathname: '/contact/[id]', params: { id: vehicles[0].id } })} />
    </View>
    <Text style={[marketStyles.heading, { color: colors.text }]}>Cars & reels</Text>
    {vehicles.map(v => <MarketplaceCard key={v.id} vehicle={v} />)}
  </MarketplacePage>;
}

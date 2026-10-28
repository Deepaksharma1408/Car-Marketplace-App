import React, { useMemo, useState } from 'react';
import { FlatList, StatusBar, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
import { useVehicles } from '@/context/VehicleContext';
import { MarketplaceCard, marketStyles } from '@/components/marketplace/MarketplaceUI';

export default function ListingsScreen() {
  const { vehicles: MOCK_VEHICLES } = useVehicles();
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const focused = useIsFocused();
  const [query, setQuery] = useState('');
  const cars = useMemo(() => MOCK_VEHICLES.filter(v => v.listingType === 'listing' && `${v.title} ${v.seller.name} ${v.location}`.toLowerCase().includes(query.trim().toLowerCase())), [query, MOCK_VEHICLES]);
  return <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top, paddingLeft: insets.left, paddingRight: insets.right }}>
    {focused && <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />}
    <FlatList data={cars} keyExtractor={v => v.id} keyboardShouldPersistTaps="handled" initialNumToRender={3} maxToRenderPerBatch={3} windowSize={5}
      contentContainerStyle={marketStyles.content}
      ListHeaderComponent={<View style={{ gap: 10 }}><Text style={[marketStyles.heading, { color: colors.text, fontSize: 26 }]}>Car Listings</Text>
        <Text style={{ color: colors.textSecondary }}>Find your next car from Dubai dealers and private sellers.</Text>
        <TextInput value={query} onChangeText={setQuery} accessibilityLabel="Search car listings" placeholder="Search cars, sellers or location" placeholderTextColor={colors.textMuted} style={{ color: colors.text, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 14, minHeight: 48 }} />
        <Text style={{ color: colors.textSecondary }}>{cars.length} cars for sale · sample & local listings</Text></View>}
      renderItem={({ item }) => <MarketplaceCard vehicle={item} />}
      ListEmptyComponent={<Text style={{ color: colors.textSecondary, paddingVertical: 32 }}>No cars match your search. Try another model, seller or location.</Text>} />
  </View>;
}

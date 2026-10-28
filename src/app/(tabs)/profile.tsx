import React, { useState } from 'react';
import { FlatList, StatusBar, Text, View } from 'react-native';
import { router, useIsFocused } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useVehicles } from '@/context/VehicleContext';
import { useSaved } from '@/context/SavedContext';
import { useAppTheme } from '@/context/ThemeContext';
import { MarketButton, MarketplaceCard, marketStyles } from '@/components/marketplace/MarketplaceUI';

export default function ProfileScreen() {
  const { user, ready, signOut } = useAuth();
  const { vehicles } = useVehicles();
  const { savedIds } = useSaved();
  const { colors, isDark, preference } = useAppTheme();
  const focused = useIsFocused();
  const insets = useSafeAreaInsets();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const mine = user ? vehicles.filter(v => v.localPost && v.seller.id === user.id) : [];
  async function logout() {
    setBusy(true); setError('');
    try { await signOut(); } catch { setError('Could not log out. Please try again.'); }
    finally { setBusy(false); }
  }
  return <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top, paddingLeft: insets.left, paddingRight: insets.right }}>
    {focused && <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />}
    <FlatList data={mine} keyExtractor={v => v.id} contentContainerStyle={marketStyles.content} initialNumToRender={3}
      ListHeaderComponent={<View style={{ gap: 16 }}>
        <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800' }}>{user ? user.name : 'Your Profile'}</Text>
        <Text style={{ color: colors.textSecondary }}>{user ? `${user.email} · local demo session` : 'Log in to create listings and post vehicle videos.'}</Text>
        {!ready ? <Text style={{ color: colors.textSecondary }}>Loading session…</Text> : user ? <MarketButton label={busy ? 'Logging out…' : 'Log out'} disabled={busy} onPress={() => { void logout(); }} /> : <MarketButton label="Log in" onPress={() => router.push('/login')} />}
        {!!error && <Text accessibilityRole="alert" style={{ color: colors.danger }}>{error}</Text>}
        <View style={[marketStyles.card, { backgroundColor: colors.surface, borderColor: colors.border, padding: 18, gap: 10 }]}>
          <Text style={{ color: colors.text }}>{savedIds.length} saved cars · {mine.length} local posts</Text>
          <MarketButton label="Open Saved Collection" onPress={() => router.push('/(tabs)/saved')} />
          <MarketButton label={`Appearance · ${preference}`} onPress={() => router.push('/appearance')} />
          <MarketButton label="Create a listing or video" onPress={() => router.push('/(tabs)/create')} />
        </View>
        <Text style={[marketStyles.heading, { color: colors.text }]}>Your listings & videos</Text>
      </View>}
      ListEmptyComponent={<Text style={{ color: colors.textSecondary, paddingVertical: 20 }}>{user ? 'Your published local listings and videos will appear here.' : 'Log in to view your posts on this device.'}</Text>}
      renderItem={({ item }) => <MarketplaceCard vehicle={item} />} />
  </View>;
}

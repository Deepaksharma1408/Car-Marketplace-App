import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useAppTheme } from '@/context/ThemeContext';
import { MarketplacePage, MarketButton, marketStyles } from '@/components/marketplace/MarketplaceUI';
import { CREATION_TITLES, type CreationMode } from '@/lib/creation';

export default function CreateScreen() {
  const { colors } = useAppTheme();
  const { user } = useAuth();
  const [social, setSocial] = useState(false);
  const descriptions = { ready: 'Choose a finished video, add your car details and price, then review your listing.', raw: 'Choose 3–6 clips, arrange them and select a visual template for sequential playback.', photos: 'Choose up to 12 photos for a static gallery. No slideshow or video is generated.', post: 'Share a vehicle video with a caption and specifications, without a selling price.' };
  function start(mode: CreationMode) {
    if (!user) router.push({ pathname: '/login', params: { next: mode } });
    else router.push({ pathname: '/publish/[mode]', params: { mode } });
  }
  return <MarketplacePage title="VehicleSpot Studio" showBack={false}>
    <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800' }}>Create & Publish</Text>
    <Text style={{ color: colors.textSecondary }}>Create listings and vehicle videos on this device. {user ? `Logged in as ${user.name}.` : 'Log in to the demo to get started.'}</Text>
    <View style={{ flexDirection: 'row', gap: 8 }}>{[false, true].map(value => <Pressable key={String(value)} accessibilityRole="tab" accessibilityState={{ selected: social === value }} onPress={() => setSocial(value)} style={{ flex: 1, borderRadius: 12, padding: 14, backgroundColor: social === value ? colors.action : colors.surface }}><Text style={{ color: social === value ? colors.onAccent : colors.text, textAlign: 'center', fontWeight: '700' }}>{value ? 'Post Vehicle Video' : 'Sell a Vehicle'}</Text></Pressable>)}</View>
    {(social ? ['post'] : ['ready', 'raw', 'photos']).map(value => { const mode = value as CreationMode; return <View key={mode} style={[marketStyles.card, { padding: 18, gap: 14, backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[marketStyles.heading, { color: colors.text }]}>{CREATION_TITLES[mode]}</Text><Text style={{ color: colors.textSecondary, lineHeight: 22 }}>{descriptions[mode]}</Text>
      <Text style={{ color: colors.textSecondary }}>{mode === 'photos' ? '1–12 photos · manually browsed gallery' : mode === 'raw' ? '3–6 clips · up to 60 seconds total · 720p/1080p' : 'One video · up to 60 seconds · 720p/1080p'}</Text>
      <MarketButton label={`Start ${CREATION_TITLES[mode]}`} onPress={() => start(mode)} />
    </View>; })}
  </MarketplacePage>;
}

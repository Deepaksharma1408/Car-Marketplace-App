import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useAppTheme } from '@/context/ThemeContext';
import { FormField } from '@/components/ui/FormField';
import { MarketplacePage, MarketButton } from '@/components/marketplace/MarketplaceUI';

export default function LoginScreen() {
  const { signIn, user, ready } = useAuth();
  const { next } = useLocalSearchParams<{ next?: string }>();
  const { colors } = useAppTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function login(useSample = false) {
    setBusy(true); setError('');
    try {
      await signIn(useSample ? 'Demo Seller' : name, useSample ? 'demo@vehiclespot.local' : email);
      const allowed = ['ready', 'raw', 'photos', 'post'];
      if (next && allowed.includes(next)) router.replace({ pathname: '/publish/[mode]', params: { mode: next } });
      else router.replace('/(tabs)/profile');
    } catch (e) { setError(e instanceof Error ? e.message : 'Login could not be saved. Please retry.'); }
    finally { setBusy(false); }
  }
  return <MarketplacePage title="Log in">
    <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800' }}>Welcome to VehicleSpot</Text>
    <Text style={{ color: colors.textSecondary, lineHeight: 22 }}>Local demo login. Your name and email create a session on this device only. No password is collected and no real account is verified.</Text>
    {user ? <><Text style={{ color: colors.text }}>You are logged in as {user.name}.</Text><MarketButton label="Go to Profile" onPress={() => router.replace('/(tabs)/profile')} /></> : <>
      <FormField label="Name" value={name} onChangeText={setName} autoComplete="name" maxLength={60} placeholder="Your name" />
      <FormField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" maxLength={120} placeholder="you@example.com" />
      {!!error && <Text accessibilityRole="alert" style={{ color: colors.danger }}>{error}</Text>}
      <View><MarketButton label={busy ? 'Logging in…' : 'Log in to demo'} disabled={!ready || busy || !name.trim() || !email.trim()} onPress={() => { void login(); }} /></View>
      <MarketButton label="Use sample demo account" disabled={!ready || busy} onPress={() => { void login(true); }} />
    </>}
  </MarketplacePage>;
}

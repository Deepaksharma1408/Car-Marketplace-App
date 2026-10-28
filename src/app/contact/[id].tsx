import React, { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, StatusBar, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/ThemeContext';
import { MOCK_VEHICLES } from '@/data/mockVehicles';
import { MarketButton, SellerIdentity, marketStyles } from '@/components/marketplace/MarketplaceUI';

type Message = { id: string; text: string; from: 'me' | 'seller' };

export default function ContactRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const vehicle = MOCK_VEHICLES.find(v => v.id === id);
  const { colors } = useAppTheme();
  if (!vehicle) return <View style={{ flex: 1, padding: 32, backgroundColor: colors.background }}><Text style={{ color: colors.text }}>Car not found.</Text><MarketButton label="Back" onPress={() => router.back()} /></View>;
  return <SellerContact key={vehicle.id} vehicleId={vehicle.id} />;
}

function SellerContact({ vehicleId }: { vehicleId: string }) {
  const vehicle = MOCK_VEHICLES.find(v => v.id === vehicleId)!;
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [sending, setSending] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [storageError, setStorageError] = useState('');
  const list = useRef<FlatList<Message>>(null);
  const key = `@vehiclespot_demo_chat:${vehicle.seller.id}:${vehicle.id}`;

  useEffect(() => {
    let current = true;
    async function load() {
      try {
        const raw = await AsyncStorage.getItem(key);
        const stored: unknown = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(stored) || !stored.every(m => m && typeof m.id === 'string' && typeof m.text === 'string' && (m.from === 'me' || m.from === 'seller'))) throw new Error('Invalid conversation');
        if (current) setMessages(stored);
      } catch {
        if (current) setStorageError('Saved chat could not be loaded. You can start a new demo conversation.');
      } finally {
        if (current) setLoaded(true);
      }
    }
    void load();
    return () => { current = false; };
  }, [key]);

  async function send() {
    const text = draft.trim();
    if (!text || !loaded || sending) return;
    setSending(true);
    const next: Message[] = [...messages,
      { id: `${Date.now()}-me`, text, from: 'me' },
      { id: `${Date.now()}-demo`, text: `Demo reply: Thanks for your interest in the ${vehicle.make} ${vehicle.model}. In the live app, ${vehicle.seller.name} would reply here about availability, condition and viewing.`, from: 'seller' },
    ];
    setMessages(next);
    setDraft('');
    try {
      await AsyncStorage.setItem(key, JSON.stringify(next));
      setStorageError('');
    } catch {
      setStorageError('Chat is visible now, but could not be saved on this device.');
    } finally {
      setSending(false);
    }
  }

  return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top, paddingLeft: insets.left, paddingRight: insets.right }}>
    <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
    <View style={[marketStyles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Back" style={marketStyles.back}><Ionicons name="arrow-back" size={24} color={colors.link} /></Pressable>
      <View style={{ flex: 1 }}><Text style={[marketStyles.heading, { color: colors.text }]}>Contact Seller</Text><Text style={{ color: colors.textSecondary }}>{vehicle.seller.name}</Text></View>
    </View>
    <FlatList ref={list} data={messages} keyExtractor={m => m.id} keyboardShouldPersistTaps="handled" contentContainerStyle={marketStyles.content}
      onContentSizeChange={() => { if (messages.length) list.current?.scrollToEnd({ animated: true }); }}
      ListHeaderComponent={<View style={{ gap: 14 }}>
        <View style={[marketStyles.card, { padding: 16, backgroundColor: colors.surface, borderColor: colors.border, gap: 12 }]}>
          <SellerIdentity seller={vehicle.seller} />
          <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/vehicle/[id]', params: { id: vehicle.id } })}><Text style={{ color: colors.link, fontWeight: '700' }}>{vehicle.title} ›</Text></Pressable>
          <Text style={{ color: colors.textSecondary }}>{vehicle.listingType === 'listing' ? `For sale · AED ${vehicle.priceAED?.toLocaleString()}` : 'Reel enquiry · sale availability has not been confirmed'}</Text>
          <Text style={{ color: colors.textSecondary }}>Location: {vehicle.seller.location}</Text>
          <MarketButton label={showPhone ? 'Sample phone: +971 50 000 0000' : 'Show contact number'} onPress={() => setShowPhone(true)} />
          {showPhone && <Text style={{ color: colors.textSecondary }}>Dummy contact number for this prototype. No call is placed.</Text>}
        </View>
        <View style={{ backgroundColor: colors.goldLight, padding: 14, borderRadius: 12, gap: 5 }}><Text style={{ color: colors.goldText, fontWeight: '700' }}>Demo seller chat</Text><Text style={{ color: colors.textSecondary }}>Messages stay on this device. Replies are simulated; no seller is contacted.</Text></View>
        <Text style={{ color: colors.textSecondary }}>{loaded ? messages.length ? 'Conversation' : 'Start a conversation about the car.' : 'Loading conversation…'}</Text>
        {!messages.length && <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{['Is it available?', 'Can I arrange a viewing?'].map(text => <Pressable key={text} onPress={() => setDraft(text)} accessibilityRole="button" style={{ backgroundColor: colors.accentLight, borderRadius: 20, padding: 12 }}><Text style={{ color: colors.link }}>{text}</Text></Pressable>)}</View>}
      </View>}
      renderItem={({ item }) => <View style={{ alignSelf: item.from === 'me' ? 'flex-end' : 'flex-start', maxWidth: '88%', padding: 14, borderRadius: 16, gap: 5, backgroundColor: item.from === 'me' ? colors.action : colors.surface }}>
        <Text style={{ color: item.from === 'me' ? colors.onAccent : colors.textSecondary, fontSize: 11 }}>{item.from === 'me' ? 'You' : `${vehicle.seller.name} · simulated reply`}</Text>
        <Text style={{ color: item.from === 'me' ? colors.onAccent : colors.text, lineHeight: 21 }}>{item.text}</Text>
      </View>} />
    {!!storageError && <Text accessibilityRole="alert" style={{ color: colors.danger, padding: 12 }}>{storageError}</Text>}
    <View style={{ padding: 12, paddingBottom: Math.max(insets.bottom, 12), backgroundColor: colors.surface, borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', alignItems: 'flex-end', gap: 10 }}>
      <TextInput value={draft} onChangeText={setDraft} maxLength={1000} multiline accessibilityLabel="Message seller" placeholder="Message seller (demo)…" placeholderTextColor={colors.textMuted} style={{ flex: 1, minHeight: 48, maxHeight: 120, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 12, color: colors.text }} />
      <MarketButton label={sending ? 'Saving…' : 'Send'} disabled={!loaded || sending || !draft.trim()} onPress={() => { void send(); }} />
    </View>
  </KeyboardAvoidingView>;
}

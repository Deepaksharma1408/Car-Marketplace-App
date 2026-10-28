import React, { useEffect, useRef, useState } from 'react';
import { AppState, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router, useIsFocused, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth, type DemoUser } from '@/context/AuthContext';
import { useVehicles } from '@/context/VehicleContext';
import { useAppTheme } from '@/context/ThemeContext';
import { FormField } from '@/components/ui/FormField';
import { MarketplacePage, MarketButton, marketStyles } from '@/components/marketplace/MarketplaceUI';
import { VideoSequence } from '@/components/discover/VideoSequence';
import { CREATION_TITLES, EMPTY_FORM, TEMPLATES, validateDetails, validateMedia, type CreationMode, type MediaItem, type VehicleForm } from '@/lib/creation';
import type { Vehicle } from '@/types';

export default function PublishRoute() {
  const { mode } = useLocalSearchParams<{ mode: string }>();
  const { user, ready } = useAuth();
  const { colors } = useAppTheme();
  if (!Object.hasOwn(CREATION_TITLES, mode)) return <MarketplacePage title="Create"><Text style={{ color: colors.text }}>Choose a creation path from the Create tab.</Text><MarketButton label="Go to Create" onPress={() => router.replace('/(tabs)/create')} /></MarketplacePage>;
  if (!ready) return <MarketplacePage title="Create"><Text style={{ color: colors.text }}>Loading session…</Text></MarketplacePage>;
  if (!user) return <MarketplacePage title={CREATION_TITLES[mode as CreationMode]}><Text style={{ color: colors.text }}>Log in to the demo to create a listing. Your existing saved draft stays on this device.</Text><MarketButton label="Log in" onPress={() => router.replace({ pathname: '/login', params: { next: mode } })} /></MarketplacePage>;
  return <CreationForm key={`${user.id}:${mode}`} user={user} mode={mode as CreationMode} />;
}

function CreationForm({ user, mode }: { user: DemoUser; mode: CreationMode }) {
  const { colors } = useAppTheme();
  const { publish, ready: postsReady } = useVehicles();
  const focused = useIsFocused();
  const [appActive, setAppActive] = useState(AppState.currentState === 'active');
  const [step, setStep] = useState(0);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [cover, setCover] = useState<MediaItem | null>(null);
  const [form, setForm] = useState<VehicleForm>({ ...EMPTY_FORM });
  const [template, setTemplate] = useState('monaco');
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [publishedId, setPublishedId] = useState('');
  const [previewPhoto, setPreviewPhoto] = useState(0);
  const operation = useRef(false);
  const draftKey = `@vehiclespot_draft:${user.id}:${mode}`;
  const photoOnly = mode === 'photos';
  const forSale = mode !== 'post';
  const steps = ['Media', 'Car details', mode === 'raw' ? 'Template' : 'Presentation', 'Review'];

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => setAppActive(state === 'active'));
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    let mounted = true;
    async function restore() {
      try {
        const raw = await AsyncStorage.getItem(draftKey);
        if (raw && mounted) {
          const draft = JSON.parse(raw);
          if (!draft || !Array.isArray(draft.media) || !draft.form || !Object.keys(EMPTY_FORM).every(k => typeof draft.form[k] === 'string') || !draft.media.every((m: MediaItem) => m && typeof m.uri === 'string' && ['image', 'video'].includes(m.type))) throw new Error('Invalid draft');
          setForm(draft.form); setMedia(draft.media); setCover(draft.cover?.uri ? draft.cover : null);
          setTemplate(TEMPLATES.some(t => t.id === draft.template) ? draft.template : 'monaco');
          setNotice('Your saved draft was restored.');
        }
      } catch { if (mounted) setError('The saved draft could not be loaded. You can create a new one.'); }
      finally { if (mounted) setLoaded(true); }
    }
    void restore();
    return () => { mounted = false; };
  }, [draftKey]);

  async function saveDraft() {
    await AsyncStorage.setItem(draftKey, JSON.stringify({ form, media, cover, template }));
  }

  async function pick(isCover = false) {
    if (operation.current) return;
    operation.current = true; setBusy(true); setError(''); setNotice('');
    try {
      const images = photoOnly || isCover;
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: images ? ['images'] : ['videos'], allowsMultipleSelection: !isCover && (photoOnly || mode === 'raw'), selectionLimit: isCover ? 1 : photoOnly ? 12 : mode === 'raw' ? 6 : 1, orderedSelection: true, quality: 0.85 });
      if (result.canceled) return;
      const picked: MediaItem[] = result.assets.map(a => ({ uri: a.uri, type: a.type === 'video' ? 'video' : 'image', name: a.fileName || (a.type === 'video' ? 'Video clip' : 'Photo'), duration: a.duration || 0, width: a.width, height: a.height, size: a.fileSize || 0 }));
      const issues = isCover ? [] : validateMedia(mode, picked);
      if (issues.length) { setError(issues.join('\n')); return; }
      if (Platform.OS === 'web' || !FileSystem.documentDirectory) throw new Error('Use the Android or iOS app to save picked media on the device.');
      const folder = `${FileSystem.documentDirectory}vehiclespot-media/${Date.now()}-${Math.random().toString(36).slice(2)}/`;
      await FileSystem.makeDirectoryAsync(folder, { intermediates: true });
      const saved: MediaItem[] = [];
      try {
        for (const [index, item] of picked.entries()) {
          const ext = /\.(jpg|jpeg|png|webp|heic|heif|mp4|mov|m4v)$/i.exec(item.uri.split('?')[0])?.[1] || (item.type === 'video' ? 'mp4' : 'jpg');
          const uri = `${folder}${index}.${ext}`;
          await FileSystem.copyAsync({ from: item.uri, to: uri });
          saved.push({ ...item, uri });
        }
      } catch (e) {
        await FileSystem.deleteAsync(folder, { idempotent: true }).catch(() => undefined);
        throw e;
      }
      if (isCover) setCover(saved[0]); else { setMedia(saved); setPreviewPhoto(0); }
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not select media. Please try again.'); }
    finally { operation.current = false; setBusy(false); }
  }

  function mediaErrors() { return [...validateMedia(mode, media), ...(!photoOnly && !cover ? ['Choose a cover photo for your listing card.'] : [])]; }
  async function next() {
    const issues = step === 0 ? mediaErrors() : step === 1 ? validateDetails(mode, form) : [];
    if (issues.length) { setError(issues.join('\n')); return; }
    setError(''); setBusy(true);
    try { await saveDraft(); setStep(s => Math.min(s + 1, 3)); setNotice(''); }
    catch { setError('The draft could not be saved. Please try again.'); }
    finally { setBusy(false); }
  }

  function makeVehicle(id: string): Vehicle {
    return {
      id, localPost: true, title: form.title.trim(), make: form.make.trim(), model: form.model.trim(), year: Number(form.year),
      priceAED: forSale ? Number(form.price) : undefined, mileageKm: forSale ? Number(form.mileage) : undefined,
      location: form.location.trim(), listingType: forSale ? 'listing' : 'social', mediaType: photoOnly ? 'photo' : 'video',
      mediaUrls: photoOnly ? media.map(m => m.uri) : [cover?.uri || ''],
      posterAsset: cover ? { uri: cover.uri } : photoOnly ? { uri: media[0]?.uri } : require('../../../assets/images/icon.png'),
      videoAsset: photoOnly ? undefined : { uri: media[0]?.uri }, clipUris: mode === 'raw' ? media.map(m => m.uri) : undefined,
      templateName: mode === 'raw' ? template : undefined,
      videoDuration: photoOnly ? undefined : `${Math.floor(media.reduce((s, m) => s + m.duration, 0) / 1000)}s`,
      description: form.description.trim(), tags: [forSale ? 'For Sale' : 'Vehicle Video'], likesCount: 0, commentsCount: 0, sharesCount: 0,
      seller: { id: user.id, name: user.name, handle: user.email.split('@')[0], avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80', type: 'private_seller', verified: false, location: form.location.trim() },
      specs: { engine: 'Not specified', transmission: 'Not specified', horsepower: form.horsepower.trim() ? `${form.horsepower.trim()} HP` : 'Not specified', acceleration: 'Not specified', fuelType: 'Not specified', exteriorColor: 'Not specified', interiorColor: 'Not specified', regionalSpecs: 'Seller supplied', warranty: 'Ask the seller' }, createdAt: 'Just now',
    };
  }

  async function publishPost() {
    if (operation.current) return;
    const issues = [...mediaErrors(), ...validateDetails(mode, form)];
    if (issues.length) { setError(issues.join('\n')); return; }
    operation.current = true; setBusy(true); setError('');
    try {
      for (const item of [...media, ...(cover ? [cover] : [])]) {
        const info = await FileSystem.getInfoAsync(item.uri);
        if (!info.exists) throw new Error('A selected file is no longer available. Return to Media and choose it again.');
      }
      const id = `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      await publish(makeVehicle(id));
      await AsyncStorage.removeItem(draftKey).catch(() => undefined);
      setPublishedId(id);
    } catch (e) { setError(e instanceof Error ? e.message : 'Publishing failed. Your draft is still available.'); }
    finally { operation.current = false; setBusy(false); }
  }

  if (publishedId) return <MarketplacePage title="Published on this device">
    <Text style={{ color: colors.text, fontSize: 26, fontWeight: '800' }}>{forSale ? 'Your listing is ready' : 'Your vehicle video is ready'}</Text>
    <Text style={{ color: colors.textSecondary, lineHeight: 22 }}>Saved locally for this prototype. It appears in your Profile{forSale ? ' and Car Listings' : ' and Discover'}. Nothing has been uploaded to a public marketplace.</Text>
    <MarketButton label="View car details" onPress={() => router.replace({ pathname: '/vehicle/[id]', params: { id: publishedId } })} />
    <MarketButton label={photoOnly ? 'Open Car Listings' : 'Open Discover'} onPress={() => router.replace(photoOnly ? '/(tabs)/listings' : '/')} />
    <MarketButton label="Your Profile" onPress={() => router.replace('/(tabs)/profile')} />
  </MarketplacePage>;

  return <MarketplacePage title={CREATION_TITLES[mode]} scrollKey={step}>
    <Text style={{ color: colors.link, fontWeight: '700' }}>STEP {step + 1} OF 4 · {steps[step]}</Text>
    <Text style={{ color: colors.textSecondary }}>Local publishing · {user.name}</Text>
    {!loaded ? <Text style={{ color: colors.text }}>Loading draft…</Text> : <>
      {step === 0 && <>
        <Text style={[marketStyles.heading, { color: colors.text }]}>{photoOnly ? 'Choose your car photos' : mode === 'raw' ? 'Choose 3–6 raw clips' : 'Choose your finished video'}</Text>
        <Text style={{ color: colors.textSecondary }}>{photoOnly ? 'Photos remain a manually controlled gallery.' : 'Up to 60 seconds total. Use 720p or 1080p clips. Portrait videos work best.'}</Text>
        <MarketButton label={busy ? 'Selecting…' : media.length ? 'Replace selected media' : photoOnly ? 'Choose photos' : 'Choose video clips'} disabled={busy} onPress={() => { void pick(); }} />
        {media.map((item, index) => <View key={item.uri} style={[marketStyles.card, { padding: 12, backgroundColor: colors.surface, borderColor: colors.border, gap: 8 }]}>
          {photoOnly && <Image source={{ uri: item.uri }} style={{ height: 130, borderRadius: 10 }} contentFit="cover" />}
          <Text style={{ color: colors.text }}>{index + 1}. {item.name}{item.type === 'video' ? ` · ${(item.duration / 1000).toFixed(1)}s` : ''}</Text>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            {index > 0 && <Pressable accessibilityRole="button" accessibilityLabel={`Move item ${index + 1} earlier`} onPress={() => setMedia(prev => { const next = [...prev]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; return next; })} style={{ padding: 10 }}><Text style={{ color: colors.link }}>Move up</Text></Pressable>}
            <Pressable accessibilityRole="button" onPress={() => setMedia(prev => prev.filter((_, i) => i !== index))} style={{ padding: 10 }}><Text style={{ color: colors.danger }}>Remove</Text></Pressable>
          </View>
        </View>)}
        {!photoOnly && <><Text style={{ color: colors.text, fontWeight: '700' }}>Cover photo · required</Text>{cover && <Image source={{ uri: cover.uri }} style={{ height: 180, borderRadius: 12 }} contentFit="cover" />}<MarketButton label={cover ? 'Change cover photo' : 'Choose cover photo'} disabled={busy} onPress={() => { void pick(true); }} /></>}
      </>}
      {step === 1 && <>
        <MarketButton label="Fill sample car details" disabled={busy} onPress={() => {
          setForm({ title: 'Demo Toyota 86 Coupe', make: 'Toyota', model: '86 Coupe', year: '2023', price: forSale ? '75000' : '', mileage: forSale ? '12000' : '', location: 'Dubai Marina, Dubai', description: 'Sample Toyota 86 with service history, clean interior and a carefully maintained exterior. Local demo listing for review.', horsepower: '205' });
          setError('');
        }} />
        <FormField label="Car title" value={form.title} onChangeText={title => setForm(f => ({ ...f, title }))} maxLength={120} placeholder="2024 Porsche 911 GT3 RS" />
        <FormField label="Make" value={form.make} onChangeText={make => setForm(f => ({ ...f, make }))} maxLength={40} />
        <FormField label="Model" value={form.model} onChangeText={model => setForm(f => ({ ...f, model }))} maxLength={60} />
        <FormField label="Model year" value={form.year} onChangeText={year => setForm(f => ({ ...f, year }))} keyboardType="number-pad" maxLength={4} />
        {forSale && <><FormField label="Price (AED)" value={form.price} onChangeText={price => setForm(f => ({ ...f, price }))} keyboardType="decimal-pad" maxLength={12} /><FormField label="Mileage (km)" value={form.mileage} onChangeText={mileage => setForm(f => ({ ...f, mileage }))} keyboardType="number-pad" maxLength={8} /></>}
        <FormField label="Location" value={form.location} onChangeText={location => setForm(f => ({ ...f, location }))} maxLength={100} />
        <FormField label="Horsepower (optional)" value={form.horsepower} onChangeText={horsepower => setForm(f => ({ ...f, horsepower }))} keyboardType="number-pad" maxLength={4} />
        <FormField label={forSale ? 'Car description' : 'Video caption'} value={form.description} onChangeText={description => setForm(f => ({ ...f, description }))} multiline maxLength={2000} />
      </>}
      {step === 2 && (mode === 'raw' ? <>
        <Text style={[marketStyles.heading, { color: colors.text }]}>Choose a template</Text>
        <Text style={{ color: colors.textSecondary }}>Your ordered video clips play consecutively with the selected specification overlay. This preview does not render or export a combined MP4.</Text>
        {TEMPLATES.map(t => <Pressable key={t.id} accessibilityRole="radio" accessibilityState={{ checked: template === t.id }} onPress={() => setTemplate(t.id)} style={{ backgroundColor: colors.surface, borderWidth: 2, borderColor: template === t.id ? colors.accent : colors.border, borderRadius: 16, padding: 18, gap: 10 }}><Text style={{ color: colors.text, fontWeight: '800' }}>{t.name}{template === t.id ? ' ✓' : ''}</Text><Text style={{ color: colors.textSecondary }}>{t.description}</Text></Pressable>)}
      </> : <><Text style={[marketStyles.heading, { color: colors.text }]}>{photoOnly ? 'Static photo gallery' : 'Your video stays intact'}</Text><Text style={{ color: colors.textSecondary, lineHeight: 23 }}>{photoOnly ? 'The first photo is your listing cover. Buyers swipe the photos themselves. We do not animate them or convert them into a video.' : 'Your finished video plays as selected. The app does not claim to normalize audio, generate transitions or render a new video.'}</Text><Text style={{ color: colors.text }}>{forSale ? 'Your price is shown only on the sale listing.' : 'This is a vehicle video, not an offer for sale. No price is shown.'}</Text></>)}
      {step === 3 && <>
        <View style={{ height: 300, borderRadius: 18, overflow: 'hidden', backgroundColor: colors.surfaceElevated }}>
          {photoOnly ? <Image source={{ uri: media[previewPhoto % media.length]?.uri }} style={{ width: '100%', height: '100%' }} contentFit="contain" /> : <VideoSequence vehicle={makeVehicle('preview')} isActive={true} isScreenFocused={focused} isAppActive={appActive} isMuted={true} onToggleMute={() => undefined} />}
        </View>
        {photoOnly && <ScrollView horizontal showsHorizontalScrollIndicator={false}>{media.map((item, index) => <Pressable key={item.uri} accessibilityRole="button" accessibilityLabel={`Preview photo ${index + 1}`} onPress={() => setPreviewPhoto(index)} style={{ marginRight: 8, borderWidth: 2, borderColor: index === previewPhoto ? colors.accent : colors.border, borderRadius: 10, overflow: 'hidden' }}><Image source={{ uri: item.uri }} style={{ width: 72, height: 64 }} contentFit="cover" /></Pressable>)}</ScrollView>}
        <Text style={[marketStyles.heading, { color: colors.text }]}>{form.title}</Text>
        <Text style={{ color: colors.link, fontWeight: '800' }}>{forSale ? `AED ${Number(form.price).toLocaleString()}` : 'Vehicle video · not a sale listing'}</Text>
        <Text style={{ color: colors.textSecondary }}>{form.year} · {form.make} {form.model} · {form.location}</Text>
        <Text style={{ color: colors.text, lineHeight: 22 }}>{form.description}</Text>
        <Text style={{ color: colors.textSecondary }}>Published by {user.name}. This prototype saves your post on this device only.</Text>
      </>}
      {!!error && <Text accessibilityRole="alert" style={{ color: colors.danger, lineHeight: 22 }}>{error}</Text>}
      {!!notice && <Text style={{ color: colors.link }}>{notice}</Text>}
      {step < 3 ? <MarketButton label="Continue" disabled={busy} onPress={() => { void next(); }} /> : <MarketButton label={busy ? 'Publishing…' : 'Publish on this device'} disabled={busy || !postsReady || Platform.OS === 'web'} onPress={() => { void publishPost(); }} />}
      {step > 0 && <MarketButton label="Previous step" disabled={busy} onPress={() => { setError(''); setStep(s => s - 1); }} />}
      <MarketButton label="Save draft" disabled={busy} onPress={() => { setBusy(true); void saveDraft().then(() => { setNotice('Draft saved on this device.'); setError(''); }).catch(() => setError('Draft could not be saved. Please retry.')).finally(() => setBusy(false)); }} />
    </>}
  </MarketplacePage>;
}

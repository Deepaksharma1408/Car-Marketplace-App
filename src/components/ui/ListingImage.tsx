import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image, type ImageProps } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/context/ThemeContext';

/** Keeps loading and unavailable-photo states legible on every listing surface. */
export function ListingImage({ style, source, onOpen, label, ...props }: ImageProps & { onOpen?: () => void; label?: string }) {
  const { colors } = useAppTheme();
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  return <View style={[{ overflow: 'hidden', backgroundColor: colors.surfaceElevated }, style]}>
    <Image {...props} key={attempt} source={source} style={StyleSheet.absoluteFill}
      onLoadStart={() => setStatus('loading')} onLoad={() => setStatus('ready')} onError={() => setStatus('error')} />
    {status === 'ready' && onOpen && <Pressable style={StyleSheet.absoluteFill} onPress={onOpen} accessibilityRole="button" accessibilityLabel={label || 'View vehicle'} />}
    {status === 'loading' && <View style={styles.state}><ActivityIndicator color={colors.accent} accessibilityLabel="Loading vehicle photo" /></View>}
    {status === 'error' && <Pressable accessibilityRole="button" accessibilityLabel="Photo unavailable. Retry photo" onPress={() => { setStatus('loading'); setAttempt(attempt + 1); }} style={[styles.state, { backgroundColor: colors.surfaceElevated }]}>
      <Ionicons name="image-outline" size={28} color={colors.textSecondary} />
      <Text style={[styles.label, { color: colors.link }]}>Retry photo</Text>
    </Pressable>}
  </View>;
}
const styles = StyleSheet.create({
  state: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', gap: 8 },
  label: { fontSize: 12, fontWeight: '600' },
});

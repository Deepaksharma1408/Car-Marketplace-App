import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/context/ThemeContext';
import { BrandButton } from './BrandButton';

export function useBrandDialog() {
  const { colors } = useAppTheme();
  const [notice, setNotice] = useState<{ title: string; message: string; label: string } | null>(null);
  const close = () => setNotice(null);
  return {
    showDialog: (title: string, message: string, buttons?: { text: string; style?: string }[]) => setNotice({ title, message, label: buttons?.[0]?.text || 'Close' }),
    dialog: <Modal visible={!!notice} transparent animationType="fade" onRequestClose={close}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={close} accessibilityLabel="Dismiss dialog" />
        <View accessibilityViewIsModal style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="information-circle-outline" size={32} color={colors.accent} />
          <Text accessibilityRole="header" style={[styles.title, { color: colors.text }]}>{notice?.title}</Text>
          <ScrollView><Text style={[styles.message, { color: colors.textSecondary }]}>{notice?.message}</Text></ScrollView>
          <BrandButton label={notice?.label || 'Close'} onPress={close} />
        </View>
      </View>
    </Modal>,
  };
}
const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(15,23,42,0.38)', padding: 24, justifyContent: 'center', alignItems: 'center' },
  card: { width: '100%', maxWidth: 480, maxHeight: '85%', borderRadius: 24, borderWidth: 1, padding: 24, gap: 18 },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
  message: { fontSize: 15, lineHeight: 24 },
});

import { ActivityIndicator, Pressable, StyleSheet, Text, type PressableProps } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
type Props = Omit<PressableProps, 'children'> & { label: string; loading?: boolean; variant?: 'primary' | 'secondary' };
export function BrandButton({ label, loading, disabled, variant = 'primary', style, ...props }: Props) {
  const { colors } = useAppTheme();
  const inactive = disabled || loading;
  return (
    <Pressable {...props} accessibilityRole="button" accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive} style={(state) => [styles.button, {
        backgroundColor: inactive ? colors.disabled : variant === 'secondary' ? colors.accentLight : state.pressed ? colors.accentHover : colors.accent,
        borderColor: variant === 'secondary' ? colors.border : 'transparent',
      }, typeof style === 'function' ? style(state) : style]}>
      {loading && <ActivityIndicator color={colors.onAccent} />}
      <Text style={[styles.label, { color: inactive ? colors.textSecondary : variant === 'secondary' ? colors.link : colors.onAccent }]}>{label}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: { minHeight: 48, borderRadius: 14, paddingHorizontal: 20, paddingVertical: 12, borderWidth: 1, flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 19, fontWeight: '700', textAlign: 'center' },
});

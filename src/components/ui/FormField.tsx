import React from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';

export function FormField({ label, ...props }: TextInputProps & { label: string }) {
  const { colors } = useAppTheme();
  return <View style={{ gap: 7 }}><Text style={{ color: colors.text, fontWeight: '700' }}>{label}</Text>
    <TextInput {...props} accessibilityLabel={label} placeholderTextColor={colors.textMuted} style={{ minHeight: props.multiline ? 100 : 50, textAlignVertical: props.multiline ? 'top' : 'center', padding: 14, borderWidth: 1, borderColor: colors.border, borderRadius: 12, color: colors.text, backgroundColor: colors.surface }} />
  </View>;
}

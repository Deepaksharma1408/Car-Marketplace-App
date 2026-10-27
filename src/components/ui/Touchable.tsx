import { useState } from 'react';
import { TouchableOpacity as NativeTouchable, StyleSheet, type TouchableOpacityProps } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';

/** Shared press and disabled feedback without changing existing action handlers. */
export function TouchableOpacity({ style, disabled, onPressIn, onPressOut, ...props }: TouchableOpacityProps) {
  const { colors } = useAppTheme();
  const [pressed, setPressed] = useState(false);
  const flatStyle = StyleSheet.flatten(style);
  const primary = flatStyle?.backgroundColor === colors.accent || flatStyle?.backgroundColor === colors.action;
  return <NativeTouchable {...props} disabled={disabled} activeOpacity={0.75}
    accessibilityState={{ ...props.accessibilityState, disabled: !!disabled }}
    onPressIn={(event) => { setPressed(true); onPressIn?.(event); }}
    onPressOut={(event) => { setPressed(false); onPressOut?.(event); }}
    style={[style, primary && pressed && { backgroundColor: colors.accentHover }, disabled && { opacity: 0.5 }]} />;
}

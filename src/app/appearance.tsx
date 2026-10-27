import { TouchableOpacity } from '@/components/ui/Touchable';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/ThemeContext';
import { AppearancePreference, Spacing, Radius } from '@/constants/theme';

export default function AppearanceScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark, preference, setPreference, themeMode } = useAppTheme();

  const options: {
    id: AppearancePreference;
    title: string;
    description: string;
    icon: any;
  }[] = [
    {
      id: 'system',
      title: 'System Default',
      description: 'Automatically adjust to your phone’s system appearance setting.',
      icon: 'phone-portrait-outline',
    },
    {
      id: 'light',
      title: 'Light Theme',
      description: 'Monaco blue, white surfaces and champagne gold details.',
      icon: 'sunny-outline',
    },
    {
      id: 'dark',
      title: 'Dark Theme',
      description: 'Midnight navy surfaces with Monaco blue and champagne gold details.',
      icon: 'moon-outline',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header with back button */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 8,
            borderBottomColor: colors.borderSubtle,
            backgroundColor: colors.surface,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.surfaceElevated }]}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Appearance</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 16) + 36, paddingLeft: Math.max(insets.left, Spacing.four), paddingRight: Math.max(insets.right, Spacing.four) }]}>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          Choose how VehicleSpot looks on your device. Changes apply instantly and are saved locally.
        </Text>

        <View style={styles.optionsWrap}>
          {options.map((opt) => {
            const isSelected = preference === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: isSelected ? colors.accent : colors.border,
                  },
                ]}
                activeOpacity={0.88}
                onPress={() => setPreference(opt.id)}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={opt.title}
              >
                <View style={styles.cardTopRow}>
                  <View
                    style={[
                      styles.iconCircle,
                      {
                        backgroundColor: isSelected ? colors.accentLight : colors.surfaceElevated,
                      },
                    ]}
                  >
                    <Ionicons
                      name={opt.icon}
                      size={22}
                      color={isSelected ? colors.accent : colors.text}
                    />
                  </View>

                  <View style={styles.radioIndicator}>
                    <View
                      style={[
                        styles.outerCircle,
                        { borderColor: isSelected ? colors.accent : colors.border },
                      ]}
                    >
                      {isSelected && (
                        <View style={[styles.innerCircle, { backgroundColor: colors.accent }]} />
                      )}
                    </View>
                  </View>
                </View>

                <Text style={[styles.cardTitle, { color: colors.text }]}>{opt.title}</Text>
                <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                  {opt.description}
                </Text>

                {/* Preview color swatch badge */}
                <View style={styles.swatchRow}>
                  {opt.id === 'light' ? (
                    <View style={styles.swatchWrap}>
                      <View style={[styles.swatch, { backgroundColor: '#F4F7FB' }]} />
                      <View style={[styles.swatch, { backgroundColor: '#FFFFFF' }]} />
                      <View style={[styles.swatch, { backgroundColor: '#0089C8' }]} />
                      <Text style={[styles.swatchLabel, { color: colors.textSecondary }]}>
                        Monaco / Blue & Gold
                      </Text>
                    </View>
                  ) : opt.id === 'dark' ? (
                    <View style={styles.swatchWrap}>
                      <View style={[styles.swatch, { backgroundColor: '#0F172A' }]} />
                      <View style={[styles.swatch, { backgroundColor: '#172438' }]} />
                      <View style={[styles.swatch, { backgroundColor: '#C49B55' }]} />
                      <Text style={[styles.swatchLabel, { color: colors.textSecondary }]}>
                        Midnight / Champagne
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.swatchWrap}>
                      <Ionicons name="sync-outline" size={14} color={colors.accent} />
                      <Text style={[styles.swatchLabel, { color: colors.textSecondary }]}>
                        Currently active: {themeMode === 'dark' ? 'Dark' : 'Light'}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Accessibility & Reduced Motion Info */}
        <View style={[styles.infoBox, { backgroundColor: colors.surfaceElevated, borderColor: colors.borderSubtle }]}>
          <Ionicons name="eye-outline" size={20} color={colors.accent} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              Accessibility & Visual Comfort
            </Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Clear text, distinct controls, and comfortable spacing help you browse vehicles in both light and dark environments.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  scrollContent: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    padding: Spacing.four,
    gap: Spacing.four,
  },
  sectionSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: Spacing.two,
  },
  optionsWrap: {
    gap: Spacing.four,
  },
  optionCard: {
    borderRadius: Radius.lg,
    padding: Spacing.four,
    borderWidth: 2,
    gap: Spacing.two,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.one,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioIndicator: {
    padding: 4,
  },
  outerCircle: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: Radius.full,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  swatchRow: {
    marginTop: Spacing.two,
    paddingTop: Spacing.two,
  },
  swatchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  swatch: {
    width: 16,
    height: 16,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  swatchLabel: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  infoBox: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.four,
    borderRadius: Radius.lg,
    borderWidth: 1,
    marginTop: Spacing.four,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
  },
});

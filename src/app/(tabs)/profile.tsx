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
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/ThemeContext';
import { useSaved } from '@/context/SavedContext';
import { Spacing, Radius } from '@/constants/theme';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark, preference, themeMode } = useAppTheme();
  const { savedIds, likedIds } = useSaved();

  const getPreferenceLabel = () => {
    if (preference === 'system') {
      return `System (${themeMode === 'dark' ? 'Dark' : 'Light'})`;
    }
    return preference === 'dark' ? 'Dark Mode' : 'Light Mode';
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top, 16) + 14, paddingBottom: 28 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrap}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
              }}
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={[styles.verifiedBadge, { backgroundColor: colors.verified }]}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>Rashid Al Nuaimi</Text>
            <Text style={[styles.userHandle, { color: colors.textSecondary }]}>@rashid_dxb</Text>
            <View style={styles.userLocation}>
              <Ionicons name="location-sharp" size={13} color={colors.accent} />
              <Text style={[styles.userLocationText, { color: colors.textSecondary }]}>
                Downtown Dubai, UAE
              </Text>
            </View>
          </View>
        </View>

        {/* Bio */}
        <Text style={[styles.bioText, { color: colors.text }]}>
          Automotive collector & enthusiast. Track days at Dubai Autodrome. Passionate about 911 GT3s and UAE dune adventures. 🇦🇪
        </Text>

        {/* Stats Row */}
        <View
          style={[
            styles.statsCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{savedIds.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Saved</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.borderSubtle }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>{likedIds.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Liked</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.borderSubtle }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>2</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Garage</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.borderSubtle }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text }]}>4</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Inquiries</Text>
          </View>
        </View>

        {/* Settings & Preferences Section */}
        <View style={styles.sectionWrap}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>PREFERENCES</Text>

          <View
            style={[
              styles.menuCard,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {/* Appearance Settings Row */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => router.push('/appearance')}
              accessibilityRole="button"
              accessibilityLabel="Appearance settings"
            >
              <View style={[styles.menuIconBox, { backgroundColor: colors.accentLight }]}>
                <Ionicons
                  name={themeMode === 'dark' ? 'moon-outline' : 'sunny-outline'}
                  size={20}
                  color={colors.accent}
                />
              </View>
              <View style={styles.menuTextWrap}>
                <Text style={[styles.menuTitle, { color: colors.text }]}>Appearance</Text>
                <Text style={[styles.menuSub, { color: colors.textSecondary }]}>
                  Light, Dark, and System modes
                </Text>
              </View>
              <View style={[styles.preferenceBadge, { backgroundColor: colors.surfaceElevated }]}>
                <Text style={[styles.preferenceBadgeText, { color: colors.link }]}>
                  {getPreferenceLabel()}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>

            <View style={[styles.itemDivider, { backgroundColor: colors.borderSubtle }]} />

            {/* Notifications Row */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {}}
              accessibilityRole="button"
              accessibilityLabel="Notifications"
            >
              <View style={[styles.menuIconBox, { backgroundColor: colors.surfaceElevated }]}>
                <Ionicons name="notifications-outline" size={20} color={colors.text} />
              </View>
              <View style={styles.menuTextWrap}>
                <Text style={[styles.menuTitle, { color: colors.text }]}>Notifications</Text>
                <Text style={[styles.menuSub, { color: colors.textSecondary }]}>
                  Price drops & new listings
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
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
  scrollContent: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.four,
    marginBottom: Spacing.four,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    flexShrink: 1,
    fontSize: 20,
    fontWeight: '800',
  },
  userHandle: {
    fontSize: 14,
    fontWeight: '500',
  },
  userLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  userLocationText: {
    fontSize: 12,
  },
  bioText: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: Spacing.five,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: Radius.lg,
    paddingVertical: Spacing.four,
    borderWidth: 1,
    marginBottom: Spacing.six,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
  },
  sectionWrap: {
    marginBottom: Spacing.six,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: Spacing.two,
  },
  menuCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextWrap: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  menuSub: {
    fontSize: 12,
    marginTop: 2,
  },
  preferenceBadge: {
    flexShrink: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
    marginRight: 4,
  },
  preferenceBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  itemDivider: {
    height: 1,
    marginLeft: 56,
  },
});

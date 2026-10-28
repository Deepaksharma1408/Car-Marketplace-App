import { ListingImage } from '@/components/ui/ListingImage';
import { TouchableOpacity } from '@/components/ui/Touchable';
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSaved } from '@/context/SavedContext';
import { useAppTheme } from '@/context/ThemeContext';
import { Spacing, Radius } from '@/constants/theme';

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();
  const { savedVehicles, toggleSave } = useSaved();

  const [filterType, setFilterType] = useState<'all' | 'listings' | 'reels'>('all');

  const filteredItems = useMemo(() => {
    if (filterType === 'listings') {
      return savedVehicles.filter((v) => v.listingType === 'listing');
    }
    if (filterType === 'reels') {
      return savedVehicles.filter((v) => v.listingType === 'social');
    }
    return savedVehicles;
  }, [savedVehicles, filterType]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, paddingTop: Math.max(insets.top, 16) + 12, borderBottomColor: colors.borderSubtle }]}>
        <View style={styles.titleRow}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Saved Collection</Text>
          <View style={[styles.counterBadge, { backgroundColor: colors.surfaceElevated }]}>
            <Text style={[styles.counterText, { color: colors.link }]}>
              {savedVehicles.length}
            </Text>
          </View>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterPill,
              {
                backgroundColor: filterType === 'all' ? colors.action : colors.surfaceElevated,
                borderColor: filterType === 'all' ? colors.accent : colors.border,
              },
            ]}
            onPress={() => setFilterType('all')}
          >
            <Text
              style={[
                styles.filterPillText,
                { color: filterType === 'all' ? colors.onAccent : colors.text },
              ]}
            >
              All Saved ({savedVehicles.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              {
                backgroundColor: filterType === 'listings' ? colors.action : colors.surfaceElevated,
                borderColor: filterType === 'listings' ? colors.accent : colors.border,
              },
            ]}
            onPress={() => setFilterType('listings')}
          >
            <Text
              style={[
                styles.filterPillText,
                { color: filterType === 'listings' ? colors.onAccent : colors.text },
              ]}
            >
              For Sale
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              {
                backgroundColor: filterType === 'reels' ? colors.action : colors.surfaceElevated,
                borderColor: filterType === 'reels' ? colors.accent : colors.border,
              },
            ]}
            onPress={() => setFilterType('reels')}
          >
            <Text
              style={[
                styles.filterPillText,
                { color: filterType === 'reels' ? colors.onAccent : colors.text },
              ]}
            >
              Reels
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Saved Vehicles List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: 28 },
        ]}
        renderItem={({ item }) => (
          <View
            style={[
              styles.savedCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <ListingImage source={item.posterAsset || { uri: item.mediaUrls[0] }} style={styles.cardThumb} contentFit="cover" onOpen={() => router.push(`/vehicle/${item.id}`)} label={`View ${item.title}`} />

            <View style={styles.cardDetails}>
              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.typeTag,
                    {
                      backgroundColor:
                        item.listingType === 'listing' ? colors.accentLight : 'rgba(0, 137, 200, 0.12)',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeTagText,
                      { color: item.listingType === 'listing' ? colors.accent : colors.verified },
                    ]}
                  >
                    {item.listingType === 'listing' ? 'FOR SALE' : 'REEL'}
                  </Text>
                </View>
                <Text style={[styles.locationText, { color: colors.textSecondary }]}>
                  {item.location.split(',')[0]}
                </Text>
              </View>

              <TouchableOpacity onPress={() => router.push(`/vehicle/${item.id}`)} accessibilityRole="button" accessibilityLabel={`Read details for ${item.title}`}><Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={2}>
                {item.title}
              </Text></TouchableOpacity>

              {item.listingType === 'listing' && item.priceAED ? (
                <Text style={[styles.priceText, { color: colors.link }]}>
                  AED {item.priceAED.toLocaleString()}
                </Text>
              ) : (
                <Text style={[styles.specsText, { color: colors.textSecondary }]}>
                  {item.specs.engine}
                </Text>
              )}

              <View style={styles.cardFooter}>
                <Text style={[styles.sellerText, { color: colors.textSecondary }]} numberOfLines={1}>
                  by {item.seller.name}
                </Text>

                <TouchableOpacity
                  style={[styles.unsaveBtn, { backgroundColor: colors.surfaceElevated }]}
                  onPress={() => toggleSave(item.id)}
                  accessibilityLabel="Remove from saved"
                  accessibilityRole="button"
                >
                  <Ionicons name="bookmark" size={16} color={colors.accent} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: colors.surfaceElevated }]}>
              <Ionicons name="bookmark-outline" size={40} color={colors.accent} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Saved Vehicles Yet</Text>
            <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
              Tap the bookmark icon on any vehicle reel or listing to save it here for quick access later.
            </Text>
            <TouchableOpacity
              style={[styles.exploreBtn, { backgroundColor: colors.action }]}
              onPress={() => router.push('/(tabs)' as any)}
              accessibilityLabel="Explore vehicles"
              accessibilityRole="button"
            >
              <Ionicons
                name="compass-outline"
                size={18}
                color={colors.onAccent}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.exploreBtnText, { color: colors.onAccent }]}>
                Discover Vehicles
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    borderBottomWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  counterBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  counterText: {
    fontSize: 12,
    fontWeight: '800',
  },
  filterRow: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    gap: Spacing.two,
  },
  filterPill: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    padding: Spacing.four,
    gap: Spacing.three,
  },
  savedCard: {
    flexDirection: 'row',
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardThumb: {
    width: '30%',
    minHeight: 160,
    height: '100%',
  },
  cardDetails: {
    minWidth: 0,
    gap: 6,
    flex: 1,
    padding: Spacing.three,
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexWrap: 'wrap',
    gap: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  typeTagText: {
    fontSize: 9,
    fontWeight: '800',
  },
  locationText: {
    fontSize: 11,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '900',
  },
  specsText: {
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sellerText: {
    flex: 1,
    fontSize: 11,
    maxWidth: 130,
  },
  unsaveBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.nine,
    paddingHorizontal: Spacing.six,
  },
  emptyIconCircle: {
    width: 76,
    height: 76,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.four,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: Spacing.two,
  },
  emptySub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.six,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.six,
    paddingVertical: 12,
    borderRadius: Radius.full,
  },
  exploreBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
});

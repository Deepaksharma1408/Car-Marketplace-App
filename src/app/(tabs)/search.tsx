import { ListingImage } from '@/components/ui/ListingImage';
import { TouchableOpacity } from '@/components/ui/Touchable';
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useVehicles } from '@/context/VehicleContext';
import { useAppTheme } from '@/context/ThemeContext';
import { useSaved } from '@/context/SavedContext';
import { SearchFilters } from '@/types';
import { FilterModal } from '@/components/search/FilterModal';
import { Spacing, Radius } from '@/constants/theme';

const CATEGORIES = ['All', 'Supercars', 'Luxury SUV', 'Off-Road', 'Electric', 'Under 500K'];

export default function SearchScreen() {
  const { vehicles: MOCK_VEHICLES } = useVehicles();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();
  const { isSaved, toggleSave } = useSaved();

  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'All',
    listingType: 'all',
    mediaType: 'all',
    priceRange: 'all',
    verifiedOnly: false,
  });

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.listingType !== 'all') count++;
    if (filters.mediaType !== 'all') count++;
    if (filters.priceRange !== 'all') count++;
    if (filters.verifiedOnly) count++;
    return count;
  }, [filters]);

  const filteredVehicles = useMemo(() => {
    return MOCK_VEHICLES.filter((item) => {
      // Text Query Match
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesMake = item.make.toLowerCase().includes(q);
        const matchesLocation = item.location.toLowerCase().includes(q);
        const matchesTag = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesMake && !matchesLocation && !matchesTag) {
          return false;
        }
      }

      // Category Pill Match
      if (selectedCategory !== 'All') {
        if (selectedCategory === 'Supercars') {
          if (!item.tags.includes('Supercar') && !item.tags.includes('Hypercar')) return false;
        } else if (selectedCategory === 'Luxury SUV') {
          if (!item.tags.includes('Luxury SUV') && !item.tags.includes('Super SUV')) return false;
        } else if (selectedCategory === 'Off-Road') {
          if (!item.tags.includes('Off-Road') && !item.tags.includes('Desert Run')) return false;
        } else if (selectedCategory === 'Electric') {
          if (!item.tags.includes('Electric') && !item.tags.includes('Hybrid')) return false;
        } else if (selectedCategory === 'Under 500K') {
          if (!item.priceAED || item.priceAED > 500000) return false;
        }
      }

      // Listing Type Filter
      if (filters.listingType !== 'all' && item.listingType !== filters.listingType) {
        return false;
      }

      // Media Type Filter
      if (filters.mediaType !== 'all' && item.mediaType !== filters.mediaType) {
        return false;
      }

      // Price Range Filter
      if (filters.priceRange !== 'all') {
        if (!item.priceAED) return false;
        if (filters.priceRange === 'under300k' && item.priceAED >= 300000) return false;
        if (filters.priceRange === '300k-700k' && (item.priceAED < 300000 || item.priceAED > 700000)) return false;
        if (filters.priceRange === '700k-1.5m' && (item.priceAED < 700000 || item.priceAED > 1500000)) return false;
        if (filters.priceRange === '1.5m-plus' && item.priceAED < 1500000) return false;
      }

      // Verified Only Filter
      if (filters.verifiedOnly && !item.seller.verified) {
        return false;
      }

      return true;
    });
  }, [query, selectedCategory, filters, MOCK_VEHICLES]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Top Search & Filter Bar */}
      <View style={[styles.topBar, { backgroundColor: colors.surface, paddingTop: insets.top + 8, borderBottomColor: colors.borderSubtle }]}>
        <View style={styles.searchRow}>
          <View
            style={[
              styles.inputWrap,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: searchFocused ? colors.accent : colors.border,
              },
            ]}
          >
            <Ionicons name="search" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              accessibilityLabel="Search vehicles"
              placeholder="Search Porsche, G63, Ferrari, Dubai..."
              placeholderTextColor={colors.textMuted}
              value={query}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              onChangeText={setQuery}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} style={{ padding: 4 }}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter button with badge */}
          <TouchableOpacity
            style={[
              styles.filterBtn,
              {
                backgroundColor: activeFiltersCount > 0 ? colors.action : colors.surfaceElevated,
                borderColor: activeFiltersCount > 0 ? colors.accent : colors.border,
              },
            ]}
            onPress={() => setShowFilterModal(true)}
            accessibilityLabel="Filter vehicles"
            accessibilityRole="button"
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={activeFiltersCount > 0 ? colors.onAccent : colors.text}
            />
            {activeFiltersCount > 0 && (
              <View style={[styles.filterBadge, { backgroundColor: colors.onAccent }]}>
                <Text style={[styles.filterBadgeText, { color: colors.link }]}>
                  {activeFiltersCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected ? colors.action : colors.surfaceElevated,
                    borderColor: isSelected ? colors.accent : colors.border,
                  },
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: isSelected ? colors.onAccent : colors.text,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Results List */}
      <FlatList
        data={filteredVehicles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: 28 },
        ]}
        renderItem={({ item }) => {
          const saved = isSaved(item.id);
          return (
            <View
              style={[
                styles.vehicleCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              {/* Image banner with badges */}
              <View style={styles.cardImageContainer}>
                <ListingImage
                  onOpen={() => router.push(`/vehicle/${item.id}`)}
                  label={`View ${item.title}`}
                  source={item.posterAsset || { uri: item.mediaUrls[0] }}
                  style={styles.cardImage}
                  contentFit="cover"
                  transition={200}
                />
                <View pointerEvents="box-none" style={styles.cardTopOverlay}>
                  <View
                    style={[
                      styles.cardBadge,
                      {
                        backgroundColor:
                          item.listingType === 'listing'
                            ? 'rgba(15, 23, 42, 0.8)'
                            : 'rgba(196, 155, 85, 0.9)',
                      },
                    ]}
                  >
                    <Ionicons
                      name={item.mediaType === 'video' ? 'videocam' : 'images'}
                      size={12}
                      color="#FFFFFF"
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.cardBadgeText}>
                      {item.mediaType === 'video'
                        ? item.listingType === 'listing'
                          ? 'EXCLUSIVE · 4K VIDEO'
                          : 'COMMUNITY REEL'
                        : `PHOTO GALLERY (${item.mediaUrls.length})`}
                    </Text>
                  </View>

                  {/* Quick Save button */}
                  <TouchableOpacity
                    style={[
                      styles.cardSaveBtn,
                      {
                        backgroundColor: saved ? colors.accent : 'rgba(15, 23, 42, 0.65)',
                      },
                    ]}
                    onPress={() => toggleSave(item.id)}
                    accessibilityLabel={saved ? 'Remove from saved' : 'Save vehicle'}
                    accessibilityRole="button"
                  >
                    <Ionicons
                      name={saved ? 'bookmark' : 'bookmark-outline'}
                      size={16}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                </View>

                {item.listingType === 'listing' && !!item.priceAED && (
                  <View style={[styles.cardPricePill, { backgroundColor: colors.action }]}>
                    <Text style={[styles.cardPriceText, { color: colors.onAccent }]}>
                      AED {item.priceAED.toLocaleString()}
                    </Text>
                  </View>
                )}
              </View>

              {/* Card Body */}
              <TouchableOpacity
                style={styles.cardBody}
                onPress={() => router.push(`/vehicle/${item.id}`)}
                accessibilityRole="button"
                accessibilityLabel={`View specifications for ${item.title}`}
              >
                <View style={styles.cardHeaderRow}>
                  <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={2}>
                    {item.title}
                  </Text>
                </View>

                {/* Specs row */}
                <View style={styles.cardSpecsRow}>
                  <View style={[styles.specTag, { backgroundColor: colors.surfaceElevated }]}>
                    <Text style={[styles.cardSpecText, { color: colors.textSecondary }]}>
                      {item.year}
                    </Text>
                  </View>
                  <View style={[styles.specTag, { backgroundColor: colors.surfaceElevated }]}>
                    <Text style={[styles.cardSpecText, { color: colors.textSecondary }]}>
                      {item.specs.horsepower}
                    </Text>
                  </View>
                  {item.mileageKm && (
                    <View style={[styles.specTag, { backgroundColor: colors.surfaceElevated }]}>
                      <Text style={[styles.cardSpecText, { color: colors.textSecondary }]}>
                        {item.mileageKm.toLocaleString()} KM
                      </Text>
                    </View>
                  )}
                  <View style={[styles.specTag, { backgroundColor: colors.surfaceElevated }]}>
                    <Text style={[styles.cardSpecText, { color: colors.textSecondary }]}>
                      {item.specs.regionalSpecs}
                    </Text>
                  </View>
                </View>

                {/* Seller & Location footer */}
                <View style={[styles.cardFooter, { borderTopColor: colors.borderSubtle }]}>
                  <View style={styles.cardSellerInfo}>
                    <Image source={{ uri: item.seller.avatar }} style={styles.cardSellerAvatar} />
                    <Text style={[styles.cardSellerName, { color: colors.text }]} numberOfLines={1}>
                      {item.seller.dealershipName || item.seller.name}
                    </Text>
                    {item.seller.verified && (
                      <Ionicons
                        name="checkmark-circle"
                        size={13}
                        color={item.listingType === 'listing' ? colors.verified : colors.gold}
                      />
                    )}
                  </View>
                  <View style={styles.cardLocation}>
                    <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
                    <Text style={[styles.cardLocationText, { color: colors.textSecondary }]}>
                      {item.location.split(',')[0]}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: colors.surfaceElevated }]}>
              <Ionicons name="search-outline" size={38} color={colors.textSecondary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Vehicles Found</Text>
            <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
              We could not find any vehicles matching your criteria. Try adjusting your search query or reset your filters.
            </Text>
            <TouchableOpacity
              style={[styles.resetButton, { backgroundColor: colors.action }]}
              onPress={() => {
                setQuery('');
                setSelectedCategory('All');
                setFilters({
                  query: '',
                  category: 'All',
                  listingType: 'all',
                  mediaType: 'all',
                  priceRange: 'all',
                  verifiedOnly: false,
                });
              }}
              accessibilityLabel="Reset all filters"
              accessibilityRole="button"
            >
              <Text style={[styles.resetButtonText, { color: colors.onAccent }]}>
                Reset All Filters
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApply={(updated) => setFilters(updated)}
        onReset={() =>
          setFilters({
            query: '',
            category: 'All',
            listingType: 'all',
            mediaType: 'all',
            priceRange: 'all',
            verifiedOnly: false,
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    borderBottomWidth: 1,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  inputWrap: {
    flex: 1,
    height: 44,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '900',
  },
  categoriesScroll: {
    gap: Spacing.two,
    paddingVertical: 2,
  },
  categoryChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 12,
  },
  listContainer: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    padding: Spacing.four,
    gap: Spacing.four,
  },
  vehicleCard: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 1,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardImageContainer: {
    height: 200,
    position: 'relative',
    backgroundColor: '#EDF3F9',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardTopOverlay: {
    position: 'absolute',
    top: Spacing.three,
    left: Spacing.three,
    right: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  cardBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  cardSaveBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPricePill: {
    position: 'absolute',
    bottom: Spacing.three,
    left: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  cardPriceText: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  cardBody: {
    padding: Spacing.three,
  },
  cardHeaderRow: {
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSpecsRow: {
    flexWrap: 'wrap',
    gap: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  specTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  cardSpecText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardFooter: {
    flexWrap: 'wrap',
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.two,
    borderTopWidth: 1,
  },
  cardSellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  cardSellerAvatar: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
  },
  cardSellerName: {
    flexShrink: 1,
    fontSize: 12,
    fontWeight: '600',
    maxWidth: 140,
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  cardLocationText: {
    fontSize: 11,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.nine,
    paddingHorizontal: Spacing.six,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
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
  resetButton: {
    paddingHorizontal: Spacing.six,
    paddingVertical: 12,
    borderRadius: Radius.full,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});

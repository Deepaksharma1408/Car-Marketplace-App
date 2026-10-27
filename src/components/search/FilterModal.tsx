import { TouchableOpacity } from '@/components/ui/Touchable';
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/ThemeContext';
import { SearchFilters } from '@/types';
import { Spacing, Radius } from '@/constants/theme';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: SearchFilters;
  onApply: (updated: SearchFilters) => void;
  onReset: () => void;
}

export function FilterModal({ visible, onClose, filters, onApply, onReset }: FilterModalProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  const priceRanges: { label: string; value: SearchFilters['priceRange'] }[] = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under AED 300K', value: 'under300k' },
    { label: 'AED 300K - 700K', value: '300k-700k' },
    { label: 'AED 700K - 1.5M', value: '700k-1.5m' },
    { label: 'AED 1.5M+', value: '1.5m-plus' },
  ];

  const listingTypes: { label: string; value: SearchFilters['listingType'] }[] = [
    { label: 'All Content', value: 'all' },
    { label: 'For Sale Only', value: 'listing' },
    { label: 'Social Reels Only', value: 'social' },
  ];

  const mediaTypes: { label: string; value: SearchFilters['mediaType'] }[] = [
    { label: 'All Media', value: 'all' },
    { label: 'Video Reels', value: 'video' },
    { label: 'Photo Galleries', value: 'photo' },
  ];

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetValues: SearchFilters = {
      query: '',
      category: 'All',
      listingType: 'all',
      mediaType: 'all',
      priceRange: 'all',
      verifiedOnly: false,
    };
    setLocalFilters(resetValues);
    onReset();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onShow={() => setLocalFilters(filters)} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={[styles.sheetContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          {/* Handle */}
          <View style={styles.handleContainer}>
            <View style={[styles.handleBar, { backgroundColor: colors.border }]} />
          </View>

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.borderSubtle }]}>
            <TouchableOpacity onPress={handleReset}>
              <Text style={[styles.resetText, { color: colors.textSecondary }]}>Reset All</Text>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Filters</Text>
            <TouchableOpacity onPress={onClose} accessibilityLabel="Close filters" accessibilityRole="button" style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Listing Type Filter */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Content Type</Text>
              <View style={styles.optionsWrap}>
                {listingTypes.map((item) => {
                  const active = localFilters.listingType === item.value;
                  return (
                    <TouchableOpacity
                      key={item.value}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: active ? colors.action : colors.surfaceElevated,
                          borderColor: active ? colors.accent : colors.border,
                        },
                      ]}
                      onPress={() => setLocalFilters({ ...localFilters, listingType: item.value })}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          { color: active ? colors.onAccent : colors.text },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Media Type Filter */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Media Format</Text>
              <View style={styles.optionsWrap}>
                {mediaTypes.map((item) => {
                  const active = localFilters.mediaType === item.value;
                  return (
                    <TouchableOpacity
                      key={item.value}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: active ? colors.action : colors.surfaceElevated,
                          borderColor: active ? colors.accent : colors.border,
                        },
                      ]}
                      onPress={() => setLocalFilters({ ...localFilters, mediaType: item.value })}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          { color: active ? colors.onAccent : colors.text },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Price Range */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Price Range (AED)</Text>
              <View style={styles.optionsWrap}>
                {priceRanges.map((item) => {
                  const active = localFilters.priceRange === item.value;
                  return (
                    <TouchableOpacity
                      key={item.value}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: active ? colors.action : colors.surfaceElevated,
                          borderColor: active ? colors.accent : colors.border,
                        },
                      ]}
                      onPress={() => setLocalFilters({ ...localFilters, priceRange: item.value })}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          { color: active ? colors.onAccent : colors.text },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Verified Dealers Only Toggle */}
            <View style={[styles.toggleRow, { borderTopColor: colors.borderSubtle, borderBottomColor: colors.borderSubtle }]}>
              <View style={styles.toggleInfo}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="shield-checkmark" size={18} color={colors.verified} />
                  <Text style={[styles.toggleTitle, { color: colors.text }]}>Verified Dealers Only</Text>
                </View>
                <Text style={[styles.toggleSub, { color: colors.textSecondary }]}>
                  Show vehicles exclusively from authenticated UAE dealers
                </Text>
              </View>
              <Switch
                value={localFilters.verifiedOnly}
                onValueChange={(val) => setLocalFilters({ ...localFilters, verifiedOnly: val })}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor="#FFFFFF"
              />
            </View>
          </ScrollView>

          {/* Action buttons */}
          <View style={[styles.footer, {
              borderTopColor: colors.borderSubtle,
              backgroundColor: colors.surface,
              paddingBottom: Math.max(insets.bottom, Spacing.four),
              paddingLeft: Math.max(insets.left, Spacing.four),
              paddingRight: Math.max(insets.right, Spacing.four),
            }]}>
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: colors.action }]}
              onPress={handleApply}
              accessibilityLabel="Apply filters"
              accessibilityRole="button"
            >
              <Text style={[styles.applyButtonText, { color: colors.onAccent }]}>
                Apply Filters
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.38)',
  },
  sheetContainer: {
    maxHeight: '88%',
    width: '100%',
    maxWidth: 640,
    alignSelf: 'center',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderTopWidth: 1,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: Radius.full,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
    borderBottomWidth: 1,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  closeBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    width: '100%',
    maxWidth: 800,
    alignSelf: 'center',
    padding: Spacing.four,
    gap: Spacing.five,
  },
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.four,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  toggleInfo: {
    flex: 1,
    paddingRight: Spacing.four,
    gap: 4,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  toggleSub: {
    fontSize: 12,
    lineHeight: 16,
  },
  footer: {
    padding: Spacing.four,
    borderTopWidth: 1,
  },
  applyButton: {
    paddingVertical: 14,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

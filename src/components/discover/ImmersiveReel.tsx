import React, { useState, type ComponentProps } from 'react';
import {
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/ThemeContext';
import { useSaved } from '@/context/SavedContext';
import { Vehicle } from '@/types';
import { CommentsSheet } from './CommentsSheet';
import { ReelVideoPlayer } from './ReelVideoPlayer';

interface ImmersiveReelProps {
  vehicle: Vehicle;
  height: number;
  isActive: boolean;
  isScreenFocused: boolean;
  isAppActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function ImmersiveReel({
  vehicle,
  height,
  isActive,
  isScreenFocused,
  isAppActive,
  isMuted,
  onToggleMute,
}: ImmersiveReelProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const { isLiked, toggleLike, getLikesCount, isSaved, toggleSave } = useSaved();

  const [commentsOpen, setCommentsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const liked = isLiked(vehicle.id);
  const saved = isSaved(vehicle.id);
  const forSale = vehicle.listingType === 'listing';
  const isVideo = vehicle.mediaType === 'video' && !!vehicle.videoAsset;
  const compact = height < 580;

  const handleShare = async () => {
    try {
      const priceText = forSale && vehicle.priceAED ? ` · AED ${vehicle.priceAED.toLocaleString()}` : '';
      await Share.share({
        message: `${vehicle.title}${priceText} on VehicleSpot Dubai · ${vehicle.location}`,
      });
    } catch (error) {
      console.warn('Share error', error);
    }
  };

  const openDetails = () => {
    router.push(`/vehicle/${vehicle.id}`);
  };

  const action = (
    icon: ComponentProps<typeof Ionicons>['name'],
    label: string,
    accessibilityLabel: string,
    onPress: () => void,
    selected = false,
    selectedColor = colors.accent
  ) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionBtn,
        { backgroundColor: pressed ? 'rgba(0,137,200,0.35)' : 'rgba(15, 23, 42, 0.45)' },
      ]}
    >
      <View style={styles.actionIconWrap}>
        <Ionicons name={icon} size={compact ? 24 : 26} color={selected ? selectedColor : '#FFFFFF'} />
      </View>
      <Text style={styles.actionLabel} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View style={[styles.page, { height }]} accessibilityLabel={`Vehicle reel: ${vehicle.title}`}>
      {/* Media Layer: Real Video OR Static Photo Gallery */}
      {isVideo && isActive && isScreenFocused && isAppActive ? (
        <ReelVideoPlayer
          source={vehicle.videoAsset}
          isActive={isActive}
          isScreenFocused={isScreenFocused}
          isAppActive={isAppActive}
          posterUri={vehicle.mediaUrls[0]}
          posterSource={vehicle.posterAsset}
          isMuted={isMuted}
          onToggleMute={onToggleMute}
        />
      ) : isVideo ? (
        <Image
          source={vehicle.posterAsset || { uri: vehicle.mediaUrls[0] }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
      ) : (
        <View style={StyleSheet.absoluteFill}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const nextIndex = Math.round(e.nativeEvent.contentOffset.x / windowWidth);
              if (nextIndex !== photoIndex && nextIndex >= 0 && nextIndex < vehicle.mediaUrls.length) {
                setPhotoIndex(nextIndex);
              }
            }}
            scrollEventThrottle={16}
            style={StyleSheet.absoluteFill}
          >
            {vehicle.mediaUrls.map((url, idx) => (
              <Image
                key={idx}
                source={{ uri: url }}
                style={{ width: windowWidth, height }}
                contentFit="cover"
                transition={180}
              />
            ))}
          </ScrollView>

          {/* Photo Gallery Pill Indicator */}
          <View style={[styles.photoCounterPill, { top: insets.top + 68 }]}>
            <Ionicons name="images-outline" size={12} color="#FFFFFF" />
            <Text style={styles.photoCounterText}>
              PHOTO {photoIndex + 1} OF {vehicle.mediaUrls.length}
            </Text>
          </View>
        </View>
      )}

      {/* Top & Bottom Editorial Scrim Gradients for contrast & legibility */}
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(15, 23, 42, 0.65)', 'transparent']}
        style={[styles.topScrim, { height: insets.top + 130 }]}
      />
      <LinearGradient
        pointerEvents="none"
        colors={['transparent', 'rgba(15, 23, 42, 0.45)', 'rgba(15, 23, 42, 0.92)']}
        locations={[0, 0.35, 1]}
        style={[styles.bottomScrim, { height: Math.min(height * 0.58, 420) }]}
      />

      {/* Top Status Tags */}
      <View style={[styles.topMetaRow, { top: insets.top + 68 }]}>
        <View
          style={[
            styles.typeBadge,
            {
              backgroundColor: forSale ? 'rgba(0, 137, 200, 0.9)' : 'rgba(196, 155, 85, 0.9)',
            },
          ]}
        >
          <Ionicons
            name={forSale ? 'car-sport' : 'sparkles'}
            size={12}
            color="#FFFFFF"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.typeBadgeText}>
            {forSale ? 'CURATED LISTING' : 'COMMUNITY REEL'}
          </Text>
        </View>

        {isVideo && (
          <View style={styles.mediaPill}>
            <Ionicons name="videocam" size={11} color="#FFFFFF" style={{ marginRight: 3 }} />
            <Text style={styles.mediaPillText}>VIDEO</Text>
          </View>
        )}
      </View>

      {/* Floating Action Rail (Right side) */}
      <View style={[styles.actionRail, { bottom: Math.max(insets.bottom, 12) + 16, gap: compact ? 8 : 12 }]}>
        {/* Sound toggle for video reels */}
        {isVideo && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isMuted ? 'Unmute video audio' : 'Mute video audio'}
            onPress={onToggleMute}
            style={({ pressed }) => [
              styles.actionBtn,
              styles.muteBtn,
              { backgroundColor: pressed ? 'rgba(0,137,200,0.5)' : 'rgba(15, 23, 42, 0.55)' },
            ]}
          >
            <Ionicons
              name={isMuted ? 'volume-mute' : 'volume-high'}
              size={compact ? 22 : 24}
              color="#FFFFFF"
            />
            <Text style={styles.actionLabel}>{isMuted ? 'Muted' : 'Audio'}</Text>
          </Pressable>
        )}

        {action(
          liked ? 'heart' : 'heart-outline',
          String(getLikesCount(vehicle)),
          'Like this vehicle reel',
          () => toggleLike(vehicle.id),
          liked,
          '#FF496B'
        )}

        {action(
          'chatbubble-outline',
          String(vehicle.commentsCount),
          'Open vehicle comments',
          () => setCommentsOpen(true)
        )}

        {action(
          saved ? 'bookmark' : 'bookmark-outline',
          saved ? 'Saved' : 'Save',
          saved ? 'Remove from saved' : 'Save vehicle to collection',
          () => toggleSave(vehicle.id),
          saved,
          colors.accent
        )}

        {action('share-social-outline', 'Share', 'Share vehicle reel', handleShare)}
      </View>

      {/* Bottom Editorial Content Overlay */}
      <View style={[styles.bottomInfo, { bottom: Math.max(insets.bottom, 12) + 14 }]}>
        {/* Seller / Creator Identification */}
        <Pressable
          onPress={forSale ? openDetails : undefined}
          accessibilityLabel={`Seller profile: ${vehicle.seller.name}`}
          style={styles.sellerRow}
        >
          <Image source={{ uri: vehicle.seller.avatar }} style={styles.avatar} contentFit="cover" />
          <View style={styles.sellerTextWrap}>
            <View style={styles.handleRow}>
              <Text style={styles.sellerHandle} numberOfLines={1}>
                @{vehicle.seller.handle}
              </Text>
              {vehicle.seller.verified && (
                <Ionicons
                  name="checkmark-circle"
                  size={15}
                  color={forSale ? colors.accent : colors.gold}
                />
              )}
            </View>
            <Text style={styles.sellerDealership} numberOfLines={1}>
              {vehicle.seller.dealershipName || vehicle.seller.location}
            </Text>
          </View>
        </Pressable>

        {/* Vehicle Title */}
        <Pressable onPress={forSale ? openDetails : undefined}>
          <Text style={styles.vehicleTitle} numberOfLines={expanded ? undefined : 2}>
            {vehicle.title}
          </Text>
        </Pressable>

        {/* AED Price ONLY for Sale Listings */}
        {forSale && !!vehicle.priceAED && (
          <View style={styles.priceRow}>
            <Text style={styles.priceCurrency}>AED</Text>
            <Text style={styles.priceValue}>{vehicle.priceAED.toLocaleString()}</Text>
            <View style={styles.gccBadge}>
              <Text style={styles.gccText}>{vehicle.specs.regionalSpecs || 'GCC Specs'}</Text>
            </View>
          </View>
        )}

        {/* Description caption */}
        <Pressable
          onPress={() => setExpanded(!expanded)}
          accessibilityRole="button"
          accessibilityLabel={expanded ? 'Collapse description' : 'Expand description'}
        >
          <Text style={styles.caption} numberOfLines={expanded ? 4 : 1}>
            {vehicle.description}
            {!expanded && <Text style={styles.moreText}> · more</Text>}
          </Text>
        </Pressable>

        {/* Key Metrics Strip */}
        <View style={styles.specsStrip}>
          <View style={styles.specPill}>
            <Ionicons name="speedometer-outline" size={11} color="#FFFFFF" style={{ marginRight: 3 }} />
            <Text style={styles.specPillText}>{vehicle.specs.horsepower}</Text>
          </View>

          {vehicle.mileageKm && (
            <View style={styles.specPill}>
              <Ionicons name="navigate-outline" size={11} color="#FFFFFF" style={{ marginRight: 3 }} />
              <Text style={styles.specPillText}>{vehicle.mileageKm.toLocaleString()} KM</Text>
            </View>
          )}

          <View style={styles.specPill}>
            <Ionicons name="location-outline" size={11} color="#FFFFFF" style={{ marginRight: 3 }} />
            <Text style={styles.specPillText}>{vehicle.location.split(',')[0]}</Text>
          </View>
        </View>

        {/* Primary Action Button */}
        {forSale ? (
          <Pressable
            onPress={openDetails}
            accessibilityRole="button"
            accessibilityLabel={`View full details for ${vehicle.title}`}
            style={({ pressed }) => [
              styles.ctaButton,
              { backgroundColor: pressed ? colors.accentHover : colors.action },
            ]}
          >
            <Text style={styles.ctaButtonText}>View Car Details</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </Pressable>
        ) : (
          <Pressable
            onPress={() => setCommentsOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Join discussion for community reel"
            style={({ pressed }) => [
              styles.ctaButton,
              styles.ctaDiscussion,
              { backgroundColor: pressed ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.16)' },
            ]}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.ctaButtonText}>Join Discussion ({vehicle.commentsCount})</Text>
          </Pressable>
        )}
      </View>

      {/* Interactive Comments Sheet */}
      <CommentsSheet
        visible={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        vehicle={vehicle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    width: '100%',
    backgroundColor: '#0F172A',
    overflow: 'hidden',
    position: 'relative',
  },
  topScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  bottomScrim: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  photoCounterPill: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: 6,
  },
  photoCounterText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  topMetaRow: {
    position: 'absolute',
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    zIndex: 6,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  typeBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  mediaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
  mediaPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  actionRail: {
    position: 'absolute',
    right: 12,
    width: 58,
    alignItems: 'center',
    zIndex: 10,
  },
  actionBtn: {
    width: 52,
    minHeight: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  muteBtn: {
    marginBottom: 4,
  },
  actionIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 3,
  },
  bottomInfo: {
    position: 'absolute',
    left: 16,
    right: 80,
    gap: 8,
    zIndex: 10,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  sellerTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  handleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  sellerHandle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    flexShrink: 1,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 2,
  },
  sellerDealership: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 11,
    fontWeight: '500',
  },
  vehicleTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '900',
    letterSpacing: -0.3,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowRadius: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  priceCurrency: {
    color: '#70CDF5',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  priceValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  gccBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
  },
  gccText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  caption: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    lineHeight: 17,
  },
  moreText: {
    color: '#70CDF5',
    fontWeight: '700',
  },
  specsStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 2,
  },
  specPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  specPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    borderRadius: 12,
    paddingHorizontal: 16,
    gap: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  ctaDiscussion: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

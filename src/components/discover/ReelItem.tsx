import { useState, type ComponentProps } from 'react';
import { View, Text, StyleSheet, Pressable, Share, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Vehicle } from '@/types';
import { useAppTheme } from '@/context/ThemeContext';
import { useSaved } from '@/context/SavedContext';
import { BrandButton } from '@/components/ui/BrandButton';
import { CommentsSheet } from './CommentsSheet';

export function ReelItem({ vehicle }: { vehicle: Vehicle }) {
  const { colors } = useAppTheme();
  const { isSaved, toggleSave, isLiked, toggleLike, getLikesCount } = useSaved();
  const [showComments, setShowComments] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [mediaState, setMediaState] = useState<'loading' | 'ready' | 'error'>('loading');
  const [retry, setRetry] = useState(0);
  const saved = isSaved(vehicle.id);
  const forSale = vehicle.listingType === 'listing';
  const liked = isLiked(vehicle.id);
  const openDetails = () => router.push(`/vehicle/${vehicle.id}`);
  const handleShare = async () => {
    try { await Share.share({ message: `Check out this ${vehicle.title} on VehicleSpot! ${forSale && vehicle.priceAED ? 'Price: AED ' + vehicle.priceAED.toLocaleString() : ''}` }); }
    catch (err) { console.warn('Share error', err); }
  };
  const action = (icon: ComponentProps<typeof Ionicons>['name'], label: string, onPress: () => void, active = false, accessibilityLabel = label) => (
    <Pressable onPress={onPress} accessibilityLabel={accessibilityLabel} accessibilityRole="button" accessibilityState={{ selected: active }}
      style={({ pressed }) => [styles.action, { backgroundColor: pressed ? colors.accentLight : 'transparent' }]}>
      <Ionicons name={icon} size={22} color={active ? colors.accent : colors.textSecondary} />
      <Text numberOfLines={1} style={[styles.actionText, { color: active ? colors.link : colors.textSecondary }]}>{label}</Text>
    </Pressable>
  );
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={[styles.media, { backgroundColor: colors.surfaceElevated }]}>
        <Image key={retry} source={{ uri: vehicle.mediaUrls[photoIndex] }} style={StyleSheet.absoluteFill} contentFit="cover"
          transition={180} onLoadStart={() => setMediaState('loading')} onLoad={() => setMediaState('ready')} onError={() => setMediaState('error')} />
        {mediaState === 'loading' && <View style={styles.mediaState}><ActivityIndicator color={colors.accent} accessibilityLabel="Loading vehicle photo" /></View>}
        {mediaState === 'error' && <View style={[styles.mediaState, { backgroundColor: colors.surfaceElevated }]}>
          <Ionicons name="image-outline" size={32} color={colors.textSecondary} />
          <Text style={{ color: colors.textSecondary }}>Photo could not load</Text>
          <BrandButton label="Retry photo" variant="secondary" onPress={() => { setMediaState('loading'); setRetry(retry + 1); }} />
        </View>}
        <View style={styles.mediaTop}>
          <View style={[styles.badge, { backgroundColor: vehicle.seller.verified ? colors.goldLight : colors.surface }]}>
            <Ionicons name={vehicle.seller.verified ? 'ribbon-outline' : 'car-sport-outline'} size={13} color={vehicle.seller.verified ? colors.goldText : colors.link} />
            <Text style={[styles.badgeText, { color: vehicle.seller.verified ? colors.goldText : colors.text }]}>{vehicle.listingType === 'listing' ? 'FOR SALE' : 'COMMUNITY REEL'}</Text>
          </View>
        </View>
        <View style={[styles.mediaLabel, { backgroundColor: colors.surface }]}>
          <Ionicons name="images-outline" size={13} color={colors.link} />
          <Text style={[styles.mediaLabelText, { color: colors.textSecondary }]}>{vehicle.mediaType === 'video' ? 'Sample image · no video playback' : `Photo Gallery (${vehicle.mediaUrls.length})`}</Text>
        </View>
        {vehicle.mediaType === 'photo' && vehicle.mediaUrls.length > 1 && <View style={styles.dots}>
          {vehicle.mediaUrls.map((_, index) => <Pressable key={index} onPress={() => { setMediaState('loading'); setPhotoIndex(index); }} accessibilityRole="button" accessibilityLabel={`Show photo ${index + 1}`}
            accessibilityState={{ selected: index === photoIndex }} style={styles.dotTarget}><View style={[styles.dot, { backgroundColor: index === photoIndex ? colors.accent : colors.surface }]} /></Pressable>)}
        </View>}
      </View>
      <View style={styles.body}>
        <Pressable onPress={forSale ? openDetails : undefined} accessibilityLabel={`${forSale ? 'Seller' : 'Creator'} ${vehicle.seller.name}`} style={styles.seller}>
          <Image source={{ uri: vehicle.seller.avatar }} style={styles.avatar} />
          <View style={styles.sellerInfo}>
            <Text style={[styles.sellerName, { color: colors.text }]} numberOfLines={1}>@{vehicle.seller.handle}</Text>
            {vehicle.seller.verified && <View style={styles.verified}><Ionicons name="checkmark-circle" size={13} color={colors.verified} /><Text style={[styles.sellerBadge, { color: colors.goldText }]}>{vehicle.seller.badgeText || 'Verified'}</Text></View>}
          </View>
        </Pressable>
        <Text style={[styles.title, { color: colors.text }]}>{vehicle.title}</Text>
        {forSale && !!vehicle.priceAED && <Text style={[styles.price, { color: colors.link }]}>AED {vehicle.priceAED.toLocaleString()}</Text>}
        <View style={styles.location}><Ionicons name="location-outline" size={15} color={colors.textSecondary} /><Text style={[styles.locationText, { color: colors.textSecondary }]}>{vehicle.location}</Text></View>
        <View style={styles.specs}>
          {[vehicle.specs.horsepower, ...(vehicle.mileageKm ? [vehicle.mileageKm.toLocaleString() + ' KM'] : []), vehicle.specs.regionalSpecs].map((spec, i) => (
            <View key={i} style={[styles.spec, { backgroundColor: colors.background }]}><Text style={[styles.specText, { color: colors.textSecondary }]}>{spec}</Text></View>
          ))}
        </View>
        <View style={[styles.actions, { borderColor: colors.border }]}>
          {action(liked ? 'heart' : 'heart-outline', String(getLikesCount(vehicle)), () => toggleLike(vehicle.id), liked, 'Like this vehicle')}
          {action('chatbubble-outline', String(vehicle.commentsCount), () => setShowComments(true), false, 'Open comments')}
          {action(saved ? 'bookmark' : 'bookmark-outline', saved ? 'Saved' : 'Save', () => toggleSave(vehicle.id), saved, saved ? 'Remove from saved' : 'Save vehicle')}
          {action('share-outline', 'Share', handleShare)}
        </View>
        <BrandButton label={vehicle.listingType === 'listing' ? 'View Car Details' : `Join Discussion (${vehicle.commentsCount})`}
          onPress={vehicle.listingType === 'listing' ? openDetails : () => setShowComments(true)} />
      </View>
      <CommentsSheet visible={showComments} onClose={() => setShowComments(false)} vehicle={vehicle} />
    </View>
  );
}
const styles = StyleSheet.create({
  card: { borderRadius: 22, borderWidth: 1, overflow: 'hidden', shadowColor: '#0F172A', shadowOpacity: 0.06, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 2 },
  media: { width: '100%', aspectRatio: 1.75, maxHeight: 480, position: 'relative' },
  mediaState: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', gap: 12 },
  mediaTop: { position: 'absolute', top: 12, left: 12, right: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8, flexShrink: 1 },
  badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.7, flexShrink: 1 },
  mediaLabel: { position: 'absolute', bottom: 12, left: 12, flexDirection: 'row', gap: 5, alignItems: 'center', borderRadius: 8, padding: 8, maxWidth: '85%' },
  mediaLabelText: { fontSize: 10, fontWeight: '600', flexShrink: 1 },
  dots: { position: 'absolute', right: 8, bottom: 2, flexDirection: 'row' },
  dotTarget: { width: 32, height: 44, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  body: { padding: 16, gap: 10 },
  seller: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 },
  avatar: { width: 38, height: 38, borderRadius: 19 },
  sellerInfo: { flex: 1, minWidth: 0, gap: 3 },
  sellerName: { fontSize: 13, fontWeight: '600' },
  verified: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4 },
  sellerBadge: { fontSize: 9, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' },
  title: { fontSize: 21, lineHeight: 28, fontWeight: '700', letterSpacing: -0.4 },
  price: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  location: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { flex: 1, fontSize: 13 },
  specs: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  spec: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8 },
  specText: { fontSize: 11, fontWeight: '600' },
  actions: { flexDirection: 'row', borderTopWidth: 1, paddingTop: 8, gap: 4 },
  action: { flex: 1, minWidth: 0, minHeight: 56, borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 4 },
  actionText: { fontSize: 11, fontWeight: '600' },
});

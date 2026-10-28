import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  StatusBar,
  AppState,
  AppStateStatus,
  ViewToken,
} from 'react-native';
import { useIsFocused } from 'expo-router';
import { BrandHeader } from '@/components/ui/BrandHeader';
import { ImmersiveReel } from '@/components/discover/ImmersiveReel';
import { useVehicles } from '@/context/VehicleContext';

const VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 60,
};

export default function DiscoverScreen() {
  const { vehicles } = useVehicles();
  const isScreenFocused = useIsFocused();
  const firstReelId = vehicles.find(v => v.mediaType === 'video')?.id ?? 'r1';
  const [layoutHeight, setLayoutHeight] = useState(0);
  const [activeVehicleId, setActiveVehicleId] = useState<string>(firstReelId);
  const [isAppActive, setIsAppActive] = useState<boolean>(AppState.currentState === 'active');
  const [isMuted, setIsMuted] = useState<boolean>(true); // Start muted by default as required

  // AppState listener for pausing on background / resume on foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      setIsAppActive(nextState === 'active');
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const filteredVehicles = useMemo(() => vehicles.filter(v => v.mediaType === 'video'), [vehicles]);

  // Viewable item tracking for single active playing video
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems && viewableItems.length > 0) {
        const topItem = viewableItems[0];
        if (topItem.item?.id) {
          setActiveVehicleId(topItem.item.id);
        }
      }
    },
    []
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Viewport for Vertically Paged Editorial Feed */}
      <View
        style={styles.viewport}
        onLayout={(event) => {
          const height = event.nativeEvent.layout.height;
          if (height > 0 && Math.abs(height - layoutHeight) > 1) {
            setLayoutHeight(height);
          }
        }}
      >
        {layoutHeight > 0 && (
          <FlatList
            key={`feed-${layoutHeight}`}
            data={filteredVehicles}
            keyExtractor={(item) => item.id}
            pagingEnabled
            snapToInterval={layoutHeight}
            decelerationRate="fast"
            disableIntervalMomentum
            showsVerticalScrollIndicator={false}
            bounces={false}
            initialNumToRender={1}
            maxToRenderPerBatch={2}
            windowSize={3}
            removeClippedSubviews
            getItemLayout={(_, index) => ({
              length: layoutHeight,
              offset: layoutHeight * index,
              index,
            })}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={VIEWABILITY_CONFIG}
            renderItem={({ item }) => (
              <ImmersiveReel
                vehicle={item}
                height={layoutHeight}
                isActive={item.id === activeVehicleId}
                isScreenFocused={isScreenFocused}
                isAppActive={isAppActive}
                isMuted={isMuted}
                onToggleMute={toggleMute}
              />
            )}
          />
        )}
      </View>

      {/* Floating Brand & Filter Header (Rendered on top of viewport) */}
      <BrandHeader immersive />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  viewport: {
    flex: 1,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
});

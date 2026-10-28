import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator, Text } from 'react-native';
import { useVideoPlayer, VideoView, type VideoSource } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEvent } from 'expo';

interface ReelVideoPlayerProps {
  source: VideoSource;
  isActive: boolean;
  isScreenFocused: boolean;
  isAppActive: boolean;
  posterUri?: string;
  posterSource?: any;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function ReelVideoPlayer({
  source,
  isActive,
  isScreenFocused,
  isAppActive,
  posterUri,
  posterSource,
  isMuted,
}: ReelVideoPlayerProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackAction, setFeedbackAction] = useState<'play' | 'pause'>('play');
  const feedbackTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const player = useVideoPlayer(source, (p) => {
    p.loop = true;
    p.muted = isMuted;
    p.bufferOptions = {
      preferredForwardBufferDuration: 5,
      maxBufferBytes: 8 * 1024 * 1024,
      prioritizeTimeOverSizeThreshold: false,
    };
  });
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
  const { status } = useEvent(player, 'statusChange', { status: player.status });
  const isReady = status === 'readyToPlay';
  const hasError = status === 'error';

  // Keep the same decoder when the user toggles sound.
  useEffect(() => {
    // Expo exposes mute as an imperative native property, not React state.
    // eslint-disable-next-line react-hooks/immutability
    player.muted = isMuted;
  }, [player, isMuted]);

  // Sync playback with visibility, tab focus, and app lifecycle
  const shouldPlay = isActive && isScreenFocused && isAppActive;

  useEffect(() => {
    const p = player;

    if (shouldPlay) {
      try {
        p.play();
      } catch (err) {
        console.warn('Video play error:', err);
      }
    } else {
      try {
        p.pause();
      } catch (err) {
        console.warn('Video pause error:', err);
      }
    }
  }, [player, shouldPlay]);

  useEffect(() => () => {
    if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
  }, []);

  const togglePlayback = () => {
    const p = player;

    if (isPlaying) {
      p.pause();
      setFeedbackAction('pause');
    } else {
      p.play();
      setFeedbackAction('play');
    }

    setShowFeedback(true);
    if (feedbackTimeout.current) clearTimeout(feedbackTimeout.current);
    feedbackTimeout.current = setTimeout(() => {
      setShowFeedback(false);
    }, 700);
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Poster Image while buffering */}
      {(posterSource || posterUri) && !isReady && (
        <Image
          source={posterSource || { uri: posterUri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
      )}

      {/* Video View */}
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
      />

      {/* Tap area to pause/resume */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={togglePlayback}
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? 'Pause vehicle video' : 'Play vehicle video'}
      />

      {/* Center Feedback Icon */}
      {showFeedback && (
        <View pointerEvents="none" style={styles.feedbackContainer}>
          <View style={styles.feedbackCircle}>
            <Ionicons
              name={feedbackAction === 'play' ? 'play' : 'pause'}
              size={36}
              color="#FFFFFF"
            />
          </View>
        </View>
      )}

      {/* Loading Indicator */}
      {!isReady && !hasError && (
        <View pointerEvents="none" style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#FFFFFF" />
        </View>
      )}

      {/* Error state */}
      {hasError && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={32} color="#FFFFFF" />
          <Text style={styles.errorText}>Video preview temporarily unavailable</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  feedbackContainer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  loadingContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  errorContainer: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 24,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});

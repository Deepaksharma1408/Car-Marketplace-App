import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { ReelVideoPlayer } from './ReelVideoPlayer';
import type { Vehicle } from '@/types';

type PlaybackProps = { isActive: boolean; isScreenFocused: boolean; isAppActive: boolean; isMuted: boolean; onToggleMute: () => void };
export function VideoSequence({ vehicle, ...props }: PlaybackProps & { vehicle: Vehicle }) {
  const [index, setIndex] = useState(0);
  const clips = vehicle.clipUris;
  const clean = vehicle.templateName === 'clean';
  const luxury = vehicle.templateName === 'luxury';
  const ink = clean ? '#0F172A' : '#FFFFFF';
  return <View style={StyleSheet.absoluteFill}>
    <ReelVideoPlayer key={clips ? index : vehicle.id} source={clips?.length ? { uri: clips[index % clips.length] } : vehicle.videoAsset}
      posterUri={vehicle.mediaUrls[0]} posterSource={vehicle.posterAsset} {...props}
      onEnd={clips && clips.length > 1 ? () => setIndex(i => (i + 1) % clips.length) : undefined} />
    {!!vehicle.templateName && <View pointerEvents="none" style={{ position: 'absolute', top: luxury ? '18%' : '24%', left: 20, right: 70, borderLeftWidth: 4, borderLeftColor: clean ? '#FFFFFF' : '#C49B55', backgroundColor: clean ? 'rgba(255,255,255,0.92)' : luxury ? 'rgba(15,23,42,0.85)' : 'rgba(0,115,170,0.85)', padding: 12, borderRadius: 8 }}>
      <Text style={{ color: luxury ? '#E8C68A' : ink, fontWeight: '800', fontSize: luxury ? 21 : 18 }}>{vehicle.make} {vehicle.model}</Text>
      <Text style={{ color: ink, marginTop: 5 }}>{vehicle.year} · {vehicle.specs.horsepower}{vehicle.priceAED ? ` · AED ${vehicle.priceAED.toLocaleString()}` : ''}</Text>
      <Text style={{ color: ink, fontSize: 10, marginTop: 5 }}>Clip {index + 1} of {clips?.length || 1}</Text>
    </View>}
  </View>;
}

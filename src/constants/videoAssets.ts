export const VIDEO_ASSETS: Record<string, any> = {
  r1: require('../../assets/videos/mobile/14281079_2160_3840_24fps.mp4'),
  r2: require('../../assets/videos/mobile/14281109_2160_3840_24fps.mp4'),
  r3: require('../../assets/videos/mobile/16052695-uhd_2160_3840_60fps.mp4'),
  r4: require('../../assets/videos/mobile/17100392_1440_2560_24fps.mp4'),
  r5: require('../../assets/videos/mobile/6872069-uhd_2160_3840_25fps.mp4'),
  // Aliases for compatibility
  'reel-1': require('../../assets/videos/mobile/14281079_2160_3840_24fps.mp4'),
  'reel-2': require('../../assets/videos/mobile/14281109_2160_3840_24fps.mp4'),
  'reel-3': require('../../assets/videos/mobile/16052695-uhd_2160_3840_60fps.mp4'),
  'reel-4': require('../../assets/videos/mobile/17100392_1440_2560_24fps.mp4'),
  'reel-5': require('../../assets/videos/mobile/6872069-uhd_2160_3840_25fps.mp4'),
  v1: require('../../assets/videos/mobile/14281079_2160_3840_24fps.mp4'),
  v2: require('../../assets/videos/mobile/14281109_2160_3840_24fps.mp4'),
  v4: require('../../assets/videos/mobile/16052695-uhd_2160_3840_60fps.mp4'),
  v5: require('../../assets/videos/mobile/17100392_1440_2560_24fps.mp4'),
  v7: require('../../assets/videos/mobile/6872069-uhd_2160_3840_25fps.mp4'),
};

export const POSTER_ASSETS: Record<string, any> = {
  r1: require('../../assets/images/posters/poster_reel_1.jpg'),
  r2: require('../../assets/images/posters/poster_reel_2.jpg'),
  r3: require('../../assets/images/posters/poster_reel_3.jpg'),
  r4: require('../../assets/images/posters/poster_reel_4.jpg'),
  r5: require('../../assets/images/posters/poster_reel_5.jpg'),
  'reel-1': require('../../assets/images/posters/poster_reel_1.jpg'),
  'reel-2': require('../../assets/images/posters/poster_reel_2.jpg'),
  'reel-3': require('../../assets/images/posters/poster_reel_3.jpg'),
  'reel-4': require('../../assets/images/posters/poster_reel_4.jpg'),
  'reel-5': require('../../assets/images/posters/poster_reel_5.jpg'),
};

export function getVideoAsset(id: string): any | null {
  return VIDEO_ASSETS[id] ?? null;
}

export function getPosterAsset(id: string): any | null {
  return POSTER_ASSETS[id] ?? null;
}


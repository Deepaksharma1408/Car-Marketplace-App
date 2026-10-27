export const VIDEO_ASSETS: Record<string, any> = {
  v1: require('../../assets/videos/14281079_2160_3840_24fps.mp4'),
  v2: require('../../assets/videos/14281109_2160_3840_24fps.mp4'),
  v4: require('../../assets/videos/16052695-uhd_2160_3840_60fps.mp4'),
  v5: require('../../assets/videos/17100392_1440_2560_24fps.mp4'),
  v7: require('../../assets/videos/6872069-uhd_2160_3840_25fps.mp4'),
};

export function getVideoAsset(vehicleId: string): any | null {
  return VIDEO_ASSETS[vehicleId] ?? null;
}

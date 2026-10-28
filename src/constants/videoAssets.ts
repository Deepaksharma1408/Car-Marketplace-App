export const VIDEO_ASSETS: Record<string, any> = {
  r1: require('../../assets/videos/mobile/14281079_2160_3840_24fps.mp4'),
  r2: require('../../assets/videos/mobile/14281109_2160_3840_24fps.mp4'),
  r3: require('../../assets/videos/mobile/16052695-uhd_2160_3840_60fps.mp4'),
  r4: require('../../assets/videos/mobile/AQOF6spTQc9fOnfSOmABQINnWYIRUAPN-18qXn4q18txRRQXbg4EYYdZRWiQBJo0139778aoqH-dfIENmwFfqUfjd98Hwi5-rirdMjM.mp4'),
  r5: require('../../assets/videos/mobile/AQOLN34z306FwZFnQ6VGH_NFMe2gQPq1aU3VLYL_-NQ-ezeFmZjVFF_pwYVWS38ZJTGo1wPDLQMO6kcazeCJDORCzg_8cecvYmG755A.mp4'),
  r6: require('../../assets/videos/mobile/AQOZnbf_U2HxXdeyvh7uQ_XJn3zZTVRtc20dr_meg1c0DxKTAKSLb6R2O33OJKBn0UM2AB69yieXLiXWLEb3LZC4ErSoC8GeNuXM5vs.mp4'),
  // Aliases for compatibility
  'reel-1': require('../../assets/videos/mobile/14281079_2160_3840_24fps.mp4'),
  'reel-2': require('../../assets/videos/mobile/14281109_2160_3840_24fps.mp4'),
  'reel-3': require('../../assets/videos/mobile/16052695-uhd_2160_3840_60fps.mp4'),
  'reel-4': require('../../assets/videos/mobile/AQOF6spTQc9fOnfSOmABQINnWYIRUAPN-18qXn4q18txRRQXbg4EYYdZRWiQBJo0139778aoqH-dfIENmwFfqUfjd98Hwi5-rirdMjM.mp4'),
  'reel-5': require('../../assets/videos/mobile/AQOLN34z306FwZFnQ6VGH_NFMe2gQPq1aU3VLYL_-NQ-ezeFmZjVFF_pwYVWS38ZJTGo1wPDLQMO6kcazeCJDORCzg_8cecvYmG755A.mp4'),
  'reel-6': require('../../assets/videos/mobile/AQOZnbf_U2HxXdeyvh7uQ_XJn3zZTVRtc20dr_meg1c0DxKTAKSLb6R2O33OJKBn0UM2AB69yieXLiXWLEb3LZC4ErSoC8GeNuXM5vs.mp4'),
  v1: require('../../assets/videos/mobile/14281079_2160_3840_24fps.mp4'),
  v2: require('../../assets/videos/mobile/14281109_2160_3840_24fps.mp4'),
  v4: require('../../assets/videos/mobile/16052695-uhd_2160_3840_60fps.mp4'),
};

export const POSTER_ASSETS: Record<string, any> = {
  r1: require('../../assets/images/posters/poster_reel_1.jpg'),
  r2: require('../../assets/images/posters/poster_reel_2.jpg'),
  r3: require('../../assets/images/posters/poster_reel_3.jpg'),
  r4: require('../../assets/images/posters/poster_reel_4.jpg'),
  r5: require('../../assets/images/posters/poster_reel_5.jpg'),
  r6: require('../../assets/images/posters/poster_reel_6.jpg'),
  'reel-1': require('../../assets/images/posters/poster_reel_1.jpg'),
  'reel-2': require('../../assets/images/posters/poster_reel_2.jpg'),
  'reel-3': require('../../assets/images/posters/poster_reel_3.jpg'),
  'reel-4': require('../../assets/images/posters/poster_reel_4.jpg'),
  'reel-5': require('../../assets/images/posters/poster_reel_5.jpg'),
  'reel-6': require('../../assets/images/posters/poster_reel_6.jpg'),
};

export function getVideoAsset(id: string): any | null {
  return VIDEO_ASSETS[id] ?? null;
}

export function getPosterAsset(id: string): any | null {
  return POSTER_ASSETS[id] ?? null;
}

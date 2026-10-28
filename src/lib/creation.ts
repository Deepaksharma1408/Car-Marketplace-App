export type CreationMode = 'ready' | 'raw' | 'photos' | 'post';
export type MediaItem = { uri: string; type: 'image' | 'video'; name: string; duration: number; width: number; height: number; size: number };
export type VehicleForm = { title: string; make: string; model: string; year: string; price: string; mileage: string; location: string; description: string; horsepower: string };
export const CREATION_TITLES: Record<CreationMode, string> = { ready: 'Ready-Made Video', raw: 'Raw Clips with Template', photos: 'Photos-Only Listing', post: 'Post Vehicle Video' };
export const EMPTY_FORM: VehicleForm = { title: '', make: '', model: '', year: String(new Date().getFullYear()), price: '', mileage: '', location: 'Dubai', description: '', horsepower: '' };
export const TEMPLATES = [
  { id: 'monaco', name: 'Monaco Showcase', description: 'Blue title card with a gold accent.', color: '#0089C8' },
  { id: 'luxury', name: 'Luxury Spotlight', description: 'Champagne gold with a minimal specification strip.', color: '#C49B55' },
  { id: 'clean', name: 'Clean Walkaround', description: 'Quiet white caption with generous space for the car.', color: '#FFFFFF' },
] as const;

export function validateMedia(mode: CreationMode, media: MediaItem[]): string[] {
  const errors: string[] = [];
  const photo = mode === 'photos';
  if (photo ? media.length < 1 || media.length > 12 : mode === 'raw' ? media.length < 3 || media.length > 6 : media.length !== 1) errors.push(photo ? 'Choose 1–12 photos.' : mode === 'raw' ? 'Choose 3–6 video clips.' : 'Choose one video.');
  if (media.some(m => m.type !== (photo ? 'image' : 'video'))) errors.push(photo ? 'This path accepts photos only.' : 'This path accepts video clips only.');
  if (media.some(m => m.size > 100 * 1024 * 1024)) errors.push('Each file must be under 100 MB. Use a smaller mobile copy.');
  if (!photo && media.some(m => !Number.isFinite(m.duration) || m.duration <= 0)) errors.push('The duration of a video could not be read. Choose another file.');
  if (!photo && media.some(m => !Number.isFinite(m.width) || !Number.isFinite(m.height) || m.width <= 0 || m.height <= 0)) errors.push('The video dimensions could not be read. Choose another file.');
  if (!photo && media.reduce((sum, m) => sum + m.duration, 0) > 60000) errors.push('Keep the total video length within 60 seconds.');
  if (!photo && media.some(m => Math.max(m.width, m.height) > 1920)) errors.push('Choose 720p or 1080p videos for smooth mobile playback.');
  return errors;
}

export function validateDetails(mode: CreationMode, form: VehicleForm): string[] {
  const errors: string[] = [];
  if (form.title.trim().length < 6) errors.push('Enter a title of at least 6 characters.');
  if (!form.make.trim() || !form.model.trim()) errors.push('Enter the car make and model.');
  const year = Number(form.year);
  if (!Number.isInteger(year) || year < 1980 || year > new Date().getFullYear() + 1) errors.push('Enter a valid model year.');
  if (form.location.trim().length < 2) errors.push('Enter a location.');
  if (form.description.trim().length < 15) errors.push('Describe the car in at least 15 characters.');
  if (mode !== 'post') {
    if (!form.price.trim() || !Number.isFinite(Number(form.price)) || Number(form.price) <= 0 || Number(form.price) > 1e9) errors.push('Enter a valid selling price in AED.');
    if (!form.mileage.trim() || !Number.isFinite(Number(form.mileage)) || Number(form.mileage) < 0 || Number(form.mileage) > 1e7) errors.push('Enter a valid mileage in kilometres.');
  }
  return errors;
}

export type ListingType = 'listing' | 'social';
export type MediaType = 'video' | 'photo';
export type SellerType = 'verified_dealer' | 'private_seller' | 'creator';

export interface Seller {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  type: SellerType;
  verified: boolean;
  dealershipName?: string;
  location: string;
  phone?: string;
  whatsapp?: string;
  badgeText?: string;
}

export interface VehicleSpecs {
  engine: string;
  transmission: string;
  horsepower: string;
  acceleration: string; // 0-100 km/h
  fuelType: string;
  exteriorColor: string;
  interiorColor: string;
  regionalSpecs: string; // "GCC Specs"
  warranty: string;
  doors?: number;
  bodyType?: string;
}

export interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  userHandle: string;
  isVerified?: boolean;
  text: string;
  timestamp: string;
  likes: number;
}

export interface Vehicle {
  id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  priceAED?: number; // listings have price, social reels don't
  mileageKm?: number;
  location: string;
  listingType: ListingType;
  mediaType: MediaType;
  mediaUrls: string[];
  videoDuration?: string;
  isSimulatedVideo?: boolean;
  videoAsset?: any;
  posterAsset?: any;
  description: string;
  specs: VehicleSpecs;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  seller: Seller;
  createdAt: string;
  sampleComments?: Comment[];
  localPost?: boolean;
  clipUris?: string[];
  templateName?: string;
}

export interface SearchFilters {
  query: string;
  category: string;
  listingType: 'all' | 'listing' | 'social';
  mediaType: 'all' | 'video' | 'photo';
  priceRange: 'all' | 'under300k' | '300k-700k' | '700k-1.5m' | '1.5m-plus';
  verifiedOnly: boolean;
}

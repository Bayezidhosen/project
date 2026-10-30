export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  photoUrl?: string;
  createdAt: string;
}

export type StudioCategory = 
  | 'Photo Studio'
  | 'Film Stage'
  | 'Podcast Lounge'
  | 'Music Suite'
  | 'Art Workshop';

export interface Studio {
  id: string;
  title: string;
  category: StudioCategory;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string; // e.g. "Brooklyn, New York"
  address: string;  // e.g. "45 Grand St, Studio 4B"
  imageUrl: string;
  additionalImages?: string[];
  amenities: string[];
  description: string;
  hostName: string;
  hostEmail: string;
  hostAvatar?: string;
  rating: number;
  reviewsCount: number;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  userName: string;
  userEmail: string;
  bookingDate: string; // YYYY-MM-DD
  startTime: string;   // HH:mm (24h)
  endTime: string;     // HH:mm (24h)
  totalHours: number;
  hourlyPrice: number;
  securityDeposit: number;
  totalAmount: number;
  status: BookingStatus;
  hostEmail: string;
  createdAt: string;
}

export interface Review {
  id: string;
  studioId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  rating: number; // 1 - 5
  comment: string;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  userEmail: string;
  studioId: string;
  createdAt: string;
}

export interface AuthTokenPayload {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
}

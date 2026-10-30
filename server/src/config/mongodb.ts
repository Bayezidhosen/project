import { MongoClient, Db } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { Studio, Booking, User, Review, WishlistItem } from '../types/index.js';

interface DatabaseSchema {
  users: User[];
  studios: Studio[];
  bookings: Booking[];
  reviews: Review[];
  wishlists: WishlistItem[];
}

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Initial seed data using high-fidelity generated studio assets
export const INITIAL_STUDIOS: Studio[] = [
  {
    id: 'studio-cyc-01',
    title: 'The Daylight Infinity Cyc Stage',
    category: 'Photo Studio',
    hourlyRate: 145,
    securityDeposit: 250,
    maxCapacity: 25,
    location: 'Brooklyn, New York',
    address: '420 Kent Ave, Suite 300, Brooklyn, NY',
    imageUrl: '/src/assets/images/hero_cyclorama_studio_1793378836214.jpg',
    additionalImages: [
      '/src/assets/images/hero_cyclorama_studio_1793378836214.jpg',
      '/src/assets/images/film_stage_soundstage_1793378836054.jpg'
    ],
    amenities: [
      '30ft White Infinity Cyc',
      'Overhead Motorized Light Grid',
      'Profoto Strobes & C-Stands',
      'Client Lounge with Espresso Bar',
      'Stylist Vanity & Steamer',
      'High-Speed 1Gbps Fiber'
    ],
    description: 'An architectural 3,200 sq ft corner cyclorama stage equipped with seamless 30ft infinity curves, motorized overhead softbox diffusion, and full roll-in loading dock access. Perfect for high-fashion editorial, commercial lookbooks, and luxury campaign shoots.',
    hostName: 'Elena Rostova',
    hostEmail: 'elena@aperturehouse.com',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 4.95,
    reviewsCount: 38,
    featured: true,
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-01-15T10:00:00.000Z'
  },
  {
    id: 'studio-soundstage-02',
    title: 'Kitsuné Cinema Soundstage 4',
    category: 'Film Stage',
    hourlyRate: 280,
    securityDeposit: 500,
    maxCapacity: 60,
    location: 'Queens, New York',
    address: '34-12 36th St, Astoria, NY',
    imageUrl: '/src/assets/images/film_stage_soundstage_1793378836054.jpg',
    additionalImages: [
      '/src/assets/images/film_stage_soundstage_1793378836054.jpg',
      '/src/assets/images/hero_cyclorama_studio_1793378836214.jpg'
    ],
    amenities: [
      'Soundproofed STC-65 Acoustic Shell',
      'ARRI Skypanel Truss System',
      'J.L. Fisher Camera Dolly & Tracks',
      'Drive-in Elephant Door',
      'Green Room & Production Office',
      '3-Phase 400A Camlock Power'
    ],
    description: 'Tier-1 soundproofed film stage designed for narrative features, music videos, and cinematic commercials. Features 24ft grid height, sound-isolated acoustic treatment, complete DMX lighting console, and drive-in vehicle capability.',
    hostName: 'Marcus Vance',
    hostEmail: 'marcus@soundstageastoria.com',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 4.98,
    reviewsCount: 52,
    featured: true,
    createdAt: '2026-01-20T11:00:00.000Z',
    updatedAt: '2026-01-20T11:00:00.000Z'
  },
  {
    id: 'studio-podcast-03',
    title: 'The Velvet & Oak Broadcast Lounge',
    category: 'Podcast Lounge',
    hourlyRate: 95,
    securityDeposit: 150,
    maxCapacity: 8,
    location: 'Manhattan, New York',
    address: '180 Varick St, 9th Floor, New York, NY',
    imageUrl: '/src/assets/images/podcast_lounge_neon_1793378837013.jpg',
    additionalImages: [
      '/src/assets/images/podcast_lounge_neon_1793378837013.jpg'
    ],
    amenities: [
      '4x Shure SM7B Microphones',
      'RØDECaster Pro II Mixer',
      '3x 4K Sony FX3 Camera Setup',
      'Acoustic Walnut Slat Paneling',
      'Custom Dimmable LED Backlighting',
      'Live Video Switcher & Stream Deck'
    ],
    description: 'An intimate, luxury podcast and video interview salon. Designed with custom acoustic timber slats, marble table centerpieces, broadcast-grade audio processing, and automated multi-angle 4K camera switching ready to record straight to SSD.',
    hostName: 'Sophia Lin',
    hostEmail: 'sophia@creatorsuite.nyc',
    hostAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    rating: 4.92,
    reviewsCount: 29,
    featured: true,
    createdAt: '2026-02-01T08:30:00.000Z',
    updatedAt: '2026-02-01T08:30:00.000Z'
  },
  {
    id: 'studio-music-04',
    title: 'Analog Vault Recording & Mastering Suite',
    category: 'Music Suite',
    hourlyRate: 160,
    securityDeposit: 300,
    maxCapacity: 12,
    location: 'Greenpoint, New York',
    address: '67 West St, Brooklyn, NY',
    imageUrl: '/src/assets/images/music_recording_suite_1793378838029.jpg',
    additionalImages: [
      '/src/assets/images/music_recording_suite_1793378838029.jpg'
    ],
    amenities: [
      'Neve Genesys Black Console',
      'Genelec 8351B Smart Active Monitors',
      'Vintage U47 & Neumann Mics',
      'Acoustic Diffuser Wall Treatment',
      'Isolated Vocal & Drum Booth',
      'Pro Tools Ultimate HDX System'
    ],
    description: 'World-class recording, mixing, and mastering environment tuned by master acousticians. Features hybrid analog-digital routing with classic outboard gear (Tube-Tech CL1B, Pultec EQ, 1176LN) and an isolated live room.',
    hostName: 'Julian Grey',
    hostEmail: 'julian@soundvaultnyc.com',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 4.97,
    reviewsCount: 44,
    featured: true,
    createdAt: '2026-02-10T14:00:00.000Z',
    updatedAt: '2026-02-10T14:00:00.000Z'
  },
  {
    id: 'studio-art-05',
    title: 'Sunlit Industrial Clay & Atelier Loft',
    category: 'Art Workshop',
    hourlyRate: 85,
    securityDeposit: 120,
    maxCapacity: 30,
    location: 'Long Island City, New York',
    address: '43-01 21st St, Studio 510, LIC, NY',
    imageUrl: '/src/assets/images/art_craft_loft_workshop_1793378838996.jpg',
    additionalImages: [
      '/src/assets/images/art_craft_loft_workshop_1793378838996.jpg'
    ],
    amenities: [
      'Large Heavy Timber Worktables',
      'Floor-to-Ceiling Factory Windows',
      'Ceramic Wheels & Clay Station',
      'High-Ventilation Fume Exhaust',
      'Easel Stations & Canvas Racks',
      'Natural North-Facing Light'
    ],
    description: 'A 2,500 sq ft daylight loft bathed in continuous natural light from historic factory windows. Tailored for ceramic workshops, fine art painting, sculpting classes, architectural modeling, and creative group ateliers.',
    hostName: 'Chloe Bennett',
    hostEmail: 'chloe@atelierlic.com',
    hostAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    rating: 4.89,
    reviewsCount: 23,
    featured: true,
    createdAt: '2026-02-18T09:15:00.000Z',
    updatedAt: '2026-02-18T09:15:00.000Z'
  },
  {
    id: 'studio-cyc-06',
    title: 'Hudson Daylight Penthouse & White Stage',
    category: 'Photo Studio',
    hourlyRate: 195,
    securityDeposit: 350,
    maxCapacity: 35,
    location: 'Chelsea, New York',
    address: '520 W 27th St, 11th Floor, New York, NY',
    imageUrl: '/src/assets/images/hero_cyclorama_studio_1793378836214.jpg',
    additionalImages: [
      '/src/assets/images/hero_cyclorama_studio_1793378836214.jpg'
    ],
    amenities: [
      'Wraparound Skyline Terrace Access',
      'Blackout Motorized Shades',
      'Broncolor Senso Lighting Kit',
      'Hair & Makeup Dual Station',
      'Commercial Kitchenette',
      'Freight Elevator 24/7'
    ],
    description: 'High-elevation creative penthouse featuring an expansive white studio floor, unobstructed southern light exposure, high ceilings, and panoramic views of Manhattan. Ideal for celebrity portraits, fashion commercials, and private exhibitions.',
    hostName: 'Elena Rostova',
    hostEmail: 'elena@aperturehouse.com',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 4.96,
    reviewsCount: 31,
    featured: true,
    createdAt: '2026-02-22T16:00:00.000Z',
    updatedAt: '2026-02-22T16:00:00.000Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    studioId: 'studio-cyc-01',
    userName: 'Alexander Wright',
    userEmail: 'alex@voguemedia.com',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'The lighting grid and infinity cyc were in pristine condition. Elena had the studio prepped with fresh paint and the high-speed tethering connection was rock solid. Will book every month!',
    createdAt: '2026-02-25T14:22:00.000Z'
  },
  {
    id: 'rev-02',
    studioId: 'studio-cyc-01',
    userName: 'Maya Hernandez',
    userEmail: 'maya@studioeight.co',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Spectacular space. The team loved the espresso lounge and the dressing room had plenty of mirrors and wardrobe steamers. 10/10 experience.',
    createdAt: '2026-02-28T18:05:00.000Z'
  },
  {
    id: 'rev-03',
    studioId: 'studio-soundstage-02',
    userName: 'David Sterling',
    userEmail: 'david@cinemaproductions.com',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Sound isolation is legitimate STC-65—we had zero spill from the street even during heavy traffic. The dolly track setup was effortless.',
    createdAt: '2026-03-02T11:40:00.000Z'
  },
  {
    id: 'rev-04',
    studioId: 'studio-podcast-03',
    userName: 'Sarah Jenkins',
    userEmail: 'sarah@founderpodcast.fm',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Best podcast room in Manhattan hands down. Sound treatment is dead quiet, lighting is flattering, and the Shure mics gave us broadcast warmth.',
    createdAt: '2026-03-05T09:15:00.000Z'
  }
];

class DatabaseManager {
  private memoryData: DatabaseSchema;
  private mongoClient: MongoClient | null = null;
  private mongoDb: Db | null = null;
  private isConnectedToMongo = false;

  constructor() {
    this.memoryData = {
      users: [],
      studios: [...INITIAL_STUDIOS],
      bookings: [],
      reviews: [...INITIAL_REVIEWS],
      wishlists: []
    };
    this.ensureDataDirectory();
    this.loadFromDisk();
  }

  private ensureDataDirectory() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch {
      // Ignore if exists or cannot write
    }
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.memoryData = {
          users: parsed.users || [],
          studios: parsed.studios && parsed.studios.length > 0 ? parsed.studios : [...INITIAL_STUDIOS],
          bookings: parsed.bookings || [],
          reviews: parsed.reviews && parsed.reviews.length > 0 ? parsed.reviews : [...INITIAL_REVIEWS],
          wishlists: parsed.wishlists || []
        };
      } else {
        this.saveToDisk();
      }
    } catch (e) {
      console.warn('Fallback: Using in-memory dataset', e);
    }
  }

  public saveToDisk() {
    try {
      this.ensureDataDirectory();
      fs.writeFileSync(DB_FILE, JSON.stringify(this.memoryData, null, 2), 'utf-8');
    } catch {
      // Memory store still works
    }
  }

  public async connect(): Promise<void> {
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.includes('<username>')) {
      console.log('MongoDB: No valid URI provided. Running on production JSON-backed database store.');
      return;
    }

    try {
      this.mongoClient = new MongoClient(uri);
      await this.mongoClient.connect();
      this.mongoDb = this.mongoClient.db('studiospace');
      this.isConnectedToMongo = true;
      console.log('MongoDB: Connected successfully to MongoDB Atlas database "studiospace".');

      // Create indexes
      const studiosCol = this.mongoDb.collection('studios');
      await studiosCol.createIndex({ category: 1, location: 1, createdAt: -1 });
      await studiosCol.createIndex({ hostEmail: 1 });

      const bookingsCol = this.mongoDb.collection('bookings');
      await bookingsCol.createIndex({ studioId: 1, bookingDate: 1, status: 1 });
      await bookingsCol.createIndex({ userEmail: 1 });

      // Seed if empty
      const studioCount = await studiosCol.countDocuments();
      if (studioCount === 0) {
        await studiosCol.insertMany(INITIAL_STUDIOS as any);
        await this.mongoDb.collection('reviews').insertMany(INITIAL_REVIEWS as any);
        console.log('MongoDB: Seeded initial studios and reviews into MongoDB Atlas.');
      }
    } catch (err) {
      console.warn('MongoDB Atlas connection failed. Falling back to robust persisted file store:', err);
      this.isConnectedToMongo = false;
    }
  }

  // --- Users ---
  public async findUserByEmail(email: string): Promise<User | undefined> {
    const cleanEmail = email.toLowerCase().trim();
    if (this.isConnectedToMongo && this.mongoDb) {
      const user = await this.mongoDb.collection<User>('users').findOne({ email: cleanEmail });
      return user || undefined;
    }
    return this.memoryData.users.find(u => u.email.toLowerCase() === cleanEmail);
  }

  public async createUser(user: User): Promise<User> {
    user.email = user.email.toLowerCase().trim();
    if (this.isConnectedToMongo && this.mongoDb) {
      await this.mongoDb.collection('users').insertOne(user as any);
    }
    this.memoryData.users.push(user);
    this.saveToDisk();
    return user;
  }

  // --- Studios ---
  public async getStudios(filters?: {
    category?: string;
    search?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    limit?: number;
  }): Promise<Studio[]> {
    let results = [...this.memoryData.studios];

    if (this.isConnectedToMongo && this.mongoDb) {
      try {
        const query: any = {};
        if (filters?.category && filters.category !== 'All') {
          query.category = filters.category;
        }
        if (filters?.location) {
          query.location = { $regex: filters.location, $options: 'i' };
        }
        if (filters?.minPrice || filters?.maxPrice) {
          query.hourlyRate = {};
          if (filters.minPrice !== undefined) query.hourlyRate.$gte = filters.minPrice;
          if (filters.maxPrice !== undefined) query.hourlyRate.$lte = filters.maxPrice;
        }
        if (filters?.search) {
          query.$or = [
            { title: { $regex: filters.search, $options: 'i' } },
            { description: { $regex: filters.search, $options: 'i' } },
            { location: { $regex: filters.search, $options: 'i' } }
          ];
        }

        let cursor = this.mongoDb.collection<Studio>('studios').find(query);
        if (filters?.sortBy === 'price_asc') cursor = cursor.sort({ hourlyRate: 1 });
        else if (filters?.sortBy === 'price_desc') cursor = cursor.sort({ hourlyRate: -1 });
        else if (filters?.sortBy === 'rating') cursor = cursor.sort({ rating: -1 });
        else cursor = cursor.sort({ createdAt: -1 });

        if (filters?.limit) cursor = cursor.limit(filters.limit);
        const docs = await cursor.toArray();
        if (docs.length > 0) return docs;
      } catch (e) {
        console.warn('MongoDB query failed, falling back to local dataset', e);
      }
    }

    // Local in-memory filtering
    if (filters?.category && filters.category !== 'All') {
      results = results.filter(s => s.category.toLowerCase() === filters.category!.toLowerCase());
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.amenities.some(a => a.toLowerCase().includes(q))
      );
    }
    if (filters?.location) {
      const loc = filters.location.toLowerCase();
      results = results.filter(s => s.location.toLowerCase().includes(loc));
    }
    if (filters?.minPrice !== undefined) {
      results = results.filter(s => s.hourlyRate >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined) {
      results = results.filter(s => s.hourlyRate <= filters.maxPrice!);
    }

    if (filters?.sortBy === 'price_asc') {
      results.sort((a, b) => a.hourlyRate - b.hourlyRate);
    } else if (filters?.sortBy === 'price_desc') {
      results.sort((a, b) => b.hourlyRate - a.hourlyRate);
    } else if (filters?.sortBy === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    } else {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    if (filters?.limit) {
      results = results.slice(0, filters.limit);
    }

    return results;
  }

  public async getStudioById(id: string): Promise<Studio | undefined> {
    if (this.isConnectedToMongo && this.mongoDb) {
      const doc = await this.mongoDb.collection<Studio>('studios').findOne({ id });
      if (doc) return doc;
    }
    return this.memoryData.studios.find(s => s.id === id);
  }

  public async createStudio(studio: Studio): Promise<Studio> {
    if (this.isConnectedToMongo && this.mongoDb) {
      await this.mongoDb.collection('studios').insertOne(studio as any);
    }
    this.memoryData.studios.unshift(studio);
    this.saveToDisk();
    return studio;
  }

  public async updateStudio(id: string, updates: Partial<Studio>): Promise<Studio | undefined> {
    const idx = this.memoryData.studios.findIndex(s => s.id === id);
    if (idx === -1) return undefined;

    const updated = {
      ...this.memoryData.studios[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.memoryData.studios[idx] = updated;
    this.saveToDisk();

    if (this.isConnectedToMongo && this.mongoDb) {
      await this.mongoDb.collection('studios').updateOne({ id }, { $set: updated });
    }
    return updated;
  }

  public async deleteStudio(id: string): Promise<boolean> {
    const initialLen = this.memoryData.studios.length;
    this.memoryData.studios = this.memoryData.studios.filter(s => s.id !== id);
    const deleted = this.memoryData.studios.length < initialLen;
    if (deleted) {
      this.saveToDisk();
      if (this.isConnectedToMongo && this.mongoDb) {
        await this.mongoDb.collection('studios').deleteOne({ id });
      }
    }
    return deleted;
  }

  public async getStudiosByHost(hostEmail: string): Promise<Studio[]> {
    const cleanEmail = hostEmail.toLowerCase().trim();
    if (this.isConnectedToMongo && this.mongoDb) {
      const docs = await this.mongoDb.collection<Studio>('studios').find({ hostEmail: cleanEmail }).toArray();
      if (docs.length > 0) return docs;
    }
    return this.memoryData.studios.filter(s => s.hostEmail.toLowerCase() === cleanEmail);
  }

  // --- Bookings ---
  public async getBookingsByUser(userEmail: string): Promise<Booking[]> {
    const cleanEmail = userEmail.toLowerCase().trim();
    if (this.isConnectedToMongo && this.mongoDb) {
      const docs = await this.mongoDb.collection<Booking>('bookings').find({ userEmail: cleanEmail }).sort({ createdAt: -1 }).toArray();
      if (docs.length > 0) return docs;
    }
    return this.memoryData.bookings
      .filter(b => b.userEmail.toLowerCase() === cleanEmail)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async getBookingsByHost(hostEmail: string): Promise<Booking[]> {
    const cleanEmail = hostEmail.toLowerCase().trim();
    if (this.isConnectedToMongo && this.mongoDb) {
      const docs = await this.mongoDb.collection<Booking>('bookings').find({ hostEmail: cleanEmail }).sort({ createdAt: -1 }).toArray();
      if (docs.length > 0) return docs;
    }
    return this.memoryData.bookings
      .filter(b => b.hostEmail.toLowerCase() === cleanEmail)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async getBookingById(id: string): Promise<Booking | undefined> {
    if (this.isConnectedToMongo && this.mongoDb) {
      const doc = await this.mongoDb.collection<Booking>('bookings').findOne({ id });
      if (doc) return doc;
    }
    return this.memoryData.bookings.find(b => b.id === id);
  }

  public async findConflictingBookings(
    studioId: string,
    bookingDate: string,
    startTime: string,
    endTime: string
  ): Promise<Booking[]> {
    // Check bookings for this studio on this date that are NOT cancelled
    const activeBookings = this.memoryData.bookings.filter(
      b => b.studioId === studioId &&
           b.bookingDate === bookingDate &&
           b.status !== 'cancelled'
    );

    // Conflict exists if intervals overlap: max(A_start, B_start) < min(A_end, B_end)
    return activeBookings.filter(b => {
      return (b.startTime < endTime) && (b.endTime > startTime);
    });
  }

  public async createBooking(booking: Booking): Promise<Booking> {
    if (this.isConnectedToMongo && this.mongoDb) {
      await this.mongoDb.collection('bookings').insertOne(booking as any);
    }
    this.memoryData.bookings.unshift(booking);
    this.saveToDisk();
    return booking;
  }

  public async updateBookingStatus(id: string, status: Booking['status']): Promise<Booking | undefined> {
    const idx = this.memoryData.bookings.findIndex(b => b.id === id);
    if (idx === -1) return undefined;

    this.memoryData.bookings[idx].status = status;
    this.saveToDisk();

    if (this.isConnectedToMongo && this.mongoDb) {
      await this.mongoDb.collection('bookings').updateOne({ id }, { $set: { status } });
    }
    return this.memoryData.bookings[idx];
  }

  // --- Reviews ---
  public async getReviewsByStudio(studioId: string): Promise<Review[]> {
    return this.memoryData.reviews
      .filter(r => r.studioId === studioId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async addReview(review: Review): Promise<Review> {
    this.memoryData.reviews.unshift(review);
    // Recalculate studio rating
    const studioReviews = this.memoryData.reviews.filter(r => r.studioId === review.studioId);
    const avgRating = studioReviews.reduce((sum, r) => sum + r.rating, 0) / studioReviews.length;
    await this.updateStudio(review.studioId, {
      rating: Number(avgRating.toFixed(2)),
      reviewsCount: studioReviews.length
    });
    this.saveToDisk();
    return review;
  }

  // --- Wishlists ---
  public async getWishlist(userEmail: string): Promise<string[]> {
    const cleanEmail = userEmail.toLowerCase().trim();
    return this.memoryData.wishlists
      .filter(w => w.userEmail.toLowerCase() === cleanEmail)
      .map(w => w.studioId);
  }

  public async toggleWishlist(userEmail: string, studioId: string): Promise<{ saved: boolean }> {
    const cleanEmail = userEmail.toLowerCase().trim();
    const existingIdx = this.memoryData.wishlists.findIndex(
      w => w.userEmail.toLowerCase() === cleanEmail && w.studioId === studioId
    );

    if (existingIdx >= 0) {
      this.memoryData.wishlists.splice(existingIdx, 1);
      this.saveToDisk();
      return { saved: false };
    } else {
      this.memoryData.wishlists.push({
        id: `wish-${Date.now()}`,
        userEmail: cleanEmail,
        studioId,
        createdAt: new Date().toISOString()
      });
      this.saveToDisk();
      return { saved: true };
    }
  }
}

export const db = new DatabaseManager();

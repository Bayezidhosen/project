import React, { useEffect, useState } from 'react';
import { Studio, StudioCategory } from '../types';
import { api } from '../services/api';
import { StudioCard } from '../components/StudioCard';
import { Search, Filter, SlidersHorizontal, MapPin, X, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ExplorePageProps {
  navigate: (path: string) => void;
  initialCategory?: string;
}

const CATEGORIES: ('All' | StudioCategory)[] = [
  'All',
  'Photo Studio',
  'Film Stage',
  'Podcast Lounge',
  'Music Suite',
  'Art Workshop'
];

export const ExplorePage: React.FC<ExplorePageProps> = ({ navigate, initialCategory }) => {
  const { user } = useAuth();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Filters
  const [category, setCategory] = useState<string>(initialCategory || 'All');
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(350);
  const [sortBy, setSortBy] = useState('newest');

  // Load wishlist if logged in
  useEffect(() => {
    if (user) {
      api.getWishlist()
        .then(res => {
          if (res.success) setWishlist(res.wishlist);
        })
        .catch(() => {});
    }
  }, [user]);

  // Fetch studios on filter change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api.getStudios({
      category: category === 'All' ? undefined : category,
      search: search.trim() || undefined,
      location: location.trim() || undefined,
      maxPrice: maxPrice < 350 ? maxPrice : undefined,
      sortBy
    })
      .then(res => {
        if (isMounted && res.success) {
          setStudios(res.studios);
        }
      })
      .catch(err => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [category, search, location, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setCategory('All');
    setSearch('');
    setLocation('');
    setMaxPrice(350);
    setSortBy('newest');
  };

  const handleWishlistChange = (studioId: string, saved: boolean) => {
    setWishlist(prev =>
      saved ? [...prev, studioId] : prev.filter(id => id !== studioId)
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full min-h-[80vh]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
          Explore Creative Spaces
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#A1AAB9]">
          Discover vetted soundstages, cycloramas, podcast lounges, and recording suites.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#181F2B] border border-[#293344] rounded-2xl p-4 sm:p-5 mb-8 shadow-sm space-y-4">
        {/* Search & Location row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#A1AAB9] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, equipment or keywords..."
              className="w-full bg-[#10151F] border border-[#293344] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F8FAFC] placeholder:text-slate-500 focus:outline-none focus:border-[#C5F36A]"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="relative flex items-center">
            <MapPin className="w-4 h-4 text-[#A1AAB9] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Filter by city (e.g. Brooklyn, Queens, Chelsea)..."
              className="w-full bg-[#10151F] border border-[#293344] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F8FAFC] placeholder:text-slate-500 focus:outline-none focus:border-[#C5F36A]"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#10151F] border border-[#293344] rounded-xl px-3 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#C5F36A]"
            >
              <option value="newest">Sort: Newest Listed</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            <button
              onClick={handleResetFilters}
              className="p-2.5 rounded-xl border border-[#293344] bg-[#10151F] text-[#A1AAB9] hover:text-white hover:border-[#C5F36A] transition-colors shrink-0"
              title="Reset all filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories segmented tabs & Price range */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3 border-t border-[#293344]">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  category === cat
                    ? 'bg-[#C5F36A] text-[#10151F] shadow-sm'
                    : 'bg-[#10151F] text-[#A1AAB9] hover:text-white hover:bg-[#293344]/40 border border-[#293344]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Price Range Slider */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-[#A1AAB9] whitespace-nowrap">
              Max rate: <strong className="text-white tabular-nums">${maxPrice}/hr</strong>
            </span>
            <input
              type="range"
              min="50"
              max="350"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-32 accent-[#C5F36A] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs text-[#A1AAB9]">
          Showing <strong className="text-white">{studios.length}</strong> available spaces
        </p>
      </div>

      {/* Grid or Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-84 rounded-2xl bg-[#181F2B] border border-[#293344] animate-pulse" />
          ))}
        </div>
      ) : studios.length === 0 ? (
        <div className="text-center py-20 bg-[#181F2B] border border-[#293344] rounded-2xl p-8 max-w-lg mx-auto">
          <Filter className="w-10 h-10 text-[#C5F36A] mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-bold text-white">No spaces match your criteria</h3>
          <p className="text-xs text-[#A1AAB9] mt-1 leading-relaxed">
            Try adjusting your search terms, expanding the price range, or choosing "All" categories.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-5 px-5 py-2.5 rounded-xl bg-[#C5F36A] text-[#10151F] font-bold text-xs hover:bg-[#b0de57] transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studios.map((studio) => (
            <StudioCard
              key={studio.id}
              studio={studio}
              isWishlisted={wishlist.includes(studio.id)}
              onWishlistChange={handleWishlistChange}
              onSelect={(id) => navigate(`/studios/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

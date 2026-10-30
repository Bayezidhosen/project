import React, { useEffect, useState } from 'react';
import { Studio } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StudioCard } from '../components/StudioCard';
import { Heart, ArrowRight } from 'lucide-react';

interface WishlistPageProps {
  navigate: (path: string) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([api.getWishlist(), api.getStudios()])
        .then(([wRes, sRes]) => {
          if (wRes.success && sRes.success) {
            const savedList = sRes.studios.filter(s => wRes.wishlist.includes(s.id));
            setStudios(savedList);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-white">Sign In Required</h2>
        <p className="text-xs text-[#A1AAB9] mt-2">Sign in to view your saved studio wishlist.</p>
        <button
          onClick={() => navigate('/login')}
          className="mt-5 px-5 py-2.5 rounded-xl bg-[#C5F36A] text-[#10151F] font-bold text-xs"
        >
          Sign In
        </button>
      </div>
    );
  }

  const handleWishlistChange = (studioId: string, saved: boolean) => {
    if (!saved) {
      setStudios(prev => prev.filter(s => s.id !== studioId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full min-h-[80vh]">
      <div className="mb-8">
        <span className="text-xs font-mono text-[#C5F36A] uppercase tracking-wider">
          Saved Workspaces
        </span>
        <h1 className="font-display text-3xl font-extrabold text-[#F8FAFC] tracking-tight mt-1">
          Your Studio Wishlist
        </h1>
        <p className="text-xs text-[#A1AAB9] mt-1">
          Keep track of your favorite soundstages, cycloramas, and recording suites for upcoming productions.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 rounded-2xl bg-[#181F2B] border border-[#293344] animate-pulse" />
          ))}
        </div>
      ) : studios.length === 0 ? (
        <div className="text-center py-20 bg-[#181F2B] border border-[#293344] rounded-3xl p-8 max-w-lg mx-auto space-y-4">
          <Heart className="w-12 h-12 text-rose-400 mx-auto opacity-60" />
          <h3 className="text-lg font-bold text-white">Your Wishlist is Empty</h3>
          <p className="text-xs text-[#A1AAB9] leading-relaxed">
            Click the heart icon on any studio listing while exploring to save it for quick booking.
          </p>
          <button
            onClick={() => navigate('/studios')}
            className="px-5 py-2.5 rounded-xl bg-[#C5F36A] text-[#10151F] font-bold text-xs"
          >
            Explore Studios Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studios.map(studio => (
            <StudioCard
              key={studio.id}
              studio={studio}
              isWishlisted={true}
              onWishlistChange={handleWishlistChange}
              onSelect={(id) => navigate(`/studios/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

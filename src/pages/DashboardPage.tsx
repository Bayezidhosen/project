import React, { useEffect, useState } from 'react';
import { Studio, Booking } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Grid,
  Heart,
  DollarSign,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface DashboardPageProps {
  navigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ navigate }) => {
  const { user } = useAuth();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [studios, setStudios] = useState<Studio[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([
        api.getUserBookings().catch(() => ({ success: true, count: 0, bookings: [] })),
        api.getMyStudios().catch(() => ({ success: true, count: 0, studios: [] })),
        api.getWishlist().catch(() => ({ success: true, wishlist: [] }))
      ]).then(([bRes, sRes, wRes]) => {
        if (bRes.success) setBookings(bRes.bookings);
        if (sRes.success) setStudios(sRes.studios);
        if (wRes.success) setWishlistCount(wRes.wishlist.length);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-white">Sign In Required</h2>
        <p className="text-xs text-[#A1AAB9] mt-2">
          Sign in to access your unified Creator & Host dashboard.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="mt-5 px-5 py-2.5 rounded-xl bg-[#C5F36A] text-[#10151F] font-bold text-xs"
        >
          Sign In
        </button>
      </div>
    );
  }

  const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const hostEarnings = studios.reduce((acc, s) => acc + (s.hourlyRate * 8), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full min-h-[80vh]">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-mono text-[#C5F36A] uppercase tracking-wider">
            Creator Hub
          </span>
          <h1 className="font-display text-3xl font-extrabold text-[#F8FAFC] tracking-tight mt-1">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs text-[#A1AAB9] mt-1">
            Overview of your production shoot schedules, spaces, and workspace performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/studios')}
            className="px-4 py-2.5 rounded-xl border border-[#293344] bg-[#181F2B] text-xs font-semibold text-white hover:border-[#C5F36A] transition-colors"
          >
            Explore Studios
          </button>
          <button
            onClick={() => navigate('/add-studio')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C5F36A] text-[#10151F] font-bold text-xs uppercase tracking-wider hover:bg-[#b0de57] transition-all shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            Host Space
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="p-5 rounded-2xl bg-[#181F2B] border border-[#293344] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A1AAB9]">
            <span>Active Reservations</span>
            <Calendar className="w-4 h-4 text-[#C5F36A]" />
          </div>
          <div className="text-2xl font-black text-white tabular-nums">
            {activeBookings.length}
          </div>
          <span className="text-[11px] text-slate-500 block">Upcoming shoot dates</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#181F2B] border border-[#293344] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A1AAB9]">
            <span>Hosted Studios</span>
            <Grid className="w-4 h-4 text-[#C5F36A]" />
          </div>
          <div className="text-2xl font-black text-white tabular-nums">
            {studios.length}
          </div>
          <span className="text-[11px] text-slate-500 block">Published creative spaces</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#181F2B] border border-[#293344] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A1AAB9]">
            <span>Saved in Wishlist</span>
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white tabular-nums">
            {wishlistCount}
          </div>
          <span className="text-[11px] text-slate-500 block">Bookmarked soundstages</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#181F2B] border border-[#293344] space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A1AAB9]">
            <span>Host Earnings Potential</span>
            <TrendingUp className="w-4 h-4 text-[#C5F36A]" />
          </div>
          <div className="text-2xl font-black text-white tabular-nums">
            ${hostEarnings.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 block">Est. 8hr production week</span>
        </div>
      </div>

      {/* 2-Column Split: Upcoming Bookings + Your Studios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Upcoming Shoot Bookings */}
        <div className="p-6 rounded-3xl bg-[#181F2B] border border-[#293344] space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white">Upcoming Production Sessions</h3>
            <button
              onClick={() => navigate('/my-bookings')}
              className="text-xs font-semibold text-[#C5F36A] hover:underline flex items-center gap-1"
            >
              All Bookings <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-10 text-xs text-[#A1AAB9] italic">
              No sessions scheduled. Browse studios to book your next shoot.
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 3).map((b) => (
                <div
                  key={b.id}
                  onClick={() => navigate('/my-bookings')}
                  className="p-3.5 rounded-xl bg-[#10151F] border border-[#293344] flex items-center justify-between gap-4 cursor-pointer hover:border-[#C5F36A]/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{b.studioTitle}</p>
                    <p className="text-[11px] text-[#A1AAB9]">
                      {b.bookingDate} · {b.startTime} - {b.endTime}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-white font-mono">${b.totalAmount.toFixed(2)}</span>
                    <span className="block text-[10px] text-[#C5F36A] capitalize">{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Hosted Studios */}
        <div className="p-6 rounded-3xl bg-[#181F2B] border border-[#293344] space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white">Your Listed Stages</h3>
            <button
              onClick={() => navigate('/my-listings')}
              className="text-xs font-semibold text-[#C5F36A] hover:underline flex items-center gap-1"
            >
              Manage Listings <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {studios.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <p className="text-xs text-[#A1AAB9]">You haven't listed any creative stages yet.</p>
              <button
                onClick={() => navigate('/add-studio')}
                className="px-4 py-2 rounded-xl bg-[#C5F36A] text-[#10151F] font-bold text-xs"
              >
                List a Studio
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {studios.slice(0, 3).map((s) => (
                <div
                  key={s.id}
                  onClick={() => navigate(`/studios/${s.id}`)}
                  className="p-3.5 rounded-xl bg-[#10151F] border border-[#293344] flex items-center justify-between gap-4 cursor-pointer hover:border-[#C5F36A]/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{s.title}</p>
                    <p className="text-[11px] text-[#A1AAB9]">{s.category} · {s.location}</p>
                  </div>
                  <span className="text-xs font-bold text-[#C5F36A] font-mono shrink-0">
                    ${s.hourlyRate}/hr
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Studio } from '../types';
import { Star, MapPin, Heart, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

interface StudioCardProps {
  studio: Studio;
  onSelect: (id: string) => void;
  isWishlisted?: boolean;
  onWishlistChange?: (studioId: string, saved: boolean) => void;
}

export const StudioCard: React.FC<StudioCardProps> = ({
  studio,
  onSelect,
  isWishlisted = false,
  onWishlistChange
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [saved, setSaved] = useState(isWishlisted);
  const [saving, setSaving] = useState(false);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.info('Please sign in to save studios to your wishlist.');
      return;
    }

    setSaving(true);
    try {
      const res = await api.toggleWishlist(studio.id);
      setSaved(res.saved);
      onWishlistChange?.(studio.id, res.saved);
      toast.success(res.saved ? 'Studio added to your wishlist.' : 'Removed from wishlist.');
    } catch {
      toast.error('Failed to update wishlist.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={() => onSelect(studio.id)}
      className="group cursor-pointer flex flex-col bg-[#181F2B] dark:bg-[#181F2B] light:bg-white border border-[#293344] dark:border-[#293344] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#C5F36A]/50 transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Studio Image with Overlay */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <img
          src={studio.imageUrl}
          alt={studio.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Elegant fallback if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        
        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          disabled={saving}
          className="absolute top-3 right-3 p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors z-10"
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              saved ? 'fill-rose-500 text-rose-500' : 'text-white'
            }`}
          />
        </button>

        {/* Capacity indicator */}
        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1.5">
          <Users className="w-3 h-3 text-[#C5F36A]" />
          <span>Up to {studio.maxCapacity} creators</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Metadata: Category & Location separated cleanly without static pill boxes */}
          <div className="flex items-center gap-2 text-xs text-[#A1AAB9] font-medium mb-2">
            <span className="text-[#C5F36A] font-semibold">{studio.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 shrink-0" />
              {studio.location}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-[#C5F36A] transition-colors line-clamp-1">
            {studio.title}
          </h3>

          {/* Short description preview */}
          <p className="mt-1.5 text-xs text-[#A1AAB9] line-clamp-2 leading-relaxed">
            {studio.description}
          </p>
        </div>

        {/* Footer: Price & Rating */}
        <div className="mt-4 pt-3 border-t border-[#293344] flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-[#F8FAFC] tracking-tight tabular-nums">
              ${studio.hourlyRate}
            </span>
            <span className="text-xs text-[#A1AAB9]">/ hour</span>
          </div>

          <div className="flex items-center gap-1 text-xs font-semibold text-[#F8FAFC]">
            <Star className="w-3.5 h-3.5 fill-[#C5F36A] text-[#C5F36A]" />
            <span className="tabular-nums">{studio.rating}</span>
            <span className="text-[#A1AAB9] font-normal">({studio.reviewsCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

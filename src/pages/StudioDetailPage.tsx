import React, { useEffect, useState } from 'react';
import { Studio, Review } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import confetti from 'canvas-confetti';
import {
  Star,
  MapPin,
  Users,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  Heart,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

interface StudioDetailPageProps {
  studioId: string;
  navigate: (path: string) => void;
}

export const StudioDetailPage: React.FC<StudioDetailPageProps> = ({ studioId, navigate }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Booking Form State
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [bookingDate, setBookingDate] = useState(tomorrowStr);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('14:00');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Review Form Modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api.getStudioById(studioId)
      .then(res => {
        if (isMounted && res.success) {
          setStudio(res.studio);
          setReviews(res.reviews);
        }
      })
      .catch(err => {
        console.error(err);
        toast.error('Could not load studio details.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    if (user) {
      api.getWishlist()
        .then(res => {
          if (isMounted && res.success) {
            setIsWishlisted(res.wishlist.includes(studioId));
          }
        })
        .catch(() => {});
    }

    return () => {
      isMounted = false;
    };
  }, [studioId, user]);

  // Compute calculated pricing
  const calculateTotal = () => {
    if (!studio) return { hours: 0, subtotal: 0, deposit: 0, total: 0 };
    const [sH, sM] = startTime.split(':').map(Number);
    const [eH, eM] = endTime.split(':').map(Number);
    const diffMin = (eH * 60 + eM) - (sH * 60 + sM);
    if (diffMin <= 0) return { hours: 0, subtotal: 0, deposit: studio.securityDeposit, total: 0 };

    const hours = Math.round((diffMin / 60) * 10) / 10;
    const subtotal = Math.round(hours * studio.hourlyRate * 100) / 100;
    const deposit = studio.securityDeposit || 0;
    const total = subtotal + deposit;

    return { hours, subtotal, deposit, total };
  };

  const pricing = calculateTotal();

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.info('Sign in to save this studio.');
      return;
    }
    try {
      const res = await api.toggleWishlist(studioId);
      setIsWishlisted(res.saved);
      toast.success(res.saved ? 'Saved to wishlist.' : 'Removed from wishlist.');
    } catch {
      toast.error('Failed to update wishlist.');
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    if (!user) {
      toast.info('Please sign in or create an account to book this space.');
      navigate('/login');
      return;
    }

    if (!studio) return;

    if (user.email.toLowerCase() === studio.hostEmail.toLowerCase()) {
      toast.error('You cannot reserve your own studio listing.');
      return;
    }

    if (startTime >= endTime) {
      setBookingError('End time must be later than start time.');
      return;
    }

    setBookingLoading(true);
    try {
      const res = await api.createBooking({
        studioId: studio.id,
        bookingDate,
        startTime,
        endTime
      });

      if (res.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        toast.success('Your session has been reserved! View in My Bookings.');
        setTimeout(() => {
          navigate('/my-bookings');
        }, 1200);
      }
    } catch (err: any) {
      setBookingError(err.message || 'Failed to complete reservation.');
      toast.error(err.message || 'Booking conflict detected.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.info('Sign in to leave a review.');
      return;
    }
    if (!reviewComment.trim()) {
      toast.error('Please write a comment for your review.');
      return;
    }

    setReviewSubmitting(true);
    try {
      const res = await api.addReview({
        studioId,
        rating: reviewRating,
        comment: reviewComment.trim()
      });

      if (res.success) {
        setReviews([res.review, ...reviews]);
        toast.success('Review submitted successfully!');
        setReviewModalOpen(false);
        setReviewComment('');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse space-y-6">
        <div className="h-96 rounded-3xl bg-[#181F2B]" />
        <div className="h-24 rounded-2xl bg-[#181F2B]" />
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="max-w-lg mx-auto py-24 text-center">
        <h2 className="text-2xl font-bold text-white">Studio Not Found</h2>
        <p className="text-xs text-[#A1AAB9] mt-2">The studio listing may have been unlisted or removed.</p>
        <button
          onClick={() => navigate('/studios')}
          className="mt-6 px-5 py-2.5 rounded-xl bg-[#C5F36A] text-[#10151F] font-bold text-xs"
        >
          Explore All Spaces
        </button>
      </div>
    );
  }

  const galleryImages = [studio.imageUrl, ...(studio.additionalImages || [])];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full min-h-screen">
      {/* Back button & Action bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/studios')}
          className="flex items-center gap-2 text-xs font-semibold text-[#A1AAB9] hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Explore
        </button>

        <button
          onClick={handleToggleWishlist}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#293344] bg-[#181F2B] text-xs text-[#F8FAFC] hover:border-rose-500/50 transition-colors"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
          <span>{isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}</span>
        </button>
      </div>

      {/* Main Grid: Gallery & Details (Left 7 cols) + Booking Sticky Box (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Media & Specifications */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Showcase Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-slate-900 border border-[#293344] shadow-xl">
              <img
                src={galleryImages[activeImageIdx] || studio.imageUrl}
                alt={studio.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300"
              />

              {galleryImages.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
                  <button
                    onClick={() => setActiveImageIdx(prev => (prev - 1 + galleryImages.length) % galleryImages.length)}
                    className="pointer-events-auto p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveImageIdx(prev => (prev + 1) % galleryImages.length)}
                    className="pointer-events-auto p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIdx(i)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIdx === i ? 'border-[#C5F36A] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Metadata */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#A1AAB9] mb-2">
              <span className="text-[#C5F36A]">{studio.category}</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-white">
                <MapPin className="w-3.5 h-3.5 text-[#C5F36A]" />
                {studio.address}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
              {studio.title}
            </h1>

            {/* Specs bar */}
            <div className="mt-4 flex flex-wrap items-center gap-6 py-3 border-y border-[#293344] text-xs text-[#A1AAB9]">
              <div className="flex items-center gap-1.5 font-medium">
                <Users className="w-4 h-4 text-[#C5F36A]" />
                <span>Max Capacity: <strong className="text-white">{studio.maxCapacity} crew</strong></span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Star className="w-4 h-4 fill-[#C5F36A] text-[#C5F36A]" />
                <span>Rating: <strong className="text-white">{studio.rating}</strong> ({reviews.length} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-[#C5F36A]" />
                <span>Host: <strong className="text-white">{studio.hostName}</strong></span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="font-bold text-base text-[#F8FAFC]">About This Creative Space</h3>
            <p className="text-xs sm:text-sm text-[#A1AAB9] leading-relaxed whitespace-pre-line">
              {studio.description}
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="space-y-4">
            <h3 className="font-bold text-base text-[#F8FAFC]">Included Studio Amenities & Rigging</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {studio.amenities.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-[#181F2B] border border-[#293344] text-xs text-[#F8FAFC]"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#C5F36A] shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Host Profile Card */}
          <div className="p-6 rounded-2xl bg-[#181F2B] border border-[#293344] flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={studio.hostAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(studio.hostName)}`}
                alt={studio.hostName}
                className="w-14 h-14 rounded-2xl object-cover bg-slate-800 border border-[#293344]"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-[#F8FAFC]">{studio.hostName}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C5F36A]/10 text-[#C5F36A]">
                    Verified Host
                  </span>
                </div>
                <p className="text-xs text-[#A1AAB9] mt-0.5">{studio.hostEmail}</p>
                <p className="text-[11px] text-slate-500 mt-1">Typical response time: Under 15 minutes</p>
              </div>
            </div>
          </div>

          {/* Reviews & Ratings Section */}
          <div className="space-y-6 pt-4 border-t border-[#293344]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-[#F8FAFC]">Creator Reviews</h3>
                <p className="text-xs text-[#A1AAB9]">
                  Verified feedback from filmmakers, photographers, and audio engineers.
                </p>
              </div>

              <button
                onClick={() => setReviewModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#181F2B] border border-[#293344] text-xs font-semibold text-[#C5F36A] hover:bg-[#293344] transition-colors"
              >
                Write a Review
              </button>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-[#A1AAB9] italic">No reviews yet. Be the first creator to book and leave a review!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl bg-[#181F2B] border border-[#293344] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(rev.userName)}`}
                          alt={rev.userName}
                          className="w-7 h-7 rounded-lg object-cover"
                        />
                        <span className="text-xs font-semibold text-white">{rev.userName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#C5F36A]">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#C5F36A]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#A1AAB9] leading-relaxed">{rev.comment}</p>
                    <p className="text-[10px] text-slate-500">{new Date(rev.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Booking Widget */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-[#181F2B] border border-[#293344] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
            {/* Price Header */}
            <div className="flex items-baseline justify-between pb-4 border-b border-[#293344]">
              <div>
                <span className="text-2xl font-black text-white tabular-nums">${studio.hourlyRate}</span>
                <span className="text-xs text-[#A1AAB9]"> / hour</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-[#F8FAFC]">
                <Star className="w-3.5 h-3.5 fill-[#C5F36A] text-[#C5F36A]" />
                <span>{studio.rating}</span>
                <span className="text-[#A1AAB9]">({reviews.length})</span>
              </div>
            </div>

            {/* Error Notification */}
            {bookingError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs leading-relaxed animate-in fade-in">
                {bookingError}
              </div>
            )}

            {/* Booking Form */}
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
                  Production Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#A1AAB9] absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                    className="w-full bg-[#10151F] border border-[#293344] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
                  />
                </div>
              </div>

              {/* Time Range Pickers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
                    Call Time (Start)
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-[#A1AAB9] absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                      className="w-full bg-[#10151F] border border-[#293344] rounded-xl pl-9 pr-2 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
                    Wrap Time (End)
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-[#A1AAB9] absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                      className="w-full bg-[#10151F] border border-[#293344] rounded-xl pl-9 pr-2 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Price Breakdown Box */}
              <div className="bg-[#10151F] border border-[#293344] rounded-2xl p-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-[#A1AAB9]">
                  <span>${studio.hourlyRate} × {pricing.hours} hours</span>
                  <span className="font-mono text-white">${pricing.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#A1AAB9]">
                  <span>Refundable Damage Deposit</span>
                  <span className="font-mono text-white">${pricing.deposit.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-[#293344] flex justify-between font-bold text-sm">
                  <span className="text-white">Estimated Total</span>
                  <span className="text-[#C5F36A] font-mono text-base">${pricing.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={bookingLoading || pricing.hours <= 0}
                className="w-full py-3.5 rounded-xl bg-[#C5F36A] text-[#10151F] font-bold text-xs uppercase tracking-wider hover:bg-[#b0de57] disabled:opacity-50 transition-all shadow-lg"
              >
                {bookingLoading ? 'Securing Space...' : 'Reserve Studio Space'}
              </button>

              <p className="text-[11px] text-center text-slate-500 leading-tight">
                Collision check active. You will not be charged if a scheduling conflict exists.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#181F2B] border border-[#293344] rounded-2xl w-full max-w-md p-6 text-white space-y-4">
            <h3 className="text-lg font-bold">Write a Studio Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#A1AAB9] mb-1">Star Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-slate-400 hover:text-[#C5F36A]"
                    >
                      <Star className={`w-6 h-6 ${reviewRating >= star ? 'fill-[#C5F36A] text-[#C5F36A]' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A1AAB9] mb-1">Your Production Experience</label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Detail lighting quality, acoustic treatment, host responsiveness..."
                  className="w-full bg-[#10151F] border border-[#293344] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 text-xs rounded-lg border border-[#293344] hover:bg-[#293344]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-[#C5F36A] text-[#10151F]"
                >
                  {reviewSubmitting ? 'Posting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Studio, StudioCategory } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ChevronLeft, DollarSign, Users, Image as ImageIcon } from 'lucide-react';

interface EditStudioPageProps {
  studioId: string;
  navigate: (path: string) => void;
}

const CATEGORIES: StudioCategory[] = [
  'Photo Studio',
  'Film Stage',
  'Podcast Lounge',
  'Music Suite',
  'Art Workshop'
];

export const EditStudioPage: React.FC<EditStudioPageProps> = ({ studioId, navigate }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<StudioCategory>('Photo Studio');
  const [hourlyRate, setHourlyRate] = useState<number | ''>('');
  const [securityDeposit, setSecurityDeposit] = useState<number | ''>('');
  const [maxCapacity, setMaxCapacity] = useState<number | ''>('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    api.getStudioById(studioId)
      .then(res => {
        if (res.success && res.studio) {
          const s = res.studio;
          // Verify ownership
          if (user && s.hostEmail.toLowerCase() !== user.email.toLowerCase()) {
            toast.error('Forbidden: You are not the owner of this studio.');
            navigate('/my-listings');
            return;
          }
          setTitle(s.title);
          setCategory(s.category);
          setHourlyRate(s.hourlyRate);
          setSecurityDeposit(s.securityDeposit);
          setMaxCapacity(s.maxCapacity);
          setLocation(s.location);
          setAddress(s.address);
          setImageUrl(s.imageUrl);
          setDescription(s.description);
        }
      })
      .catch(err => {
        toast.error('Failed to load studio details.');
        navigate('/my-listings');
      })
      .finally(() => setLoading(false));
  }, [studioId, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.updateStudio(studioId, {
        title,
        category,
        hourlyRate: Number(hourlyRate),
        securityDeposit: Number(securityDeposit || 0),
        maxCapacity: Number(maxCapacity || 10),
        location,
        address,
        imageUrl,
        description
      });

      if (res.success) {
        toast.success('Studio specifications updated successfully.');
        navigate('/my-listings');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update studio.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 animate-pulse space-y-4">
        <div className="h-8 w-48 bg-[#181F2B] rounded-xl" />
        <div className="h-96 bg-[#181F2B] rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 w-full">
      <button
        onClick={() => navigate('/my-listings')}
        className="flex items-center gap-2 text-xs font-semibold text-[#A1AAB9] hover:text-white transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to My Listings
      </button>

      <div className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
          Edit Studio Listing
        </h1>
        <p className="text-xs text-[#A1AAB9] mt-1">Update rates, capacity, and studio specifications.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#181F2B] border border-[#293344] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">Studio Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#10151F] border border-[#293344] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as StudioCategory)}
              className="w-full bg-[#10151F] border border-[#293344] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">Hourly Rate ($) *</label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-[#A1AAB9] absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="number"
                min="1"
                required
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-[#10151F] border border-[#293344] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">Deposit ($)</label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-[#A1AAB9] absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="number"
                min="0"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-[#10151F] border border-[#293344] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">Max Capacity *</label>
            <div className="relative">
              <Users className="w-4 h-4 text-[#A1AAB9] absolute left-3 top-2.5 pointer-events-none" />
              <input
                type="number"
                min="1"
                required
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-[#10151F] border border-[#293344] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">City / Neighborhood *</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#10151F] border border-[#293344] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">Street Address *</label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#10151F] border border-[#293344] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">Image URL *</label>
          <div className="relative">
            <ImageIcon className="w-4 h-4 text-[#A1AAB9] absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-[#10151F] border border-[#293344] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">Description *</label>
          <textarea
            rows={5}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#10151F] border border-[#293344] rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-[#C5F36A] leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#293344]">
          <button
            type="button"
            onClick={() => navigate('/my-listings')}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-[#293344] text-[#A1AAB9] hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-lg bg-[#C5F36A] text-[#10151F] font-bold text-xs uppercase tracking-wider hover:bg-[#b0de57]"
          >
            {submitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

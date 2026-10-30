import React, { useState } from 'react';
import { StudioCategory } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Camera, Plus, Trash2, ArrowRight, DollarSign, Users, MapPin, Image as ImageIcon } from 'lucide-react';

interface AddStudioPageProps {
  navigate: (path: string) => void;
}

const CATEGORIES: StudioCategory[] = [
  'Photo Studio',
  'Film Stage',
  'Podcast Lounge',
  'Music Suite',
  'Art Workshop'
];

const DEFAULT_AMENITY_OPTIONS = [
  'Motorized Overhead Light Grid',
  'Infinity Cyclorama Curve',
  'ARRI Skypanel Truss System',
  'STC-65 Soundproof Acoustic Shell',
  'Client Lounge & Espresso Bar',
  'Hair & Makeup Dual Station',
  'High-Speed 1Gbps Fiber Tethering',
  'Drive-in Roll-Up Elephant Door',
  'Isolated Vocal & Drum Booth',
  '3-Phase 400A Camlock Power'
];

export const AddStudioPage: React.FC<AddStudioPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<StudioCategory>('Photo Studio');
  const [hourlyRate, setHourlyRate] = useState<number | ''>(125);
  const [securityDeposit, setSecurityDeposit] = useState<number | ''>(200);
  const [maxCapacity, setMaxCapacity] = useState<number | ''>(20);
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/hero_cyclorama_studio_1793378836214.jpg');
  const [description, setDescription] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'High-Speed 1Gbps Fiber Tethering',
    'Client Lounge & Espresso Bar'
  ]);
  const [customAmenity, setCustomAmenity] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-white">Authentication Required</h2>
        <p className="text-xs text-[#A1AAB9] mt-2">
          You must be signed in to create and publish a creative studio listing.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="mt-6 px-5 py-2.5 rounded-xl bg-[#C5F36A] text-[#10151F] font-bold text-xs"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const toggleAmenity = (item: string) => {
    setSelectedAmenities(prev =>
      prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]
    );
  };

  const handleAddCustomAmenity = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAmenity.trim() && !selectedAmenities.includes(customAmenity.trim())) {
      setSelectedAmenities([...selectedAmenities, customAmenity.trim()]);
      setCustomAmenity('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !hourlyRate || !location || !address || !imageUrl || !description) {
      toast.error('Please fill in all mandatory studio fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createStudio({
        title,
        category,
        hourlyRate: Number(hourlyRate),
        securityDeposit: Number(securityDeposit || 0),
        maxCapacity: Number(maxCapacity || 10),
        location,
        address,
        imageUrl,
        amenities: selectedAmenities,
        description
      });

      if (res.success) {
        toast.success('Your creative studio has been listed successfully!');
        navigate('/my-listings');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to publish studio.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-8">
        <span className="text-xs font-mono text-[#C5F36A] uppercase tracking-wider">
          Studio Host Portal
        </span>
        <h1 className="font-display text-3xl font-extrabold text-[#F8FAFC] tracking-tight mt-1">
          List Your Creative Studio
        </h1>
        <p className="text-xs text-[#A1AAB9] mt-1">
          Reach thousands of vetted commercial photographers, podcast networks, and film crews.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-[#181F2B] border border-[#293344] rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Section 1: Basic Studio Specs */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-[#293344]">
            1. Studio Overview & Space Category
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
                Studio Title / Space Name *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Brooklyn Daylight Cyc Stage"
                className="w-full bg-[#10151F] border border-[#293344] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as StudioCategory)}
                className="w-full bg-[#10151F] border border-[#293344] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Capacity */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-[#293344]">
            2. Commercial Rates & Crew Limits
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
                Hourly Rate ($ USD) *
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-[#A1AAB9] absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="number"
                  min="1"
                  required
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="125"
                  className="w-full bg-[#10151F] border border-[#293344] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
                Security Deposit ($ USD)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-[#A1AAB9] absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="number"
                  min="0"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="200"
                  className="w-full bg-[#10151F] border border-[#293344] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
                Max Crew Capacity (People) *
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-[#A1AAB9] absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="number"
                  min="1"
                  required
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="20"
                  className="w-full bg-[#10151F] border border-[#293344] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Location */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-[#293344]">
            3. Studio Location & Access
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
                Neighborhood / City (Public Display) *
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Brooklyn, New York"
                className="w-full bg-[#10151F] border border-[#293344] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
                Full Street Address (Provided after booking) *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 420 Kent Ave, Studio 3B"
                className="w-full bg-[#10151F] border border-[#293344] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Imagery */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-[#293344]">
            4. Photography Asset URL
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
              Primary Studio Image URL *
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-[#A1AAB9] absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/src/assets/images/hero_cyclorama_studio_1793378836214.jpg"
                className="w-full bg-[#10151F] border border-[#293344] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
              />
            </div>
            {imageUrl && (
              <div className="mt-3 relative w-48 h-28 rounded-xl overflow-hidden border border-[#293344]">
                <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Section 5: Amenities */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-[#293344]">
            5. Amenities & Gear Available
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {DEFAULT_AMENITY_OPTIONS.map((item) => (
              <label
                key={item}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-[#10151F] border border-[#293344] text-xs text-[#F8FAFC] cursor-pointer hover:border-[#C5F36A]/40 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(item)}
                  onChange={() => toggleAmenity(item)}
                  className="rounded text-[#C5F36A] focus:ring-0 w-4 h-4 accent-[#C5F36A]"
                />
                <span>{item}</span>
              </label>
            ))}
          </div>

          {/* Add custom amenity */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customAmenity}
              onChange={(e) => setCustomAmenity(e.target.value)}
              placeholder="Add specialized equipment (e.g. Teleprompter, Steadicam dock)..."
              className="flex-1 bg-[#10151F] border border-[#293344] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C5F36A]"
            />
            <button
              type="button"
              onClick={handleAddCustomAmenity}
              className="px-4 py-2 rounded-xl bg-[#293344] text-xs font-semibold text-white hover:bg-[#3e4c63] transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Section 6: Description */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-2 border-b border-[#293344]">
            6. Detailed Studio Description
          </h3>

          <div>
            <textarea
              rows={5}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe ceiling height, acoustics, light exposure, access freight elevator, loading docks, and house rules..."
              className="w-full bg-[#10151F] border border-[#293344] rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-[#C5F36A] leading-relaxed"
            />
          </div>
        </div>

        {/* Section 7: Read-only Host Credentials (Requirement 8) */}
        <div className="space-y-3 p-4 rounded-2xl bg-[#10151F] border border-[#293344]">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Verified Host Identity (Automated from Session)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#A1AAB9]">
            <div>
              <span className="block text-slate-500 text-[11px]">Host Name</span>
              <span className="font-semibold text-white">{user.name}</span>
            </div>
            <div>
              <span className="block text-slate-500 text-[11px]">Host Contact Email</span>
              <span className="font-semibold text-white">{user.email}</span>
            </div>
          </div>
        </div>

        {/* Form Submission CTA */}
        <div className="pt-4 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/my-listings')}
            className="px-5 py-2.5 rounded-xl border border-[#293344] text-xs font-semibold text-[#A1AAB9] hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-xl bg-[#C5F36A] text-[#10151F] font-bold text-xs uppercase tracking-wider hover:bg-[#b0de57] disabled:opacity-50 transition-all shadow-md"
          >
            {submitting ? 'Publishing Studio...' : 'Publish Studio Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

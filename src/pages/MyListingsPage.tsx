import React, { useEffect, useState } from 'react';
import { Studio } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { PlusCircle, Edit3, Trash2, Eye, MapPin, DollarSign, Users, Star } from 'lucide-react';

interface MyListingsPageProps {
  navigate: (path: string) => void;
}

export const MyListingsPage: React.FC<MyListingsPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Studio | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadMyStudios = async () => {
    try {
      const res = await api.getMyStudios();
      if (res.success) {
        setStudios(res.studios);
      }
    } catch (err: any) {
      toast.error('Failed to load your studio listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadMyStudios();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-white">Sign In Required</h2>
        <p className="text-xs text-[#A1AAB9] mt-2">
          Sign in to view and manage your hosted creative workspaces.
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

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      const res = await api.deleteStudio(deleteTarget.id);
      if (res.success) {
        toast.success(`"${deleteTarget.title}" has been permanently deleted.`);
        setStudios(prev => prev.filter(s => s.id !== deleteTarget.id));
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete studio listing.');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full min-h-[80vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-mono text-[#C5F36A] uppercase tracking-wider">
            Host Management
          </span>
          <h1 className="font-display text-3xl font-extrabold text-[#F8FAFC] tracking-tight mt-1">
            My Studio Listings
          </h1>
          <p className="text-xs text-[#A1AAB9] mt-1">
            Manage your stage listings, specifications, rates, and active bookings.
          </p>
        </div>

        <button
          onClick={() => navigate('/add-studio')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C5F36A] text-[#10151F] font-bold text-xs uppercase tracking-wider hover:bg-[#b0de57] transition-all self-start sm:self-auto shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          Add New Studio
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-36 rounded-2xl bg-[#181F2B] border border-[#293344] animate-pulse" />
          ))}
        </div>
      ) : studios.length === 0 ? (
        <div className="text-center py-20 bg-[#181F2B] border border-[#293344] rounded-3xl p-8 max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#C5F36A]/10 text-[#C5F36A] flex items-center justify-center mx-auto">
            <PlusCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No Studio Listings Yet</h3>
          <p className="text-xs text-[#A1AAB9] leading-relaxed">
            You haven't listed any creative workspaces or soundstages on StudioSpace. Start hosting and earn from your production space.
          </p>
          <button
            onClick={() => navigate('/add-studio')}
            className="px-5 py-2.5 rounded-xl bg-[#C5F36A] text-[#10151F] font-bold text-xs"
          >
            Create Your First Listing
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {studios.map(studio => (
            <div
              key={studio.id}
              className="bg-[#181F2B] border border-[#293344] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:border-[#C5F36A]/40 transition-colors shadow-sm"
            >
              {/* Left thumbnail & basic info */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative w-24 h-20 sm:w-32 sm:h-24 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-[#293344]">
                  <img
                    src={studio.imageUrl}
                    alt={studio.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-[#A1AAB9]">
                    <span className="text-[#C5F36A] font-semibold">{studio.category}</span>
                    <span>·</span>
                    <span className="truncate">{studio.location}</span>
                  </div>

                  <h3 className="text-base font-bold text-white truncate">
                    {studio.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#A1AAB9] pt-0.5">
                    <span className="font-mono text-white font-semibold">
                      ${studio.hourlyRate}/hr
                    </span>
                    <span>·</span>
                    <span>Cap: {studio.maxCapacity}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-[#C5F36A]">
                      <Star className="w-3 h-3 fill-[#C5F36A]" />
                      {studio.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2.5 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-[#293344]">
                <button
                  onClick={() => navigate(`/studios/${studio.id}`)}
                  className="p-2 rounded-xl border border-[#293344] bg-[#10151F] text-[#A1AAB9] hover:text-white hover:border-[#C5F36A] transition-colors"
                  title="View Public Page"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate(`/studios/edit/${studio.id}`)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#293344] bg-[#10151F] text-xs font-semibold text-white hover:border-[#C5F36A] transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#C5F36A]" />
                  Edit
                </button>

                <button
                  onClick={() => setDeleteTarget(studio)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Studio Listing?"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? All future booking slots for this space will be decommissioned. This action cannot be reversed.`}
        confirmText={deleting ? 'Deleting...' : 'Delete Permanently'}
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

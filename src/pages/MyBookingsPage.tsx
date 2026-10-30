import React, { useEffect, useState } from 'react';
import { Booking, BookingStatus } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { InvoiceModal } from '../components/InvoiceModal';
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  XCircle,
  CheckCircle,
  AlertCircle,
  Check,
  X,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface MyBookingsPageProps {
  navigate: (path: string) => void;
}

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'client' | 'host'>('client');
  const [clientBookings, setClientBookings] = useState<Booking[]>([]);
  const [hostBookings, setHostBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [invoiceTarget, setInvoiceTarget] = useState<Booking | null>(null);

  const loadData = async () => {
    try {
      const [clientRes, hostRes] = await Promise.all([
        api.getUserBookings(),
        api.getHostBookings().catch(() => ({ success: true, count: 0, bookings: [] }))
      ]);

      if (clientRes.success) setClientBookings(clientRes.bookings);
      if (hostRes.success) setHostBookings(hostRes.bookings);
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to load your reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-white">Sign In Required</h2>
        <p className="text-xs text-[#A1AAB9] mt-2">
          Sign in to view your scheduled studio sessions and booking history.
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

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;

    setCancelling(true);
    try {
      const res = await api.cancelBooking(cancelTarget.id);
      if (res.success) {
        toast.success('Booking successfully cancelled.');
        setClientBookings(prev =>
          prev.map(b => (b.id === cancelTarget.id ? { ...b, status: 'cancelled' } : b))
        );
        setHostBookings(prev =>
          prev.map(b => (b.id === cancelTarget.id ? { ...b, status: 'cancelled' } : b))
        );
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel reservation.');
    } finally {
      setCancelling(false);
      setCancelTarget(null);
    }
  };

  const handleUpdateStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      const res = await api.updateBookingStatus(bookingId, status);
      if (res.success) {
        toast.success(`Booking status changed to ${status}.`);
        setHostBookings(prev =>
          prev.map(b => (b.id === bookingId ? { ...b, status } : b))
        );
      }
    } catch (err: any) {
      toast.error(err.message || 'Status update failed.');
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" /> Confirmed
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Check className="w-3 h-3" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        );
    }
  };

  const currentBookings = activeTab === 'client' ? clientBookings : hostBookings;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full min-h-[80vh]">
      {/* Title & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-mono text-[#C5F36A] uppercase tracking-wider">
            Production Schedule
          </span>
          <h1 className="font-display text-3xl font-extrabold text-[#F8FAFC] tracking-tight mt-1">
            My Bookings & Reservations
          </h1>
          <p className="text-xs text-[#A1AAB9] mt-1">
            Review shoot schedules, download printable PDF invoices, or manage incoming bookings.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center p-1 bg-[#181F2B] border border-[#293344] rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('client')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'client'
                ? 'bg-[#C5F36A] text-[#10151F]'
                : 'text-[#A1AAB9] hover:text-white'
            }`}
          >
            My Sessions ({clientBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('host')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'host'
                ? 'bg-[#C5F36A] text-[#10151F]'
                : 'text-[#A1AAB9] hover:text-white'
            }`}
          >
            Host Requests ({hostBookings.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 rounded-2xl bg-[#181F2B] border border-[#293344] animate-pulse" />
          ))}
        </div>
      ) : currentBookings.length === 0 ? (
        <div className="text-center py-20 bg-[#181F2B] border border-[#293344] rounded-3xl p-8 max-w-lg mx-auto space-y-4">
          <Calendar className="w-12 h-12 text-[#C5F36A] mx-auto opacity-70" />
          <h3 className="text-lg font-bold text-white">
            {activeTab === 'client' ? 'No Studio Sessions Booked' : 'No Incoming Booking Requests'}
          </h3>
          <p className="text-xs text-[#A1AAB9] leading-relaxed">
            {activeTab === 'client'
              ? 'Ready to produce? Browse our vetted soundstages, cycloramas, and recording suites.'
              : 'When creators book hours at your studio listings, requests will appear here for confirmation.'}
          </p>
          {activeTab === 'client' && (
            <button
              onClick={() => navigate('/studios')}
              className="px-5 py-2.5 rounded-xl bg-[#C5F36A] text-[#10151F] font-bold text-xs"
            >
              Explore Creative Studios
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {currentBookings.map((b) => (
            <div
              key={b.id}
              className="bg-[#181F2B] border border-[#293344] rounded-2xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-sm hover:border-[#C5F36A]/40 transition-colors"
            >
              {/* Left Column: Studio info & time */}
              <div className="flex items-start sm:items-center gap-4 min-w-0">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-[#293344]">
                  <img
                    src={b.studioImage}
                    alt={b.studioTitle}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-3">
                    {getStatusBadge(b.status)}
                    <span className="text-[11px] font-mono text-[#A1AAB9]">
                      ID: #{b.id.slice(-6).toUpperCase()}
                    </span>
                  </div>

                  <h3
                    onClick={() => navigate(`/studios/${b.studioId}`)}
                    className="text-base font-bold text-white hover:text-[#C5F36A] cursor-pointer transition-colors truncate"
                  >
                    {b.studioTitle}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#A1AAB9]">
                    <span className="flex items-center gap-1 text-white font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#C5F36A]" />
                      {b.bookingDate}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-white font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#C5F36A]" />
                      {b.startTime} - {b.endTime} ({b.totalHours} hrs)
                    </span>
                  </div>

                  {activeTab === 'host' ? (
                    <p className="text-xs text-slate-400">
                      Client: <strong className="text-white">{b.userName}</strong> ({b.userEmail})
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400">
                      Host Contact: <strong className="text-white">{b.hostEmail}</strong>
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column: Pricing & Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between lg:justify-end gap-5 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-[#293344]">
                <div className="text-left sm:text-right">
                  <div className="text-lg font-black text-white font-mono">
                    ${b.totalAmount.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-[#A1AAB9]">
                    Rate: ${b.hourlyPrice}/hr + ${b.securityDeposit} dep.
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Download Invoice PDF */}
                  <button
                    onClick={() => setInvoiceTarget(b)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#293344] bg-[#10151F] text-xs font-semibold text-white hover:border-[#C5F36A] transition-colors"
                    title="Export PDF Invoice"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#C5F36A]" />
                    Invoice
                  </button>

                  {/* Host management actions */}
                  {activeTab === 'host' && b.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/20"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Confirm
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/20"
                      >
                        <X className="w-3.5 h-3.5" />
                        Decline
                      </button>
                    </>
                  )}

                  {/* Mark as completed (host only) */}
                  {activeTab === 'host' && b.status === 'confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(b.id, 'completed')}
                      className="px-3 py-2 rounded-xl bg-[#C5F36A] text-[#10151F] text-xs font-bold hover:bg-[#b0de57]"
                    >
                      Complete Session
                    </button>
                  )}

                  {/* Client cancel button (for pending/confirmed bookings) */}
                  {activeTab === 'client' && (b.status === 'pending' || b.status === 'confirmed') && (
                    <button
                      onClick={() => setCancelTarget(b)}
                      className="px-3 py-2 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(cancelTarget)}
        title="Cancel Studio Reservation?"
        message={`Are you sure you want to cancel your session for "${cancelTarget?.studioTitle}" on ${cancelTarget?.bookingDate} (${cancelTarget?.startTime} - ${cancelTarget?.endTime})? Security deposits and refunds will be processed based on cancellation policy.`}
        confirmText={cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
        isDestructive={true}
        onConfirm={handleConfirmCancel}
        onCancel={() => setCancelTarget(null)}
      />

      {/* PDF Invoice Modal */}
      <InvoiceModal
        isOpen={Boolean(invoiceTarget)}
        booking={invoiceTarget}
        onClose={() => setInvoiceTarget(null)}
      />
    </div>
  );
};

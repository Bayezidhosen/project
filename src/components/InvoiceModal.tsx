import React from 'react';
import { Booking } from '../types';
import { jsPDF } from 'jspdf';
import { Download, Printer, X, CheckCircle2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface InvoiceModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ booking, isOpen, onClose }) => {
  const { toast } = useToast();
  if (!isOpen || !booking) return null;

  const invoiceNumber = `INV-${booking.id.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}`;
  const subtotal = Math.round(booking.totalHours * booking.hourlyPrice * 100) / 100;

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({
        unit: 'pt',
        format: 'a4'
      });

      // Background accent header
      doc.setFillColor(16, 21, 31);
      doc.rect(0, 0, 595, 110, 'F');

      // Title & Brand
      doc.setTextColor(197, 243, 106); // #C5F36A
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.text('StudioSpace', 40, 50);

      doc.setTextColor(248, 250, 252);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Peer-to-Peer Creative Workspaces & Soundstages', 40, 70);
      doc.text('support@studiospace.io · www.studiospace.io', 40, 85);

      // Invoice metadata
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 21, 31);
      doc.text('BOOKING INVOICE', 400, 50);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(`Invoice No: ${invoiceNumber}`, 400, 70);
      doc.text(`Issue Date: ${new Date(booking.createdAt).toLocaleDateString()}`, 400, 85);
      doc.text(`Status: ${booking.status.toUpperCase()}`, 400, 100);

      // Bill To & Session Details
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text('CREATOR / BILLED TO:', 40, 140);
      doc.text('STUDIO RESERVATION:', 320, 140);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text(booking.userName, 40, 158);
      doc.text(booking.userEmail, 40, 172);

      doc.text(booking.studioTitle, 320, 158);
      doc.text(`Session Date: ${booking.bookingDate}`, 320, 172);
      doc.text(`Session Window: ${booking.startTime} - ${booking.endTime} (${booking.totalHours} hrs)`, 320, 186);

      // Table Header
      doc.setFillColor(241, 245, 249);
      doc.rect(40, 220, 515, 25, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      doc.text('DESCRIPTION', 50, 236);
      doc.text('HOURS / RATE', 340, 236);
      doc.text('AMOUNT', 480, 236);

      // Line Items
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);

      // Item 1: Studio rental
      doc.text(`Studio Session Rental (${booking.studioTitle})`, 50, 265);
      doc.text(`${booking.totalHours} hrs @ $${booking.hourlyPrice}/hr`, 340, 265);
      doc.text(`$${subtotal.toFixed(2)}`, 480, 265);

      // Item 2: Security Deposit
      doc.text('Refundable Production Security Deposit', 50, 290);
      doc.text('Flat', 340, 290);
      doc.text(`$${booking.securityDeposit.toFixed(2)}`, 480, 290);

      // Divider
      doc.setDrawColor(226, 232, 240);
      doc.line(40, 315, 555, 315);

      // Total summary
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(16, 21, 31);
      doc.text('TOTAL PAID / DUE:', 340, 340);
      doc.text(`$${booking.totalAmount.toFixed(2)}`, 480, 340);

      // Footer notice
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('Thank you for booking with StudioSpace. Liability coverage and host guarantees apply to verified sessions.', 40, 400);

      doc.save(`StudioSpace-Invoice-${booking.id}.pdf`);
      toast.success('Invoice PDF downloaded successfully.');
    } catch (e) {
      console.error(e);
      toast.error('Failed to export PDF invoice.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#181F2B] border border-[#293344] rounded-2xl w-full max-w-xl p-6 sm:p-8 shadow-2xl text-[#F8FAFC]">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-[#293344]">
          <div>
            <span className="text-xs font-mono text-[#C5F36A] uppercase tracking-wider">Official Invoice</span>
            <h2 className="text-xl font-bold mt-0.5">{invoiceNumber}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A1AAB9] hover:text-white hover:bg-[#293344] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content details */}
        <div className="py-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-[#A1AAB9] font-medium">Billed To</p>
              <p className="font-semibold text-white mt-1 text-sm">{booking.userName}</p>
              <p className="text-[#A1AAB9]">{booking.userEmail}</p>
            </div>
            <div>
              <p className="text-[#A1AAB9] font-medium">Studio Space</p>
              <p className="font-semibold text-white mt-1 text-sm">{booking.studioTitle}</p>
              <p className="text-[#A1AAB9]">Date: {booking.bookingDate}</p>
              <p className="text-[#A1AAB9]">Time: {booking.startTime} - {booking.endTime}</p>
            </div>
          </div>

          {/* Breakdown table */}
          <div className="bg-[#10151F] border border-[#293344] rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-xs text-[#A1AAB9] pb-2 border-b border-[#293344]">
              <span>Description</span>
              <span>Amount</span>
            </div>
            <div className="flex justify-between text-xs text-white">
              <span>{booking.totalHours} hrs @ ${booking.hourlyPrice}/hr</span>
              <span className="font-mono">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-white">
              <span>Refundable Security Deposit</span>
              <span className="font-mono">${booking.securityDeposit.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-[#293344] flex justify-between text-sm font-bold text-white">
              <span>Total Amount</span>
              <span className="text-[#C5F36A] font-mono text-base">${booking.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#A1AAB9]">
            <CheckCircle2 className="w-4 h-4 text-[#C5F36A]" />
            <span>Status: <strong className="text-white capitalize">{booking.status}</strong></span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="pt-4 border-t border-[#293344] flex items-center justify-end gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border border-[#293344] hover:bg-[#293344] transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#C5F36A] text-[#10151F] hover:bg-[#b0de57] transition-colors"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

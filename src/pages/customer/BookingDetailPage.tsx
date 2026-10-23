import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  FileDown,
  MessageSquare,
  Star,
  ShieldCheck,
  CreditCard,
  QrCode,
  AlertTriangle,
  Printer,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PriceDisplay } from '../../components/common/PriceDisplay';
import { Badge } from '../../components/common/Badge';
import { formatDate } from '../../utils/dates';
import { formatPrice } from '../../utils/currency';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Modal } from '../../components/common/Modal';

export const BookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { bookings, cancelBooking, createReview, addToast, currency } = useApp();

  const booking = bookings.find((b) => b.id === id);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');

  if (!booking) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-800">Booking Not Found</h2>
        <p className="text-sm text-slate-500 mt-1">This booking reference does not exist.</p>
        <Link to="/customer/bookings" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
          Back to Bookings
        </Link>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    addToast('Downloading Voucher', `Generating PDF for ${booking.bookingReference}...`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCancel = () => {
    cancelBooking(booking.id, 'Customer cancellation request');
    setCancelModalOpen(false);
    addToast('Booking Cancelled', 'Your booking was cancelled and refund queued.', 'info');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReview({
      businessId: booking.businessId,
      customerId: booking.customerId,
      customerName: booking.customerName,
      customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      bookingId: booking.id,
      serviceName: booking.serviceName,
      rating,
      cleanliness: rating,
      service: rating,
      value: rating,
      comment: reviewContent,
      title: reviewTitle,
      content: reviewContent,
    });
    setReviewModalOpen(false);
    addToast('Review Submitted', 'Thank you for your feedback!', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/customer/bookings"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Bookings</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download Voucher</span>
          </button>
        </div>
      </div>

      {/* Main Voucher Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden print:border-none print:shadow-none">
        {/* Voucher Banner Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Official Check-In Voucher
              </span>
              <Badge variant={booking.bookingStatus === 'CONFIRMED' ? 'success' : 'neutral'}>
                {booking.bookingStatus}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {booking.serviceName}
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Provided by {booking.businessName} • {booking.businessLocation}
            </p>
          </div>

          <div className="text-left sm:text-right bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Booking Reference</span>
            <span className="font-mono text-base sm:text-lg font-black text-amber-400">
              {booking.bookingReference}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* QR Code & Check-in Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-5 rounded-2xl bg-slate-50 border border-slate-150">
            <div className="md:col-span-1 flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <QrCode className="w-28 h-28 text-slate-900" />
              <span className="text-[11px] font-mono text-slate-500 mt-2 font-bold">
                {booking.bookingReference}
              </span>
              <span className="text-[9px] text-slate-400">Scan at property reception</span>
            </div>

            <div className="md:col-span-2 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">
                    {booking.businessCategory === 'ACCOMMODATION' ? 'Check-in' : 'Pickup'}
                  </span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {formatDate(booking.startDate)}
                  </p>
                  <p className="text-slate-500">{booking.startTime || '14:00 PM onwards'}</p>
                </div>

                <div>
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">
                    {booking.businessCategory === 'ACCOMMODATION' ? 'Check-out' : 'Return'}
                  </span>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {formatDate(booking.endDate)}
                  </p>
                  <p className="text-slate-500">{booking.endTime || 'Until 12:00 PM'}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-400 block font-bold uppercase text-[10px]">Guest / Renter</span>
                <p className="font-bold text-slate-900 mt-0.5">{booking.customerName}</p>
                <p className="text-slate-600">{booking.customerEmail} • {booking.customerPhone}</p>
              </div>
            </div>
          </div>

          {/* Pricing Snapshot Breakdown Table */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">Locked Pricing Breakdown</h3>
            <div className="rounded-2xl border border-slate-200 p-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>
                  Base Rate ({booking.pricing.units} {booking.pricing.unitType.toLowerCase()}s ×{' '}
                  {formatPrice(booking.pricing.basePrice, booking.pricing.currency)})
                </span>
                <span className="font-semibold text-slate-900">
                  {formatPrice(booking.pricing.subtotal + (booking.pricing.discount || 0), booking.pricing.currency)}
                </span>
              </div>

              {booking.pricing.discount ? (
                <div className="flex justify-between text-emerald-600">
                  <span>Promotional Discount</span>
                  <span>-{formatPrice(booking.pricing.discount, booking.pricing.currency)}</span>
                </div>
              ) : null}

              <div className="flex justify-between text-slate-600">
                <span>Taxes & Service Charge</span>
                <span>{formatPrice(booking.pricing.taxes, booking.pricing.currency)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>KampujaGo Guarantee & Protection Fee</span>
                <span>{formatPrice(booking.pricing.platformFee, booking.pricing.currency)}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
                <span>Total Amount Paid</span>
                <span className="text-emerald-600 text-lg">
                  {formatPrice(booking.pricing.total, booking.pricing.currency)}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1">
                <span>Payment Method: <strong>{booking.paymentMethod.replace('_', ' ')}</strong></span>
                <Badge variant="success">Payment Verified</Badge>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {booking.specialRequests && (
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs">
              <span className="font-bold text-amber-900 block mb-1">Special Requests to Host:</span>
              <p className="text-amber-800">{booking.specialRequests}</p>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/customer/messages"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition"
            >
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Direct Chat with Host</span>
            </Link>

            <div className="flex items-center gap-2">
              {booking.bookingStatus === 'COMPLETED' && (
                <button
                  onClick={() => setReviewModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition"
                >
                  <Star className="w-4 h-4" />
                  <span>Write Review</span>
                </button>
              )}

              {booking.bookingStatus === 'CONFIRMED' && (
                <button
                  onClick={() => setCancelModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition cursor-pointer"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={cancelModalOpen}
        title="Cancel This Booking?"
        message={`Are you sure you want to cancel booking ${booking.bookingReference}? Full refund will be queued according to property cancellation policy.`}
        confirmText="Yes, Cancel Booking"
        confirmVariant="danger"
        onConfirm={handleCancel}
        onCancel={() => setCancelModalOpen(false)}
      />

      {/* Write Review Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Write a Review"
        subtitle={`Share your experience with ${booking.serviceName}`}
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Your Rating</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-slate-300 hover:text-amber-400 focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : ''}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Review Headline</label>
            <input
              type="text"
              required
              placeholder="e.g., Fantastic boutique stay with great breakfast!"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Your Feedback</label>
            <textarea
              rows={4}
              required
              placeholder="Tell other travelers about the room, cleanliness, location, or hospitality..."
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setReviewModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
            >
              Publish Review
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

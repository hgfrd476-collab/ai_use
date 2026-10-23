import React, { useState } from 'react';
import {
  Calendar,
  Settings,
  ChevronDown,
  ChevronUp,
  Search,
  Check,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Car,
  Bed,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/dates';
import { formatPrice } from '../../utils/currency';
import { BookingStatus } from '../../types';

export const AdminBookingsPage: React.FC = () => {
  const { bookings, cancelBooking, updateBookingStatus, currency, addToast } = useApp();

  const [activeTab, setActiveTab] = useState<'ALL' | 'CONFIRMED' | 'PENDING' | 'COMPLETED'>('ALL');
  const [selectedRowId, setSelectedRowId] = useState<string | null>(
    bookings[1]?.id || bookings[0]?.id || null
  );
  const [actionMenuOpenId, setActionMenuOpenId] = useState<string | null>(null);
  const [dateRangeFilter, setDateRangeFilter] = useState('31 Jul 2026 To 03 Aug 2026');
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = bookings.filter((b) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'CONFIRMED') return b.bookingStatus === 'CONFIRMED';
    if (activeTab === 'PENDING') return b.bookingStatus === 'PENDING';
    if (activeTab === 'COMPLETED') return b.bookingStatus === 'COMPLETED';
    return true;
  });

  const pageSize = 6;
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleForceCancel = (id: string) => {
    cancelBooking(id, 'Cancelled by platform administrator');
    addToast('Order Cancelled', 'Booking was administratively revoked.', 'info');
    setActionMenuOpenId(null);
  };

  const handleForceComplete = (id: string) => {
    updateBookingStatus(id, 'COMPLETED');
    addToast('Order Settled', 'Booking marked as successfully completed.', 'success');
    setActionMenuOpenId(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. Filter Tabs & Date Range Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-6 text-sm font-semibold">
          <button
            onClick={() => {
              setActiveTab('ALL');
              setCurrentPage(1);
            }}
            className={`pb-1.5 transition cursor-pointer relative ${
              activeTab === 'ALL'
                ? 'text-[#0B63F6] font-bold border-b-2 border-[#0B63F6]'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            All orders
          </button>

          <button
            onClick={() => {
              setActiveTab('CONFIRMED');
              setCurrentPage(1);
            }}
            className={`pb-1.5 transition cursor-pointer relative ${
              activeTab === 'CONFIRMED'
                ? 'text-[#0B63F6] font-bold border-b-2 border-[#0B63F6]'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Dispatch
          </button>

          <button
            onClick={() => {
              setActiveTab('PENDING');
              setCurrentPage(1);
            }}
            className={`pb-1.5 transition cursor-pointer relative ${
              activeTab === 'PENDING'
                ? 'text-[#0B63F6] font-bold border-b-2 border-[#0B63F6]'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Pending
          </button>

          <button
            onClick={() => {
              setActiveTab('COMPLETED');
              setCurrentPage(1);
            }}
            className={`pb-1.5 transition cursor-pointer relative ${
              activeTab === 'COMPLETED'
                ? 'text-[#0B63F6] font-bold border-b-2 border-[#0B63F6]'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Date Range Selector */}
        <div className="relative">
          <button
            onClick={() => setDateModalOpen(!dateModalOpen)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{dateRangeFilter}</span>
          </button>

          {dateModalOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setDateModalOpen(false)} />
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-30 text-xs space-y-2">
                <p className="font-bold text-slate-800">Filter Period</p>
                {['Today', '31 Jul 2026 To 03 Aug 2026', 'This Month', 'All Time'].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      setDateRangeFilter(preset);
                      setDateModalOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-blue-50 hover:text-[#0B63F6] transition font-medium"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 2. Floating Row Cards Table */}
      <div className="space-y-2">
        <div className="grid grid-cols-12 gap-3 px-5 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <div className="col-span-1">Id ▾</div>
          <div className="col-span-3">Customer</div>
          <div className="col-span-3">Address / Service</div>
          <div className="col-span-2">Date ▾</div>
          <div className="col-span-1">Price ▾</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {paginated.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            No platform transactions found.
          </div>
        ) : (
          paginated.map((booking, idx) => {
            const isSelected = selectedRowId === booking.id;
            const shortId = `#${booking.bookingReference.replace('BK-', '').slice(0, 4) || '263' + idx}`;
            const address = `${booking.serviceName}, ${booking.businessLocation}`;

            const isPending = booking.bookingStatus === 'PENDING';
            const isConfirmed = booking.bookingStatus === 'CONFIRMED';
            const isCompleted = booking.bookingStatus === 'COMPLETED';

            return (
              <div key={booking.id} className="relative">
                <div
                  onClick={() => setSelectedRowId(isSelected ? null : booking.id)}
                  className={`grid grid-cols-12 gap-3 items-center px-5 py-3.5 rounded-2xl transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-[#0B63F6] text-white shadow-xl shadow-blue-500/25 scale-[1.008] border-none'
                      : 'bg-white border border-slate-100 hover:border-slate-200 text-slate-700 shadow-2xs hover:bg-slate-50/70'
                  }`}
                >
                  <div className="col-span-1 font-mono font-bold text-xs">
                    {shortId}
                  </div>

                  <div className="col-span-3 flex items-center gap-3 min-w-0">
                    <img
                      src={`https://images.unsplash.com/photo-${1534528741775 + idx * 23}?auto=format&fit=crop&w=80&q=80`}
                      alt={booking.customerName}
                      className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-black/10"
                    />
                    <span className="font-bold text-xs truncate">
                      {booking.customerName}
                    </span>
                  </div>

                  <div className="col-span-3 text-xs truncate">
                    <span className={isSelected ? 'text-blue-100' : 'text-slate-500'}>
                      {address}
                    </span>
                  </div>

                  <div className="col-span-2 text-xs font-medium">
                    <span className={isSelected ? 'text-blue-100' : 'text-slate-600'}>
                      {formatDate(booking.startDate)}
                    </span>
                  </div>

                  <div className="col-span-1 text-xs font-black">
                    {formatPrice(booking.pricing.total, currency)}
                  </div>

                  <div className="col-span-1 flex items-center justify-center gap-1.5 text-xs font-bold">
                    {isPending && (
                      <span className={`flex items-center gap-1.5 ${isSelected ? 'text-amber-200' : 'text-rose-500'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                        <span>Pending</span>
                      </span>
                    )}
                    {isConfirmed && (
                      <span className={`flex items-center gap-1.5 ${isSelected ? 'text-emerald-300' : 'text-emerald-500'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span>Dispatch</span>
                      </span>
                    )}
                    {isCompleted && (
                      <span className={`flex items-center gap-1.5 ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                        <span>Completed</span>
                      </span>
                    )}
                    {!isPending && !isConfirmed && !isCompleted && (
                      <span className="text-slate-400">{booking.bookingStatus}</span>
                    )}
                  </div>

                  <div className="col-span-1 flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActionMenuOpenId(actionMenuOpenId === booking.id ? null : booking.id);
                      }}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        isSelected
                          ? 'text-white/80 hover:text-white hover:bg-white/20'
                          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                      title="Governance actions"
                    >
                      <Settings className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRowId(isSelected ? null : booking.id);
                      }}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        isSelected
                          ? 'text-white/80 hover:text-white hover:bg-white/20'
                          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Dropdown Action Menu */}
                {actionMenuOpenId === booking.id && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setActionMenuOpenId(null)} />
                    <div className="absolute right-4 top-12 w-52 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-40 text-xs animate-in fade-in slide-in-from-top-1">
                      <p className="px-3 py-1 font-bold text-slate-400 uppercase text-[10px]">
                        Admin Governance #{shortId}
                      </p>
                      <button
                        onClick={() => handleForceComplete(booking.id)}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-blue-600 hover:bg-blue-50 font-bold transition cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Force Complete</span>
                      </button>
                      <button
                        onClick={() => handleForceCancel(booking.id)}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold transition cursor-pointer"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Revoke & Escrow Refund</span>
                      </button>
                    </div>
                  </>
                )}

                {/* Expanded Details Drawer */}
                {isSelected && (
                  <div className="mt-2 p-5 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs text-slate-700 space-y-3 animate-in fade-in">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-blue-200/60 pb-3">
                      <div>
                        <span className="font-extrabold text-blue-900 text-sm">
                          {booking.serviceName} ({booking.businessCategory})
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Booking ID: <span className="font-mono font-bold text-slate-800">{booking.bookingReference}</span> · Host ID: {booking.businessId}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 font-semibold text-slate-600">
                        <span>Customer: {booking.customerName} ({booking.customerEmail})</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Total Volume & Method</span>
                        <p className="font-bold text-slate-800 mt-0.5">
                          {formatPrice(booking.pricing.total, currency)} via {booking.paymentMethod}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Platform Take (10%)</span>
                        <p className="font-bold text-blue-700 mt-0.5">
                          {formatPrice(Math.round(booking.pricing.total * 0.1), currency)} (Platform fee)
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400">Host Settlement (90%)</span>
                        <p className="font-bold text-emerald-700 mt-0.5">
                          {formatPrice(booking.pricing.total - Math.round(booking.pricing.total * 0.1), currency)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 3. Bottom Pagination */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-400">
        <span className="font-medium">
          Showing {paginated.length > 0 ? `01-0${paginated.length}` : '0'} of {filtered.length}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
            <button
              key={pg}
              onClick={() => setCurrentPage(pg)}
              className={`w-7 h-7 rounded-lg font-bold text-xs transition cursor-pointer ${
                currentPage === pg
                  ? 'bg-[#0B63F6] text-white shadow-xs'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {pg}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

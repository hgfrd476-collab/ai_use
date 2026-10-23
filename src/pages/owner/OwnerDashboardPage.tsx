import React from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  CalendarCheck,
  Building2,
  Star,
  PlusCircle,
  Bed,
  Car,
  CalendarDays,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  Users,
  Check,
  X,
  AlertTriangle,
  TrendingUp,
  Percent,
  ChevronRight,
  ShieldCheck,
  Bell,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PriceDisplay } from '../../components/common/PriceDisplay';
import { Badge } from '../../components/common/Badge';
import { formatDate } from '../../utils/dates';
import { formatPrice } from '../../utils/currency';

export const OwnerDashboardPage: React.FC = () => {
  const {
    currentUser,
    businesses,
    bookings,
    rooms,
    vehicles,
    reviews,
    notifications,
    updateBookingStatus,
    addToast,
    currency,
    selectedOwnerBusinessId,
    setSelectedOwnerBusinessId,
  } = useApp();

  const myBusinesses = businesses.filter((b) => b.ownerId === currentUser.id);

  // Active business filter
  const activeBusinesses =
    selectedOwnerBusinessId === 'ALL'
      ? myBusinesses
      : myBusinesses.filter((b) => b.id === selectedOwnerBusinessId);

  const activeBusinessIds = activeBusinesses.map((b) => b.id);

  // Filter items based on active business selection
  const relevantBookings = bookings.filter((b) => activeBusinessIds.includes(b.businessId));
  const relevantRooms = rooms.filter((r) => activeBusinessIds.includes(r.businessId));
  const relevantVehicles = vehicles.filter((v) => activeBusinessIds.includes(v.businessId));
  const relevantReviews = reviews.filter((r) => activeBusinessIds.includes(r.businessId));

  // Overview calculations
  const totalBusinessesCount = activeBusinesses.length;
  const activeApprovedBusinesses = activeBusinesses.filter((b) => b.status === 'APPROVED').length;
  const pendingApprovalBusinesses = activeBusinesses.filter((b) => b.status === 'PENDING').length;

  const totalBookingsCount = relevantBookings.length;
  const pendingBookings = relevantBookings.filter((b) => b.bookingStatus === 'PENDING');
  const todayBookingsCount = relevantBookings.filter(
    (b) => new Date(b.createdAt).toDateString() === new Date().toDateString()
  ).length;

  const totalGrossRevenue = relevantBookings
    .filter((b) => b.bookingStatus !== 'CANCELLED')
    .reduce((sum, b) => sum + b.pricing.total, 0);

  // Calculate distinct customers
  const uniqueCustomers = Array.from(new Set(relevantBookings.map((b) => b.customerId || b.customerName))).length;

  // Average Rating
  const avgRating =
    relevantReviews.length > 0
      ? (
          relevantReviews.reduce((acc, r) => acc + r.rating, 0) / relevantReviews.length
        ).toFixed(1)
      : '4.9';

  // Revenue breakdown: Hotel vs Transportation
  const hotelRevenue = relevantBookings
    .filter((b) => {
      const biz = businesses.find((x) => x.id === b.businessId);
      return biz?.category === 'ACCOMMODATION' && b.bookingStatus !== 'CANCELLED';
    })
    .reduce((acc, b) => acc + b.pricing.total, 0);

  const transportRevenue = relevantBookings
    .filter((b) => {
      const biz = businesses.find((x) => x.id === b.businessId);
      return biz?.category === 'TRANSPORTATION' && b.bookingStatus !== 'CANCELLED';
    })
    .reduce((acc, b) => acc + b.pricing.total, 0);

  const selectedBizObj =
    selectedOwnerBusinessId !== 'ALL'
      ? myBusinesses.find((b) => b.id === selectedOwnerBusinessId)
      : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
                Partner Operations
              </span>
              {selectedBizObj && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                  Active: {selectedBizObj.name}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Business Owner Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Monitor unified performance across your accommodation and transportation fleet with real-time dispatch and earnings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedOwnerBusinessId !== 'ALL' && (
              <button
                onClick={() => setSelectedOwnerBusinessId('ALL')}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition cursor-pointer"
              >
                View All Businesses
              </button>
            )}
            <Link
              to="/owner/businesses/create"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Business</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 8 Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        {/* 1. Total Businesses */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-500">Total Businesses</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{totalBusinessesCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Properties & Fleet hubs</p>
        </div>

        {/* 2. Active Businesses */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-500">Active Listings</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600">{activeApprovedBusinesses}</p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Live on marketplace</p>
        </div>

        {/* 3. Pending Approval */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-500">Pending Approval</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600">{pendingApprovalBusinesses}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Admin review status</p>
        </div>

        {/* 4. Total Bookings */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-500">Total Bookings</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{totalBookingsCount}</p>
          <p className="text-[11px] text-blue-600 font-semibold mt-0.5">{pendingBookings.length} pending action</p>
        </div>

        {/* 5. Today's Bookings */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-500">Today's Orders</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-teal-700">{todayBookingsCount}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Arriving / dispatching today</p>
        </div>

        {/* 6. Total Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-500">Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600">{formatPrice(totalGrossRevenue, currency)}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Gross booking value</p>
        </div>

        {/* 7. Total Customers */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-500">Total Customers</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{uniqueCustomers || 12}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Verified guests & drivers</p>
        </div>

        {/* 8. Average Rating */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-500">Average Rating</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600">{avgRating} ★</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{relevantReviews.length || 38} reviews</p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Quick Operations
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/owner/accommodation/rooms"
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition shrink-0">
              <Bed className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700">Add Room</p>
              <p className="text-[10px] text-slate-500">Manage stay units</p>
            </div>
          </Link>

          <Link
            to="/owner/transportation"
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">Add Vehicle</p>
              <p className="text-[10px] text-slate-500">Expand rental fleet</p>
            </div>
          </Link>

          <Link
            to="/owner/calendar"
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 transition group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-105 transition shrink-0">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-purple-700">Manage Calendar</p>
              <p className="text-[10px] text-slate-500">Block dates & rates</p>
            </div>
          </Link>

          <Link
            to="/owner/bookings"
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 transition group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center group-hover:scale-105 transition shrink-0">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-teal-700">View Bookings</p>
              <p className="text-[10px] text-slate-500">{pendingBookings.length} need action</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Business Performance Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hotel vs Transportation Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Performance Comparison</h3>
              <p className="text-xs text-slate-500">Accommodation Stays vs Transportation Rentals</p>
            </div>
            <Link to="/owner/revenue" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
              <span>Full Financials</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                  <Bed className="w-4 h-4 text-blue-600" /> Accommodation Revenue
                </span>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded">
                  {relevantRooms.length} Rooms
                </span>
              </div>
              <p className="text-xl font-black text-slate-900">{formatPrice(hotelRevenue, currency)}</p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>Occupancy Rate</span>
                <span className="font-bold text-blue-700">78.4%</span>
              </div>
              <div className="w-full bg-blue-100 h-2 rounded-full overflow-hidden mt-1">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '78.4%' }}></div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <Car className="w-4 h-4 text-emerald-600" /> Transportation Revenue
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                  {relevantVehicles.length} Vehicles
                </span>
              </div>
              <p className="text-xl font-black text-slate-900">{formatPrice(transportRevenue, currency)}</p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                <span>Fleet Utilization</span>
                <span className="font-bold text-emerald-700">86.2%</span>
              </div>
              <div className="w-full bg-emerald-100 h-2 rounded-full overflow-hidden mt-1">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '86.2%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Notifications Widget */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-emerald-600" />
              <span>Business Alerts</span>
            </h3>
            <Link to="/owner/notifications" className="text-[11px] font-bold text-emerald-600 hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-2.5">
            {notifications.slice(0, 3).map((n) => (
              <div key={n.id} className="p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition text-xs">
                <p className="font-bold text-slate-800 truncate">{n.title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                <span className="text-[9px] text-slate-400 block mt-1">
                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Bookings & Reservations</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Instant action required on newly submitted customer requests
            </p>
          </div>
          <Link
            to="/owner/bookings"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>All Bookings Directory</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {relevantBookings.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No bookings found for the selected business context.
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-3 px-5 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <div className="col-span-2">Id ▾</div>
              <div className="col-span-3">Customer</div>
              <div className="col-span-3">Service & Location</div>
              <div className="col-span-2">Date ▾</div>
              <div className="col-span-1">Price ▾</div>
              <div className="col-span-1 text-right">Status</div>
            </div>

            {relevantBookings.slice(0, 5).map((b, idx) => {
              const shortId = `#${b.bookingReference.replace('BK-', '').slice(0, 4) || '263' + idx}`;
              const isPending = b.bookingStatus === 'PENDING';
              const isConfirmed = b.bookingStatus === 'CONFIRMED';
              const isCompleted = b.bookingStatus === 'COMPLETED';

              return (
                <div
                  key={b.id}
                  className="grid grid-cols-12 gap-3 items-center px-5 py-3.5 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 text-slate-700 shadow-2xs hover:bg-slate-50/70 transition"
                >
                  <div className="col-span-2 font-mono font-bold text-xs text-slate-900">
                    {shortId}
                  </div>

                  <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                    <img
                      src={`https://images.unsplash.com/photo-${1534528741775 + idx * 23}?auto=format&fit=crop&w=80&q=80`}
                      alt={b.customerName}
                      className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                    />
                    <span className="font-bold text-xs truncate text-slate-900">
                      {b.customerName}
                    </span>
                  </div>

                  <div className="col-span-3 text-xs truncate text-slate-500">
                    {b.serviceName}, {b.businessLocation}
                  </div>

                  <div className="col-span-2 text-xs font-medium text-slate-600">
                    {formatDate(b.startDate)}
                  </div>

                  <div className="col-span-1 text-xs font-black text-slate-900">
                    {formatPrice(b.pricing.total, currency)}
                  </div>

                  <div className="col-span-1 flex items-center justify-end gap-1.5 text-xs font-bold">
                    {isPending && (
                      <span className="flex items-center gap-1.5 text-rose-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                        <span>Pending</span>
                      </span>
                    )}
                    {isConfirmed && (
                      <span className="flex items-center gap-1.5 text-emerald-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span>Dispatch</span>
                      </span>
                    )}
                    {isCompleted && (
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                        <span>Completed</span>
                      </span>
                    )}
                    {!isPending && !isConfirmed && !isCompleted && (
                      <span className="text-slate-400">{b.bookingStatus}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Reviews */}
      {relevantReviews.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Customer Reviews</h3>
              <p className="text-xs text-slate-500">Verified feedback from recent guests and travelers</p>
            </div>
            <Link to="/owner/reviews" className="text-xs font-bold text-emerald-600 hover:underline">
              View All Reviews
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relevantReviews.slice(0, 2).map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{rev.customerName}</span>
                  <span className="text-amber-600 font-bold text-xs flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {rev.rating} / 5
                  </span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2">"{rev.comment}"</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                  <Link to="/owner/reviews" className="text-emerald-600 font-bold hover:underline">
                    Reply to Guest
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  Heart,
  Clock,
  MapPin,
  Bed,
  Car,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PriceDisplay } from '../../components/common/PriceDisplay';
import { Badge } from '../../components/common/Badge';
import { formatDate } from '../../utils/dates';

export const CustomerDashboardPage: React.FC = () => {
  const { currentUser, bookings, favorites, businesses, rooms, vehicles, t } = useApp();
  const navigate = useNavigate();

  const userBookings = bookings.filter((b) => b.customerId === currentUser.id);
  const upcomingBooking = userBookings.find((b) => b.bookingStatus === 'CONFIRMED');

  const stats = [
    {
      label: 'Upcoming Trips',
      value: userBookings.filter((b) => b.bookingStatus === 'CONFIRMED').length,
      icon: CalendarCheck,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Saved Favorites',
      value: favorites.length,
      icon: Heart,
      color: 'text-rose-600 bg-rose-50',
    },
    {
      label: 'Completed Bookings',
      value: userBookings.filter((b) => b.bookingStatus === 'COMPLETED').length,
      icon: ShieldCheck,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Reward Points',
      value: '450 pts',
      icon: Sparkles,
      color: 'text-amber-600 bg-amber-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-blue-300 font-bold uppercase tracking-wider">
              Customer Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5">
              Welcome back, {currentUser.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
              Manage your upcoming reservations in Cambodia, contact hosts directly, and view check-in vouchers.
            </p>
          </div>
          <Link
            to="/search"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition shrink-0"
          >
            Explore More Stays & Rides
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-3.5"
            >
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">{stat.label}</span>
                <span className="text-lg sm:text-xl font-black text-slate-900">{stat.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Trip Spotlight */}
      {upcomingBooking ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-base font-bold text-slate-900">Next Upcoming Trip</h2>
            </div>
            <Badge variant="success">Confirmed & Paid</Badge>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <img
                src={upcomingBooking.serviceImage}
                alt={upcomingBooking.serviceName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0"
              />
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {upcomingBooking.businessCategory}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1 truncate">
                  {upcomingBooking.serviceName}
                </h3>
                <p className="text-xs text-slate-500">{upcomingBooking.businessName}</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1 font-medium">
                  <CalendarCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>
                    {formatDate(upcomingBooking.startDate)} — {formatDate(upcomingBooking.endDate)}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <PriceDisplay
                amountUSD={upcomingBooking.pricing.total}
                period="total"
                size="lg"
              />
              <div className="flex items-center gap-2">
                <Link
                  to={`/customer/bookings/${upcomingBooking.id}`}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition"
                >
                  View Voucher
                </Link>
                <Link
                  to="/customer/messages"
                  className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
                  title="Chat with Host"
                >
                  <MessageSquare className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Recent Bookings List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">Recent Booking History</h2>
          <Link
            to="/customer/bookings"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {userBookings.length === 0 ? (
            <p className="py-6 text-center text-xs text-slate-400">No booking history yet.</p>
          ) : (
            userBookings.slice(0, 3).map((b) => (
              <div
                key={b.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={b.serviceImage}
                    alt={b.serviceName}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{b.serviceName}</h4>
                    <p className="text-[11px] text-slate-500">{b.businessName} • {b.bookingReference}</p>
                    <span className="text-[10px] text-slate-400">
                      {formatDate(b.startDate)} — {formatDate(b.endDate)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <Badge variant={b.bookingStatus === 'CONFIRMED' ? 'success' : 'neutral'}>
                    {b.bookingStatus}
                  </Badge>
                  <PriceDisplay amountUSD={b.pricing.total} size="sm" />
                  <Link
                    to={`/customer/bookings/${b.id}`}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { BarChart3, TrendingUp, Users, MapPin, Calendar, ArrowUpRight, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/currency';

export const AdminReportsPage: React.FC = () => {
  const { bookings, businesses, currency } = useApp();

  const totalGMV = bookings.reduce((sum, b) => sum + b.pricing.total, 0);
  const confirmedCount = bookings.filter((b) => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'COMPLETED').length;
  const cancelledCount = bookings.filter((b) => b.bookingStatus === 'CANCELLED').length;
  const cancellationRate = bookings.length > 0 ? ((cancelledCount / bookings.length) * 100).toFixed(1) : '0';

  const destinations = [
    { city: 'Siem Reap', share: '45%', bookings: 84, growth: '+32%' },
    { city: 'Phnom Penh', share: '28%', bookings: 52, growth: '+18%' },
    { city: 'Kampot', share: '15%', bookings: 28, growth: '+24%' },
    { city: 'Koh Rong', share: '12%', bookings: 22, growth: '+40%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reports & Platform Analytics</h1>
        <p className="text-xs text-slate-500 mt-1">
          Macro metrics, regional booking volumes, cancellation trends, and growth indicators
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-bold text-slate-500">Total Marketplace GMV</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{formatPrice(totalGMV, currency)}</p>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> +28.4% YoY
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-bold text-slate-500">Booking Velocity</p>
          <p className="text-2xl font-black text-purple-700 mt-1">{confirmedCount} confirmed</p>
          <span className="text-[11px] font-semibold text-slate-400 mt-1 block">94.2% completion rate</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-bold text-slate-500">Cancellation Rate</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{cancellationRate}%</p>
          <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">Industry benchmark: 8.5%</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-bold text-slate-500">Active Supply Count</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{businesses.length} Hubs</p>
          <span className="text-[11px] font-semibold text-slate-400 mt-1 block">100% locally operated</span>
        </div>
      </div>

      {/* Destination Performance Table */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-purple-600" />
          <span>Regional Booking Share (Top Destinations)</span>
        </h3>

        <div className="space-y-4">
          {destinations.map((d) => (
            <div key={d.city} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800">{d.city}</span>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-600">{d.growth}</span>
                  <span className="text-slate-500">{d.bookings} orders ({d.share})</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full"
                  style={{ width: d.share }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

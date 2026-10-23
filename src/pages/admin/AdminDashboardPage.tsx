import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  DollarSign,
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  FileText,
  LifeBuoy,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PriceDisplay } from '../../components/common/PriceDisplay';
import { Badge } from '../../components/common/Badge';
import { formatDate } from '../../utils/dates';
import { formatPrice } from '../../utils/currency';

export const AdminDashboardPage: React.FC = () => {
  const { businesses, bookings, updateBusinessStatus, tickets, addToast, currency } = useApp();

  const pendingBusinesses = businesses.filter((b) => b.status === 'PENDING');
  const approvedBusinesses = businesses.filter((b) => b.status === 'APPROVED');

  const totalGross = bookings
    .filter((b) => b.bookingStatus !== 'CANCELLED')
    .reduce((sum, b) => sum + b.pricing.total, 0);

  const platformRevenue = Math.round(totalGross * 0.1); // 10% platform commission

  const openTickets = tickets.filter((t) => t.status !== 'RESOLVED');

  const stats = [
    {
      label: 'Gross Platform Bookings',
      value: formatPrice(totalGross, currency),
      subtext: '+24% this quarter',
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      label: 'Platform Revenue (10%)',
      value: formatPrice(platformRevenue, currency),
      subtext: 'Net marketplace fee',
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Pending Approvals',
      value: pendingBusinesses.length,
      subtext: 'Requires host verification',
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Open Disputes & Tickets',
      value: openTickets.length,
      subtext: 'Awaiting resolution',
      icon: LifeBuoy,
      color: 'text-rose-600 bg-rose-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-purple-300 font-bold uppercase tracking-wider">
              Super Admin Console
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-0.5">
              Marketplace Control & Governance
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
              Manage nationwide Cambodian partner onboarding, review moderation, and dispute arbitration.
            </p>
          </div>
          <Link
            to="/admin/businesses"
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition"
          >
            Review Pending Hosts
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
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
                <span className="text-[10px] text-slate-400 block mt-0.5">{stat.subtext}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending Businesses Approval Queue */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Pending Business Onboarding Requests</h2>
            <p className="text-xs text-slate-500">
              Verify Cambodian Ministry of Commerce registration and tax documentation
            </p>
          </div>
          <Link to="/admin/businesses" className="text-xs font-bold text-purple-600 hover:text-purple-700">
            View All ({businesses.length})
          </Link>
        </div>

        {pendingBusinesses.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <span>All business registration requests have been reviewed and approved!</span>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingBusinesses.map((b) => (
              <div
                key={b.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <img src={b.coverImage} alt={b.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{b.name}</h4>
                      <Badge variant="warning">Pending Review</Badge>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {b.category} • {b.city}, {b.province}
                    </p>
                    <span className="text-[10px] font-mono text-slate-400">
                      Reg: {b.verificationDocs?.registrationNumber || 'N/A'} • TIN: {b.verificationDocs?.taxNumber || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      updateBusinessStatus(b.id, 'APPROVED');
                      addToast('Business Approved', `${b.name} is now active on KampujaGo!`, 'success');
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                  >
                    Approve Listing
                  </button>
                  <button
                    onClick={() => {
                      updateBusinessStatus(b.id, 'REJECTED');
                      addToast('Business Rejected', `${b.name} registration was rejected.`, 'info');
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Global Bookings Stream */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Live Network Bookings</h2>
            <p className="text-xs text-slate-500">Platform-wide transaction feed across all provinces</p>
          </div>
          <Link to="/admin/bookings" className="text-xs font-bold text-purple-600 hover:underline">
            View All ({bookings.length})
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {bookings.slice(0, 4).map((b) => (
            <div key={b.id} className="py-3 flex items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-mono font-bold text-slate-900">{b.bookingReference}</span>
                <p className="text-slate-600 font-medium">
                  {b.customerName} → {b.serviceName} ({b.businessName})
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={b.bookingStatus === 'CONFIRMED' ? 'success' : 'neutral'}>
                  {b.bookingStatus}
                </Badge>
                <PriceDisplay amountUSD={b.pricing.total} size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

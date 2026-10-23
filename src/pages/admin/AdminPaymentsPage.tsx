import React, { useState } from 'react';
import { DollarSign, CreditCard, ArrowUpRight, TrendingUp, CheckCircle, Clock, ShieldCheck, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/currency';
import { Badge } from '../../components/common/Badge';

export const AdminPaymentsPage: React.FC = () => {
  const { bookings, businesses, currency, addToast } = useApp();
  const [filterMethod, setFilterMethod] = useState<'ALL' | 'BAKONG' | 'CARD' | 'CASH_ON_ARRIVAL'>('ALL');

  const validBookings = bookings.filter((b) => b.bookingStatus !== 'CANCELLED');
  const totalVolume = validBookings.reduce((sum, b) => sum + b.pricing.total, 0);
  const totalCommission = Math.round(totalVolume * 0.1);
  const hostPayoutsDue = totalVolume - totalCommission;

  const filtered = bookings.filter((b) => {
    if (filterMethod !== 'ALL' && b.paymentMethod !== filterMethod) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Payment & Escrow Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Reconcile KHQR payments, international card settlements, and partner disbursement cycles
          </p>
        </div>

        <button
          onClick={() => addToast('Exporting Report', 'Exporting CSV of all platform transactions.', 'info')}
          className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Financial Ledger</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-500">Gross Processed Volume</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">{formatPrice(totalVolume, currency)}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">100% Guaranteed Escrow</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-500">Platform Revenue (10%)</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-700">{formatPrice(totalCommission, currency)}</p>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">TravelGo Net Commission</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold text-slate-500">Partner Payouts Scheduled</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-700">{formatPrice(hostPayoutsDue, currency)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Weekly ABA wire release</p>
        </div>
      </div>

      {/* Transaction Log */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-900">Settled Transactions</h3>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
            {(['ALL', 'BAKONG', 'CARD', 'CASH_ON_ARRIVAL'] as const).map((method) => (
              <button
                key={method}
                onClick={() => setFilterMethod(method)}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  filterMethod === method ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                {method === 'BAKONG' ? 'Bakong KHQR' : method.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Transaction ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Gross Amount</th>
                <th className="py-3.5 px-4">Fee (10%)</th>
                <th className="py-3.5 px-4">Host Payout (90%)</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((b) => {
                const comm = Math.round(b.pricing.total * 0.1);
                const payout = b.pricing.total - comm;
                return (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {b.bookingReference}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{b.customerName}</p>
                      <p className="text-[10px] text-slate-400">{b.customerEmail}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-700">
                        {b.paymentMethod === 'BAKONG' ? 'Bakong (KHQR)' : b.paymentMethod.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {formatPrice(b.pricing.total, currency)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-purple-700">
                      {formatPrice(comm, currency)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">
                      {formatPrice(payout, currency)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={b.paymentStatus === 'PAID' ? 'success' : 'warning'}>
                        {b.paymentStatus}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

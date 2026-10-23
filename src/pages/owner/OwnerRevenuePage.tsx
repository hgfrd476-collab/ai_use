import React, { useState } from 'react';
import { DollarSign, ArrowUpRight, CheckCircle2, Clock, Building2, Plus, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PriceDisplay } from '../../components/common/PriceDisplay';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { formatPrice } from '../../utils/currency';

export const OwnerRevenuePage: React.FC = () => {
  const { currentUser, businesses, bookings, addToast, currency } = useApp();

  const myBusinesses = businesses.filter((b) => b.ownerId === currentUser.id);
  const myBusinessIds = myBusinesses.map((b) => b.id);
  const myBookings = bookings.filter((b) => myBusinessIds.includes(b.businessId));

  const totalGross = myBookings
    .filter((b) => b.bookingStatus !== 'CANCELLED')
    .reduce((sum, b) => sum + b.pricing.total, 0);

  const platformCommission = Math.round(totalGross * 0.1);
  const netEarnings = totalGross - platformCommission;
  const [availableBalance, setAvailableBalance] = useState(netEarnings > 0 ? netEarnings : 340);

  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState(availableBalance);

  const [payoutsList, setPayoutsList] = useState([
    {
      id: 'PAY-8821',
      date: '2026-03-15',
      amount: 480,
      bank: 'ABA Bank (001 882 994)',
      status: 'PAID',
    },
    {
      id: 'PAY-8790',
      date: '2026-03-01',
      amount: 320,
      bank: 'ABA Bank (001 882 994)',
      status: 'PAID',
    },
  ]);

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (payoutAmount > availableBalance) {
      addToast('Error', 'Amount exceeds available balance', 'error');
      return;
    }

    const newPayout = {
      id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      amount: payoutAmount,
      bank: 'ABA Bank (001 882 994)',
      status: 'PROCESSING',
    };

    setPayoutsList([newPayout, ...payoutsList]);
    setAvailableBalance(availableBalance - payoutAmount);
    setPayoutModalOpen(false);
    addToast('Payout Queued', `$${payoutAmount} transfer queued to ABA Bank account.`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Revenue & Payouts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Automated payouts to your ABA Bank or Bakong account with 0% hidden wire fees.
          </p>
        </div>

        <button
          onClick={() => {
            setPayoutAmount(availableBalance);
            setPayoutModalOpen(true);
          }}
          disabled={availableBalance <= 0}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition cursor-pointer"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Request ABA Payout</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Available Payout Balance</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {formatPrice(availableBalance, currency)}
          </div>
          <span className="text-[10px] text-emerald-700 font-bold block mt-1">Ready for withdrawal</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Total Gross Bookings</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {formatPrice(totalGross, currency)}
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Platform Commission: -{formatPrice(platformCommission, currency)} (10%)</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">Linked Bank Account</span>
          <div className="text-base font-bold text-slate-900 mt-1">ABA Bank (KHQR)</div>
          <span className="text-xs font-mono text-slate-500 block">Acc: 001 882 994</span>
        </div>
      </div>

      {/* Payout History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Payout Transfer History</h2>
          <span className="text-xs text-slate-500">{payoutsList.length} transfers</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="p-4">Transfer Reference</th>
                <th className="p-4">Date</th>
                <th className="p-4">Destination Account</th>
                <th className="p-4">Amount</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {payoutsList.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4 font-mono font-bold text-slate-900">{p.id}</td>
                  <td className="p-4">{p.date}</td>
                  <td className="p-4 font-semibold text-slate-800">{p.bank}</td>
                  <td className="p-4 font-black text-emerald-700 text-sm">${p.amount} USD</td>
                  <td className="p-4 text-right">
                    <Badge variant={p.status === 'PAID' ? 'success' : 'warning'}>
                      {p.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Payout Modal */}
      <Modal
        isOpen={payoutModalOpen}
        onClose={() => setPayoutModalOpen(false)}
        title="Request Earnings Payout"
        subtitle="Funds transfer via national Bakong / ABA network within 24 hours"
      >
        <form onSubmit={handleRequestPayout} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Withdrawal Amount (Max: ${availableBalance} USD)
            </label>
            <input
              type="number"
              required
              min={10}
              max={availableBalance}
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm font-bold text-slate-800"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150 space-y-1 text-slate-600">
            <div className="flex justify-between">
              <span>Payout Method:</span>
              <strong className="text-slate-900">ABA Bank Transfer</strong>
            </div>
            <div className="flex justify-between">
              <span>Account Number:</span>
              <strong className="font-mono text-slate-900">001 882 994</strong>
            </div>
            <div className="flex justify-between">
              <span>Transfer Fee:</span>
              <strong className="text-emerald-700">$0.00 (Free)</strong>
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setPayoutModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
            >
              Confirm Withdrawal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

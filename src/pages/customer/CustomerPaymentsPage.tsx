import React from 'react';
import { CreditCard, FileDown, CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PriceDisplay } from '../../components/common/PriceDisplay';
import { Badge } from '../../components/common/Badge';
import { formatDate } from '../../utils/dates';

export const CustomerPaymentsPage: React.FC = () => {
  const { currentUser, bookings, addToast } = useApp();

  const userBookings = bookings.filter((b) => b.customerId === currentUser.id);

  const handleDownloadInvoice = (ref: string) => {
    addToast('Invoice Downloaded', `Generated official tax invoice for ${ref}`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Payments & Receipts
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          View your transaction history, verified receipts, and download tax invoices.
        </p>
      </div>

      {/* Payment Methods Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-sm">
              ABA
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">ABA PAY (KHQR)</h4>
              <p className="text-[11px] text-slate-500">Default Instant Checkout</p>
            </div>
          </div>
          <Badge variant="success">Active</Badge>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Mastercard •••• 8829</h4>
              <p className="text-[11px] text-slate-500">Expires 10/28</p>
            </div>
          </div>
          <Badge variant="neutral">Saved</Badge>
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Payment Transactions</h2>
          <span className="text-xs text-slate-500">{userBookings.length} total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="p-4">Transaction / Date</th>
                <th className="p-4">Service</th>
                <th className="p-4">Method</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {userBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4">
                    <p className="font-mono font-bold text-slate-900">{b.bookingReference}</p>
                    <span className="text-[10px] text-slate-400">{formatDate(b.createdAt)}</span>
                  </td>
                  <td className="p-4 font-semibold text-slate-800 max-w-[180px] truncate">
                    {b.serviceName}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                      {b.paymentMethod.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4">
                    <PriceDisplay amountUSD={b.pricing.total} size="sm" />
                  </td>
                  <td className="p-4">
                    <Badge variant={b.paymentStatus === 'PAID' ? 'success' : 'warning'}>
                      {b.paymentStatus}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDownloadInvoice(b.bookingReference)}
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

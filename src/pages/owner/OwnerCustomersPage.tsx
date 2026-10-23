import React, { useState } from 'react';
import { Users, Search, Mail, Phone, CalendarCheck, DollarSign, MessageSquare, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/currency';
import { Link } from 'react-router-dom';

export const OwnerCustomersPage: React.FC = () => {
  const { currentUser, businesses, bookings, currency, selectedOwnerBusinessId } = useApp();
  const [search, setSearch] = useState('');

  const myBusinesses = businesses.filter((b) => b.ownerId === currentUser.id);
  const activeBusinesses =
    selectedOwnerBusinessId === 'ALL'
      ? myBusinesses
      : myBusinesses.filter((b) => b.id === selectedOwnerBusinessId);
  const activeIds = activeBusinesses.map((b) => b.id);

  const relevantBookings = bookings.filter((b) => activeIds.includes(b.businessId));

  // Group by customer email
  const customerMap = new Map<string, {
    name: string;
    email: string;
    phone: string;
    bookingsCount: number;
    totalSpent: number;
    lastBookingDate: string;
  }>();

  relevantBookings.forEach((b) => {
    const key = b.customerEmail || b.customerName;
    if (!customerMap.has(key)) {
      customerMap.set(key, {
        name: b.customerName,
        email: b.customerEmail,
        phone: b.customerPhone || '+855 12 888 999',
        bookingsCount: 0,
        totalSpent: 0,
        lastBookingDate: b.createdAt,
      });
    }
    const current = customerMap.get(key)!;
    current.bookingsCount += 1;
    if (b.bookingStatus !== 'CANCELLED') {
      current.totalSpent += b.pricing.total;
    }
    if (new Date(b.createdAt) > new Date(current.lastBookingDate)) {
      current.lastBookingDate = b.createdAt;
    }
  });

  const customersList = Array.from(customerMap.values()).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Guests and renters who have booked through your active business listings
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {customersList.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No customers found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Total Reservations</th>
                  <th className="py-3.5 px-4">Lifetime Spend</th>
                  <th className="py-3.5 px-4">Last Activity</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customersList.map((c) => (
                  <tr key={c.email} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{c.name}</p>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-medium">
                            Verified Guest
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-slate-700 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.email}</span>
                      </p>
                      <p className="text-slate-400 text-[11px] flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.phone}</span>
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900">{c.bookingsCount}</span> bookings
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600">
                      {formatPrice(c.totalSpent, currency)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(c.lastBookingDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to="/owner/messages"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white font-semibold transition text-xs"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

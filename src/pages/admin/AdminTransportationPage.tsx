import React, { useState } from 'react';
import { Car, Search, CheckCircle, XCircle, Eye, Star, MapPin, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import { Link } from 'react-router-dom';

export const AdminTransportationPage: React.FC = () => {
  const { businesses, vehicles, updateBusinessStatus, addToast } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'APPROVED' | 'PENDING' | 'REJECTED'>('ALL');
  const [search, setSearch] = useState('');

  const transportBiz = businesses.filter((b) => b.category === 'TRANSPORTATION');

  const filtered = transportBiz.filter((b) => {
    if (filter !== 'ALL' && b.status !== filter) return false;
    if (search && !b.name.toLowerCase().includes(search.toLowerCase()) && !b.city.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Transportation Fleet Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervise motorbike rentals, private chauffeurs, VIP vans, and island ferry operators
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
          {(['ALL', 'APPROVED', 'PENDING', 'REJECTED'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                filter === status ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search rental companies or locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((biz) => {
          const bizVehicles = vehicles.filter((v) => v.businessId === biz.id);
          return (
            <div key={biz.id} className="bg-white rounded-3xl border border-slate-200/80 p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="relative rounded-2xl overflow-hidden aspect-video mb-3">
                  <img src={biz.coverImage || biz.images[0]} alt={biz.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2.5 left-2.5">
                    <Badge variant={biz.status === 'APPROVED' ? 'success' : biz.status === 'PENDING' ? 'warning' : 'danger'}>
                      {biz.status}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{biz.rating} ({biz.reviewCount})</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold mb-1">
                  <Car className="w-3.5 h-3.5" />
                  <span>{biz.type} Fleet</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{biz.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{biz.city}, Cambodia</span>
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Fleet Size:</span>
                  <span className="font-bold text-emerald-700">{bizVehicles.length} Registered Units</span>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  to={`/transportation/${biz.id}`}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Marketplace</span>
                </Link>

                <div className="flex items-center gap-1.5">
                  {biz.status !== 'APPROVED' && (
                    <button
                      onClick={() => {
                        updateBusinessStatus(biz.id, 'APPROVED');
                        addToast('Vehicle Fleet Approved', `${biz.name} is now approved`, 'success');
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
                    >
                      Approve
                    </button>
                  )}
                  {biz.status !== 'REJECTED' && (
                    <button
                      onClick={() => {
                        updateBusinessStatus(biz.id, 'REJECTED');
                        addToast('Fleet Suspended', `${biz.name} was suspended`, 'warning');
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition cursor-pointer"
                    >
                      Suspend
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

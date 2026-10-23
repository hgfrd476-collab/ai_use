import React, { useState } from 'react';
import { MapPin, Search, Plus, Check, Star, Building2, Car } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LOCATIONS } from '../../data/locations';

export const AdminLocationsPage: React.FC = () => {
  const { businesses, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [locationsList, setLocationsList] = useState(
    LOCATIONS.filter((l) => l.id !== 'ALL').map((loc) => ({
      ...loc,
      featured: true,
      active: true,
    }))
  );

  const toggleFeatured = (id: string) => {
    setLocationsList((prev) =>
      prev.map((l) => (l.id === id ? { ...l, featured: !l.featured } : l))
    );
    addToast('Location Updated', 'Featured destination status toggled.', 'info');
  };

  const filtered = locationsList.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.khmerName.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Location Management</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage supported Cambodian provinces, travel hotspots, and homepage featured destinations
          </p>
        </div>

        <button
          onClick={() => addToast('Add Destination', 'Province onboarding modal opened', 'info')}
          className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Destination</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search provinces or cities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      {/* Grid of Locations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((loc) => {
          const stayCount = businesses.filter(
            (b) => b.category === 'ACCOMMODATION' && b.city.toLowerCase().includes(loc.name.toLowerCase())
          ).length;
          const transCount = businesses.filter(
            (b) => b.category === 'TRANSPORTATION' && b.city.toLowerCase().includes(loc.name.toLowerCase())
          ).length;

          return (
            <div key={loc.id} className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      <span>{loc.name}</span>
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">{loc.khmerName}</p>
                  </div>
                  <button
                    onClick={() => toggleFeatured(loc.id)}
                    className={`p-2 rounded-xl border transition cursor-pointer ${
                      loc.featured
                        ? 'bg-amber-50 border-amber-200 text-amber-600'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                    title={loc.featured ? 'Featured on Home' : 'Not Featured'}
                  >
                    <Star className={`w-4 h-4 ${loc.featured ? 'fill-amber-400' : ''}`} />
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="font-bold text-slate-900">{stayCount} Stays</p>
                      <p className="text-[10px] text-slate-400">Hotels & Villas</p>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-2">
                    <Car className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-bold text-slate-900">{transCount} Fleets</p>
                      <p className="text-[10px] text-slate-400">Rides & Vans</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Active Destination
                </span>
                <span className="text-[11px] font-bold text-purple-700">
                  {loc.featured ? 'Featured on Home' : 'Standard'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

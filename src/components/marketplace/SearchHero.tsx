import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bed, Car, MapPin, Calendar, Users, Clock, Search, Sparkles } from 'lucide-react';
import { LOCATIONS } from '../../data/locations';
import { useApp } from '../../context/AppContext';
import { getTodayDateString, getTomorrowDateString, getFutureDateString } from '../../utils/dates';

export const SearchHero: React.FC = () => {
  const { t } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'accommodation' | 'transportation'>('accommodation');

  // Accommodation search state
  const [location, setLocation] = useState('siem-reap');
  const [checkIn, setCheckIn] = useState(getFutureDateString(2));
  const [checkOut, setCheckOut] = useState(getFutureDateString(5));
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);

  // Transportation search state
  const [transLocation, setTransLocation] = useState('siem-reap');
  const [pickupDate, setPickupDate] = useState(getFutureDateString(2));
  const [pickupTime, setPickupTime] = useState('09:00');
  const [returnDate, setReturnDate] = useState(getFutureDateString(4));
  const [returnTime, setReturnTime] = useState('18:00');
  const [vehicleType, setVehicleType] = useState('ALL');

  const handleAccommodationSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      category: 'accommodation',
      location,
      checkIn,
      checkOut,
      adults: adults.toString(),
      children: childrenCount.toString(),
    });
    navigate(`/search?${params.toString()}`);
  };

  const handleTransportationSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      category: 'transportation',
      location: transLocation,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      vehicleType,
    });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white shadow-2xl p-5 sm:p-8 md:p-12 mb-10">
      {/* Background Ambience Image */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1600&q=80"
          alt="Angkor Cambodia"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Cambodia's #1 Local Booking Platform</span>
        </div>

        {/* Hero Headlines */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white mb-3">
          {t.tagline}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
          {t.subTagline}
        </p>

        {/* Search Box Container */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-2xl text-slate-800 text-left border border-white/20">
          {/* Tabs */}
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100">
            <button
              onClick={() => setActiveTab('accommodation')}
              id="tab-accommodation"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'accommodation'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Bed className="w-4 h-4" />
              <span>{t.accommodation}</span>
            </button>

            <button
              onClick={() => setActiveTab('transportation')}
              id="tab-transportation"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeTab === 'transportation'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>{t.transportation}</span>
            </button>
          </div>

          {/* Accommodation Form */}
          {activeTab === 'accommodation' ? (
            <form onSubmit={handleAccommodationSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
              {/* Destination */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" /> {t.location}
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.khmerName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" /> {t.checkIn} — {t.checkOut}
                </label>
                <div className="grid grid-cols-2 gap-1">
                  <input
                    type="date"
                    value={checkIn}
                    min={getTodayDateString()}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-[11px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-[11px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-600" /> {t.guests}
                </label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                  <select
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none flex-1"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                      <option key={n} value={n}>
                        {n} Adult{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                  <span className="text-slate-300">|</span>
                  <select
                    value={childrenCount}
                    onChange={(e) => setChildrenCount(Number(e.target.value))}
                    className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none flex-1"
                  >
                    {[0, 1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} Child{n > 1 ? 'ren' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div>
                <button
                  type="submit"
                  id="btn-search-accommodation"
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-md shadow-blue-600/20 transition cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>{t.searchStays}</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleTransportationSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
              {/* Location */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Pickup City
                </label>
                <select
                  value={transLocation}
                  onChange={(e) => setTransLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pickup & Return Date */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" /> {t.pickupDate} — {t.returnDate}
                </label>
                <div className="grid grid-cols-2 gap-1">
                  <input
                    type="date"
                    value={pickupDate}
                    min={getTodayDateString()}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-[11px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <input
                    type="date"
                    value={returnDate}
                    min={pickupDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-[11px] font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Vehicle Type */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-emerald-600" /> {t.vehicleType}
                </label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="ALL">All Vehicle Types</option>
                  <option value="SCOOTER">Motorbikes & Scooters</option>
                  <option value="CAR">Cars & Sedans</option>
                  <option value="SUV">SUVs & 4WDs</option>
                  <option value="TUK_TUK">Khmer Tuk Tuks</option>
                  <option value="VAN">15-Seat Passenger Vans</option>
                  <option value="BOAT">Boats & Ferries</option>
                </select>
              </div>

              {/* Search Button */}
              <div>
                <button
                  type="submit"
                  id="btn-search-transport"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>{t.searchVehicles}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

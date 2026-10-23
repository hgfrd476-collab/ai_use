import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Car, ArrowRight, Sparkles } from 'lucide-react';
import { LOCATIONS } from '../../data/locations';

export const DestinationsPage: React.FC = () => {
  return (
    <div className="pb-16 w-full">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          The Kingdom of Wonder
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
          Explore Cambodia's Top Destinations
        </h1>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          From the ancient spires of Angkor Wat to the vibrant boulevards of Phnom Penh and the peaceful pepper plantations of Kampot.
        </p>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LOCATIONS.map((loc) => (
          <div
            key={loc.id}
            className="group rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                  {loc.khmerName}
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Cambodia</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition">
                  {loc.name}
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {loc.description}
                </p>

                {/* Popular Highlights Chips */}
                {loc.highlights && loc.highlights.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Highlights
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {loc.highlights.map((h, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium text-slate-700 bg-slate-100 rounded-md px-2 py-0.5"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between gap-2">
              <Link
                to={`/search?category=accommodation&location=${loc.id}`}
                className="flex-1 flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-bold py-2 rounded-xl transition"
              >
                <Bed className="w-3.5 h-3.5" />
                <span>Stays ({loc.popularStaysCount})</span>
              </Link>
              <Link
                to={`/search?category=transportation&location=${loc.id}`}
                className="flex-1 flex items-center justify-center gap-1 bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-xs font-bold py-2 rounded-xl transition"
              >
                <Car className="w-3.5 h-3.5" />
                <span>Rides</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

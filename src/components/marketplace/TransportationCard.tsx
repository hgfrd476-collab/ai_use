import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Users, Fuel, Gauge, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { Vehicle, Business } from '../../types';
import { useApp } from '../../context/AppContext';
import { RatingStars } from '../common/RatingStars';
import { PriceDisplay } from '../common/PriceDisplay';
import { Badge } from '../common/Badge';

interface TransportationCardProps {
  vehicle: Vehicle;
  business?: Business;
  onBookNow?: (vehicle: Vehicle) => void;
}

export const TransportationCard: React.FC<TransportationCardProps> = ({
  vehicle,
  business,
  onBookNow,
}) => {
  const { isFavorite, toggleFavorite, t } = useApp();
  const favorited = isFavorite(vehicle.id);

  return (
    <div className="group rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <img
          src={vehicle.images[0]}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <Badge variant="primary" size="sm" className="bg-white/95 backdrop-blur-xs text-slate-800 border-none font-bold shadow-xs">
            {vehicle.vehicleType}
          </Badge>
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 shadow-xs">
            <CheckCircle2 className="w-3 h-3" /> Ready to Ride
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(vehicle.id);
          }}
          aria-label="Save to favorites"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 hover:text-rose-600 hover:scale-110 shadow-md transition z-10 cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Host & Location */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="flex items-center gap-1 font-medium truncate max-w-[65%]">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {business ? `${business.name}, ${business.city}` : 'Siem Reap, Cambodia'}
            </span>
            <RatingStars rating={business?.rating || 4.9} reviewCount={business?.reviewCount || 45} />
          </div>

          {/* Vehicle Name */}
          <Link to={`/transportation/${vehicle.id}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition line-clamp-1">
              {vehicle.name}
            </h3>
          </Link>

          {/* Key Specifications Grid */}
          <div className="mt-3 grid grid-cols-3 gap-1.5 text-center text-slate-600 bg-slate-50 rounded-xl p-2 border border-slate-150">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Seats</span>
              <span className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1">
                <Users className="w-3 h-3 text-slate-400" /> {vehicle.seats}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Gear</span>
              <span className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1">
                <Gauge className="w-3 h-3 text-slate-400" /> {vehicle.transmission.slice(0, 4)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Fuel</span>
              <span className="text-xs font-bold text-slate-800 flex items-center justify-center gap-1">
                <Fuel className="w-3 h-3 text-slate-400" /> {vehicle.fuelType}
              </span>
            </div>
          </div>

          {/* Inclusions */}
          <div className="mt-2.5 flex items-center gap-3 text-[11px] text-slate-500">
            {vehicle.helmetIncluded && (
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Helmets Incl.
              </span>
            )}
            {vehicle.insuranceIncluded && (
              <span className="flex items-center gap-1 text-blue-700 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Insured
              </span>
            )}
          </div>
        </div>

        {/* Footer: Price & CTA */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Daily rate</span>
            <PriceDisplay
              amountUSD={vehicle.pricePerDay}
              period="day"
              size="md"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              to={`/transportation/${vehicle.id}`}
              id={`btn-view-trans-${vehicle.id}`}
              className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-2.5 py-2 rounded-xl transition cursor-pointer"
            >
              <span>Details</span>
            </Link>

            <button
              onClick={() => onBookNow ? onBookNow(vehicle) : null}
              id={`btn-book-vehicle-${vehicle.id}`}
              className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-xs transition cursor-pointer"
            >
              <span>{t.bookNow}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Sparkles, Check, ChevronRight } from 'lucide-react';
import { Business, Room } from '../../types';
import { useApp } from '../../context/AppContext';
import { RatingStars } from '../common/RatingStars';
import { PriceDisplay } from '../common/PriceDisplay';
import { Badge } from '../common/Badge';

interface AccommodationCardProps {
  business: Business;
  lowestPriceRoom?: Room;
}

export const AccommodationCard: React.FC<AccommodationCardProps> = ({
  business,
  lowestPriceRoom,
}) => {
  const { isFavorite, toggleFavorite, t } = useApp();
  const favorited = isFavorite(business.id);

  const price = lowestPriceRoom ? lowestPriceRoom.basePrice : 65;
  const originalPrice = lowestPriceRoom?.discountPercent
    ? Math.round(price / (1 - lowestPriceRoom.discountPercent / 100))
    : undefined;

  return (
    <div className="group rounded-2xl bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <img
          src={business.coverImage || business.images[0]}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <Badge variant="primary" size="sm" className="bg-white/95 backdrop-blur-xs text-blue-900 border-none font-bold shadow-xs">
            {business.type}
          </Badge>
          {business.featured && (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-500 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 shadow-xs">
              <Sparkles className="w-3 h-3" /> Featured
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(business.id);
          }}
          aria-label="Save to favorites"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs text-slate-700 hover:text-rose-600 hover:scale-110 shadow-md transition z-10 cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Free Cancellation pill */}
        {business.policies.cancellationPolicy === 'FLEXIBLE' && (
          <div className="absolute bottom-3 left-3 bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
            Free Cancellation
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="flex items-center gap-1 font-medium truncate max-w-[60%]">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              {business.city}, {business.province}
            </span>
            <RatingStars rating={business.rating} reviewCount={business.reviewCount} />
          </div>

          {/* Property Name */}
          <Link to={`/accommodation/${business.id}`}>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-1">
              {business.name}
            </h3>
          </Link>

          {/* Description */}
          <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {business.description}
          </p>

          {/* Key Amenities */}
          <div className="mt-3 flex flex-wrap gap-1">
            {business.amenities.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium text-slate-600 bg-slate-100 rounded-md px-2 py-0.5"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Footer: Price & CTA */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between gap-2">
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Starting from</span>
            <PriceDisplay
              amountUSD={price}
              strikeUSD={originalPrice}
              period="night"
              size="md"
            />
          </div>

          <Link
            to={`/accommodation/${business.id}`}
            id={`btn-view-stay-${business.id}`}
            className="inline-flex items-center gap-1 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer"
          >
            <span>{t.viewDetails}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

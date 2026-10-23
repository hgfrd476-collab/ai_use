import React from 'react';
import { Heart, Bed, Car, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AccommodationCard } from '../../components/marketplace/AccommodationCard';
import { TransportationCard } from '../../components/marketplace/TransportationCard';
import { EmptyState } from '../../components/common/EmptyState';

export const CustomerFavoritesPage: React.FC = () => {
  const { favorites, businesses, rooms, vehicles } = useApp();

  const favoriteBusinesses = businesses.filter((b) => favorites.includes(b.id));
  const favoriteVehicles = vehicles.filter((v) => favorites.includes(v.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Saved Favorites ({favorites.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Your saved accommodations and vehicles for quick reference and trip planning.
        </p>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No Saved Favorites Yet"
          description="Click the heart icon on any accommodation or rental vehicle to save it to your personal wishlist."
          actionText="Explore Stays & Transportation"
          onAction={() => (window.location.href = '/search')}
        />
      ) : (
        <div className="space-y-8">
          {favoriteBusinesses.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Bed className="w-4 h-4 text-blue-600" />
                <span>Saved Accommodations ({favoriteBusinesses.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {favoriteBusinesses.map((biz) => {
                  const lowestRoom = rooms
                    .filter((r) => r.businessId === biz.id)
                    .sort((a, b) => a.basePrice - b.basePrice)[0];
                  return (
                    <AccommodationCard
                      key={biz.id}
                      business={biz}
                      lowestPriceRoom={lowestRoom}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {favoriteVehicles.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Car className="w-4 h-4 text-emerald-600" />
                <span>Saved Vehicles ({favoriteVehicles.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {favoriteVehicles.map((veh) => {
                  const biz = businesses.find((b) => b.id === veh.businessId);
                  return (
                    <TransportationCard
                      key={veh.id}
                      vehicle={veh}
                      business={biz}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

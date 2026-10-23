import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Search,
  Bed,
  Car,
  X,
  Star,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LOCATIONS } from '../../data/locations';
import { AccommodationCard } from '../../components/marketplace/AccommodationCard';
import { TransportationCard } from '../../components/marketplace/TransportationCard';
import { BookingModal } from '../../components/marketplace/BookingModal';
import { EmptyState } from '../../components/common/EmptyState';
import { Vehicle } from '../../types';

interface SearchResultsPageProps {
  initialCategoryOverride?: 'accommodation' | 'transportation';
}

export const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ initialCategoryOverride }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { businesses, rooms, vehicles, t, currency } = useApp();

  // Search Param Initializers
  const queryCategory = searchParams.get('category') === 'transportation' ? 'transportation' : 'accommodation';
  const initialCategory = initialCategoryOverride || queryCategory;
  const initialLocation = searchParams.get('location') || 'ALL';
  const initialType = searchParams.get('type') || 'ALL';

  // Filters State
  const [category, setCategory] = useState<'accommodation' | 'transportation'>(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [propertyType, setPropertyType] = useState(initialType);
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [minRating, setMinRating] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'rating'>('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Booking Modal State
  const [bookingVehicle, setBookingVehicle] = useState<Vehicle | null>(null);

  // Filter & Sort Logic for Accommodations
  const filteredAccommodations = useMemo(() => {
    return businesses
      .filter((b) => b.category === 'ACCOMMODATION' && b.status === 'APPROVED')
      .filter((b) => {
        if (selectedLocation !== 'ALL' && b.city.toLowerCase().replace(/\s+/g, '-') !== selectedLocation) {
          return false;
        }
        if (propertyType !== 'ALL' && b.type !== propertyType) {
          return false;
        }
        if (minRating > 0 && b.rating < minRating) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = b.name.toLowerCase().includes(q);
          const matchDesc = b.description.toLowerCase().includes(q);
          const matchCity = b.city.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCity) return false;
        }
        // Price check from rooms
        const bizRooms = rooms.filter((r) => r.businessId === b.id);
        const lowestRoomPrice = bizRooms.length > 0 ? Math.min(...bizRooms.map((r) => r.basePrice)) : 60;
        if (lowestRoomPrice > maxPrice) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        const aRooms = rooms.filter((r) => r.businessId === a.id);
        const bRooms = rooms.filter((r) => r.businessId === b.id);
        const aMin = aRooms.length > 0 ? Math.min(...aRooms.map((r) => r.basePrice)) : 60;
        const bMin = bRooms.length > 0 ? Math.min(...bRooms.map((r) => r.basePrice)) : 60;

        if (sortBy === 'price_low') return aMin - bMin;
        if (sortBy === 'price_high') return bMin - aMin;
        return b.rating - a.rating;
      });
  }, [businesses, rooms, selectedLocation, propertyType, minRating, maxPrice, searchQuery, sortBy]);

  // Filter & Sort Logic for Transportation
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => v.status === 'ACTIVE')
      .filter((v) => {
        const biz = businesses.find((b) => b.id === v.businessId);
        if (selectedLocation !== 'ALL' && biz && biz.city.toLowerCase().replace(/\s+/g, '-') !== selectedLocation) {
          return false;
        }
        if (propertyType !== 'ALL' && v.vehicleType !== propertyType) {
          return false;
        }
        if (v.pricePerDay > maxPrice) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = v.name.toLowerCase().includes(q);
          const matchDesc = v.description.toLowerCase().includes(q);
          if (!matchName && !matchDesc) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.pricePerDay - b.pricePerDay;
        if (sortBy === 'price_high') return b.pricePerDay - a.pricePerDay;
        return 0;
      });
  }, [vehicles, businesses, selectedLocation, propertyType, maxPrice, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedLocation('ALL');
    setPropertyType('ALL');
    setMaxPrice(300);
    setMinRating(0);
    setSearchQuery('');
    setSortBy('recommended');
  };

  const selectedVehicleBusiness = bookingVehicle
    ? businesses.find((b) => b.id === bookingVehicle.businessId) || businesses[1]
    : null;

  return (
    <div className="pb-16">
      {/* Category Toggle & Title Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {category === 'accommodation' ? 'Find Accommodations in Cambodia' : 'Rent Vehicles & Transportation'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Showing {category === 'accommodation' ? filteredAccommodations.length : filteredVehicles.length} verified listings
            </p>
          </div>

          {/* Stays vs Ride Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              onClick={() => {
                setCategory('accommodation');
                setPropertyType('ALL');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                category === 'accommodation'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bed className="w-4 h-4" />
              <span>Stays</span>
            </button>
            <button
              onClick={() => {
                setCategory('transportation');
                setPropertyType('ALL');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                category === 'transportation'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Car className="w-4 h-4" />
              <span>Transportation</span>
            </button>
          </div>
        </div>

        {/* Search & Mobile Filter Bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={category === 'accommodation' ? 'Search hotel name, villa, landmark...' : 'Search scooter, SUV, tuk tuk...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="recommended">Featured / Recommended</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* View Mode */}
            <div className="hidden sm:flex items-center bg-slate-100 rounded-xl p-0.5 border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700"
            >
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar (Desktop & Mobile Drawer) */}
        <aside
          className={`${
            mobileFilterOpen ? 'block fixed inset-0 z-50 bg-slate-900/60 p-4' : 'hidden'
          } lg:block lg:static lg:bg-transparent lg:p-0`}
        >
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-6 max-h-[85vh] overflow-y-auto lg:max-h-none lg:sticky lg:top-28">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Filter Listings</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetFilters}
                  className="text-xs text-slate-400 hover:text-blue-600 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
                {mobileFilterOpen && (
                  <button onClick={() => setMobileFilterOpen(false)} className="lg:hidden p-1 text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Province / City
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
              >
                <option value="ALL">All Destinations</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.khmerName})
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                {category === 'accommodation' ? 'Property Type' : 'Vehicle Type'}
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
              >
                <option value="ALL">All Types</option>
                {category === 'accommodation' ? (
                  <>
                    <option value="HOTEL">Hotel</option>
                    <option value="RESORT">Resort</option>
                    <option value="VILLA">Private Villa</option>
                    <option value="HOMESTAY">Homestay / Bungalow</option>
                    <option value="APARTMENT">Serviced Apartment</option>
                  </>
                ) : (
                  <>
                    <option value="SCOOTER">Scooter / Motorbike</option>
                    <option value="CAR">Sedan / Compact Car</option>
                    <option value="SUV">SUV / 4WD</option>
                    <option value="TUK_TUK">Khmer Tuk Tuk</option>
                    <option value="VAN">Passenger Van</option>
                    <option value="BOAT">Boat / Ferry</option>
                  </>
                )}
              </select>
            </div>

            {/* Max Price Range */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Maximum Price</span>
                <span className="text-blue-600 font-extrabold">${maxPrice}</span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>$10</span>
                <span>$250</span>
                <span>$500+</span>
              </div>
            </div>

            {/* Min Star Rating (Accommodations) */}
            {category === 'accommodation' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Guest Rating
                </label>
                <div className="space-y-1.5">
                  {[
                    { label: 'Any Rating', val: 0 },
                    { label: '4.5 & Above (Superb)', val: 4.5 },
                    { label: '4.0 & Above (Very Good)', val: 4.0 },
                    { label: '3.5 & Above (Good)', val: 3.5 },
                  ].map((item) => (
                    <label
                      key={item.val}
                      className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer hover:text-slate-900"
                    >
                      <input
                        type="radio"
                        name="ratingFilter"
                        checked={minRating === item.val}
                        onChange={() => setMinRating(item.val)}
                        className="text-blue-600"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {mobileFilterOpen && (
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Apply Filters
              </button>
            )}
          </div>
        </aside>

        {/* Results Listings Grid */}
        <div className="lg:col-span-3">
          {category === 'accommodation' ? (
            filteredAccommodations.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5' : 'space-y-4'}>
                {filteredAccommodations.map((biz) => {
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
            ) : (
              <EmptyState
                icon={Bed}
                title="No Stays Match Your Filters"
                description="Try broadening your price range, selecting all property types, or picking a different destination."
                actionText="Reset All Filters"
                onAction={resetFilters}
              />
            )
          ) : filteredVehicles.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5' : 'space-y-4'}>
              {filteredVehicles.map((vehicle) => {
                const biz = businesses.find((b) => b.id === vehicle.businessId);
                return (
                  <TransportationCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    business={biz}
                    onBookNow={(v) => setBookingVehicle(v)}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={Car}
              title="No Vehicles Match Your Search"
              description="No rental transport matches your current filters. Try changing your vehicle category or price range."
              actionText="Reset All Filters"
              onAction={resetFilters}
            />
          )}
        </div>
      </div>

      {/* Booking Modal for Transportation */}
      {bookingVehicle && selectedVehicleBusiness && (
        <BookingModal
          isOpen={!!bookingVehicle}
          onClose={() => setBookingVehicle(null)}
          business={selectedVehicleBusiness}
          vehicle={bookingVehicle}
        />
      )}
    </div>
  );
};

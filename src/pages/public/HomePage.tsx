import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bed,
  Car,
  ShieldCheck,
  Zap,
  MapPin,
  Sparkles,
  ArrowRight,
  Star,
  Users,
  Award,
  CheckCircle,
  Clock,
  Compass,
} from 'lucide-react';
import { SearchHero } from '../../components/marketplace/SearchHero';
import { AccommodationCard } from '../../components/marketplace/AccommodationCard';
import { TransportationCard } from '../../components/marketplace/TransportationCard';
import { BookingModal } from '../../components/marketplace/BookingModal';
import { useApp } from '../../context/AppContext';
import { LOCATIONS } from '../../data/locations';
import { Vehicle } from '../../types';

export const HomePage: React.FC = () => {
  const { businesses, rooms, vehicles, reviews, t } = useApp();
  const navigate = useNavigate();

  const [bookingVehicle, setBookingVehicle] = useState<Vehicle | null>(null);

  // Filter accommodations
  const accommodationBusinesses = businesses.filter((b) => b.category === 'ACCOMMODATION');
  const transportationBusinesses = businesses.filter((b) => b.category === 'TRANSPORTATION');

  // Featured lists
  const featuredAccommodations = accommodationBusinesses.slice(0, 4);
  const featuredVehicles = vehicles.slice(0, 4);

  const selectedVehicleBusiness = bookingVehicle
    ? businesses.find((b) => b.id === bookingVehicle.businessId) || businesses[1]
    : null;

  return (
    <div className="min-w-0 pb-16">
      {/* Search Hero */}
      <SearchHero />

      {/* Destination Quick Chips */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Explore Popular Destinations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Discover top-rated stays and transport across the Kingdom of Wonder
            </p>
          </div>
          <Link
            to="/destinations"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            <span>View All 6 Provinces</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {LOCATIONS.map((loc) => (
            <button
              key={loc.id}
              onClick={() => navigate(`/search?location=${loc.id}`)}
              className="group relative rounded-2xl overflow-hidden aspect-4/5 text-left border border-slate-200/80 shadow-xs hover:shadow-lg transition cursor-pointer"
            >
              <img
                src={loc.image}
                alt={loc.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent p-3 sm:p-4 flex flex-col justify-end text-white">
                <span className="text-[10px] text-slate-300 font-medium">{loc.khmerName}</span>
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-300 transition">
                  {loc.name}
                </h3>
                <span className="text-[11px] text-blue-200 font-semibold mt-0.5">
                  {loc.popularStaysCount} places
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Accommodations */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Bed className="w-3.5 h-3.5" /> Boutique & Luxury Stays
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Featured Accommodations
            </h2>
          </div>
          <Link
            to="/search?category=accommodation"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            <span>Browse All Stays</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {featuredAccommodations.map((business) => {
            const lowestRoom = rooms
              .filter((r) => r.businessId === business.id)
              .sort((a, b) => a.basePrice - b.basePrice)[0];
            return (
              <AccommodationCard
                key={business.id}
                business={business}
                lowestPriceRoom={lowestRoom}
              />
            );
          })}
        </div>
      </section>

      {/* Value Guarantee / Trust Banner */}
      <section className="mb-14 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-10 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-3 border border-blue-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Verified Local Cambodian Businesses
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              Why Book Directly on TravelGo?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              We empower local Cambodian hoteliers and rental operators with zero middleman markups, guaranteed KHQR payments, and 24/7 bilingual concierge.
            </p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Instant ABA & Bakong</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Seamless local KHQR scan, international cards, or cash on arrival with instantaneous booking confirmation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">100% Price Lock</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Permanent pricing snapshots guarantee that confirmed reservations never fluctuate or incur hidden surprise fees.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Direct Host Messaging</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Direct in-app communication with your property host or driver for custom itinerary planning and luggage assistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Transportation */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
              <Car className="w-3.5 h-3.5" /> Mobility & Tours
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Top Vehicles & Rental Fleets
            </h2>
          </div>
          <Link
            to="/search?category=transportation"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
          >
            <span>Browse All Vehicles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {featuredVehicles.map((vehicle) => {
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
      </section>

      {/* Traveler Reviews Section */}
      <section className="mb-12">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Real Reviews From Real Travelers
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Trusted by Visitors Worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-200 text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <h4 className="text-sm font-bold text-slate-900">{rev.title}</h4>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  "{rev.content}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                    {rev.customerName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 leading-none">{rev.customerName}</p>
                    <span className="text-[10px] text-slate-400">Verified Booking</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Host Onboarding Teaser */}
      <section className="rounded-3xl bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold uppercase text-amber-400">Own a Hotel or Rental Fleet?</span>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Grow Your Bookings with KampujaGo Partner Portal
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg">
            List your rooms or vehicles in minutes. Manage bookings, set seasonal rates, and receive automated weekly payouts.
          </p>
        </div>
        <Link
          to="/owner/businesses/create"
          className="shrink-0 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-lg transition"
        >
          Register Your Business Now
        </Link>
      </section>

      {/* Quick Booking Modal for Home Transportation */}
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

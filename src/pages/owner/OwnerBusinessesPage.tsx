import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, PlusCircle, MapPin, Star, Edit, Eye, Trash2, Navigation, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import { RatingStars } from '../../components/common/RatingStars';
import { EmptyState } from '../../components/common/EmptyState';

export const OwnerBusinessesPage: React.FC = () => {
  const { currentUser, businesses, deleteBusiness, addToast } = useApp();

  const myBusinesses = businesses.filter((b) => b.ownerId === currentUser.id);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteBusiness(id);
      addToast('Business Deleted', `${name} was deleted.`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            My Business Listings ({myBusinesses.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Accommodations and transportation rental entities registered under your host account.
          </p>
        </div>

        <Link
          to="/owner/businesses/create"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New Business</span>
        </Link>
      </div>

      {myBusinesses.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No Businesses Registered"
          description="List your hotel, boutique villa, or vehicle fleet to start accepting direct guest reservations."
          actionText="Register Business Listing"
          onAction={() => (window.location.href = '/owner/businesses/create')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myBusinesses.map((biz) => (
            <div
              key={biz.id}
              className="rounded-3xl bg-white border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/9 bg-slate-100 overflow-hidden">
                  <img src={biz.coverImage || biz.images[0]} alt={biz.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <Badge variant={biz.status === 'APPROVED' ? 'success' : 'warning'}>
                      {biz.status}
                    </Badge>
                    <Badge variant="primary">{biz.category}</Badge>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {biz.city}, {biz.province}
                    </span>
                    <RatingStars rating={biz.rating} reviewCount={biz.reviewCount} />
                  </div>

                  {(biz.locationUrl || biz.mapUrl) && (
                    <div className="mb-2">
                      <a
                        href={(biz.locationUrl || biz.mapUrl)!.startsWith('http') ? (biz.locationUrl || biz.mapUrl)! : `https://${biz.locationUrl || biz.mapUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 bg-blue-50/70 px-2 py-0.5 rounded-md hover:bg-blue-100 transition"
                      >
                        <Navigation className="w-2.5 h-2.5" />
                        <span className="truncate max-w-[200px]">Map Location Linked</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  )}

                  <h3 className="text-base font-bold text-slate-900">{biz.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{biz.description}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span>Contact: {biz.phone}</span>
                    <span className="font-semibold text-emerald-700">Bank: {biz.bankAccount?.bankName}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                <Link
                  to={biz.category === 'ACCOMMODATION' ? `/accommodation/${biz.id}` : `/search?category=transportation`}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1"
                  title="View Public Listing"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </Link>

                <button
                  onClick={() => handleDelete(biz.id, biz.name)}
                  className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Star, MessageSquare, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RatingStars } from '../../components/common/RatingStars';
import { EmptyState } from '../../components/common/EmptyState';

export const CustomerReviewsPage: React.FC = () => {
  const { currentUser, reviews, businesses } = useApp();

  const myReviews = reviews.filter((r) => r.customerId === currentUser.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          My Reviews & Ratings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Reviews you have written for Cambodian accommodations and vehicle operators.
        </p>
      </div>

      {myReviews.length === 0 ? (
        <EmptyState
          icon={Star}
          title="No Reviews Written Yet"
          description="Once you complete a stay or vehicle rental, you can leave verified feedback to help other travelers."
        />
      ) : (
        <div className="space-y-4">
          {myReviews.map((rev) => {
            const biz = businesses.find((b) => b.id === rev.businessId);
            return (
              <div
                key={rev.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{biz?.name || 'Local Business'}</h3>
                    <span className="text-[10px] text-slate-400">
                      Reviewed on {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <RatingStars rating={rev.rating} />
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800">{rev.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rev.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

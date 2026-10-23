import React from 'react';
import { Star, ShieldAlert, Trash2, CheckCircle2, MessageSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RatingStars } from '../../components/common/RatingStars';
import { Badge } from '../../components/common/Badge';

export const AdminReviewsPage: React.FC = () => {
  const { reviews, businesses, deleteReview, addToast } = useApp();

  const handleDelete = (id: string) => {
    if (confirm('Delete this review as spam/policy violation?')) {
      deleteReview(id);
      addToast('Review Removed', 'Review was purged by administrator.', 'info');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Review Moderation Queue ({reviews.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Ensure traveler feedback adheres to authenticity guidelines and community safety standards.
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => {
          const biz = businesses.find((b) => b.id === rev.businessId);
          return (
            <div
              key={rev.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{rev.customerName}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500">Review for {biz?.name}</span>
                  <Badge variant="success">Verified Guest</Badge>
                </div>

                <div className="flex items-center gap-2">
                  <RatingStars rating={rev.rating} />
                  <span className="text-xs font-bold text-slate-800">{rev.title}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{rev.content}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleDelete(rev.id)}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Review</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

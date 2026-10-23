import React, { useState } from 'react';
import { Star, MessageSquare, Reply, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RatingStars } from '../../components/common/RatingStars';
import { Modal } from '../../components/common/Modal';

export const OwnerReviewsPage: React.FC = () => {
  const { currentUser, businesses, reviews, replyToReview, addToast } = useApp();

  const myBusinesses = businesses.filter((b) => b.ownerId === currentUser.id);
  const myBusinessIds = myBusinesses.map((b) => b.id);
  const myReviews = reviews.filter((r) => myBusinessIds.includes(r.businessId));

  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleOpenReply = (reviewId: string) => {
    setSelectedReviewId(reviewId);
    setReplyText('');
    setReplyModalOpen(true);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReviewId || !replyText.trim()) return;

    replyToReview(selectedReviewId, replyText.trim());
    setReplyModalOpen(false);
    addToast('Response Published', 'Your host reply is now visible publicly to travelers.', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Guest Reviews & Feedback ({myReviews.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Respond to verified traveler reviews to boost your property's reputation and search ranking.
        </p>
      </div>

      <div className="space-y-4">
        {myReviews.map((rev) => {
          const biz = businesses.find((b) => b.id === rev.businessId);
          return (
            <div
              key={rev.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.customerAvatar}
                    alt={rev.customerName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{rev.customerName}</h3>
                    <p className="text-[11px] text-slate-500">
                      Stayed at {biz?.name} • {new Date(rev.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <RatingStars rating={rev.rating} />
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800">{rev.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rev.content}</p>
              </div>

              {/* Host Response */}
              {rev.response ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                  <span className="font-bold text-slate-900 block">Your Official Host Response:</span>
                  <p className="text-slate-600 leading-relaxed">{rev.response.content}</p>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Replied on {new Date(rev.response.respondedAt).toLocaleDateString()}
                  </span>
                </div>
              ) : (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleOpenReply(rev.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition cursor-pointer"
                  >
                    <Reply className="w-3.5 h-3.5" />
                    <span>Reply to Guest</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reply Modal */}
      <Modal
        isOpen={replyModalOpen}
        onClose={() => setReplyModalOpen(false)}
        title="Reply to Guest Review"
        subtitle="Your public response will be displayed on the property listing"
      >
        <form onSubmit={handleSendReply} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Your Host Response</label>
            <textarea
              rows={4}
              required
              placeholder="Thank the guest, acknowledge their remarks, or highlight improvements..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setReplyModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
            >
              Post Public Response
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

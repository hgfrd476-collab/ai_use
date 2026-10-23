import React, { useState } from 'react';
import { LifeBuoy, PlusCircle, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const CustomerSupportPage: React.FC = () => {
  const { currentUser, tickets, createTicket, addToast } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'BOOKING' | 'PAYMENT' | 'REFUND' | 'ACCOUNT' | 'OTHER'>('BOOKING');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM');
  const [message, setMessage] = useState('');

  const myTickets = tickets.filter((t) => t.userId === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTicket({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: 'CUSTOMER',
      subject,
      category,
      priority,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          message,
          createdAt: new Date().toISOString(),
        },
      ],
    });
    setModalOpen(false);
    setSubject('');
    setMessage('');
    addToast('Ticket Created', 'Support ticket opened. Our team will respond shortly.', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Customer Support Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Open dispute or inquiry tickets for booking issues, refund requests, or payment assistance.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Support Ticket</span>
        </button>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {myTickets.length === 0 ? (
          <p className="p-8 text-center text-xs text-slate-400">No support tickets found.</p>
        ) : (
          myTickets.map((t) => (
            <div key={t.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={t.status === 'RESOLVED' ? 'success' : 'warning'}>{t.status}</Badge>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{t.category}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{t.subject}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-1">{t.messages[0]?.message}</p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Opened {new Date(t.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-500">
                  {t.messages.length} message{t.messages.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Ticket Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Open Support Ticket"
        subtitle="Our bilingual concierge team typically answers within 30 minutes"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Ticket Subject</label>
            <input
              type="text"
              required
              placeholder="e.g. Flight delay check-in arrival / Refund request"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
              >
                <option value="BOOKING">Booking Issue</option>
                <option value="PAYMENT">Payment / KHQR</option>
                <option value="REFUND">Refund Inquiry</option>
                <option value="ACCOUNT">Account Support</option>
                <option value="OTHER">Other Assistance</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent (Travel in &lt;24h)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Description of Issue</label>
            <textarea
              rows={4}
              required
              placeholder="Provide details, booking references, or questions..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-800"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

import React, { useState } from 'react';
import { LifeBuoy, CheckCircle2, Clock, Send, MessageSquare, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const AdminDisputesPage: React.FC = () => {
  const { tickets, updateTicketStatus, replyToTicket, addToast } = useApp();

  const [activeTicketId, setActiveTicketId] = useState<string | null>(tickets[0]?.id || null);
  const [replyInput, setReplyInput] = useState('');

  const activeTicket = tickets.find((t) => t.id === activeTicketId);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyInput.trim()) return;

    replyToTicket(activeTicket.id, 'Dara Kim (Platform Support)', replyInput.trim());
    setReplyInput('');
    addToast('Reply Sent', 'Platform response added to ticket thread.', 'success');
  };

  const handleResolve = (status: 'RESOLVED' | 'CLOSED' | 'IN_PROGRESS') => {
    if (!activeTicket) return;
    updateTicketStatus(activeTicket.id, status);
    addToast('Ticket Updated', `Ticket marked as ${status}`, 'info');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Customer & Partner Dispute Resolution Desk ({tickets.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Mediate booking discrepancies, cancellation disagreements, and payment inquiries.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[600px]">
        {/* Left Tickets List */}
        <div className="md:col-span-1 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-100 bg-white font-bold text-xs text-slate-700">
            Open Dispute Tickets
          </div>
          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {tickets.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTicketId(t.id)}
                className={`w-full p-4 text-left transition cursor-pointer ${
                  activeTicketId === t.id ? 'bg-purple-50/80 border-l-4 border-purple-600' : 'hover:bg-slate-100/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                    {t.category}
                  </span>
                  <Badge variant={t.status === 'RESOLVED' ? 'success' : 'warning'}>
                    {t.status}
                  </Badge>
                </div>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{t.subject}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{t.userName} ({t.userRole})</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right Active Ticket Details & Chat */}
        <div className="md:col-span-2 flex flex-col h-full bg-white">
          {activeTicket ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{activeTicket.subject}</h3>
                  <span className="text-[10px] text-slate-500">
                    Submitted by <strong>{activeTicket.userName}</strong> • Priority: {activeTicket.priority}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {activeTicket.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleResolve('RESOLVED')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
                    >
                      Resolve Ticket
                    </button>
                  )}
                </div>
              </div>

              {/* Message Thread */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40">
                {activeTicket.messages.map((m) => {
                  const sender = m.senderName || m.sender || 'User';
                  const isAdmin = sender.includes('Platform Support') || m.isStaff;
                  const timeString = m.createdAt || m.timestamp || new Date().toISOString();
                  return (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                        isAdmin
                          ? 'bg-purple-50 border border-purple-200 text-purple-900'
                          : 'bg-white border border-slate-200/80 text-slate-800'
                      }`}
                    >
                      <div className="flex justify-between font-bold text-[11px]">
                        <span>{sender}</span>
                        <span className="text-slate-400 font-normal">
                          {new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="leading-relaxed">{m.message}</p>
                    </div>
                  );
                })}
              </div>

              {/* Reply box */}
              <form onSubmit={handleSendReply} className="p-3 border-t border-slate-100 flex items-center gap-2 bg-white">
                <input
                  type="text"
                  placeholder="Type support response or resolution note..."
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xs transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-xs">
              Select a support ticket to inspect
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

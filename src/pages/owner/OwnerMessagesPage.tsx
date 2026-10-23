import React, { useState } from 'react';
import { Send, User, CheckCheck, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OwnerMessagesPage: React.FC = () => {
  const { currentUser, messages, sendMessage } = useApp();

  const [activeCustomerId, setActiveCustomerId] = useState('user-customer-1');
  const [inputText, setInputText] = useState('');

  const customers = [
    {
      id: 'user-customer-1',
      name: 'Sophea Chan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      bookingRef: 'KG-2026-8819',
      stayDate: 'Mar 24 - Mar 27',
      status: 'Active Guest',
    },
    {
      id: 'user-customer-2',
      name: 'Michael Davis',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
      bookingRef: 'KG-2026-9022',
      stayDate: 'Apr 02 - Apr 05',
      status: 'Upcoming Guest',
    },
  ];

  const activeCustomer = customers.find((c) => c.id === activeCustomerId) || customers[0];

  const threadMessages = messages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.receiverId === activeCustomerId) ||
      (m.senderId === activeCustomerId && m.receiverId === currentUser.id)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage({
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: 'BUSINESS_OWNER',
      receiverId: activeCustomer.id,
      receiverName: activeCustomer.name,
      message: inputText.trim(),
    });

    setInputText('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Guest Messages & Inquiries
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Coordinate check-in arrival times, temple tours, and special requests directly with your guests.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[600px]">
        {/* Left Guest List */}
        <div className="md:col-span-1 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-100 bg-white font-bold text-xs text-slate-700">
            Guest Inquiries
          </div>
          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {customers.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCustomerId(c.id)}
                className={`w-full p-4 text-left flex items-center gap-3 transition cursor-pointer ${
                  activeCustomerId === c.id ? 'bg-emerald-50/70 border-l-4 border-emerald-600' : 'hover:bg-slate-100/50'
                }`}
              >
                <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{c.name}</h4>
                  <p className="text-[10px] font-mono text-slate-500">{c.bookingRef}</p>
                  <span className="text-[10px] text-emerald-700 font-semibold">{c.stayDate}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Message Chat */}
        <div className="md:col-span-2 flex flex-col h-full bg-white">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={activeCustomer.avatar} alt={activeCustomer.name} className="w-9 h-9 rounded-xl object-cover" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">{activeCustomer.name}</h4>
                <p className="text-[10px] text-slate-500">
                  Ref: {activeCustomer.bookingRef} ({activeCustomer.stayDate})
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40">
            {threadMessages.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-12">
                No previous messages. Reach out to welcome {activeCustomer.name}!
              </p>
            ) : (
              threadMessages.map((m) => {
                const isMe = m.senderId === currentUser.id;
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[78%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                        isMe
                          ? 'bg-emerald-700 text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                      }`}
                    >
                      <p>{m.message || m.text}</p>
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5 px-1 flex items-center gap-1">
                      {new Date(m.createdAt || m.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {isMe && <CheckCheck className="w-3 h-3 text-emerald-500" />}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-slate-100 flex items-center gap-2 bg-white">
            <input
              type="text"
              placeholder={`Send instructions or reply to ${activeCustomer.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <button
              type="submit"
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

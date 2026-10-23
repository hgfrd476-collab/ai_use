import React, { useState } from 'react';
import { Send, User, Building2, CheckCheck, Clock, Paperclip } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CustomerMessagesPage: React.FC = () => {
  const { currentUser, messages, sendMessage, businesses } = useApp();

  const [activePartnerId, setActivePartnerId] = useState('user-owner-1');
  const [inputText, setInputText] = useState('');

  // Conversation partners
  const partners = [
    {
      id: 'user-owner-1',
      name: 'Vannak Sok (Angkor Boutique & Rentals)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      role: 'Host / Operator',
      status: 'Online',
    },
    {
      id: 'user-admin-1',
      name: 'KampujaGo Support Concierge',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      role: 'Platform Support',
      status: 'Active 24/7',
    },
  ];

  const activePartner = partners.find((p) => p.id === activePartnerId) || partners[0];

  const threadMessages = messages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.receiverId === activePartnerId) ||
      (m.senderId === activePartnerId && m.receiverId === currentUser.id)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage({
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: 'CUSTOMER',
      receiverId: activePartner.id,
      receiverName: activePartner.name,
      message: inputText.trim(),
    });

    setInputText('');

    // Simulate instant auto-acknowledgement after 1 second if replying for the first time
    setTimeout(() => {
      sendMessage({
        senderId: activePartner.id,
        senderName: activePartner.name,
        senderRole: 'BUSINESS_OWNER',
        receiverId: currentUser.id,
        receiverName: currentUser.name,
        message: 'Hello Sophea! We received your message and will arrange everything for your arrival. Feel free to ask any other questions.',
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Direct Messages
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Chat directly with property hosts, drivers, and platform support.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[600px]">
        {/* Left: Chat Partners List */}
        <div className="md:col-span-1 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-100 bg-white font-bold text-xs text-slate-700">
            Conversations
          </div>
          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {partners.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePartnerId(p.id)}
                className={`w-full p-4 text-left flex items-center gap-3 transition cursor-pointer ${
                  activePartnerId === p.id ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-100/50'
                }`}
              >
                <div className="relative">
                  <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{p.name}</h4>
                  <p className="text-[11px] text-slate-500 truncate">{p.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Message Thread */}
        <div className="md:col-span-2 flex flex-col h-full bg-white">
          {/* Active Partner Top Bar */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={activePartner.avatar} alt={activePartner.name} className="w-9 h-9 rounded-xl object-cover" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">{activePartner.name}</h4>
                <span className="text-[10px] text-emerald-600 font-semibold">{activePartner.status}</span>
              </div>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40">
            {threadMessages.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-12">
                No messages yet. Start a conversation with {activePartner.name}!
              </p>
            ) : (
              threadMessages.map((m) => {
                const isMe = m.senderId === currentUser.id;
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[78%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                        isMe
                          ? 'bg-blue-600 text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                      }`}
                    >
                      <p>{m.message || m.text}</p>
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5 px-1 flex items-center gap-1">
                      {new Date(m.createdAt || m.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {isMe && <CheckCheck className="w-3 h-3 text-blue-500" />}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Send Box */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-100 flex items-center gap-2 bg-white">
            <input
              type="text"
              placeholder={`Message ${activePartner.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

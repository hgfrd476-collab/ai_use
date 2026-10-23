import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ContactPage: React.FC = () => {
  const { addToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast('Missing Details', 'Please complete all required fields.', 'warning');
      return;
    }
    setSubmitted(true);
    addToast(
      'Message Received',
      'Thank you for reaching out! A TravelGo concierge will reply within 2 hours.',
      'success'
    );
  };

  return (
    <div className="pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3 border border-blue-100">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>TravelGo Concierge & Support</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Get in Touch With Us
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Have a question about a stay booking, vehicle rental, or listing your business on TravelGo? Our local team is here 24/7 to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Details Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900">Direct Contact</h3>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Phone Hotline</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">+855 23 999 000</p>
                <p className="text-[11px] text-slate-500">Available 24/7 in English & Khmer</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Email Support</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">support@travelgo.com</p>
                <p className="text-[11px] text-slate-500">Average response: &lt; 30 mins</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400">Operating Hours</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">Monday – Sunday</p>
                <p className="text-[11px] text-slate-500">24/7 Digital Concierge</p>
              </div>
            </div>
          </div>

          {/* Offices */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-6 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>Cambodia Hub Locations</span>
            </h4>
            <div className="text-xs space-y-3 text-slate-300">
              <div>
                <p className="font-bold text-white">Phnom Penh HQ</p>
                <p className="text-slate-400">Preah Monivong Blvd, Sangkat Boeung Keng Kang 1</p>
              </div>
              <div>
                <p className="font-bold text-white">Siem Reap Operations Desk</p>
                <p className="text-slate-400">Wat Bo Road, Sala Kamreuk, Siem Reap</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Message Delivered!</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Thank you, <strong>{formData.name}</strong>. Our customer support team has received your ticket and will follow up at <strong>{formData.email}</strong> shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
                  }}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Send a Message</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sok Dara"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. sok.dara@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Phone / Telegram Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. +855 12 345 678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Topic</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Booking Assistance">Accommodation Booking Help</option>
                      <option value="Vehicle Rental Inquiry">Vehicle Rental Questions</option>
                      <option value="Host Partnership">List My Hotel / Vehicles</option>
                      <option value="Payment & Refunds">Payment & Refund Inquiries</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">How can we help you? *</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Provide details about your inquiry or reservation reference..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to TravelGo</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

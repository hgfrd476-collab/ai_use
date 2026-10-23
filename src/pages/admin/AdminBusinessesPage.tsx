import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Search,
  Eye,
  MapPin,
  Star,
  FileCheck,
  ExternalLink,
  Globe,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Business, BusinessStatus } from '../../types';

export const AdminBusinessesPage: React.FC = () => {
  const { businesses, updateBusinessStatus, addToast } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectBusiness, setInspectBusiness] = useState<Business | null>(null);

  const filtered = businesses.filter((b) => {
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.name.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSetStatus = (id: string, newStatus: BusinessStatus, name: string) => {
    updateBusinessStatus(id, newStatus);
    addToast('Status Updated', `${name} status set to ${newStatus}`, 'info');
    if (inspectBusiness && inspectBusiness.id === id) {
      setInspectBusiness({ ...inspectBusiness, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Partner Business Verification ({businesses.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Audit Cambodian commercial licenses, approve listings, or suspend fraudulent operators.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search business or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs overflow-x-auto">
        {['ALL', 'APPROVED', 'PENDING', 'REJECTED', 'SUSPENDED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              statusFilter === st
                ? 'bg-white text-purple-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {st === 'ALL' ? 'All Partners' : st}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="p-4">Business & City</th>
                <th className="p-4">Category</th>
                <th className="p-4">Registration & TIN</th>
                <th className="p-4">Bank Payout</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={b.coverImage} alt={b.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-bold text-slate-900">{b.name}</h4>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {b.city}, {b.province}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                      {b.category}
                    </span>
                  </td>

                  <td className="p-4 font-mono text-[11px]">
                    <span className="text-slate-800 block">
                      {b.verificationDocs?.registrationNumber || 'Not submitted'}
                    </span>
                    <span className="text-slate-400 text-[10px]">TIN: {b.verificationDocs?.taxNumber || 'N/A'}</span>
                  </td>

                  <td className="p-4">
                    <span className="font-semibold text-slate-800 block">{b.bankAccount?.bankName}</span>
                    <span className="font-mono text-[10px] text-slate-400">{b.bankAccount?.accountNumber}</span>
                  </td>

                  <td className="p-4">
                    <Badge
                      variant={
                        b.status === 'APPROVED'
                          ? 'success'
                          : b.status === 'PENDING'
                          ? 'warning'
                          : 'danger'
                      }
                    >
                      {b.status}
                    </Badge>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setInspectBusiness(b)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                        title="Audit Documents"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {b.status !== 'APPROVED' && (
                        <button
                          onClick={() => handleSetStatus(b.id, 'APPROVED', b.name)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                      )}

                      {b.status === 'APPROVED' && (
                        <button
                          onClick={() => handleSetStatus(b.id, 'SUSPENDED', b.name)}
                          className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-[10px]"
                        >
                          Suspend
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Business Modal */}
      {inspectBusiness && (
        <Modal
          isOpen={!!inspectBusiness}
          onClose={() => setInspectBusiness(null)}
          title={`Verification Audit: ${inspectBusiness.name}`}
          subtitle="Ministry of Commerce and tax filing data inspection"
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-150">
              <div>
                <span className="text-slate-400 block font-bold uppercase text-[10px]">
                  Commerce Registration No.
                </span>
                <p className="font-mono font-bold text-slate-900 mt-0.5 text-sm">
                  {inspectBusiness.verificationDocs?.registrationNumber || 'None'}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block font-bold uppercase text-[10px]">
                  Tax Identification Number (TIN)
                </span>
                <p className="font-mono font-bold text-slate-900 mt-0.5 text-sm">
                  {inspectBusiness.verificationDocs?.taxNumber || 'None'}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block font-bold uppercase text-[10px]">
                  Owner / Operator Phone
                </span>
                <p className="font-bold text-slate-800 mt-0.5">{inspectBusiness.phone}</p>
              </div>

              <div>
                <span className="text-slate-400 block font-bold uppercase text-[10px]">
                  Payout Bank Account
                </span>
                <p className="font-bold text-slate-800 mt-0.5">
                  {inspectBusiness.bankAccount?.bankName} — {inspectBusiness.bankAccount?.accountNumber}
                </p>
              </div>

              <div className="col-span-2 pt-2 border-t border-slate-200/80">
                <span className="text-slate-400 block font-bold uppercase text-[10px]">
                  Street Address & Location Map Link
                </span>
                <p className="font-bold text-slate-800 mt-0.5">
                  {inspectBusiness.address}, {inspectBusiness.city}, {inspectBusiness.province}
                </p>
                {(inspectBusiness.locationUrl || inspectBusiness.mapUrl) ? (
                  <a
                    href={(inspectBusiness.locationUrl || inspectBusiness.mapUrl)!.startsWith('http') ? (inspectBusiness.locationUrl || inspectBusiness.mapUrl)! : `https://${inspectBusiness.locationUrl || inspectBusiness.mapUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-bold mt-1 bg-blue-50 px-2.5 py-1 rounded-lg transition"
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span className="truncate max-w-sm">{inspectBusiness.locationUrl || inspectBusiness.mapUrl}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400 italic block mt-0.5">
                    No custom map URL provided
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => handleSetStatus(inspectBusiness.id, 'REJECTED', inspectBusiness.name)}
                className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 font-bold hover:bg-rose-50"
              >
                Reject Listing
              </button>
              <button
                onClick={() => {
                  handleSetStatus(inspectBusiness.id, 'APPROVED', inspectBusiness.name);
                  setInspectBusiness(null);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
              >
                Approve & Publish Listing
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

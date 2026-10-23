import React from 'react';
import { ShieldCheck, Clock, FileText, CheckCircle2 } from 'lucide-react';

export const AdminAuditPage: React.FC = () => {
  const auditLogs = [
    {
      id: 'LOG-9921',
      timestamp: '2026-03-20 09:42 AM',
      actor: 'Dara Kim (SUPER_ADMIN)',
      action: 'BUSINESS_APPROVED',
      details: 'Approved Angkor Heritage Boutique & Spa (MOC-REP-2024-8849)',
      ip: '119.15.168.42 (Phnom Penh)',
      status: 'SUCCESS',
    },
    {
      id: 'LOG-9920',
      timestamp: '2026-03-20 08:15 AM',
      actor: 'System Automation',
      action: 'WEBHOOK_ABA_KHQR_PAID',
      details: 'Payment verified $136.80 for reservation KG-2026-8819',
      ip: '10.0.4.12 (ABA Bank Gateway)',
      status: 'SUCCESS',
    },
    {
      id: 'LOG-9919',
      timestamp: '2026-03-19 04:30 PM',
      actor: 'Vannak Sok (BUSINESS_OWNER)',
      action: 'ROOM_PRICE_UPDATE',
      details: 'Updated Deluxe Garden Villa rate from $45 to $55',
      ip: '203.189.144.11 (Siem Reap)',
      status: 'SUCCESS',
    },
    {
      id: 'LOG-9918',
      timestamp: '2026-03-19 02:10 PM',
      actor: 'Dara Kim (SUPER_ADMIN)',
      action: 'DISPUTE_RESOLVED',
      details: 'Resolved ticket TKT-101 with customer refund authorization',
      ip: '119.15.168.42 (Phnom Penh)',
      status: 'SUCCESS',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          System & Security Audit Log
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Immutable event trails for administrative actions, banking webhooks, and regulatory compliance.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="p-4">Timestamp / Log ID</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Event Type</th>
                <th className="p-4">Event Details</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4">
                    <span className="font-mono font-bold text-slate-900 block">{log.id}</span>
                    <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                  </td>

                  <td className="p-4 font-semibold text-slate-800">
                    {log.actor}
                    <span className="text-[10px] font-mono text-slate-400 block">{log.ip}</span>
                  </td>

                  <td className="p-4">
                    <span className="font-mono text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                  </td>

                  <td className="p-4 text-slate-600 max-w-sm">{log.details}</td>

                  <td className="p-4 text-right">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

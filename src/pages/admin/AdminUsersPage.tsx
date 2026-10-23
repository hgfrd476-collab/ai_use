import React, { useState } from 'react';
import { Users, Search, Shield, UserCheck, Store, Lock, Unlock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../../components/common/Badge';
import { UserRole } from '../../types';

export const AdminUsersPage: React.FC = () => {
  const { addToast } = useApp();

  const [usersList, setUsersList] = useState([
    {
      id: 'user-customer-1',
      name: 'Sophea Chan',
      email: 'sophea.chan@gmail.com',
      role: 'CUSTOMER' as UserRole,
      phone: '+855 12 345 678',
      status: 'ACTIVE',
      bookingsCount: 3,
      joinedDate: '2025-11-12',
    },
    {
      id: 'user-owner-1',
      name: 'Vannak Sok',
      email: 'vannak.sok@angkorhospitality.kh',
      role: 'BUSINESS_OWNER' as UserRole,
      phone: '+855 92 888 999',
      status: 'ACTIVE',
      bookingsCount: 48,
      joinedDate: '2024-06-18',
    },
    {
      id: 'user-admin-1',
      name: 'Dara Kim',
      email: 'dara.kim@kampujago.kh',
      role: 'SUPER_ADMIN' as UserRole,
      phone: '+855 10 999 888',
      status: 'ACTIVE',
      bookingsCount: 0,
      joinedDate: '2024-01-01',
    },
    {
      id: 'user-customer-2',
      name: 'Michael Davis',
      email: 'michael.davis@traveler.com',
      role: 'CUSTOMER' as UserRole,
      phone: '+1 415 882 1099',
      status: 'ACTIVE',
      bookingsCount: 2,
      joinedDate: '2026-02-10',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filtered = usersList.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    }
    return true;
  });

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setUsersList(usersList.map((u) => (u.id === id ? { ...u, status: nextStatus } : u)));
    addToast('User Updated', `User status updated to ${nextStatus}`, 'info');
  };

  const handleChangeRole = (id: string, newRole: UserRole) => {
    setUsersList(usersList.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
    addToast('Role Changed', `User role changed to ${newRole}`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            User Accounts & Roles ({usersList.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Audit user permissions, assign business owner roles, or manage system access.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
      </div>

      {/* Role filter */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
        {['ALL', 'CUSTOMER', 'BUSINESS_OWNER', 'SUPER_ADMIN'].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
              roleFilter === r
                ? 'bg-white text-purple-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {r === 'ALL' ? 'All Roles' : r.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Assigned Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Bookings</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition">
                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">{u.name}</span>
                    <span className="text-[10px] text-slate-400">Joined {u.joinedDate}</span>
                  </td>

                  <td className="p-4">
                    <span className="text-slate-800 block">{u.email}</span>
                    <span className="text-[10px] text-slate-400">{u.phone}</span>
                  </td>

                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleChangeRole(u.id, e.target.value as UserRole)}
                      className="px-2 py-1 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-800"
                    >
                      <option value="CUSTOMER">Customer</option>
                      <option value="BUSINESS_OWNER">Business Owner</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                  </td>

                  <td className="p-4">
                    <Badge variant={u.status === 'ACTIVE' ? 'success' : 'danger'}>
                      {u.status}
                    </Badge>
                  </td>

                  <td className="p-4 font-bold text-slate-800">{u.bookingsCount}</td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(u.id, u.status)}
                      className={`p-1.5 rounded-lg border transition ${
                        u.status === 'ACTIVE'
                          ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                          : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                      }`}
                      title={u.status === 'ACTIVE' ? 'Suspend Account' : 'Reactivate'}
                    >
                      {u.status === 'ACTIVE' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    </button>
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

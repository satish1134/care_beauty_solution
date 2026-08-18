import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Key, Lock, CheckCircle2, UserPlus } from 'lucide-react';

interface RbacManagerProps {
  isDarkMode?: boolean;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'STORE_MANAGER' | 'FULFILLMENT_OPERATOR';
  status: 'ACTIVE' | 'SUSPENDED';
  lastActive: string;
}

export const RbacManager: React.FC<RbacManagerProps> = ({ isDarkMode = false }) => {
  const [users, setUsers] = useState<AdminUser[]>([
    {
      id: 'usr-1',
      name: 'Rajesh V.',
      email: 'rajesh@carebeautysolution.com',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      lastActive: 'Just now (Current Session)',
    },
    {
      id: 'usr-2',
      name: 'Ananya Sharma',
      email: 'ananya.s@carebeautysolution.com',
      role: 'STORE_MANAGER',
      status: 'ACTIVE',
      lastActive: '2 hours ago',
    },
    {
      id: 'usr-3',
      name: 'Vikram Patel',
      email: 'vikram.fulfillment@carebeautysolution.com',
      role: 'FULFILLMENT_OPERATOR',
      status: 'ACTIVE',
      lastActive: 'Yesterday',
    },
  ]);

  const cardBg = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const textPrimary = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = isDarkMode ? 'text-slate-300' : 'text-slate-700';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="space-y-6">
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl border ${cardBg}`}>
        <div>
          <h2 className={`text-2xl font-bold font-serif ${textPrimary}`}>Role-Based Access Control (RBAC)</h2>
          <p className={`${textSecondary} text-sm mt-1 font-medium`}>
            Manage staff credentials, permission levels, order fulfillment tokens, and administrative security rights.
          </p>
        </div>
      </div>

      <div className={`rounded-3xl border overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead
              className={`text-xs font-bold uppercase tracking-wider border-b ${
                isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <tr>
                <th className="py-4 px-6">User Name</th>
                <th className="py-4 px-4">Email Credentials</th>
                <th className="py-4 px-4">Role Rights</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6">Last Activity</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-200'}`}>
              {users.map(u => (
                <tr key={u.id} className={isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'}>
                  <td className={`py-4 px-6 font-bold text-sm ${textPrimary}`}>{u.name}</td>
                  <td className={`py-4 px-4 font-mono ${textMuted}`}>{u.email}</td>
                  <td className="py-4 px-4 font-bold">
                    <span className="px-2.5 py-1 rounded-md text-xs bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold">
                    <span className="px-2.5 py-1 rounded-md text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      {u.status}
                    </span>
                  </td>
                  <td className={`py-4 px-6 font-sans text-xs font-medium ${textMuted}`}>{u.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

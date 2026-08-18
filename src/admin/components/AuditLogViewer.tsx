import React from 'react';
import { Shield, Clock, User, Activity } from 'lucide-react';
import { AuditLog } from '../../types';

interface AuditLogViewerProps {
  auditLogs: AuditLog[];
  isDarkMode?: boolean;
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ auditLogs, isDarkMode = false }) => {
  const cardBg = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const textPrimary = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = isDarkMode ? 'text-slate-300' : 'text-slate-700';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="space-y-6">
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl border ${cardBg}`}>
        <div>
          <h2 className={`text-2xl font-bold font-serif ${textPrimary}`}>Immutable Administrative Audit Ledger</h2>
          <p className={`${textSecondary} text-sm mt-1 font-medium`}>Audit log of system actions, price edits, order fulfillment updates, and stock overrides.</p>
        </div>
      </div>

      <div className={`rounded-3xl border overflow-hidden ${cardBg}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead
              className={`text-xs font-bold uppercase tracking-wider border-b ${
                isDarkMode
                  ? 'bg-slate-800 text-slate-300 border-slate-800'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <tr>
                <th className="py-4 px-6">Timestamp</th>
                <th className="py-4 px-4">Admin Actor</th>
                <th className="py-4 px-4">Action Type</th>
                <th className="py-4 px-6">Action Details</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-200'}`}>
              {auditLogs.map(log => (
                <tr
                  key={log.id}
                  className={`transition-colors ${
                    isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
                  }`}
                >
                  <td className={`py-4 px-6 text-xs font-semibold ${textMuted}`}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-4 px-4 font-bold text-amber-700 dark:text-amber-300">
                    {log.user}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                      {log.action}
                    </span>
                  </td>
                  <td className={`py-4 px-6 font-sans text-xs font-semibold ${textSecondary}`}>
                    {log.details}
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

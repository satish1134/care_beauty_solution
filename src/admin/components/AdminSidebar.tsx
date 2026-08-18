import React from 'react';
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Tag,
  Star,
  FileText,
  Activity,
  Globe,
  Share2,
  Lock,
  ArrowLeft,
  ShieldCheck,
  Moon,
  Sun,
} from 'lucide-react';
import { AdminRole } from '../../types';

export type AdminTab =
  | 'analytics'
  | 'products'
  | 'orders'
  | 'reviews'
  | 'coupons'
  | 'seo'
  | 'marketplaces'
  | 'rbac'
  | 'audit';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  currentRole: AdminRole;
  onChangeRole: (role: AdminRole) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onExitToStore: () => void;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  currentRole,
  onChangeRole,
  isDarkMode,
  onToggleTheme,
  onExitToStore,
  onLogout,
}) => {
  const navItems: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'analytics', label: 'Dashboard & KPIs', icon: TrendingUp },
    { id: 'products', label: 'Catalog & Inventory', icon: Package },
    { id: 'orders', label: 'Orders & Fulfillment', icon: ShoppingBag },
    { id: 'reviews', label: 'Review Moderation', icon: Star },
    { id: 'coupons', label: 'Promotions & Coupons', icon: Tag },
    { id: 'seo', label: 'SEO & Meta Engine', icon: Globe },
    { id: 'marketplaces', label: 'Channel Integrations', icon: Share2 },
    { id: 'rbac', label: 'RBAC & Security Roles', icon: Lock },
    { id: 'audit', label: 'Audit & System Logs', icon: FileText },
  ];

  return (
    <aside
      className={`w-64 flex flex-col justify-between shrink-0 min-h-screen transition-colors duration-200 border-r ${
        isDarkMode
          ? 'bg-slate-900 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      <div className="p-5">
        {/* Brand Header */}
        <div
          className={`flex items-center justify-between pb-5 border-b ${
            isDarkMode ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2
                className={`font-serif font-bold text-base tracking-wide leading-tight ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                CARe Admin
              </h2>
              <p
                className={`text-[10px] uppercase font-mono tracking-widest font-bold ${
                  isDarkMode ? 'text-amber-400' : 'text-amber-700'
                }`}
              >
                Management Portal
              </p>
            </div>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl border transition ${
              isDarkMode
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
            title={isDarkMode ? 'Switch to Light High-Contrast Theme' : 'Switch to Dark Theme'}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Section */}
        <div className="mt-6 space-y-1.5">
          <p
            className={`px-3 text-[11px] font-bold uppercase tracking-widest mb-2 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Core Modules
          </p>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all duration-150 text-left ${
                  isActive
                    ? isDarkMode
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                      : 'bg-amber-500/10 text-amber-900 border border-amber-500/30 font-bold shadow-sm'
                    : isDarkMode
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800 font-medium'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-semibold'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? 'text-amber-500'
                      : isDarkMode
                      ? 'text-slate-400'
                      : 'text-slate-500'
                  }`}
                />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Role Selector Badge */}
        <div
          className={`mt-8 p-3.5 rounded-2xl border space-y-2 ${
            isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs">
            <span
              className={`font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}
            >
              Active Role
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30">
              {currentRole}
            </span>
          </div>
          <select
            value={currentRole}
            onChange={e => onChangeRole(e.target.value as AdminRole)}
            className={`w-full rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 ${
              isDarkMode
                ? 'bg-slate-900 border border-slate-700 text-slate-100'
                : 'bg-white border border-slate-300 text-slate-900'
            }`}
          >
            <option value="SUPER_ADMIN">Super Admin (Full Access)</option>
            <option value="INVENTORY_MANAGER">Inventory Manager</option>
            <option value="SUPPORT_AGENT">Customer Support Agent</option>
          </select>
        </div>
      </div>

      {/* Footer / Exit Links */}
      <div
        className={`p-4 border-t space-y-2 ${
          isDarkMode ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <button
          onClick={onExitToStore}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors border ${
            isDarkMode
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300 hover:bg-emerald-900'
              : 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
          }`}
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600" />
          <span>Exit to Customer Store</span>
        </button>
        <button
          onClick={onLogout}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
            isDarkMode
              ? 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
              : 'text-slate-600 hover:text-rose-600 hover:bg-slate-100'
          }`}
        >
          <span>Lock Admin Session</span>
        </button>
      </div>
    </aside>
  );
};


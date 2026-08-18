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
  Zap,
  ArrowLeft,
  ShieldCheck,
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
  onExitToStore: () => void;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  currentRole,
  onChangeRole,
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
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-screen">
      <div className="p-5">
        {/* Brand Header */}
        <div className="flex items-center gap-3 pb-5 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-950 flex items-center justify-center border border-emerald-500/30 shadow-lg shadow-emerald-950/50">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-white text-base tracking-wide leading-tight">
              CARe Admin
            </h2>
            <p className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-semibold">
              Management Portal
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="mt-6 space-y-1">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Core Modules
          </p>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80 shadow-md shadow-emerald-950/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Role Selector Badge */}
        <div className="mt-8 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Active Security Role</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {currentRole}
            </span>
          </div>
          <select
            value={currentRole}
            onChange={e => onChangeRole(e.target.value as AdminRole)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
          >
            <option value="SUPER_ADMIN">Super Admin (Full Access)</option>
            <option value="INVENTORY_MANAGER">Inventory Manager</option>
            <option value="SUPPORT_AGENT">Customer Support Agent</option>
          </select>
        </div>
      </div>

      {/* Footer / Exit Links */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={onExitToStore}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-900/40 hover:bg-emerald-900/80 border border-emerald-700/50 text-emerald-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
          <span>Exit to Customer Store</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors"
        >
          <span>Lock Admin Session</span>
        </button>
      </div>
    </aside>
  );
};

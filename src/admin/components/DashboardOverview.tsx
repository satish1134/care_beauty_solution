import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  DollarSign,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  Shield,
  Eye,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Product, Order, AuditLog } from '../../types';

interface DashboardOverviewProps {
  products: Product[];
  orders: Order[];
  auditLogs: AuditLog[];
  liveVisitors: number;
  pageBreakdown: Record<string, number>;
  onNavigateToTab: (tab: any) => void;
  isDarkMode?: boolean;
}

const SALES_CHART_DATA = [
  { day: 'Mon', sales: 12400, orders: 12 },
  { day: 'Tue', sales: 18900, orders: 18 },
  { day: 'Wed', sales: 24500, orders: 24 },
  { day: 'Thu', sales: 31200, orders: 29 },
  { day: 'Fri', sales: 42800, orders: 41 },
  { day: 'Sat', sales: 58900, orders: 56 },
  { day: 'Sun', sales: 64100, orders: 62 },
];

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  products,
  orders,
  auditLogs,
  liveVisitors,
  pageBreakdown,
  onNavigateToTab,
  isDarkMode = false,
}) => {
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'PAID' ? o.totalAmount : 0), 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'PENDING' || o.status === 'PROCESSING').length;
  
  // Calculate low stock items across all variants
  const lowStockVariants: { product: Product; variantName: string; stock: number }[] = [];
  products.forEach(p => {
    p.variants.forEach(v => {
      if (v.stock < 15) {
        lowStockVariants.push({ product: p, variantName: v.name, stock: v.stock });
      }
    });
  });

  const cardBg = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const textPrimary = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = isDarkMode ? 'text-slate-300' : 'text-slate-700';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-600';

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div
        className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl border ${cardBg}`}
      >
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-2xl font-bold font-serif ${textPrimary}`}>Executive Command Center</h2>
            <span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-mono px-2.5 py-0.5 rounded-full font-bold">
              LIVE SYSTEM
            </span>
          </div>
          <p className={`${textSecondary} text-sm mt-1 font-medium`}>
            Real-time analytics, inventory signals, and order processing pipeline.
          </p>
        </div>

        {/* Live Visitor Heartbeat Indicator */}
        <div
          className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div>
            <div className={`text-xs font-bold ${textMuted}`}>Live Active Shoppers</div>
            <div className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {liveVisitors} Visitors Online
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className={`p-6 rounded-3xl border space-y-3 ${cardBg}`}>
          <div className={`flex justify-between items-center ${textSecondary}`}>
            <span className="text-xs font-bold uppercase tracking-wider">Gross Revenue</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-3xl font-bold font-mono ${textPrimary}`}>
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <ArrowUpRight className="w-4 h-4" />
            <span>+18.4% vs last week</span>
          </div>
        </div>

        {/* Total Orders */}
        <div
          onClick={() => onNavigateToTab('orders')}
          className={`p-6 rounded-3xl border space-y-3 cursor-pointer transition-all hover:scale-[1.01] ${cardBg}`}
        >
          <div className={`flex justify-between items-center ${textSecondary}`}>
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-3xl font-bold font-mono ${textPrimary}`}>{orders.length} Orders</div>
          <div className="text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{pendingOrdersCount} Pending Fulfillment</span>
          </div>
        </div>

        {/* Active Catalog */}
        <div
          onClick={() => onNavigateToTab('products')}
          className={`p-6 rounded-3xl border space-y-3 cursor-pointer transition-all hover:scale-[1.01] ${cardBg}`}
        >
          <div className={`flex justify-between items-center ${textSecondary}`}>
            <span className="text-xs font-bold uppercase tracking-wider">Formulations Catalog</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-3xl font-bold font-mono ${textPrimary}`}>{products.length} Products</div>
          <div className={`${textMuted} text-xs font-semibold`}>
            {products.reduce((acc, p) => acc + p.variants.length, 0)} Active SKUs
          </div>
        </div>

        {/* Low Stock Signals */}
        <div
          onClick={() => onNavigateToTab('products')}
          className={`p-6 rounded-3xl border space-y-3 cursor-pointer transition-all hover:scale-[1.01] ${cardBg}`}
        >
          <div className={`flex justify-between items-center ${textSecondary}`}>
            <span className="text-xs font-bold uppercase tracking-wider">Inventory Signals</span>
            <div
              className={`p-2.5 rounded-xl border ${
                lowStockVariants.length > 0
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-3xl font-bold font-mono ${textPrimary}`}>
            {lowStockVariants.length} Low Stock SKUs
          </div>
          <div
            className={`text-xs font-bold ${
              lowStockVariants.length > 0
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {lowStockVariants.length > 0 ? 'Action Required' : 'All SKUs Well Stocked'}
          </div>
        </div>
      </div>

      {/* Analytics Charts & Traffic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <div className={`lg:col-span-2 p-6 rounded-3xl border space-y-4 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-base font-bold ${textPrimary}`}>Weekly Sales & Revenue Trajectory</h3>
              <p className={`text-xs ${textMuted} font-medium`}>Aggregated gross revenue across storefront & marketing campaigns</p>
            </div>
            <span className="text-xs font-mono text-amber-700 dark:text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
              ₹2,52,500 Total
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SALES_CHART_DATA}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#E2E8F0'} opacity={0.7} />
                <XAxis dataKey="day" stroke={isDarkMode ? '#CBD5E1' : '#475569'} fontSize={12} fontWeight={600} />
                <YAxis stroke={isDarkMode ? '#CBD5E1' : '#475569'} fontSize={12} fontWeight={600} tickFormatter={v => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                    borderColor: isDarkMode ? '#334155' : '#cbd5e1',
                    borderRadius: '12px',
                    color: isDarkMode ? '#ffffff' : '#0f172a',
                    fontWeight: 600,
                  }}
                  formatter={(val: any) => [`₹${val.toLocaleString()}`, 'Sales']}
                />
                <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Visitor Path Breakdown */}
        <div className={`p-6 rounded-3xl border space-y-4 ${cardBg}`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-base font-bold ${textPrimary} flex items-center gap-2`}>
              <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Live Traffic Funnel
            </h3>
            <span className={`text-xs font-mono font-bold ${textMuted}`}>Real-time</span>
          </div>

          <div className="space-y-3">
            {Object.entries(pageBreakdown).map(([path, count]) => (
              <div
                key={path}
                className={`p-3 rounded-2xl border flex items-center justify-between ${
                  isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className={`text-xs font-mono font-bold ${textSecondary} truncate max-w-[180px]`}>{path}</span>
                <span className="text-xs font-bold font-mono text-amber-800 dark:text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  {count} Shoppers
                </span>
              </div>
            ))}
          </div>

          {/* Low Stock Warning List */}
          {lowStockVariants.length > 0 && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                Inventory Action Needed
              </div>
              <ul className="space-y-1 text-xs text-rose-800 dark:text-rose-200 font-medium">
                {lowStockVariants.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex justify-between font-mono text-xs">
                    <span className="truncate max-w-[160px]">{item.product.name} ({item.variantName})</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">{item.stock} left</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Recent System Audit Events */}
      <div className={`p-6 rounded-3xl border space-y-4 ${cardBg}`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-base font-bold ${textPrimary} flex items-center gap-2`}>
            <Shield className="w-5 h-5 text-amber-500" />
            Recent Administrative Audit Logs
          </h3>
          <button
            onClick={() => onNavigateToTab('audit')}
            className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
          >
            View Full Audit Ledger →
          </button>
        </div>

        <div className={`divide-y ${isDarkMode ? 'divide-slate-800' : 'divide-slate-200'}`}>
          {auditLogs.slice(0, 4).map(log => (
            <div key={log.id} className="py-3.5 flex items-center justify-between text-xs font-medium">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <div>
                  <span className={`font-bold ${textPrimary}`}>{log.action}</span>
                  <span className={`${textSecondary} ml-2`}>— {log.details}</span>
                </div>
              </div>
              <span className={`text-xs font-mono font-bold ${textMuted}`}>
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

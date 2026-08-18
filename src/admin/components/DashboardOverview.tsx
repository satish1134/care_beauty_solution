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

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-serif text-white">Executive Command Center</h2>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
              LIVE SYSTEM
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Real-time analytics, inventory signals, and order processing pipeline.
          </p>
        </div>

        {/* Live Visitor Heartbeat Indicator */}
        <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700/80">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Live Active Shoppers</div>
            <div className="text-sm font-bold font-mono text-emerald-400">{liveVisitors} Visitors Online</div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Gross Revenue</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% vs last week</span>
          </div>
        </div>

        {/* Total Orders */}
        <div
          onClick={() => onNavigateToTab('orders')}
          className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3 cursor-pointer hover:border-slate-700 transition-colors"
        >
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Total Orders</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">{orders.length} Orders</div>
          <div className="text-amber-400 text-xs font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{pendingOrdersCount} Pending Fulfillment</span>
          </div>
        </div>

        {/* Active Catalog */}
        <div
          onClick={() => onNavigateToTab('products')}
          className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3 cursor-pointer hover:border-slate-700 transition-colors"
        >
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Formulations Catalog</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">{products.length} Products</div>
          <div className="text-slate-400 text-xs">
            {products.reduce((acc, p) => acc + p.variants.length, 0)} Active SKUs
          </div>
        </div>

        {/* Low Stock Signals */}
        <div
          onClick={() => onNavigateToTab('products')}
          className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3 cursor-pointer hover:border-slate-700 transition-colors"
        >
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Inventory Signals</span>
            <div className={`p-2 rounded-xl ${lowStockVariants.length > 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {lowStockVariants.length} Low Stock SKUs
          </div>
          <div className={`text-xs font-semibold ${lowStockVariants.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {lowStockVariants.length > 0 ? 'Action Required' : 'All SKUs Well Stocked'}
          </div>
        </div>
      </div>

      {/* Analytics Charts & Traffic Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Weekly Sales & Revenue Trajectory</h3>
              <p className="text-xs text-slate-400">Aggregated gross revenue across storefront & marketing campaigns</p>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
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
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={v => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  formatter={(val: any) => [`₹${val.toLocaleString()}`, 'Sales']}
                />
                <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Visitor Path Breakdown */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400" />
              Live Traffic Funnel
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Real-time</span>
          </div>

          <div className="space-y-3">
            {Object.entries(pageBreakdown).map(([path, count]) => (
              <div key={path} className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/50 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-300 truncate max-w-[180px]">{path}</span>
                <span className="text-xs font-bold font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {count} Shoppers
                </span>
              </div>
            ))}
          </div>

          {/* Low Stock Warning List */}
          {lowStockVariants.length > 0 && (
            <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-rose-300 text-xs font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Inventory Action Needed
              </div>
              <ul className="space-y-1 text-xs text-rose-200/80">
                {lowStockVariants.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex justify-between font-mono text-[11px]">
                    <span className="truncate max-w-[160px]">{item.product.name} ({item.variantName})</span>
                    <span className="font-bold text-rose-400">{item.stock} left</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Recent System Audit Events */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            Recent Administrative Audit Logs
          </h3>
          <button
            onClick={() => onNavigateToTab('audit')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            View Full Audit Ledger →
          </button>
        </div>

        <div className="divide-y divide-slate-800/80">
          {auditLogs.slice(0, 4).map(log => (
            <div key={log.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <div>
                  <span className="font-semibold text-slate-200">{log.action}</span>
                  <span className="text-slate-400 ml-2">— {log.details}</span>
                </div>
              </div>
              <span className="text-[11px] font-mono text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

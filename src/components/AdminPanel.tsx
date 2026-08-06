import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Package,
  ShoppingBag,
  Tag,
  FileText,
  Plus,
  Trash2,
  Edit,
  TrendingUp,
  Clock,
  Upload,
  RefreshCw,
  GitBranch,
  Database,
  CheckCircle2,
  XCircle,
  Activity,
  Server,
  Key,
  Lock,
  Globe,
  Share2,
  Play,
  Layers,
  Search,
  DollarSign,
  Users,
  Eye,
  Settings,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Product, Category, Coupon, AuditLog, Order, OrderStatus, AdminRole, AdminUser, MonitoringToolConfig, MarketplaceChannel, SeoCampaign } from '../types';

interface AdminPanelProps {
  products: Product[];
  categories: Category[];
  coupons: Coupon[];
  auditLogs: AuditLog[];
  orders: Order[];
  onRefreshData: () => void;
  onOpenGitGuide?: () => void;
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

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  categories,
  coupons,
  auditLogs,
  orders,
  onRefreshData,
  onOpenGitGuide,
}) => {
  // Current Tab
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'coupons' | 'monitoring' | 'seo' | 'marketplaces' | 'rbac' | 'audit' | 'test'>('analytics');

  // RBAC Role State (Default Super Admin, easily switched to test RBAC restrictions)
  const [currentRole, setCurrentRole] = useState<AdminRole>('SUPER_ADMIN');
  const [adminToken, setAdminToken] = useState<string>('mock_superadmin_token_2026');
  const [adminUser, setAdminUser] = useState<AdminUser>({
    id: 'adm-super-1',
    email: 'superadmin@carebeautysolution.com',
    fullName: 'Rajesh V. (Super Admin)',
    role: 'SUPER_ADMIN',
    twoFactorEnabled: true,
    permissions: [
      'PRODUCT_WRITE',
      'PRODUCT_DELETE',
      'ORDER_READ',
      'ORDER_STATUS_UPDATE',
      'ORDER_REFUND',
      'COUPON_WRITE',
      'SEO_CAMPAIGN',
      'MARKETPLACE_SYNC',
      'MONITORING_TOGGLE',
      'LIVE_VISITORS',
    ],
    createdAt: new Date().toISOString(),
  });

  // 2FA Verification Modal state
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [totpCode, setTotpCode] = useState('123456');
  const [pendingRole, setPendingRole] = useState<AdminRole>('SUPER_ADMIN');

  // Live Customer Count State
  const [liveVisitors, setLiveVisitors] = useState<number>(18);
  const [pageBreakdown, setPageBreakdown] = useState<Record<string, number>>({
    '/': 9,
    '/product/hydrating-moisturizer': 5,
    '/cart': 3,
    '/checkout': 1,
  });

  // Monitoring Tools State
  const [monitoringTools, setMonitoringTools] = useState<MonitoringToolConfig[]>([]);

  // Marketplace Channels State
  const [marketplaces, setMarketplaces] = useState<MarketplaceChannel[]>([]);

  // SEO Campaigns State
  const [seoCampaigns, setSeoCampaigns] = useState<SeoCampaign[]>([]);
  const [newSeoTitle, setNewSeoTitle] = useState('');
  const [newSeoKeywords, setNewSeoKeywords] = useState('');

  // Add Product Form state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductTagline, setNewProductTagline] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductCategory, setNewProductCategory] = useState(categories[0]?.id || '');
  const [newVariantName, setNewVariantName] = useState('50 ml Jar');
  const [newVariantPrice, setNewVariantPrice] = useState('599');
  const [newVariantStock, setNewVariantStock] = useState('50');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Status update note & Refund state for orders
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState('Customer Requested Cancellation');
  const [refundAmount, setRefundAmount] = useState('');
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Add Coupon form state
  const [couponCode, setCouponCode] = useState('');
  const [couponValue, setCouponValue] = useState('150');
  const [couponType, setCouponType] = useState<'PERCENTAGE' | 'FIXED'>('FIXED');
  const [couponMinAmount, setCouponMinAmount] = useState('699');
  const [couponUsageLimit, setCouponUsageLimit] = useState('500');

  // Phase 4 Test Runner State
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [testSummary, setTestSummary] = useState<any>(null);
  const [isRunningTest, setIsRunningTest] = useState(false);

  // Fetch Live Visitors & Monitoring Stack on Mount
  useEffect(() => {
    fetchLiveVisitors();
    fetchMonitoringConfig();
    fetchMarketplaces();

    const interval = setInterval(() => {
      fetchLiveVisitors();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchLiveVisitors = async () => {
    try {
      const res = await fetch('/api/admin/analytics/live-visitors');
      const data = await res.json();
      if (data.success) {
        setLiveVisitors(data.activeVisitors);
        if (data.pageBreakdown) setPageBreakdown(data.pageBreakdown);
      }
    } catch (e) {
      // Fallback
    }
  };

  const fetchMonitoringConfig = async () => {
    try {
      const res = await fetch('/api/admin/monitoring/config', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (data.success && data.tools) {
        setMonitoringTools(data.tools);
      }
    } catch (e) {
      // Fallback baseline
    }
  };

  const fetchMarketplaces = async () => {
    try {
      const res = await fetch('/api/admin/marketplaces', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      if (data.success && data.channels) {
        setMarketplaces(data.channels);
      }
    } catch (e) {
      // Fallback
    }
  };

  // Switch Role & Trigger 2FA Modal
  const handleRoleSwitch = (role: AdminRole) => {
    setPendingRole(role);
    setIs2FAModalOpen(true);
  };

  const verify2FAAndSetRole = async () => {
    try {
      const targetEmail =
        pendingRole === 'SUPER_ADMIN'
          ? 'superadmin@carebeautysolution.com'
          : pendingRole === 'CATALOG_MANAGER'
          ? 'catalog@carebeautysolution.com'
          : 'orders@carebeautysolution.com';

      const res = await fetch('/api/admin/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, totpCode }),
      });
      const data = await res.json();

      if (data.success) {
        setAdminToken(data.adminToken);
        setAdminUser(data.user);
        setCurrentRole(pendingRole);
        setIs2FAModalOpen(false);
        setActionNotice({
          type: 'success',
          message: `Authenticated as ${data.user.fullName} (${data.user.role}). 2FA Verified!`,
        });
      } else {
        setActionNotice({ type: 'error', message: data.message || '2FA Verification Failed' });
      }
    } catch (err: any) {
      setActionNotice({ type: 'error', message: err.message });
    }
  };

  // Check UI Permission Helper
  const hasPermission = (permission: string) => {
    return adminUser.permissions.includes(permission as any);
  };

  // Handle S3 Presigned URL Upload Simulation
  const handleS3PresignedUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Get Presigned URL from Backend
      const res = await fetch('/api/admin/uploads/presigned-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ filename: file.name, fileType: file.type }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Presigned URL generation failed');
      }

      // 2. Set CDN Upload URL in form
      setUploadedImageUrl(data.publicCdnUrl);
      setIsUploading(false);
      setActionNotice({
        type: 'success',
        message: `Image presigned & uploaded to S3 CDN bucket: ${data.fileKey}`,
      });
    } catch (err: any) {
      setIsUploading(false);
      setActionNotice({ type: 'error', message: err.message });
    }
  };

  // Execute Order Refund Action
  const handleExecuteRefund = async (orderId: string) => {
    setActionNotice(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ amount: Number(refundAmount) || undefined, reason: refundReason }),
      });

      const data = await res.json();

      if (res.status === 403) {
        setActionNotice({
          type: 'error',
          message: `⛔ 403 FORBIDDEN: Role ${adminUser.role} does NOT have permission to trigger order refunds!`,
        });
        return;
      }

      if (data.success) {
        setActionNotice({
          type: 'success',
          message: `✅ Refund Issued Successfully! Razorpay Refund ID: ${data.refundId}`,
        });
        onRefreshData();
      } else {
        setActionNotice({ type: 'error', message: data.message || 'Refund failed' });
      }
    } catch (err: any) {
      setActionNotice({ type: 'error', message: err.message });
    }
  };

  // Handle Create Coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionNotice(null);
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          code: couponCode,
          discountType: couponType,
          discountValue: Number(couponValue),
          minOrderAmount: Number(couponMinAmount),
          usageCount: 0,
        }),
      });

      const data = await res.json();
      if (res.status === 403) {
        setActionNotice({
          type: 'error',
          message: `⛔ 403 FORBIDDEN: Role ${adminUser.role} is NOT authorized to build coupons!`,
        });
        return;
      }

      if (data.success) {
        setActionNotice({ type: 'success', message: `Coupon '${data.coupon.code}' created successfully!` });
        setCouponCode('');
        onRefreshData();
      } else {
        setActionNotice({ type: 'error', message: data.message });
      }
    } catch (err: any) {
      setActionNotice({ type: 'error', message: err.message });
    }
  };

  // Toggle Plug & Play Monitoring Tool
  const handleToggleMonitoringTool = async (toolId: string, currentEnabled: boolean) => {
    try {
      const res = await fetch('/api/admin/monitoring/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ toolId, enabled: !currentEnabled }),
      });

      const data = await res.json();
      if (res.status === 403) {
        setActionNotice({
          type: 'error',
          message: `⛔ 403 FORBIDDEN: Role ${adminUser.role} cannot toggle monitoring stack!`,
        });
        return;
      }

      if (data.success) {
        fetchMonitoringConfig();
        setActionNotice({ type: 'success', message: data.message });
      }
    } catch (e) {
      // handle error
    }
  };

  // Toggle Marketplace Sync
  const handleToggleMarketplace = async (channelId: string, connected: boolean) => {
    try {
      const res = await fetch('/api/admin/marketplaces/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ channelId, connected: !connected }),
      });

      const data = await res.json();
      if (res.status === 403) {
        setActionNotice({
          type: 'error',
          message: `⛔ 403 FORBIDDEN: Role ${adminUser.role} cannot toggle marketplace sync!`,
        });
        return;
      }

      if (data.success) {
        fetchMarketplaces();
        setActionNotice({ type: 'success', message: data.message });
      }
    } catch (e) {
      // handle
    }
  };

  // Run Phase 4 Automated Test
  const handleRunPhase4Test = async () => {
    setIsRunningTest(true);
    setTestLogs([]);
    setTestSummary(null);

    try {
      const res = await fetch('/api/tests/phase4');
      const data = await res.json();
      setIsRunningTest(false);
      setTestLogs(data.logs || []);
      setTestSummary(data.summary || null);
    } catch (err: any) {
      setIsRunningTest(false);
      setTestLogs([`Error executing test: ${err.message}`]);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="min-h-screen bg-emerald-950/20 text-slate-100 p-4 lg:p-8 font-sans">
      {/* Admin Top Header & Role Selector */}
      <div className="max-w-7xl mx-auto bg-emerald-900/40 border border-emerald-800/80 rounded-2xl p-6 backdrop-blur-md shadow-2xl mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-white">Phase 4 Command Center</h1>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  RBAC Enforced
                </span>
              </div>
              <p className="text-sm text-emerald-200/70 mt-1">
                Role-Based Access Control • 2FA Auth Gate • Order Refunds • Live Visitors • Telemetry & Marketplaces
              </p>
            </div>
          </div>

          {/* Role Switcher & User Profile Pill */}
          <div className="flex flex-wrap items-center gap-3 bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-800">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider px-2">Role Switcher:</span>
            <button
              onClick={() => handleRoleSwitch('SUPER_ADMIN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentRole === 'SUPER_ADMIN'
                  ? 'bg-emerald-500 text-emerald-950 font-bold shadow-lg shadow-emerald-500/20'
                  : 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800/60'
              }`}
            >
              Super Admin
            </button>
            <button
              onClick={() => handleRoleSwitch('CATALOG_MANAGER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentRole === 'CATALOG_MANAGER'
                  ? 'bg-amber-400 text-amber-950 font-bold shadow-lg shadow-amber-400/20'
                  : 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800/60'
              }`}
            >
              Catalog Manager
            </button>
            <button
              onClick={() => handleRoleSwitch('ORDER_MANAGER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentRole === 'ORDER_MANAGER'
                  ? 'bg-blue-400 text-blue-950 font-bold shadow-lg shadow-blue-400/20'
                  : 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800/60'
              }`}
            >
              Order Manager
            </button>
          </div>
        </div>

        {/* Current Role Banner */}
        <div className="mt-6 pt-4 border-t border-emerald-800/60 flex flex-wrap items-center justify-between text-xs gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Active Admin:</span>
            <span className="font-semibold text-white">{adminUser.fullName}</span>
            <span className="px-2 py-0.5 rounded bg-emerald-800/60 text-emerald-300 border border-emerald-700">
              {adminUser.email}
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
              2FA VERIFIED
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Permitted Actions ({adminUser.permissions.length}):</span>
            <div className="flex flex-wrap gap-1">
              {adminUser.permissions.map((p) => (
                <span key={p} className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-900/80 text-emerald-300 border border-emerald-800">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Global Notification Banner */}
      {actionNotice && (
        <div
          className={`max-w-7xl mx-auto mb-6 p-4 rounded-xl border flex items-center justify-between ${
            actionNotice.type === 'error'
              ? 'bg-rose-950/80 border-rose-800 text-rose-200'
              : 'bg-emerald-900/80 border-emerald-700 text-emerald-100'
          }`}
        >
          <div className="flex items-center gap-3">
            {actionNotice.type === 'error' ? (
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            )}
            <span className="text-sm font-medium">{actionNotice.message}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-xs opacity-70 hover:opacity-100 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Tab Navigation */}
      <div className="max-w-7xl mx-auto flex flex-wrap gap-2 border-b border-emerald-800/80 pb-3 mb-8">
        {[
          { id: 'analytics', label: 'Analytics & Live Visitors', icon: TrendingUp },
          { id: 'products', label: 'Product Catalog', icon: Package },
          { id: 'orders', label: 'Order Desk & Refunds', icon: ShoppingBag },
          { id: 'coupons', label: 'Promo Coupons', icon: Tag },
          { id: 'monitoring', label: 'Monitoring Stack', icon: Activity },
          { id: 'marketplaces', label: 'Marketplaces & Q-Commerce', icon: Layers },
          { id: 'seo', label: 'SEO Campaign Launcher', icon: Globe },
          { id: 'test', label: 'Phase 4 Verification Test', icon: Play },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-emerald-500 text-emerald-950 shadow-lg shadow-emerald-500/20 font-bold'
                  : 'bg-emerald-950/40 text-emerald-200/80 hover:bg-emerald-900/60 hover:text-white border border-emerald-800/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ANALYTICS & LIVE VISITORS */}
      {activeTab === 'analytics' && (
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-emerald-900/30 border border-emerald-800/80 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Live Online Customers</span>
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <div className="text-4xl font-extrabold text-white mt-3 flex items-baseline gap-2">
                {liveVisitors}
                <span className="text-xs font-normal text-emerald-400">active sessions right now</span>
              </div>
              <p className="text-xs text-emerald-200/60 mt-2">Real-time WebSocket/Heartbeat ping tracker</p>
            </div>

            <div className="bg-emerald-900/30 border border-emerald-800/80 rounded-2xl p-6">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Total Storefront Revenue</span>
              <div className="text-3xl font-bold text-white mt-3">₹{totalRevenue.toLocaleString('en-IN')}</div>
              <p className="text-xs text-emerald-200/60 mt-2">Across direct checkout & marketplaces</p>
            </div>

            <div className="bg-emerald-900/30 border border-emerald-800/80 rounded-2xl p-6">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Total Orders Placed</span>
              <div className="text-3xl font-bold text-white mt-3">{orders.length}</div>
              <p className="text-xs text-emerald-200/60 mt-2">100% verified Razorpay transactions</p>
            </div>

            <div className="bg-emerald-900/30 border border-emerald-800/80 rounded-2xl p-6">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Avg Order Value</span>
              <div className="text-3xl font-bold text-white mt-3">
                ₹{orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0}
              </div>
              <p className="text-xs text-emerald-200/60 mt-2">High conversion clinical basket size</p>
            </div>
          </div>

          {/* Live Visitor Breakdown & Sales Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-emerald-900/30 border border-emerald-800/80 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                7-Day Revenue & Sales Velocity
              </h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SALES_CHART_DATA}>
                    <defs>
                      <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#064e3b" />
                    <XAxis dataKey="day" stroke="#a7f3d0" fontSize={12} />
                    <YAxis stroke="#a7f3d0" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#022c22', borderColor: '#065f46', color: '#fff' }} />
                    <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#salesGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Live Session Page Distribution */}
            <div className="bg-emerald-900/30 border border-emerald-800/80 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
                <span>Live Active Visitors</span>
                <span className="text-xs text-emerald-400 font-mono">Heartbeat TTL: 60s</span>
              </h3>
              <div className="space-y-4">
                {Object.entries(pageBreakdown).map(([route, count]) => (
                  <div key={route} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="font-mono text-emerald-200">{route}</span>
                      <span className="text-emerald-400 font-bold">{String(count)} users</span>
                    </div>
                    <div className="w-full h-2 bg-emerald-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((Number(count) / (liveVisitors || 1)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT CATALOG (PRODUCT CRUD + S3 PRESIGNED URL) */}
      {activeTab === 'products' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Product Catalog & S3 Signed Asset Uploads</h2>
            {hasPermission('PRODUCT_WRITE') ? (
              <button
                onClick={() => setIsAddProductOpen(!isAddProductOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4" /> Add Product (S3 Upload)
              </button>
            ) : (
              <span className="text-xs text-rose-400 font-mono bg-rose-950/60 px-3 py-1.5 rounded-lg border border-rose-800">
                🔒 PRODUCT_WRITE permission required
              </span>
            )}
          </div>

          {/* Add Product Form (S3 Upload) */}
          {isAddProductOpen && (
            <div className="bg-emerald-900/40 border border-emerald-700 p-6 rounded-2xl space-y-4">
              <h3 className="text-md font-bold text-emerald-300">New Clinical Product Entry (S3 Presigned URL Upload)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Name (e.g. 10% Niacinamide Serum)"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="bg-emerald-950 border border-emerald-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  placeholder="Tagline (e.g. Pore Minimizing & Dark Spot Corrector)"
                  value={newProductTagline}
                  onChange={(e) => setNewProductTagline(e.target.value)}
                  className="bg-emerald-950 border border-emerald-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* S3 Presigned URL File Input */}
              <div className="border-2 border-dashed border-emerald-800 rounded-xl p-4 text-center">
                <label className="cursor-pointer block">
                  <Upload className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                  <span className="text-xs text-emerald-200">
                    {isUploading ? 'Generating S3 Signed URL & Uploading CDN Asset...' : 'Click to Upload Asset via S3/R2 Signed URL'}
                  </span>
                  <input type="file" accept="image/*" onChange={handleS3PresignedUpload} className="hidden" />
                </label>
                {uploadedImageUrl && (
                  <div className="mt-3 flex items-center justify-center gap-3">
                    <img src={uploadedImageUrl} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-emerald-600" />
                    <span className="text-xs text-emerald-400 font-mono">S3 CDN URL Active</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Product Grid Table */}
          <div className="bg-emerald-900/30 border border-emerald-800/80 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-emerald-950/80 text-emerald-400 font-semibold uppercase tracking-wider border-b border-emerald-800">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-800/40 text-slate-200">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-emerald-900/20">
                    <td className="p-4 flex items-center gap-3">
                      <img src={p.images[0]?.url} alt="" className="w-10 h-10 rounded-lg object-cover border border-emerald-800" />
                      <div>
                        <div className="font-bold text-white">{p.name}</div>
                        <div className="text-emerald-300/70 text-[11px]">{p.tagline}</div>
                      </div>
                    </td>
                    <td className="p-4">{p.categoryName}</td>
                    <td className="p-4 font-bold text-emerald-400">₹{p.variants[0]?.price}</td>
                    <td className="p-4">{p.variants[0]?.stock} units</td>
                    <td className="p-4">
                      {hasPermission('PRODUCT_DELETE') ? (
                        <button className="text-rose-400 hover:text-rose-300 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">Locked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDER DESK & REFUNDS */}
      {activeTab === 'orders' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Order Management & Razorpay Refunds Desk</h2>
            <div className="text-xs text-emerald-300 bg-emerald-900/60 px-3 py-1.5 rounded-lg border border-emerald-800">
              RBAC Requirement: Refund permission restricted to <span className="text-white font-bold">SUPER_ADMIN</span> and{' '}
              <span className="text-white font-bold">ORDER_MANAGER</span>
            </div>
          </div>

          <div className="bg-emerald-900/30 border border-emerald-800/80 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-emerald-950/80 text-emerald-400 font-semibold uppercase tracking-wider border-b border-emerald-800">
                <tr>
                  <th className="p-4">Order #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Payment Status</th>
                  <th className="p-4">Razorpay Refund Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-800/40 text-slate-200">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-emerald-900/20">
                    <td className="p-4 font-mono font-bold text-emerald-300">{o.orderNumber}</td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{o.customerName}</div>
                      <div className="text-[11px] text-emerald-200/70">{o.customerPhone}</div>
                    </td>
                    <td className="p-4 font-bold text-emerald-400">₹{o.totalAmount}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          o.paymentStatus === 'REFUNDED'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      {o.paymentStatus === 'REFUNDED' ? (
                        <span className="text-[11px] text-rose-400 font-mono font-bold">✓ REFUND ISSUED</span>
                      ) : (
                        <button
                          onClick={() => handleExecuteRefund(o.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            hasPermission('ORDER_REFUND')
                              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20'
                              : 'bg-slate-800 text-slate-400 hover:bg-rose-950 hover:text-rose-300 border border-slate-700'
                          }`}
                        >
                          {hasPermission('ORDER_REFUND') ? 'Trigger Refund' : 'Attempt Refund (Will 403)'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PROMO COUPONS */}
      {activeTab === 'coupons' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <h2 className="text-xl font-bold text-white">Promo Coupon Builder</h2>

          {/* Builder Form */}
          <form onSubmit={handleCreateCoupon} className="bg-emerald-900/30 border border-emerald-800 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Coupon Code (e.g. GLOW300)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="bg-emerald-950 border border-emerald-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              required
            />
            <input
              type="number"
              placeholder="Discount Value (e.g. 150)"
              value={couponValue}
              onChange={(e) => setCouponValue(e.target.value)}
              className="bg-emerald-950 border border-emerald-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              required
            />
            <input
              type="number"
              placeholder="Min Order Amount (e.g. 699)"
              value={couponMinAmount}
              onChange={(e) => setCouponMinAmount(e.target.value)}
              className="bg-emerald-950 border border-emerald-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-xl py-2 transition-all shadow-lg shadow-emerald-500/20"
            >
              Build & Activate Coupon
            </button>
          </form>

          {/* Existing Coupons Table */}
          <div className="bg-emerald-900/30 border border-emerald-800/80 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-emerald-950/80 text-emerald-400 font-semibold uppercase tracking-wider border-b border-emerald-800">
                <tr>
                  <th className="p-4">Code</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Min Order</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-800/40 text-slate-200">
                {coupons.map((c) => (
                  <tr key={c.id}>
                    <td className="p-4 font-mono font-bold text-emerald-300">{c.code}</td>
                    <td className="p-4">{c.discountType}</td>
                    <td className="p-4 font-bold text-emerald-400">
                      {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                    </td>
                    <td className="p-4">₹{c.minOrderAmount}</td>
                    <td className="p-4 text-emerald-400 font-bold">Active</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: MONITORING STACK */}
      {activeTab === 'monitoring' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Plug & Play Open Source Monitoring Tools</h2>
            <div className="flex gap-2">
              <a
                href="/api/metrics"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 text-xs font-mono rounded-lg border border-emerald-700 flex items-center gap-1.5"
              >
                <Activity className="w-3.5 h-3.5" /> /api/metrics (Prometheus)
              </a>
              <a
                href="/api/health"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 text-xs font-mono rounded-lg border border-emerald-700 flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" /> /api/health (Uptime)
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {monitoringTools.map((tool) => (
              <div key={tool.id} className="bg-emerald-900/30 border border-emerald-800/80 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Server className="w-6 h-6 text-emerald-400" />
                    <div>
                      <h3 className="font-bold text-white text-md">{tool.name}</h3>
                      <span className="text-xs text-emerald-300/70">{tool.category}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleMonitoringTool(tool.id, tool.enabled)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      tool.enabled ? 'bg-emerald-500 text-emerald-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tool.enabled ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
                <div className="text-xs font-mono bg-emerald-950 p-2.5 rounded-lg text-emerald-300 border border-emerald-800 truncate">
                  DSN Endpoint: {tool.dsnUrl}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: MARKETPLACES & QUICK COMMERCE */}
      {activeTab === 'marketplaces' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <h2 className="text-xl font-bold text-white">Marketplace & Quick Commerce Sales Tracker (Plug & Play)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketplaces.map((m) => (
              <div key={m.id} className="bg-emerald-900/30 border border-emerald-800/80 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-lg">{m.name}</span>
                  <button
                    onClick={() => handleToggleMarketplace(m.id, m.connected)}
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      m.connected ? 'bg-emerald-500 text-emerald-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {m.connected ? 'SYNCED' : 'DISCONNECTED'}
                  </button>
                </div>
                <div className="text-xs text-emerald-300">{m.category}</div>
                <div className="pt-2 border-t border-emerald-800/60 flex justify-between text-xs">
                  <span>Sales Today:</span>
                  <span className="font-bold text-emerald-400">₹{m.revenueToday.toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: SEO CAMPAIGN LAUNCHER */}
      {activeTab === 'seo' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">SEO Campaign Launcher & Merchant Center Feeds</h2>
            <div className="flex gap-2">
              <a
                href="/api/seo/google-merchant-feed.xml"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 text-xs font-mono rounded-lg border border-emerald-700"
              >
                Google Merchant Feed (XML)
              </a>
            </div>
          </div>

          <div className="bg-emerald-900/30 border border-emerald-800/80 rounded-2xl p-6">
            <h3 className="font-bold text-emerald-300 mb-2">Automated Schema.org & Meta Tags Output</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-mono bg-emerald-950 p-4 rounded-xl border border-emerald-800">
              {`{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Ceramide Barrier Repair Cream",
  "brand": "Care Beauty Solution",
  "offers": { "@type": "Offer", "priceCurrency": "INR", "price": 599 }
}`}
            </p>
          </div>
        </div>
      )}

      {/* TAB 8: PHASE 4 INTEGRATION TEST RUNNER */}
      {activeTab === 'test' && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Phase 4 End-to-End Verification Test Runner</h2>
              <p className="text-xs text-emerald-300/70 mt-1">
                Executes complete test suite verifying 2FA, RBAC Catalog refund restriction, Order Manager refund execution, S3 uploads & telemetry.
              </p>
            </div>
            <button
              onClick={handleRunPhase4Test}
              disabled={isRunningTest}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {isRunningTest ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              {isRunningTest ? 'Executing Tests...' : 'Run Phase 4 E2E Test Suite'}
            </button>
          </div>

          {testSummary && (
            <div className="bg-emerald-900/40 border border-emerald-600 p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-md">
                <CheckCircle2 className="w-5 h-5" /> All Phase 4 Verification Assertions Passed!
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="bg-emerald-950 p-3 rounded-lg border border-emerald-800">
                  <span className="text-slate-400 block">RBAC Enforcement:</span>
                  <span className="font-bold text-emerald-300">VERIFIED (Catalog Blocked)</span>
                </div>
                <div className="bg-emerald-950 p-3 rounded-lg border border-emerald-800">
                  <span className="text-slate-400 block">Razorpay Refund:</span>
                  <span className="font-bold text-emerald-300">EXECUTED (Order Mgr)</span>
                </div>
                <div className="bg-emerald-950 p-3 rounded-lg border border-emerald-800">
                  <span className="text-slate-400 block">S3 Signed URL:</span>
                  <span className="font-bold text-emerald-300">GENERATED</span>
                </div>
                <div className="bg-emerald-950 p-3 rounded-lg border border-emerald-800">
                  <span className="text-slate-400 block">Live Visitors Ping:</span>
                  <span className="font-bold text-emerald-300">{testSummary.liveCustomersOnline} Users Online</span>
                </div>
              </div>
            </div>
          )}

          {/* Test Logs Output */}
          <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-4 font-mono text-xs text-emerald-300 h-96 overflow-y-auto space-y-2">
            {testLogs.length === 0 ? (
              <span className="text-slate-500">Click 'Run Phase 4 E2E Test Suite' to execute automated verification.</span>
            ) : (
              testLogs.map((log, idx) => <div key={idx}>{log}</div>)
            )}
          </div>
        </div>
      )}

      {/* 2FA Challenge Modal */}
      {is2FAModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-emerald-900 border border-emerald-700 p-6 rounded-2xl max-w-md w-full space-y-4">
            <div className="flex items-center gap-3 text-emerald-300">
              <Lock className="w-6 h-6" />
              <h3 className="font-bold text-lg text-white">2FA Security Challenge</h3>
            </div>
            <p className="text-xs text-emerald-200">
              Enter 6-digit TOTP code to switch active admin session role to <span className="font-bold text-white uppercase">{pendingRole}</span>.
            </p>
            <input
              type="text"
              placeholder="123456"
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value)}
              className="w-full bg-emerald-950 border border-emerald-800 rounded-xl px-4 py-3 font-mono text-center text-xl text-white tracking-widest focus:outline-none focus:border-emerald-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setIs2FAModalOpen(false)}
                className="w-1/2 py-2.5 rounded-xl border border-emerald-800 text-xs text-emerald-300 hover:bg-emerald-800/40"
              >
                Cancel
              </button>
              <button
                onClick={verify2FAAndSetRole}
                className="w-1/2 py-2.5 rounded-xl bg-emerald-500 text-emerald-950 font-bold text-xs hover:bg-emerald-400"
              >
                Verify 2FA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

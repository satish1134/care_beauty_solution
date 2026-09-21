'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  ExternalLink,
  Search,
  Filter,
  RefreshCw,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  ChevronRight,
  Eye,
  Edit2,
  Check,
  X,
  Lock,
  LogOut,
  Database,
  Sparkles,
  HardDrive,
  Layers
} from 'lucide-react';
import {
  AdminProduct,
  AdminOrder,
  Coupon,
  AuditLog,
  CustomerProfile,
  HeroCmsConfig,
  INITIAL_HERO_CMS
} from '@/lib/admin-store';
import HeroCmsManager from '@/components/admin/HeroCmsManager';
import MediaLibraryManager from '@/components/admin/MediaLibraryManager';
import ProductCmsModal from '@/components/admin/ProductCmsModal';
import StorefrontCmsManager from '@/components/admin/StorefrontCmsManager';

type AdminTab =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'hero-cms'
  | 'storefront-cms'
  | 'media-library'
  | 'customers'
  | 'marketing'
  | 'audit';

export default function AdminPortalPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Authenticated state (defaults to false to require login on page open)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('admin@careabeautysolution.com');
  const [adminPin, setAdminPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Check existing session on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const activeSession = sessionStorage.getItem('care_admin_auth');
      if (activeSession === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Live Data State
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    lowStockCount: 0,
    averageOrderValue: 0,
    conversionRate: 3.42,
    repeatCustomerRate: 48.5
  });
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [heroCms, setHeroCms] = useState<HeroCmsConfig | null>(null);

  // Modal / Action States
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [trackingModalOrder, setTrackingModalOrder] = useState<AdminOrder | null>(null);
  const [courierInput, setCourierInput] = useState<'Delhivery' | 'Shiprocket' | 'BlueDart'>('Delhivery');
  const [trackingIdInput, setTrackingIdInput] = useState('');
  const [editProductModal, setEditProductModal] = useState<AdminProduct | null>(null);
  const [stockAdjustment, setStockAdjustment] = useState<{ id: string; stock: number } | null>(null);
  const [newCouponModal, setNewCouponModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountPercent: 15,
    minSpend: 999,
    usageLimit: 500
  });

  // Search & Filter
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('ALL');

  // Load all data
  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [dashRes, ordersRes, prodRes, coupRes, custRes, auditRes, heroRes] = await Promise.all([
        fetch('/api/admin?resource=dashboard').then((r) => r.json()),
        fetch('/api/admin?resource=orders').then((r) => r.json()),
        fetch('/api/admin?resource=products').then((r) => r.json()),
        fetch('/api/admin?resource=coupons').then((r) => r.json()),
        fetch('/api/admin?resource=customers').then((r) => r.json()),
        fetch('/api/admin?resource=audit-logs').then((r) => r.json()),
        fetch('/api/hero-cms').then((r) => r.json()).catch(() => ({ heroCms: null }))
      ]);

      if (dashRes.analytics) setAnalytics(dashRes.analytics);
      if (ordersRes.orders) setOrders(ordersRes.orders);
      if (prodRes.products) setProducts(prodRes.products);
      if (coupRes.coupons) setCoupons(coupRes.coupons);
      if (custRes.customers) setCustomers(custRes.customers);
      if (auditRes.auditLogs) setAuditLogs(auditRes.auditLogs);
      if (heroRes?.heroCms) setHeroCms(heroRes.heroCms);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update order status or dispatch tracking
  const handleUpdateOrderStatus = async (
    orderId: string,
    status: AdminOrder['status'],
    trackingId?: string,
    courierPartner?: 'Delhivery' | 'Shiprocket' | 'BlueDart'
  ) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_ORDER_STATUS',
          payload: { orderId, status, trackingId, courierPartner }
        })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        setTrackingModalOrder(null);
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(data.orders.find((o: AdminOrder) => o.id === orderId) || null);
        }
        fetchData();
      }
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  // Adjust stock
  const handleStockUpdate = async (productId: string, newStock: number) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADJUST_STOCK',
          payload: { productId, newStock }
        })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
        setStockAdjustment(null);
        fetchData();
      }
    } catch (err) {
      console.error('Error updating stock:', err);
    }
  };

  // Save Full Product from ProductCmsModal
  const handleSaveFullProduct = async (productToSave: AdminProduct) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_PRODUCT',
          payload: { product: productToSave }
        })
      });
      const data = await res.json();
      if (data.success) {
        if (data.products) setProducts(data.products);
        setEditProductModal(null);
        fetchData();
      }
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
  };

  // Save Hero CMS Config
  const handleSaveHeroCms = async (updated: HeroCmsConfig) => {
    try {
      const res = await fetch('/api/hero-cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heroCms: updated,
          auditUser: 'admin@careabeautysolution.com'
        })
      });
      const data = await res.json();
      if (data.heroCms) {
        setHeroCms(data.heroCms);
        fetchData();
      }
    } catch (err) {
      console.error('Error saving hero CMS:', err);
      throw err;
    }
  };

  // Toggle Coupon
  const handleToggleCoupon = async (couponId: string) => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'TOGGLE_COUPON',
          payload: { couponId }
        })
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (err) {
      console.error('Error toggling coupon:', err);
    }
  };

  // Create Coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_COUPON',
          payload: { coupon: newCoupon }
        })
      });
      const data = await res.json();
      if (data.success) {
        setCoupons(data.coupons);
        setNewCouponModal(false);
        setNewCoupon({ code: '', discountPercent: 15, minSpend: 999, usageLimit: 500 });
        fetchData();
      }
    } catch (err) {
      console.error('Error creating coupon:', err);
    }
  };

  // Re-seed / reset Database
  const handleReseedDatabase = async () => {
    if (!confirm('Re-seed Database with enterprise dummy data feed? Any modified records will be reset to the canonical master seed.')) {
      return;
    }
    try {
      setRefreshing(true);
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RESEED_DATABASE' })
      });
      const data = await res.json();
      if (data.success) {
        await fetchData();
      }
    } catch (err) {
      console.error('Failed to reseed database:', err);
    } finally {
      setRefreshing(false);
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderFilterStatus === 'ALL' || o.status === orderFilterStatus;
    return matchesSearch && matchesStatus;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#090D16] flex items-center justify-center p-4 text-white">
        <div className="w-full max-w-md bg-[#131B2E] border border-[#1E293B] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle gold top border accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E5B85C] to-transparent opacity-80" />

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E5B85C]/20 border border-[#E5B85C]/40 flex items-center justify-center text-[#E5B85C]">
                <Lock size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold">CARE-A Admin Portal</h2>
                <p className="text-xs text-slate-400">Executive Operations Console</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              DEV SCHEMA
            </span>
          </div>

          {/* 1-Click Quick Dev Login Banner */}
          <div className="mb-6 p-3.5 bg-[#0B1120] border border-[#E5B85C]/30 rounded-2xl">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-xs text-[#E5B85C] font-semibold">
                <Sparkles size={14} />
                <span>Development Quick Access</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Default Dev Schema</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
              Default credentials are pre-configured for developer inspection and schema validation.
            </p>
            <button
              type="button"
              onClick={() => {
                setAdminEmail('admin@careabeautysolution.com');
                setAdminPin('2026');
                setIsAuthenticated(true);
                setPinError('');
                if (typeof window !== 'undefined') {
                  sessionStorage.setItem('care_admin_auth', 'true');
                }
              }}
              className="w-full py-2.5 bg-[#E5B85C]/15 hover:bg-[#E5B85C]/25 text-[#E5B85C] border border-[#E5B85C]/40 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition"
            >
              <span>⚡ Use Default Dev Credentials (1-Click)</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-[#1E293B] w-full" />
            <span className="bg-[#131B2E] px-3 text-[11px] font-mono uppercase text-slate-500 shrink-0">
              Or Manual Sign-In
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (adminPin === '2026' || adminPin === 'admin' || adminPin === 'care2026') {
                setIsAuthenticated(true);
                setPinError('');
                if (typeof window !== 'undefined') {
                  sessionStorage.setItem('care_admin_auth', 'true');
                }
              } else {
                setPinError('Invalid security credentials. (Dev hint: use 2026)');
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Admin Email ID
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@careabeautysolution.com"
                className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-[#E5B85C] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Admin Passkey / Security Key
              </label>
              <input
                type="password"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="••••"
                className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-4 py-2.5 text-sm focus:border-[#E5B85C] outline-none tracking-widest text-center text-lg"
                required
              />
              {pinError && <p className="text-xs text-rose-400 mt-2">{pinError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#E5B85C] text-[#0B1120] rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#F3CA74] transition shadow-lg shadow-[#E5B85C]/10"
            >
              Sign In to Admin Portal
            </button>
          </form>

          <p className="text-center text-[11px] text-slate-500 font-mono mt-6">
            Default Dev Credentials: <span className="text-[#E5B85C]">admin@careabeautysolution.com</span> | Key: <span className="text-[#E5B85C]">2026</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-[#E2E8F0] flex flex-col md:flex-row">
      {/* ══════════════════════════════════════════════════════════════════════
          SIDEBAR NAVIGATION SHELL
      ══════════════════════════════════════════════════════════════════════ */}
      <aside className="w-full md:w-64 bg-[#0F172A] border-b md:border-b-0 md:border-r border-[#1E293B] flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-[#1E293B] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-7 w-28">
                <Image
                  src="/images/header.png"
                  alt="CARE-A"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest bg-[#E5B85C]/15 text-[#E5B85C] px-2 py-0.5 rounded-md border border-[#E5B85C]/30 font-bold">
                Admin
              </span>
            </div>
            <Link
              href="/"
              target="_blank"
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#E5B85C] hover:bg-[#1E293B] transition"
              title="Open Live Storefront"
            >
              <ExternalLink size={15} />
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === 'dashboard'
                  ? 'bg-[#E5B85C] text-[#0A0F1D] font-bold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-[#1E293B]/70'
              }`}
            >
              <LayoutDashboard size={16} />
              <span>KPI Command Center</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === 'orders'
                  ? 'bg-[#E5B85C] text-[#0A0F1D] font-bold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-[#1E293B]/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={16} />
                <span>Fulfillment & Orders</span>
              </div>
              {orders.filter((o) => o.status === 'PENDING' || o.status === 'PROCESSING').length > 0 && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === 'orders' ? 'bg-[#0A0F1D] text-[#E5B85C]' : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {orders.filter((o) => o.status === 'PENDING' || o.status === 'PROCESSING').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === 'products'
                  ? 'bg-[#E5B85C] text-[#0A0F1D] font-bold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-[#1E293B]/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package size={16} />
                <span>Formulations & Stock</span>
              </div>
              {products.filter((p) => p.stock <= p.lowStockThreshold).length > 0 && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === 'products' ? 'bg-[#0A0F1D] text-rose-400' : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {products.filter((p) => p.stock <= p.lowStockThreshold).length} Low
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('hero-cms')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === 'hero-cms'
                  ? 'bg-[#E5B85C] text-[#0A0F1D] font-bold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-[#1E293B]/70'
              }`}
            >
              <Sparkles size={16} />
              <span>Homepage & Hero CMS</span>
            </button>

            <button
              onClick={() => setActiveTab('storefront-cms')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === 'storefront-cms'
                  ? 'bg-[#E5B85C] text-[#0A0F1D] font-bold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-[#1E293B]/70'
              }`}
            >
              <Layers size={16} />
              <span>Storefront Content & Reviews CMS</span>
            </button>

            <button
              onClick={() => setActiveTab('media-library')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === 'media-library'
                  ? 'bg-[#E5B85C] text-[#0A0F1D] font-bold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-[#1E293B]/70'
              }`}
            >
              <HardDrive size={16} />
              <span>Central Media Library</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === 'customers'
                  ? 'bg-[#E5B85C] text-[#0A0F1D] font-bold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-[#1E293B]/70'
              }`}
            >
              <Users size={16} />
              <span>Customer CRM</span>
            </button>

            <button
              onClick={() => setActiveTab('marketing')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === 'marketing'
                  ? 'bg-[#E5B85C] text-[#0A0F1D] font-bold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-[#1E293B]/70'
              }`}
            >
              <Tag size={16} />
              <span>Promotions & Coupons</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === 'audit'
                  ? 'bg-[#E5B85C] text-[#0A0F1D] font-bold shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-[#1E293B]/70'
              }`}
            >
              <ShieldCheck size={16} />
              <span>Security & Audit Logs</span>
            </button>
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-[#1E293B] flex items-center justify-between text-xs text-slate-400">
          <div>
            <div className="font-medium text-slate-200">Admin User</div>
            <div className="text-[10px] text-slate-500 font-mono">admin@careabeauty.com</div>
          </div>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              if (typeof window !== 'undefined') {
                sessionStorage.removeItem('care_admin_auth');
              }
            }}
            className="p-2 text-slate-400 hover:text-rose-400 transition"
            title="Lock Session"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════════════
          MAIN CONTENT WORKSPACE
      ══════════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        {/* Top Operational Header */}
        <header className="px-6 py-4 bg-[#0F172A]/80 backdrop-blur-md border-b border-[#1E293B] flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <span>
                {activeTab === 'dashboard' && 'Executive KPI Command Center'}
                {activeTab === 'orders' && 'Order Fulfillment & Courier Dispatch'}
                {activeTab === 'products' && 'Formulation Catalog & Live Inventory'}
                {activeTab === 'customers' && 'Customer CRM & Segment Profiles'}
                {activeTab === 'marketing' && 'Promotional Campaigns & Coupon Engine'}
                {activeTab === 'audit' && 'Security Traceability & System Audit Logs'}
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Environment: <span className="text-emerald-400 font-mono font-bold">develop (live)</span> • Synchronized with D2C Storefront
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#1E293B]/80 border border-[#334155] text-slate-300 text-xs font-mono">
              <Database size={13} className="text-emerald-400" />
              <span>DB: PostgreSQL / Volume Ready</span>
            </div>

            <button
              onClick={handleReseedDatabase}
              disabled={refreshing}
              title="Reset Database to default dummy data feed"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-xs font-mono text-amber-300 border border-amber-500/30 transition"
            >
              <span>Seed DB</span>
            </button>

            <button
              onClick={fetchData}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-xs font-mono text-slate-200 transition"
            >
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
              <span>{refreshing ? 'Syncing...' : 'Sync'}</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#E5B85C]/20 border border-[#E5B85C]/40 text-[#E5B85C] hover:bg-[#E5B85C] hover:text-[#0A0F1D] text-xs font-bold transition"
            >
              <span>View Storefront</span>
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </header>

        {/* Tab Content Container */}
        <div className="p-6 space-y-6 flex-1">
          {/* ══════════════════════════════════════════════════════════════════
              TAB 1: EXECUTIVE DASHBOARD & KPI COMMAND CENTER
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Revenue */}
                <div className="bg-[#131B2E] border border-[#1E293B] rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider">Gross Revenue</span>
                    <DollarSign size={16} className="text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">
                    ₹{analytics.totalRevenue.toLocaleString()}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                    <TrendingUp size={12} />
                    <span>+18.4% vs last period</span>
                  </div>
                </div>

                {/* Total Orders */}
                <div className="bg-[#131B2E] border border-[#1E293B] rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider">Total Orders</span>
                    <ShoppingBag size={16} className="text-[#E5B85C]" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">
                    {analytics.totalOrders}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <span>{analytics.pendingOrders} awaiting fulfillment</span>
                  </div>
                </div>

                {/* Average Order Value (AOV) */}
                <div className="bg-[#131B2E] border border-[#1E293B] rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider">Avg Order Value (AOV)</span>
                    <TrendingUp size={16} className="text-sky-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">
                    ₹{analytics.averageOrderValue}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                    <span>Target: ₹1,500+ (Sacred Trio)</span>
                  </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-[#131B2E] border border-[#1E293B] rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider">Inventory Health</span>
                    <AlertTriangle size={16} className="text-rose-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">
                    {analytics.lowStockCount > 0 ? (
                      <span className="text-rose-400">{analytics.lowStockCount} Critical Alert</span>
                    ) : (
                      <span className="text-emerald-400">100% In Stock</span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <span>Barrier Shield Moisturizer low</span>
                  </div>
                </div>
              </div>

              {/* Conversion & Retention Split Banner */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#131B2E] border border-[#1E293B] rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-mono uppercase">Storefront Conversion Rate</span>
                    <div className="text-2xl font-bold font-mono text-[#E5B85C] mt-1">
                      {analytics.conversionRate}%
                    </div>
                    <p className="text-xs text-slate-400 mt-1">D2C Industry Benchmark: 2.1%</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#E5B85C]/10 border border-[#E5B85C]/30 flex items-center justify-center text-[#E5B85C]">
                    <TrendingUp size={22} />
                  </div>
                </div>

                <div className="bg-[#131B2E] border border-[#1E293B] rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-mono uppercase">Repeat Barrier Ritual Rate</span>
                    <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                      {analytics.repeatCustomerRate}%
                    </div>
                    <p className="text-xs text-slate-400 mt-1">High retention driven by 72H moisture clinicals</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 size={22} />
                  </div>
                </div>
              </div>

              {/* Recent Orders Grid */}
              <div className="bg-[#131B2E] border border-[#1E293B] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Orders</h3>
                    <p className="text-xs text-slate-400">Live incoming shipments needing dispatch</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#E5B85C] hover:underline font-mono flex items-center gap-1"
                  >
                    <span>View All Orders</span>
                    <ChevronRight size={13} />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="text-slate-400 font-mono uppercase border-b border-[#1E293B] text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Order #</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">Total</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Courier</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E293B]/60 text-slate-300">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#1E293B]/40 transition">
                          <td className="py-3 px-3 font-mono font-bold text-white">{ord.orderNumber}</td>
                          <td className="py-3 px-3">
                            <div className="font-medium text-slate-200">{ord.customerName}</div>
                            <div className="text-[10px] text-slate-500">{ord.customerEmail}</div>
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-white">₹{ord.total}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                ord.status === 'DELIVERED'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : ord.status === 'SHIPPED'
                                  ? 'bg-sky-500/20 text-sky-300'
                                  : ord.status === 'PROCESSING'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-slate-700 text-slate-300'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-[11px] font-mono">
                            {ord.courierPartner ? (
                              <span className="text-slate-300">
                                {ord.courierPartner} ({ord.trackingId})
                              </span>
                            ) : (
                              <span className="text-slate-500">Unassigned</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrder(ord);
                                setActiveTab('orders');
                              }}
                              className="px-2.5 py-1 rounded bg-[#1E293B] hover:bg-[#334155] text-slate-200 text-[11px] transition"
                            >
                              Fulfill
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 2: ORDERS & FULFILLMENT MANAGEMENT
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Filter and Search Bar */}
              <div className="bg-[#131B2E] border border-[#1E293B] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                  <div className="relative flex-1">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="Search by Order #, Customer, or Email..."
                      className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:border-[#E5B85C] outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-slate-400" />
                  <select
                    value={orderFilterStatus}
                    onChange={(e) => setOrderFilterStatus(e.target.value)}
                    className="bg-[#0B1120] border border-[#1E293B] rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-[#E5B85C]"
                  >
                    <option value="ALL">All Statuses ({orders.length})</option>
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-[#131B2E] border border-[#1E293B] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0B1120] text-slate-400 font-mono uppercase text-[10px] border-b border-[#1E293B]">
                      <tr>
                        <th className="py-3 px-4">Order Details</th>
                        <th className="py-3 px-4">Items</th>
                        <th className="py-3 px-4">Delivery Address</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Status & Tracking</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E293B] text-slate-300">
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-[#1E293B]/30 transition">
                          {/* Order Details */}
                          <td className="py-4 px-4 align-top">
                            <div className="font-mono font-bold text-white text-sm">{ord.orderNumber}</div>
                            <div className="text-slate-300 font-medium mt-0.5">{ord.customerName}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{ord.customerPhone}</div>
                            <div className="text-[10px] text-slate-400 mt-1">
                              {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </td>

                          {/* Items */}
                          <td className="py-4 px-4 align-top">
                            <div className="space-y-1">
                              {ord.items.map((item, i) => (
                                <div key={i} className="text-[11px]">
                                  <span className="font-mono text-[#E5B85C] font-bold">{item.quantity}x</span>{' '}
                                  <span className="text-slate-200">{item.name}</span>
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* Address */}
                          <td className="py-4 px-4 align-top text-[11px] text-slate-300 max-w-[200px]">
                            <div>{ord.shippingAddress.street}</div>
                            <div className="text-slate-400">
                              {ord.shippingAddress.city}, {ord.shippingAddress.state} - {ord.shippingAddress.pincode}
                            </div>
                          </td>

                          {/* Amount */}
                          <td className="py-4 px-4 align-top">
                            <div className="font-mono font-bold text-white text-sm">₹{ord.total}</div>
                            <div className="text-[10px] font-mono text-slate-400">
                              {ord.paymentProvider} ({ord.paymentMethod})
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-4 align-top">
                            <div className="mb-2">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                  ord.status === 'DELIVERED'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : ord.status === 'SHIPPED'
                                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                    : ord.status === 'PROCESSING'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-slate-700 text-slate-300'
                                }`}
                              >
                                {ord.status}
                              </span>
                            </div>

                            {ord.trackingId ? (
                              <div className="text-[11px] font-mono text-slate-300">
                                <span className="text-slate-400">Carrier:</span> {ord.courierPartner}
                                <br />
                                <span className="text-[#E5B85C] font-bold">{ord.trackingId}</span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-amber-400 font-mono">No tracking assigned</span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-4 align-top text-right space-y-1.5">
                            {ord.status !== 'SHIPPED' && ord.status !== 'DELIVERED' && (
                              <button
                                onClick={() => {
                                  setTrackingModalOrder(ord);
                                  setCourierInput('Delhivery');
                                  setTrackingIdInput(`DLH-${Math.floor(10000000 + Math.random() * 90000000)}`);
                                }}
                                className="w-full px-3 py-1.5 rounded-lg bg-[#E5B85C] hover:bg-[#F3CA74] text-[#0A0F1D] text-xs font-bold transition flex items-center justify-center gap-1"
                              >
                                <Truck size={13} />
                                <span>Assign Tracking</span>
                              </button>
                            )}

                            {ord.status === 'SHIPPED' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id, 'DELIVERED')}
                                className="w-full px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1"
                              >
                                <Check size={13} />
                                <span>Mark Delivered</span>
                              </button>
                            )}

                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="w-full px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-[#334155] text-slate-300 text-xs font-mono transition flex items-center justify-center gap-1"
                            >
                              <Eye size={12} />
                              <span>View Invoice</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 3: FORMULATIONS & LIVE INVENTORY CRUD
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map((prod) => {
                  const isLow = prod.stock <= prod.lowStockThreshold;

                  return (
                    <div
                      key={prod.id}
                      className={`bg-[#131B2E] border rounded-2xl p-5 flex flex-col justify-between transition ${
                        isLow ? 'border-rose-500/50 shadow-rose-950/20 shadow-lg' : 'border-[#1E293B]'
                      }`}
                    >
                      <div>
                        {/* Top Badge & Stock Alert */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-[#1E293B] text-slate-300">
                            {prod.category.toUpperCase()}
                          </span>
                          {isLow ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                              <AlertTriangle size={11} />
                              <span>LOW STOCK ({prod.stock})</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                              <Check size={12} />
                              <span>{prod.stock} units available</span>
                            </span>
                          )}
                        </div>

                        {/* Title & SKU */}
                        <h4 className="text-base font-bold text-white">{prod.title}</h4>
                        <div className="text-xs font-mono text-slate-400 mt-0.5">SKU: {prod.sku}</div>
                        <p className="text-xs text-slate-400 mt-2 line-clamp-2">{prod.description}</p>

                        {/* Actives Tags */}
                        <div className="mt-3 flex flex-wrap gap-1">
                          {prod.heroActives.map((act, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B1120] text-[#E5B85C] border border-[#1E293B]"
                            >
                              {act}
                            </span>
                          ))}
                        </div>

                        {/* Pricing */}
                        <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-baseline gap-2">
                          <span className="text-xl font-bold font-mono text-white">₹{prod.price}</span>
                          {prod.compareAtPrice && (
                            <span className="text-xs font-mono text-slate-500 line-through">
                              ₹{prod.compareAtPrice}
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400 ml-auto">{prod.volume}</span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="mt-5 pt-3 border-t border-[#1E293B] flex items-center gap-2">
                        <button
                          onClick={() => setEditProductModal(prod)}
                          className="flex-1 py-2 px-3 rounded-xl bg-[#E5B85C] hover:bg-[#F3CA74] text-[#0A0F1D] text-xs font-bold font-mono transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Edit2 size={13} />
                          <span>Edit CMS & Gallery</span>
                        </button>
                        <button
                          onClick={() => setStockAdjustment({ id: prod.id, stock: prod.stock })}
                          className="py-2 px-3 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-slate-200 text-xs font-mono transition"
                          title="Quick Stock Adjustment"
                        >
                          Stock: {prod.stock}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB: HOMEPAGE & HERO CMS
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'hero-cms' && (
            <HeroCmsManager
              heroCms={heroCms || INITIAL_HERO_CMS}
              onSave={handleSaveHeroCms}
            />
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB: STOREFRONT CONTENT & REVIEWS CMS
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'storefront-cms' && (
            <StorefrontCmsManager />
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB: CENTRALIZED MEDIA LIBRARY
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'media-library' && <MediaLibraryManager />}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 4: CUSTOMER CRM & PROFILES
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="bg-[#131B2E] border border-[#1E293B] rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-[#1E293B]">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Customer Profiles & Segments</h3>
                  <p className="text-xs text-slate-400">Track purchase frequency, lifetime value, and dermatological concerns</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0B1120] text-slate-400 font-mono uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Skin Profile</th>
                        <th className="py-3 px-4">Tier</th>
                        <th className="py-3 px-4">Orders</th>
                        <th className="py-3 px-4">Lifetime Spend</th>
                        <th className="py-3 px-4">Last Active</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E293B] text-slate-300">
                      {customers.map((c) => (
                        <tr key={c.id} className="hover:bg-[#1E293B]/30 transition">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{c.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{c.email}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{c.phone}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-slate-200">{c.skinType}</div>
                            <div className="text-[11px] text-[#E5B85C]">{c.skinConcern}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                                c.tier === 'VIP'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : c.tier === 'GOLD'
                                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                  : 'bg-slate-700 text-slate-300'
                              }`}
                            >
                              {c.tier}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-white">{c.ordersCount}</td>
                          <td className="py-3.5 px-4 font-mono font-bold text-white">₹{c.totalSpent.toLocaleString()}</td>
                          <td className="py-3.5 px-4 text-slate-400 text-[11px] font-mono">{c.lastActive}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 5: MARKETING & COUPON ENGINE
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'marketing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Promotional Coupons</h3>
                  <p className="text-xs text-slate-400">Configure checkout promo codes and campaign threshold rules</p>
                </div>
                <button
                  onClick={() => setNewCouponModal(true)}
                  className="px-4 py-2 rounded-xl bg-[#E5B85C] hover:bg-[#F3CA74] text-[#0A0F1D] text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>Create Coupon</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {coupons.map((c) => (
                  <div key={c.id} className="bg-[#131B2E] border border-[#1E293B] rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-mono font-bold tracking-widest text-[#E5B85C] bg-[#0B1120] px-2.5 py-1 rounded-lg border border-[#1E293B]">
                          {c.code}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                            c.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          {c.isActive ? 'ACTIVE' : 'PAUSED'}
                        </span>
                      </div>

                      <div className="text-xl font-bold font-mono text-white mt-2">
                        {c.discountPercent ? `${c.discountPercent}% OFF` : `₹${c.discountFixed} FLAT OFF`}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Min Spend: ₹{c.minSpend || 0}</p>
                      <div className="text-xs font-mono text-slate-400 mt-3">
                        Redemptions: <span className="text-white font-bold">{c.usedCount}</span> / {c.usageLimit}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#1E293B] flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-mono">Expires: 31 Dec 2026</span>
                      <button
                        onClick={() => handleToggleCoupon(c.id)}
                        className={`text-xs font-mono font-bold transition ${
                          c.isActive ? 'text-amber-400 hover:underline' : 'text-emerald-400 hover:underline'
                        }`}
                      >
                        {c.isActive ? 'Pause' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              TAB 6: SECURITY & AUDIT LOGS
          ══════════════════════════════════════════════════════════════════ */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="bg-[#131B2E] border border-[#1E293B] rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                  Immutable Security Audit Trail
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Full traceability of pricing adjustments, stock overrides, and courier dispatch actions
                </p>

                <div className="space-y-3">
                  {auditLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl bg-[#0B1120] border border-[#1E293B] flex items-start justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#1E293B] text-[#E5B85C] font-bold">
                            {log.action}
                          </span>
                          <span className="text-slate-400 font-mono text-[11px]">{log.user}</span>
                        </div>
                        <p className="text-slate-200 font-medium">{log.details}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[10px] text-slate-500 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-[9px] text-slate-600 font-mono">{log.ipAddress}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: ASSIGN TRACKING ID & COURIER
      ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {trackingModalOrder && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#131B2E] border border-[#1E293B] rounded-3xl p-6 shadow-2xl text-white"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Truck size={18} className="text-[#E5B85C]" />
                  <h3 className="font-bold text-sm">Assign Courier & Waybill</h3>
                </div>
                <button
                  onClick={() => setTrackingModalOrder(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-slate-300 mb-4">
                Dispatching Order: <strong className="font-mono text-white">{trackingModalOrder.orderNumber}</strong> for{' '}
                {trackingModalOrder.customerName}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Courier Partner</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Delhivery', 'Shiprocket', 'BlueDart'] as const).map((partner) => (
                      <button
                        key={partner}
                        type="button"
                        onClick={() => {
                          setCourierInput(partner);
                          if (partner === 'Delhivery') setTrackingIdInput(`DLH-${Math.floor(10000000 + Math.random() * 90000000)}`);
                          if (partner === 'Shiprocket') setTrackingIdInput(`SR-${Math.floor(1000000 + Math.random() * 9000000)}`);
                          if (partner === 'BlueDart') setTrackingIdInput(`BD-${Math.floor(1000000 + Math.random() * 9000000)}`);
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-mono transition border ${
                          courierInput === partner
                            ? 'bg-[#E5B85C] text-[#0A0F1D] border-[#E5B85C] font-bold'
                            : 'bg-[#0B1120] text-slate-300 border-[#1E293B]'
                        }`}
                      >
                        {partner}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Waybill / Tracking ID</label>
                  <input
                    type="text"
                    value={trackingIdInput}
                    onChange={(e) => setTrackingIdInput(e.target.value)}
                    className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-[#E5B85C] outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setTrackingModalOrder(null)}
                    className="px-4 py-2 rounded-xl bg-[#1E293B] text-xs font-mono text-slate-300 hover:bg-[#334155]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateOrderStatus(trackingModalOrder.id, 'SHIPPED', trackingIdInput, courierInput)
                    }
                    className="px-5 py-2 rounded-xl bg-[#E5B85C] text-[#0A0F1D] text-xs font-bold uppercase tracking-wider hover:bg-[#F3CA74]"
                  >
                    Confirm Dispatch
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: ADJUST STOCK
      ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {stockAdjustment && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[#131B2E] border border-[#1E293B] rounded-3xl p-6 shadow-2xl text-white"
            >
              <h3 className="font-bold text-sm mb-2">Adjust Inventory Stock</h3>
              <p className="text-xs text-slate-400 mb-4">
                Manual override for batches, returns, or supplier replenishment.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Units in Warehouse</label>
                  <input
                    type="number"
                    value={stockAdjustment.stock}
                    onChange={(e) => setStockAdjustment({ ...stockAdjustment, stock: Number(e.target.value) })}
                    className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-4 py-2.5 text-lg font-mono text-center text-white focus:border-[#E5B85C] outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setStockAdjustment(null)}
                    className="px-4 py-2 rounded-xl bg-[#1E293B] text-xs font-mono text-slate-300 hover:bg-[#334155]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStockUpdate(stockAdjustment.id, stockAdjustment.stock)}
                    className="px-5 py-2 rounded-xl bg-[#E5B85C] text-[#0A0F1D] text-xs font-bold uppercase tracking-wider hover:bg-[#F3CA74]"
                  >
                    Save Stock
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: FULL PRODUCT & HOMEPAGE CMS EDITOR
      ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {editProductModal && (
          <ProductCmsModal
            product={editProductModal}
            onClose={() => setEditProductModal(null)}
            onSave={handleSaveFullProduct}
          />
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: VIEW ORDER INVOICE
      ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#FAF8F5] text-[#1C1917] border border-[#E8E2D5] rounded-3xl p-6 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D5]">
                <div className="flex items-center gap-2">
                  <div className="relative h-6 w-24">
                    <Image src="/images/header.png" alt="CARE-A" fill className="object-contain object-left" />
                  </div>
                  <span className="text-xs font-mono font-bold uppercase text-[#785412]">
                    Invoice #{selectedOrder.orderNumber}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-800"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="py-4 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Customer Name:</span>
                  <span className="font-bold">{selectedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span>{selectedOrder.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <span className="font-mono">{selectedOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Shipping Address:</span>
                  <span className="text-right max-w-[220px]">
                    {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city},{' '}
                    {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#E8E2D5]">
                  <div className="font-bold mb-2">Order Items:</div>
                  {selectedOrder.items.map((it, i) => (
                    <div key={i} className="flex justify-between text-xs py-1">
                      <span>
                        {it.quantity}x {it.name} ({it.volume})
                      </span>
                      <span className="font-mono font-bold">₹{it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#E8E2D5] space-y-1 font-mono text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount:</span>
                    <span>-₹{selectedOrder.discount}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Shipping:</span>
                    <span>₹{selectedOrder.shipping}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#1C1917] pt-2 border-t border-[#E8E2D5]">
                    <span>Total Paid:</span>
                    <span>₹{selectedOrder.total}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E2D5] flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 rounded-xl bg-[#03290A] text-[#E5B85C] text-xs font-bold uppercase tracking-wider hover:bg-[#084717]"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL: CREATE COUPON
      ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {newCouponModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#131B2E] border border-[#1E293B] rounded-3xl p-6 shadow-2xl text-white"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm">Create New Promo Code</h3>
                <button onClick={() => setNewCouponModal(false)} className="p-1 text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
                <div>
                  <label className="block font-mono uppercase text-slate-400 mb-1">Coupon Code</label>
                  <input
                    type="text"
                    required
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. SUMMER20"
                    className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:border-[#E5B85C] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono uppercase text-slate-400 mb-1">Discount %</label>
                    <input
                      type="number"
                      required
                      value={newCoupon.discountPercent}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discountPercent: Number(e.target.value) })}
                      className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-3 py-2 text-white font-mono focus:border-[#E5B85C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono uppercase text-slate-400 mb-1">Min Spend (₹)</label>
                    <input
                      type="number"
                      value={newCoupon.minSpend}
                      onChange={(e) => setNewCoupon({ ...newCoupon, minSpend: Number(e.target.value) })}
                      className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-3 py-2 text-white font-mono focus:border-[#E5B85C] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono uppercase text-slate-400 mb-1">Max Redemptions Limit</label>
                  <input
                    type="number"
                    value={newCoupon.usageLimit}
                    onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: Number(e.target.value) })}
                    className="w-full bg-[#0B1120] border border-[#1E293B] rounded-xl px-3 py-2 text-white font-mono focus:border-[#E5B85C] outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCouponModal(false)}
                    className="px-4 py-2 rounded-xl bg-[#1E293B] font-mono text-slate-300 hover:bg-[#334155]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#E5B85C] text-[#0A0F1D] font-bold uppercase tracking-wider hover:bg-[#F3CA74]"
                  >
                    Create Code
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

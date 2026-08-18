import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, ArrowLeft, Key, Activity, Sparkles, CheckCircle2 } from 'lucide-react';
import { AdminSidebar, AdminTab } from './components/AdminSidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { ProductManager } from './components/ProductManager';
import { OrderFulfillment } from './components/OrderFulfillment';
import { ReviewModerator } from './components/ReviewModerator';
import { CouponManager } from './components/CouponManager';
import { AuditLogViewer } from './components/AuditLogViewer';
import { SeoMetaManager } from './components/SeoMetaManager';
import { MarketplaceIntegrator } from './components/MarketplaceIntegrator';
import { RbacManager } from './components/RbacManager';
import { Product, Category, Coupon, AuditLog, Order, AdminRole } from '../types';

interface AdminPortalProps {
  products: Product[];
  categories: Category[];
  coupons: Coupon[];
  auditLogs: AuditLog[];
  orders: Order[];
  onRefreshData: () => void;
  onExitToStore: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  products,
  categories,
  coupons,
  auditLogs,
  orders,
  onRefreshData,
  onExitToStore,
}) => {
  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');

  // Security Role State
  const [currentRole, setCurrentRole] = useState<AdminRole>('SUPER_ADMIN');

  // Authentication State - Locked by default unless valid short-lived session exists in sessionStorage
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Clear legacy permanent localStorage flag to eliminate insecure persistent bypass
    localStorage.removeItem('care_admin_auth');
    try {
      const sessionToken = sessionStorage.getItem('care_admin_session_active');
      const sessionExpiry = sessionStorage.getItem('care_admin_session_expiry');
      if (sessionToken === 'valid' && sessionExpiry && Date.now() < Number(sessionExpiry)) {
        return true;
      }
    } catch {
      // Fallback lock
    }
    return false;
  });

  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Inactivity Auto-Lock Security Timer (15 minutes)
  useEffect(() => {
    if (!isAuthenticated) return;

    let timeoutId: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(timeoutId);
      // Set session expiry 15 minutes from now
      sessionStorage.setItem('care_admin_session_expiry', (Date.now() + 15 * 60 * 1000).toString());
      timeoutId = setTimeout(() => {
        handleLogout();
        setAuthError('Session timed out due to 15 minutes of inactivity. Please re-authenticate.');
      }, 15 * 60 * 1000);
    };

    resetTimer();
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [isAuthenticated]);

  // Live Visitor Counter State
  const [liveVisitors, setLiveVisitors] = useState<number>(18);
  const [pageBreakdown, setPageBreakdown] = useState<Record<string, number>>({
    '/': 9,
    '/product/hydrating-moisturizer': 5,
    '/cart': 3,
    '/checkout': 1,
  });

  // Fetch Live Visitors
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchAnalytics = async () => {
      try {
        const res = await fetch('/api/analytics/live-visitors');
        const data = await res.json();
        if (data.success) {
          setLiveVisitors(data.activeVisitors || 18);
          if (data.pageBreakdown) setPageBreakdown(data.pageBreakdown);
        }
      } catch (err) {
        // Fallback live visitor oscillation
        setLiveVisitors(prev => Math.max(12, prev + (Math.random() > 0.5 ? 1 : -1)));
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'admin123' || passcode === 'careadmin') {
      setIsAuthenticated(true);
      // Store short-lived session in sessionStorage (expires when tab/window closes)
      sessionStorage.setItem('care_admin_session_active', 'valid');
      sessionStorage.setItem('care_admin_session_expiry', (Date.now() + 15 * 60 * 1000).toString());
      localStorage.removeItem('care_admin_auth'); // Ensure no persistent storage
      setPasscode('');
      setAuthError(null);
    } else {
      setAuthError('Invalid Security Passcode. Access denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('care_admin_session_active');
    sessionStorage.removeItem('care_admin_session_expiry');
    localStorage.removeItem('care_admin_auth');
  };

  // Render Lock Screen if Unauthenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6">
        {/* Header Bar */}
        <header className="flex justify-between items-center max-w-5xl mx-auto w-full pt-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <span className="font-serif font-bold text-lg text-white tracking-wide">
              CARe Beauty — Admin Portal
            </span>
          </div>
          <button
            onClick={onExitToStore}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Customer Storefront</span>
          </button>
        </header>

        {/* Auth Lock Box */}
        <main className="max-w-md mx-auto w-full my-auto py-12">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold font-serif text-white">Back-Office Security Passcode</h2>
              <p className="text-slate-400 text-xs">Enter administrative credentials to access command center.</p>
            </div>

            {authError && (
              <div className="p-3.5 bg-rose-950/80 border border-rose-800/80 rounded-2xl text-xs text-rose-300 font-medium text-center">
                {authError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-xs font-semibold mb-2">Admin Passcode</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={passcode}
                    onChange={e => setPasscode(e.target.value)}
                    placeholder="Enter admin passcode (e.g. admin123)..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 font-mono tracking-widest"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-amber-500/20 uppercase tracking-wider"
              >
                Authenticate Session
              </button>
            </form>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] font-mono text-slate-400 text-center">
              Demo Access Passcode: <span className="text-amber-400 font-bold">admin123</span>
            </div>
          </div>
        </main>

        <footer className="text-center text-xs text-slate-500 font-mono">
          © 2026 CARe Beauty Solution — Restricted Administrative Environment
        </footer>
      </div>
    );
  }

  // Render Full Admin Portal Dashboard Layout
  return (
    <div
      className={`min-h-screen flex overflow-hidden font-sans transition-colors ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentRole={currentRole}
        onChangeRole={setCurrentRole}
        onExitToStore={onExitToStore}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Header */}
        <header
          className={`border-b px-8 py-4 flex justify-between items-center shrink-0 transition-colors ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Logged in as:
            </span>
            <span className="text-xs font-bold font-mono text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
              Rajesh V. (Super Admin)
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              PROD SERVER ACTIVE
            </span>
          </div>
        </header>

        {/* Tab Content */}
        <main className="p-8 flex-1 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'analytics' && (
            <DashboardOverview
              products={products}
              orders={orders}
              auditLogs={auditLogs}
              liveVisitors={liveVisitors}
              pageBreakdown={pageBreakdown}
              onNavigateToTab={setActiveTab}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'products' && (
            <ProductManager
              products={products}
              categories={categories}
              onRefreshData={onRefreshData}
              isDarkMode={isDarkMode}
            />
          )}

          {activeTab === 'orders' && (
            <OrderFulfillment orders={orders} onRefreshData={onRefreshData} isDarkMode={isDarkMode} />
          )}

          {activeTab === 'reviews' && <ReviewModerator products={products} isDarkMode={isDarkMode} />}

          {activeTab === 'coupons' && (
            <CouponManager coupons={coupons} onRefreshData={onRefreshData} isDarkMode={isDarkMode} />
          )}

          {activeTab === 'audit' && <AuditLogViewer auditLogs={auditLogs} isDarkMode={isDarkMode} />}

          {activeTab === 'seo' && <SeoMetaManager products={products} isDarkMode={isDarkMode} />}

          {activeTab === 'marketplaces' && (
            <MarketplaceIntegrator products={products} isDarkMode={isDarkMode} />
          )}

          {activeTab === 'rbac' && <RbacManager isDarkMode={isDarkMode} />}
        </main>
      </div>
    </div>
  );
};

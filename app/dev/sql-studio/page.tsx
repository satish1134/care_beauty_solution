'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  Database,
  Table,
  HardDrive,
  Play,
  Download,
  RotateCcw,
  Shield,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Server,
  Lock,
  ChevronRight,
  ChevronDown,
  Layers,
  Key,
  Copy,
  FileSpreadsheet,
  Cpu,
  Activity,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { TableSummary, DbCapacityMetrics, SqlQueryResult } from '@/lib/sql-studio-service';

const QUICK_TEMPLATES = [
  {
    name: '1. Active Hero Campaigns',
    query: 'SELECT id, headline, primary_cta_text, media_type, is_active, updated_at FROM hero_campaigns;'
  },
  {
    name: '2. Low Stock Products & Pricing',
    query: 'SELECT id, name, category, price, stock, status FROM products WHERE stock < 20 ORDER BY stock ASC;'
  },
  {
    name: '3. Recent Customer Orders',
    query: 'SELECT id, customer_name, customer_email, total, status, items_count, created_at FROM orders ORDER BY created_at DESC LIMIT 20;'
  },
  {
    name: '4. Active Discount Coupons',
    query: 'SELECT id, code, discount_type, discount_value, is_active, usage_count FROM coupons WHERE is_active = true;'
  },
  {
    name: '5. High-Value VIP Customers',
    query: 'SELECT id, name, email, tier, total_spent, orders_count FROM customers ORDER BY total_spent DESC LIMIT 10;'
  },
  {
    name: '6. Security & Audit Trail',
    query: 'SELECT id, timestamp, user, action, entity_type, details FROM audit_logs ORDER BY timestamp DESC LIMIT 25;'
  },
  {
    name: '7. Database Storage Breakdown',
    query: 'SELECT table_name, count(*) as count FROM information_schema.tables WHERE table_schema = \'public\' GROUP BY table_name;'
  }
];

export default function DeveloperSqlStudioPage() {
  const [devToken, setDevToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Database Telemetry & Schema State
  const [schema, setSchema] = useState<TableSummary[]>([]);
  const [metrics, setMetrics] = useState<DbCapacityMetrics | null>(null);
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({ products: true });
  const [loadingInitial, setLoadingInitial] = useState(false);

  // Query Execution State
  const [queryInput, setQueryInput] = useState('SELECT id, name, category, price, stock, status FROM products ORDER BY stock ASC LIMIT 20;');
  const [safeMode, setSafeMode] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [queryResult, setQueryResult] = useState<SqlQueryResult | null>(null);
  const [activeTab, setActiveTab] = useState<'results' | 'capacity' | 'schema'>('results');
  const [history, setHistory] = useState<string[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-login from localStorage if previously authorized
  useEffect(() => {
    const saved = localStorage.getItem('care_dev_token') || 'care-dev-ops-2026';
    if (saved) {
      setDevToken(saved);
      verifyAndLoad(saved);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyAndLoad = async (tokenToTest: string) => {
    setLoadingInitial(true);
    setAuthError('');
    try {
      const res = await fetch('/api/dev/sql', {
        headers: { 'x-dev-token': tokenToTest.trim() }
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setSchema(data.schema || []);
        setMetrics(data.metrics || null);
        localStorage.setItem('care_dev_token', tokenToTest.trim());
        // Run initial default query
        runQuery(queryInput, tokenToTest.trim());
      } else {
        setIsAuthenticated(false);
        setAuthError(data.error || 'Invalid developer access passkey.');
      }
    } catch {
      setIsAuthenticated(false);
      setAuthError('Connection error to developer gateway.');
    } finally {
      setLoadingInitial(false);
    }
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devToken.trim()) {
      setAuthError('Please enter developer key');
      return;
    }
    verifyAndLoad(devToken);
  };

  const runQuery = async (overrideQuery?: string, tokenOverride?: string) => {
    const q = overrideQuery || queryInput;
    if (!q.trim()) return;

    const token = tokenOverride || devToken;
    setIsExecuting(true);
    setActiveTab('results');

    try {
      const res = await fetch('/api/dev/sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-dev-token': token.trim()
        },
        body: JSON.stringify({ query: q, safeMode })
      });

      const result = await res.json();
      setQueryResult(result);

      if (result.success) {
        setHistory((prev) => [q, ...prev.filter((item) => item !== q)].slice(0, 10));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setQueryResult({
        success: false,
        query: q,
        executionTimeMs: 0,
        rowCount: 0,
        columns: [],
        rows: [],
        error: `Network / Gateway Error: ${message}`
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runQuery();
    }
  };

  const toggleTableExpand = (tableName: string) => {
    setExpandedTables((prev) => ({
      ...prev,
      [tableName]: !prev[tableName]
    }));
  };

  const setQueryFromTable = (tableName: string) => {
    const newQ = `SELECT * FROM ${tableName} LIMIT 50;`;
    setQueryInput(newQ);
    runQuery(newQ);
  };

  const exportToCsv = () => {
    if (!queryResult || !queryResult.rows || queryResult.rows.length === 0) return;
    const headers = queryResult.columns.map((c) => c.name);
    const rows = queryResult.rows.map((r) =>
      headers.map((h) => JSON.stringify(r[h] ?? '')).join(',')
    );
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `care_db_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJson = () => {
    if (!queryResult || !queryResult.rows) return;
    const jsonStr = JSON.stringify(queryResult.rows, null, 2);
    navigator.clipboard.writeText(jsonStr);
    alert('Query result rows copied to clipboard as JSON format!');
  };

  // 1. GATEWAY SCREEN: If developer passkey is not validated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#1E293B] border border-slate-700 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Terminal size={24} />
            </div>
            <div>
              <h1 className="text-xl font-mono font-bold text-white tracking-wide">
                Developer SQL Studio
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                dev.careabeautysolution.com
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2 font-mono">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <Lock size={14} />
              <span>Developer &amp; SRE Environment</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              This console provides direct query execution, schema inspection, and disk telemetry. Regular store managers should use the Merchant CMS at{' '}
              <span className="text-amber-300 font-bold">admin.careabeautysolution.com</span>.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-mono">
              <AlertTriangle size={15} className="shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-2 uppercase tracking-wider">
                Developer Access Passkey
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={devToken}
                  onChange={(e) => setDevToken(e.target.value)}
                  placeholder="Enter DEV_CONSOLE_TOKEN"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
                />
                <Key size={16} className="absolute right-3.5 top-3.5 text-slate-500" />
              </div>
              <p className="text-[10px] font-mono text-slate-500 mt-1.5">
                Default sandbox key: <code className="text-amber-400">care-dev-ops-2026</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={loadingInitial}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {loadingInitial ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Terminal size={16} />
                  <span>Authenticate Session</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
            <Link href="/" className="hover:text-amber-400 transition flex items-center gap-1">
              ← Return to Storefront
            </Link>
            <Link href="/admin" className="hover:text-amber-400 transition">
              Merchant Admin CMS →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN DEVELOPER SQL STUDIO WORKSPACE
  return (
    <div className="min-h-screen bg-[#090D16] text-slate-200 flex flex-col font-mono text-xs">
      {/* Top Telemetry Header */}
      <header className="h-14 border-b border-slate-800 bg-[#0F172A] px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Database size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-wide text-sm">
                Care Beauty SQL Studio
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {metrics?.databaseEngine || 'PostgreSQL 16'}
              </span>
            </div>
            <span className="text-[10px] text-slate-500">
              dev.careabeautysolution.com • DB: {metrics?.connectedDatabase || 'care_beauty_db'}
            </span>
          </div>
        </div>

        {/* Global DB Telemetry Badges */}
        <div className="hidden md:flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <HardDrive size={13} className="text-amber-400" />
            <span className="text-slate-400">Disk Footprint:</span>
            <span className="font-bold text-white">{metrics?.totalDatabaseSizeFormatted || '42.8 MB'}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <Activity size={13} className="text-emerald-400" />
            <span className="text-slate-400">Pool Connections:</span>
            <span className="font-bold text-white">{metrics?.activeConnections || 1} / {metrics?.maxConnections || 20}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <Cpu size={13} className="text-indigo-400" />
            <span className="text-slate-400">Cache Hit:</span>
            <span className="font-bold text-white">{metrics?.cacheHitRatio || '99.4%'}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-[11px]"
          >
            <span>Admin CMS</span>
            <ArrowRight size={12} />
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem('care_dev_token');
              setIsAuthenticated(false);
            }}
            className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition text-[11px]"
            title="Lock Developer Console"
          >
            Lock
          </button>
        </div>
      </header>

      {/* Main Grid: Left Schema Inspector + Right Query Console */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR: Table & Schema Tree (DBeaver style) */}
        <aside className="w-64 sm:w-72 border-r border-slate-800 bg-[#0B1120] flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-amber-400" />
              <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Tables ({schema.length})
              </span>
            </div>
            <button
              onClick={() => verifyAndLoad(devToken)}
              className="p-1 rounded text-slate-500 hover:text-slate-300 transition"
              title="Refresh Schema"
            >
              <RotateCcw size={12} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {schema.map((tbl) => {
              const isExpanded = expandedTables[tbl.tableName];
              return (
                <div key={tbl.tableName} className="rounded-lg border border-transparent hover:border-slate-800">
                  <div
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-900 cursor-pointer group select-none"
                    onClick={() => toggleTableExpand(tbl.tableName)}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {isExpanded ? (
                        <ChevronDown size={13} className="text-slate-500" />
                      ) : (
                        <ChevronRight size={13} className="text-slate-500" />
                      )}
                      <Table size={13} className="text-amber-400 shrink-0" />
                      <span className="font-bold text-slate-200 group-hover:text-amber-300 truncate">
                        {tbl.tableName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-slate-400 font-mono">
                        {tbl.rowCount}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setQueryFromTable(tbl.tableName);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded bg-slate-800 hover:bg-amber-500 hover:text-black text-slate-300 transition text-[9px]"
                        title="Query 50 rows"
                      >
                        <Play size={10} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Columns List */}
                  {isExpanded && (
                    <div className="pl-6 pr-2 py-1 space-y-1 bg-slate-950/40 rounded-b-lg border-l border-slate-800 ml-3 my-0.5">
                      <div className="text-[10px] text-slate-500 pb-1 flex justify-between">
                        <span>Columns ({tbl.columns.length})</span>
                        <span className="text-slate-400">{tbl.totalSizeFormatted}</span>
                      </div>
                      {tbl.columns.map((col) => (
                        <div
                          key={col.columnName}
                          className="flex items-center justify-between text-[10px] py-0.5 text-slate-300 hover:text-white"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            {col.isPrimaryKey ? (
                              <Key size={10} className="text-amber-400 shrink-0" />
                            ) : (
                              <span className="w-2.5 h-2.5 inline-block text-slate-600 font-mono">•</span>
                            )}
                            <span className="truncate">{col.columnName}</span>
                          </div>
                          <span className="text-[9px] font-mono text-slate-500 shrink-0">
                            {col.dataType}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Staging Safety Banner */}
          <div className="p-3 border-t border-slate-800 bg-[#090D16] text-[10px] text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-400 font-semibold">
              <Server size={12} className="text-amber-400" />
              <span>Branch: develop (Staging)</span>
            </div>
            <p>Database migrations run via CI/CD before prod deployment.</p>
          </div>
        </aside>

        {/* RIGHT MAIN PANEL: SQL Editor + Result Table */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#090D16]">
          {/* Editor Toolbar */}
          <div className="h-12 border-b border-slate-800 bg-[#0F172A] px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              {/* Quick Template Picker */}
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    setQueryInput(e.target.value);
                    runQuery(e.target.value);
                  }
                }}
                className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-2.5 py-1.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-500"
                defaultValue=""
              >
                <option value="" disabled>
                  ⚡ Quick Query Templates...
                </option>
                {QUICK_TEMPLATES.map((tmpl) => (
                  <option key={tmpl.name} value={tmpl.query}>
                    {tmpl.name}
                  </option>
                ))}
              </select>

              {/* Safe Mode Toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer select-none bg-slate-900/80 px-2.5 py-1 rounded-lg border border-slate-800">
                <input
                  type="checkbox"
                  checked={safeMode}
                  onChange={(e) => setSafeMode(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
                />
                <span className="flex items-center gap-1 text-[11px]">
                  {safeMode ? (
                    <>
                      <Shield size={12} className="text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Safe Mode Active</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert size={12} className="text-rose-400" />
                      <span className="text-rose-400 font-semibold">Unrestricted Mode</span>
                    </>
                  )}
                </span>
              </label>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQueryInput('')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                title="Clear Editor"
              >
                <RotateCcw size={13} />
              </button>

              <button
                type="button"
                onClick={() => runQuery()}
                disabled={isExecuting}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono transition flex items-center gap-2 shadow disabled:opacity-50"
              >
                {isExecuting ? (
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Play size={13} className="fill-slate-950" />
                    <span>Run Query (Ctrl+Enter)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* SQL Editor Area */}
          <div className="h-44 border-b border-slate-800 bg-[#090D16] relative flex">
            {/* Fake line numbers */}
            <div className="w-10 bg-[#070A12] border-r border-slate-800/80 text-slate-600 text-[11px] font-mono py-3 select-none text-right pr-2">
              1<br />2<br />3<br />4<br />5<br />6<br />7
            </div>
            <textarea
              ref={textareaRef}
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="-- Enter SQL query (SELECT, INSERT, UPDATE, EXPLAIN)..."
              spellCheck={false}
              className="flex-1 bg-transparent text-amber-300 font-mono text-xs p-3 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Tabs: Results Grid | Database Capacity | Schema Details */}
          <div className="h-10 border-b border-slate-800 bg-[#0F172A] px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4 h-full">
              <button
                type="button"
                onClick={() => setActiveTab('results')}
                className={`h-full border-b-2 font-bold px-2 flex items-center gap-1.5 transition ${
                  activeTab === 'results'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <Table size={13} />
                <span>Results Grid</span>
                {queryResult && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300">
                    {queryResult.rowCount} rows
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('capacity')}
                className={`h-full border-b-2 font-bold px-2 flex items-center gap-1.5 transition ${
                  activeTab === 'capacity'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <HardDrive size={13} />
                <span>Storage &amp; Capacity</span>
              </button>
            </div>

            {/* Export Toolbar */}
            {activeTab === 'results' && queryResult?.success && queryResult.rows.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={exportToCsv}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-[11px]"
                >
                  <FileSpreadsheet size={12} className="text-emerald-400" />
                  <span>Export CSV</span>
                </button>

                <button
                  type="button"
                  onClick={exportToJson}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1 text-[11px]"
                >
                  <Copy size={12} className="text-amber-400" />
                  <span>Copy JSON</span>
                </button>
              </div>
            )}
          </div>

          {/* Main Results View */}
          <div className="flex-1 overflow-auto bg-[#070A12] p-4">
            {activeTab === 'results' && (
              <div className="space-y-3">
                {/* Query Telemetry Summary */}
                {queryResult && (
                  <div
                    className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                      queryResult.success
                        ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
                        : 'bg-rose-950/30 border-rose-800/50 text-rose-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {queryResult.success ? (
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle size={14} className="text-rose-400 shrink-0" />
                      )}
                      <span className="font-semibold">
                        {queryResult.success
                          ? `Query executed successfully (${queryResult.rowCount} rows returned)`
                          : 'Query execution error:'}
                      </span>
                      {queryResult.error && (
                        <span className="text-rose-200 font-mono">{queryResult.error}</span>
                      )}
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      Duration: {queryResult.executionTimeMs}ms
                    </span>
                  </div>
                )}

                {/* Data Grid */}
                {queryResult && queryResult.success && queryResult.rows.length > 0 ? (
                  <div className="border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse font-mono text-xs">
                        <thead>
                          <tr className="bg-[#0F172A] border-b border-slate-800 text-slate-400">
                            <th className="p-2.5 w-12 text-center text-slate-600 border-r border-slate-800 select-none">
                              #
                            </th>
                            {queryResult.columns.map((col) => (
                              <th key={col.name} className="p-2.5 border-r border-slate-800 font-bold text-slate-200">
                                <div>{col.name}</div>
                                <span className="text-[9px] font-normal text-slate-500 uppercase">
                                  {col.type}
                                </span>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 bg-[#090D16]">
                          {queryResult.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-900/60 transition">
                              <td className="p-2.5 text-center text-slate-600 border-r border-slate-800 select-none text-[10px]">
                                {rIdx + 1}
                              </td>
                              {queryResult.columns.map((col) => {
                                const val = row[col.name];
                                const isNull = val === null || val === undefined;
                                return (
                                  <td
                                    key={col.name}
                                    className="p-2.5 border-r border-slate-800/60 text-slate-300 max-w-xs truncate"
                                  >
                                    {isNull ? (
                                      <span className="text-slate-600 italic">NULL</span>
                                    ) : typeof val === 'object' ? (
                                      <code className="text-amber-300 text-[10px]">
                                        {JSON.stringify(val)}
                                      </code>
                                    ) : (
                                      <span>{String(val)}</span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : queryResult && queryResult.success ? (
                  <div className="p-12 text-center text-slate-500 font-mono">
                    <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-400/60" />
                    <p>Query finished with 0 rows affected.</p>
                  </div>
                ) : null}
              </div>
            )}

            {/* Storage & Capacity Tab */}
            {activeTab === 'capacity' && metrics && (
              <div className="space-y-6 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-xs">Total Storage Footprint</span>
                    <h3 className="text-2xl font-bold text-white font-mono">{metrics.totalDatabaseSizeFormatted}</h3>
                    <p className="text-[10px] text-slate-500">PostgreSQL data + relation indexes</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-xs">Public Tables</span>
                    <h3 className="text-2xl font-bold text-white font-mono">{metrics.tablesCount} Tables</h3>
                    <p className="text-[10px] text-slate-500">Active catalog schemas</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-xs">Active Pool Connections</span>
                    <h3 className="text-2xl font-bold text-emerald-400 font-mono">
                      {metrics.activeConnections} / {metrics.maxConnections}
                    </h3>
                    <p className="text-[10px] text-slate-500">Connection pooling healthy</p>
                  </div>
                </div>

                <div className="border border-slate-800 rounded-2xl bg-[#0F172A] p-4 space-y-3">
                  <h4 className="font-bold text-slate-200">Table Footprint Breakdown</h4>
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500 text-[11px]">
                        <th className="pb-2">Table Name</th>
                        <th className="pb-2">Rows</th>
                        <th className="pb-2">Data Size</th>
                        <th className="pb-2">Index Size</th>
                        <th className="pb-2">Total Size</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {metrics.tables.map((t) => (
                        <tr key={t.name} className="hover:bg-slate-900/60">
                          <td className="py-2 font-bold text-slate-200">{t.name}</td>
                          <td className="py-2 text-slate-400">{t.rows.toLocaleString()}</td>
                          <td className="py-2 text-slate-400">{t.tableSize}</td>
                          <td className="py-2 text-slate-400">{t.indexSize}</td>
                          <td className="py-2 font-bold text-amber-400">{t.totalSize}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

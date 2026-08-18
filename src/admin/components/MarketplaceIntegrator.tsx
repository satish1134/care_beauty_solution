import React, { useState } from 'react';
import { ShoppingBag, RefreshCw, CheckCircle2, AlertCircle, ArrowUpRight, Zap, Database } from 'lucide-react';
import { Product } from '../../types';

interface MarketplaceIntegratorProps {
  products: Product[];
  isDarkMode?: boolean;
}

interface ChannelStatus {
  id: string;
  name: string;
  logoUrl: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'SYNCING';
  syncedProductsCount: number;
  lastSynced: string;
}

export const MarketplaceIntegrator: React.FC<MarketplaceIntegratorProps> = ({ products, isDarkMode = false }) => {
  const [channels, setChannels] = useState<ChannelStatus[]>([
    {
      id: 'amazon',
      name: 'Amazon India (Seller Central)',
      logoUrl: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&q=80&w=200',
      status: 'CONNECTED',
      syncedProductsCount: products.length,
      lastSynced: '10 mins ago',
    },
    {
      id: 'flipkart',
      name: 'Flipkart Seller Hub',
      logoUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=200',
      status: 'CONNECTED',
      syncedProductsCount: products.length - 1,
      lastSynced: '1 hour ago',
    },
    {
      id: 'nykaa',
      name: 'Nykaa Beauty Partner Portal',
      logoUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=200',
      status: 'CONNECTED',
      syncedProductsCount: products.length,
      lastSynced: '25 mins ago',
    },
    {
      id: 'meesho',
      name: 'Meesho Supplier Panel',
      logoUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=200',
      status: 'DISCONNECTED',
      syncedProductsCount: 0,
      lastSynced: 'Never',
    },
  ]);

  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const handleTriggerSync = (channelId: string) => {
    setIsSyncing(channelId);
    setTimeout(() => {
      setChannels(prev =>
        prev.map(c =>
          c.id === channelId
            ? { ...c, status: 'CONNECTED', lastSynced: 'Just now', syncedProductsCount: products.length }
            : c
        )
      );
      setIsSyncing(null);
    }, 1200);
  };

  const cardBg = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const textPrimary = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = isDarkMode ? 'text-slate-300' : 'text-slate-700';

  return (
    <div className="space-y-6">
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl border ${cardBg}`}>
        <div>
          <h2 className={`text-2xl font-bold font-serif ${textPrimary}`}>Multi-Channel Marketplace Integrations</h2>
          <p className={`${textSecondary} text-sm mt-1 font-medium`}>
            Synchronize stock levels, prices, and product SKUs across Amazon, Flipkart, Nykaa, and Meesho in real-time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {channels.map(channel => (
          <div key={channel.id} className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-500 text-lg shrink-0">
                  {channel.name[0]}
                </div>
                <div>
                  <h3 className={`text-base font-bold ${textPrimary}`}>{channel.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        channel.status === 'CONNECTED'
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                          : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30'
                      }`}
                    >
                      {channel.status}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">Last sync: {channel.lastSynced}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs font-semibold">
              <span className={textSecondary}>Active SKUs Synced:</span>
              <span className="font-mono font-bold text-amber-700 dark:text-amber-300 text-sm">
                {channel.syncedProductsCount} / {products.length} Items
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => handleTriggerSync(channel.id)}
                disabled={isSyncing === channel.id}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing === channel.id ? 'animate-spin' : ''}`} />
                <span>{isSyncing === channel.id ? 'Syncing Feeds...' : 'Force Stock Sync'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

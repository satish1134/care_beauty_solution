import React, { useState } from 'react';
import { Search, Globe, Share2, Sparkles, Code2, Check, RefreshCw, Eye, Save, AlertCircle } from 'lucide-react';
import { Product } from '../../types';

interface SeoMetaManagerProps {
  products: Product[];
  isDarkMode?: boolean;
}

interface PageSeoConfig {
  pageId: string;
  pageName: string;
  urlPath: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  canonicalUrl: string;
  noIndex: boolean;
  jsonLdType: 'Organization' | 'WebSite' | 'Product' | 'Store';
}

const DEFAULT_SEO_CONFIGS: Record<string, PageSeoConfig> = {
  home: {
    pageId: 'home',
    pageName: 'Homepage',
    urlPath: 'https://carebeautysolution.com/',
    metaTitle: 'CARe Beauty Solution — Pure Botanical Skincare & Luxury Cosmetics',
    metaDescription: 'Discover organic, dermatologist-tested Ayurvedic & botanical skincare, anti-aging serums, and luxury beauty treatments at CARe Beauty Solution.',
    keywords: 'skincare, organic cosmetics, ayurvedic beauty, vitamin c serum, luxury beauty India',
    ogImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=1200',
    canonicalUrl: 'https://carebeautysolution.com/',
    noIndex: false,
    jsonLdType: 'Store',
  },
  shop: {
    pageId: 'shop',
    pageName: 'Shop Catalog',
    urlPath: 'https://carebeautysolution.com/shop',
    metaTitle: 'Shop Ayurvedic & Botanical Skincare Products — CARe Beauty',
    metaDescription: 'Browse our entire range of cruelty-free skincare, night creams, glowing serums, and natural cleansers. Free shipping across India on orders above ₹699.',
    keywords: 'buy skincare online, natural face wash, anti aging creams, ayurvedic face oils',
    ogImage: 'https://images.unsplash.com/photo-1608248597263-00079e965873?auto=format&fit=crop&q=80&w=1200',
    canonicalUrl: 'https://carebeautysolution.com/shop',
    noIndex: false,
    jsonLdType: 'WebSite',
  },
  about: {
    pageId: 'about',
    pageName: 'About Us',
    urlPath: 'https://carebeautysolution.com/about',
    metaTitle: 'Our Heritage & Philosophy — CARe Beauty Solution',
    metaDescription: 'Learn about our journey crafting sustainable, non-toxic skincare solutions combining ancient Ayurvedic wisdom with modern clinical dermatology.',
    keywords: 'about care beauty, clean cosmetics brand, sustainable skincare India',
    ogImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200',
    canonicalUrl: 'https://carebeautysolution.com/about',
    noIndex: false,
    jsonLdType: 'Organization',
  },
};

export const SeoMetaManager: React.FC<SeoMetaManagerProps> = ({ products, isDarkMode = false }) => {
  const [selectedPage, setSelectedPage] = useState<string>('home');
  const [seoData, setSeoData] = useState<Record<string, PageSeoConfig>>(DEFAULT_SEO_CONFIGS);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'meta' | 'og' | 'jsonld'>('meta');

  const current = seoData[selectedPage] || DEFAULT_SEO_CONFIGS['home'];

  const handleUpdateCurrent = (field: keyof PageSeoConfig, value: any) => {
    setSeoData(prev => ({
      ...prev,
      [selectedPage]: {
        ...prev[selectedPage],
        [field]: value,
      },
    }));
  };

  const handleSaveSeo = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveMessage(`SEO Meta Configuration for "${current.pageName}" saved successfully.`);
      setTimeout(() => setSaveMessage(null), 3500);
    }, 600);
  };

  const generateAutoMeta = () => {
    if (selectedPage === 'home') {
      handleUpdateCurrent('metaTitle', 'CARe Beauty Solution | Premium Ayurvedic & Organic Skincare');
      handleUpdateCurrent('metaDescription', 'Transform your skin with 100% natural, cruelty-free serums, herbal cleansers, and radiance moisturizers. Fast express shipping.');
    } else if (selectedPage === 'shop') {
      handleUpdateCurrent('metaTitle', 'Buy Pure Botanical Skincare Online — CARe Beauty Catalog');
      handleUpdateCurrent('metaDescription', 'Explore dermatologist-tested skincare formulations for glowing, youthful skin. Shop anti-aging, hydration, and brightening essentials.');
    }
  };

  const cardBg = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm';
  const textPrimary = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSecondary = isDarkMode ? 'text-slate-300' : 'text-slate-700';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-slate-600';

  const titleLength = current.metaTitle.length;
  const descLength = current.metaDescription.length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl border ${cardBg}`}>
        <div>
          <h2 className={`text-2xl font-bold font-serif ${textPrimary}`}>SEO & OpenGraph Meta Engine</h2>
          <p className={`${textSecondary} text-sm mt-1 font-medium`}>
            Optimize search engine rankings, social media share cards, canonical tags, and JSON-LD structured schema.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={generateAutoMeta}
            className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Meta Generator</span>
          </button>
          <button
            onClick={handleSaveSeo}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition-colors shadow-md shadow-amber-500/20"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Meta Config</span>
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* Page Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {(Object.values(seoData) as PageSeoConfig[]).map(cfg => (
          <button
            key={cfg.pageId}
            onClick={() => setSelectedPage(cfg.pageId)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              selectedPage === cfg.pageId
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : `${isDarkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-200/60'}`
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{cfg.pageName}</span>
          </button>
        ))}
      </div>

      {/* Main Grid: Form Left, Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form (7 cols) */}
        <div className={`lg:col-span-7 p-6 rounded-3xl border space-y-5 ${cardBg}`}>
          {/* Sub Tab selector */}
          <div className="flex items-center gap-2 border-b pb-3 border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('meta')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                activeTab === 'meta'
                  ? 'bg-slate-800 text-amber-300'
                  : `${textMuted} hover:text-slate-900 dark:hover:text-white`
              }`}
            >
              Meta Tags
            </button>
            <button
              onClick={() => setActiveTab('og')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                activeTab === 'og'
                  ? 'bg-slate-800 text-amber-300'
                  : `${textMuted} hover:text-slate-900 dark:hover:text-white`
              }`}
            >
              OpenGraph (Social)
            </button>
            <button
              onClick={() => setActiveTab('jsonld')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                activeTab === 'jsonld'
                  ? 'bg-slate-800 text-amber-300'
                  : `${textMuted} hover:text-slate-900 dark:hover:text-white`
              }`}
            >
              Structured Data (JSON-LD)
            </button>
          </div>

          {activeTab === 'meta' && (
            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className={`font-bold ${textSecondary}`}>Meta Title Tag</label>
                  <span className={`text-[11px] font-mono font-bold ${titleLength > 60 ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {titleLength} / 60 chars
                  </span>
                </div>
                <input
                  type="text"
                  value={current.metaTitle}
                  onChange={e => handleUpdateCurrent('metaTitle', e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    isDarkMode
                      ? 'bg-slate-800 border border-slate-700 text-slate-100'
                      : 'bg-slate-50 border border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className={`font-bold ${textSecondary}`}>Meta Description</label>
                  <span className={`text-[11px] font-mono font-bold ${descLength > 160 ? 'text-amber-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {descLength} / 160 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={current.metaDescription}
                  onChange={e => handleUpdateCurrent('metaDescription', e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    isDarkMode
                      ? 'bg-slate-800 border border-slate-700 text-slate-100'
                      : 'bg-slate-50 border border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-bold mb-1 ${textSecondary}`}>Target Keywords (Comma Separated)</label>
                <input
                  type="text"
                  value={current.keywords}
                  onChange={e => handleUpdateCurrent('keywords', e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    isDarkMode
                      ? 'bg-slate-800 border border-slate-700 text-amber-300'
                      : 'bg-slate-50 border border-slate-300 text-amber-900 font-bold'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-bold mb-1 ${textSecondary}`}>Canonical URL</label>
                <input
                  type="text"
                  value={current.canonicalUrl}
                  onChange={e => handleUpdateCurrent('canonicalUrl', e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    isDarkMode
                      ? 'bg-slate-800 border border-slate-700 text-slate-300'
                      : 'bg-slate-50 border border-slate-300 text-slate-800 font-medium'
                  }`}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="noIndex"
                  checked={current.noIndex}
                  onChange={e => handleUpdateCurrent('noIndex', e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                <label htmlFor="noIndex" className={`font-bold cursor-pointer ${textSecondary}`}>
                  Discourage Search Engines from Indexing This Page (<code className="text-rose-500 font-mono">noindex, nofollow</code>)
                </label>
              </div>
            </div>
          )}

          {activeTab === 'og' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className={`block font-bold mb-1 ${textSecondary}`}>OpenGraph Share Image URL</label>
                <input
                  type="text"
                  value={current.ogImage}
                  onChange={e => handleUpdateCurrent('ogImage', e.target.value)}
                  className={`w-full rounded-xl px-3.5 py-2 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    isDarkMode
                      ? 'bg-slate-800 border border-slate-700 text-slate-100'
                      : 'bg-slate-50 border border-slate-300 text-slate-900 font-medium'
                  }`}
                />
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-700 dark:text-amber-300 font-medium text-xs">
                Recommended aspect ratio: 1200x630px. Image will automatically render when shared on WhatsApp, Facebook, iMessage, and Twitter.
              </div>
            </div>
          )}

          {activeTab === 'jsonld' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className={`block font-bold mb-1 ${textSecondary}`}>Schema.org Type</label>
                <select
                  value={current.jsonLdType}
                  onChange={e => handleUpdateCurrent('jsonLdType', e.target.value as any)}
                  className={`w-full rounded-xl px-3.5 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                    isDarkMode
                      ? 'bg-slate-800 border border-slate-700 text-slate-100'
                      : 'bg-slate-50 border border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="Store">Store / Merchant</option>
                  <option value="Organization">Organization</option>
                  <option value="WebSite">WebSite</option>
                  <option value="Product">Product Catalog</option>
                </select>
              </div>

              <div>
                <label className={`block font-bold mb-1 ${textSecondary}`}>Generated JSON-LD Output</label>
                <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto border border-slate-800">
{JSON.stringify(
  {
    '@context': 'https://schema.org',
    '@type': current.jsonLdType,
    name: 'CARe Beauty Solution',
    url: current.canonicalUrl,
    description: current.metaDescription,
    image: current.ogImage,
    priceRange: '₹199 - ₹2499',
    telephone: '+91 98765 43210',
  },
  null,
  2
)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Right Preview Side (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Google Search Preview */}
          <div className={`p-6 rounded-3xl border space-y-3 ${cardBg}`}>
            <div className="flex items-center gap-2 border-b pb-3 border-slate-200 dark:border-slate-800">
              <Search className="w-4 h-4 text-amber-500" />
              <h3 className={`text-sm font-bold ${textPrimary}`}>Google SERP Live Snippet</h3>
            </div>

            <div className="p-4 rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-sm space-y-1 font-sans">
              <div className="text-[11px] text-slate-600 flex items-center gap-1">
                <span>{current.canonicalUrl}</span>
              </div>
              <div className="text-base font-semibold text-[#1a0dab] hover:underline cursor-pointer line-clamp-1">
                {current.metaTitle || 'Page Title Placeholder'}
              </div>
              <div className="text-xs text-[#4d5156] line-clamp-2 leading-relaxed">
                {current.metaDescription || 'Meta description snippet will appear here when configured...'}
              </div>
            </div>
          </div>

          {/* Social Share Card Preview */}
          <div className={`p-6 rounded-3xl border space-y-3 ${cardBg}`}>
            <div className="flex items-center gap-2 border-b pb-3 border-slate-200 dark:border-slate-800">
              <Share2 className="w-4 h-4 text-amber-500" />
              <h3 className={`text-sm font-bold ${textPrimary}`}>Social Card Preview (FB / WhatsApp)</h3>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
              <img
                src={current.ogImage}
                alt="OG Preview"
                className="w-full h-36 object-cover"
              />
              <div className="p-3.5 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  CAREBEAUTYSOLUTION.COM
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {current.metaTitle}
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                  {current.metaDescription}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

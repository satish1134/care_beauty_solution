import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sun, Droplets, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { ProductCategory } from '../../types/marketplace';

export const CategoryCirclesStrip: React.FC = () => {
  const { openPlp, allProducts, openPdp } = useStore();

  const CATEGORIES: {
    category: ProductCategory;
    step: string;
    title: string;
    tagline: string;
    image: string;
    icon: React.ReactNode;
    badge: string;
    productId: string;
    highlights: string;
  }[] = [
    {
      category: 'Sunscreen',
      step: 'Step 3 • Daily Shield',
      title: 'Ray Barrier Sunscreen',
      tagline: 'SPF 50+ PA++++ • High protection, comfortable everyday wear',
      image: '/images/care-ray-barrier-sunscreen.svg',
      icon: <Sun className="w-4 h-4 text-amber-500" />,
      badge: 'Zero White Cast',
      productId: 'cbs-sunscreen-01',
      highlights: 'Modern UV Filters + Ceramide NP + Niacinamide',
    },
    {
      category: 'Moisturizer',
      step: 'Step 2 • Barrier Support',
      title: 'Hydrating Moisturizer',
      tagline: 'Lightweight hydration, long-lasting comfort & barrier support',
      image: '/images/care-hydrating-moisturizer.svg',
      icon: <Sparkles className="w-4 h-4 text-emerald-500" />,
      badge: 'Ceramides + Panthenol',
      productId: 'cbs-moisturizer-01',
      highlights: 'Ceramides + Niacinamide + Sodium PCA',
    },
    {
      category: 'Cleanser',
      step: 'Step 1 • Gentle Purify',
      title: 'Refreshing Skin Cleanser',
      tagline: 'Clean without stripping • Respects natural skin barrier',
      image: '/images/care-refreshing-skin-cleanser.svg',
      icon: <Droplets className="w-4 h-4 text-blue-500" />,
      badge: 'Amino Acid Gentle',
      productId: 'cbs-cleanser-01',
      highlights: 'Ceramides + Panthenol + Aloe Vera',
    },
  ];

  return (
    <section
      id="category-strip-section"
      className="py-8 sm:py-12 bg-white border-b border-[#E5E5E5]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-widest text-[#2D5A3D]">
              <ShieldCheck className="w-4 h-4 text-[#2D5A3D]" />
              <span>The 3 Clinical Essentials</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1A1A1A] tracking-tight mt-1">
              Complete 3-Step Barrier System
            </h2>
          </div>
          <button
            onClick={() => openPlp()}
            className="text-xs font-bold text-[#E85D5D] hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View All 3 Formulations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Focused Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {CATEGORIES.map((cat) => {
            const product = allProducts.find((p) => p.id === cat.productId);
            return (
              <div
                key={cat.category}
                onClick={() => {
                  if (product) openPdp(product);
                  else openPlp(cat.category);
                }}
                className="group cursor-pointer text-left bg-[#FAF9F6] hover:bg-white border border-[#E5E5E5] hover:border-[#E85D5D] rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:shadow-lg focus:outline-none flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-[#2D5A3D] uppercase tracking-wide">
                      {cat.step}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#2D5A3D]/10 text-[#2D5A3D]">
                      {cat.badge}
                    </span>
                  </div>

                  <div className="w-full aspect-[4/3] bg-white rounded-xl border border-[#E5E5E5] p-4 mb-4 flex items-center justify-center overflow-hidden group-hover:border-[#E85D5D]/40 transition-colors">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/care-official-gold-logo.svg';
                      }}
                    />
                  </div>

                  <h3 className="text-base font-extrabold text-[#1A1A1A] group-hover:text-[#E85D5D] transition">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed line-clamp-2">
                    {cat.tagline}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E5E5E5] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#2D5A3D] truncate max-w-[200px]">
                    {cat.highlights}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#E85D5D]">
                    <span>View Product</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

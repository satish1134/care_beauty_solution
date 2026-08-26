import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sun, Droplets, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { ProductCategory } from '../../types/marketplace';
import product1Img from '../../assets/product-1.jpeg';
import product2Img from '../../assets/product-2.jpeg';
import product3Img from '../../assets/product-3.jpeg';

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
      image: product1Img,
      icon: <Sun className="w-4 h-4 text-amber-500" />,
      badge: 'Zero White Cast',
      productId: 'cbs-sunscreen-01',
      highlights: 'Ceramide NP + Niacinamide',
    },
    {
      category: 'Moisturizer',
      step: 'Step 2 • Barrier Support',
      title: 'Hydrating Moisturizer',
      tagline: 'Lightweight hydration, long-lasting comfort & barrier support',
      image: product2Img,
      icon: <Sparkles className="w-4 h-4 text-emerald-500" />,
      badge: 'Ceramides + Panthenol',
      productId: 'cbs-moisturizer-01',
      highlights: 'Ceramides + Sodium PCA',
    },
    {
      category: 'Cleanser',
      step: 'Step 1 • Gentle Purify',
      title: 'Refreshing Skin Cleanser',
      tagline: 'Clean without stripping • Respects natural skin barrier',
      image: product3Img,
      icon: <Droplets className="w-4 h-4 text-blue-500" />,
      badge: 'Amino Acid Gentle',
      productId: 'cbs-cleanser-01',
      highlights: 'Amino Acids + Aloe Vera',
    },
  ];

  return (
    <section
      id="category-strip-section"
      className="py-6 sm:py-10 bg-white border-b border-[#E5E5E5]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => {
            const product = allProducts.find((p) => p.id === cat.productId);
            return (
              <div
                key={cat.category}
                onClick={() => {
                  if (product) openPdp(product);
                  else openPlp(cat.category);
                }}
                className="group cursor-pointer text-left bg-[#FAF9F6] hover:bg-white border border-[#E5E5E5] hover:border-[#E85D5D] rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-md focus:outline-none flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#2D5A3D] uppercase tracking-wide">
                      {cat.step}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#2D5A3D]/10 text-[#2D5A3D]">
                      {cat.badge}
                    </span>
                  </div>

                  <div className="w-full aspect-[4/3] bg-white rounded-xl border border-[#E5E5E5] p-3 mb-3 flex items-center justify-center overflow-hidden group-hover:border-[#E85D5D]/40 transition-colors">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <h3 className="text-sm sm:text-base font-extrabold text-[#1A1A1A] group-hover:text-[#E85D5D] transition">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#6B6B6B] mt-0.5 leading-relaxed line-clamp-2">
                    {cat.tagline}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#E5E5E5] flex items-center justify-between gap-2">
                  <span className="text-[10px] sm:text-[11px] font-semibold text-[#2D5A3D] truncate">
                    {cat.highlights}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-[#E85D5D] shrink-0">
                    <span>View</span>
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

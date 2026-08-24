import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sun, Droplet, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { SkinConcern } from '../../types/marketplace';

export const ShopByConcern: React.FC = () => {
  const { openPlp, allProducts, openPdp } = useStore();

  const CONCERNS: {
    title: string;
    concern: SkinConcern;
    subtitle: string;
    icon: React.ReactNode;
    colorBg: string;
    recommendedStep: string;
    productId: string;
  }[] = [
    {
      title: 'Sun Protection & UV Shield',
      concern: 'Sun Damage & Tanning',
      subtitle: 'Broad-spectrum SPF 50+ PA++++ with zero visible white cast for everyday heat & humidity',
      icon: <Sun className="w-5 h-5 text-amber-500" />,
      colorBg: 'bg-amber-500/10 border-amber-500/20',
      recommendedStep: 'Ray Barrier Sunscreen SPF 50+',
      productId: 'cbs-sunscreen-01',
    },
    {
      title: 'Skin Barrier Strengthening',
      concern: 'Barrier Repair',
      subtitle: 'Ceramides, Panthenol and Niacinamide to restore compromised, dry or sensitized barriers',
      icon: <ShieldCheck className="w-5 h-5 text-[#2D5A3D]" />,
      colorBg: 'bg-[#2D5A3D]/10 border-[#2D5A3D]/20',
      recommendedStep: 'Hydrating Moisturizer',
      productId: 'cbs-moisturizer-01',
    },
    {
      title: 'Gentle Cleansing Without Dryness',
      concern: 'Dryness & Dehydration',
      subtitle: 'Mild amino acids, ceramides and aloe vera remove dirt, excess oil & sunscreen gently',
      icon: <Droplet className="w-5 h-5 text-blue-500" />,
      colorBg: 'bg-blue-500/10 border-blue-500/20',
      recommendedStep: 'Refreshing Skin Cleanser',
      productId: 'cbs-cleanser-01',
    },
  ];

  return (
    <section id="shop-by-concern-section" className="py-10 sm:py-14 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#2D5A3D]">
              Targeted Skin Solutions
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
              Formulated for Real Everyday Needs
            </h2>
          </div>
          <p className="text-xs text-[#6B6B6B] max-w-sm">
            Suitable for Normal, Dry, Combination, and Sensitive skin types across all Indian climates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CONCERNS.map((item) => {
            const product = allProducts.find((p) => p.id === item.productId);
            return (
              <div
                key={item.title}
                onClick={() => {
                  if (product) openPdp(product);
                  else openPlp(undefined, undefined, item.concern);
                }}
                className="group cursor-pointer bg-[#FAF9F6] hover:bg-white border border-[#E5E5E5] hover:border-[#E85D5D] rounded-2xl p-5 sm:p-6 transition-all duration-200 hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-4 ${item.colorBg} group-hover:scale-110 transition-transform`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-base font-bold text-[#1A1A1A] group-hover:text-[#E85D5D] transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6B6B6B] mt-1.5 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E5E5E5] space-y-2">
                  <div className="text-[11px]">
                    <span className="text-neutral-400">Hero Formula: </span>
                    <strong className="text-[#1A1A1A]">{item.recommendedStep}</strong>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold text-[#E85D5D]">
                    <span>View Product</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
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

import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sun, Droplets, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ProductCategory } from '../../types/marketplace';

export const BrandStoreGrid: React.FC = () => {
  const { openPlp, allProducts, openPdp } = useStore();

  const LAB_DIVISIONS: {
    category: ProductCategory;
    productId: string;
    name: string;
    step: string;
    tagline: string;
    description: string;
    heroIngredients: string[];
    features: string[];
    image: string;
    badge: string;
  }[] = [
    {
      category: 'Sunscreen',
      productId: 'cbs-sunscreen-01',
      step: 'Daily UV Shield',
      name: 'Ray Barrier Sunscreen SPF 50+',
      tagline: 'High Protection • Comfortable Everyday Wear',
      description:
        'A lightweight broad-spectrum sunscreen developed with modern UV filters to help protect skin against UVA and UVB rays. Designed for Indian heat and humidity with zero white cast.',
      heroIngredients: ['Modern UV Filters', 'Ceramide NP', 'Niacinamide', 'Panthenol', 'Ectoin', 'Centella Asiatica', 'Hyaluronic Acid'],
      features: ['Broad-Spectrum SPF 50+ PA++++', 'No Visible White Cast*', 'Daily Wear Comfort & Barrier Support'],
      image: '/images/care-ray-barrier-sunscreen.svg',
      badge: 'UV Barrier Pillar',
    },
    {
      category: 'Moisturizer',
      productId: 'cbs-moisturizer-01',
      step: 'Daily Barrier Support',
      name: 'Hydrating Moisturizer',
      tagline: 'Lightweight Hydration • Long-Lasting Comfort',
      description:
        'A daily moisturiser formulated to replenish moisture while supporting the skin’s natural barrier. Absorbs quickly without leaving a greasy finish, making it suitable for everyday use in all seasons.',
      heroIngredients: ['Ceramides', 'Niacinamide', 'Panthenol', 'Sodium PCA', 'Allantoin'],
      features: ['Deep Hydration & Barrier Strengthening', 'Lightweight, Non-Greasy Finish', 'Layers Comfortably Under Sunscreen'],
      image: '/images/care-hydrating-moisturizer.svg',
      badge: 'Hydration Pillar',
    },
    {
      category: 'Cleanser',
      productId: 'cbs-cleanser-01',
      step: 'Gentle Daily Cleansing',
      name: 'Refreshing Skin Cleanser',
      tagline: 'Clean Without Stripping • Respects Barrier',
      description:
        'A gentle daily cleanser that effectively removes dirt, excess oil and sunscreen while respecting the skin barrier. Powered by mild amino acid-based cleansing agents.',
      heroIngredients: ['Ceramides', 'Niacinamide', 'Panthenol', 'Aloe Vera'],
      features: ['Cleanses Without Dryness', 'Maintains Hydration & Barrier Integrity', 'Leaves Skin Soft and Comfortable'],
      image: '/images/care-refreshing-skin-cleanser.svg',
      badge: 'Purify Pillar',
    },
  ];

  return (
    <section id="clinical-pillars-section" className="py-10 sm:py-14 bg-[#FAF9F6] border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#2D5A3D]">
              Care Beauty Solution Formulation Science
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
              The 3 Pillars of Physiological Skin Health
            </h2>
          </div>
          <button
            onClick={() => openPlp()}
            className="text-xs font-bold text-[#E85D5D] hover:underline flex items-center gap-1"
          >
            <span>Explore All 3 Formulations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LAB_DIVISIONS.map((division) => {
            const product = allProducts.find((p) => p.id === division.productId);
            return (
              <div
                key={division.name}
                className="bg-white border border-[#E5E5E5] rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="badge-forest-green text-[10px] font-bold px-2 py-0.5">
                      {division.badge}
                    </span>
                    <span className="text-xs font-bold text-[#6B6B6B]">{division.step}</span>
                  </div>

                  <div className="w-full aspect-[4/3] bg-[#FAF9F6] rounded-xl border border-[#E5E5E5] p-4 mb-5 flex items-center justify-center overflow-hidden">
                    <img
                      src={division.image}
                      alt={division.name}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/care-official-gold-logo.svg';
                      }}
                    />
                  </div>

                  <h3 className="text-base font-bold text-[#1A1A1A] group-hover:text-[#E85D5D] transition">
                    {division.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#2D5A3D] mt-0.5">
                    {division.tagline}
                  </p>
                  <p className="text-xs text-[#6B6B6B] mt-2 leading-relaxed">
                    {division.description}
                  </p>

                  {/* Hero Ingredients */}
                  <div className="mt-4 pt-4 border-t border-[#E5E5E5]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B] mb-1.5">
                      Hero Ingredients:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {division.heroIngredients.map((ing) => (
                        <span
                          key={ing}
                          className="text-[10px] bg-[#FAF9F6] border border-[#E5E5E5] text-[#1A1A1A] px-2 py-0.5 rounded-md font-medium"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Benefits */}
                  <div className="mt-4 space-y-1.5">
                    {division.features.map((feature) => (
                      <div key={feature} className="flex items-start space-x-2 text-xs text-[#4A4A4A]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2D5A3D] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E5E5E5]">
                  <button
                    onClick={() => {
                      if (product) openPdp(product);
                      else openPlp(division.category);
                    }}
                    className="w-full btn-outline-forest text-xs font-bold py-2.5 rounded-xl flex items-center justify-center space-x-1.5 group-hover:bg-[#2D5A3D] group-hover:text-white transition"
                  >
                    <span>View Formulation Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

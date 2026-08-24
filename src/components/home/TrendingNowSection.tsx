import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCardMarketplace } from '../product/ProductCardMarketplace';
import { TrendingUp, ArrowRight } from 'lucide-react';

export const TrendingNowSection: React.FC = () => {
  const { allProducts, openPlp } = useStore();

  const trendingProducts = allProducts.filter((p) => p.isTrending).slice(0, 4);

  return (
    <section id="trending-formulations-section" className="py-10 sm:py-14 bg-white border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#E85D5D] uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4" />
              <span>Trending in India</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
              Most Loved Daily Barrier Formulations
            </h2>
          </div>
          <button
            onClick={() => openPlp()}
            className="text-xs font-bold text-[#E85D5D] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {trendingProducts.map((prod) => (
            <ProductCardMarketplace key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
};

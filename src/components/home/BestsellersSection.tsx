import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCardMarketplace } from '../product/ProductCardMarketplace';
import { ArrowRight, Flame } from 'lucide-react';
import { ProductCategory } from '../../types/marketplace';

export const BestsellersSection: React.FC = () => {
  const { allProducts, openPlp } = useStore();
  const [activeTab, setActiveTab] = useState<'All' | ProductCategory>('All');

  const TABS: { label: string; value: 'All' | ProductCategory }[] = [
    { label: 'All 3 Products', value: 'All' },
    { label: 'Sunscreen (SPF 50+)', value: 'Sunscreen' },
    { label: 'Hydrating Moisturizer', value: 'Moisturizer' },
    { label: 'Refreshing Cleanser', value: 'Cleanser' },
  ];

  const filteredProducts = allProducts
    .filter((p) => (activeTab === 'All' ? true : p.category === activeTab));

  return (
    <section id="bestsellers-section" className="py-10 sm:py-14 bg-[#FAF9F6] border-b border-[#E5E5E5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#E85D5D] uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 fill-[#E85D5D]" />
              <span>Dermatologist Formulated</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
              Flagship Daily Skincare Essentials
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {TABS.map((tab) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(tab.value)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition ${
                  activeTab === tab.value
                    ? 'bg-[#1A1A1A] text-white shadow-xs'
                    : 'bg-white border border-[#E5E5E5] text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-neutral-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {filteredProducts.map((prod) => (
            <ProductCardMarketplace key={prod.id} product={prod} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 text-center">
          <button
            onClick={() => openPlp(activeTab === 'All' ? undefined : activeTab)}
            className="inline-flex items-center gap-2 bg-white hover:bg-[#FAF9F6] text-[#1A1A1A] border border-[#E5E5E5] px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-xs hover:border-[#E85D5D]"
          >
            <span>Explore All Formulations</span>
            <ArrowRight className="w-4 h-4 text-[#E85D5D]" />
          </button>
        </div>
      </div>
    </section>
  );
};

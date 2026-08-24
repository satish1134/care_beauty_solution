import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Sun,
  Droplets,
  Sparkles,
  Layers,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { ProductCategory } from '../../types/marketplace';

export const MegaMenu: React.FC = () => {
  const { openPlp, filterCategory, allProducts, openPdp } = useStore();

  const NAV_ITEMS: {
    label: string;
    category?: ProductCategory;
    productId?: string;
    icon: React.ReactNode;
    badge?: string;
    description: string;
  }[] = [
    {
      label: 'All 3 Products',
      category: undefined,
      icon: <Layers className="w-3.5 h-3.5" />,
      description: 'Explore the 3 dermatologist-formulated daily essentials',
    },
    {
      label: 'Ray Barrier Sunscreen',
      category: 'Sunscreen',
      productId: 'cbs-sunscreen-01',
      icon: <Sun className="w-3.5 h-3.5 text-amber-500" />,
      badge: 'SPF 50+ PA++++',
      description: 'Modern UV filters with zero visible white cast',
    },
    {
      label: 'Hydrating Moisturizer',
      category: 'Moisturizer',
      productId: 'cbs-moisturizer-01',
      icon: <Sparkles className="w-3.5 h-3.5 text-emerald-500" />,
      badge: 'Ceramides + Panthenol',
      description: 'Lightweight hydration with long-lasting comfort',
    },
    {
      label: 'Refreshing Skin Cleanser',
      category: 'Cleanser',
      productId: 'cbs-cleanser-01',
      icon: <Droplets className="w-3.5 h-3.5 text-blue-500" />,
      badge: 'Amino Acid Gentle',
      description: 'Clean without stripping natural barrier',
    },
  ];

  return (
    <nav
      id="desktop-primary-mega-menu"
      className="bg-white border-b border-[#E5E5E5] sticky top-16 z-30 hidden md:block shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Main Category Links */}
          <div className="flex items-center space-x-1 lg:space-x-2">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.category === undefined
                  ? filterCategory === 'All'
                  : filterCategory === item.category;

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.productId) {
                      const prod = allProducts.find((p) => p.id === item.productId);
                      if (prod) openPdp(prod);
                      else openPlp(item.category);
                    } else {
                      openPlp(item.category);
                    }
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition duration-150 ${
                    isActive
                      ? 'bg-[#E85D5D]/10 text-[#E85D5D] border border-[#E85D5D]/20'
                      : 'text-[#1A1A1A] hover:bg-[#FAF9F6] hover:text-[#E85D5D]'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider bg-[#FAF9F6] text-[#2D5A3D] border border-[#2D5A3D]/20"
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Trust Perks */}
          <div className="flex items-center space-x-4 text-xs font-semibold text-[#2D5A3D]">
            <div className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A3D]" />
              <span className="text-[11px]">Dermatologist Tested Formulations</span>
            </div>
            <span className="text-neutral-300">•</span>
            <button
              onClick={() => openPlp()}
              className="text-[11px] text-[#E85D5D] hover:underline font-bold flex items-center gap-1"
            >
              <span>View Catalog</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

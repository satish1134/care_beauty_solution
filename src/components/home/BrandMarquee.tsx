import React from 'react';
import { ShieldCheck, Award, Sparkles, CheckCircle, Leaf, Sun, Droplets } from 'lucide-react';

export const BrandMarquee: React.FC = () => {
  const BADGES = [
    { label: 'Dermatologist Tested & Approved', icon: <ShieldCheck className="w-4 h-4 text-[#2D5A3D]" /> },
    { label: 'Broad Spectrum SPF 50+ PA++++', icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { label: 'pH 5.5 Acid Mantle Balanced', icon: <Droplets className="w-4 h-4 text-blue-500" /> },
    { label: '3x Bio-Identical Ceramides', icon: <Sparkles className="w-4 h-4 text-emerald-600" /> },
    { label: '100% Zero White Cast', icon: <CheckCircle className="w-4 h-4 text-[#E85D5D]" /> },
    { label: 'Sulfate & Fragrance Free', icon: <Leaf className="w-4 h-4 text-green-600" /> },
    { label: 'Non-Comedogenic', icon: <Award className="w-4 h-4 text-amber-600" /> },
    { label: '72-Hour Moisture Lock', icon: <Sparkles className="w-4 h-4 text-blue-600" /> },
  ];

  return (
    <div id="clinical-certifications-marquee" className="bg-white border-b border-[#E5E5E5] py-3.5 sm:py-4 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:flex md:items-center md:justify-between gap-3 sm:gap-6">
          {BADGES.slice(0, 4).map((badge, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[#1A1A1A]">
              <div className="p-1 rounded-md bg-[#FAF9F6] border border-[#E5E5E5] shrink-0">
                {badge.icon}
              </div>
              <span className="leading-tight">{badge.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Sparkles, ShieldCheck, Truck, Award, CheckCircle2 } from 'lucide-react';

export const Banner: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-900 text-emerald-50 py-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-800">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-900/80 border border-emerald-700/70 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Clinical Skincare Engineered For Indian Skin</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight leading-tight text-emerald-50">
            Dermatologist-Formulated <br />
            <span className="bg-gradient-to-r from-amber-300 via-emerald-200 to-teal-300 bg-clip-text text-transparent">
              Barrier Repair & Sun Protection
            </span>
          </h1>

          <p className="text-emerald-200 text-base sm:text-lg max-w-2xl leading-relaxed">
            Experience high-potency active formulations powered by Ceramides, Hyaluronic Acid, and Photostable UV Filters. Designed to combat humidity, UV radiation, and urban pollution.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-emerald-200">
            <div className="flex items-center gap-1.5 bg-emerald-900/60 px-3 py-1.5 rounded-lg border border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>0% Artificial Fragrances</span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-900/60 px-3 py-1.5 rounded-lg border border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>PA++++ Broad Spectrum</span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-900/60 px-3 py-1.5 rounded-lg border border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>ISO & GMP Certified Lab</span>
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          <div className="bg-emerald-900/50 backdrop-blur border border-emerald-800/80 p-4 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-8 h-8 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-emerald-100">100% Authentic Guarantee</h4>
              <p className="text-xs text-emerald-300/80 mt-0.5">Sourced directly from our clinical lab facility in Bengaluru.</p>
            </div>
          </div>

          <div className="bg-emerald-900/50 backdrop-blur border border-emerald-800/80 p-4 rounded-xl flex items-start gap-3">
            <Truck className="w-8 h-8 text-teal-300 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-emerald-100">Express Delivery in India</h4>
              <p className="text-xs text-emerald-300/80 mt-0.5">Free shipping over ₹499. Dispatched within 24 hours.</p>
            </div>
          </div>

          <div className="bg-emerald-900/50 backdrop-blur border border-emerald-800/80 p-4 rounded-xl flex items-start gap-3">
            <Award className="w-8 h-8 text-amber-300 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-emerald-100">Dermat Recommended</h4>
              <p className="text-xs text-emerald-300/80 mt-0.5">Over 50,000+ satisfied customers across India.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

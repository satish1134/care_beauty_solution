import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../common/BrandLogo';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Mail,
  ArrowRight,
  Sun,
  Droplets,
  Sparkles,
  Zap,
} from 'lucide-react';

export const FooterMarketplace: React.FC = () => {
  const { openPlp, showToast } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      showToast('Thank you for subscribing! Your 20% welcome coupon is CARENEW.', 'success');
      setNewsletterEmail('');
    }
  };

  return (
    <footer id="global-marketplace-footer" className="bg-[#1A1A1A] text-white pt-12 pb-24 md:pb-12 border-t border-neutral-800">
      {/* 1. Value Props Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-neutral-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-[#E85D5D] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Dermatologist Verified</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Certified physiological barrier formulations
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-[#2D5A3D] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Free Express Delivery</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                On all prepaid &amp; COD orders above ₹499
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-amber-500 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">7-Day Return Guarantee</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Hassle-free replacement for sealed items
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-blue-400 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">24/7 Expert Skin Help</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Call +91 8000-CARE-BEAUTY (Toll Free)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <BrandLogo variant="footer" heightClass="h-10" />
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Nature Distilled Skincare &amp; Clinical Aesthetics. Engineered with 3x Bio-Identical Ceramides, Colloidal Oat, and Hybrid SPF 50+ Solar Filters to restore physiological skin health without compromise.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="pt-2 max-w-sm">
              <label className="text-xs font-bold text-white block mb-1.5">
                Join Care Skin Club for 20% OFF
              </label>
              <div className="flex">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="bg-neutral-800 border border-neutral-700 text-xs px-3 py-2.5 rounded-l-lg text-white placeholder-neutral-500 flex-1 focus:outline-none focus:border-[#E85D5D]"
                />
                <button
                  type="submit"
                  className="btn-primary-coral text-xs font-bold px-4 rounded-r-lg"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Shop Essentials */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              The 3 Essentials
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => openPlp('Sunscreen')}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Ray Barrier Sunscreen (SPF 50+)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPlp('Moisturizer')}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Hydrating Moisturizer (Ceramides)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPlp('Cleanser')}
                  className="hover:text-white transition flex items-center gap-1.5"
                >
                  <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  <span>Refreshing Skin Cleanser</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPlp()}
                  className="text-[#E85D5D] hover:underline font-bold flex items-center gap-1.5"
                >
                  <span>View All 3 Formulations</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Shop by Concern */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Shop by Concern
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => openPlp(undefined, undefined, 'Sun Damage & Tanning')}
                  className="hover:text-white transition"
                >
                  Sun Protection &amp; UV Shield
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPlp(undefined, undefined, 'Barrier Repair')}
                  className="hover:text-white transition"
                >
                  Compromised Skin Barrier
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPlp(undefined, undefined, 'Dryness & Dehydration')}
                  className="hover:text-white transition"
                >
                  Dryness &amp; Dehydration
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPlp(undefined, undefined, 'Oil & Pore Control')}
                  className="hover:text-white transition"
                >
                  Oil &amp; Pore Control
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPlp(undefined, undefined, 'Sensitive & Redness')}
                  className="hover:text-white transition"
                >
                  Sensitive Skin &amp; Redness
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & Compliance */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <span className="text-white block font-semibold">Toll-Free Helpline:</span>
                <span className="text-neutral-400">1800-267-CARE</span>
              </li>
              <li>
                <span className="text-white block font-semibold">Email:</span>
                <span className="text-neutral-400">support@carebeautysolution.com</span>
              </li>
              <li>
                <span className="text-white block font-semibold">Hours:</span>
                <span className="text-neutral-400">Mon - Sat: 9 AM - 8 PM IST</span>
              </li>
              <li className="pt-2 text-[11px] text-[#2D5A3D] font-bold">
                ✓ 100% Secure SSL Checkout
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Copyright & Legal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
        <p>© 2026 Care Beauty Solution (India) Pvt. Ltd. All Rights Reserved.</p>
        <p className="text-[11px]">
          Sunscreens • Cleansers • Moisturizers • Essential Routine Bundles
        </p>
      </div>
    </footer>
  );
};

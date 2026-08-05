import React from 'react';
import { ShieldCheck, Sparkles, Phone, Mail, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-800 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
        {/* Brand Column */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-emerald-950 font-bold text-xl shadow-inner">
              C
            </div>
            <div>
              <span className="text-2xl font-serif font-bold tracking-tight text-white">Care Beauty</span>
              <span className="block text-[10px] uppercase tracking-widest text-emerald-300 font-semibold -mt-1">
                www.carebeautysolution.com
              </span>
            </div>
          </div>

          <p className="text-xs text-emerald-200/80 leading-relaxed max-w-sm">
            Care Beauty Solution is a dermatologist-formulated clinical skincare brand dedicated to repairing skin barrier health, protecting against UV radiation, and targeted active skincare solutions.
          </p>

          <div className="flex items-center gap-3 text-xs text-amber-300 font-medium">
            <ShieldCheck className="w-4 h-4" /> ISO 9001:2026 Certified & Paraben-Free
          </div>
        </div>

        {/* Categories Column */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="font-serif font-bold text-white text-sm">Product Formulations</h4>
          <ul className="space-y-2 text-xs text-emerald-300">
            <li><a href="#" className="hover:text-amber-300 transition">Hydrating Moisturizers (Ceramides)</a></li>
            <li><a href="#" className="hover:text-amber-300 transition">Ray Barrier Sunscreen (SPF 50+ PA++++)</a></li>
            <li><a href="#" className="hover:text-amber-300 transition">Refreshing Skin Cleansers (Salicylic)</a></li>
            <li><a href="#" className="hover:text-amber-300 transition">Niacinamide & Vitamin C Serums</a></li>
          </ul>
        </div>

        {/* Customer Care Column */}
        <div className="md:col-span-5 space-y-3">
          <h4 className="font-serif font-bold text-white text-sm">Customer Support & Inquiries (India)</h4>
          <div className="space-y-2 text-xs text-emerald-200">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-300" />
              <span>Helpline: +91 (080) 4829-1000 (Mon - Sat, 9 AM - 7 PM IST)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-300" />
              <span>Email: support@carebeautysolution.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-300" />
              <span>Clinical Lab HQ: Indiranagar 100ft Road, Bengaluru, Karnataka - 560038</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-emerald-900 flex flex-col sm:flex-row justify-between items-center text-[11px] text-emerald-400 gap-3">
        <div className="flex items-center gap-3">
          <span>© {new Date().getFullYear()} Care Beauty Solution Pvt. Ltd. All rights reserved.</span>
          <span>•</span>
          <a href="/admin" className="text-emerald-500 hover:text-amber-300 transition underline">
            Staff Portal
          </a>
          <span>•</span>
          <a href="/api/docs" target="_blank" rel="noreferrer" className="text-emerald-500 hover:text-amber-300 transition underline">
            OpenAPI Specs
          </a>
        </div>
        <div className="flex items-center gap-1 text-emerald-300">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 fill-red-400 text-red-400 inline" />
          <span>for Healthy Skin in India</span>
        </div>
      </div>
    </footer>
  );
};

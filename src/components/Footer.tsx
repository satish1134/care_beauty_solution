import React from 'react';
import { ShieldCheck, Sparkles, Phone, Mail, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-200 border-t border-slate-900 pt-16 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 mb-10">
        {/* Brand Column */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-[2px] shadow-[0_4px_16px_rgba(217,119,6,0.3)] flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <span className="font-serif font-black text-amber-400 text-2xl -mt-0.5">c</span>
              </div>
            </div>
            <div>
              <span className="text-2xl font-serif font-black tracking-tight text-white">CARe</span>
              <span className="block text-[9.5px] uppercase tracking-[0.22em] text-amber-400 font-extrabold -mt-1 flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5 text-amber-400" /> A BEAUTY SOLUTION
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-normal">
            Care Beauty Solution is a dermatologist-formulated clinical skincare brand dedicated to repairing skin barrier health, protecting against UV radiation, and providing targeted active skincare solutions.
          </p>

          <div className="flex items-center gap-3 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> ISO 9001:2026 Certified & Paraben-Free
          </div>
        </div>

        {/* Categories Column */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="font-serif font-bold text-white text-sm tracking-wide">Product Formulations</h4>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li><a href="#" className="hover:text-emerald-400 transition">Hydrating Moisturizers (Ceramides)</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition">Ray Barrier Sunscreen (SPF 50+ PA++++)</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition">Refreshing Skin Cleansers (Salicylic)</a></li>
            <li><a href="#" className="hover:text-emerald-400 transition">Niacinamide & Vitamin C Serums</a></li>
          </ul>
        </div>

        {/* Customer Care & Newsletter Column */}
        <div className="md:col-span-5 space-y-4">
          <h4 className="font-serif font-bold text-white text-sm tracking-wide">Customer Support & Inquiries (India)</h4>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Helpline: +91 (080) 4829-1000 (Mon - Sat, 9 AM - 7 PM IST)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Email: support@carebeautysolution.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Clinical Lab HQ: Indiranagar 100ft Road, Bengaluru, Karnataka - 560038</span>
            </div>
          </div>

          {/* Newsletter Signup Form */}
          <div className="pt-2">
            <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Subscribe for ₹100 Off Voucher</h5>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const emailInput = form.querySelector('input') as HTMLInputElement;
                if (!emailInput || !emailInput.value) return;

                try {
                  const res = await fetch('/api/newsletter/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: emailInput.value, source: 'Footer Signup' }),
                  });
                  const data = await res.json();
                  alert(data.message || 'Subscribed successfully!');
                  emailInput.value = '';
                } catch (err) {
                  alert('Subscription failed. Please try again.');
                }
              }}
              className="flex items-center gap-2"
            >
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-full"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl transition-all shrink-0 shadow-glow-emerald cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center text-[11px] text-stone-500 gap-3">
        <div>
          © {new Date().getFullYear()} Care Beauty Solution Pvt. Ltd. All rights reserved.
        </div>
        <div className="flex items-center gap-1 text-stone-400">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500 inline" />
          <span>for Healthy Skin in India</span>
        </div>
      </div>
    </footer>
  );
};


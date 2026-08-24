import React, { useState } from 'react';
import { Truck, Smartphone, HelpCircle, ShieldCheck, X, QrCode, CheckCircle2, Star } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../common/BrandLogo';

export const TopStrip: React.FC = () => {
  const { openPlp, showToast } = useStore();
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [phoneForApp, setPhoneForApp] = useState('');
  const [smsSent, setSmsSent] = useState(false);

  const handleSendAppDownloadLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneForApp.length >= 10) {
      setSmsSent(true);
      showToast(`App download link sent via SMS to +91 ${phoneForApp}`, 'success');
      setTimeout(() => {
        setSmsSent(false);
        setIsAppModalOpen(false);
      }, 2500);
    }
  };

  return (
    <>
      <div id="top-notification-strip" className="bg-[#1A1A1A] text-neutral-300 text-xs py-2 px-4 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left message with free shipping callout */}
          <div className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 text-[#E85D5D]" />
            <span>
              <strong className="text-white font-semibold">FREE Express Shipping</strong> on all orders above ₹499
            </span>
            <span className="hidden md:inline text-neutral-500">|</span>
            <button
              onClick={() => openPlp()}
              className="hidden md:inline-block text-[#E85D5D] hover:underline font-medium"
            >
              Use code: <strong>CARE15</strong> for 15% OFF
            </button>
          </div>

          {/* Right quick utility links */}
          <div className="flex items-center gap-4 text-neutral-400">
            <div className="hidden sm:flex items-center gap-1.5 hover:text-white transition cursor-pointer">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A3D]" />
              <span>100% Authentic Products</span>
            </div>
            <button
              onClick={() => setIsAppModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 hover:text-white transition cursor-pointer text-left focus:outline-none"
            >
              <Smartphone className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hover:text-[#E85D5D] transition">Download CBS App</span>
            </button>
            <a
              href="mailto:support@carebeautysolution.com"
              className="flex items-center gap-1.5 hover:text-white transition cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
              <span>Help Center</span>
            </a>
          </div>
        </div>
      </div>

      {/* Download App Modal */}
      {isAppModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsAppModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAppModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-5">
              <div className="flex justify-center mb-3">
                <BrandLogo variant="header" heightClass="h-10" />
              </div>
              <h3 className="text-lg font-black text-[#1A1A1A]">
                Care Beauty Solution Official App
              </h3>
              <p className="text-xs text-[#6B6B6B] mt-1">
                Fast 1-click checkout, live order tracking & exclusive in-app offers
              </p>
            </div>

            <div className="bg-[#FAF9F6] border border-[#E5E5E5] rounded-xl p-4 mb-5 flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-lg border border-[#E5E5E5] p-1.5 flex flex-col items-center justify-center shrink-0">
                <QrCode className="w-12 h-12 text-[#1A1A1A]" />
                <span className="text-[9px] font-bold text-[#2D5A3D] mt-0.5">SCAN TO GET APP</span>
              </div>
              <div className="space-y-1 text-xs text-[#4A4A4A]">
                <div className="flex items-center gap-1 font-bold text-[#1A1A1A]">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>4.9 / 5.0 Rating on iOS & Android</span>
                </div>
                <p className="text-[11px] text-[#6B6B6B]">
                  Point your smartphone camera at the QR code to install instantly.
                </p>
              </div>
            </div>

            <form onSubmit={handleSendAppDownloadLink} className="space-y-3">
              <label className="text-xs font-bold text-[#1A1A1A] block">
                Or get download link via SMS:
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-xs text-neutral-500 font-semibold">+91</span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phoneForApp}
                    onChange={(e) => setPhoneForApp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit mobile"
                    className="w-full pl-12 pr-3 py-2 text-xs border border-[#E5E5E5] rounded-xl focus:outline-none focus:border-[#E85D5D]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={smsSent}
                  className="btn-primary-coral text-xs font-bold px-4 py-2 whitespace-nowrap shadow-xs"
                >
                  {smsSent ? 'Link Sent!' : 'Send Link'}
                </button>
              </div>
            </form>

            <div className="mt-4 pt-4 border-t border-[#E5E5E5] flex items-center justify-center gap-4 text-[11px] text-[#2D5A3D] font-semibold">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>iOS App Store</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Google Play Store</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


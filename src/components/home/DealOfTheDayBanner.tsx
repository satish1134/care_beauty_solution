import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Clock, Zap, ArrowRight, Check, Copy } from 'lucide-react';

export const DealOfTheDayBanner: React.FC = () => {
  const { openPlp, showToast, allProducts, openPdp } = useStore();
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 19 });
  const [isCopied, setIsCopied] = useState(false);

  // Featured flagship product (Ray Barrier Sunscreen)
  const featuredProduct = allProducts[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('CARE15');
    setIsCopied(true);
    showToast('Promo code CARE15 copied! 15% OFF applied.', 'success');
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <section
      id="deal-of-the-day-banner"
      className="bg-[#1A1A1A] text-white py-4 sm:py-6 border-b border-[#E5E5E5] relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5 sm:gap-6">
          {/* Left Title & Timer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#E85D5D] flex items-center justify-center text-white shrink-0 shadow-xs">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-white animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#E5C378] block">
                  Special Launch Offer
                </span>
                <h3 className="text-xs sm:text-base font-black text-white leading-snug">
                  Flat 15% OFF + Free Express Shipping with CARE15
                </h3>
              </div>
            </div>

            {/* Live Countdown Clock */}
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 text-[11px] sm:text-xs font-mono shrink-0">
              <Clock className="w-3.5 h-3.5 text-[#E85D5D]" />
              <span className="hidden xs:inline">Ends in: </span>
              <span className="font-bold text-[#E5C378]">
                {String(timeLeft.hours).padStart(2, '0')}h :{' '}
                {String(timeLeft.minutes).padStart(2, '0')}m :{' '}
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>

          {/* Right Coupon & Action Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center justify-between sm:justify-start border border-dashed border-[#E5C378] rounded-lg px-3 py-1.5 bg-black/40 text-xs">
              <div className="flex items-center">
                <span className="text-neutral-400 mr-2 text-[11px]">Use Code:</span>
                <span className="font-bold font-mono text-[#E5C378] tracking-wider mr-2">CARE15</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="text-[11px] text-[#E85D5D] hover:text-white transition flex items-center gap-1 font-semibold"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <button
              onClick={() => {
                if (featuredProduct) openPdp(featuredProduct);
                else openPlp();
              }}
              className="btn-primary-coral text-xs font-bold px-4 py-2 flex items-center justify-center gap-1.5 shadow-xs w-full sm:w-auto"
            >
              <span>Shop Formulations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

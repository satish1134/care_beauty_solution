import React, { useState, useEffect } from 'react';
import { Shield, Cookie, Check, X, Lock } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('care_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = (type: 'all' | 'essential') => {
    localStorage.setItem('care_cookie_consent', JSON.stringify({ type, timestamp: new Date().toISOString() }));
    setIsVisible(false);
  };

  return (
    <>
      {isVisible && (
        <aside
          aria-label="Cookie & Privacy Notice"
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 bg-slate-950 text-slate-100 p-5 rounded-2xl border border-amber-500/40 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom duration-500"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-serif font-black tracking-wide text-amber-300 uppercase">
                Privacy &amp; Cookie Compliance
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                CARe uses essential cookies and anonymous analytics to ensure secure checkout, retain your skincare bag, and deliver clinical recommendations under GDPR &amp; DPDP compliance.
              </p>
              
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleAccept('all')}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Accept All
                </button>
                <button
                  onClick={() => handleAccept('essential')}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
                >
                  Essential Only
                </button>
                <button
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-xs text-amber-400 hover:underline px-2 py-1 cursor-pointer"
                >
                  Privacy Policy
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-black text-slate-950">CARe Privacy &amp; Data Policy</h3>
                  <p className="text-xs text-slate-500">Updated August 2026 • DPDP India &amp; GDPR Compliant</p>
                </div>
              </div>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <section>
                <h4 className="font-bold text-sm text-slate-900 mb-1">1. Information We Collect</h4>
                <p>
                  When you browse, register, or order from CARe A BEAUTY SOLUTION, we collect phone numbers for OTP verification, delivery addresses, and cart preferences to fulfill your dermatological skincare orders.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-sm text-slate-900 mb-1">2. Payment &amp; Security</h4>
                <p>
                  All transactions (Razorpay, UPI, Credit Cards, COD) are encrypted with 256-bit SSL encryption. We never store raw debit/credit card numbers or CVVs on our servers.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-sm text-slate-900 mb-1">3. Cookie &amp; Analytics Usage</h4>
                <p>
                  We utilize first-party session cookies to persist items in your shopping bag and Google Analytics 4 to evaluate performance bottlenecks. No private medical or diagnostic information is sold to third parties.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-sm text-slate-900 mb-1">4. Contact Grievance Officer</h4>
                <p>
                  For data removal requests or privacy inquiries, contact support@carebeautysolution.com or visit Indiranagar 100ft Road, Bengaluru, Karnataka 560038.
                </p>
              </section>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => {
                  setShowPrivacyModal(false);
                  handleAccept('all');
                }}
                className="px-6 py-2.5 bg-slate-950 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition"
              >
                I Understand &amp; Agree
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

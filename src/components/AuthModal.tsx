import React, { useState } from 'react';
import { X, Smartphone, KeyRound, ShieldCheck, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (phone: string, name?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      setIsLoading(false);
      if (data.success) {
        setStep('OTP');
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setIsLoading(false);
      setError('Network error');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, name }),
      });
      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        onLoginSuccess(phone, name);
        onClose();
      } else {
        setError(data.message || 'Invalid OTP code');
      }
    } catch (err: any) {
      setIsLoading(false);
      setError('Verification failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-emerald-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-emerald-100 space-y-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-900 mx-auto font-bold">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-slate-900">Care Beauty Account Login</h3>
          <p className="text-xs text-slate-500">Sign in with mobile OTP to track orders & earn rewards</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-xs p-2.5 rounded-xl font-medium">{error}</div>}

        {step === 'PHONE' ? (
          <form onSubmit={handleSendOtp} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-600">Full Name (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Radhika Sharma"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl p-2.5 mt-1"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Mobile Number *</label>
              <div className="flex gap-2 mt-1">
                <span className="bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 flex items-center">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="flex-1 text-xs border border-slate-300 rounded-xl p-2.5 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>{isLoading ? 'Sending Code...' : 'Send OTP Code'}</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-600">Enter 6-Digit OTP Code *</label>
              <p className="text-[11px] text-slate-400">Code sent to +91 {phone} (Test OTP: <span className="font-bold text-emerald-900">123456</span>)</p>
              <input
                type="text"
                required
                placeholder="123456"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                maxLength={6}
                className="w-full text-center tracking-widest text-lg font-mono border border-slate-300 rounded-xl p-2.5 mt-1 text-slate-900 font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs py-3 rounded-xl shadow-md"
            >
              {isLoading ? 'Verifying...' : 'Verify OTP & Login'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

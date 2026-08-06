import React, { useState } from 'react';
import { X, Smartphone, Mail, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { safeFetchApi } from '../utils/apiHelper';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { id: string; phone?: string; email?: string; fullName: string; accessToken: string; refreshToken: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  if (!isOpen) return null;

  const [authMethod, setAuthMethod] = useState<'OTP' | 'EMAIL'>('OTP');
  const [emailMode, setEmailMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // OTP State
  const [otpStep, setOtpStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpName, setOtpName] = useState('');

  // Email State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setError(null);

    const apiRes = await safeFetchApi('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });

    setIsLoading(false);
    if (apiRes.data && apiRes.data.success) {
      setOtpStep('OTP');
    } else {
      // Client-side fallback for Vercel demo
      setOtpStep('OTP');
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const apiRes = await safeFetchApi('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp, name: otpName }),
    });

    setIsLoading(false);

    if (apiRes.data && apiRes.data.success) {
      localStorage.setItem('care_access_token', apiRes.data.accessToken);
      localStorage.setItem('care_refresh_token', apiRes.data.refreshToken);
      localStorage.setItem('care_user_phone', apiRes.data.user.phone);
      localStorage.setItem('care_user_name', apiRes.data.user.fullName);
      onLoginSuccess({
        id: apiRes.data.user.id,
        phone: apiRes.data.user.phone,
        fullName: apiRes.data.user.fullName,
        accessToken: apiRes.data.accessToken,
        refreshToken: apiRes.data.refreshToken,
      });
      onClose();
    } else {
      // Client-side fallback for Vercel demo
      const mockToken = `token_mock_${Date.now()}`;
      const mockUser = {
        id: `usr_${Date.now()}`,
        phone,
        fullName: otpName || 'Ananya Sharma',
        accessToken: mockToken,
        refreshToken: `ref_${mockToken}`,
      };
      localStorage.setItem('care_access_token', mockToken);
      localStorage.setItem('care_user_phone', phone);
      localStorage.setItem('care_user_name', mockUser.fullName);
      onLoginSuccess(mockUser);
      onClose();
    }
  };

  // Email Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const apiRes = await safeFetchApi('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setIsLoading(false);

    if (apiRes.data && apiRes.data.success) {
      localStorage.setItem('care_access_token', apiRes.data.accessToken);
      localStorage.setItem('care_refresh_token', apiRes.data.refreshToken);
      localStorage.setItem('care_user_email', apiRes.data.user.email);
      localStorage.setItem('care_user_name', apiRes.data.user.fullName);
      onLoginSuccess({
        id: apiRes.data.user.id,
        email: apiRes.data.user.email,
        fullName: apiRes.data.user.fullName,
        accessToken: apiRes.data.accessToken,
        refreshToken: apiRes.data.refreshToken,
      });
      onClose();
    } else {
      // Client-side fallback for Vercel demo
      const mockToken = `token_mock_${Date.now()}`;
      const mockUser = {
        id: `usr_${Date.now()}`,
        email: email || 'ananya.sharma@example.com',
        fullName: 'Ananya Sharma',
        accessToken: mockToken,
        refreshToken: `ref_${mockToken}`,
      };
      localStorage.setItem('care_access_token', mockToken);
      localStorage.setItem('care_user_email', mockUser.email);
      localStorage.setItem('care_user_name', mockUser.fullName);
      onLoginSuccess(mockUser);
      onClose();
    }
  };

  // Email Register
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const apiRes = await safeFetchApi('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName, phone }),
    });

    setIsLoading(false);

    if (apiRes.data && apiRes.data.success) {
      localStorage.setItem('care_access_token', apiRes.data.accessToken);
      localStorage.setItem('care_refresh_token', apiRes.data.refreshToken);
      localStorage.setItem('care_user_email', apiRes.data.user.email);
      localStorage.setItem('care_user_name', apiRes.data.user.fullName);
      onLoginSuccess({
        id: apiRes.data.user.id,
        email: apiRes.data.user.email,
        phone: apiRes.data.user.phone,
        fullName: apiRes.data.user.fullName,
        accessToken: apiRes.data.accessToken,
        refreshToken: apiRes.data.refreshToken,
      });
      onClose();
    } else {
      // Client-side fallback for Vercel demo
      const mockToken = `token_mock_${Date.now()}`;
      const mockUser = {
        id: `usr_${Date.now()}`,
        email: email || 'ananya.sharma@example.com',
        phone: phone || '9876543210',
        fullName: fullName || 'Ananya Sharma',
        accessToken: mockToken,
        refreshToken: `ref_${mockToken}`,
      };
      localStorage.setItem('care_access_token', mockToken);
      localStorage.setItem('care_user_email', mockUser.email);
      localStorage.setItem('care_user_name', mockUser.fullName);
      onLoginSuccess(mockUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-emerald-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-emerald-100 space-y-4">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-900 mx-auto font-bold">
            {authMethod === 'OTP' ? <Smartphone className="w-6 h-6" /> : <Mail className="w-6 h-6" />}
          </div>
          <h3 className="font-serif font-bold text-xl text-slate-900">Care Beauty Account</h3>
          <p className="text-xs text-slate-500">Sign in to track orders, save delivery addresses & earn rewards</p>
        </div>

        {/* Auth Method Selector Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold text-slate-600">
          <button
            onClick={() => { setAuthMethod('OTP'); setError(null); }}
            className={`flex-1 py-2 rounded-xl transition ${authMethod === 'OTP' ? 'bg-white text-emerald-950 shadow-sm' : 'hover:text-slate-900'}`}
          >
            Mobile OTP
          </button>
          <button
            onClick={() => { setAuthMethod('EMAIL'); setError(null); }}
            className={`flex-1 py-2 rounded-xl transition ${authMethod === 'EMAIL' ? 'bg-white text-emerald-950 shadow-sm' : 'hover:text-slate-900'}`}
          >
            Email & Password
          </button>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-xs p-2.5 rounded-xl font-medium leading-relaxed">{error}</div>}

        {authMethod === 'OTP' ? (
          /* ================= MOBILE OTP FLOW ================= */
          otpStep === 'PHONE' ? (
            <form onSubmit={handleSendOtp} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600">Full Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Radhika Sharma"
                  value={otpName}
                  onChange={e => setOtpName(e.target.value)}
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
                <p className="text-[11px] text-slate-400 mt-0.5">Code sent to +91 {phone}</p>
                <input
                  type="text"
                  required
                  placeholder="123456"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full text-center tracking-widest text-lg font-mono border border-slate-300 rounded-xl p-2.5 mt-2 text-slate-900 font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs py-3 rounded-xl shadow-md"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP & Login'}
              </button>

              <button
                type="button"
                onClick={() => setOtpStep('PHONE')}
                className="w-full text-center text-[11px] text-slate-500 hover:text-slate-800 underline"
              >
                Change mobile number
              </button>
            </form>
          )
        ) : (
          /* ================= EMAIL & PASSWORD FLOW ================= */
          <div className="space-y-3">
            <div className="flex text-xs font-semibold border-b border-slate-200 pb-2">
              <button
                type="button"
                onClick={() => setEmailMode('LOGIN')}
                className={`flex-1 text-center py-1 ${emailMode === 'LOGIN' ? 'text-emerald-900 font-bold border-b-2 border-emerald-900' : 'text-slate-400'}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setEmailMode('REGISTER')}
                className={`flex-1 text-center py-1 ${emailMode === 'REGISTER' ? 'text-emerald-900 font-bold border-b-2 border-emerald-900' : 'text-slate-400'}`}
              >
                Create Account
              </button>
            </div>

            {emailMode === 'LOGIN' ? (
              <form onSubmit={handleEmailLogin} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="priya@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-xl p-2.5 mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-xl p-2.5 mt-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs py-3 rounded-xl shadow-md"
                >
                  {isLoading ? 'Signing In...' : 'Sign In with Email'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleEmailRegister} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Priya Sharma"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-xl p-2.5 mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="priya@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-xl p-2.5 mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600">Mobile Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-xl p-2.5 mt-1 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600">Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-xl p-2.5 mt-1"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-xs py-3 rounded-xl shadow-md"
                >
                  {isLoading ? 'Registering...' : 'Create Account'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

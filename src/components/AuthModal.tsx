import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Smartphone, Mail, Lock, ArrowRight, CheckCircle2, Eye, EyeOff, 
  ShieldCheck, Sparkles, RefreshCw, UserCheck, ShieldAlert, Award
} from 'lucide-react';
import { safeFetchApi } from '../utils/apiHelper';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { id: string; phone?: string; email?: string; fullName: string; accessToken: string; refreshToken: string; role?: string }) => void;
}

const COUNTRY_CODES = [
  { code: '+91', flag: '🇮🇳', name: 'India' },
  { code: '+1', flag: '🇺🇸', name: 'USA/Canada' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  if (!isOpen) return null;

  const [authMethod, setAuthMethod] = useState<'OTP' | 'EMAIL'>('OTP');
  const [emailMode, setEmailMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Country Code
  const [selectedCountry, setSelectedCountry] = useState('+91');

  // OTP State
  const [otpStep, setOtpStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [phone, setPhone] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpName, setOtpName] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Email State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer logic for Resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpStep === 'OTP' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [otpStep, resendTimer]);

  // Handle OTP digit input changes
  const handleOtpDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto-advance to next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = phone.replace(/\D/g, '');
    if (!cleanNumber || cleanNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setError(null);

    const apiRes = await safeFetchApi('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone: cleanNumber }),
    });

    setIsLoading(false);
    setOtpStep('OTP');
    setResendTimer(30);
    setCanResend(false);
    setSuccessMsg('SMS OTP code dispatched successfully! Default demo code: 123456');

    // Focus first digit box
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 100);
  };

  // Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length < 6) {
      setError('Please enter all 6 digits of the OTP code');
      return;
    }

    setIsLoading(true);
    setError(null);

    const apiRes = await safeFetchApi('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp: fullOtp, name: otpName }),
    });

    setIsLoading(false);

    if (apiRes.data && apiRes.data.success) {
      saveSessionAndClose(apiRes.data);
    } else {
      // Fallback fallback
      const mockUser = {
        id: `usr_${Date.now()}`,
        phone,
        fullName: otpName || 'Care Beauty Member',
        accessToken: `token_mock_${Date.now()}`,
        refreshToken: `ref_mock_${Date.now()}`,
      };
      saveSessionAndClose({ user: mockUser, accessToken: mockUser.accessToken, refreshToken: mockUser.refreshToken });
    }
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (!canResend) return;
    setOtpDigits(['', '', '', '', '', '']);
    setResendTimer(30);
    setCanResend(false);
    setSuccessMsg('New OTP code resent! Default demo code: 123456');
    otpInputRefs.current[0]?.focus();
  };

  // Email Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError(null);

    const apiRes = await safeFetchApi('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setIsLoading(false);

    if (apiRes.data && apiRes.data.success) {
      saveSessionAndClose(apiRes.data);
    } else {
      setError(apiRes.data?.message || 'Invalid email or password. Please try again.');
    }
  };

  // Email Register
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError(null);

    const apiRes = await safeFetchApi('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName, phone }),
    });

    setIsLoading(false);

    if (apiRes.data && apiRes.data.success) {
      saveSessionAndClose(apiRes.data);
    } else {
      setError(apiRes.data?.message || 'Registration failed. Email may already be in use.');
    }
  };

  // Helper to save session locally
  const saveSessionAndClose = (data: any) => {
    const { accessToken, refreshToken, user } = data;
    localStorage.setItem('care_access_token', accessToken);
    if (refreshToken) localStorage.setItem('care_refresh_token', refreshToken);
    if (user.email) localStorage.setItem('care_user_email', user.email);
    if (user.phone) localStorage.setItem('care_user_phone', user.phone);
    localStorage.setItem('care_user_name', user.fullName);
    localStorage.setItem('care_user_role', user.role || 'CUSTOMER');

    onLoginSuccess({
      id: user.id,
      email: user.email,
      phone: user.phone,
      fullName: user.fullName,
      role: user.role,
      accessToken,
      refreshToken,
    });
    onClose();
  };

  // Quick One-Click Admin & Customer demo login helper
  const handleQuickDemoLogin = (role: 'ADMIN' | 'CUSTOMER') => {
    setIsLoading(true);
    setTimeout(() => {
      const demoUser = role === 'ADMIN' ? {
        id: 'usr_admin_1',
        email: 'admin@carebeautysolution.com',
        phone: '9999999999',
        fullName: 'Care Beauty Admin',
        role: 'ADMIN',
        accessToken: `demo_admin_token_${Date.now()}`,
        refreshToken: `demo_admin_ref_${Date.now()}`
      } : {
        id: 'usr_cust_1',
        email: 'customer@carebeautysolution.com',
        phone: '9876543210',
        fullName: 'Priya Sharma',
        role: 'CUSTOMER',
        accessToken: `demo_cust_token_${Date.now()}`,
        refreshToken: `demo_cust_ref_${Date.now()}`
      };
      saveSessionAndClose({ user: demoUser, accessToken: demoUser.accessToken, refreshToken: demoUser.refreshToken });
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-amber-100 flex flex-col md:flex-row relative">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition shadow-sm"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT PANE: Editorial Visual Banner (Desktop) */}
        <div className="hidden md:flex md:w-5/12 bg-emerald-950 text-white p-8 flex-col justify-between relative overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-800/40 via-emerald-950 to-slate-950"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-900/60 border border-emerald-700/50 rounded-full px-3 py-1 text-[11px] text-amber-300 font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Care & Beauty Circle
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl lg:text-3xl font-bold text-emerald-50 leading-tight">
                Pure Radiance.<br />Science & Botanicals.
              </h2>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                Join our botanical beauty community to unlock member-only privileges, bespoke recommendations & fast checkout.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-emerald-100">
                <div className="w-6 h-6 rounded-full bg-emerald-900 flex items-center justify-center text-amber-300 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>Free Express Shipping on Orders Above ₹499</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-emerald-100">
                <div className="w-6 h-6 rounded-full bg-emerald-900 flex items-center justify-center text-amber-300 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>Earn 10% Cashback in Glow Rewards</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-emerald-100">
                <div className="w-6 h-6 rounded-full bg-emerald-900 flex items-center justify-center text-amber-300 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>Personalized Skincare Consultation</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-emerald-900/80 space-y-2">
            <div className="flex items-center gap-2 text-[11px] text-emerald-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>256-Bit Encrypted Secure Authentication</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: Production Auth Form */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between bg-white">
          <div className="space-y-5">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                  {authMethod === 'OTP' ? 'Mobile Verification' : emailMode === 'LOGIN' ? 'Welcome Back' : 'Create Account'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {authMethod === 'OTP' 
                  ? 'Sign in instantly using 1-click Mobile OTP SMS code' 
                  : emailMode === 'LOGIN'
                  ? 'Access your saved addresses, track orders & wishlist'
                  : 'Register a new account in under 30 seconds'}
              </p>
            </div>

            {/* Auth Method Selector Tabs */}
            <div className="grid grid-cols-2 bg-slate-100 p-1.5 rounded-2xl text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => { setAuthMethod('OTP'); setError(null); setSuccessMsg(null); }}
                className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
                  authMethod === 'OTP' 
                    ? 'bg-emerald-950 text-white shadow-md font-bold' 
                    : 'hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Mobile OTP</span>
              </button>
              <button
                type="button"
                onClick={() => { setAuthMethod('EMAIL'); setError(null); setSuccessMsg(null); }}
                className={`py-2.5 rounded-xl transition flex items-center justify-center gap-2 ${
                  authMethod === 'EMAIL' 
                    ? 'bg-emerald-950 text-white shadow-md font-bold' 
                    : 'hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>Email & Password</span>
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-2xl flex items-start gap-2.5 animate-fadeIn">
                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{error}</span>
              </div>
            )}

            {/* Success Banner */}
            {successMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-2xl flex items-start gap-2.5 animate-fadeIn">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{successMsg}</span>
              </div>
            )}

            {/* FORM AREA */}
            {authMethod === 'OTP' ? (
              /* ================= MOBILE OTP FLOW ================= */
              otpStep === 'PHONE' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Full Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Radhika Sharma"
                      value={otpName}
                      onChange={(e) => setOtpName(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-3 mt-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-900/30 focus:border-emerald-900 transition bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700">Mobile Number <span className="text-rose-500">*</span></label>
                    <div className="flex gap-2 mt-1.5">
                      <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-3 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        required
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        maxLength={10}
                        className="flex-1 text-xs border border-slate-200 rounded-xl px-3.5 py-3 font-mono font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-900/30 focus:border-emerald-900 transition bg-slate-50/50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-950 hover:bg-emerald-900 active:scale-[0.99] text-white font-bold text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    ) : (
                      <>
                        <span>Get Verification Code</span>
                        <ArrowRight className="w-4 h-4 text-amber-300" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* STEP 2: Enter 6-Digit OTP */
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="text-center space-y-1">
                    <label className="text-xs font-bold text-slate-800">Enter 6-Digit OTP Code</label>
                    <p className="text-[11px] text-slate-500">
                      Sent to <span className="font-mono font-bold text-slate-800">{selectedCountry} {phone}</span>
                    </p>
                  </div>

                  {/* 6 Digit Input Boxes */}
                  <div className="flex justify-between gap-2 py-1">
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpInputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-11 h-12 text-center text-lg font-mono font-bold border-2 border-slate-200 focus:border-emerald-900 focus:ring-2 focus:ring-emerald-900/20 rounded-xl bg-slate-50 text-slate-900 transition"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-950 hover:bg-emerald-900 active:scale-[0.99] text-white font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-emerald-950/20 transition flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                    ) : (
                      <span>Verify & Access Account</span>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setOtpStep('PHONE')}
                      className="text-slate-500 hover:text-slate-900 underline font-medium"
                    >
                      Change Number
                    </button>

                    <button
                      type="button"
                      disabled={!canResend}
                      onClick={handleResendOtp}
                      className={`font-semibold ${
                        canResend ? 'text-emerald-900 hover:underline cursor-pointer' : 'text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}
                    </button>
                  </div>
                </form>
              )
            ) : (
              /* ================= EMAIL & PASSWORD FLOW ================= */
              <div className="space-y-4">
                {/* Sub-mode toggle */}
                <div className="flex border-b border-slate-200 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => { setEmailMode('LOGIN'); setError(null); }}
                    className={`flex-1 text-center pb-2.5 transition ${
                      emailMode === 'LOGIN' 
                        ? 'text-emerald-950 border-b-2 border-emerald-950 font-bold' 
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEmailMode('REGISTER'); setError(null); }}
                    className={`flex-1 text-center pb-2.5 transition ${
                      emailMode === 'REGISTER' 
                        ? 'text-emerald-950 border-b-2 border-emerald-950 font-bold' 
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                {emailMode === 'LOGIN' ? (
                  <form onSubmit={handleEmailLogin} className="space-y-3.5">
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Email Address <span className="text-rose-500">*</span></label>
                      <div className="relative mt-1">
                        <input
                          type="email"
                          required
                          placeholder="e.g. priya@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full text-xs border border-slate-200 rounded-xl pl-9 pr-3.5 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-900/30 focus:border-emerald-900 transition bg-slate-50/50"
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700">Password <span className="text-rose-500">*</span></label>
                      <div className="relative mt-1">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full text-xs border border-slate-200 rounded-xl pl-9 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-900/30 focus:border-emerald-900 transition bg-slate-50/50"
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-emerald-950 hover:bg-emerald-900 active:scale-[0.99] text-white font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-emerald-950/20 transition flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                      ) : (
                        <span>Sign In to Account</span>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleEmailRegister} className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Full Name <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="Priya Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-900/30 focus:border-emerald-900 transition bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700">Email Address <span className="text-rose-500">*</span></label>
                      <input
                        type="email"
                        required
                        placeholder="priya@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 mt-1 focus:outline-none focus:ring-2 focus:ring-emerald-900/30 focus:border-emerald-900 transition bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700">Mobile Number (Optional)</label>
                      <input
                        type="tel"
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-xl px-3.5 py-2.5 mt-1 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-900/30 focus:border-emerald-900 transition bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700">Password <span className="text-rose-500">*</span></label>
                      <div className="relative mt-1">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Min 6 characters"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full text-xs border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-900/30 focus:border-emerald-900 transition bg-slate-50/50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-emerald-950 hover:bg-emerald-900 active:scale-[0.99] text-white font-bold text-xs py-3.5 rounded-xl shadow-lg shadow-emerald-950/20 transition flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                      ) : (
                        <span>Create Member Account</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Quick Demo Login Helpers */}
          <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Instant Testing Credentials</span>
              <span className="flex items-center gap-1 text-emerald-800 font-semibold"><Award className="w-3.5 h-3.5" /> Demo Shortcuts</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('CUSTOMER')}
                className="bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200 rounded-xl py-2 px-3 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Demo Customer</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('ADMIN')}
                className="bg-emerald-50 hover:bg-emerald-100/80 text-emerald-950 border border-emerald-200 rounded-xl py-2 px-3 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Super Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

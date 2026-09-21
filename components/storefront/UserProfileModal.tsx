'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  X,
  User,
  Package,
  MapPin,
  Sparkles,
  LogOut,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  Edit2,
  Trash2,
  Plus,
  ArrowRight,
  RefreshCw,
  Clock,
  Truck,
  Check,
  Building2,
  Home as HomeIcon,
  HelpCircle,
  FileText
} from 'lucide-react';
import { useCart, Address } from '@/lib/cart-context';

export default function UserProfileModal() {
  const {
    isProfileOpen,
    closeProfile,
    user,
    orders,
    loginUser,
    logoutUser,
    updateAddress,
    deleteAddress,
    setDefaultAddress
  } = useCart();

  // Navigation state when logged in
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'skin'>('orders');

  // Login / Signup modes: 'login' | 'signup' | 'otp'
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'otp'>('login');

  // Form states
  const [identifier, setIdentifier] = useState(''); // Mobile or Email
  const [signUpName, setSignUpName] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(30);
  const [isOtpActive, setIsOtpActive] = useState(false);
  const [authError, setAuthError] = useState('');

  // Profile edit states
  const [profileFirstName, setProfileFirstName] = useState('');
  const [profileLastName, setProfileLastName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileGender, setProfileGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [profileSavedNotice, setProfileSavedNotice] = useState(false);

  // Address add / edit state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<Address>({
    id: '',
    fullName: '',
    phone: '',
    street: '',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122001',
    type: 'HOME',
    landmark: '',
    alternatePhone: '',
    isDefault: false
  });

  // Track invoice / order help toast
  const [orderNotice, setOrderNotice] = useState<string | null>(null);

  // Initialize profile form when user changes
  useEffect(() => {
    if (user) {
      const parts = (user.name || '').split(' ');
      setProfileFirstName(parts[0] || '');
      setProfileLastName(parts.slice(1).join(' ') || '');
      setProfileEmail(user.email || '');
      setProfilePhone(user.phone || '');
      setProfileGender(user.gender || 'Male');
    }
  }, [user]);

  // OTP Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOtpActive && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpActive, otpTimer]);

  if (!isProfileOpen) return null;

  // Handle Request OTP / Continue from Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const cleanId = identifier.trim();
    if (!cleanId) {
      setAuthError('Please enter a valid Mobile number or Email address.');
      return;
    }

    // Auto switch to OTP screen
    setAuthMode('otp');
    setIsOtpActive(true);
    setOtpTimer(30);
    setOtpDigits(['5', '8', '2', '4', '9', '1']); // Pre-fill sample OTP for instant friction-free testing
  };

  // Handle Sign Up Continue
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!signUpName.trim() || !signUpPhone.trim()) {
      setAuthError('Please fill in your Name and Mobile Number.');
      return;
    }

    setIdentifier(signUpPhone.trim());
    setAuthMode('otp');
    setIsOtpActive(true);
    setOtpTimer(30);
    setOtpDigits(['5', '8', '2', '4', '9', '1']);
  };

  // Handle OTP Verification
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 4) {
      setAuthError('Please enter the verification code.');
      return;
    }

    // Successfully log in the user
    if (authMode === 'signup' || signUpName) {
      loginUser({
        name: signUpName.trim() || 'Sandy Verma',
        phone: signUpPhone.startsWith('+91') ? signUpPhone : `+91 ${signUpPhone}`,
        email: signUpEmail.trim() || 'client@careabeautysolution.com',
        gender: 'Male',
        addresses: [
          {
            id: `addr-${Date.now()}`,
            fullName: signUpName.trim() || 'Sandy Verma',
            phone: signUpPhone.startsWith('+91') ? signUpPhone : `+91 ${signUpPhone}`,
            street: 'DLF Cyber City, Tower 10B',
            city: 'Gurugram',
            state: 'Haryana',
            pincode: '122002',
            type: 'HOME',
            isDefault: true
          }
        ]
      });
    } else {
      // Login mode
      const isEmail = identifier.includes('@');
      loginUser({
        name: 'Sandy Verma',
        phone: isEmail ? '+91 98765 43210' : identifier.startsWith('+91') ? identifier : `+91 ${identifier}`,
        email: isEmail ? identifier : 'sandyverma3@gmail.com',
        gender: 'Male',
        addresses: [
          {
            id: 'addr-1',
            fullName: 'Sandy Verma',
            phone: '+91 98765 43210',
            street: 'Plot No. 44, Sector 29',
            city: 'Gurugram',
            state: 'Haryana',
            pincode: '122001',
            type: 'HOME',
            isDefault: true
          }
        ]
      });
    }

    // Reset auth states
    setAuthMode('login');
    setIsOtpActive(false);
    setActiveTab('orders');
  };

  // One-click demo login
  const handleQuickDemoLogin = () => {
    loginUser({
      name: 'Sandy Verma',
      email: 'sandyverma3@gmail.com',
      phone: '+91 98765 43210',
      gender: 'Male',
      addresses: [
        {
          id: 'addr-1',
          fullName: 'Sandy Verma',
          phone: '+91 98765 43210',
          street: 'Plot No. 44, Sector 29',
          city: 'Gurugram',
          state: 'Haryana',
          pincode: '122001',
          type: 'HOME',
          isDefault: true
        },
        {
          id: 'addr-2',
          fullName: 'Sandy Verma (Office)',
          phone: '+91 98765 43210',
          street: 'DLF Cyber City, Phase II, Tower C',
          city: 'Gurugram',
          state: 'Haryana',
          pincode: '122002',
          type: 'WORK',
          isDefault: false
        }
      ],
      skinType: 'Combination',
      skinConcern: 'Barrier Repair & SPF 50+ Protection'
    });
    setActiveTab('orders');
  };

  // Save personal profile details
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser({
      name: `${profileFirstName} ${profileLastName}`.trim() || user?.name || 'Sandy Verma',
      email: profileEmail || user?.email || '',
      phone: profilePhone || user?.phone || '',
      gender: profileGender
    });
    setProfileSavedNotice(true);
    setTimeout(() => setProfileSavedNotice(false), 2400);
  };

  // Open address editor
  const handleStartAddAddress = () => {
    setAddressForm({
      id: `addr-${Date.now()}`,
      fullName: user?.name || '',
      phone: user?.phone || '',
      street: '',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122001',
      type: 'HOME',
      landmark: '',
      alternatePhone: '',
      isDefault: (user?.addresses.length || 0) === 0
    });
    setEditingAddressId(null);
    setIsAddingAddress(true);
  };

  const handleStartEditAddress = (addr: Address) => {
    setAddressForm({ ...addr });
    setEditingAddressId(addr.id);
    setIsAddingAddress(true);
  };

  const handleSaveAddressForm = (e: React.FormEvent) => {
    e.preventDefault();
    updateAddress(addressForm);
    setIsAddingAddress(false);
    setEditingAddressId(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="w-full max-w-4xl bg-white text-[#1C1917] rounded-3xl border border-[#E8E2D5] shadow-2xl overflow-hidden flex flex-col my-auto relative"
      >
        {/* Top Header Strip with Brand Wordmark and Close Button */}
        <div className="bg-[#03290A] text-[#EDE6D8] px-5 sm:px-8 py-3.5 flex items-center justify-between border-b border-[#083e13] z-20">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-44 sm:w-52">
              <Image
                src="/images/header.png"
                alt="CARE-A Beauty Solution"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
            <span className="hidden sm:inline-block text-[11px] font-mono uppercase tracking-widest text-[#E5B85C] border-l border-[#0a3f18] pl-3">
              {user ? 'My Account' : 'Secure Login'}
            </span>
          </div>

          <button
            onClick={closeProfile}
            className="p-1.5 rounded-full text-[#C5BCAB] hover:text-white hover:bg-[#084717] transition"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            CASE A: LOGGED OUT -> FLIPKART-STANDARD REDESIGNED LOGIN & SIGNUP
        ══════════════════════════════════════════════════════════════════════ */}
        {!user ? (
          <div className="flex flex-col md:flex-row min-h-[520px]">
            {/* 1. LEFT BRAND PILLAR (FLIPKART STYLE WITH BRAND HERO LOGO) */}
            <div className="md:w-5/12 bg-gradient-to-b from-[#03290A] via-[#04330D] to-[#021f07] p-8 sm:p-10 text-[#EDE6D8] flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-[#083e13]">
              {/* Subtle Ambient Radial Lighting */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#E5B85C]/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                {/* Brand Hero Logo Emblem */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-[#053d10] border-2 border-[#E5B85C]/70 shadow-xl mb-6 overflow-hidden flex items-center justify-center group">
                  <Image
                    src="/images/hero.png"
                    alt="CARE-A Brand Hero"
                    fill
                    className="object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Dynamic Left Column Heading based on Auth Mode */}
                {authMode === 'login' && (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-white tracking-tight">
                      Login
                    </h2>
                    <p className="mt-3 text-xs sm:text-sm text-[#C5BCAB] leading-relaxed">
                      Get access to your Orders, Tracked Shipments, and Personalized Skincare Protocol.
                    </p>
                  </>
                )}

                {authMode === 'signup' && (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-white tracking-tight">
                      Looks like you&apos;re new here!
                    </h2>
                    <p className="mt-3 text-xs sm:text-sm text-[#C5BCAB] leading-relaxed">
                      Sign up with your mobile number to get started with CARE-A Beauty Solution.
                    </p>
                  </>
                )}

                {authMode === 'otp' && (
                  <>
                    <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-white tracking-tight">
                      Verification
                    </h2>
                    <p className="mt-3 text-xs sm:text-sm text-[#C5BCAB] leading-relaxed">
                      Please enter the verification code sent to your mobile device.
                    </p>
                  </>
                )}
              </div>

              {/* Flipkart-Style Dermatological Trust Features */}
              <div className="mt-8 pt-6 border-t border-[#094716]/80 space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-[#E5B85C]">
                  <ShieldCheck size={16} className="text-[#E5B85C] shrink-0" />
                  <span className="font-medium text-[#EBE3D3]">100% Bio-Identical Formulation</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#E5B85C]">
                  <Truck size={16} className="text-[#E5B85C] shrink-0" />
                  <span className="font-medium text-[#EBE3D3]">Complimentary Express Delivery</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[#E5B85C]">
                  <Sparkles size={16} className="text-[#E5B85C] shrink-0" />
                  <span className="font-medium text-[#EBE3D3]">Personalized Routine Tracking</span>
                </div>
              </div>
            </div>

            {/* 2. RIGHT INTERACTIVE FORM (FLIPKART STANDARD) */}
            <div className="md:w-7/12 p-8 sm:p-12 flex flex-col justify-between bg-white">
              <div>
                {authError && (
                  <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    MODE 1: LOGIN FORM
                ───────────────────────────────────────────────────────────── */}
                {authMode === 'login' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-6">
                    <div>
                      <label className="block text-xs font-semibold text-[#44403C] uppercase tracking-wider mb-2">
                        Enter Email/Mobile Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="e.g. 9876543210 or sandy@example.com"
                          className="w-full px-4 py-3.5 rounded-xl border border-[#D5CCB8] text-sm text-[#1C1917] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#03290A]/30 focus:border-[#03290A] transition"
                        />
                      </div>
                      <p className="mt-2 text-[11px] text-[#78716C]">
                        We will send an OTP via SMS or WhatsApp to verify your account.
                      </p>
                    </div>

                    <div className="text-[11px] text-[#78716C] leading-relaxed">
                      By continuing, you agree to CARE-A&apos;s{' '}
                      <span className="text-[#03290A] font-semibold underline cursor-pointer">
                        Terms of Use
                      </span>{' '}
                      and{' '}
                      <span className="text-[#03290A] font-semibold underline cursor-pointer">
                        Privacy Policy
                      </span>
                      .
                    </div>

                    {/* Flipkart Signature Primary Button */}
                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-[#03290A] hover:bg-[#074614] text-[#E5B85C] font-bold text-xs uppercase tracking-[0.16em] transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      <span>Request OTP</span>
                      <ArrowRight size={15} />
                    </button>

                    {/* Quick Demo Login Option */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleQuickDemoLogin}
                        className="w-full py-2.5 rounded-xl border border-dashed border-[#D5CCB8] hover:border-[#03290A] bg-[#FBF9F5] text-[11px] font-mono font-medium text-[#785412] hover:text-[#03290A] transition flex items-center justify-center gap-1.5"
                      >
                        <Sparkles size={12} className="text-[#E5B85C]" />
                        <span>Instant One-Click Demo Login (Sandy Verma)</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    MODE 2: SIGN UP FORM
                ───────────────────────────────────────────────────────────── */}
                {authMode === 'signup' && (
                  <form onSubmit={handleSignUpSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#44403C] uppercase tracking-wider mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="e.g. Sandy Verma"
                        className="w-full px-4 py-3 rounded-xl border border-[#D5CCB8] text-sm text-[#1C1917] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#03290A]/30 focus:border-[#03290A] transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#44403C] uppercase tracking-wider mb-1.5">
                        Mobile Number
                      </label>
                      <div className="flex rounded-xl border border-[#D5CCB8] bg-[#FAF8F5] overflow-hidden focus-within:border-[#03290A] focus-within:ring-2 focus-within:ring-[#03290A]/30 transition">
                        <span className="px-3.5 py-3 bg-[#EDE6D8] border-r border-[#D5CCB8] text-xs font-mono font-bold text-[#44403C] flex items-center">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          value={signUpPhone}
                          onChange={(e) => setSignUpPhone(e.target.value)}
                          placeholder="10-digit mobile number"
                          className="w-full px-3.5 py-3 text-sm text-[#1C1917] bg-transparent focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#44403C] uppercase tracking-wider mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="sandy@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-[#D5CCB8] text-sm text-[#1C1917] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#03290A]/30 focus:border-[#03290A] transition"
                      />
                    </div>

                    <div className="text-[11px] text-[#78716C] leading-relaxed pt-1">
                      By continuing, you agree to CARE-A&apos;s{' '}
                      <span className="text-[#03290A] font-semibold underline cursor-pointer">
                        Terms of Use
                      </span>{' '}
                      and{' '}
                      <span className="text-[#03290A] font-semibold underline cursor-pointer">
                        Privacy Policy
                      </span>
                      .
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-[#03290A] hover:bg-[#074614] text-[#E5B85C] font-bold text-xs uppercase tracking-[0.16em] transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      <span>Continue to Sign Up</span>
                      <ArrowRight size={15} />
                    </button>
                  </form>
                )}

                {/* ─────────────────────────────────────────────────────────────
                    MODE 3: OTP VERIFICATION (FLIPKART STYLE)
                ───────────────────────────────────────────────────────────── */}
                {authMode === 'otp' && (
                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="p-4 rounded-xl bg-[#F7F4EE] border border-[#E8E2D5] flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-[#78716C] block">OTP sent to:</span>
                        <span className="text-xs font-mono font-bold text-[#1C1917]">
                          {identifier || signUpPhone || '+91 98765 43210'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('login');
                          setIsOtpActive(false);
                        }}
                        className="text-xs text-[#064E3B] font-semibold hover:underline flex items-center gap-1"
                      >
                        <Edit2 size={12} />
                        <span>Change</span>
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#44403C] uppercase tracking-wider mb-2">
                        Enter 6-Digit OTP
                      </label>
                      <div className="flex gap-2 sm:gap-3 justify-between">
                        {otpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`otp-box-${idx}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => {
                              const val = e.target.value;
                              const updated = [...otpDigits];
                              updated[idx] = val;
                              setOtpDigits(updated);
                              if (val && idx < 5) {
                                const next = document.getElementById(`otp-box-${idx + 1}`);
                                next?.focus();
                              }
                            }}
                            className="w-11 sm:w-12 h-12 text-center font-mono font-bold text-lg rounded-xl border border-[#D5CCB8] bg-[#FAF8F5] focus:bg-white focus:border-[#03290A] focus:ring-2 focus:ring-[#03290A]/20 transition"
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-3 text-xs">
                        <span className="text-[#78716C] font-mono flex items-center gap-1">
                          <Clock size={12} />
                          {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Resend available'}
                        </span>

                        <button
                          type="button"
                          disabled={otpTimer > 0}
                          onClick={() => {
                            setOtpTimer(30);
                            setOtpDigits(['5', '8', '2', '4', '9', '1']);
                          }}
                          className={`font-semibold ${
                            otpTimer > 0
                              ? 'text-[#A8A29E] cursor-not-allowed'
                              : 'text-[#064E3B] hover:underline'
                          }`}
                        >
                          Resend OTP
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-[#03290A] hover:bg-[#074614] text-[#E5B85C] font-bold text-xs uppercase tracking-[0.16em] transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      <span>Verify &amp; Log In</span>
                      <CheckCircle2 size={16} />
                    </button>
                  </form>
                )}
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  FLIPKART'S SIGNATURE BOTTOM SIGNUP / LOGIN SWITCHER
                  (Requested: "once click on ligin it should show signup option also on bottom")
              ───────────────────────────────────────────────────────────── */}
              <div className="mt-8 pt-6 border-t border-[#F0EBE1] text-center">
                {authMode === 'login' ? (
                  <div className="bg-[#FAF8F5] border border-[#E8E2D5] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                    <div className="text-left">
                      <p className="text-xs font-bold text-[#1C1917]">New to CARE-A?</p>
                      <p className="text-[11px] text-[#78716C]">
                        Create an account to track orders and save your skin routine.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('signup');
                        setAuthError('');
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#03290A] bg-white hover:bg-[#03290A] text-[#03290A] hover:text-[#E5B85C] font-bold text-xs tracking-wider uppercase transition shadow-sm"
                    >
                      Create an account
                    </button>
                  </div>
                ) : authMode === 'signup' ? (
                  <div className="bg-[#FAF8F5] border border-[#E8E2D5] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                    <div className="text-left">
                      <p className="text-xs font-bold text-[#1C1917]">Existing User?</p>
                      <p className="text-[11px] text-[#78716C]">
                        Log in with your verified mobile number or email.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login');
                        setAuthError('');
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#03290A] bg-white hover:bg-[#03290A] text-[#03290A] hover:text-[#E5B85C] font-bold text-xs tracking-wider uppercase transition shadow-sm"
                    >
                      Log in to Account
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login');
                      setAuthError('');
                    }}
                    className="text-xs text-[#064E3B] font-semibold hover:underline"
                  >
                    ← Back to Login
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ══════════════════════════════════════════════════════════════════════
              CASE B: LOGGED IN -> FLIPKART-STANDARD "MY ACCOUNT" PORTAL
          ══════════════════════════════════════════════════════════════════════ */
          <div className="flex flex-col md:flex-row min-h-[560px] bg-[#F7F4EE]">
            {/* 1. FLIPKART-STYLE LEFT SIDEBAR NAVIGATION */}
            <div className="md:w-80 p-4 sm:p-5 flex flex-col gap-3 shrink-0 border-b md:border-b-0 md:border-r border-[#E8E2D5]">
              {/* User Avatar & Hello Box */}
              <div className="bg-white p-4 rounded-2xl border border-[#E8E2D5] flex items-center gap-3.5 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-[#03290A] text-[#E5B85C] flex items-center justify-center font-bold text-base shadow-sm shrink-0 border border-[#E5B85C]/40">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-[#78716C] uppercase tracking-wider block font-semibold">
                    Hello,
                  </span>
                  <h3 className="font-bold text-sm text-[#1C1917] truncate">{user.name}</h3>
                  <span className="text-[11px] font-mono text-[#78716C] truncate block">
                    {user.phone || user.email}
                  </span>
                </div>
              </div>

              {/* Navigation Menu Links */}
              <div className="bg-white rounded-2xl border border-[#E8E2D5] overflow-hidden shadow-sm text-xs font-semibold">
                {/* Section Header: Orders */}
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full px-4 py-3.5 flex items-center justify-between transition border-b border-[#F0EBE1] ${
                    activeTab === 'orders'
                      ? 'bg-[#03290A] text-[#E5B85C]'
                      : 'text-[#44403C] hover:bg-[#FBF9F5]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Package size={16} />
                    <span>MY ORDERS</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      activeTab === 'orders'
                        ? 'bg-[#E5B85C] text-[#03290A]'
                        : 'bg-[#F0EBE1] text-[#44403C]'
                    }`}
                  >
                    {orders.length}
                  </span>
                </button>

                {/* Section Header: Account Settings */}
                <div className="px-4 pt-3 pb-1 text-[10px] font-mono uppercase tracking-widest text-[#785412] font-bold">
                  Account Settings
                </div>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full px-4 py-3 flex items-center justify-between transition ${
                    activeTab === 'profile'
                      ? 'bg-[#F5EFE6] text-[#03290A] font-bold'
                      : 'text-[#57534E] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <User size={15} />
                    <span>Profile Information</span>
                  </div>
                  <ChevronRight size={13} className="text-[#A8A29E]" />
                </button>

                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full px-4 py-3 flex items-center justify-between transition border-b border-[#F0EBE1] ${
                    activeTab === 'addresses'
                      ? 'bg-[#F5EFE6] text-[#03290A] font-bold'
                      : 'text-[#57534E] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin size={15} />
                    <span>Manage Addresses</span>
                  </div>
                  <ChevronRight size={13} className="text-[#A8A29E]" />
                </button>

                {/* Section Header: Skincare Diagnostics */}
                <div className="px-4 pt-3 pb-1 text-[10px] font-mono uppercase tracking-widest text-[#785412] font-bold">
                  Skincare Health
                </div>

                <button
                  onClick={() => setActiveTab('skin')}
                  className={`w-full px-4 py-3 flex items-center justify-between transition ${
                    activeTab === 'skin'
                      ? 'bg-[#F5EFE6] text-[#03290A] font-bold'
                      : 'text-[#57534E] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={15} />
                    <span>Skin Profile &amp; Regimen</span>
                  </div>
                  <ChevronRight size={13} className="text-[#A8A29E]" />
                </button>
              </div>

              {/* Account Controls: Switch User / Log Out */}
              <div className="bg-white p-3 rounded-2xl border border-[#E8E2D5] space-y-2 shadow-sm text-xs">
                <button
                  onClick={() => {
                    logoutUser();
                    setAuthMode('login');
                  }}
                  className="w-full py-2 px-3 rounded-xl border border-[#E8E2D5] hover:bg-stone-50 text-[#57534E] hover:text-[#1C1917] flex items-center justify-center gap-2 transition"
                >
                  <RefreshCw size={13} />
                  <span>Switch Account / Sign In</span>
                </button>

                <button
                  onClick={() => {
                    logoutUser();
                    closeProfile();
                  }}
                  className="w-full py-2 px-3 rounded-xl text-rose-600 hover:bg-rose-50 flex items-center justify-center gap-2 transition font-semibold"
                >
                  <LogOut size={13} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>

            {/* 2. RIGHT CONTENT AREA (FLIPKART CLEAN CARDS) */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[640px]">
              {/* Notification Toast */}
              {orderNotice && (
                <div className="mb-4 p-3 rounded-xl bg-[#03290A] text-[#E5B85C] text-xs font-mono flex items-center justify-between shadow-md">
                  <span>{orderNotice}</span>
                  <button onClick={() => setOrderNotice(null)} className="text-white hover:text-stone-300">
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  TAB 1: MY ORDERS (FLIPKART STANDARD TRACKER & CARDS)
              ───────────────────────────────────────────────────────────── */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-[#E8E2D5] flex items-center justify-between shadow-sm">
                    <div>
                      <h4 className="font-editorial text-lg font-bold text-[#1C1917]">
                        All Orders ({orders.length})
                      </h4>
                      <p className="text-xs text-[#78716C]">
                        Track your shipments and download GST tax invoices.
                      </p>
                    </div>
                  </div>

                  {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-[#E8E2D5] p-12 text-center shadow-sm">
                      <div className="w-16 h-16 rounded-full bg-[#F5EFE6] border border-[#D5CCB8] flex items-center justify-center text-[#785412] mx-auto mb-3">
                        <Package size={28} />
                      </div>
                      <h5 className="font-bold text-base text-[#1C1917]">No orders placed yet</h5>
                      <p className="text-xs text-[#78716C] mt-1 max-w-sm mx-auto">
                        Once you purchase our clinical trio formulations, your package tracking, live milestones, and tax invoice will appear right here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-white rounded-2xl border border-[#E8E2D5] p-5 shadow-sm hover:border-[#D5CCB8] transition space-y-4 text-xs"
                        >
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F0EBE1] gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-sm text-[#1C1917]">
                                  {order.id}
                                </span>
                                <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#064E3B] border border-[#A7F3D0] text-[10px] font-bold">
                                  {order.status}
                                </span>
                              </div>
                              <span className="text-[11px] text-[#78716C] mt-0.5 block">
                                Placed on{' '}
                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>

                            <div className="text-left sm:text-right">
                              <span className="text-base font-bold font-mono text-[#1C1917]">
                                ₹{order.total}
                              </span>
                              <span className="text-[11px] text-[#78716C] block">
                                Paid via {order.paymentMethod}
                              </span>
                            </div>
                          </div>

                          {/* Flipkart-Style Order Timeline Tracker */}
                          <div className="py-2 px-3 rounded-xl bg-[#FAF8F5] border border-[#EFE9DD]">
                            <div className="flex items-center justify-between text-[11px] font-semibold text-[#44403C] mb-2">
                              <span>Order Timeline</span>
                              <span className="text-[#064E3B] font-mono">Est. Delivery in 3 Days</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1.5 text-[10px] text-[#064E3B] font-bold">
                                <span className="w-3 h-3 rounded-full bg-[#064E3B] flex items-center justify-center text-white text-[8px]">
                                  ✓
                                </span>
                                <span>Confirmed</span>
                              </div>
                              <div className="flex-1 h-0.5 bg-[#064E3B]" />
                              <div className="flex items-center gap-1.5 text-[10px] text-[#064E3B] font-bold">
                                <span className="w-3 h-3 rounded-full bg-[#064E3B] flex items-center justify-center text-white text-[8px]">
                                  ✓
                                </span>
                                <span>Dispatched</span>
                              </div>
                              <div className="flex-1 h-0.5 bg-[#D5CCB8]" />
                              <div className="flex items-center gap-1.5 text-[10px] text-[#78716C]">
                                <span className="w-3 h-3 rounded-full border border-[#A8A29E] bg-white" />
                                <span>Out for Delivery</span>
                              </div>
                              <div className="flex-1 h-0.5 bg-[#D5CCB8]" />
                              <div className="flex items-center gap-1.5 text-[10px] text-[#78716C]">
                                <span className="w-3 h-3 rounded-full border border-[#A8A29E] bg-white" />
                                <span>Delivered</span>
                              </div>
                            </div>
                          </div>

                          {/* Items Breakdown */}
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between py-1 text-[#44403C]"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-[#03290A]" />
                                  <span className="font-medium text-[#1C1917]">{item.name}</span>
                                  <span className="text-[11px] text-[#78716C]">({item.volume})</span>
                                  <span className="text-xs font-mono font-semibold">× {item.quantity}</span>
                                </div>
                                <span className="font-mono font-bold text-[#1C1917]">
                                  ₹{item.price * item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Delivery Address & Actions */}
                          <div className="pt-3 border-t border-[#F0EBE1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px]">
                            <div className="text-[#78716C]">
                              <span>Delivering to: </span>
                              <strong className="text-[#1C1917]">
                                {order.deliveryAddress.fullName}
                              </strong>{' '}
                              ({order.deliveryAddress.street}, {order.deliveryAddress.city} -{' '}
                              {order.deliveryAddress.pincode})
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                              <button
                                onClick={() =>
                                  setOrderNotice(`Tracking link: Bluedart Express AWB #BD-${order.id.replace('CARE-', '')}`)
                                }
                                className="px-3 py-1.5 rounded-lg border border-[#D5CCB8] hover:bg-[#F5EFE6] text-[#44403C] font-semibold transition"
                              >
                                Track Package
                              </button>
                              <button
                                onClick={() =>
                                  setOrderNotice(`Tax invoice for ${order.id} downloaded successfully.`)
                                }
                                className="px-3 py-1.5 rounded-lg bg-[#03290A] hover:bg-[#074614] text-[#E5B85C] font-semibold transition flex items-center gap-1"
                              >
                                <FileText size={12} />
                                <span>Invoice</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  TAB 2: PROFILE INFORMATION (FLIPKART STANDARD)
              ───────────────────────────────────────────────────────────── */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-2xl border border-[#E8E2D5] p-6 sm:p-8 shadow-sm space-y-6 text-xs">
                  <div>
                    <h4 className="font-editorial text-xl font-bold text-[#1C1917]">
                      Personal Information
                    </h4>
                    <p className="text-xs text-[#78716C] mt-0.5">
                      Manage your personal details, email address, and mobile number.
                    </p>
                  </div>

                  {profileSavedNotice && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      <span>Profile information updated successfully!</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#44403C] mb-1.5">
                          First Name
                        </label>
                        <input
                          type="text"
                          required
                          value={profileFirstName}
                          onChange={(e) => setProfileFirstName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CCB8] text-sm text-[#1C1917] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#03290A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#44403C] mb-1.5">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={profileLastName}
                          onChange={(e) => setProfileLastName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CCB8] text-sm text-[#1C1917] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#03290A]"
                        />
                      </div>
                    </div>

                    {/* Gender Selection (Flipkart signature) */}
                    <div>
                      <label className="block text-xs font-semibold text-[#44403C] mb-2">
                        Your Gender
                      </label>
                      <div className="flex gap-6">
                        {(['Male', 'Female', 'Other'] as const).map((g) => (
                          <label key={g} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="gender"
                              checked={profileGender === g}
                              onChange={() => setProfileGender(g)}
                              className="w-4 h-4 text-[#03290A] focus:ring-[#03290A]"
                            />
                            <span className="text-xs text-[#1C1917] font-medium">{g}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-semibold text-[#44403C]">
                            Email Address
                          </label>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                            Verified
                          </span>
                        </div>
                        <input
                          type="email"
                          required
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CCB8] text-sm text-[#1C1917] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#03290A]"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-semibold text-[#44403C]">
                            Mobile Number
                          </label>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                            Verified
                          </span>
                        </div>
                        <input
                          type="tel"
                          required
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CCB8] text-sm text-[#1C1917] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:border-[#03290A]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-8 py-3 rounded-xl bg-[#03290A] hover:bg-[#074614] text-[#E5B85C] font-bold text-xs uppercase tracking-wider transition shadow-md"
                    >
                      Save Profile Changes
                    </button>
                  </form>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  TAB 3: MANAGE ADDRESSES (FLIPKART STANDARD)
              ───────────────────────────────────────────────────────────── */}
              {activeTab === 'addresses' && (
                <div className="space-y-4 text-xs">
                  <div className="bg-white p-4 rounded-2xl border border-[#E8E2D5] flex items-center justify-between shadow-sm">
                    <div>
                      <h4 className="font-editorial text-lg font-bold text-[#1C1917]">
                        Manage Delivery Addresses
                      </h4>
                      <p className="text-xs text-[#78716C]">
                        Add or edit doorstep shipping locations for 1-click checkout.
                      </p>
                    </div>

                    {!isAddingAddress && (
                      <button
                        onClick={handleStartAddAddress}
                        className="px-4 py-2 rounded-xl bg-[#03290A] hover:bg-[#074614] text-[#E5B85C] font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                      >
                        <Plus size={14} />
                        <span>ADD NEW ADDRESS</span>
                      </button>
                    )}
                  </div>

                  {/* Add / Edit Form */}
                  {isAddingAddress && (
                    <div className="bg-white p-6 rounded-2xl border-2 border-[#03290A] shadow-md space-y-4">
                      <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
                        <h5 className="font-bold text-sm text-[#03290A] uppercase tracking-wider">
                          {editingAddressId ? 'Edit Address' : 'Add a New Delivery Address'}
                        </h5>
                        <button
                          onClick={() => setIsAddingAddress(false)}
                          className="text-xs text-[#78716C] hover:text-[#1C1917]"
                        >
                          Cancel
                        </button>
                      </div>

                      <form onSubmit={handleSaveAddressForm} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-[#44403C] mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              required
                              value={addressForm.fullName}
                              onChange={(e) =>
                                setAddressForm({ ...addressForm, fullName: e.target.value })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CCB8] bg-[#FAF8F5]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#44403C] mb-1">
                              10-digit Mobile Number
                            </label>
                            <input
                              type="tel"
                              required
                              value={addressForm.phone}
                              onChange={(e) =>
                                setAddressForm({ ...addressForm, phone: e.target.value })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CCB8] bg-[#FAF8F5]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#44403C] mb-1">
                            Street Address / House No. / Flat / Building
                          </label>
                          <input
                            type="text"
                            required
                            value={addressForm.street}
                            onChange={(e) =>
                              setAddressForm({ ...addressForm, street: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CCB8] bg-[#FAF8F5]"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-[#44403C] mb-1">
                              Pincode
                            </label>
                            <input
                              type="text"
                              required
                              value={addressForm.pincode}
                              onChange={(e) =>
                                setAddressForm({ ...addressForm, pincode: e.target.value })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CCB8] bg-[#FAF8F5]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#44403C] mb-1">
                              City / District
                            </label>
                            <input
                              type="text"
                              required
                              value={addressForm.city}
                              onChange={(e) =>
                                setAddressForm({ ...addressForm, city: e.target.value })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CCB8] bg-[#FAF8F5]"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-[#44403C] mb-1">
                              State
                            </label>
                            <input
                              type="text"
                              required
                              value={addressForm.state}
                              onChange={(e) =>
                                setAddressForm({ ...addressForm, state: e.target.value })
                              }
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5CCB8] bg-[#FAF8F5]"
                            />
                          </div>
                        </div>

                        {/* Address Type Tag (HOME / WORK) */}
                        <div>
                          <label className="block text-xs font-semibold text-[#44403C] mb-2">
                            Address Type
                          </label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="addressType"
                                checked={addressForm.type === 'HOME'}
                                onChange={() =>
                                  setAddressForm({ ...addressForm, type: 'HOME' })
                                }
                              />
                              <span className="flex items-center gap-1 font-semibold text-[#1C1917]">
                                <HomeIcon size={14} /> Home (All day delivery)
                              </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="radio"
                                name="addressType"
                                checked={addressForm.type === 'WORK'}
                                onChange={() =>
                                  setAddressForm({ ...addressForm, type: 'WORK' })
                                }
                              />
                              <span className="flex items-center gap-1 font-semibold text-[#1C1917]">
                                <Building2 size={14} /> Work (Delivery between 10 AM - 6 PM)
                              </span>
                            </label>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                          <button
                            type="submit"
                            className="px-6 py-3 rounded-xl bg-[#03290A] text-[#E5B85C] font-bold text-xs uppercase tracking-wider shadow-sm"
                          >
                            Save Address
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsAddingAddress(false)}
                            className="px-6 py-3 rounded-xl border border-[#D5CCB8] bg-white text-[#57534E] font-semibold text-xs"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Addresses List */}
                  <div className="space-y-3">
                    {user.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`bg-white p-5 rounded-2xl border transition shadow-sm space-y-2 ${
                          addr.isDefault
                            ? 'border-[#03290A] ring-1 ring-[#03290A]/20'
                            : 'border-[#E8E2D5]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF0DC] text-[#785412] font-mono font-bold text-[10px] uppercase">
                              {addr.type || 'HOME'}
                            </span>
                            <span className="font-bold text-sm text-[#1C1917]">
                              {addr.fullName}
                            </span>
                            <span className="font-mono text-xs text-[#78716C]">{addr.phone}</span>
                            {addr.isDefault && (
                              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                                Default
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStartEditAddress(addr)}
                              className="p-1 text-[#78716C] hover:text-[#03290A] transition"
                              title="Edit address"
                            >
                              <Edit2 size={14} />
                            </button>
                            {user.addresses.length > 1 && (
                              <button
                                onClick={() => deleteAddress(addr.id)}
                                className="p-1 text-[#78716C] hover:text-rose-600 transition"
                                title="Delete address"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-[#57534E] leading-relaxed">
                          {addr.street}, {addr.city}, {addr.state} -{' '}
                          <span className="font-mono font-semibold">{addr.pincode}</span>
                        </p>

                        {!addr.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-[11px] font-semibold text-[#064E3B] hover:underline pt-1 block"
                          >
                            Set as Default Delivery Address
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ─────────────────────────────────────────────────────────────
                  TAB 4: SKIN PROFILE & DERMATOLOGICAL RECORD
              ───────────────────────────────────────────────────────────── */}
              {activeTab === 'skin' && (
                <div className="bg-white rounded-2xl border border-[#E8E2D5] p-6 sm:p-8 shadow-sm space-y-6 text-xs">
                  <div>
                    <span className="text-[11px] font-mono uppercase text-[#785412] font-bold">
                      Clinical Diagnostic Record
                    </span>
                    <h4 className="font-editorial text-xl font-bold text-[#1C1917] mt-1">
                      {user.skinType || 'Combination'} Barrier Profile
                    </h4>
                    <p className="text-xs text-[#78716C] mt-0.5">
                      Tailored formulation protocol and clinical parameters saved to your account.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D5]">
                      <span className="text-[10px] text-[#78716C] uppercase font-bold block">
                        Skin Barrier Type
                      </span>
                      <span className="font-bold text-[#1C1917] text-sm mt-1 block">
                        {user.skinType || 'Combination / Sensitive'}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D5]">
                      <span className="text-[10px] text-[#78716C] uppercase font-bold block">
                        Primary Target
                      </span>
                      <span className="font-bold text-[#1C1917] text-sm mt-1 block">
                        {user.skinConcern || 'Barrier Repair & SPF 50+'}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D5]">
                      <span className="text-[10px] text-[#78716C] uppercase font-bold block">
                        Formulation Match
                      </span>
                      <span className="font-bold text-[#064E3B] text-sm mt-1 block">
                        100% The Core Trio
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#03290A] text-[#EDE6D8] space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#E5B85C] uppercase font-bold">
                      <Sparkles size={14} />
                      <span>Recommended 3-Step Synergistic Protocol</span>
                    </div>
                    <ol className="list-decimal list-inside text-xs text-[#C5BCAB] space-y-1">
                      <li>
                        <strong>Morning:</strong> Gentle Clarifying Cleanser (150ml) + Invisible Mineral Sunscreen SPF 50+ (50ml)
                      </li>
                      <li>
                        <strong>Evening:</strong> Gentle Clarifying Cleanser (150ml) + Barrier Shield Moisturizer (50ml)
                      </li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

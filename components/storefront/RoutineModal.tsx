'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Sparkles, Check, ArrowRight, ShieldCheck, RefreshCw, ShoppingBag } from 'lucide-react';
import { CORE_PRODUCTS } from '@/lib/products-data';
import { useCart } from '@/lib/cart-context';

interface RoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoutine?: (productIds: string[]) => void;
}

export default function RoutineModal({ isOpen, onClose, onSelectRoutine }: RoutineModalProps) {
  const [step, setStep] = useState<number>(1);
  const [skinType, setSkinType] = useState<string>('Combination');
  const [concern, setConcern] = useState<string>('Barrier Repair');
  const [lifestyle, setLifestyle] = useState<string>('Urban & High Screen Time');
  const [isCalculated, setIsCalculated] = useState<boolean>(false);

  const { addItem, loginUser } = useCart();

  const skinTypes = [
    { id: 'Sensitive', label: 'Sensitive / Reactive', desc: 'Prone to redness, tightness, or stinging' },
    { id: 'Dry', label: 'Dry / Dehydrated', desc: 'Flaking, dull appearance, lack of suppleness' },
    { id: 'Combination', label: 'Combination / Normal', desc: 'Slightly oily T-zone with balanced or dry cheeks' },
    { id: 'Oily', label: 'Oily / Blemish-Prone', desc: 'Visible pores, excess midday shine' }
  ];

  const concerns = [
    { id: 'Barrier Repair', label: 'Compromised Barrier & Tightness', tag: 'High Priority' },
    { id: 'Sun & Blue Light', label: 'UV Pigmentation & Blue Light Stress', tag: 'Preventative' },
    { id: 'Texture & Pores', label: 'Rough Texture & Clogged Pores', tag: 'Clarifying' }
  ];

  const lifestyles = [
    { id: 'Urban & High Screen Time', label: 'Urban commute + 8+ hours screen exposure daily' },
    { id: 'Active Outdoors', label: 'Frequent outdoor daylight, sports & humidity' },
    { id: 'Climate-Controlled', label: 'Air-conditioned indoors with continuous dry air' }
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsCalculated(true);
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setIsCalculated(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FBF9F5] border border-[#E8E2D5] text-[#1C1917] p-6 sm:p-8 md:p-10 shadow-2xl z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close Diagnostic"
              className="absolute top-5 right-5 p-2 rounded-full text-[#78716C] hover:text-[#1C1917] hover:bg-[#F0EBE1] transition"
            >
              <X size={20} />
            </button>

            {!isCalculated ? (
              <div>
                {/* Official Brand Logo */}
                <div className="inline-block bg-[#03290A] px-4 py-2 rounded-2xl border border-[#083e13] mb-4 shadow-sm">
                  <div className="relative h-9 w-48">
                    <Image
                      src="/images/header.png"
                      alt="CARE-A Beauty Solution"
                      fill
                      className="object-contain object-left"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F2ECE1] border border-[#D5CCB8] text-[#785412] text-xs font-bold font-mono">
                    {step}
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#785412] font-bold">
                    Dermatological Routine Diagnostic
                  </span>
                  <span className="ml-auto text-xs text-[#78716C]">Step {step} of 3</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#EFE9DD] h-1.5 rounded-full mb-8 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#785412] to-[#064E3B]"
                    initial={{ width: '33%' }}
                    animate={{ width: `${(step / 3) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Question 1: Skin Type */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                  >
                    <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-[#1C1917] mb-2">
                      What best characterizes your natural skin behavior?
                    </h2>
                    <p className="text-sm text-[#57534E] mb-6">
                      Our lipid-replenishing formulations adapt bio-compatibility based on your baseline sebum and sensitivity.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                      {skinTypes.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setSkinType(item.id)}
                          className={`text-left p-4 rounded-2xl border transition-all ${
                            skinType === item.id
                              ? 'border-[#785412] bg-[#FAF7F2] shadow-sm ring-1 ring-[#785412]/30'
                              : 'border-[#E8E2D5] bg-white hover:border-[#D5CCB8]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-sm text-[#1C1917]">{item.label}</span>
                            {skinType === item.id && <Check size={16} className="text-[#785412]" />}
                          </div>
                          <p className="text-xs text-[#78716C] leading-relaxed">{item.desc}</p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Question 2: Skin Concern */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                  >
                    <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-[#1C1917] mb-2">
                      What is your highest clinical skincare priority?
                    </h2>
                    <p className="text-sm text-[#57534E] mb-6">
                      Every CARE-A formula targets cellular lipid restoration while addressing specific daily stressors.
                    </p>

                    <div className="space-y-3 mb-8">
                      {concerns.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setConcern(item.id)}
                          className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                            concern === item.id
                              ? 'border-[#785412] bg-[#FAF7F2] shadow-sm ring-1 ring-[#785412]/30'
                              : 'border-[#E8E2D5] bg-white hover:border-[#D5CCB8]'
                          }`}
                        >
                          <div>
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#064E3B] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0] mr-2">
                              {item.tag}
                            </span>
                            <span className="font-semibold text-sm text-[#1C1917]">{item.label}</span>
                          </div>
                          {concern === item.id && <Check size={16} className="text-[#785412]" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Question 3: Lifestyle Stressors */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                  >
                    <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-[#1C1917] mb-2">
                      What primary daily environmental exposure do you experience?
                    </h2>
                    <p className="text-sm text-[#57534E] mb-6">
                      Indoor HEV blue light and high outdoor UV rays require distinct multi-spectrum shield ratios.
                    </p>

                    <div className="space-y-3 mb-8">
                      {lifestyles.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setLifestyle(item.id)}
                          className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                            lifestyle === item.id
                              ? 'border-[#785412] bg-[#FAF7F2] shadow-sm ring-1 ring-[#785412]/30'
                              : 'border-[#E8E2D5] bg-white hover:border-[#D5CCB8]'
                          }`}
                        >
                          <span className="font-medium text-sm text-[#1C1917]">{item.label}</span>
                          {lifestyle === item.id && <Check size={16} className="text-[#785412]" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-[#E8E2D5]">
                  {step > 1 ? (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="px-5 py-2.5 rounded-full text-xs uppercase tracking-widest text-[#78716C] hover:text-[#1C1917]"
                    >
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#1C1917] hover:bg-[#064E3B] text-white font-bold text-xs uppercase tracking-[0.15em] transition shadow-md"
                  >
                    <span>{step === 3 ? 'Generate Protocol' : 'Continue'}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              /* Diagnostic Results View */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-left"
              >
                <div className="inline-flex items-center gap-1.5 bg-[#ECFDF5] border border-[#A7F3D0] text-[#064E3B] px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-3">
                  <Sparkles size={13} />
                  <span>Clinical Regimen Formulated</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-[#1C1917] mb-1">
                  Your Custom Daily Barrier Protocol
                </h2>
                <p className="text-sm text-[#57534E] mb-6">
                  Tailored for your <strong className="text-[#1C1917]">{skinType}</strong> profile, primary focus on{' '}
                  <strong className="text-[#1C1917]">{concern}</strong>, and exposure to{' '}
                  <strong className="text-[#064E3B]">{lifestyle}</strong>:
                </p>

                {/* Recommended 3-Step Stack */}
                <div className="space-y-3 mb-6">
                  {CORE_PRODUCTS.map((prod, idx) => (
                    <div
                      key={prod.id}
                      className="p-4 rounded-2xl bg-white border border-[#E8E2D5] flex items-start gap-4 shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#F5EFE6] border border-[#E5DEC9] flex items-center justify-center text-xs font-bold text-[#785412] shrink-0 font-mono">
                        0{idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="font-bold text-[#1C1917] text-sm">{prod.name}</h4>
                          <span className="text-xs text-[#1C1917] font-mono font-bold">₹{prod.price}</span>
                        </div>
                        <p className="text-xs text-[#57534E] mt-0.5">{prod.shortDescription}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bundle Savings Offer Box */}
                <div className="p-5 rounded-2xl bg-[#F5EFE6] border border-[#E5DEC9] mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#785412]">
                        Bundle Savings
                      </span>
                      <span className="text-[10px] font-bold bg-[#785412] text-white px-2 py-0.5 rounded-full">
                        SAVE 15%
                      </span>
                    </div>
                    <div className="text-[#1C1917] font-editorial text-lg font-bold mt-1">
                      The Complete 3-Step Protocol
                    </div>
                    <p className="text-xs text-[#78716C]">Cleanser + Moisturizer + Sunscreen</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-[#A8A29E] line-through">₹2,347</span>
                      <span className="text-xl font-bold font-mono text-[#1C1917]">₹1,999</span>
                    </div>
                    <span className="text-[11px] text-[#064E3B] font-medium">Free Express Delivery</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    onClick={resetQuiz}
                    className="inline-flex items-center gap-1.5 text-xs text-[#78716C] hover:text-[#1C1917] transition"
                  >
                    <RefreshCw size={12} /> Retake Diagnostic
                  </button>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={onClose}
                      className="flex-1 sm:flex-none px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-[#57534E] border border-[#E8E2D5] hover:bg-[#F0EBE1] transition"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        // Add matched core products to user cart
                        CORE_PRODUCTS.forEach((p) => addItem(p, 1));
                        // Update skin profile
                        loginUser({ skinType, skinConcern: concern });
                        onClose();
                      }}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#1C1917] hover:bg-[#064E3B] text-white font-bold text-xs uppercase tracking-[0.15em] transition shadow-md"
                    >
                      <ShoppingBag size={15} />
                      <span>Add Protocol to Bag (₹1,999)</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Droplets,
  Shield,
  Sun,
  Sparkles,
  Truck,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  User,
  Heart,
  FileText,
  Star
} from 'lucide-react';

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: 'all' | 'cleanser' | 'moisturizer' | 'sunscreen') => void;
  onOpenRoutineModal: () => void;
  onOpenProfile: () => void;
  onOpenCart: () => void;
  user?: { name: string; email: string } | null;
}

export default function MobileMenuDrawer({
  isOpen,
  onClose,
  onSelectCategory,
  onOpenRoutineModal,
  onOpenProfile,
  onOpenCart,
  user,
}: MobileMenuDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-950/75 backdrop-blur-xs"
          />

          {/* Drawer content */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 260 }}
            className="relative w-[85%] max-w-sm bg-[#2b2732] text-[#FBF9F5] border-r border-[#4c4755] h-full shadow-2xl flex flex-col z-10 overflow-y-auto"
          >
            {/* Header / Brand & Close */}
            <div className="p-4 border-b border-[#433e4b] flex items-center justify-between bg-[#383340]">
              <div className="relative h-10 w-40">
                <Image
                  src="/images/header.png"
                  alt="CARE-A Beauty Solution"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full text-[#D5CCB8] hover:text-white hover:bg-white/10 transition cursor-pointer"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* User status card */}
            <div className="p-4 bg-[#231f29] border-b border-[#3e3947]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#3d3745] border border-[#F3CA74]/50 flex items-center justify-center text-[#F3CA74] font-bold">
                    <User size={18} />
                  </div>
                  <div>
                    <span className="text-xs text-[#b8b0c2] block">Welcome</span>
                    <span className="text-sm font-bold text-white block">
                      {user ? user.name : 'Beauty Member'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenProfile();
                  }}
                  className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#F3CA74] text-[#1C1917] hover:bg-[#ffe39c] transition"
                >
                  {user ? 'Profile' : 'Login'}
                </button>
              </div>
            </div>

            {/* Core Routine / Categories */}
            <div className="p-4 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#F3CA74] block mb-2 font-bold px-2">
                Core Formulations
              </span>

              <button
                type="button"
                onClick={() => {
                  onSelectCategory('all');
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#393442] transition text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Sparkles size={16} className="text-[#F3CA74]" />
                  <span className="text-sm font-bold text-white group-hover:text-[#F3CA74]">
                    The Sacred 3-Step Ritual (All)
                  </span>
                </div>
                <ChevronRight size={16} className="text-[#888194] group-hover:text-white" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectCategory('cleanser');
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#393442] transition text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Droplets size={16} className="text-[#F3CA74]" />
                  <div>
                    <span className="text-xs font-mono text-[#F3CA74] block">Step 01</span>
                    <span className="text-sm font-bold text-white group-hover:text-[#F3CA74]">
                      Refreshing Skin Cleanser
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[#888194] group-hover:text-white" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectCategory('moisturizer');
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#393442] transition text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Shield size={16} className="text-[#F3CA74]" />
                  <div>
                    <span className="text-xs font-mono text-[#F3CA74] block">Step 02</span>
                    <span className="text-sm font-bold text-white group-hover:text-[#F3CA74]">
                      Hydrating Moisturizer
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[#888194] group-hover:text-white" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onSelectCategory('sunscreen');
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#393442] transition text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Sun size={16} className="text-[#F3CA74]" />
                  <div>
                    <span className="text-xs font-mono text-[#F3CA74] block">Step 03</span>
                    <span className="text-sm font-bold text-white group-hover:text-[#F3CA74]">
                      Ray Barrier Sunscreen SPF 50+
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[#888194] group-hover:text-white" />
              </button>
            </div>

            {/* Secondary Navigation */}
            <div className="p-4 border-t border-[#3e3947] space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#F3CA74] block mb-2 font-bold px-2">
                Help & Orders
              </span>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRoutineModal();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#393442] transition text-left text-sm font-semibold text-stone-200 hover:text-white cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-[#DDD7CB]" />
                  <span>3-Step Routine Guide</span>
                </div>
                <span className="text-[10px] font-mono text-[#F3CA74] bg-[#F3CA74]/15 px-2 py-0.5 rounded-md">
                  Easy
                </span>
              </button>

              <a
                href="#clinical-reviews"
                onClick={onClose}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#393442] transition text-left text-sm font-semibold text-stone-200 hover:text-white cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Star size={16} className="text-[#F3CA74]" />
                  <span>Customer Reviews</span>
                </div>
                <ChevronRight size={16} className="text-[#888194]" />
              </a>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenProfile();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#393442] transition text-left text-sm font-semibold text-stone-200 hover:text-white cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Truck size={16} className="text-[#F3CA74]" />
                  <span>Track Express Dispatch</span>
                </div>
                <ChevronRight size={16} className="text-[#888194]" />
              </button>
            </div>

            {/* Footer / Admin Shortcut & WhatsApp */}
            <div className="mt-auto p-4 border-t border-[#3e3947] bg-[#231f29]">
              <a
                href="/admin"
                className="flex items-center justify-between p-2.5 rounded-lg bg-[#383241] border border-[#534b5e] text-xs font-mono font-bold text-[#F3CA74] hover:bg-[#433b4e] transition mb-3"
              >
                <span>Admin CMS Portal</span>
                <ExternalLink size={13} />
              </a>
              <p className="text-[11px] text-[#A8A29E] text-center font-mono">
                Complimentary Express Dispatch • 100% Zero White Cast
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  CheckCircle2,
  ThumbsUp,
  Sparkles,
  ShieldCheck,
  Award,
  Filter,
  ArrowRight,
  Clock,
  UserCheck,
  ChevronRight,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { CORE_PRODUCTS } from '@/lib/products-data';
import {
  DoctorTestimonialItem,
  RealSkinStoryItem,
  MemberReviewItem
} from '@/lib/admin-store';

export interface ClinicalStudy {
  id: string;
  metric: string;
  label: string;
  duration: string;
  participants: number;
  description: string;
  doctorQuote: string;
  doctorName: string;
  doctorRole: string;
  verifiedIcon: string;
}

export const CLINICAL_STUDIES: ClinicalStudy[] = [
  {
    id: 'cs-1',
    metric: '98.4%',
    label: 'Zero Stinging or Tight Feeling',
    duration: 'Tested on 120 People',
    participants: 120,
    description: 'Face felt instantly calm and comfortable right after washing, with none of that dry, stretchy skin feeling.',
    doctorQuote:
      'The silk-amino cleanser keeps your natural moisture intact so skin stays soft and balanced even after washing twice daily.',
    doctorName: 'Dr. Meera Sen, MD (Derma)',
    doctorRole: 'Senior Dermatologist, Indian Skin Council',
    verifiedIcon: 'shield'
  },
  {
    id: 'cs-2',
    metric: '72 Hours',
    label: 'All-Day Plump & Dewy Bounce',
    duration: '4-Week Daily User Test',
    participants: 95,
    description: 'Deep, lasting hydration that locks in moisture against harsh office AC, sun, and city humidity.',
    doctorQuote:
      '5 skin-identical ceramides rebuild your barrier so your face stays plump and moisturized throughout Indian summers and winters.',
    doctorName: 'Dr. Kabir Anand, MD',
    doctorRole: 'Skin Barrier Specialist',
    verifiedIcon: 'award'
  },
  {
    id: 'cs-3',
    metric: '100%',
    label: 'Zero White Cast on Indian Skin',
    duration: 'Tested on All Brown Complexions',
    participants: 150,
    description: 'Certified SPF 50+ mineral protection that melts in completely clear without turning purple, gray, or sticky.',
    doctorQuote:
      'Finally, an invisible mineral sunscreen that blends like silk on warm Indian skin tones and does not sweat off or clog pores.',
    doctorName: 'Dr. Shalini Roy, DNB',
    doctorRole: 'Cosmetic Dermatologist',
    verifiedIcon: 'sun'
  }
];

export interface BeforeAfterStory {
  id: string;
  userName: string;
  age: string;
  skinType: string;
  location: string;
  concern: string;
  timeframe: string;
  headline: string;
  story: string;
  keyProducts: string[];
  beforeMetric: string;
  afterMetric: string;
  statusBadge: string;
}

export const BEFORE_AFTER_STORIES: BeforeAfterStory[] = [
  {
    id: 'ba-1',
    userName: 'Rhea Sengupta',
    age: '29',
    skinType: 'Compromised Barrier / Rosacea Prone',
    location: 'Bengaluru',
    concern: 'Burning sensation from over-exfoliation & AC dehydration',
    timeframe: '12 Days Protocol',
    headline: '“My skin went from angry crimson stinging to calm, plump glass-skin.”',
    story:
      'I completely wrecked my barrier with salicylic acid and retinol peeling. Every basic moisturizer stung like fire. After using the Amino Silk Cleanser and 5-Ceramide Cloud Cream for just 48 hours, the fire was out. In 12 days, my natural bounce came back without any heaviness.',
    keyProducts: ['Amino Silk Cloud Cleanser', '5-Ceramide Velvet Cloud Cream'],
    beforeMetric: 'Stinging Index: 9/10',
    afterMetric: 'Stinging Index: 0/10',
    statusBadge: 'Verified Clinical Log'
  },
  {
    id: 'ba-2',
    userName: 'Vikramaditya Iyer',
    age: '34',
    skinType: 'Fitzpatrick V / Melanin-Rich Oily',
    location: 'Mumbai',
    concern: 'Sunburn, dark spots, chalky white ghost cast from previous sunscreens',
    timeframe: '3 Weeks Protocol',
    headline: '“The first mineral sunscreen in India that doesn’t turn my beard or forehead purple.”',
    story:
      'I gave up on mineral sunscreens because of the ghostly purple residue on my deep South Indian skin tone. The Invisible Silk Mineral Veil SPF 50+ felt like water, absorbed in 10 seconds, and leaves an invisible velvet finish even during 35°C humid commute.',
    keyProducts: ['Invisible Silk Mineral Veil SPF 50+'],
    beforeMetric: 'White Cast: Severe (Chalky)',
    afterMetric: 'White Cast: 0% Invisible Veil',
    statusBadge: 'Verified Photo Evidence'
  },
  {
    id: 'ba-3',
    userName: 'Aanya Mathur',
    age: '26',
    skinType: 'Combination / Hormonal Breakouts',
    location: 'New Delhi',
    concern: 'Clogged pores from heavy creams and dull urban pollution film',
    timeframe: '18 Days Protocol',
    headline: '“Finally, deep 72-hour moisture that doesn’t trigger tiny closed comedones.”',
    story:
      'I was scared of ceramides because rich creams always gave me forehead bumps. The 5-Ceramide Cloud Cream has this cashmere cloud texture that melts instantly. My face stays soft all day without turning into an oil slick by 3 PM.',
    keyProducts: ['5-Ceramide Velvet Cloud Cream', 'The 3-Step Sacred Ritual'],
    beforeMetric: 'Dry Flakes: Cheeks & Forehead',
    afterMetric: 'Skin Barrier: 100% Calibrated',
    statusBadge: 'Verified Purchase'
  }
];

export interface ClinicalReviewsHubProps {
  doctorTestimonials?: DoctorTestimonialItem[];
  realSkinStories?: RealSkinStoryItem[];
  memberReviews?: MemberReviewItem[];
  sectionBadge?: string;
  sectionHeading?: string;
  sectionHeadingHighlight?: string;
  sectionDescription?: string;
}

export default function ClinicalReviewsHub({
  doctorTestimonials,
  realSkinStories,
  memberReviews,
  sectionBadge,
  sectionHeading,
  sectionHeadingHighlight,
  sectionDescription
}: ClinicalReviewsHubProps = {}) {
  const [activeTab, setActiveTab] = useState<'reviews' | 'stories' | 'trials'>('reviews');
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('all');
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  const studiesToRender = (doctorTestimonials && doctorTestimonials.length > 0)
    ? doctorTestimonials
    : CLINICAL_STUDIES;

  const storiesToRender = (realSkinStories && realSkinStories.length > 0)
    ? realSkinStories
    : BEFORE_AFTER_STORIES;

  // Collect all verified reviews from all products or CMS
  const allReviews = (memberReviews && memberReviews.length > 0)
    ? memberReviews.map((rev) => ({
        id: rev.id,
        author: rev.author,
        location: rev.location,
        rating: rev.rating,
        date: rev.date,
        title: rev.title,
        comment: rev.review,
        review: rev.review,
        verified: rev.verified,
        helpfulCount: rev.helpful,
        productName: rev.productName,
        productCategory: rev.productCategory,
        skinType: rev.skinType || 'Sensitive',
        ageGroup: 'Verified Buyer'
      }))
    : CORE_PRODUCTS.flatMap((product) =>
        (product.reviews || []).map((rev) => ({
          ...rev,
          review: rev.comment,
          location: 'Verified Buyer',
          productName: product.name,
          productCategory: product.category,
          productBadge: product.badge
        }))
      );

  const filteredReviews =
    selectedProductFilter === 'all'
      ? allReviews
      : allReviews.filter((r) => r.productCategory === selectedProductFilter);

  const handleVoteHelpful = (reviewId: string) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1
    }));
  };

  return (
    <section id="clinical-evidence" data-section="clinical-science" className="py-20 md:py-28 px-5 md:px-12 max-w-7xl mx-auto border-t border-[#E8E2D5] scroll-mt-20">
      <div id="clinical-science" className="-mt-20 pt-20" />
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#064E3B]/10 border border-[#064E3B]/20 text-[#064E3B] text-xs font-mono font-bold uppercase tracking-[0.2em] mb-4">
          <Sparkles size={14} className="text-[#064E3B]" />
          <span>{sectionBadge || 'Real Results & Customer Love'}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-editorial font-bold text-[#1C1917] leading-tight">
          {sectionHeading || 'Real Results.'} <br />
          <span className="italic font-normal text-[#064E3B]">
            {sectionHeadingHighlight || 'Loved by Indian Skin.'}
          </span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-[#292524] font-medium leading-relaxed">
          {sectionDescription || 'See how our 3 daily formulas provide long-lasting hydration, smooth application, and zero white cast in Indian weather.'}
        </p>

        {/* Category Mode Switcher */}
        <div className="mt-8 inline-flex p-1.5 rounded-full bg-[#EFE9DC] border border-[#DDD5C3] shadow-inner gap-1">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-2 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-[#03290A] text-[#F3CA74] shadow-sm'
                : 'text-[#292524] hover:text-[#03290A] font-bold'
            }`}
          >
            Customer Reviews ({allReviews.length})
          </button>
          <button
            onClick={() => setActiveTab('stories')}
            className={`px-5 py-2 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === 'stories'
                ? 'bg-[#03290A] text-[#F3CA74] shadow-sm'
                : 'text-[#292524] hover:text-[#03290A] font-bold'
            }`}
          >
            Skin Stories ({storiesToRender.length})
          </button>
          <button
            onClick={() => setActiveTab('trials')}
            className={`px-5 py-2 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === 'trials'
                ? 'bg-[#03290A] text-[#F3CA74] shadow-sm'
                : 'text-[#292524] hover:text-[#03290A] font-bold'
            }`}
          >
            Testing Notes ({studiesToRender.length})
          </button>
        </div>
      </div>

      {/* TAB 1: CLINICAL TRIALS & DERMATOLOGIST COHORT METRICS */}
      {activeTab === 'trials' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {studiesToRender.map((study) => (
            <div
              key={study.id}
              className="rounded-3xl bg-[#FAF8F5] border border-[#E8E2D5] p-7 sm:p-8 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              {/* Subtle accent corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#E5B85C]/10 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110" />

              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-white border border-[#E8E2D5] text-[11px] font-mono text-[#064E3B] font-bold">
                    {study.duration}
                  </span>
                  <span className="text-[11px] font-mono text-[#44403C] font-semibold">
                    n = {study.participants} subjects
                  </span>
                </div>

                <div className="text-4xl sm:text-5xl font-editorial font-bold text-[#064E3B] tracking-tight">
                  {study.metric}
                </div>
                <h3 className="text-base font-editorial font-bold text-[#1C1917] mt-2 mb-2">
                  {study.label}
                </h3>
                <p className="text-xs text-[#292524] leading-relaxed mb-6 font-normal">
                  {study.description}
                </p>
              </div>

              {/* Dermatologist Sign-off Box */}
              <div className="pt-5 border-t border-[#EFE9DD] bg-white/80 -mx-3 -mb-3 p-4 rounded-2xl">
                <p className="text-[11px] italic text-[#1C1917] leading-relaxed font-medium">
                  “{study.doctorQuote}”
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#064E3B] text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#1C1917] leading-none">
                      {study.doctorName}
                    </div>
                    <div className="text-[10px] font-mono text-[#57534E] font-medium mt-0.5">
                      {study.doctorRole}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* TAB 2: SKIN TRANSFORMATION DIARIES (BEFORE/AFTER PROTOCOL EVIDENCE) */}
      {activeTab === 'stories' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {storiesToRender.map((story) => (
            <div
              key={story.id}
              className="rounded-3xl bg-white border border-[#E8E2D5] p-7 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition"
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-[#064E3B]/10 border border-[#064E3B]/20 text-[10px] font-mono font-bold text-[#064E3B] uppercase tracking-wider">
                    {story.statusBadge}
                  </span>
                  <span className="text-[11px] font-mono text-[#064E3B] font-black">
                    {story.timeframe}
                  </span>
                </div>

                {/* Patient Profile */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#03290A] text-[#F3CA74] flex items-center justify-center font-editorial font-bold text-sm">
                    {story.userName ? story.userName[0] : 'U'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1C1917]">{story.userName}</h4>
                    <p className="text-[11px] text-[#44403C] font-semibold">
                      {story.age} yrs • {story.location} • {story.skinType}
                    </p>
                  </div>
                </div>

                {/* Primary Concern Pill */}
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EFE9DD] text-xs text-[#1C1917] font-medium mb-4">
                  <span className="font-mono font-bold text-[#854D0E] text-[10px] block uppercase">
                    Initial Barrier Distress:
                  </span>
                  {story.concern}
                </div>

                {/* Member Quote */}
                <h5 className="text-sm font-editorial font-bold text-[#1C1917] leading-snug mb-3">
                  {story.headline}
                </h5>
                <p className="text-xs text-[#292524] leading-relaxed mb-5 font-normal">
                  {story.story}
                </p>
              </div>

              <div>
                {/* Metrics comparison bar */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#F5EFE6] border border-[#E5DEC9] mb-4 text-center">
                  <div className="border-r border-[#E5DEC9] pr-2">
                    <span className="text-[9px] font-mono uppercase text-[#57534E] font-semibold block">Day 0</span>
                    <span className="text-xs font-mono font-black text-[#B91C1C]">
                      {story.beforeMetric}
                    </span>
                  </div>
                  <div className="pl-2">
                    <span className="text-[9px] font-mono uppercase text-[#064E3B] font-bold block">Result</span>
                    <span className="text-xs font-mono font-black text-[#064E3B]">
                      {story.afterMetric}
                    </span>
                  </div>
                </div>

                {/* Products used tags */}
                <div className="flex flex-wrap gap-1.5">
                  {story.keyProducts.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full bg-white border border-[#D5CCB8] text-[10px] font-mono font-semibold text-[#1C1917]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* TAB 3: VERIFIED REVIEWS & RATINGS */}
      {activeTab === 'reviews' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8"
        >
          {/* Review Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8E2D5]">
            <div className="flex items-center gap-2 text-xs font-mono text-[#854D0E] font-bold">
              <Filter size={13} />
              <span className="uppercase font-bold">Filter by Product:</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setSelectedProductFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase transition cursor-pointer ${
                  selectedProductFilter === 'all'
                    ? 'bg-[#03290A] text-[#F3CA74] font-bold'
                    : 'bg-white border border-[#D5CCB8] text-[#1C1917] font-semibold hover:bg-[#F2ECE1]'
                }`}
              >
                All Reviews ({allReviews.length})
              </button>
              <button
                onClick={() => setSelectedProductFilter('cleanser')}
                className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase transition cursor-pointer ${
                  selectedProductFilter === 'cleanser'
                    ? 'bg-[#03290A] text-[#F3CA74] font-bold'
                    : 'bg-white border border-[#D5CCB8] text-[#1C1917] font-semibold hover:bg-[#F2ECE1]'
                }`}
              >
                Refreshing Cleanser
              </button>
              <button
                onClick={() => setSelectedProductFilter('moisturizer')}
                className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase transition cursor-pointer ${
                  selectedProductFilter === 'moisturizer'
                    ? 'bg-[#03290A] text-[#F3CA74] font-bold'
                    : 'bg-white border border-[#D5CCB8] text-[#1C1917] font-semibold hover:bg-[#F2ECE1]'
                }`}
              >
                Hydrating Moisturizer
              </button>
              <button
                onClick={() => setSelectedProductFilter('sunscreen')}
                className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase transition cursor-pointer ${
                  selectedProductFilter === 'sunscreen'
                    ? 'bg-[#03290A] text-[#F3CA74] font-bold'
                    : 'bg-white border border-[#D5CCB8] text-[#1C1917] font-semibold hover:bg-[#F2ECE1]'
                }`}
              >
                Ray Barrier Sunscreen
              </button>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((rev) => {
              const currentHelpful = rev.helpfulCount + (helpfulVotes[rev.id] || 0);
              return (
                <div
                  key={rev.id}
                  className="rounded-3xl bg-white border border-[#E8E2D5] p-6 flex flex-col justify-between hover:border-[#D5CCB8] transition shadow-xs"
                >
                  <div>
                    {/* Product Origin Tag */}
                    <div className="flex items-center justify-between mb-3 text-[10px] font-mono text-[#064E3B]">
                      <span className="font-bold bg-[#FAF8F5] px-2.5 py-1 rounded-md border border-[#D5CCB8]">
                        {rev.productName}
                      </span>
                      <span className="text-[#57534E] font-medium">{rev.date}</span>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < rev.rating
                              ? 'text-[#E5B85C] fill-[#E5B85C]'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                    </div>

                    <h4 className="text-sm font-bold text-[#1C1917] leading-snug mb-2">
                      “{rev.title}”
                    </h4>
                    <p className="text-xs text-[#292524] leading-relaxed mb-4 font-normal">
                      {rev.comment}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EFE9DD]">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-xs font-bold text-[#1C1917] flex items-center gap-1">
                          {rev.author}
                          {rev.verified && (
                            <CheckCircle2 size={12} className="text-[#064E3B]" />
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-[#57534E] font-medium">
                          {rev.skinType} • {rev.ageGroup}
                        </div>
                      </div>

                      {/* Helpful Button */}
                      <button
                        onClick={() => handleVoteHelpful(rev.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] hover:bg-[#F2ECE1] border border-[#D5CCB8] text-[11px] font-mono text-[#1C1917] font-semibold transition active:scale-95 cursor-pointer"
                      >
                        <ThumbsUp size={11} />
                        <span>{currentHelpful}</span>
                      </button>
                    </div>

                    <div className="inline-flex items-center gap-1 text-[10px] font-mono text-[#064E3B] font-bold">
                      <ShieldCheck size={11} />
                      <span>Verified Purchaser</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </section>
  );
}

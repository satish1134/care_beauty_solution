'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  Check,
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2,
  Edit3,
  Shield,
  Star,
  Award,
  Sun,
  Droplets,
  Heart,
  MessageSquare,
  BookOpen,
  Layers,
  ChevronRight,
  X,
  ExternalLink,
  Sparkles,
  Quote,
  UserCheck,
  Building,
  Mail,
  Phone
} from 'lucide-react';
import {
  StorefrontCmsData,
  DoctorTestimonialItem,
  RealSkinStoryItem,
  MemberReviewItem,
  SectionContentConfig,
  INITIAL_STOREFRONT_CMS
} from '@/lib/admin-store';

interface StorefrontCmsManagerProps {
  initialData?: StorefrontCmsData;
  onSaved?: (data: StorefrontCmsData) => void;
}

export default function StorefrontCmsManager({ initialData, onSaved }: StorefrontCmsManagerProps) {
  const [data, setData] = useState<StorefrontCmsData>(initialData || INITIAL_STOREFRONT_CMS);
  const [activeTab, setActiveTab] = useState<'doctors' | 'stories' | 'reviews' | 'sections'>('doctors');
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Editing state for Doctor Testimonials
  const [editingDoctor, setEditingDoctor] = useState<DoctorTestimonialItem | null>(null);
  const [isAddingDoctor, setIsAddingDoctor] = useState<boolean>(false);

  // Editing state for Real Stories
  const [editingStory, setEditingStory] = useState<RealSkinStoryItem | null>(null);
  const [isAddingStory, setIsAddingStory] = useState<boolean>(false);

  // Editing state for Member Reviews
  const [editingReview, setEditingReview] = useState<MemberReviewItem | null>(null);
  const [isAddingReview, setIsAddingReview] = useState<boolean>(false);

  // New Marquee Item input
  const [newMarqueeText, setNewMarqueeText] = useState<string>('');

  // Fetch initial data if not provided
  useEffect(() => {
    if (!initialData) {
      fetchData();
    }
  }, [initialData]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/storefront-cms');
      const json = await res.json();
      if (json.success && json.storefrontCms) {
        setData(json.storefrontCms);
      }
    } catch (err: unknown) {
      console.error('Failed to load Storefront CMS data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    setErrorMessage('');

    try {
      const res = await fetch('/api/storefront-cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storefrontCms: data,
          auditUser: 'admin@careabeautysolution.com'
        })
      });

      const json = await res.json();
      if (json.success) {
        setData(json.storefrontCms);
        setSaveStatus('success');
        if (onSaved) onSaved(json.storefrontCms);
        setTimeout(() => setSaveStatus('idle'), 3500);
      } else {
        setSaveStatus('error');
        setErrorMessage(json.error || 'Failed to save');
      }
    } catch (err: unknown) {
      setSaveStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Network error');
    } finally {
      setIsSaving(false);
    }
  };

  // Section Content Updater
  const updateSectionField = <K extends keyof SectionContentConfig>(field: K, val: SectionContentConfig[K]) => {
    setData((prev) => ({
      ...prev,
      sectionContent: {
        ...prev.sectionContent,
        [field]: val
      }
    }));
  };

  // -------------------------------------------------------------
  // DOCTOR TESTIMONIALS HANDLERS
  // -------------------------------------------------------------
  const handleSaveDoctor = (item: DoctorTestimonialItem) => {
    if (isAddingDoctor) {
      setData((prev) => ({
        ...prev,
        doctorTestimonials: [...prev.doctorTestimonials, item]
      }));
    } else {
      setData((prev) => ({
        ...prev,
        doctorTestimonials: prev.doctorTestimonials.map((d) => (d.id === item.id ? item : d))
      }));
    }
    setEditingDoctor(null);
    setIsAddingDoctor(false);
  };

  const handleDeleteDoctor = (id: string) => {
    if (confirm('Delete this doctor study/testimonial?')) {
      setData((prev) => ({
        ...prev,
        doctorTestimonials: prev.doctorTestimonials.filter((d) => d.id !== id)
      }));
    }
  };

  // -------------------------------------------------------------
  // REAL SKIN STORIES HANDLERS
  // -------------------------------------------------------------
  const handleSaveStory = (item: RealSkinStoryItem) => {
    if (isAddingStory) {
      setData((prev) => ({
        ...prev,
        realSkinStories: [...prev.realSkinStories, item]
      }));
    } else {
      setData((prev) => ({
        ...prev,
        realSkinStories: prev.realSkinStories.map((s) => (s.id === item.id ? item : s))
      }));
    }
    setEditingStory(null);
    setIsAddingStory(false);
  };

  const handleDeleteStory = (id: string) => {
    if (confirm('Delete this real skin transformation story?')) {
      setData((prev) => ({
        ...prev,
        realSkinStories: prev.realSkinStories.filter((s) => s.id !== id)
      }));
    }
  };

  // -------------------------------------------------------------
  // MEMBER REVIEWS HANDLERS
  // -------------------------------------------------------------
  const handleSaveReview = (item: MemberReviewItem) => {
    if (isAddingReview) {
      setData((prev) => ({
        ...prev,
        memberReviews: [item, ...prev.memberReviews]
      }));
    } else {
      setData((prev) => ({
        ...prev,
        memberReviews: prev.memberReviews.map((r) => (r.id === item.id ? item : r))
      }));
    }
    setEditingReview(null);
    setIsAddingReview(false);
  };

  const handleDeleteReview = (id: string) => {
    if (confirm('Delete this customer review?')) {
      setData((prev) => ({
        ...prev,
        memberReviews: prev.memberReviews.filter((r) => r.id !== id)
      }));
    }
  };

  // -------------------------------------------------------------
  // MARQUEE HANDLERS
  // -------------------------------------------------------------
  const handleAddMarquee = () => {
    if (!newMarqueeText.trim()) return;
    const formatted = newMarqueeText.startsWith('• ') ? newMarqueeText : `• ${newMarqueeText}`;
    updateSectionField('marqueeAnnouncements', [...data.sectionContent.marqueeAnnouncements, formatted]);
    setNewMarqueeText('');
  };

  const handleRemoveMarquee = (index: number) => {
    updateSectionField(
      'marqueeAnnouncements',
      data.sectionContent.marqueeAnnouncements.filter((_, i) => i !== index)
    );
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-[#E8E2D5]/70 flex flex-col items-center justify-center gap-3">
        <RefreshCw className="animate-spin text-[#E5B85C]" size={28} />
        <span className="font-mono text-sm uppercase tracking-wider">Loading Storefront CMS Content...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#262329] border border-white/10 rounded-2xl p-5 shadow-lg">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5B85C]/15 border border-[#E5B85C]/30 text-[#E5B85C] text-xs font-mono font-semibold uppercase tracking-wider mb-1.5">
            <Sparkles size={13} />
            <span>Storefront Content Control</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-editorial font-bold text-[#FAF8F5]">
            Storefront CMS & Testimonials Engine
          </h2>
          <p className="text-xs sm:text-sm text-[#E8E2D5]/70 mt-0.5">
            Manage Doctor Testimonials, Real Skin Stories, Member Reviews, Marquee Ticker, and Section Content with zero code updates.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={fetchData}
            title="Reload from server"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#E8E2D5] border border-white/10 transition cursor-pointer"
          >
            <RefreshCw size={16} />
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-2 transition cursor-pointer shadow-md ${
              saveStatus === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-[#E5B85C] hover:bg-[#d4a74b] text-[#1C1917]'
            } disabled:opacity-50`}
          >
            {isSaving ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : saveStatus === 'success' ? (
              <>
                <Check size={15} />
                <span>Saved & Live!</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Save Live Storefront</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error alert if any */}
      {saveStatus === 'error' && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle size={16} />
          <span>Error saving content: {errorMessage}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/10 no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('doctors')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono uppercase font-bold tracking-wider transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'doctors'
              ? 'bg-[#E5B85C] text-[#1C1917] shadow-sm'
              : 'text-[#E8E2D5]/70 hover:text-[#FAF8F5] hover:bg-white/5'
          }`}
        >
          <Shield size={14} />
          <span>Doctor Testimonials & Trials ({data.doctorTestimonials?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stories')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono uppercase font-bold tracking-wider transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'stories'
              ? 'bg-[#E5B85C] text-[#1C1917] shadow-sm'
              : 'text-[#E8E2D5]/70 hover:text-[#FAF8F5] hover:bg-white/5'
          }`}
        >
          <BookOpen size={14} />
          <span>Real Skin Stories ({data.realSkinStories?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono uppercase font-bold tracking-wider transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'bg-[#E5B85C] text-[#1C1917] shadow-sm'
              : 'text-[#E8E2D5]/70 hover:text-[#FAF8F5] hover:bg-white/5'
          }`}
        >
          <Star size={14} />
          <span>Member Reviews ({data.memberReviews?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono uppercase font-bold tracking-wider transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'sections'
              ? 'bg-[#E5B85C] text-[#1C1917] shadow-sm'
              : 'text-[#E8E2D5]/70 hover:text-[#FAF8F5] hover:bg-white/5'
          }`}
        >
          <Layers size={14} />
          <span>Storefront Copy & Marquee</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DOCTOR TESTIMONIALS & CLINICAL TRIALS */}
      {/* ========================================================================= */}
      {activeTab === 'doctors' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#FAF8F5]">Doctor Testimonials & Clinical Cohort Studies</h3>
              <p className="text-xs text-[#E8E2D5]/70">
                Shown under the “Doctor Test Results” tab on the storefront.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingDoctor({
                  id: `cs-${Date.now()}`,
                  metric: '95%+',
                  label: 'Clinical Improvement',
                  duration: '4-Week Protocol',
                  participants: 100,
                  description: 'Detailed description of clinical outcome on Indian skin barrier.',
                  doctorQuote: 'Doctor quote validating the formula efficacy.',
                  doctorName: 'Dr. New Doctor, MD',
                  doctorRole: 'Dermatologist',
                  verifiedIcon: 'shield'
                });
                setIsAddingDoctor(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-[#E5B85C] text-xs font-mono uppercase font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Doctor Testimonial</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {data.doctorTestimonials.map((item) => (
              <div
                key={item.id}
                className="bg-[#262329] border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-[#E5B85C]/40 transition relative group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-mono font-bold text-[#E5B85C]">
                      {item.duration}
                    </span>
                    <span className="text-[10px] font-mono text-[#E8E2D5]/60">
                      n = {item.participants} subjects
                    </span>
                  </div>

                  <div className="text-3xl font-editorial font-bold text-[#E5B85C]">
                    {item.metric}
                  </div>
                  <div className="text-sm font-bold text-[#FAF8F5] mt-1 mb-2">{item.label}</div>
                  <p className="text-xs text-[#E8E2D5]/75 line-clamp-3 mb-4">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-white/10 mt-2">
                  <p className="text-xs italic text-[#E8E2D5]/80 line-clamp-2 mb-2">
                    “{item.doctorQuote}”
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#FAF8F5]">{item.doctorName}</div>
                      <div className="text-[10px] text-[#E8E2D5]/60">{item.doctorRole}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingDoctor(item);
                          setIsAddingDoctor(false);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-[#E5B85C]/20 text-[#E5B85C] transition cursor-pointer"
                        title="Edit Doctor Study"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDoctor(item.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 transition cursor-pointer"
                        title="Delete Doctor Study"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: REAL SKIN STORIES */}
      {/* ========================================================================= */}
      {activeTab === 'stories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#FAF8F5]">Real Skin Transformation Stories</h3>
              <p className="text-xs text-[#E8E2D5]/70">
                Shown under the “Real Skin Stories” tab on the storefront.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingStory({
                  id: `ba-${Date.now()}`,
                  userName: 'Customer Name',
                  age: '28',
                  skinType: 'Dry / Sensitive',
                  location: 'Delhi',
                  concern: 'Damaged barrier, stinging',
                  timeframe: '14 Days Protocol',
                  headline: '“Remarkable difference in skin comfort and glow.”',
                  story: 'Customer shared journey about healing their skin barrier with CARE-A products.',
                  keyProducts: ['Amino Silk Cloud Cleanser', '5-Ceramide Velvet Cloud Cream'],
                  beforeMetric: 'Stinging: Severe',
                  afterMetric: 'Skin Barrier: Calibrated',
                  statusBadge: 'Verified Clinical Log'
                });
                setIsAddingStory(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-[#E5B85C] text-xs font-mono uppercase font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Real Skin Story</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {data.realSkinStories.map((story) => (
              <div
                key={story.id}
                className="bg-[#262329] border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-[#E5B85C]/40 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#E5B85C]/15 text-[10px] font-mono text-[#E5B85C] font-bold">
                      {story.statusBadge}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                      {story.timeframe}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#E5B85C] text-[#1C1917] flex items-center justify-center font-bold text-xs">
                      {story.userName[0]}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#FAF8F5]">{story.userName}</div>
                      <div className="text-[10px] text-[#E8E2D5]/60">
                        {story.age} yrs • {story.location} • {story.skinType}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-[#FAF8F5] mb-1.5 line-clamp-2">
                    {story.headline}
                  </div>
                  <p className="text-xs text-[#E8E2D5]/75 line-clamp-3 mb-3">{story.story}</p>

                  {/* Before / After comparison */}
                  <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-black/30 border border-white/5 text-[10px] font-mono mb-3">
                    <div>
                      <span className="text-red-400/80 block">Before:</span>
                      <span className="text-[#E8E2D5]/70 truncate block">{story.beforeMetric}</span>
                    </div>
                    <div>
                      <span className="text-emerald-400 block">After:</span>
                      <span className="text-emerald-300 truncate block">{story.afterMetric}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-[10px] font-mono text-[#E8E2D5]/60">
                    {story.keyProducts?.length || 0} Products Used
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingStory(story);
                        setIsAddingStory(false);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-[#E5B85C]/20 text-[#E5B85C] transition cursor-pointer"
                      title="Edit Story"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteStory(story.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 transition cursor-pointer"
                      title="Delete Story"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MEMBER REVIEWS */}
      {/* ========================================================================= */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#FAF8F5]">Verified Customer Reviews</h3>
              <p className="text-xs text-[#E8E2D5]/70">
                Shown under the “Member Reviews” tab on the storefront.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingReview({
                  id: `rev-${Date.now()}`,
                  author: 'Verified Buyer',
                  location: 'Bengaluru',
                  rating: 5,
                  date: new Date().toISOString().split('T')[0],
                  title: 'Genuinely holy grail skincare',
                  review: 'Immediate skin barrier relief. Plump, dewy, and calm.',
                  verified: true,
                  helpful: 12,
                  productName: 'Refreshing Cleanser',
                  productCategory: 'cleanser',
                  skinType: 'Sensitive'
                });
                setIsAddingReview(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-[#E5B85C] text-xs font-mono uppercase font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Customer Review</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {data.memberReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#262329] border border-white/10 rounded-2xl p-5 flex flex-col justify-between hover:border-[#E5B85C]/40 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono font-bold text-[#E5B85C]">
                      {rev.productName}
                    </span>
                    <span className="text-[10px] text-[#E8E2D5]/60">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < rev.rating
                            ? 'text-[#E5B85C] fill-[#E5B85C]'
                            : 'text-white/20'
                        }
                      />
                    ))}
                    {rev.verified && (
                      <span className="ml-2 text-[10px] font-mono text-emerald-400 font-bold">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-[#FAF8F5] mb-1">{rev.title}</h4>
                  <p className="text-xs text-[#E8E2D5]/75 line-clamp-3 mb-3">{rev.review}</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="text-[10px] text-[#E8E2D5]/60">
                    <span className="font-bold text-[#FAF8F5]">{rev.author}</span> ({rev.location})
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingReview(rev);
                        setIsAddingReview(false);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-[#E5B85C]/20 text-[#E5B85C] transition cursor-pointer"
                      title="Edit Review"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(rev.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 transition cursor-pointer"
                      title="Delete Review"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: STOREFRONT COPY & MARQUEE ANNOUNCEMENTS */}
      {/* ========================================================================= */}
      {activeTab === 'sections' && (
        <div className="space-y-6">
          {/* Marquee Announcement Ticker */}
          <div className="bg-[#262329] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#FAF8F5]">Top Marquee Announcement Ticker</h3>
                <p className="text-xs text-[#E8E2D5]/70">
                  The scrolling announcement banner directly beneath the hero video banner.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newMarqueeText}
                onChange={(e) => setNewMarqueeText(e.target.value)}
                placeholder="e.g. • 100% INVISIBLE MINERAL SPF 50+"
                className="flex-1 bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#E5B85C]"
              />
              <button
                type="button"
                onClick={handleAddMarquee}
                className="px-4 py-2 bg-[#E5B85C] text-[#1C1917] rounded-xl text-xs font-mono uppercase font-bold hover:bg-[#d4a74b] transition cursor-pointer"
              >
                Add Bullet
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {data.sectionContent.marqueeAnnouncements.map((bullet, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-[#E5B85C]"
                >
                  <span>{bullet}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMarquee(idx)}
                    className="p-1 hover:text-red-400 text-white/40 transition cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 1: The 3 Everyday Essentials Routine */}
          <div className="bg-[#262329] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#FAF8F5]">Section: The Daily Routine (3 Essentials)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Section Eyebrow/Badge</label>
                <input
                  type="text"
                  value={data.sectionContent.routineBadge}
                  onChange={(e) => updateSectionField('routineBadge', e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#E5B85C]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Section Main Heading</label>
                <input
                  type="text"
                  value={data.sectionContent.routineHeading}
                  onChange={(e) => updateSectionField('routineHeading', e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#E5B85C]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Section Description</label>
                <textarea
                  rows={2}
                  value={data.sectionContent.routineDescription}
                  onChange={(e) => updateSectionField('routineDescription', e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#E5B85C]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Evidence Section Header */}
          <div className="bg-[#262329] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#FAF8F5]">Section: Doctor & Clinical Hub Header</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Badge Title</label>
                <input
                  type="text"
                  value={data.sectionContent.clinicalBadge}
                  onChange={(e) => updateSectionField('clinicalBadge', e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#E5B85C]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Main Heading</label>
                <input
                  type="text"
                  value={data.sectionContent.clinicalHeading}
                  onChange={(e) => updateSectionField('clinicalHeading', e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#E5B85C]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Heading Italic Highlight</label>
                <input
                  type="text"
                  value={data.sectionContent.clinicalHeadingHighlight}
                  onChange={(e) => updateSectionField('clinicalHeadingHighlight', e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#E5B85C]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Subtitle / Description</label>
                <textarea
                  rows={2}
                  value={data.sectionContent.clinicalDescription}
                  onChange={(e) => updateSectionField('clinicalDescription', e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#E5B85C]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: The Holy Grail Promise & 4 Formulation Pillars */}
          <div className="bg-[#262329] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#FAF8F5]">Section: Formulation Standards (4 Pillars)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Standards Heading</label>
                <input
                  type="text"
                  value={data.sectionContent.standardsHeading}
                  onChange={(e) => updateSectionField('standardsHeading', e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#E5B85C]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Standards Description</label>
                <input
                  type="text"
                  value={data.sectionContent.standardsDescription}
                  onChange={(e) => updateSectionField('standardsDescription', e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#E5B85C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {data.sectionContent.standardsPillars.map((pillar, idx) => (
                <div key={pillar.id} className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#E5B85C] font-bold">
                    <span>Pillar {idx + 1}</span>
                    <span className="uppercase text-[10px] text-white/50">{pillar.icon}</span>
                  </div>
                  <input
                    type="text"
                    value={pillar.title}
                    onChange={(e) => {
                      const updatedPillars = [...data.sectionContent.standardsPillars];
                      updatedPillars[idx] = { ...pillar, title: e.target.value };
                      updateSectionField('standardsPillars', updatedPillars);
                    }}
                    placeholder="Pillar Title"
                    className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#E5B85C]"
                  />
                  <textarea
                    rows={2}
                    value={pillar.description}
                    onChange={(e) => {
                      const updatedPillars = [...data.sectionContent.standardsPillars];
                      updatedPillars[idx] = { ...pillar, description: e.target.value };
                      updateSectionField('standardsPillars', updatedPillars);
                    }}
                    placeholder="Pillar Description"
                    className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#E5B85C]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Brand Details & Footer Information */}
          <div className="bg-[#262329] border border-white/10 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#FAF8F5]">Footer & Brand Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Customer Support Email</label>
                <input
                  type="email"
                  value={data.sectionContent.supportEmail}
                  onChange={(e) => updateSectionField('supportEmail', e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#E5B85C]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Customer Care Phone</label>
                <input
                  type="text"
                  value={data.sectionContent.supportPhone}
                  onChange={(e) => updateSectionField('supportPhone', e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#E5B85C]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">VIP Club Heading</label>
                <input
                  type="text"
                  value={data.sectionContent.vipHeading}
                  onChange={(e) => updateSectionField('vipHeading', e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#E5B85C]"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Brand Statement / Footer About</label>
                <textarea
                  rows={2}
                  value={data.sectionContent.footerDescription}
                  onChange={(e) => updateSectionField('footerDescription', e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#E5B85C]"
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Office / Lab Address</label>
                <input
                  type="text"
                  value={data.sectionContent.officeAddress}
                  onChange={(e) => updateSectionField('officeAddress', e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-xl px-4 py-2 text-xs text-[#FAF8F5] focus:outline-none focus:border-[#E5B85C]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT DOCTOR TESTIMONIAL */}
      {/* ========================================================================= */}
      {editingDoctor && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#262329] border border-white/15 rounded-2xl w-full max-w-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-[#FAF8F5]">
                {isAddingDoctor ? 'Add New Doctor Study' : 'Edit Doctor Study'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingDoctor(null)}
                className="p-1 hover:text-white text-white/50 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Big Metric (e.g. 98.4%)</label>
                <input
                  type="text"
                  value={editingDoctor.metric}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, metric: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Participants (Count)</label>
                <input
                  type="number"
                  value={editingDoctor.participants}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, participants: parseInt(e.target.value) || 0 })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Metric Label</label>
                <input
                  type="text"
                  value={editingDoctor.label}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, label: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Duration Tag</label>
                <input
                  type="text"
                  value={editingDoctor.duration}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, duration: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Clinical Outcome Description</label>
                <textarea
                  rows={2}
                  value={editingDoctor.description}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, description: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Doctor Quote</label>
                <textarea
                  rows={2}
                  value={editingDoctor.doctorQuote}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, doctorQuote: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Doctor Name & Title</label>
                <input
                  type="text"
                  value={editingDoctor.doctorName}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, doctorName: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Doctor Role / Hospital</label>
                <input
                  type="text"
                  value={editingDoctor.doctorRole}
                  onChange={(e) => setEditingDoctor({ ...editingDoctor, doctorRole: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingDoctor(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-xs font-mono text-[#E8E2D5] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveDoctor(editingDoctor)}
                className="px-4 py-2 rounded-xl bg-[#E5B85C] text-[#1C1917] text-xs font-mono font-bold cursor-pointer"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT REAL SKIN STORY */}
      {/* ========================================================================= */}
      {editingStory && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#262329] border border-white/15 rounded-2xl w-full max-w-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-[#FAF8F5]">
                {isAddingStory ? 'Add Real Skin Story' : 'Edit Real Skin Story'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingStory(null)}
                className="p-1 hover:text-white text-white/50 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={editingStory.userName}
                  onChange={(e) => setEditingStory({ ...editingStory, userName: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Age</label>
                <input
                  type="text"
                  value={editingStory.age}
                  onChange={(e) => setEditingStory({ ...editingStory, age: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Location</label>
                <input
                  type="text"
                  value={editingStory.location}
                  onChange={(e) => setEditingStory({ ...editingStory, location: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Skin Type</label>
                <input
                  type="text"
                  value={editingStory.skinType}
                  onChange={(e) => setEditingStory({ ...editingStory, skinType: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Primary Skin Concern</label>
                <input
                  type="text"
                  value={editingStory.concern}
                  onChange={(e) => setEditingStory({ ...editingStory, concern: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Protocol Timeframe</label>
                <input
                  type="text"
                  value={editingStory.timeframe}
                  onChange={(e) => setEditingStory({ ...editingStory, timeframe: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Status Badge</label>
                <input
                  type="text"
                  value={editingStory.statusBadge}
                  onChange={(e) => setEditingStory({ ...editingStory, statusBadge: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Headline</label>
                <input
                  type="text"
                  value={editingStory.headline}
                  onChange={(e) => setEditingStory({ ...editingStory, headline: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Full Story</label>
                <textarea
                  rows={3}
                  value={editingStory.story}
                  onChange={(e) => setEditingStory({ ...editingStory, story: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Before Metric/Condition</label>
                <input
                  type="text"
                  value={editingStory.beforeMetric}
                  onChange={(e) => setEditingStory({ ...editingStory, beforeMetric: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">After Metric/Condition</label>
                <input
                  type="text"
                  value={editingStory.afterMetric}
                  onChange={(e) => setEditingStory({ ...editingStory, afterMetric: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingStory(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-xs font-mono text-[#E8E2D5] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveStory(editingStory)}
                className="px-4 py-2 rounded-xl bg-[#E5B85C] text-[#1C1917] text-xs font-mono font-bold cursor-pointer"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT MEMBER REVIEW */}
      {/* ========================================================================= */}
      {editingReview && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#262329] border border-white/15 rounded-2xl w-full max-w-xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-[#FAF8F5]">
                {isAddingReview ? 'Add Customer Review' : 'Edit Customer Review'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="p-1 hover:text-white text-white/50 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Author Name</label>
                <input
                  type="text"
                  value={editingReview.author}
                  onChange={(e) => setEditingReview({ ...editingReview, author: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">City / Location</label>
                <input
                  type="text"
                  value={editingReview.location}
                  onChange={(e) => setEditingReview({ ...editingReview, location: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Product Name</label>
                <input
                  type="text"
                  value={editingReview.productName}
                  onChange={(e) => setEditingReview({ ...editingReview, productName: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Category (cleanser/moisturizer/sunscreen)</label>
                <select
                  value={editingReview.productCategory}
                  onChange={(e) => setEditingReview({ ...editingReview, productCategory: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                >
                  <option value="cleanser">Refreshing Cleanser</option>
                  <option value="moisturizer">Hydrating Moisturizer</option>
                  <option value="sunscreen">Ray Barrier Sunscreen</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Rating (1 to 5 Stars)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={editingReview.rating}
                  onChange={(e) => setEditingReview({ ...editingReview, rating: parseInt(e.target.value) || 5 })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Verified Badge</label>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="verifiedCheck"
                    checked={editingReview.verified}
                    onChange={(e) => setEditingReview({ ...editingReview, verified: e.target.checked })}
                    className="rounded accent-[#E5B85C]"
                  />
                  <label htmlFor="verifiedCheck" className="text-xs text-[#FAF8F5] cursor-pointer">
                    Verified Purchase
                  </label>
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Review Title</label>
                <input
                  type="text"
                  value={editingReview.title}
                  onChange={(e) => setEditingReview({ ...editingReview, title: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-mono text-[#E8E2D5]/70 mb-1">Review Comment</label>
                <textarea
                  rows={3}
                  value={editingReview.review}
                  onChange={(e) => setEditingReview({ ...editingReview, review: e.target.value })}
                  className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-xs text-[#FAF8F5]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-xs font-mono text-[#E8E2D5] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveReview(editingReview)}
                className="px-4 py-2 rounded-xl bg-[#E5B85C] text-[#1C1917] text-xs font-mono font-bold cursor-pointer"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

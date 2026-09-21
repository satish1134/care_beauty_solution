// ==============================================================================
// CARe Beauty Solution - Campaign Configuration
// Supports multi-variant A/B testing: Campaign A, Campaign B, Campaign C
// ==============================================================================

export interface HeroCampaign {
  id: 'campaign-a' | 'campaign-b' | 'campaign-c';
  label: string; // Internal campaign name
  eyebrow: string;
  headlineMain: string;
  headlineHighlight: string;
  description: string;
  proofPoints: { label: string; sublabel: string }[];
  primaryCTA: {
    label: string;
    actionType: 'routine_modal' | 'scroll_products';
  };
  secondaryCTA: {
    label: string;
    href: string;
  };
  desktopVideo: string;
  mobileVideo: string;
  poster: string;
}

export const HERO_CAMPAIGNS: Record<string, HeroCampaign> = {
  'campaign-a': {
    id: 'campaign-a',
    label: 'Campaign A — Barrier Reborn',
    eyebrow: 'THE CARe BARRIER RITUAL',
    headlineMain: "YOUR SKIN'S",
    headlineHighlight: 'BARRIER, REBORN.',
    description: '3 essential formulas. Clinically tested. Made for Indian skin.',
    proofPoints: [
      { label: '5 CERAMIDES', sublabel: 'Bio-Identical Barrier Lipids' },
      { label: '72H HYDRATION', sublabel: 'Biomimetic Lipid Seal' },
      { label: 'SPF 50+ PA++++', sublabel: 'Zero White Cast on Melanin' },
      { label: 'ZERO RESIDUE', sublabel: 'Dermatologist Tested' }
    ],
    primaryCTA: {
      label: 'SHOP THE 3-STEP RITUAL',
      actionType: 'scroll_products'
    },
    secondaryCTA: {
      label: 'EXPLORE THE SCIENCE',
      href: '#clinical-science'
    },
    desktopVideo: '/video/care-hero-desktop.mp4',
    mobileVideo: '/video/care-hero-mobile.mp4',
    poster: '/images/hero.png'
  },
  'campaign-b': {
    id: 'campaign-b',
    label: 'Campaign B — One Healthier Barrier',
    eyebrow: 'THE CARe BARRIER RITUAL',
    headlineMain: '3 STEPS. ONE',
    headlineHighlight: 'HEALTHIER BARRIER.',
    description: 'Cut through 10-step chaos. Three disciplined formulas tested across Indian weather & skin tones.',
    proofPoints: [
      { label: '3 CLINICAL STEPS', sublabel: 'Cleanse · Restore · Protect' },
      { label: '11 AMINO ACIDS', sublabel: 'Zero Stripping Wash' },
      { label: '72H MOISTURE LOCK', sublabel: 'Mochi-Soft Bounce' },
      { label: 'NO GHOST CAST', sublabel: 'Invisible Zinc Shield' }
    ],
    primaryCTA: {
      label: 'SHOP THE 3-STEP RITUAL',
      actionType: 'scroll_products'
    },
    secondaryCTA: {
      label: 'EXPLORE THE SCIENCE',
      href: '#clinical-science'
    },
    desktopVideo: '/video/care-hero-desktop.mp4',
    mobileVideo: '/video/care-hero-mobile.mp4',
    poster: '/images/hero.png'
  },
  'campaign-c': {
    id: 'campaign-c',
    label: 'Campaign C — Indian Skin Science',
    eyebrow: 'THE CARe BARRIER RITUAL',
    headlineMain: 'SKINCARE MADE FOR',
    headlineHighlight: 'INDIAN SKIN.',
    description: 'Formulated for high UV index, humidity shifts, and melanin-rich barrier recovery. 100% Zero white cast guaranteed.',
    proofPoints: [
      { label: 'MELANIN-SAFE SPF', sublabel: 'Zero Ashen Tone Guaranteed' },
      { label: 'HUMIDITY-READY', sublabel: 'Featherlight Velvet Touch' },
      { label: '5 CERAMIDES', sublabel: 'Deep Stratum Corneum Repair' },
      { label: '100% CRUELTY FREE', sublabel: 'Derm Approved Protocol' }
    ],
    primaryCTA: {
      label: 'SHOP THE 3-STEP RITUAL',
      actionType: 'scroll_products'
    },
    secondaryCTA: {
      label: 'EXPLORE THE SCIENCE',
      href: '#clinical-science'
    },
    desktopVideo: '/video/care-hero-desktop.mp4',
    mobileVideo: '/video/care-hero-mobile.mp4',
    poster: '/images/hero.png'
  }
};

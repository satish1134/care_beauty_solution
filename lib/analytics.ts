// ==============================================================================
// CARe Beauty Solution - Analytics & Telemetry Tracking
// Tracking events for the Cinematic Hero Campaign & Conversion funnel
// ==============================================================================

export type HeroAnalyticsEvent =
  | 'hero_view'
  | 'hero_primary_cta_click'
  | 'hero_secondary_cta_click'
  | 'hero_video_play'
  | 'hero_video_pause'
  | 'hero_video_complete'
  | 'hero_product_click'
  | 'hero_campaign_switch'
  | 'hero_treatment_switch';

export interface AnalyticsPayload {
  campaignId?: string;
  treatment?: 'split' | 'fullbleed';
  ctaLabel?: string;
  productSlug?: string;
  videoDuration?: number;
  currentTime?: number;
  timestamp?: string;
  [key: string]: unknown;
}

export function trackHeroEvent(event: HeroAnalyticsEvent, payload?: AnalyticsPayload): void {
  const data = {
    event,
    ...payload,
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'ssr',
  };

  // 1. Console in development
  if (process.env.NODE_ENV !== 'production') {
    console.debug(`[Analytics:Hero] ${event}`, data);
  }

  // 2. Dispatch custom browser event for tag managers / external scripts (GTM, Meta Pixel)
  if (typeof window !== 'undefined') {
    try {
      const customEvent = new CustomEvent('care_analytics', { detail: data });
      window.dispatchEvent(customEvent);

      // Also trigger dataLayer if present
      const win = window as unknown as { dataLayer?: unknown[] };
      if (Array.isArray(win.dataLayer)) {
        win.dataLayer.push({ ...data });
      }
    } catch {
      // Ignore in restricted environments
    }
  }
}

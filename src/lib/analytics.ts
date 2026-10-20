declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

export function trackPageView(url: string) {
  trackEvent('page_view', { page_path: url });
}

// Article read events
export function trackScrollDepth(depth: 25 | 50 | 75 | 100, articleTitle: string) {
  trackEvent('scroll_depth', { depth_percentage: depth, article_title: articleTitle });
}

// Content interaction events
export function trackArticleClick(articleTitle: string, articleSlug: string) {
  trackEvent('article_click', { article_title: articleTitle, article_slug: articleSlug });
}

export function trackNewsletterClick(location: string) {
  trackEvent('newsletter_click', { location });
}

export function trackVideoPlay(videoTitle: string) {
  trackEvent('video_play', { video_title: videoTitle });
}

export function trackSectionImpression(sectionName: string) {
  trackEvent('section_impression', { section_name: sectionName });
}

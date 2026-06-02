/**
 * SNIPPE HOSTED PAYMENT LINKS CONFIGURATION
 * 
 * To temporarily bypass backend checkout API requests and pending account verifications,
 * configure your hosted payment link URLs here. This structure is extremely scalable and
 * ready for static hosting environments (Vercel, Netlify, GitHub Pages) without any live server overhead.
 * 
 * FUTURE API INTEGRATION RESTORE NOTE:
 * When your Snippe account verification is complete and you're ready to switch back
 * to dynamic, server-side checkout sessions, you can edit ProductDetails.tsx and WebsiteTemplates.tsx
 * to trigger `onNavigate('checkout-sandbox', ...)` or query the `/api/create-checkout-session` endpoint.
 */

export const SNIPPE_PAYMENT_LINKS: Record<string, string> = {
  // =========================================================================
  // 1. DIGITAL PRODUCT HOSTED CHEKOUT LINKS (Edit these URLs with yours!)
  // =========================================================================
  "p1": "https://pay.snippe.sh/link-poster-pack",               // Minimalist Abstract Poster Pack
  "p2": "https://pay.snippe.sh/link-arch-poster",               // Modern Architecture Exhibition Poster
  "p3": "https://pay.snippe.sh/link-electro-flyer",             // Futuristic Electro Beats Music Flyer
  "p4": "https://pay.snippe.sh/link-agency-flyer",              // Creative Agency Corporate Flyer
  "p5": "https://pay.snippe.sh/link-min-cards",                 // Minimalist Premium Business Cards
  "p6": "https://pay.snippe.sh/link-dark-cards",                 // Ultra-Black Dark Business Cards
  "p7": "https://pay.snippe.sh/link-insta-templates",            // Instagram Aesthetic Post Templates
  "p8": "https://pay.snippe.sh/link-creator-ebook",             // Ultimate Creator Ebook PDF Guide
  "p9": "https://pay.snippe.sh/link-device-mockups",            // MacBook & iPhone Device Mockup Kit
  "p10": "https://pay.snippe.sh/link-invoice-template",         // Sleek Corporate Invoice Template
  "p11": "https://pay.snippe.sh/link-branding-kit",             // Unified Corporate Identity Branding Kit

  // =========================================================================
  // 2. WEBSITE TEMPLATE HOSTED CHECKOUT LINKS (Edit these URLs with yours!)
  // =========================================================================
  "wt_1": "https://pay.snippe.sh/link-nexus-portal",            // Nexus Enterprise Portal
  "wt_2": "https://pay.snippe.sh/link-apex-logistics",         // Apex Global Logistics Dashboard & Site
  "wt_3": "https://pay.snippe.sh/link-grace-fellowship",        // Grace Fellowship Community Portal
  "wt_4": "https://pay.snippe.sh/link-elysian-portfolio",       // Elysian Architect Portfolio Canvas
  "wt_5": "https://pay.snippe.sh/link-veloce-commerce",         // Veloce Digital Commerce Engine
  "wt_6": "https://pay.snippe.sh/link-prestige-realestate",     // Prestige Estate Showcase Framework
  "wt_7": "https://pay.snippe.sh/link-echelon-finance",         // Echelon Wealth & Advisory Portal
  "wt_8": "https://pay.snippe.sh/link-aura-agency",             // Aura Interactive Digital Agency Hub
  "wt_9": "https://pay.snippe.sh/link-direct-talent",           // DirectTalent Job Board Platform
  "wt_10": "https://pay.snippe.sh/link-maverick-barbers",       // The Maverick Barbers & Co. Site
  "wt_11": "https://pay.snippe.sh/link-trattoria-bella"         // Trattoria Bella Gourmet Showcase
};

// Generic fallback hosted checkout checkout link
export const DEFAULT_SNIPPE_PAYMENT_LINK = "https://snippe.me/pay/framsirona-store";

/**
 * CONFIGURABLE SUCCESS & CANCEL REDIRECT ENVIRONMENT MATCHERS
 * 
 * Configure these to be the callback landing locations returned to
 * the client once checkout is finalized in the Snippe Hosted UI.
 * Highly scalable, ready for Vercel, Netlify, and static hosting platforms.
 */
export const getSuccessRedirectUrl = (productId: string, productType: 'product' | 'website') => {
  // Generates a local simulated sessionId callback on success returning to our clientside handler.
  const randomSessionId = "chk_hosted_" + Math.random().toString(36).substring(2, 9);
  return `${window.location.origin}/?route=payment-success&id=${productId}&type=${productType}&session_id=${randomSessionId}`;
};

export const getCancelRedirectUrl = (productId: string, productType: 'product' | 'website') => {
  return `${window.location.origin}/?route=payment-cancel&id=${productId}&type=${productType}`;
};

/**
 * Helper utility to redirect the client straight to their product checkout page.
 * Snippe checkout MUST open in a full browser tab (no iframe, no modal, no router navigation).
 */
export function redirectToHostedCheckout(url: string): void {
  const destination = url || DEFAULT_SNIPPE_PAYMENT_LINK;
  console.log(`[Snippe Direct Checkout] Routing to -> ${destination}`);
  
  // Forces checkout to open in a clean full browser tab to gracefully avoid iframe/cross-origin constraints
  const newTab = window.open(destination, '_blank', 'noopener,noreferrer');
  
  // If pop-ups are blocked or the environment doesn't allow window.open, fall back to full frame redirection
  if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
    console.warn('[Snippe Direct Checkout] Navigation blocked or popup disallowed. Falling back to parent redirect.');
    try {
      if (window.top && window.top !== window) {
        window.top.location.href = destination;
      } else {
        window.location.href = destination;
      }
    } catch (e) {
      window.location.href = destination;
    }
  }
}

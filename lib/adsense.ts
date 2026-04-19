// ============================================================
// ADSENSE CONFIGURATION
// Replace 'ca-pub-XXXXXXXX' with your actual AdSense Publisher ID
// Found in Google AdSense → Settings → Account information
// ============================================================

export const ADSENSE_CONFIG = {
  // Your actual AdSense Publisher ID (format: ca-pub-XXXXXXXX)
  publisherId: process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || 'ca-pub-XXXXXXXX',

  // Enable ad personalization (EU users see non-personalized by default)
  analyticsAdvertisingId: undefined, // Set to 'OPT_OUT' for GDPR compliance

  // Ad script URL (standard Google AdSense)
  adScriptUrl: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',

  // Loading strategy: 'lazy' | 'eager'
  loadingStrategy: 'lazy' as 'lazy' | 'eager',

  // Ad request defaults
  adRequestDefaults: {
    // Override channel ID for detailed analytics
    // channel: 'YOUR_CHANNEL_ID',
    // Set language
    language: 'en',
    // Set page-level responsive ad sizes
    sizes: [
      [728, 90],   // leaderboard
      [468, 60],   // banner
      [320, 100],  // large mobile banner
      [300, 250],  // medium rectangle
      [336, 280],  // large rectangle
      [300, 600],  // half page
      [160, 600],  // wide skyscraper
    ] as Array<[number, number]>,
  },
};

// ============================================================
// AD SLOT DEFINITIONS
// Define all ad placements across the site
// ============================================================

export const AD_SLOTS = {
  // Homepage slots
  homepage: {
    hero: {
      slotId: 'HOME_HERO_LEADERBOARD',
      sizes: [[728, 90], [320, 100]] as Array<[number, number]>,
      position: 'hero',
    },
    belowHero: {
      slotId: 'HOME_BELOW_HERO_MRECT',
      sizes: [[300, 250]] as Array<[number, number]>,
      position: 'below-hero',
    },
    toolsSection: {
      slotId: 'HOME_TOOLS_MRECT',
      sizes: [[300, 250]] as Array<[number, number]>,
      position: 'tools-section',
    },
    productsSection: {
      slotId: 'HOME_PRODUCTS_MRECT',
      sizes: [[300, 250]] as Array<[number, number]>,
      position: 'products',
    },
    footer: {
      slotId: 'HOME_FOOTER_BANNER',
      sizes: [[728, 90], [320, 100]] as Array<[number, number]>,
      position: 'footer',
    },
  },

  // Tool page slots
  toolPage: {
    header: {
      slotId: 'TOOL_HEADER_BANNER',
      sizes: [[728, 90], [320, 100]] as Array<[number, number]>,
      position: 'tool-header',
    },
    inlineTool: {
      slotId: 'TOOL_INLINE_MRECT',
      sizes: [[300, 250]] as Array<[number, number]>,
      position: 'inline-tool',
    },
    belowTool: {
      slotId: 'TOOL_BELOW_MRECT',
      sizes: [[300, 250]] as Array<[number, number]>,
      position: 'below-tool',
    },
    sidebar: {
      slotId: 'TOOL_SIDEBAR_SKYSCRAPER',
      sizes: [[160, 600], [300, 600]] as Array<[number, number]>,
      position: 'sidebar',
    },
  },

  // Product page slots
  productPage: {
    header: {
      slotId: 'PRODUCT_HEADER_LEADER',
      sizes: [[728, 90]] as Array<[number, number]>,
      position: 'product-header',
    },
    sidebar: {
      slotId: 'PRODUCT_SIDEBAR_MRECT',
      sizes: [[300, 250]] as Array<[number, number]>,
      position: 'product-sidebar',
    },
    belowCTA: {
      slotId: 'PRODUCT_BELOW_CTA_MRECT',
      sizes: [[300, 250]] as Array<[number, number]>,
      position: 'below-cta',
    },
  },

  // Blog page slots
  blog: {
    header: {
      slotId: 'BLOG_HEADER_LEADER',
      sizes: [[728, 90]] as Array<[number, number]>,
      position: 'blog-header',
    },
    inline: {
      slotId: 'BLOG_INLINE_MRECT',
      sizes: [[300, 250]] as Array<[number, number]>,
      position: 'blog-inline',
    },
    sidebar: {
      slotId: 'BLOG_SIDEBAR_SKYSCRAPER',
      sizes: [[160, 600]] as Array<[number, number]>,
      position: 'blog-sidebar',
    },
  },
};

// ============================================================
// ADSENSE SCRIPT LOADER
// Loads the AdSense script exactly once per page
// ============================================================

let scriptLoaded = false;

export async function loadAdSenseScript(): Promise<void> {
  if (scriptLoaded) return;
  if (typeof window === 'undefined') return;

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `${ADSENSE_CONFIG.adScriptUrl}?client=${ADSENSE_CONFIG.publisherId}`;
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.onload = () => {
      scriptLoaded = true;
      resolve();
    };

    script.onerror = () => {
      reject(new Error('Failed to load AdSense script'));
    };

    document.head.appendChild(script);
  });
}

// ============================================================
// ADSENSE HELPERS
// ============================================================

/**
 * Format adsbygoogle.push() command for responsive ads
 * Call this inside your component after AdSense script loads
 */
export function getAdSensePushConfig(slotPath: string, sizes: Array<[number, number]>) {
  return {
     googletag: {
      push: () => {
        (window as any).googletag = (window as any).googletag || {};
        (window as any).googletag.cmd = (window as any).googletag.cmd || [];
        (window as any).googletag.cmd.push(() => {
          const slot = (window as any).googletag
            .defineSlot(['/1025445/' + ADSENSE_CONFIG.publisherId], sizes, slotPath);
          if (slot) {
            slot.addService((window as any).googletag.display());
          }
        });
      },
    },
  };
}

/**
 * Trigger an adsbygoogle refresh for a specific slot
 * Use this to load new ads when content changes
 */
export function refreshAdSlot(slotPath: string): void {
  try {
    const adFrame = document.getElementById(slotPath);
    if (adFrame && (window as any).adsbygoogle) {
      (window as any).adsbygoogle.push({});
    }
  } catch (e) {
    // Ad refresh failed silently
  }
}

/**
 * Check if AdSense is properly configured (not in dev mode)
 */
export function isAdSenseEnabled(): boolean {
  return ADSENSE_CONFIG.publisherId !== 'ca-pub-XXXXXXXX';
}

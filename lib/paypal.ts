// ============================================================
// PAYPAL CONFIGURATION
// All PayPal integration for coreskillai.com
// Email: uarddrago@gmail.com
// PayPal.me: https://paypal.me/ocultmaster9
// ============================================================

export const PAYPAL_CONFIG = {
  // Primary PayPal email for receiving payments
  email: process.env.NEXT_PUBLIC_PAYPAL_EMAIL || 'uarddrago@gmail.com',

  // PayPal.me short link (for direct payment requests)
  paypalMe: process.env.NEXT_PUBLIC_PAYPAL_ME || 'https://paypal.me/ocultmaster9',

  // Business name shown on PayPal checkout
  businessName: 'coreskillai',

  // Currency
  currency: 'USD',

  // Locale formatting
  locale: 'en_US',

  // Return URLs after payment
  returnUrl: 'https://coreskillai.com/payment/success',
  cancelUrl: 'https://coreskillai.com/payment/cancel',
};

// ============================================================
// PRODUCT PRICE MAP
// Maps product slugs to their prices for PayPal checkouts
// ============================================================

export const PRODUCT_PRICES: Record<string, number> = {
  // Ultimate Guides ($97)
  'universal-api-connector': 97,
  'ai-self-improvement': 97,
  'deep-reasoning-framework': 97,
  'content-strategy': 97,

  // Courses ($147)
  'universal-token-manager': 147,

  // Templates ($67)
  'master-character-design': 67,

  // Swipes ($47)
  'viral-hook-formula': 47,

  // Checklists ($27)
  'startup-error-checklist': 27,

  // Frameworks ($77)
  'autonomous-income-system': 77,
};

// ============================================================
// PAYPAL LINK BUILDERS
// ============================================================

/**
 * Build a PayPal.me direct payment URL
 * Usage: <a href={buildPayPalMeURL()}>Donate</a>
 */
export function buildPayPalMeURL(amount?: number): string {
  const base = PAYPAL_CONFIG.paypalMe;
  if (amount && amount > 0) {
    return `${base}/${amount}`;
  }
  return base;
}

/**
 * Build a PayPal checkout URL with item details
 * Opens PayPal's hosted checkout flow
 */
export function buildPayPalCheckoutURL(
  itemName: string,
  amount: number,
  itemId?: string
): string {
  const params = new URLSearchParams({
    cmd: '_xclick',
    business: PAYPAL_CONFIG.email,
    item_name: itemName,
    amount: amount.toFixed(2),
    currency_code: PAYPAL_CONFIG.currency,
    no_note: '1',
    no_shipping: '2',
    return: PAYPAL_CONFIG.returnUrl,
    cancel_return: PAYPAL_CONFIG.cancelUrl,
  });

  if (itemId) {
    params.set('item_number', itemId);
  }

  return `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`;
}

/**
 * Build a PayPal subscription URL
 * For recurring products or membership
 */
export function buildPayPalSubscriptionURL(
  itemName: string,
  a3: number, // recurring amount
  period: 'D' | 'W' | 'M' | 'Y' = 'M',
  productId?: string
): string {
  const params = new URLSearchParams({
    cmd: '_xclick-subscriptions',
    business: PAYPAL_CONFIG.email,
    item_name: itemName,
    a3: a3.toFixed(2),
    p3: '1', // billing cycle
    t3: period, // billing period
    src: '1', // recurring payments
    sra: '1', // reattempt on failure
    no_note: '1',
    return: PAYPAL_CONFIG.returnUrl,
    cancel_return: PAYPAL_CONFIG.cancelUrl,
  });

  if (productId) {
    params.set('item_number', productId);
  }

  return `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`;
}

/**
 * Build a PayPal donation URL
 */
export function buildPayPalDonationURL(
  amount?: number,
  cause?: string
): string {
  const params = new URLSearchParams({
    cmd: '_donations',
    business: PAYPAL_CONFIG.email,
    currency_code: PAYPAL_CONFIG.currency,
  });

  if (amount && amount > 0) {
    params.set('amount', amount.toFixed(2));
  }

  if (cause) {
    params.set('item_name', `Donation: ${cause}`);
  }

  return `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`;
}

/**
 * Build Gumroad overlay checkout URL
 * For products hosted on Gumroad
 */
export function buildGumroadURL(productPermaLink: string, wanted?: boolean): string {
  const base = `https://gumroad.com/${productPermaLink}`;
  const params = new URLSearchParams();
  if (wanted) params.set('wanted', '1');
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

/**
 * Build Gumroad product URL (direct link)
 */
export function buildGumroadProductURL(productPermaLink: string): string {
  return `https://gumroad.com/${productPermaLink}`;
}

// ============================================================
// PAYPAL COMPONENT DATA
// Data passed to PayPal UI components
// ============================================================

export interface PayPalProductData {
  id: string;
  name: string;
  price: number;
  description: string;
  gumroadPermaLink: string;
  type: 'ultimate_guide' | 'course' | 'templates' | 'swipes' | 'checklist' | 'framework';
}

export const PAYPAL_PRODUCTS: PayPalProductData[] = [
  {
    id: 'universal-api-connector',
    name: 'Universal API Connector',
    price: 97,
    description: 'Connect any API in minutes with battle-tested auth handlers and retry logic.',
    gumroadPermaLink: 'l/wzsk',
    type: 'ultimate_guide',
  },
  {
    id: 'ai-self-improvement',
    name: 'AI Self-Improvement',
    price: 97,
    description: 'Make AI continuously smarter with self-critique loops and scoring systems.',
    gumroadPermaLink: 'l/bqyv',
    type: 'ultimate_guide',
  },
  {
    id: 'deep-reasoning-framework',
    name: 'Deep Reasoning Framework',
    price: 97,
    description: 'Chain-of-Thought and Tree-of-Thought templates that actually work.',
    gumroadPermaLink: 'l/fnqr',
    type: 'ultimate_guide',
  },
  {
    id: 'content-strategy',
    name: 'Content Strategy Engine',
    price: 97,
    description: 'A/B tested headlines, viral hooks, and full content repurposing pipelines.',
    gumroadPermaLink: 'l/kmlm',
    type: 'ultimate_guide',
  },
  {
    id: 'universal-token-manager',
    name: 'Universal Token Manager',
    price: 147,
    description: 'Track, optimize, and report on AI token spend across every model and API.',
    gumroadPermaLink: 'l/jhyt',
    type: 'course',
  },
  {
    id: 'master-character-design',
    name: 'Master Character Design',
    price: 67,
    description: 'From concept to animated character — 20+ templates, poses, and expressions.',
    gumroadPermaLink: 'l/mnbv',
    type: 'templates',
  },
  {
    id: 'viral-hook-formula',
    name: 'Viral Hook Formula',
    price: 47,
    description: 'The exact 7-pattern swipe file that drops viewers into your content.',
    gumroadPermaLink: 'l/qwrt',
    type: 'swipes',
  },
  {
    id: 'startup-error-checklist',
    name: 'Startup Error Checklist',
    price: 27,
    description: '43 automation landmines that kill agentic AI systems — detected and fixed.',
    gumroadPermaLink: 'l/asdf',
    type: 'checklist',
  },
  {
    id: 'autonomous-income-system',
    name: 'Autonomous Income System',
    price: 77,
    description: 'Build, launch, and scale digital income streams on complete autopilot.',
    gumroadPermaLink: 'l/zxcv',
    type: 'framework',
  },
];

export function getProductById(id: string): PayPalProductData | undefined {
  return PAYPAL_PRODUCTS.find((p) => p.id === id);
}

export function getProductsByType(type: PayPalProductData['type']): PayPalProductData[] {
  return PAYPAL_PRODUCTS.filter((p) => p.type === type);
}

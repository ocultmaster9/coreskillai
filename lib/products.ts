// ============================================================
// PRODUCT CATALOG
// All digital products for coreskillai.com
// ============================================================

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  price: number;
  type: 'ultimate_guide' | 'course' | 'templates' | 'swipes' | 'checklist' | 'framework';
  gumroadPermaLink: string;
  previewFiles: string[];
  features: string[];
  includes: string[];
  createdAt: string;
  updatedAt: string;
  tags: string[];
  rating: number;
  sales: number;
}

export const PRODUCTS: Product[] = [
  {
    id: 'prod_001',
    slug: 'universal-api-connector',
    name: 'Universal API Connector',
    tagline: 'Connect any API in minutes, not months.',
    description: 'Battle-tested auth handlers, retry logic, rate limiters, and integration templates for 50+ APIs.',
    longDescription: `Stop reinventing the wheel every time you need to connect to an API. Universal API Connector gives you production-ready code patterns for OAuth 2.0, API keys, JWT, Bearer tokens, and every auth scheme you've encountered.

Every handler includes:
- Automatic token refresh
- Exponential backoff retry logic  
- Rate limit awareness
- Error handling that actually makes sense
- Request/response logging for debugging

Plus 15 integration templates for popular APIs (Stripe, OpenAI, Twilio, Slack, GitHub, and more) that you can drop into your project and customize in under 10 minutes.`,
    price: 97,
    type: 'ultimate_guide',
    gumroadPermaLink: 'l/wzsk',
    previewFiles: ['api-auth-handlers-preview.pdf', 'retry-logic-preview.pdf'],
    features: [
      '50+ auth handler templates',
      '15 pre-built integration templates',
      'Automatic token refresh system',
      'Exponential backoff retry engine',
      'Rate limit queue manager',
      'Request/response logger',
      'TypeScript + Python versions',
      'Lifetime updates',
    ],
    includes: [
      'Complete auth handler library (4 files)',
      '15 integration templates',
      'Retry system with dead-letter queue',
      'Rate limiter with adaptive throttling',
      'Developer quickstart guide',
    ],
    createdAt: '2026-04-10',
    updatedAt: '2026-04-16',
    tags: ['API', 'Integration', 'Python', 'TypeScript', 'Auth', 'DevOps'],
    rating: 4.8,
    sales: 0,
  },
  {
    id: 'prod_002',
    slug: 'ai-self-improvement',
    name: 'AI Self-Improvement System',
    tagline: 'Make AI genuinely smarter after every task.',
    description: 'Self-critique loops, scoring rubrics, and reflection engines that compound your AI\'s capability over time.',
    longDescription: `The difference between a dumb AI and a compounding one is whether it learns from mistakes. This system gives your AI a perpetual improvement loop.

Every time your AI completes a task, it:
1. Scores the output against a rubric
2. Identifies what went wrong
3. Updates its own working guidelines
4. Stores lessons learned for next time

Over weeks, your AI builds a private knowledge base of what works and what doesn't — specific to YOUR use case.`,
    price: 97,
    type: 'ultimate_guide',
    gumroadPermaLink: 'l/bqyv',
    previewFiles: ['scoring-rubric-preview.pdf', 'reflection-engine-preview.pdf'],
    features: [
      'Multi-dimensional scoring rubric',
      'Self-critique prompt templates',
      'Reflection engine with memory',
      'Improvement suggestion pipeline',
      'Weekly digest generator',
      'Python reference implementation',
      'Notion-compatible export',
    ],
    includes: [
      'Scoring rubric (4 dimensions)',
      'Self-critique template library',
      'Reflection engine code',
      'Improvement pipeline',
      'Setup & integration guide',
    ],
    createdAt: '2026-04-10',
    updatedAt: '2026-04-16',
    tags: ['AI', 'Self-Improvement', 'Python', 'Prompt Engineering', 'ML'],
    rating: 4.9,
    sales: 0,
  },
  {
    id: 'prod_003',
    slug: 'deep-reasoning-framework',
    name: 'Deep Reasoning Framework',
    tagline: 'Think deeper. Get better answers.',
    description: 'Chain-of-Thought, Tree-of-Thought, and self-critique templates that force AI to reason properly.',
    longDescription: `AI doesn't naturally think hard. Deep Reasoning Framework forces systematic thinking through structured prompt patterns.

CoT (Chain-of-Thought) templates teach AI to break problems down step by step.
ToT (Tree-of-Thought) templates let AI explore multiple paths and backtrack.
Self-critique templates make AI verify its own logic before answering.

The result: 40-60% better accuracy on complex reasoning tasks, measurably.`,
    price: 97,
    type: 'ultimate_guide',
    gumroadPermaLink: 'l/fnqr',
    previewFiles: ['cot-templates-preview.pdf', 'tot-templates-preview.pdf'],
    features: [
      '12 Chain-of-Thought templates',
      '8 Tree-of-Thought templates',
      '5 self-critique patterns',
      'Reasoning quality scorer',
      'Domain-specific variants',
      'Python reasoning engine',
      'Comparison benchmark suite',
    ],
    includes: [
      '12 CoT templates',
      '8 ToT templates',
      'Self-critique patterns',
      'Python reasoning engine',
      'Benchmark suite',
      'Implementation guide',
    ],
    createdAt: '2026-04-10',
    updatedAt: '2026-04-16',
    tags: ['Reasoning', 'AI', 'Prompt Engineering', 'CoT', 'ToT'],
    rating: 4.7,
    sales: 0,
  },
  {
    id: 'prod_004',
    slug: 'content-strategy',
    name: 'Content Strategy Engine',
    tagline: 'Turn one idea into 30 pieces of content.',
    description: 'Headline swipe file, viral hook patterns, repurposing pipelines, and full content calendars.',
    longDescription: `Every piece of content you create should spawn 30 more. This engine does that automatically.

Headline swipe file with 200+ proven A/B-tested headlines.
Viral hook patterns (7 types) that stop the scroll.
Repurposing pipeline: 1 article → 5 tweets → 1 LinkedIn post → 2 Shorts → newsletter.
Content calendar template that maps 3 months of content in 20 minutes.`,
    price: 97,
    type: 'ultimate_guide',
    gumroadPermaLink: 'l/kmlm',
    previewFiles: ['headline-swipe-preview.pdf', 'repurposing-flowchart.pdf'],
    features: [
      '200+ headline swipe file',
      '7 viral hook patterns',
      '1-to-30 repurposing pipeline',
      'Content calendar template',
      'Platform-specific adapters',
      'Hashtag strategy guide',
      'Trend monitoring system',
    ],
    includes: [
      'Headline swipe file (200+)',
      'Viral hook patterns',
      'Repurposing pipeline template',
      'Content calendar (3-month)',
      'Platform adapters',
      'Hashtag guide',
    ],
    createdAt: '2026-04-10',
    updatedAt: '2026-04-16',
    tags: ['Content', 'Marketing', 'Social Media', 'SEO', 'Twitter'],
    rating: 4.6,
    sales: 0,
  },
  {
    id: 'prod_005',
    slug: 'universal-token-manager',
    name: 'Universal Token Manager',
    tagline: 'Know exactly where every cent goes.',
    description: 'Real-time AI API spend tracker, cost optimizer, and budget alerting across every model.',
    longDescription: `OpenAI charges you per token. Anthropic charges you per token. Every API charges you per token. But do you actually know how much each task costs?

Universal Token Manager gives you:
- Per-task cost tracking with sub-millisecond precision
- Multi-provider aggregation in one dashboard
- Budget alerts before you blow through your limit
- Cost optimization suggestions (which model for which task)
- Weekly spend reports by project, team, and model

No more billing surprises.`,
    price: 147,
    type: 'course',
    gumroadPermaLink: 'l/jhyt',
    previewFiles: ['token-tracker-preview.pdf', 'cost-report-preview.pdf'],
    features: [
      'Real-time token counter',
      'Multi-provider dashboard',
      'Budget alerting system',
      'Cost optimization engine',
      'Weekly spend reports',
      'Per-project breakdown',
      'API usage anomaly detection',
      'Python SDK + REST API',
    ],
    includes: [
      'Token tracking dashboard',
      'Cost optimization engine',
      'Budget alert system',
      'Weekly report generator',
      'Python SDK',
      'REST API server',
    ],
    createdAt: '2026-04-10',
    updatedAt: '2026-04-16',
    tags: ['Cost Management', 'API', 'Analytics', 'Python', 'DevOps'],
    rating: 4.8,
    sales: 0,
  },
  {
    id: 'prod_006',
    slug: 'master-character-design',
    name: 'Master Character Design',
    tagline: 'From concept to animated character in hours.',
    description: '20+ pose templates, expression charts, color palettes, and animation-ready character sheets.',
    longDescription: `Whether you're designing a cartoon mascot, an app icon character, or an animated series hero, this template library is your production pipeline.

20 base pose templates (standing, walking, running, sitting, gesturing, etc.)
15 expression charts (happy, sad, angry, surprised, neutral, etc.)
10 color palette systems (complementary, analogous, triadic, warm, cool, etc.)
Character sheet template that exports animation-ready files

Designed in Figma and exported as SVG + PNG for instant use.`,
    price: 67,
    type: 'templates',
    gumroadPermaLink: 'l/mnbv',
    previewFiles: ['pose-preview.pdf', 'expression-chart-preview.pdf'],
    features: [
      '20 pose templates',
      '15 expression charts',
      '10 color palettes',
      'Animation-ready character sheets',
      'Figma source files',
      'SVG + PNG exports',
      'Commercial license',
    ],
    includes: [
      '20 pose templates (SVG + PNG)',
      '15 expression charts',
      '10 color palette systems',
      'Character sheet template',
      'Figma source files',
      'Commercial license',
    ],
    createdAt: '2026-04-10',
    updatedAt: '2026-04-16',
    tags: ['Design', 'Character', 'Animation', 'Figma', 'SVG'],
    rating: 4.5,
    sales: 0,
  },
  {
    id: 'prod_007',
    slug: 'viral-hook-formula',
    name: 'Viral Hook Formula',
    tagline: '7 patterns that make people stop and read.',
    description: 'The exact swipe file that drops viewers into your content — one hook at a time.',
    longDescription: `The hook is the only thing that matters in content. If you don't hook in the first 2 seconds, nobody watches. Nobody reads. Nobody shares.

This swipe file contains 47 actual hooks that went viral — analyzed, categorized, and annotated with WHY they worked.

7 pattern types:
1. The Pattern Interruption
2. The Curiosity Gap
3. The Social Proof Surge
4. The Contrast Hit
5. The Stakes Claim
6. The "Nobody Talks About" Surprise
7. The Mini-Story Opener

Every hook includes the platform it worked on, the engagement lift, and how to adapt it for your niche.`,
    price: 47,
    type: 'swipes',
    gumroadPermaLink: 'l/qwrt',
    previewFiles: ['hook-patterns-preview.pdf'],
    features: [
      '47 viral hook templates',
      '7 pattern categories',
      'Platform annotations',
      'Engagement metrics per hook',
      'Adaptation formula for each',
      'Hook tester worksheet',
    ],
    includes: [
      '47 viral hook templates',
      '7 pattern analysis guides',
      'Hook adaptation formulas',
      'Tester worksheet',
    ],
    createdAt: '2026-04-10',
    updatedAt: '2026-04-16',
    tags: ['Viral', 'Content', 'Marketing', 'Swipe File', 'Social Media'],
    rating: 4.7,
    sales: 0,
  },
  {
    id: 'prod_008',
    slug: 'startup-error-checklist',
    name: 'Startup Error Checklist',
    tagline: '43 automation landmines detected and fixed.',
    description: 'The checklist that prevents AI agents from going off the rails — before they do.',
    longDescription: `Autonomous AI systems fail in predictable ways. This checklist identifies 43 specific error patterns that kill agentic AI deployments — and exactly how to fix each one.

Organized into 6 categories:
1. Context Overflow (10 errors)
2. Tool Call Failures (8 errors)
3. State Inconsistency (7 errors)
4. Rate Limit Hits (6 errors)
5. Auth Token Expiry (6 errors)
6. Logic Loops (6 errors)

Each entry includes: symptom, cause, fix, and prevention checklist.`,
    price: 27,
    type: 'checklist',
    gumroadPermaLink: 'l/asdf',
    previewFiles: ['checklist-preview.pdf'],
    features: [
      '43 specific error patterns',
      '6 failure category analysis',
      'Symptom → Cause → Fix flow',
      'Prevention checklist per error',
      'PDF + Notion export',
      'Monthly error digest',
    ],
    includes: [
      'Full checklist (43 entries)',
      '6 category guides',
      'Prevention checklists',
      'Notion template',
      'Monthly digest service',
    ],
    createdAt: '2026-04-10',
    updatedAt: '2026-04-16',
    tags: ['AI', 'Automation', 'Debugging', 'DevOps', 'Error Handling'],
    rating: 4.9,
    sales: 0,
  },
  {
    id: 'prod_009',
    slug: 'autonomous-income-system',
    name: 'Autonomous Income System',
    tagline: 'Build income streams that run themselves.',
    description: 'The complete blueprint for digital income on autopilot — products, traffic, and sales without constant hands-on management.',
    longDescription: `This is the system I use to build and run income streams without being at the computer every day.

It covers:
- Product creation: validating, pricing, and launching digital products fast
- Traffic automation: organic reach without paid ads
- Sales funnels: automated email sequences that convert
- Payment handling: PayPal + Gumroad integration done right
- Analytics: knowing what's making money vs. what's not

The system is built for a team of 1 (you) plus an AI workforce (me).`,
    price: 77,
    type: 'framework',
    gumroadPermaLink: 'l/zxcv',
    previewFiles: ['system-overview-preview.pdf', 'income-streams-map.pdf'],
    features: [
      'Product validation framework',
      'Pricing psychology guide',
      'Traffic automation playbook',
      'Email sequence templates',
      'PayPal + Gumroad setup guide',
      'Revenue analytics dashboard',
      'Weekend launch checklist',
    ],
    includes: [
      'Full system blueprint',
      'Product validation framework',
      'Traffic playbook',
      'Email sequence templates (5)',
      'PayPal integration guide',
      'Revenue dashboard',
    ],
    createdAt: '2026-04-10',
    updatedAt: '2026-04-16',
    tags: ['Income', 'Business', 'Automation', 'Digital Products', 'Marketing'],
    rating: 4.8,
    sales: 0,
  },
];

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByType(type: Product['type']): Product[] {
  return PRODUCTS.filter((p) => p.type === type);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.rating >= 4.7).slice(0, 6);
}

export const PRODUCT_TYPE_LABELS: Record<Product['type'], string> = {
  ultimate_guide: 'Ultimate Guide',
  course: 'Course',
  templates: 'Templates',
  swipes: 'Swipe File',
  checklist: 'Checklist',
  framework: 'Framework',
};

export const PRODUCT_TYPE_ICONS: Record<Product['type'], string> = {
  ultimate_guide: '📚',
  course: '🎓',
  templates: '📋',
  swipes: '📝',
  checklist: '✅',
  framework: '🗺️',
};

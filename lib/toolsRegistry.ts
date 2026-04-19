// ============================================================
// UTILITY TOOLS REGISTRY
// All free tools on coreskillai.com/tools/[slug]
// ============================================================

export interface Tool {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  inputFields: InputField[];
  outputFields: OutputField[];
  algorithm: string;
  keywords: string[];
  createdAt: string;
}

export interface InputField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'checkbox' | 'file';
  placeholder?: string;
  required: boolean;
  options?: { label: string; value: string }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface OutputField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'html' | 'copy';
  copyable?: boolean;
}

export const TOOLS: Tool[] = [
  // ── TIER 1: Finance & Money ──
  {
    id: 'tool_001',
    slug: 'tax-refund-calculator',
    name: 'Tax Refund Calculator',
    tagline: 'Estimate your tax refund in 30 seconds.',
    description: 'Enter your income, filing status, and deductions to estimate how much tax you\'ll get back.',
    longDescription: `Tax season is stressful enough. This calculator cuts through the complexity and gives you a real estimate in under 30 seconds.

Just enter your gross income, filing status, and any deductions you know about. The calculator handles the rest — standard deduction, tax brackets, and withholding estimates.

Perfect for: W-2 employees, freelancers, and side-hustle earners who want to know if they should adjust their withholding.`,
    category: 'Finance',
    tags: ['tax', 'refund', 'income', 'IRS', 'finance', 'calculator'],
    difficulty: 'beginner',
    inputFields: [
      { id: 'income', label: 'Annual Gross Income ($)', type: 'number', placeholder: '75000', required: true, validation: { min: 0, max: 10000000 } },
      {
        id: 'status',
        label: 'Filing Status',
        type: 'select',
        required: true,
        options: [
          { label: 'Single', value: 'single' },
          { label: 'Married Filing Jointly', value: 'married_joint' },
          { label: 'Married Filing Separately', value: 'married_separate' },
          { label: 'Head of Household', value: 'head_household' },
        ],
      },
      { id: 'withheld', label: 'Tax Already Withheld ($)', type: 'number', placeholder: '12000', required: true, validation: { min: 0 } },
      { id: 'dependents', label: 'Number of Dependents', type: 'number', placeholder: '0', required: false, validation: { min: 0, max: 20 } },
      {
        id: 'deductions',
        label: 'Deduction Type',
        type: 'select',
        required: true,
        options: [
          { label: 'Standard Deduction', value: 'standard' },
          { label: 'Itemized Deductions', value: 'itemized' },
        ],
      },
      { id: 'itemizedAmount', label: 'Itemized Deduction Amount ($)', type: 'number', placeholder: '0', required: false, validation: { min: 0 } },
    ],
    outputFields: [
      { id: 'estimatedRefund', label: 'Estimated Refund', type: 'number', copyable: true },
      { id: 'effectiveRate', label: 'Effective Tax Rate', type: 'number', copyable: true },
      { id: 'taxOwed', label: 'Total Tax Owed', type: 'number', copyable: true },
    ],
    algorithm: 'tax-refund',
    keywords: ['tax refund', 'tax calculator', 'irs', 'tax return', 'taxes 2026'],
    createdAt: '2026-04-15',
  },

  // ── TIER 2: Word & Language ──
  {
    id: 'tool_002',
    slug: 'unscramble',
    name: 'Unscramble Tool',
    tagline: 'Unscramble letters into real words instantly.',
    description: 'Enter mixed-up letters and get every possible word — 2 letters to 8+ letters. Built for word games.',
    longDescription: `Every word game player's secret weapon. Drop your scrambled letters in and get every valid English word possible — sorted by length and alphabetical.

Built with the Official Scrabble dictionary. Filters profanity automatically.

Perfect for: Scrabble, Wordle, Boggle, crosswords, or just proving you're the smartest person at the table.`,
    category: 'Language',
    tags: ['unscramble', 'words', 'scrabble', 'wordle', 'anagram', 'spelling', 'games'],
    difficulty: 'beginner',
    inputFields: [
      { id: 'letters', label: 'Your Letters', type: 'text', placeholder: 'TARGNIE', required: true, validation: { pattern: '^[a-zA-Z]+$', message: 'Letters only' } },
      { id: 'minLength', label: 'Minimum Word Length', type: 'number', placeholder: '3', required: false, validation: { min: 2, max: 15 } },
      { id: 'startsWith', label: 'Starts With (optional)', type: 'text', placeholder: '', required: false, validation: { pattern: '^[a-zA-Z]*$' } },
      { id: 'contains', label: 'Contains (optional)', type: 'text', placeholder: '', required: false, validation: { pattern: '^[a-zA-Z]*$' } },
    ],
    outputFields: [
      { id: 'words', label: 'Possible Words', type: 'html', copyable: true },
      { id: 'wordCount', label: 'Total Words Found', type: 'number', copyable: true },
    ],
    algorithm: 'unscramble',
    keywords: ['unscramble', 'unscramble letters', 'scrabble helper', 'word unscrambler', 'anagram solver'],
    createdAt: '2026-04-15',
  },
  {
    id: 'tool_003',
    slug: 'word-counter',
    name: 'Word Counter Pro',
    tagline: 'Count words, characters, reading time in one click.',
    description: 'Paste your text and get word count, character count, sentence count, paragraph count, and estimated reading time.',
    longDescription: `The last word counter you'll ever need. Paste any text and get a full breakdown:

- Words (total + unique)
- Characters (with and without spaces)
- Sentences & paragraphs
- Average reading time (200 WPM)
- Speaking time (150 WPM)
- Keyword density checker
- Grade level estimator

No sign-up. No database. Your text never leaves your browser.`,
    category: 'Language',
    tags: ['word count', 'character count', 'counter', 'writing', 'text analysis', 'seo'],
    difficulty: 'beginner',
    inputFields: [
      { id: 'text', label: 'Your Text', type: 'textarea', placeholder: 'Paste or type your text here...', required: true },
    ],
    outputFields: [
      { id: 'wordCount', label: 'Words', type: 'number', copyable: true },
      { id: 'charCount', label: 'Characters', type: 'number', copyable: true },
      { id: 'sentenceCount', label: 'Sentences', type: 'number', copyable: true },
      { id: 'paragraphCount', label: 'Paragraphs', type: 'number', copyable: true },
      { id: 'readingTime', label: 'Reading Time', type: 'text', copyable: true },
      { id: 'speakingTime', label: 'Speaking Time', type: 'text', copyable: true },
    ],
    algorithm: 'word-counter',
    keywords: ['word counter', 'character count', 'text counter', 'word count tool', 'reading time'],
    createdAt: '2026-04-15',
  },

  // ── TIER 3: Creative & Social ──
  {
    id: 'tool_004',
    slug: 'hashtag-generator',
    name: 'Hashtag Generator',
    tagline: 'Turn any topic into viral hashtags.',
    description: 'Enter your topic or caption and get optimized hashtags for Instagram, Twitter/X, LinkedIn, and TikTok.',
    longDescription: `The right hashtags can 10x your reach. This generator analyzes your topic and delivers platform-specific hashtag sets optimized for each network.

Instagram: Mix of popular + niche + hidden gems
Twitter/X: Trending + evergreen mix
LinkedIn: Professional + industry-specific
TikTok: Trending challenge + discovery hashtags

One input. Four optimized sets. Copy and go.`,
    category: 'Social Media',
    tags: ['hashtags', 'instagram', 'twitter', 'linkedin', 'tiktok', 'social media', 'viral'],
    difficulty: 'beginner',
    inputFields: [
      { id: 'topic', label: 'Your Topic or Caption', type: 'textarea', placeholder: 'AI automation for small business...', required: true },
      {
        id: 'platform',
        label: 'Platform',
        type: 'select',
        required: true,
        options: [
          { label: 'Instagram', value: 'instagram' },
          { label: 'Twitter / X', value: 'twitter' },
          { label: 'LinkedIn', value: 'linkedin' },
          { label: 'TikTok', value: 'tiktok' },
          { label: 'All Platforms', value: 'all' },
        ],
      },
      {
        id: 'count',
        label: 'Number of Hashtags',
        type: 'select',
        required: false,
        options: [
          { label: '5 (Targeted)', value: '5' },
          { label: '10 (Balanced)', value: '10' },
          { label: '15 (Maximum)', value: '15' },
          { label: '20 (Aggressive)', value: '20' },
        ],
      },
    ],
    outputFields: [
      { id: 'hashtags', label: 'Hashtags', type: 'html', copyable: true },
      { id: 'followers', label: 'Estimated Reach', type: 'text', copyable: true },
    ],
    algorithm: 'hashtag-generator',
    keywords: ['hashtag generator', 'instagram hashtags', 'twitter hashtags', 'tiktok hashtags', 'hashtags for viral'],
    createdAt: '2026-04-15',
  },
  {
    id: 'tool_005',
    slug: 'password-generator',
    name: 'Password Generator',
    tagline: 'Unbreakable passwords. Zero effort.',
    description: 'Generate cryptographically secure passwords with custom length, symbols, numbers, and pronounceability options.',
    longDescription: `Your passwords are only as strong as your randomness. This generator uses crypto-secure randomness (not Math.random()) to create unbreakable passwords.

Options:
- Length: 8 to 128 characters
- Include: uppercase, lowercase, numbers, symbols
- Exclude: ambiguous characters (0/O, 1/l/I)
- Pronounceable mode: easier to remember but still secure
- Passphrase mode: random word combinations

Copy to clipboard. Never use "password123" again.`,
    category: 'Security',
    tags: ['password', 'security', 'generator', 'cryptography', 'privacy', 'encryption'],
    difficulty: 'beginner',
    inputFields: [
      { id: 'length', label: 'Password Length', type: 'number', placeholder: '16', required: true, validation: { min: 8, max: 128 } },
      { id: 'uppercase', label: 'Include Uppercase (A-Z)', type: 'checkbox', required: false },
      { id: 'numbers', label: 'Include Numbers (0-9)', type: 'checkbox', required: false },
      { id: 'symbols', label: 'Include Symbols (!@#$...)', type: 'checkbox', required: false },
      { id: 'excludeAmbiguous', label: 'Exclude Ambiguous (0/O, 1/l/I)', type: 'checkbox', required: false },
      {
        id: 'mode',
        label: 'Generation Mode',
        type: 'select',
        required: true,
        options: [
          { label: 'Random Characters', value: 'random' },
          { label: 'Pronounceable', value: 'pronounceable' },
          { label: 'Passphrase (4-word)', value: 'passphrase' },
        ],
      },
    ],
    outputFields: [
      { id: 'password', label: 'Generated Password', type: 'text', copyable: true },
      { id: 'strength', label: 'Strength Score', type: 'text', copyable: true },
      { id: 'crackTime', label: 'Time to Crack', type: 'text', copyable: true },
    ],
    algorithm: 'password-generator',
    keywords: ['password generator', 'secure password', 'random password', 'password strength'],
    createdAt: '2026-04-15',
  },

  // ── TIER 4: Everyday Tools ──
  {
    id: 'tool_006',
    slug: 'invoice-generator',
    name: 'Invoice Generator',
    tagline: 'Create a professional invoice in 30 seconds.',
    description: 'Fill in your details, add line items, and download a clean PDF invoice. No sign-up, no database.',
    longDescription: `Stop emailing IOUs in plain text. This invoice generator creates clean, professional PDF invoices in your browser — no sign-up, no database, your data never leaves your machine.

Features:
- Your brand name + logo placeholder
- Client details
- Line items with quantity × rate
- Automatic subtotal + tax + total
- PayPal.me payment link built in
- Download as PDF

Perfect for freelancers, side-hustlers, and small service providers.`,
    category: 'Finance',
    tags: ['invoice', 'invoice generator', 'freelance', 'billing', 'pdf', 'receipt'],
    difficulty: 'beginner',
    inputFields: [
      { id: 'fromName', label: 'Your Name / Business', type: 'text', placeholder: 'Your Name or Business', required: true },
      { id: 'fromEmail', label: 'Your Email', type: 'text', placeholder: 'you@email.com', required: true },
      { id: 'toName', label: 'Client Name', type: 'text', placeholder: 'Client Name', required: true },
      { id: 'toEmail', label: 'Client Email', type: 'text', placeholder: 'client@email.com', required: false },
      { id: 'invoiceNumber', label: 'Invoice Number', type: 'text', placeholder: 'INV-001', required: true },
      { id: 'issueDate', label: 'Issue Date', type: 'text', placeholder: '2026-04-18', required: true },
      { id: 'dueDate', label: 'Due Date', type: 'text', placeholder: '2026-05-18', required: true },
      { id: 'items', label: 'Line Items (JSON array)', type: 'textarea', placeholder: '[{"description":"Service","quantity":1,"rate":100}]', required: true },
      { id: 'notes', label: 'Notes (optional)', type: 'textarea', placeholder: 'Thank you for your business!', required: false },
    ],
    outputFields: [
      { id: 'preview', label: 'Invoice Preview', type: 'html', copyable: false },
      { id: 'downloadPDF', label: 'Download PDF', type: 'html', copyable: false },
      { id: 'paypalLink', label: 'PayPal Payment Link', type: 'text', copyable: true },
    ],
    algorithm: 'invoice-generator',
    keywords: ['invoice generator', 'free invoice', 'pdf invoice', 'freelance invoice', 'invoice template'],
    createdAt: '2026-04-15',
  },
  {
    id: 'tool_007',
    slug: 'bmi-calculator',
    name: 'BMI Calculator',
    tagline: 'Know your body mass index in 10 seconds.',
    description: 'Enter your height and weight to calculate your BMI category — underweight, normal, overweight, or obese.',
    longDescription: `A simple, fast BMI calculator that tells you exactly where you stand. Enter your height and weight in your preferred units (metric or imperial) and get instant results with category breakdown.

Uses the standard WHO BMI classification:
- < 18.5: Underweight
- 18.5–24.9: Normal
- 25–29.9: Overweight
- 30+: Obese

Also shows healthy weight range for your height.`,
    category: 'Health',
    tags: ['bmi', 'calculator', 'health', 'weight', 'fitness', 'body mass index'],
    difficulty: 'beginner',
    inputFields: [
      { id: 'heightValue', label: 'Height', type: 'number', placeholder: '175', required: true, validation: { min: 50, max: 300 } },
      {
        id: 'heightUnit',
        label: 'Height Unit',
        type: 'select',
        required: true,
        options: [
          { label: 'cm', value: 'cm' },
          { label: 'inches', value: 'in' },
        ],
      },
      { id: 'weightValue', label: 'Weight', type: 'number', placeholder: '70', required: true, validation: { min: 10, max: 500 } },
      {
        id: 'weightUnit',
        label: 'Weight Unit',
        type: 'select',
        required: true,
        options: [
          { label: 'kg', value: 'kg' },
          { label: 'lbs', value: 'lbs' },
        ],
      },
      { id: 'age', label: 'Age', type: 'number', placeholder: '30', required: false, validation: { min: 18, max: 120 } },
      {
        id: 'gender',
        label: 'Gender',
        type: 'select',
        required: false,
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ],
      },
    ],
    outputFields: [
      { id: 'bmi', label: 'BMI', type: 'number', copyable: true },
      { id: 'category', label: 'Category', type: 'text', copyable: true },
      { id: 'healthyRange', label: 'Healthy Weight Range', type: 'text', copyable: true },
    ],
    algorithm: 'bmi-calculator',
    keywords: ['bmi calculator', 'body mass index', 'weight calculator', 'health calculator'],
    createdAt: '2026-04-15',
  },
  {
    id: 'tool_008',
    slug: 'unit-converter',
    name: 'Unit Converter',
    tagline: 'Convert anything to anything — 50+ units.',
    description: 'Length, weight, temperature, digital storage, speed, time, and more. Pick a category and convert instantly.',
    longDescription: `The most comprehensive unit converter on the web. 50+ units across 8 categories:

- Length: m, km, mi, ft, in, cm, mm, nm, yd
- Weight: kg, lbs, oz, g, mg, ton
- Temperature: °C, °F, K
- Digital Storage: B, KB, MB, GB, TB, PB, bits
- Speed: m/s, km/h, mph, knots
- Time: ms, s, min, hr, day, week, month, year
- Area: m², km², ft², acre, hectare
- Volume: L, mL, gal, qt, fl oz, m³

Pick category → enter value → get instant results.`,
    category: 'Everyday',
    tags: ['converter', 'unit converter', 'measurement', 'conversion', 'calculator'],
    difficulty: 'beginner',
    inputFields: [
      {
        id: 'category',
        label: 'Category',
        type: 'select',
        required: true,
        options: [
          { label: 'Length', value: 'length' },
          { label: 'Weight', value: 'weight' },
          { label: 'Temperature', value: 'temp' },
          { label: 'Digital Storage', value: 'storage' },
          { label: 'Speed', value: 'speed' },
          { label: 'Time', value: 'time' },
          { label: 'Area', value: 'area' },
          { label: 'Volume', value: 'volume' },
        ],
      },
      { id: 'value', label: 'Value', type: 'number', placeholder: '1', required: true },
      {
        id: 'from',
        label: 'From',
        type: 'select',
        required: true,
        options: [
          { label: 'meter (m)', value: 'm' },
          { label: 'kilometer (km)', value: 'km' },
          { label: 'mile (mi)', value: 'mi' },
          { label: 'foot (ft)', value: 'ft' },
          { label: 'inch (in)', value: 'in' },
          { label: 'centimeter (cm)', value: 'cm' },
        ],
      },
      {
        id: 'to',
        label: 'To',
        type: 'select',
        required: true,
        options: [
          { label: 'meter (m)', value: 'm' },
          { label: 'kilometer (km)', value: 'km' },
          { label: 'mile (mi)', value: 'mi' },
          { label: 'foot (ft)', value: 'ft' },
          { label: 'inch (in)', value: 'in' },
          { label: 'centimeter (cm)', value: 'cm' },
        ],
      },
    ],
    outputFields: [
      { id: 'result', label: 'Result', type: 'number', copyable: true },
      { id: 'allConversions', label: 'All Conversions', type: 'html', copyable: false },
    ],
    algorithm: 'unit-converter',
    keywords: ['unit converter', 'conversion calculator', 'convert units', 'metric converter'],
    createdAt: '2026-04-15',
  },
  {
    id: 'tool_009',
    slug: 'tip-calculator',
    name: 'Tip Calculator',
    tagline: 'Split the bill. Tip fair. Never argue again.',
    description: 'Enter your bill total, choose a tip percentage, and split by number of people. Get exact per-person amounts instantly.',
    longDescription: `The tip calculator that ends bill-time awkwardness. Enter your bill, choose your tip %, split between any number of people, and get exact amounts per person down to the cent.

Tip presets: 10%, 15%, 18%, 20%, 25%
Split options: 1–20 people
Shows: tip amount, total with tip, per-person amount

Perfect for restaurant bills, bar tabs, and group trips.`,
    category: 'Everyday',
    tags: ['tip', 'calculator', 'restaurant', 'split bill', 'dining', ' tipping'],
    difficulty: 'beginner',
    inputFields: [
      { id: 'billAmount', label: 'Bill Total ($)', type: 'number', placeholder: '147.50', required: true, validation: { min: 0.01 } },
      {
        id: 'tipPercent',
        label: 'Tip %',
        type: 'select',
        required: true,
        options: [
          { label: '10% (Bare minimum)', value: '10' },
          { label: '15% (Okay)', value: '15' },
          { label: '18% (Good)', value: '18' },
          { label: '20% (Great)', value: '20' },
          { label: '25% (Exceptional)', value: '25' },
          { label: 'Custom', value: 'custom' },
        ],
      },
      { id: 'customTip', label: 'Custom Tip %', type: 'number', placeholder: '20', required: false },
      {
        id: 'split',
        label: 'Split Between',
        type: 'select',
        required: true,
        options: [
          { label: '1 person', value: '1' },
          { label: '2 people', value: '2' },
          { label: '3 people', value: '3' },
          { label: '4 people', value: '4' },
          { label: '5 people', value: '5' },
          { label: '6+ people', value: 'custom' },
        ],
      },
      { id: 'customSplit', label: 'Custom Split (people)', type: 'number', placeholder: '4', required: false },
    ],
    outputFields: [
      { id: 'tipAmount', label: 'Tip Amount', type: 'number', copyable: true },
      { id: 'totalWithTip', label: 'Total with Tip', type: 'number', copyable: true },
      { id: 'perPerson', label: 'Per Person', type: 'number', copyable: true },
    ],
    algorithm: 'tip-calculator',
    keywords: ['tip calculator', 'tip', 'split bill', 'restaurant calculator', 'dining'],
    createdAt: '2026-04-15',
  },
  {
    id: 'tool_010',
    slug: 'random-word-generator',
    name: 'Random Word Generator',
    tagline: 'Random words for games, writing, and brainstorming.',
    description: 'Generate random English words by category — adjectives, nouns, verbs, or mixed. Perfect for creative blocks.',
    longDescription: `When your brain is fried and you need a spark. Pick a category, set how many words you want, and get random real English words instantly.

Categories:
- Adjectives (creative, stubborn, luminous...)
- Nouns (horizon, lantern, canyon...)
- Verbs (drift, shatter, ignite...)
- Mixed (all types)
- Custom themed lists

Great for: word games, creative writing prompts, design challenges, team warm-ups, and vocabulary building.`,
    category: 'Language',
    tags: ['random words', 'word generator', 'creative', 'writing', 'games', 'vocabulary'],
    difficulty: 'beginner',
    inputFields: [
      {
        id: 'category',
        label: 'Category',
        type: 'select',
        required: true,
        options: [
          { label: 'Mixed', value: 'mixed' },
          { label: 'Adjectives', value: 'adjective' },
          { label: 'Nouns', value: 'noun' },
          { label: 'Verbs', value: 'verb' },
          { label: 'Colors', value: 'color' },
          { label: 'Animals', value: 'animal' },
          { label: 'Places', value: 'place' },
          { label: 'Food', value: 'food' },
        ],
      },
      { id: 'count', label: 'Number of Words', type: 'number', placeholder: '10', required: true, validation: { min: 1, max: 100 } },
      { id: 'syllables', label: 'Max Syllables (optional)', type: 'number', placeholder: '3', required: false, validation: { min: 1, max: 5 } },
    ],
    outputFields: [
      { id: 'words', label: 'Random Words', type: 'html', copyable: true },
    ],
    algorithm: 'random-word-generator',
    keywords: ['random word generator', 'random words', 'word generator', 'creative writing', 'vocabulary'],
    createdAt: '2026-04-15',
  },
];

export function getAllTools(): Tool[] {
  return TOOLS;
}

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: string): Tool[] {
  return TOOLS.filter((t) => t.category === category);
}

export const TOOL_CATEGORIES = [
  'Finance',
  'Language',
  'Social Media',
  'Security',
  'Health',
  'Everyday',
] as const;

export const TOOL_CATEGORY_ICONS: Record<string, string> = {
  Finance: '💰',
  Language: '🔤',
  'Social Media': '📱',
  Security: '🔐',
  Health: '❤️',
  Everyday: '🛠️',
};

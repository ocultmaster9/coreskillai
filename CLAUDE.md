# CORESKILLAI.COM — BUILD & DEPLOY PROMPT FOR CLAUDE CODE

## WHAT WE ARE BUILDING

**coreskillai.com** — An AI-powered utility tool factory + premium digital product store. Two things in one:

1. **Free Browser-Based Tools** — Users get instant results, no sign-up, no server, everything runs in their browser
2. **Premium Digital Products** — We sell production-ready templates, frameworks, and swipe files for builders and autonomous AI workers ($27–$197 range)

**THE BRAND:**
- Name: coreskillai
- URL: https://coreskillai.com
- Email: uarddrago@gmail.com
- PayPal.me: https://paypal.me/ocultmaster9
- Gumroad Store: https://gumroad.com/ocultmaster
- Color: Deep dark background (#0a0a0f), Brand purple (#6680ff), White text
- Style: Dark mode, modern, sharp, no fluff

---

## TECH STACK

- **Next.js 14** with App Router
- **Static Export** (`output: 'export'`) → deploy to Cloudflare Pages
- **Tailwind CSS** for styling
- **TypeScript**
- **No backend** — static site, runs 100% in browser for tools
- Package manager: npm

---

## PAGES WE NEED

### 1. HOMEPAGE (/)
- Hero section: headline "AI Tools + Digital Products Built for Builders", subheadline, two CTA buttons: "Try Free Tools" → /tools and "Shop Products" → /products
- "Free Tools" section: grid of 6 tool cards
- "Featured Products" section: 3 product cards
- "Why coreskillai?" section: 3 benefit cards
- Support CTA: "Like what we build? Donate via PayPal.me"
- AdSense slots: leaderboard after hero, medium rectangle between sections

### 2. TOOLS DIRECTORY (/tools)
- Page header with title "AI Tools — All Free"
- Sticky category filter bar (Finance, Language, Social Media, Security, Health, Everyday)
- Tools listed by category with icons
- Each tool card links to /tools/[slug]
- Each card shows: name, tagline, difficulty badge, tags

### 3. TOOL PAGES (/tools/[slug])
- 10 tools total, all with working algorithms:
  - **Tax Refund Calculator** — income, filing status, deductions → estimated refund
  - **Unscramble** — letters → all valid English words possible
  - **Word Counter** — text → word count, char count, sentences, reading time
  - **Hashtag Generator** — topic → platform-specific hashtags
  - **Password Generator** — length + options → cryptographically random password
  - **Invoice Generator** — fill details → live preview + PayPal.me payment link
  - **BMI Calculator** — height/weight → BMI + category
  - **Unit Converter** — convert between metric/imperial/digital units
  - **Tip Calculator** — bill + tip % + split → per person amount
  - **Random Word Generator** — category + count → random word list
- Each tool page: sticky sidebar with PayPal donation + sidebar ad + related products
- Results appear below the form when user clicks "Run [Tool Name]"
- All algorithms run 100% client-side JavaScript

### 4. PRODUCTS LISTING (/products)
- Header with "Build With the Best"
- Filter bar by product type (Ultimate Guide, Course, Templates, Swipes, Checklist, Framework)
- All 9 products in a grid
- AdSense leaderboard at top

### 5. PRODUCT DETAIL PAGES (/products/[slug])
- 9 products:
  - Universal API Connector — $97 (Ultimate Guide)
  - AI Self-Improvement System — $97 (Ultimate Guide)
  - Deep Reasoning Framework — $97 (Ultimate Guide)
  - Content Strategy Engine — $97 (Ultimate Guide)
  - Universal Token Manager — $147 (Course)
  - Master Character Design — $67 (Templates)
  - Viral Hook Formula — $47 (Swipes)
  - Startup Error Checklist — $27 (Checklist)
  - Autonomous Income System — $77 (Framework)
- Each page shows: name, tagline, description, long description, features list, what's included, price
- Two buy buttons: "Buy with PayPal" (via PayPal Checkout) + "Buy on Gumroad"
- Sidebar: PayPal donation card + AdSense slot + "More Products" list

### 6. BLOG (/blog)
- Grid of article cards with image, title, excerpt, date, read time, tags
- 4 sample articles (you'll write real ones later)
- Newsletter signup form (email input + subscribe button)
- AdSense slots

### 7. ABOUT (/about)
- Brand story, what we offer (4 cards), contact CTA with PayPal donation

### 8. CONTACT (/contact)
- Contact form: name, email, topic (dropdown), message, send button
- Direct email fallback: contact@coreskillai.com

### 9. 404 PAGE
- "404 — Page not found" with Go Home + Browse Tools buttons

---

## PAYMENT INTEGRATION

### PayPal (PRIMARY)
- Email: uarddrago@gmail.com
- PayPal.me: https://paypal.me/ocultmaster9
- Use PayPal.me direct links for donations
- Use PayPal Checkout (hosted) for product purchases
- Build checkout URL: `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=uarddrago@gmail.com&item_name=PRODUCT_NAME&amount=PRICE&currency_code=USD`

### Gumroad (SECONDARY)
- Store: https://gumroad.com/ocultmaster
- Each product has a Gumroad permalink (get from Gumroad dashboard)
- Use Gumroad overlay checkout: `https://gumroad.com/l/PERMALINK?wanted=1`

### Crypto (WALLET ADDRESSES — display only for now)
- BTC: 1A3FPhxwBFWS6KoqbP4bwHHDZQAkTAft5J
- ETH: 0xEe7E388B44fFb70911ccc7171e07f92E7044c2aD
- SOL: 56cFbTTJLyKXtpKz8Arngsz5DSej2Gh7j535BhtmQaoM
- Display these as "Pay with Crypto" options on product pages

### Google AdSense
- Publisher ID: `ca-pub-XXXXXXXX` (replace with real ID before deploying)
- Ad slots on: homepage, tool pages (header + inline + sidebar), product pages, blog
- Show placeholder in dev mode (when pub ID is placeholder)
- Use `adsbygoogle.js` loaded async from Google

---

## DESIGN SYSTEM

### Colors
```
Background:    #0a0a0f (dark-900)
Surface:       #111118 (dark-800)
Card:          #1a1a24 (dark-700)
Border:        #333344 (dark-500)
Brand Purple:  #6680ff (brand-500)
Brand Light:   #809cff (brand-400)
Text:          #ffffff (white)
Text Muted:   #9ca3af (gray-400)
Success:       #22c55e (green-500)
```

### Components
- **Navbar** — fixed top, glass blur effect when scrolled, logo + nav links + "Shop Products" CTA
- **Footer** — AdSense slot + logo + links + PayPal.me link
- **ProductCard** — gradient border on hover, price, PayPal button, Gumroad button, rating stars
- **ToolCard** — icon + name + tagline + difficulty badge + tags
- **PayPalButton** — official PayPal blue (#0070ba), PayPal logo SVG inside
- **AdSenseSlot** — placeholder box with "Ad Placement" when in dev mode

### Animations
- Fade in on load
- Slide up on hero elements
- Hover lift on cards (translate-y + shadow)
- No complex transitions — fast and sharp

---

## SEO

- Every page: title, meta description, canonical URL, OG tags, Twitter card
- Structured data (JSON-LD): WebSite schema on homepage, WebApplication on tool pages, Product on product pages
- robots: index, follow on all pages
- Sitemap generation (if possible)
- Semantic HTML throughout

---

## EXACT FILE STRUCTURE TO BUILD

```
coreskillai/
├── app/
│   ├── layout.tsx              # Root layout (fonts, Navbar, Footer)
│   ├── page.tsx                 # Homepage
│   ├── globals.css              # Tailwind + custom classes
│   ├── not-found.tsx           # 404 page
│   ├── tools/
│   │   ├── page.tsx           # Tools directory
│   │   └── [slug]/
│   │       ├── page.tsx        # Server wrapper + generateStaticParams
│   │       ├── ToolClient.tsx # Client component (interactive UI)
│   │       └── toolAlgorithms.ts # All 10 tool algorithms
│   ├── products/
│   │   ├── page.tsx           # Products listing
│   │   └── [slug]/page.tsx    # Product detail
│   ├── blog/
│   │   └── page.tsx           # Blog listing
│   ├── about/page.tsx
│   └── contact/page.tsx
├── components/
│   ├── adsense/
│   │   └── AdSenseSlot.tsx   # Ad unit (client component)
│   ├── paypal/
│   │   └── PayPalButton.tsx  # PayPal.me + Checkout buttons
│   ├── store/
│   │   └── ProductCard.tsx    # Product card + grid
│   ├── tools/
│   │   └── ToolCard.tsx       # Tool card + grid
│   └── ui/
│       ├── Navbar.tsx
│       └── Footer.tsx
├── lib/
│   ├── adsense.ts              # AdSense config
│   ├── adsenseConstants.ts     # AD_SIZES (server-safe)
│   ├── paypal.ts               # PayPal URL builders
│   ├── products.ts             # 9-product catalog
│   └── toolsRegistry.ts        # 10 tool definitions
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── postcss.config.js
```

---

## ALGORITHMS — WHAT EACH TOOL DOES

### Tax Refund Calculator
Input: annual income, filing status (single/married/head of household), tax withheld, dependents, deduction type
Output: estimated refund, effective tax rate, total tax owed
Logic: US 2024 tax brackets, standard deduction $14,600, $2,000 per dependent

### Unscramble
Input: mixed-up letters, min word length, starts with (optional), contains (optional)
Output: list of valid English words that can be formed
Logic: dictionary lookup by word length, backtracking letter availability check

### Word Counter
Input: text blob
Output: word count, character count (with/without spaces), sentence count, paragraph count, reading time (200 WPM), speaking time (150 WPM)

### Hashtag Generator
Input: topic/caption text, platform (instagram/twitter/linkedin/tiktok/all), number of hashtags
Output: platform-specific hashtag set
Logic: extract keywords, map to hashtag templates per platform

### Password Generator
Input: length (8-128), uppercase toggle, numbers toggle, symbols toggle, exclude ambiguous toggle, mode (random/pronounceable/passphrase)
Output: password, strength score, time to crack
Logic: crypto.getRandomValues for secure randomness

### Invoice Generator
Input: from name, from email, to name, to email, invoice number, issue date, due date, line items (JSON), notes
Output: HTML invoice preview, PayPal.me payment link for total
Logic: render table, calculate subtotal/total, build PayPal.me URL

### BMI Calculator
Input: height value + unit (cm/inches), weight value + unit (kg/lbs)
Output: BMI number, category (underweight/normal/overweight/obese), healthy weight range

### Unit Converter
Input: category (length/weight/temp/digital/time/area/volume), value, from unit, to unit
Output: converted value
Logic: all units converted through a base unit

### Tip Calculator
Input: bill amount, tip % (preset or custom), split between (people)
Output: tip amount, total with tip, per person amount

### Random Word Generator
Input: category (mixed/adjective/noun/verb/color/animal/place/food), number of words
Output: list of random words
Logic: pick from word lists, shuffle with Fisher-Yates

---

## CRYPTO WALLET ADDRESSES (display as payment options)

**Bitcoin (BTC):** 1A3FPhxwBFWS6KoqbP4bwHHDZQAkTAft5J
**Ethereum (ETH):** 0xEe7E388B44fFb70911ccc7171e07f92E7044c2aD
**Solana (SOL):** 56cFbTTJLyKXtpKz8Arngsz5DSej2Gh7j535BhtmQaoM

Display these on product detail pages as "Pay with Crypto" section below PayPal/Gumroad buttons. No backend needed — just show the addresses.

---

## DEPLOYMENT

After building, deploy the `/out` folder to Cloudflare Pages:
- Push to GitHub → connect repo in Cloudflare Dashboard
- Build command: `npm run build`
- Output directory: `out`
- Environment variables: NEXT_PUBLIC_ADSENSE_PUB_ID, NEXT_PUBLIC_PAYPAL_EMAIL, NEXT_PUBLIC_PAYPAL_ME

---

## SUCCESS CRITERIA

1. ✅ Site builds with `npm run build` — ZERO errors
2. ✅ `/out` folder contains complete static site
3. ✅ Homepage shows hero, tools preview, products preview, AdSense slots
4. ✅ All 10 tool pages work — fill form, get results
5. ✅ All 9 product pages show price, description, PayPal + Gumroad buttons
6. ✅ PayPal.me links go to correct account (uarddrago@gmail.com)
7. ✅ AdSense placeholder shows on all ad slots
8. ✅ Site is deployed and live at coreskillai.com
9. ✅ Mobile responsive
10. ✅ Dark theme throughout

---

## NOTES

- AdSense: won't show real ads until Google approves the site. Placeholder is fine for now.
- Products: hosted on Gumroad, we link out — no digital delivery needed on our end
- Tools: all run client-side, no data ever leaves the user's browser
- Images: use Unsplash URLs for blog post thumbnails
- No database, no auth, no backend — pure static + client-side JS

---

Build it clean. Build it fast. Deploy it live.

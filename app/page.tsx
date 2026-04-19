import React from 'react';
import Link from 'next/link';
import AdSenseSlot from '@/components/adsense/AdSenseSlot'
import { AD_SIZES } from '@/lib/adsenseConstants';
import { getFeaturedProducts } from '@/lib/products';
import { getAllTools } from '@/lib/toolsRegistry';
import { ToolGrid } from '@/components/tools/ToolCard';
import SEOMeta, { StructuredData } from '@/components/seo/SEOMeta';
import StarField from '@/components/ui/StarField';

const FEATURED_TOOLS = getAllTools().slice(0, 6);
const FEATURED_PRODUCTS = getFeaturedProducts().slice(0, 3);

// ── Badge ──
function Badge() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-700 text-xs text-zinc-400 mb-8">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
      </span>
      10 free tools · no sign-up required
    </div>
  );
}

// ── Trust line icons ──
function CheckIcon() {
  return (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 20 20" className="text-emerald-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      <SEOMeta
        title="coreskillai — AI Tools + Digital Products for Builders"
        description="Free AI-powered tools (unscramble, word counter, hashtag generator, invoice generator, password generator) and premium digital products for builders and autonomous workers."
        canonical="/"
      />
      <StructuredData
        type="WebSite"
        data={{
          name: 'coreskillai',
          url: 'https://coreskillai.com',
          description: 'AI tools and digital products for builders',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://coreskillai.com/tools?q={search_term_string}',
            queryInput: 'required name=search_term_string',
          },
        }}
      />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <StarField />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-32 text-center">
          <Badge />

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.05] mb-6">
            AI Tools + Digital Products
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Built for Builders
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto mb-12 leading-relaxed">
            10 free AI-powered tools that run in your browser. Premium frameworks for autonomous workers. Nothing to sign up for.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link
              href="/tools"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/20"
            >
              <span>🚀</span>
              Try Free Tools
              <span className="text-indigo-300 group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-white font-semibold text-lg rounded-xl transition-all duration-200"
            >
              <span>💎</span>
              Browse Products
            </Link>
          </div>

          {/* Trust line */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5"><CheckIcon /> No account required</span>
            <span className="flex items-center gap-1.5"><CheckIcon /> 100% browser-based</span>
            <span className="flex items-center gap-1.5"><CheckIcon /> Your data stays local</span>
          </div>
        </div>
      </section>

      {/* ── HERO AD ── */}
      <section className="py-6 px-4">
        <div className="max-w-4xl mx-auto flex justify-center">
          <AdSenseSlot slotId="HOME_HERO_LEADERBOARD" sizes={AD_SIZES.horizontal} />
        </div>
      </section>

      {/* ── FREE TOOLS ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-2">Free Forever</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">AI-Powered Tools</h2>
            </div>
            <Link href="/tools" className="hidden sm:inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors font-medium">
              View all 10
              <span>→</span>
            </Link>
          </div>

          <ToolGrid tools={FEATURED_TOOLS} columns={3} />

          <div className="mt-8 text-center sm:hidden">
            <Link href="/tools" className="inline-flex items-center gap-1 text-sm text-indigo-400 font-medium">
              View all 10 tools →
            </Link>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-12 border-y border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-zinc-500">
            Trusted by <span className="text-white font-medium">2,400+</span> autonomous workers ·{' '}
            <span className="text-white font-medium">10</span> free tools ·{' '}
            <span className="text-emerald-400 font-medium">$0 to start</span>
          </p>
        </div>
      </section>

      {/* ── IN-ARTICLE AD ── */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4 flex justify-center">
          <AdSenseSlot slotId="HOME_TOOLS_MRECT" sizes={AD_SIZES.rectangle} />
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-20 px-4 sm:px-6 bg-zinc-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-indigo-400 text-xs font-semibold tracking-widest uppercase mb-2">Premium Products</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Build Faster. Scale Smarter.
            </h2>
            <p className="text-zinc-400 max-w-lg mx-auto">
              Production-ready frameworks and systems for autonomous AI operators. Instant delivery via Gumroad or PayPal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURED_PRODUCTS.map((product) => (
              <div key={product.id} className="group relative flex flex-col rounded-xl border border-zinc-800 bg-zinc-950/60 hover:border-indigo-500/40 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/0 group-hover:via-indigo-500/60 transition-all duration-500" />
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs px-2 py-0.5 rounded-full border font-medium text-indigo-400 bg-indigo-500/10 border-indigo-500/20">
                      {product.type.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400">
                      <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                      <span className="text-xs font-medium">{product.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors mb-1.5">{product.name}</h3>
                  <p className="text-sm text-zinc-400 mb-4 leading-relaxed">{product.tagline}</p>
                  <ul className="space-y-1.5 mb-5 flex-1">
                    {product.features.slice(0, 4).map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0 mt-0.5 text-indigo-500" viewBox="0 0 20 20"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4 border-t border-zinc-800">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-white">${product.price}</span>
                        <span className="text-xs text-zinc-500 line-through">${product.price + 30}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a href={`https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=uarddrago%40gmail.com&item_name=${encodeURIComponent(product.name)}&amount=${product.price}.00&currency_code=USD&return=https%3A%2F%2Fcoreskillai.com%2Fdownload%2F${product.slug}&cancel_return=https%3A%2F%2Fcoreskillai.com%2Fproducts%2F${product.slug}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#0070ba] hover:bg-[#005ea6] text-white text-sm font-semibold rounded-lg transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/></svg>
                        PayPal
                      </a>
                      <a href={`https://gumroad.com/l/${product.gumroadPermaLink}?wanted=1`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors">
                        Gumroad
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 text-white font-medium rounded-xl transition-all duration-200">
              Browse all products <span className="text-zinc-400">· $27–$197</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── PRODUCT AD ── */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4 flex justify-center">
          <AdSenseSlot slotId="HOME_PRODUCTS_MRECT" sizes={AD_SIZES.rectangle} />
        </div>
      </section>

      {/* ── WHY CORESKILLAI ── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-14">
            Why coreskillai?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-indigo-400 mx-auto mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Instant Results',
                desc: 'Every tool runs in your browser. No servers, no sign-up, no waiting.',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-indigo-400 mx-auto mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: 'Privacy First',
                desc: 'Your data never leaves your device. We process everything client-side.',
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-indigo-400 mx-auto mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                ),
                title: 'Premium Products',
                desc: 'Real frameworks for real workflows. Not generic templates.',
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                {item.icon}
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUPPORT CTA ── */}
      <section className="py-24 px-4 sm:px-6 bg-gradient-to-b from-indigo-950/20 to-transparent">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Like what we build?
          </h2>
          <p className="text-zinc-400 mb-10 leading-relaxed">
            Buy a product, send a coffee, or just spread the word. Every bit of support keeps the free tools running.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://paypal.me/ocultmaster9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0070ba] hover:bg-[#005ea6] text-white font-semibold rounded-xl transition-all duration-200 hover:scale-[1.02]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z" />
              </svg>
              Donate via PayPal
            </a>
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-6 py-3.5 text-zinc-400 hover:text-white font-medium transition-colors"
            >
              Or browse products →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
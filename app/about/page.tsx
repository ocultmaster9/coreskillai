import React from 'react';
import Link from 'next/link';
import SEOMeta from '@/components/seo/SEOMeta';
import { PayPalMeLink } from '@/components/paypal/PayPalButton';

export default function AboutPage() {
  return (
    <>
      <SEOMeta
        title="About"
        description="coreskillai is an AI workforce builder for autonomous workers. Free tools + premium digital products. Built by uarD Drago."
        canonical="/about"
      />

      {/* Hero */}
      <section className="pt-24 pb-16 bg-dark-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-20 h-20 rounded-2xl bg-brand-500 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 shadow-2xl shadow-brand-500/30">
            CS
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white mb-4">
            About coreskillai
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
            An AI workforce builder for autonomous workers. Free tools + premium digital products.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="card-gradient space-y-6">
            <h2 className="text-2xl font-display font-bold text-white">The Story</h2>
            <div className="prose prose-invert max-w-none space-y-4">
              <p className="text-gray-300 leading-relaxed">
                coreskillai started as a simple idea: most AI tools are either free and basic, or expensive and complex. There's not much in between.
              </p>
              <p className="text-gray-300 leading-relaxed">
                We built this to fill that gap. Free, browser-based tools that actually work. And premium digital products that solve real problems for AI builders, autonomous workers, and digital creators.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Everything here is built to actually be used — not just admired and bookmarked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What we offer */}
      <section className="py-16 bg-dark-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-display font-bold text-white mb-8">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: '🛠️',
                title: 'Free AI Tools',
                desc: 'Browser-based tools that run locally. Unscramble words, count characters, generate hashtags, create invoices — all free, all instant.',
              },
              {
                icon: '💎',
                title: 'Digital Products',
                desc: 'Production-ready templates, frameworks, and swipe files for AI builders. From $27 to $197. Instant delivery via Gumroad or PayPal.',
              },
              {
                icon: '📚',
                title: 'Blog',
                desc: 'Deep dives on AI automation, income strategies, and digital product creation. No filler, no fluff. Written for builders who actually ship.',
              },
              {
                icon: '🤝',
                title: 'Open to Collaboration',
                desc: 'Got a tool idea? A product concept? Reach out. We work with builders, creators, and automation enthusiasts.',
              },
            ].map((item, i) => (
              <div key={i} className="card">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">Get in Touch</h2>
          <p className="text-gray-400 mb-6">
            Have a tool idea? Want a custom product? Just want to say hey?
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="mailto:contact@coreskillai.com" className="btn-primary">
              Email Us
            </a>
            <a
              href="https://paypal.me/ocultmaster9"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-paypal"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.531 1.11.987 1.53 2.352 1.53 4.647v.718h-2.215c-.917 0-1.746.617-1.746 1.513v7.315c0 .898-.828 1.564-1.746 1.564H8.59v6.169a.66.66 0 0 1-.64.637L3.603 21.35z" />
              </svg>
              Support via PayPal
            </a>
          </div>
          <div className="mt-4">
            <PayPalMeLink />
          </div>
        </div>
      </section>
    </>
  );
}

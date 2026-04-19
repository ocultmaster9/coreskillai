'use client';

// ============================================================
// FOOTER COMPONENT
// With AdSense, PayPal links, and product links
// ============================================================

import React from 'react';
import Link from 'next/link';
import { PayPalMeLink } from '@/components/paypal/PayPalButton';
import AdSenseSlot from '@/components/adsense/AdSenseSlot'
import { AD_SIZES } from '@/lib/adsenseConstants';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 border-t border-dark-500/30 mt-20">
      {/* Ad slot before footer */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <AdSenseSlot slotId="FOOTER_LEADERBOARD" sizes={AD_SIZES.horizontal} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
                CS
              </div>
              <span className="font-display font-bold text-lg text-white">
                coreskill<span className="text-brand-400">ai</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-xs">
              AI-powered tools and digital products for builders, creators, and autonomous workers.
            </p>
            <div className="flex items-center gap-3">
              <PayPalMeLink />
            </div>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-semibold text-white mb-4">Tools</h4>
            <ul className="space-y-2">
              {[
                { label: 'Unscramble', href: '/tools/unscramble' },
                { label: 'Word Counter', href: '/tools/word-counter' },
                { label: 'Hashtag Generator', href: '/tools/hashtag-generator' },
                { label: 'Password Generator', href: '/tools/password-generator' },
                { label: 'All Tools →', href: '/tools' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-white mb-4">Products</h4>
            <ul className="space-y-2">
              {[
                { label: 'All Products', href: '/products' },
                { label: 'Ultimate Guides', href: '/products?type=ultimate_guide' },
                { label: 'Templates', href: '/products?type=templates' },
                { label: 'Swipe Files', href: '/products?type=swipes' },
                { label: 'Checklists', href: '/products?type=checklist' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-dark-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {year} coreskillai.com — AI workforce for builders
          </p>
          <div className="flex items-center gap-4">
            <a href="mailto:contact@coreskillai.com" className="text-sm text-gray-500 hover:text-white transition-colors">
              Contact
            </a>
            <span className="text-gray-700">|</span>
            <a href="https://paypal.me/ocultmaster9" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-white transition-colors">
              Support via PayPal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ProductCard.tsx — clean 2026 design
'use client';

import React from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/products';

const TYPE_STYLES: Record<string, { label: string; className: string }> = {
  ultimate_guide: { label: 'Guide', className: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  course: { label: 'Course', className: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
  templates: { label: 'Templates', className: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  swipes: { label: 'Swipe File', className: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
  checklist: { label: 'Checklist', className: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  framework: { label: 'Framework', className: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
};

interface ProductCardProps {
  product: Product;
  showPayPal?: boolean;
  showGumroad?: boolean;
}

export default function ProductCard({ product, showPayPal = true, showGumroad = true }: ProductCardProps) {
  const typeStyle = TYPE_STYLES[product.type] || TYPE_STYLES.framework;

  const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=uarddrago%40gmail.com&item_name=${encodeURIComponent(product.name)}&amount=${product.price}.00&currency_code=USD&return=https%3A%2F%2Fcoreskillai.com%2Fdownload%2F${product.slug}&cancel_return=https%3A%2F%2Fcoreskillai.com%2Fproducts%2F${product.slug}`;

  return (
    <div className="group relative flex flex-col rounded-xl border border-zinc-800 bg-zinc-950/60 hover:border-indigo-500/40 transition-all duration-300 overflow-hidden">

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/0 group-hover:via-indigo-500/60 transition-all duration-500" />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${typeStyle.className}`}>
            {typeStyle.label}
          </span>
          <div className="flex items-center gap-1 text-amber-400">
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-medium">{product.rating}</span>
          </div>
        </div>

        {/* Name + tagline */}
        <h3 className="text-base font-semibold text-white group-hover:text-indigo-300 transition-colors mb-1.5">
          {product.name}
        </h3>
        <p className="text-sm text-zinc-400 mb-4 leading-relaxed">{product.tagline}</p>

        {/* Features */}
        <ul className="space-y-1.5 mb-5 flex-1">
          {product.features.slice(0, 4).map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0 mt-0.5 text-indigo-500" viewBox="0 0 20 20">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {f}
            </li>
          ))}
        </ul>

        {/* Price + CTA */}
        <div className="pt-4 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">${product.price}</span>
              <span className="text-xs text-zinc-500 line-through">${product.price + 30}</span>
            </div>
          </div>

          <div className="flex gap-2">
            {showPayPal && (
              <a
                href={paypalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#0070ba] hover:bg-[#005ea6] text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.076 21.337H2.47a.641.641 0 01-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z" />
                </svg>
                PayPal
              </a>
            )}
            {showGumroad && (
              <a
                href={`https://gumroad.com/l/${product.gumroadPermaLink}?wanted=1`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Gumroad
              </a>
            )}
            <Link
              href={`/products/${product.slug}`}
              className="px-3 py-2.5 border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white rounded-lg text-sm transition-colors"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ products, columns = 3 }: { products: Product[]; columns?: 2 | 3 | 4 }) {
  const grid = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };
  return (
    <div className={`grid ${grid[columns]} gap-4`}>
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
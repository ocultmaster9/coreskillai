import React from 'react';
import Link from 'next/link';
import { getAllProducts, PRODUCT_TYPE_LABELS, PRODUCT_TYPE_ICONS } from '@/lib/products';
import { ProductGrid } from '@/components/store/ProductCard';
import AdSenseSlot from '@/components/adsense/AdSenseSlot'
import { AD_SIZES } from '@/lib/adsenseConstants';
import SEOMeta from '@/components/seo/SEOMeta';

export default function ProductsPage() {
  const products = getAllProducts();
  const types = [...new Set(products.map((p) => p.type))];

  return (
    <>
      <SEOMeta
        title="Digital Products"
        description="Production-ready digital products for AI builders: API connectors, token managers, content engines, reasoning frameworks. Priced $27–$197. Instant delivery."
        canonical="/products"
      />

      {/* Header */}
      <section className="pt-24 pb-12 bg-dark-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <span className="section-label mb-4 block">Premium Digital Products</span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white mb-4">
            Build With the Best
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
            Production-ready templates, frameworks, and swipe files for autonomous AI workers and builders.
            Instant digital delivery via Gumroad or PayPal.
          </p>
          <div className="flex items-center gap-4 mt-6 text-sm">
            <span className="text-gray-500">9 products</span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-500">$27–$197 range</span>
            <span className="text-gray-600">•</span>
            <span className="text-gray-500">Instant delivery</span>
          </div>
        </div>
      </section>

      {/* Ad */}
      <div className="py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AdSenseSlot slotId="PRODUCTS_LIST_LEADER" sizes={AD_SIZES.horizontal} />
        </div>
      </div>

      {/* Filter bar */}
      <section className="sticky top-16 z-40 glass py-3 border-y border-dark-500/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            <a href="#all" className="px-4 py-1.5 text-sm rounded-full bg-brand-500 text-white flex-shrink-0">
              All Products
            </a>
            {types.map((type) => (
              <a
                key={type}
                href={`#${type}`}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-full bg-dark-700 hover:bg-dark-600 text-gray-300 hover:text-white transition-all flex-shrink-0 border border-dark-500/30 hover:border-brand-500/30"
              >
                <span>{PRODUCT_TYPE_ICONS[type]}</span>
                {PRODUCT_TYPE_LABELS[type]}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Products by type */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
          {types.map((type) => (
            <div key={type} id={type}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{PRODUCT_TYPE_ICONS[type]}</span>
                <h2 className="text-2xl font-display font-bold text-white">{PRODUCT_TYPE_LABELS[type]}s</h2>
                <span className="text-sm text-gray-500">
                  ({products.filter((p) => p.type === type).length})
                </span>
              </div>
              <ProductGrid
                products={products.filter((p) => p.type === type)}
                columns={3}
              />
            </div>
          ))}
        </div>
      </section>

      {/* All products grid */}
      <section id="all" className="py-12 bg-dark-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-display font-bold text-white mb-8">All Products</h2>
          <ProductGrid products={products} columns={3} />
        </div>
      </section>

      {/* Support CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-2xl font-display font-bold text-white mb-3">Want something custom?</h3>
          <p className="text-gray-400 mb-6">
            Need a tool or product built for your specific workflow? Let's talk.
          </p>
          <a href="mailto:contact@coreskillai.com" className="btn-primary">
            Get in Touch
          </a>
        </div>
      </section>
    </>
  );
}

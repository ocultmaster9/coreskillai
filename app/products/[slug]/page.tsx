import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug, getAllProducts, PRODUCT_TYPE_LABELS, PRODUCT_TYPE_ICONS } from '@/lib/products';
import PayPalButton from '@/components/paypal/PayPalButton';
import AdSenseSlot from '@/components/adsense/AdSenseSlot'
import { AD_SIZES } from '@/lib/adsenseConstants';
import SEOMeta, { StructuredData, buildProductSchema } from '@/components/seo/SEOMeta';

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const typeIcon = PRODUCT_TYPE_ICONS[product.type];
  const typeLabel = PRODUCT_TYPE_LABELS[product.type];

  return (
    <>
      <SEOMeta
        title={product.name}
        description={product.description}
        canonical={`/products/${product.slug}`}
        ogType="article"
      />
      <StructuredData
        type="Product"
        data={buildProductSchema({
          name: product.name,
          description: product.description,
          slug: product.slug,
          price: product.price,
          gumroadPermaLink: product.gumroadPermaLink,
        })}
      />

      {/* Breadcrumb */}
      <section className="pt-20 pb-6 bg-dark-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/products" className="hover:text-white transition-colors">Products</Link>
            <span>/</span>
            <span>{product.name}</span>
          </div>
        </div>
      </section>

      {/* Product hero */}
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT: Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{typeIcon}</span>
                  <span className="section-label">{typeLabel}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white mb-3">
                  {product.name}
                </h1>
                <p className="text-xl text-brand-400 font-semibold mb-2">{product.tagline}</p>
                <p className="text-gray-400 leading-relaxed">{product.description}</p>
              </div>

              {/* Long description */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">What You Get</h2>
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">{product.longDescription}</p>
                </div>
              </div>

              {/* Features */}
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-5">Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 text-brand-500 mt-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's included */}
              <div className="card-gradient">
                <h2 className="text-xl font-semibold text-white mb-5">What&apos;s Included</h2>
                <ul className="space-y-2">
                  {product.includes.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-brand-400">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ad */}
              <AdSenseSlot slotId={`PRODUCT_DETAIL_${product.slug.toUpperCase()}_INLINE`} sizes={AD_SIZES.rectangle} className="mx-auto max-w-[300px]" />
            </div>

            {/* RIGHT: Purchase card */}
            <div className="space-y-6">
              <div className="card-gradient sticky top-24">
                {/* Price */}
                <div className="mb-5">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-display font-extrabold text-white">${product.price}</span>
                    <span className="text-lg text-gray-500">USD</span>
                  </div>
                  <p className="text-sm text-gray-500">One-time payment. Lifetime access. Instant delivery.</p>
                </div>

                {/* CTAs */}
                <div className="space-y-3 mb-6">
                  <PayPalButton
                    amount={product.price}
                    productName={product.name}
                    productId={product.id}
                    variant="checkout"
                    size="lg"
                    className="w-full justify-center"
                  />
                  <PayPalButton
                    gumroadPermaLink={product.gumroadPermaLink}
                    variant="gumroad"
                    size="lg"
                    className="w-full justify-center"
                  />
                </div>

                {/* Guarantee + PayPal */}
                <div className="pt-4 border-t border-dark-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="text-green-400">🛡️</span>
                    Secure payment via PayPal or Gumroad
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="text-green-400">⚡</span>
                    Instant delivery after payment
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="text-green-400">♻️</span>
                    Lifetime updates included
                  </div>
                </div>

                {/* PayPal.me fallback */}
                <div className="mt-5 p-3 bg-dark-800/50 rounded-xl text-center">
                  <p className="text-xs text-gray-500 mb-2">Can&apos;t pay via those options?</p>
                  <a
                    href={`https://paypal.me/ocultmaster9/${product.price}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand-400 hover:text-brand-300 font-medium"
                  >
                    Pay directly via PayPal.me →
                  </a>
                </div>
              </div>

              {/* Sidebar ad */}
              <AdSenseSlot slotId={`PRODUCT_SIDEBAR_${product.slug.toUpperCase()}`} sizes={AD_SIZES.rectangle} />

              {/* Other products */}
              <div className="card">
                <h3 className="font-semibold text-white mb-4">More Products</h3>
                <div className="space-y-2">
                  {getAllProducts()
                    .filter((p) => p.id !== product.id)
                    .slice(0, 4)
                    .map((p) => (
                      <Link
                        key={p.id}
                        href={`/products/${p.slug}`}
                        className="flex items-center justify-between p-3 bg-dark-800 rounded-xl hover:bg-dark-600 transition-colors border border-dark-500/30 group"
                      >
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{p.name}</span>
                        <span className="text-sm font-semibold text-gray-500 group-hover:text-brand-400 transition-colors">${p.price}</span>
                      </Link>
                    ))}
                  <Link href="/products" className="block text-center text-sm text-brand-400 hover:text-brand-300 mt-3">
                    View all →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tags */}
      <section className="py-10 bg-dark-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span key={tag} className="text-sm px-3 py-1 bg-dark-700 rounded-full text-gray-400 border border-dark-500/30">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

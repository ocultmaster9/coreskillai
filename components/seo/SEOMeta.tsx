'use client';

// ============================================================
// SEO META COMPONENT
// Injects canonical + OG + Twitter meta tags
// ============================================================

import React from 'react';

interface SEOMetaProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  noIndex?: boolean;
}

export default function SEOMeta({
  title,
  description,
  canonical,
  ogImage = 'https://coreskillai.com/og-default.png',
  ogType = 'website',
  noIndex = false,
}: SEOMetaProps) {
  const siteUrl = 'https://coreskillai.com';
  const fullTitle = title.includes('coreskillai') ? title : `${title} | coreskillai`;
  const canonicalUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="coreskillai" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  );
}

// ============================================================
// STRUCTURED DATA (JSON-LD)
// Rich snippets for Google search
// ============================================================

interface StructuredDataProps {
  type: 'WebSite' | 'WebPage' | 'Product' | 'Article' | 'SoftwareApplication' | 'WebApplication';
  data: Record<string, unknown>;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ============================================================
// PRODUCT SCHEMA BUILDER
// ============================================================

export function buildProductSchema(product: {
  name: string;
  description: string;
  slug: string;
  price: number;
  gumroadPermaLink: string;
}) {
  return {
    '@type': 'Product',
    name: product.name,
    description: product.description,
    url: `https://coreskillai.com/products/${product.slug}`,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'coreskillai' },
    },
  };
}

// ============================================================
// WEBTOOL SCHEMA BUILDER
// ============================================================

export function buildWebToolSchema(tool: {
  name: string;
  description: string;
  slug: string;
}) {
  return {
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.description,
    url: `https://coreskillai.com/tools/${tool.slug}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
}

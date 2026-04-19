import React from 'react';
import Link from 'next/link';
import AdSenseSlot from '@/components/adsense/AdSenseSlot'
import { AD_SIZES } from '@/lib/adsenseConstants';
import SEOMeta from '@/components/seo/SEOMeta';

// Blog post data (in production, load from MDX files)
const BLOG_POSTS = [
  {
    slug: 'why-ai-setups-fail-within-30-days',
    title: 'Why Most AI Setups Fail Within 30 Days',
    excerpt: 'The real reason autonomous AI systems collapse after a month — and the exact checklist that prevents it. Based on analysis of 47 failed agentic deployments.',
    date: '2026-04-14',
    readTime: '8 min read',
    tags: ['AI', 'Autonomous', 'Debugging'],
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  },
  {
    slug: 'tax-refund-calculator-guide',
    title: 'How to Estimate Your Tax Refund in Under 60 Seconds',
    excerpt: 'Stop dreading tax season. This free calculator cuts through the complexity and gives you a real estimate in under a minute — no math, no spreadsheets, no confusion.',
    date: '2026-04-12',
    readTime: '5 min read',
    tags: ['Finance', 'Tools', 'Tax'],
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
  },
  {
    slug: 'unscramble-tool-word-games',
    title: 'The Unscramble Tool That Actually Works: A Word Game Player\'s Guide',
    excerpt: 'Every word game player\'s secret weapon. Drop your scrambled letters in and get every valid English word possible — sorted by length, filtered by rules, and sorted for high-scoring plays.',
    date: '2026-04-10',
    readTime: '4 min read',
    tags: ['Games', 'Language', 'Tools'],
    image: 'https://images.unsplash.com/photo-1619682817481-e9948911531b?w=800&q=80',
  },
  {
    slug: 'viral-hashtags-2026-guide',
    title: 'The Hashtag Strategy That Actually Works on Every Platform in 2026',
    excerpt: 'The right hashtags can 10x your reach. This guide breaks down exactly what works on Instagram, Twitter/X, LinkedIn, and TikTok — and how to generate them instantly.',
    date: '2026-04-08',
    readTime: '7 min read',
    tags: ['Social Media', 'Marketing', 'Viral'],
    image: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&q=80',
  },
];

export default function BlogPage() {
  return (
    <>
      <SEOMeta
        title="Blog"
        description="Articles on AI automation, tool reviews, income strategies, and digital product creation. Written for builders and autonomous workers."
        canonical="/blog"
      />

      {/* Header */}
      <section className="pt-24 pb-12 bg-dark-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <span className="section-label mb-4 block">Insights</span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white mb-4">
            The Blog
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
            AI automation, tool deep dives, income strategies, and digital product creation. No filler. No fluff.
          </p>
        </div>
      </section>

      {/* Ad */}
      <div className="py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AdSenseSlot slotId="BLOG_LIST_LEADER" sizes={AD_SIZES.horizontal} />
        </div>
      </div>

      {/* Posts grid */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {BLOG_POSTS.map((post) => (
              <article key={post.slug} className="card group overflow-hidden p-0">
                {/* Image */}
                <div className="aspect-video overflow-hidden bg-dark-800">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-brand-300 transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-400 mb-4 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-dark-600 rounded-full text-gray-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors"
                    >
                      Read →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-dark-800/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-2xl font-display font-bold text-white mb-3">
            Get articles like this in your inbox
          </h3>
          <p className="text-gray-400 mb-6">
            No spam. No newsletters. Just useful articles when they drop.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="you@email.com"
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

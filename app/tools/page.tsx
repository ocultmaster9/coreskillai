import React from 'react';
import Link from 'next/link';
import { getAllTools, TOOL_CATEGORIES, TOOL_CATEGORY_ICONS } from '@/lib/toolsRegistry';
import { ToolGrid } from '@/components/tools/ToolCard';
import SEOMeta from '@/components/seo/SEOMeta';

export default function ToolsPage() {
  const tools = getAllTools();

  return (
    <>
      <SEOMeta
        title="Free AI Tools"
        description="Free browser-based AI tools: unscramble words, count words, generate hashtags, crack safe passwords, create invoices, calculate BMI and more. No sign-up required."
        canonical="/tools"
      />

      {/* Header */}
      <section className="pt-24 pb-12 bg-dark-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <span className="section-label mb-4 block">100% Free</span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white mb-4">
            AI Tools — All Free
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
            Every tool runs 100% in your browser. No sign-up. No database. No tracking. Open the page, use it, done.
          </p>
        </div>
      </section>

      {/* Categories nav */}
      <section className="sticky top-16 z-40 glass py-3 border-y border-dark-500/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            <span className="text-sm text-gray-500 flex-shrink-0">Browse:</span>
            {TOOL_CATEGORIES.map((cat) => (
              <a
                key={cat}
                href={`#${cat.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full bg-dark-700 hover:bg-dark-600 text-gray-300 hover:text-white transition-all flex-shrink-0 border border-dark-500/30 hover:border-brand-500/30"
              >
                <span>{TOOL_CATEGORY_ICONS[cat]}</span>
                {cat}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Tools by category */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
          {TOOL_CATEGORIES.map((category) => {
            const catTools = tools.filter((t) => t.category === category);
            if (catTools.length === 0) return null;

            return (
              <div key={category} id={category.toLowerCase().replace(/\s+/g, '-')}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{TOOL_CATEGORY_ICONS[category]}</span>
                  <h2 className="text-2xl font-display font-bold text-white">{category}</h2>
                  <span className="text-sm text-gray-500">({catTools.length})</span>
                </div>
                <ToolGrid tools={catTools} columns={3} />
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-16 bg-dark-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="text-2xl font-display font-bold text-white mb-3">
            Need something specific?
          </h3>
          <p className="text-gray-400 mb-6">
            Tell us what tool should be next. We build on demand.
          </p>
          <a href="mailto:contact@coreskillai.com" className="btn-primary">
            Request a Tool
          </a>
        </div>
      </section>
    </>
  );
}

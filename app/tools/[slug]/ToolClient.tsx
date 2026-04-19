'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import type { Tool } from '@/lib/toolsRegistry';
import { runTool } from './toolAlgorithms';
import SEOMeta, { StructuredData, buildWebToolSchema } from '@/components/seo/SEOMeta';
import AdSenseSlot from '@/components/adsense/AdSenseSlot'
import { AD_SIZES } from '@/lib/adsenseConstants';
import { PayPalMeLink } from '@/components/paypal/PayPalButton';
export default function ToolClient({ tool }: { tool: Tool }) {

  const [form, setForm] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Record<string, string> | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleRun = useCallback(() => {
    const res = runTool(tool!.slug, form);
    setResult(res);
  }, [tool.slug, form]);

  const handleCopy = (value: string, key: string) => {
    navigator.clipboard.writeText(value.replace(/<[^>]+>/g, '')).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const handleFieldChange = (id: string, value: string) => {
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <>
      <SEOMeta
        title={tool.name}
        description={tool.description}
        canonical={`/tools/${tool?.slug}`}
        ogType="article"
      />
      <StructuredData
        type="WebApplication"
        data={buildWebToolSchema(tool!)}
      />

      {/* Header */}
      <section className="pt-20 pb-10 bg-dark-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
            <span>/</span>
            <span>{tool.name}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white mb-3">
            {tool.name}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl">{tool.tagline}</p>
        </div>
      </section>

      {/* Ad */}
      <div className="py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <AdSenseSlot slotId={`TOOL_HEADER_${tool.slug.toUpperCase()}`} sizes={AD_SIZES.horizontal} />
        </div>
      </div>

      {/* Main content */}
      <section className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: Tool form */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <span className="section-label">{tool.category}</span>
                  <span className="text-xs text-gray-500 capitalize bg-dark-600 px-2 py-0.5 rounded-full">{tool.difficulty}</span>
                </div>

                <div className="space-y-5">
                  {tool.inputFields.map((field) => {
                    if (field.type === 'text' || field.type === 'number') {
                      return (
                        <div key={field.id}>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            {field.label}
                            {field.required && <span className="text-red-400 ml-1">*</span>}
                          </label>
                          <input
                            type={field.type}
                            placeholder={field.placeholder}
                            value={form[field.id] || ''}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="input-field"
                          />
                        </div>
                      );
                    }
                    if (field.type === 'textarea') {
                      return (
                        <div key={field.id}>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            {field.label}
                            {field.required && <span className="text-red-400 ml-1">*</span>}
                          </label>
                          <textarea
                            placeholder={field.placeholder}
                            value={form[field.id] || ''}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="input-field min-h-[120px] resize-y"
                            rows={4}
                          />
                        </div>
                      );
                    }
                    if (field.type === 'select') {
                      return (
                        <div key={field.id}>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5">
                            {field.label}
                            {field.required && <span className="text-red-400 ml-1">*</span>}
                          </label>
                          <select
                            value={form[field.id] || ''}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className="input-field"
                          >
                            <option value="">Select...</option>
                            {field.options?.map((opt) => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        </div>
                      );
                    }
                    if (field.type === 'checkbox') {
                      return (
                        <div key={field.id} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id={field.id}
                            checked={form[field.id] === 'on'}
                            onChange={(e) => handleFieldChange(field.id, e.target.checked ? 'on' : '')}
                            className="w-4 h-4 rounded border-dark-500 bg-dark-800 text-brand-500 focus:ring-brand-500"
                          />
                          <label htmlFor={field.id} className="text-sm font-medium text-gray-300">
                            {field.label}
                          </label>
                        </div>
                      );
                    }
                    return null;
                  })}

                  <button
                    onClick={handleRun}
                    className="btn-primary w-full text-center py-4 text-base"
                  >
                    Run {tool.name} →
                  </button>
                </div>

                {/* Results */}
                {result && Object.keys(result).length > 0 && (
                  <div className="mt-8 pt-8 border-t border-dark-500/30">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Results</h3>
                    <div className="space-y-3">
                      {tool.outputFields.map((outField) => {
                        const value = result[outField.id] || '';
                        if (!value) return null;
                        if (outField.type === 'html') {
                          return (
                            <div key={outField.id}>
                              <label className="block text-sm font-medium text-gray-300 mb-2">{outField.label}</label>
                              <div dangerouslySetInnerHTML={{ __html: value }} />
                            </div>
                          );
                        }
                        return (
                          <div key={outField.id} className="flex items-center justify-between p-3 bg-dark-800 rounded-xl border border-dark-500/30">
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wider">{outField.label}</div>
                              <div className="text-lg font-mono text-white">{value}</div>
                            </div>
                            {outField.copyable && (
                              <button
                                onClick={() => handleCopy(value, outField.id)}
                                className="ml-3 flex-shrink-0 text-xs text-brand-400 hover:text-brand-300 transition-colors"
                              >
                                {copied === outField.id ? '✓ Copied' : 'Copy'}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Ad below tool */}
              <div className="mt-6">
                <AdSenseSlot slotId={`TOOL_BELOW_${tool.slug.toUpperCase()}`} sizes={AD_SIZES.rectangle} className="mx-auto max-w-[300px]" />
              </div>

              {/* Long description */}
              <div className="mt-10 card">
                <h2 className="text-xl font-semibold text-white mb-4">About This Tool</h2>
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="text-gray-400 leading-relaxed">{tool.longDescription}</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {tool.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-dark-600 rounded-full text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Sidebar */}
            <div className="space-y-6">
              {/* PayPal donation */}
              <div className="card-gradient text-center">
                <h3 className="font-semibold text-white mb-2">💛 Like this tool?</h3>
                <p className="text-sm text-gray-400 mb-4">Support the tool factory with a PayPal donation.</p>
                <a
                  href="https://paypal.me/ocultmaster9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-paypal w-full justify-center"
                >
                  Donate via PayPal.me
                </a>
                <div className="mt-3">
                  <PayPalMeLink />
                </div>
              </div>

              {/* Sidebar ad */}
              <AdSenseSlot slotId={`TOOL_SIDEBAR_${tool.slug.toUpperCase()}`} sizes={AD_SIZES.vertical} />

              {/* Related products */}
              <div className="card">
                <h3 className="font-semibold text-white mb-4">Related Products</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Universal API Connector', price: 97, slug: 'universal-api-connector' },
                    { name: 'Content Strategy Engine', price: 97, slug: 'content-strategy' },
                  ].map((p) => (
                    <Link
                      key={p.slug}
                      href={`/products/${p.slug}`}
                      className="flex items-center justify-between p-3 bg-dark-800 rounded-xl hover:bg-dark-600 transition-colors border border-dark-500/30"
                    >
                      <span className="text-sm text-gray-300">{p.name}</span>
                      <span className="text-sm font-semibold text-white">${p.price}</span>
                    </Link>
                  ))}
                  <Link href="/products" className="block text-center text-sm text-brand-400 hover:text-brand-300 mt-2">
                    View all products →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

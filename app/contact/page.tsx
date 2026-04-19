import React from 'react';
import SEOMeta from '@/components/seo/SEOMeta';

export default function ContactPage() {
  return (
    <>
      <SEOMeta
        title="Contact"
        description="Get in touch with coreskillai. Tool requests, product inquiries, collaboration ideas, or just to say hey."
        canonical="/contact"
      />

      <section className="pt-24 pb-16 bg-dark-900 min-h-[80vh] flex items-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 w-full">
          <span className="section-label mb-4 block">Get in Touch</span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-400 mb-10 leading-relaxed">
            Tool requests, product inquiries, collaboration ideas, or just to say hey. We read every message.
          </p>

          <form className="card-gradient space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
                <input type="text" placeholder="Your name" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                <input type="email" placeholder="you@email.com" className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Subject</label>
              <select className="input-field">
                <option value="">Select a topic...</option>
                <option value="tool-request">Request a New Tool</option>
                <option value="product-inquiry">Product Inquiry</option>
                <option value="collaboration">Collaboration</option>
                <option value="bug-report">Bug Report</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Message</label>
              <textarea
                placeholder="Tell us what's on your mind..."
                className="input-field min-h-[150px] resize-y"
                rows={6}
              />
            </div>
            <button type="submit" className="btn-primary w-full text-center py-4 text-base">
              Send Message →
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Prefer email directly?{' '}
              <a href="mailto:contact@coreskillai.com" className="text-brand-400 hover:text-brand-300">
                contact@coreskillai.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

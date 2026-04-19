import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

// AdSense publisher meta (replace with your actual pub ID)
const ADSENSE_PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || 'ca-pub-XXXXXXXX';

export const metadata: Metadata = {
  metadataBase: new URL('https://coreskillai.com'),
  title: {
    default: 'coreskillai — AI Tools & Digital Products for Builders',
    template: '%s | coreskillai',
  },
  description:
    'Free AI-powered tools (unscramble, word counter, hashtag generator, password generator, invoice generator) and premium digital products. Built for builders and autonomous workers.',
  keywords: [
    'AI tools',
    'digital products',
    'unscramble tool',
    'word counter',
    'hashtag generator',
    'invoice generator',
    'password generator',
    'digital products',
    'AI income',
    'autonomous workers',
  ],
  authors: [{ name: 'coreskillai' }],
  creator: 'coreskillai',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://coreskillai.com',
    siteName: 'coreskillai',
    title: 'coreskillai — AI Tools & Digital Products for Builders',
    description:
      'Free AI-powered tools and premium digital products. Built for builders and autonomous workers.',
    images: [{ url: '/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@MasterOcult',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&family=Fira+Code:wght@400;500&display=swap"
          rel="stylesheet"
        />

        {/* AdSense */}
        {ADSENSE_PUB_ID !== 'ca-pub-XXXXXXXX' && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUB_ID}`}
            crossOrigin="anonymous"
          />
        )}

        {/* Favicon (inline SVG) */}
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%236680ff'/><text x='50%' y='54%' dominant-baseline='middle' text-anchor='middle' font-size='14' font-weight='bold' fill='white'>CS</text></svg>"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

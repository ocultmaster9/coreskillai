/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_PAYPAL_EMAIL: 'uarddrago@gmail.com',
    NEXT_PUBLIC_PAYPAL_ME: 'https://paypal.me/ocultmaster9',
    NEXT_PUBLIC_GUMROAD_URL: 'https://gumroad.com/ocultmaster',
  },
  // Note: AdSense verified meta goes in app/layout.tsx head
  headAppend: [],
};

module.exports = nextConfig;

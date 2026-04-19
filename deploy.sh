# ============================================================
# CORESKILLAI.COM — DEPLOYMENT SCRIPT
# Next.js 14 → Cloudflare Pages (static export)
# ============================================================

#!/bin/bash

set -e

echo "🚀 Deploying coreskillai.com to Cloudflare Pages..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 2. Build static export
echo "🔨 Building static site..."
NEXT_PUBLIC_ADSENSE_PUB_ID="$ADSENSE_PUB_ID" \
NEXT_PUBLIC_PAYPAL_EMAIL="uarddrago@gmail.com" \
NEXT_PUBLIC_PAYPAL_ME="https://paypal.me/ocultmaster9" \
NEXT_PUBLIC_GUMROAD_URL="https://gumroad.com/ocultmaster" \
npm run build

# 3. Verify build output
echo "✅ Build complete. Checking output..."
if [ ! -d "out" ]; then
  echo "ERROR: 'out' directory not found after build"
  exit 1
fi

echo "📁 Build output verified (static pages in /out)"
echo ""
echo "📋 Next steps:"
echo "1. Push to GitHub: git add . && git commit -m 'deploy' && git push"
echo "2. Connect repo to Cloudflare Pages at dash.cloudflare.com"
echo "3. Set build command: npm run build"
echo "4. Set output directory: out"
echo "5. Add environment variables in Cloudflare Pages settings:"
echo "   - ADSENSE_PUB_ID = ca-pub-XXXXXXXX (your real ID)"
echo ""
echo "🎉 Deployment script complete!"

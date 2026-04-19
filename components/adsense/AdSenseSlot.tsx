'use client';

// ============================================================
// AdSense SLOT COMPONENT
// Renders a single Google AdSense ad unit
// Works with both display ads and in-feed ads
// ============================================================

import React, { useEffect, useRef, useState } from 'react';
import { ADSENSE_CONFIG } from '@/lib/adsense';

interface AdSenseSlotProps {
  slotId: string;
  sizes: Array<[number, number]>;
  format?: 'horizontal' | 'vertical' | 'rectangle' | 'auto';
  className?: string;
  style?: React.CSSProperties;
}

export default function AdSenseSlot({
  slotId,
  sizes,
  format = 'auto',
  className = '',
  style = {},
}: AdSenseSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    // Don't render ads in development or when publisher ID is placeholder
    if (!ADSENSE_CONFIG.publisherId || ADSENSE_CONFIG.publisherId === 'ca-pub-XXXXXXXX') {
      return;
    }

    if (typeof window === 'undefined') return;

    let mounted = true;

    const loadAd = async () => {
      try {
        // Load AdSense script if not already loaded
        if (!(window as any).adsbygoogle) {
          const script = document.createElement('script');
          script.src = `${ADSENSE_CONFIG.adScriptUrl}?client=${ADSENSE_CONFIG.publisherId}`;
          script.async = true;
          script.crossOrigin = 'anonymous';
          script.onload = () => initAd();
          document.head.appendChild(script);
        } else {
          initAd();
        }
      } catch (e) {
        if (mounted) setAdError(true);
      }
    };

    const initAd = () => {
      if (!mounted || !containerRef.current) return;
      try {
        (containerRef.current as any).innerHTML = '';
        const ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.dataset.slot = slotId;
        ins.dataset.fullWidthResponsive = 'true';

        // Set sizes
        const sizeStr = sizes.map((s) => `${s[0]}x${s[1]}`).join(',');
        ins.dataset.expectedSize = sizeStr;

        containerRef.current.appendChild(ins);

        if ((window as any).adsbygoogle) {
          (window as any).adsbygoogle.push(ins);
          setAdLoaded(true);
        }
      } catch (e) {
        if (mounted) setAdError(true);
      }
    };

    loadAd();

    return () => {
      mounted = false;
    };
  }, [slotId, sizes]);

  // Development mode placeholder
  if (!ADSENSE_CONFIG.publisherId || ADSENSE_CONFIG.publisherId === 'ca-pub-XXXXXXXX') {
    return (
      <div
        className={`ad-container flex items-center justify-center min-h-[100px] ${className}`}
        style={style}
      >
        <div className="text-center">
          <div className="text-gray-500 text-sm mb-1">Ad Placement</div>
          <div className="text-gray-600 text-xs">
            Set NEXT_PUBLIC_ADSENSE_PUB_ID to enable
          </div>
        </div>
      </div>
    );
  }

  if (adError) {
    return null; // Silently hide broken ad slots
  }

  return (
    <div
      ref={containerRef}
      id={slotId}
      className={`ad-slot ${className} ${adLoaded ? 'ad-loaded' : 'ad-loading'}`}
      style={{
        minHeight: sizes[0]?.[1] ? `${sizes[0][1]}px` : '100px',
        display: 'block',
        textAlign: 'center',
        ...style,
      }}
    />
  );
}

// ============================================================
// RESPONSIVE AD SIZES BY FORMAT
// AD_SIZES moved to lib/adsenseConstants.ts — import from there instead

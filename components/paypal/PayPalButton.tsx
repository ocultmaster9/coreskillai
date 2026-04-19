'use client';

// ============================================================
// PAYPAL BUTTON COMPONENT
// Direct PayPal.me links + hosted checkout buttons
// Email: uarddrago@gmail.com
// ============================================================

import React from 'react';
import { buildPayPalMeURL, buildPayPalCheckoutURL, buildGumroadURL } from '@/lib/paypal';

interface PayPalButtonProps {
  amount?: number;
  productName?: string;
  productId?: string;
  gumroadPermaLink?: string;
  variant?: 'paypalme' | 'checkout' | 'donate' | 'gumroad';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export default function PayPalButton({
  amount,
  productName,
  productId,
  gumroadPermaLink,
  variant = 'paypalme',
  size = 'md',
  className = '',
  children,
}: PayPalButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  // Build URL based on variant
  let href = '#';
  let target = '_self';

  if (variant === 'paypalme') {
    href = buildPayPalMeURL(amount);
    target = '_blank';
  } else if (variant === 'checkout' && productName && amount) {
    href = buildPayPalCheckoutURL(productName, amount, productId);
    target = '_blank';
  } else if (variant === 'donate') {
    href = `https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=uarddrago@gmail.com&currency_code=USD`;
    target = '_blank';
  } else if (variant === 'gumroad' && gumroadPermaLink) {
    href = buildGumroadURL(gumroadPermaLink);
    target = '_blank';
  }

  const buttonContent = children || (
    <span className="inline-flex items-center gap-2">
      <svg
        width={iconSize[size]}
        height={iconSize[size]}
        viewBox="0 0 24 24"
        fill="currentColor"
        className="flex-shrink-0"
      >
        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.531 1.11.987 1.53 2.352 1.53 4.647v.718h-2.215c-.917 0-1.746.617-1.746 1.513v7.315c0 .898-.828 1.564-1.746 1.564h-2.11v6.169a.66.66 0 0 1-.64.637l-4.348.012z" />
      </svg>
      {variant === 'paypalme' && `Pay with PayPal.me`}
      {variant === 'checkout' && `Buy with PayPal`}
      {variant === 'donate' && `Donate with PayPal`}
      {variant === 'gumroad' && `Buy on Gumroad`}
    </span>
  );

  return (
    <a
      href={href}
      target={target}
      rel="noopener noreferrer"
      className={`
        inline-flex items-center justify-center font-semibold rounded-xl
        bg-[#0070ba] hover:bg-[#005ea6] text-white
        transition-all duration-200 shadow-lg
        hover:shadow-[#0070ba]/30 active:scale-95
        cursor-pointer
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {buttonContent}
    </a>
  );
}

// ============================================================
// PAYPAL ME SHORT LINK BUTTON (standalone)
// ============================================================

interface PayPalMeLinkProps {
  amount?: number;
  className?: string;
}

export function PayPalMeLink({ amount, className = '' }: PayPalMeLinkProps) {
  const href = buildPayPalMeURL(amount);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-[#0070ba] hover:text-[#005ea6] font-medium text-sm transition-colors ${className}`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.531 1.11.987 1.53 2.352 1.53 4.647v.718h-2.215c-.917 0-1.746.617-1.746 1.513v7.315c0 .898-.828 1.564-1.746 1.564h-2.11v6.169a.66.66 0 0 1-.64.637l-4.348.012z" />
      </svg>
      PayPal.me/ocultmaster9
    </a>
  );
}

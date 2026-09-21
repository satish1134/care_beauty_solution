'use client';

import React from 'react';

// Authentic Amazon Official Vector Logo (amazon wordmark + official curved orange smile arrow with dimple)
export function AmazonLogo({ className = 'h-4 w-auto', variant = 'color' }: { className?: string; variant?: 'color' | 'white' | 'dark' }) {
  const textColor = variant === 'white' ? '#FFFFFF' : '#111827';
  const arrowColor = '#FF9900'; // Official Amazon Smile Orange

  return (
    <svg viewBox="0 0 108 34" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Amazon">
      {/* amazon wordmark */}
      <g fill={textColor}>
        {/* 'a' */}
        <path d="M12.4 17.5c-2.4 0-4.1-1.3-4.1-3.6 0-2.5 1.9-3.7 4.5-3.7 1.7 0 3.2.4 3.7.8v1.6c-.6-.4-1.9-.7-3.2-.7-1.3 0-2 .5-2 1.3 0 .8.7 1.2 1.9 1.2 1.6 0 2.8-.7 3.3-1.1v2.5c-.8.9-2.3 1.7-4.1 1.7zm3.8 2.2V9.6h2.8v1.4c.8-1.1 2.3-1.7 3.8-1.7 2.9 0 4.9 1.9 4.9 4.9v5.5h-2.8v-5.2c0-1.8-1.1-2.8-2.6-2.8-1.5 0-2.8 1.1-3.3 2.3v5.7h-2.8z" />
        {/* 'm' */}
        <path d="M29.5 9.6h2.7v1.4c.8-1.1 2.1-1.7 3.6-1.7 1.8 0 3.1.9 3.6 2.3.8-1.5 2.3-2.3 4-2.3 2.7 0 4.5 1.8 4.5 4.8v5.6h-2.8v-5.2c0-1.7-.9-2.6-2.2-2.6-1.4 0-2.5 1-2.9 2.2v5.6h-2.8v-5.2c0-1.7-.9-2.6-2.2-2.6-1.4 0-2.5 1-2.9 2.2v5.6h-2.8V9.6z" />
        {/* 'a' */}
        <path d="M51.8 17.5c-2.4 0-4.1-1.3-4.1-3.6 0-2.5 1.9-3.7 4.5-3.7 1.7 0 3.2.4 3.7.8v1.6c-.6-.4-1.9-.7-3.2-.7-1.3 0-2 .5-2 1.3 0 .8.7 1.2 1.9 1.2 1.6 0 2.8-.7 3.3-1.1v2.5c-.8.9-2.3 1.7-4.1 1.7zm3.8 2.2V9.6h2.8v10.1h-2.8z" />
        {/* 'z' */}
        <path d="M62.2 19.7V17l5.4-5.3h-5.2V9.6h9.1v2.5l-5.4 5.3h5.7v2.3h-9.6z" />
        {/* 'o' */}
        <path d="M78.6 19.9c-3.3 0-5.7-2.3-5.7-5.3s2.4-5.3 5.7-5.3c3.3 0 5.7 2.3 5.7 5.3s-2.4 5.3-5.7 5.3zm0-2.4c1.7 0 2.8-1.3 2.8-2.9 0-1.6-1.1-2.9-2.8-2.9-1.7 0-2.8 1.3-2.8 2.9 0 1.6 1.1 2.9 2.8 2.9z" />
        {/* 'n' */}
        <path d="M88.5 9.6h2.7v1.4c.8-1.1 2.2-1.7 3.7-1.7 2.8 0 4.7 1.9 4.7 4.9v5.5h-2.8v-5.2c0-1.8-1.1-2.8-2.6-2.8-1.5 0-2.8 1.1-3.3 2.3v5.7h-2.8V9.6z" />
      </g>

      {/* Official Amazon curved smile arrow (from below 1st 'a' to 'z') */}
      <path
        d="M10.5 24.8C25.5 30.5 58.5 31.5 73.2 22.8"
        stroke={arrowColor}
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Official Arrowhead with characteristic curl */}
      <path
        d="M68.5 19.5L77 22L71.5 28C71.5 28 72.8 24.5 68.5 19.5Z"
        fill={arrowColor}
      />
    </svg>
  );
}

// Authentic Nykaa Official Vector Logo (Distinctive NYKAA bold brandmark with precision angled cuts in #FC2779)
export function NykaaLogo({ className = 'h-4 w-auto', variant = 'color' }: { className?: string; variant?: 'color' | 'white' }) {
  const brandColor = variant === 'white' ? '#FFFFFF' : '#FC2779'; // Official Nykaa Hot Pink

  return (
    <svg viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Nykaa">
      <g fill={brandColor}>
        {/* 'N' */}
        <path d="M3 21V3H7.5L15.5 15.2V3H20V21H15.5L7.5 8.8V21H3Z" />
        {/* 'Y' */}
        <path d="M22.5 3H27.5L32 10.8L36.5 3H41.5L34.5 14V21H29.5V14L22.5 3Z" />
        {/* 'K' */}
        <path d="M44 3H49V10.2L55.5 3H61.5L53.5 11.5L62 21H55.8L49 12.8V21H44V3Z" />
        {/* 'A' */}
        <path d="M63 21L70.5 3H75.5L83 21H78L76.5 17H69.5L68 21H63ZM70.8 13.5H75.2L73 7.8L70.8 13.5Z" />
        {/* 'A' */}
        <path d="M82.5 21L90 3H95L102.5 21H97.5L96 17H89L87.5 21H82.5ZM90.3 13.5H94.7L92.5 7.8L90.3 13.5Z" />
      </g>
    </svg>
  );
}

// Authentic Flipkart Official Vector Logo (Signature blue shopping bag with yellow handle + white speed 'f' + crisp vector wordmark)
export function FlipkartLogo({ className = 'h-4 w-auto', variant = 'color' }: { className?: string; variant?: 'color' | 'white' }) {
  const brandBlue = variant === 'white' ? '#FFFFFF' : '#2874F0'; // Official Flipkart Blue
  const handleYellow = '#FFE11B'; // Official Flipkart Yellow

  return (
    <svg viewBox="0 0 112 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Flipkart">
      {/* Flipkart Shopping Bag Emblem */}
      <g transform="translate(1, 2)">
        {/* Yellow curved handle */}
        <path
          d="M8.5 7.5C8.5 3.5 14.5 3.5 14.5 7.5"
          stroke={handleYellow}
          strokeWidth="2.4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Blue shopping bag body with rounded corners */}
        <path
          d="M4 7.5H19L17.2 22.5C17.1 23.3 16.4 24 15.6 24H7.4C6.6 24 5.9 23.3 5.8 22.5L4 7.5Z"
          fill="#2874F0"
        />
        {/* White speed 'f' cutout inside the bag */}
        <path
          d="M14.2 11.2C13.8 10.6 13.1 10.3 12.3 10.3C10.7 10.3 9.8 11.5 9.6 12.8H8.5V14.4H9.4L8.8 20.5H10.8L11.4 14.4H13.2L13.5 12.8H11.5C11.6 12.1 12 11.8 12.5 11.8C12.8 11.8 13.2 11.9 13.4 12.1L14.2 11.2Z"
          fill="#FFFFFF"
        />
      </g>

      {/* Flipkart Wordmark in crisp vector paths */}
      <g fill={brandBlue}>
        {/* 'F' */}
        <path d="M27 6.5h9v2.5h-6.2v3.6h5.6v2.5h-5.6V22H27V6.5z" />
        {/* 'l' */}
        <path d="M38.5 6.5h2.8V22h-2.8V6.5z" />
        {/* 'i' */}
        <path d="M43.5 6.5h2.8V9h-2.8V6.5zm0 3.8h2.8V22h-2.8V10.3z" />
        {/* 'p' */}
        <path d="M48.5 10.3h2.6v1.8c.8-1.3 2.1-2 3.6-2 2.8 0 4.7 2.1 4.7 5.5s-1.9 5.5-4.7 5.5c-1.5 0-2.8-.7-3.6-2v6h-2.6V10.3zm2.6 5.3c0 1.9 1.1 3.3 2.7 3.3s2.7-1.4 2.7-3.3-1.1-3.3-2.7-3.3-2.7 1.4-2.7 3.3z" />
        {/* 'k' */}
        <path d="M62 6.5h2.8v7.5l4-3.7h3.5l-4.7 4.1 5.2 7.6h-3.5l-4.5-6.3V22H62V6.5z" />
        {/* 'a' */}
        <path d="M70.5 16.2c0-1.8 1.4-2.8 3.5-2.8 1.4 0 2.4.3 3 .7v1.4c-.6-.4-1.5-.7-2.6-.7-1.2 0-1.7.5-1.7 1.1 0 .7.5 1 1.5 1 1.4 0 2.3-.6 2.8-.9v2.1c-.6.8-1.9 1.3-3.4 1.3-2.1 0-3.1-1.3-3.1-3.2zm6.2 3.5h-2.5V10.3h2.5v9.4z" />
        {/* 'r' */}
        <path d="M79.5 10.3h2.6v1.9c.7-1.3 1.9-2.1 3.2-2.1.4 0 .7.1 1 .2v2.6c-.4-.1-.8-.2-1.3-.2-1.6 0-2.8 1.1-2.9 3V22h-2.6V10.3z" />
        {/* 't' */}
        <path d="M89 7.4h2.8v2.9h2.6v2.2H91.8v6c0 .8.3 1.2 1.2 1.2.4 0 .9-.1 1.3-.3v2.2c-.6.3-1.4.4-2.2.4-2.2 0-2.9-1.2-2.9-3.1v-6.4h-1.7v-2.2h1.7V7.4z" />
      </g>
    </svg>
  );
}

interface MarketplaceButtonsProps {
  amazonUrl?: string;
  nykaaUrl?: string;
  flipkartUrl?: string;
  size?: 'compact' | 'standard' | 'large';
  layout?: 'grid' | 'flex';
}

export default function MarketplaceButtons({
  amazonUrl = 'https://amazon.in',
  nykaaUrl = 'https://nykaa.com',
  flipkartUrl = 'https://flipkart.com',
  size = 'compact',
  layout = 'grid'
}: MarketplaceButtonsProps) {
  const isCompact = size === 'compact';

  return (
    <div className={layout === 'grid' ? 'grid grid-cols-3 gap-2 w-full' : 'flex items-center gap-2.5 w-full flex-wrap'}>
      {/* 1. Amazon Official Storefront Button */}
      <a
        href={amazonUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative flex items-center justify-center rounded-xl bg-white hover:bg-[#FFFBF5] border-2 border-[#D5CCB8] hover:border-[#FF9900] transition-all duration-200 shadow-2xs hover:shadow-sm cursor-pointer ${
          isCompact ? 'py-2 px-2.5 min-h-[40px]' : 'py-2.5 px-4 min-h-[46px]'
        }`}
        title="Visit Official CARE-A Storefront on Amazon"
        aria-label="Buy on Amazon"
      >
        <div className="flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
          <AmazonLogo className={isCompact ? 'h-4 w-auto' : 'h-5 w-auto'} variant="color" />
        </div>
      </a>

      {/* 2. Nykaa Official Storefront Button */}
      <a
        href={nykaaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative flex items-center justify-center rounded-xl bg-white hover:bg-[#FFF2F7] border-2 border-[#D5CCB8] hover:border-[#FC2779] transition-all duration-200 shadow-2xs hover:shadow-sm cursor-pointer ${
          isCompact ? 'py-2 px-2.5 min-h-[40px]' : 'py-2.5 px-4 min-h-[46px]'
        }`}
        title="Visit Official CARE-A Storefront on Nykaa"
        aria-label="Buy on Nykaa"
      >
        <div className="flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
          <NykaaLogo className={isCompact ? 'h-3.5 w-auto' : 'h-4 w-auto'} variant="color" />
        </div>
      </a>

      {/* 3. Flipkart Official Storefront Button */}
      <a
        href={flipkartUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative flex items-center justify-center rounded-xl bg-white hover:bg-[#F0F6FF] border-2 border-[#D5CCB8] hover:border-[#2874F0] transition-all duration-200 shadow-2xs hover:shadow-sm cursor-pointer ${
          isCompact ? 'py-2 px-2.5 min-h-[40px]' : 'py-2.5 px-4 min-h-[46px]'
        }`}
        title="Visit Official CARE-A Storefront on Flipkart"
        aria-label="Buy on Flipkart"
      >
        <div className="flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
          <FlipkartLogo className={isCompact ? 'h-4 w-auto' : 'h-5 w-auto'} variant="color" />
        </div>
      </a>
    </div>
  );
}

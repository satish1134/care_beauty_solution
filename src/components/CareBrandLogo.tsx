import React from 'react';
import headerLogo from '../../images/Header logo.png';
import fullLogo from '../../images/Full_LOGO.png';

export interface CareBrandLogoProps {
  className?: string;
  variant?:
    | 'navbar'
    | 'header-no-tagline'
    | 'website-header'
    | 'full'
    | 'emblem'
    | 'mobile-icon'
    | 'favicon'
    | 'dark'
    | 'footer'
    | 'hero'
    | 'transparent';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const CareBrandLogo: React.FC<CareBrandLogoProps> = ({
  className = '',
  variant = 'navbar',
  size = 'md',
}) => {
  // 1. Header Version (No Tagline) - Stacked Emblem + CARe + Underline Flourish
  if (variant === 'header-no-tagline') {
    const widthClass =
      size === 'xl'
        ? 'w-72 sm:w-80'
        : size === 'lg'
        ? 'w-56 sm:w-64'
        : size === 'sm'
        ? 'w-36 sm:w-40'
        : 'w-48 sm:w-52';

    return (
      <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
        <img
          src={headerLogo}
          alt="CARe Brand Logo (Header Version No Tagline)"
          className={`${widthClass} h-auto select-none pointer-events-none drop-shadow-[0_6px_20px_rgba(140,106,18,0.16)]`}
        />
      </div>
    );
  }

  // 2. Master Full Stacked Logo (Centered Emblem + CARe + Knot Divider + Tagline)
  if (variant === 'full' || variant === 'hero') {
    const widthClass =
      size === 'xl'
        ? 'w-80 sm:w-96 md:w-[420px]'
        : size === 'lg'
        ? 'w-64 sm:w-80'
        : size === 'sm'
        ? 'w-48 sm:w-56'
        : 'w-56 sm:w-68 md:w-72';

    return (
      <div
        className={`flex flex-col items-center justify-center text-center select-none p-4 sm:p-6 transition-all duration-300 ${className}`}
      >
        <img
          src={fullLogo}
          alt="CARe A Beauty Solution Master Official Logo"
          className={`${widthClass} h-auto select-none pointer-events-none filter drop-shadow-[0_8px_24px_rgba(140,106,18,0.18)] transition-transform duration-300 hover:scale-[1.01]`}
        />
      </div>
    );
  }

  // 3. Favicon Version (Ultra-clean gold ring + Botanical leaf + dividing rod + Roman C)
  if (variant === 'favicon') {
    const sizePx =
      size === 'xl'
        ? 'w-24 h-24'
        : size === 'lg'
        ? 'w-16 h-16'
        : size === 'sm'
        ? 'w-8 h-8'
        : 'w-12 h-12';

    return (
      <div className={`inline-flex items-center justify-center select-none ${className}`}>
        <img
          src="/images/care-favicon.svg"
          alt="CARe Favicon Icon"
          className={`${sizePx} object-contain select-none pointer-events-none drop-shadow-[0_2px_6px_rgba(140,106,18,0.25)]`}
        />
      </div>
    );
  }

  // 4. Icon / Mobile Version (Full Wreath Guilloche Emblem only)
  if (variant === 'emblem' || variant === 'mobile-icon') {
    const sizePx =
      size === 'xl'
        ? 'w-24 h-24 sm:w-28 sm:h-28'
        : size === 'lg'
        ? 'w-16 h-16 sm:w-20 sm:h-20'
        : size === 'sm'
        ? 'w-9 h-9'
        : 'w-12 h-12 sm:w-14 sm:h-14';

    return (
      <div className={`inline-flex items-center justify-center select-none ${className}`}>
        <img
          src="/images/care-mobile-icon.svg"
          alt="CARe Gold Emblem Icon"
          className={`${sizePx} object-contain select-none pointer-events-none drop-shadow-[0_2px_8px_rgba(140,106,18,0.2)]`}
        />
      </div>
    );
  }

  // 5. Dark Background Variant (Emerald Green #0D261B)
  if (variant === 'dark') {
    return (
      <div className={`inline-flex items-center justify-center select-none ${className}`}>
        <img
          src="/images/care-dark-horizontal.svg"
          alt="CARe Brand Dark Card"
          className="h-16 sm:h-20 w-auto object-contain select-none pointer-events-none drop-shadow-md"
        />
      </div>
    );
  }

  // 6. Footer Variant: Minimalist Gold Emblem & Clean Identity
  if (variant === 'footer') {
    return (
      <div className={`inline-flex items-center gap-3.5 select-none transition-all duration-300 ${className}`}>
        <img
          src="/images/care-mobile-icon.svg"
          alt="CARe Brand Medallion"
          className="w-12 h-12 sm:w-14 sm:h-14 object-contain select-none pointer-events-none filter drop-shadow-[0_2px_12px_rgba(232,199,106,0.3)]"
        />
        <div className="flex flex-col">
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-[#E8C76A] drop-shadow-sm">
            CARe
          </span>
          <span className="font-sans text-[9px] uppercase font-bold tracking-[0.25em] text-[#C9A227]/90">
            A Beauty Solution
          </span>
        </div>
      </div>
    );
  }

  // 7. Header Navbar / Website Header Horizontal Lockup [ (Emblem) CARe ]
  const headerHeightClass =
    size === 'xl'
      ? 'h-18 sm:h-22 md:h-24'
      : size === 'lg'
      ? 'h-14 sm:h-16 md:h-18'
      : size === 'sm'
      ? 'h-8 sm:h-9'
      : 'h-11 sm:h-12 md:h-13';

  return (
    <div
      className={`inline-flex items-center select-none py-1 transition-all duration-300 group ${className}`}
    >
      <img
        src="/images/care-official-gold-logo-horizontal.svg"
        alt="CARe Brand Logo (Website Header)"
        className={`${headerHeightClass} w-auto object-contain select-none pointer-events-none drop-shadow-[0_2px_8px_rgba(140,106,18,0.22)] transition-transform duration-200 group-hover:scale-[1.02]`}
      />
    </div>
  );
};

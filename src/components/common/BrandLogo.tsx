import React, { useState } from 'react';

interface BrandLogoProps {
  variant?: 'header' | 'footer' | 'emblem' | 'light' | 'dark';
  className?: string;
  heightClass?: string;
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'header',
  className = '',
  heightClass = 'h-9 sm:h-11',
  showText = true,
}) => {
  const [imgError, setImgError] = useState(false);
  const isDarkBg = variant === 'footer' || variant === 'dark';

  // Use the exact PNG images provided in the images folder
  const logoSrc = variant === 'emblem'
    ? '/images/Full_LOGO.png'
    : isDarkBg
    ? '/images/Header logo.png'
    : '/images/Header logo.png';

  if (imgError) {
    // Ultra-reliable inline vector SVG fallback in high-resolution gold foil & serif styling
    return (
      <div className={`flex items-center gap-2.5 select-none ${className}`}>
        {/* Emblem SVG */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg
            viewBox="0 0 160 160"
            className={`${heightClass.includes('h-') ? heightClass.split(' ')[0] : 'h-10'} w-auto aspect-square`}
          >
            <defs>
              <linearGradient id="fallbackGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8A6318" />
                <stop offset="30%" stopColor="#DFB847" />
                <stop offset="60%" stopColor="#FFF2BF" />
                <stop offset="85%" stopColor="#C4962C" />
                <stop offset="100%" stopColor="#6C4808" />
              </linearGradient>
            </defs>
            {/* Guilloche rings */}
            <circle cx="80" cy="80" r="72" fill="none" stroke="url(#fallbackGold)" strokeWidth="3" opacity="0.6" />
            <circle cx="80" cy="80" r="66" fill="none" stroke="url(#fallbackGold)" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="80" cy="80" r="58" fill={isDarkBg ? '#111' : '#FAF9F6'} stroke="url(#fallbackGold)" strokeWidth="2.5" />
            
            {/* Center leaf & C motif */}
            <path
              d="M 68 50 C 56 62, 56 75, 68 86 C 80 75, 80 62, 68 50 Z"
              fill="url(#fallbackGold)"
            />
            <path
              d="M 68 86 L 68 108"
              stroke="url(#fallbackGold)"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M 100 58 C 94 52, 88 50, 78 50 C 62 50, 52 62, 52 80 C 52 98, 62 110, 78 110 C 88 110, 94 106, 100 98 L 94 92 C 90 98, 86 102, 78 102 C 68 102, 60 92, 60 80 C 60 68, 68 58, 78 58 C 86 58, 90 62, 94 66 Z"
              fill="url(#fallbackGold)"
            />
            <circle cx="98" cy="56" r="3.5" fill="url(#fallbackGold)" />
          </svg>
        </div>

        {/* Brand Text */}
        {showText && (
          <div className="flex flex-col text-left">
            <span
              className={`font-serif text-base sm:text-lg font-black tracking-wider leading-none ${
                isDarkBg ? 'text-[#F3E5AB]' : 'text-[#1A1A1A]'
              }`}
              style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif" }}
            >
              CAR<span className="text-xs uppercase font-normal">e</span>
            </span>
            <span
              className={`text-[8px] sm:text-[9px] uppercase tracking-[0.22em] font-bold mt-0.5 ${
                isDarkBg ? 'text-[#C59B27]' : 'text-[#2D5A3D]'
              }`}
            >
              Beauty Solution
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src={logoSrc}
        alt="Care Beauty Solution"
        className={`${heightClass} w-auto object-contain transition-transform`}
        onError={() => setImgError(true)}
      />
    </div>
  );
};

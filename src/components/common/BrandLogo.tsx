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
}) => {
  const [imgSrc, setImgSrc] = useState(
    variant === 'emblem' ? '/images/full-logo.png' : '/images/header-logo.png'
  );

  const handleImgError = () => {
    // Fallback gracefully between original PNG images
    if (imgSrc === '/images/header-logo.png') {
      setImgSrc('/images/logo.png');
    } else if (imgSrc === '/images/logo.png') {
      setImgSrc('/images/full-logo.png');
    } else if (imgSrc === '/images/full-logo.png') {
      setImgSrc('/images/Header logo.png');
    }
  };

  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src={imgSrc}
        alt="Care Beauty Solution"
        className={`${heightClass} w-auto max-w-full object-contain block`}
        onError={handleImgError}
      />
    </div>
  );
};


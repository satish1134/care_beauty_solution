import React, { useState } from 'react';
import headerLogoPng from '../../assets/header-logo.png';
import fullLogoPng from '../../assets/full-logo.png';
import logoPng from '../../assets/logo.png';

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
  const defaultSrc = variant === 'emblem' ? fullLogoPng : headerLogoPng;
  const [imgSrc, setImgSrc] = useState<string>(defaultSrc);

  const handleImgError = () => {
    // Gracefully fallback between imported assets and static image paths
    if (imgSrc === headerLogoPng) {
      setImgSrc(logoPng);
    } else if (imgSrc === logoPng) {
      setImgSrc(fullLogoPng);
    } else if (imgSrc === fullLogoPng) {
      setImgSrc('/images/header-logo.png');
    } else if (imgSrc === '/images/header-logo.png') {
      setImgSrc('/images/logo.png');
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


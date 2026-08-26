import React, { useState } from 'react';

interface BrandLogoProps {
  variant?: 'header' | 'footer' | 'emblem' | 'light' | 'dark' | 'full';
  className?: string;
  heightClass?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'header',
  className = '',
  heightClass = 'h-16 sm:h-20 md:h-24',
}) => {
  const [imgSrc, setImgSrc] = useState<string>('/images/final.png');
  const [hasTotalError, setHasTotalError] = useState<boolean>(false);

  const handleImgError = () => {
    if (imgSrc === '/images/final.png') {
      setImgSrc('/final.png');
    } else {
      setHasTotalError(true);
    }
  };

  if (hasTotalError) {
    return (
      <div className="text-sm text-red-500">
        Logo not found
      </div>
    );
  }

  return (
    <div
      className={`flex items-center shrink-0 ${className}`}
    >
      <img
        src={imgSrc}
        alt="CARe A Beauty Solution"
        onError={handleImgError}
        loading="eager"
        className={`
          ${heightClass}
          w-auto
          object-contain
          block
          max-w-none
        `}
      />
    </div>
  );
};
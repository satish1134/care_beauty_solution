import React, { useState } from 'react';
import { getOptimizedCloudinaryUrl, getCloudinarySrcSet, CloudinaryTransformOptions } from '../lib/cloudinaryClient';

export interface CloudinaryImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  crop?: CloudinaryTransformOptions['crop'];
  quality?: CloudinaryTransformOptions['quality'];
  format?: CloudinaryTransformOptions['format'];
  dpr?: CloudinaryTransformOptions['dpr'];
  priority?: boolean;
  fallbackSrc?: string;
  containerClassName?: string;
}

export const CloudinaryImage: React.FC<CloudinaryImageProps> = ({
  src,
  alt,
  width,
  height,
  crop = 'limit' as const,
  quality = 'auto' as const,
  format = 'auto' as const,
  dpr = 'auto' as const,
  priority = false,
  fallbackSrc = '/images/care-hydrating-moisturizer.svg',
  className = '',
  containerClassName = '',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  ...imgProps
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const transformOptions: CloudinaryTransformOptions = {
    width,
    height,
    crop,
    quality,
    format,
    dpr,
  };

  const imageSrc = hasError
    ? fallbackSrc
    : getOptimizedCloudinaryUrl(src, transformOptions);

  const srcSet = hasError
    ? undefined
    : getCloudinarySrcSet(src, [320, 640, 960, 1280], transformOptions);

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {/* Subtle blur placeholder / shimmer backdrop before image fully loads */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-black/5 animate-pulse rounded-inherit" />
      )}

      <img
        src={imageSrc}
        srcSet={srcSet || undefined}
        sizes={srcSet ? sizes : undefined}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!hasError) setHasError(true);
        }}
        className={`transition-opacity duration-300 ${
          isLoaded || hasError ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...imgProps}
      />
    </div>
  );
};

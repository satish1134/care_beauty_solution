/**
 * Client-Side Cloudinary Utility
 * Supports dynamic URL building, auto format (WebP/AVIF), auto compression, responsive srcSet generation, and upload helpers.
 */

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'limit' | 'pad' | 'scale' | 'thumb';
  quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | 'auto:low' | number;
  format?: 'auto' | 'webp' | 'avif' | 'png' | 'jpg';
  dpr?: 'auto' | number;
  blur?: number;
  gravity?: 'auto' | 'center' | 'face';
}

const DEFAULT_CLOUD_NAME = (typeof window !== 'undefined' && (window as any).__CLOUDINARY_CLOUD_NAME__) ||
  (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME ||
  'm9tniguf';

/**
 * Constructs an optimized Cloudinary delivery URL with f_auto, q_auto and custom transformations.
 */
export function getOptimizedCloudinaryUrl(
  sourceUrlOrId: string | null | undefined,
  options: CloudinaryTransformOptions = {}
): string {
  if (!sourceUrlOrId) return '';

  // If it's a data URL, blob URL, or SVG, return as is
  if (
    sourceUrlOrId.startsWith('data:') ||
    sourceUrlOrId.startsWith('blob:') ||
    sourceUrlOrId.endsWith('.svg')
  ) {
    return sourceUrlOrId;
  }

  const {
    width,
    height,
    crop = 'limit',
    quality = 'auto',
    format = 'auto',
    dpr = 'auto',
    blur,
    gravity,
  } = options;

  // Build transform string array
  const transforms: string[] = [];
  if (format) transforms.push(`f_${format}`);
  if (quality) transforms.push(`q_${quality}`);
  if (dpr) transforms.push(`dpr_${dpr}`);
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (crop && (width || height)) transforms.push(`c_${crop}`);
  if (gravity) transforms.push(`g_${gravity}`);
  if (blur) transforms.push(`e_blur:${blur}`);

  const transformSegment = transforms.join(',');

  // Case A: Existing Cloudinary URL
  if (sourceUrlOrId.includes('res.cloudinary.com')) {
    const uploadIndex = sourceUrlOrId.indexOf('/upload/');
    if (uploadIndex !== -1) {
      const beforeUpload = sourceUrlOrId.slice(0, uploadIndex + 8);
      const afterUpload = sourceUrlOrId.slice(uploadIndex + 8);
      
      // Prevent duplicate transformations if already present
      if (afterUpload.startsWith('f_') || afterUpload.startsWith('q_') || afterUpload.startsWith('w_') || afterUpload.startsWith('c_')) {
        const nextSlash = afterUpload.indexOf('/');
        const remainingPath = nextSlash !== -1 ? afterUpload.slice(nextSlash + 1) : afterUpload;
        return `${beforeUpload}${transformSegment}/${remainingPath}`;
      }
      return `${beforeUpload}${transformSegment}/${afterUpload}`;
    }
    return sourceUrlOrId;
  }

  // Case B: Public ID (e.g. "care_beauty/prod-1")
  if (!sourceUrlOrId.startsWith('http://') && !sourceUrlOrId.startsWith('https://') && !sourceUrlOrId.startsWith('/')) {
    const cloudName = (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME || DEFAULT_CLOUD_NAME;
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformSegment}/${sourceUrlOrId}`;
  }

  // Case C: Remote external URL (Cloudinary fetch delivery)
  if (sourceUrlOrId.startsWith('http://') || sourceUrlOrId.startsWith('https://')) {
    const cloudName = (import.meta as any).env?.VITE_CLOUDINARY_CLOUD_NAME || DEFAULT_CLOUD_NAME;
    return `https://res.cloudinary.com/${cloudName}/image/fetch/${transformSegment}/${encodeURIComponent(sourceUrlOrId)}`;
  }

  // Fallback for local assets
  return sourceUrlOrId;
}

/**
 * Generate a responsive srcSet string for Cloudinary images.
 */
export function getCloudinarySrcSet(
  sourceUrlOrId: string,
  widths: number[] = [320, 480, 640, 800, 1080, 1400],
  options: Omit<CloudinaryTransformOptions, 'width'> = {}
): string {
  if (
    !sourceUrlOrId ||
    sourceUrlOrId.startsWith('data:') ||
    sourceUrlOrId.startsWith('blob:') ||
    sourceUrlOrId.endsWith('.svg')
  ) {
    return '';
  }

  return widths
    .map(w => `${getOptimizedCloudinaryUrl(sourceUrlOrId, { ...options, width: w })} ${w}w`)
    .join(', ');
}

export interface UploadResponse {
  success: boolean;
  url: string;
  publicId?: string;
  format?: string;
  width?: number;
  height?: number;
  message?: string;
}

/**
 * Upload an image file or base64 string to Cloudinary through the backend API.
 */
export async function uploadImageToCloudinary(
  fileOrBase64: File | string,
  folder = 'care_beauty_products',
  tags = ['care_beauty']
): Promise<UploadResponse> {
  let imageBase64 = '';

  if (typeof fileOrBase64 === 'string') {
    imageBase64 = fileOrBase64;
  } else {
    // Convert File to base64
    imageBase64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(fileOrBase64);
    });
  }

  const response = await fetch('/api/cloudinary/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      imageBase64,
      folder,
      tags,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Failed to upload image to Cloudinary');
  }

  return data;
}

/**
 * Check if the backend has Cloudinary configured.
 */
export async function checkCloudinaryStatus(): Promise<{ configured: boolean; cloudName: string | null }> {
  try {
    const res = await fetch('/api/cloudinary/config');
    if (!res.ok) return { configured: false, cloudName: null };
    const data = await res.json();
    return data;
  } catch {
    return { configured: false, cloudName: null };
  }
}

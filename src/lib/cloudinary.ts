import { v2 as cloudinary } from 'cloudinary';

/**
 * Lazy initialization of Cloudinary SDK.
 * Server credentials remain strictly on the backend.
 */
export function getCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('[CLOUDINARY WARN] Missing or incomplete Cloudinary credentials in process.env');
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
}

/**
 * Check if Cloudinary credentials are fully configured on the server.
 */
export function isCloudinaryConfigured(): boolean {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  return Boolean(cloudName && apiKey && apiSecret);
}

/**
 * Safe public configuration for frontend (only cloud name and status, zero secrets).
 */
export function getCloudinaryPublicConfig() {
  return {
    configured: isCloudinaryConfigured(),
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME || null,
  };
}

export interface UploadImageOptions {
  folder?: string;
  tags?: string[];
  publicId?: string;
  maxWidth?: number;
  maxHeight?: number;
}

/**
 * Upload an image (base64 data URL, remote URL, or binary buffer) to Cloudinary.
 * Automatically converts images to auto-format (WebP/AVIF) and applies optimal compression.
 */
export async function uploadProductImage(
  fileData: string,
  options: UploadImageOptions = {}
) {
  const instance = getCloudinary();
  const folder = options.folder || 'care_beauty_products';
  const maxWidth = options.maxWidth || 1600;
  const maxHeight = options.maxHeight || 1600;

  try {
    const result = await instance.uploader.upload(fileData, {
      folder,
      public_id: options.publicId,
      tags: options.tags || ['product_image', 'care_beauty'],
      transformation: [
        { width: maxWidth, height: maxHeight, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      created_at: result.created_at,
    };
  } catch (error: any) {
    console.error('[CLOUDINARY UPLOAD ERROR]', error.message || error);
    throw new Error(`Failed to upload product image to Cloudinary: ${error.message || error}`);
  }
}

/**
 * Generate a signed upload signature for direct authenticated client uploads.
 */
export function generateUploadSignature(paramsToSign: Record<string, string | number>) {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret) {
    throw new Error('CLOUDINARY_API_SECRET is required to generate upload signatures');
  }

  const instance = getCloudinary();
  const signature = instance.utils.api_sign_request(paramsToSign, apiSecret);
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME;

  return {
    signature,
    apiKey,
    cloudName,
    timestamp: paramsToSign.timestamp,
  };
}

/**
 * Delete an image from Cloudinary by public ID.
 */
export async function deleteProductImage(publicId: string) {
  const instance = getCloudinary();
  try {
    return await instance.uploader.destroy(publicId);
  } catch (error: any) {
    console.error('[CLOUDINARY DELETE ERROR]', error.message || error);
    throw error;
  }
}

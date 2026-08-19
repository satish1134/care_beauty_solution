import { v2 as cloudinary } from 'cloudinary';

/**
 * Lazy initialization of Cloudinary SDK.
 * Server credentials remain strictly on the backend.
 */
export function getCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('[CLOUDINARY WARN] Missing Cloudinary credentials in process.env');
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
 * Upload a product image (base64 or file path) to Cloudinary.
 * Automatically converts images to auto-format (WebP/AVIF) and applies optimal compression.
 */
export async function uploadProductImage(fileData: string, folder = 'care_beauty_products') {
  const instance = getCloudinary();
  
  try {
    const result = await instance.uploader.upload(fileData, {
      folder,
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
    };
  } catch (error: any) {
    console.error('[CLOUDINARY UPLOAD ERROR]', error.message || error);
    throw new Error(`Failed to upload product image: ${error.message || error}`);
  }
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

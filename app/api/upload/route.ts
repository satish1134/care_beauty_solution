import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { db } from '@/lib/db';

const ALLOWED_MIME_TYPES = new Set([
  'image/webp',
  'image/avif',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
  'video/quicktime'
]);

const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15MB
const MAX_VIDEO_SIZE = 60 * 1024 * 1024; // 60MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as 'product' | 'hero' | 'campaign' | 'brand') || 'hero';
    const altText = (formData.get('altText') as string) || '';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file format (${file.type}). Allowed formats: WEBP, AVIF, JPG, PNG, SVG, MP4, WebM.`
        },
        { status: 400 }
      );
    }

    const isVideo = file.type.startsWith('video/');
    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: `File exceeds maximum allowed size (${isVideo ? '60MB for video' : '15MB for images'})`
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate safe unique filename
    const ext = path.extname(file.name) || (isVideo ? '.mp4' : '.png');
    const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const safeFilename = `${baseName}-${Date.now()}${ext}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, safeFilename);

    await writeFile(filePath, buffer);
    const publicUrl = `/uploads/${safeFilename}`;

    // Add to Media Library database
    const asset = await db.addMediaAsset({
      filename: safeFilename,
      url: publicUrl,
      mimeType: file.type,
      fileSize: file.size,
      altText: altText || `${baseName} asset`,
      category,
      focalPoint: { x: 50, y: 50 }
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      asset
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'File upload failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

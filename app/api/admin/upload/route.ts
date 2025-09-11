import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, createAuthResponse } from '@/lib/auth';
import { imagekit } from '@/utils/imagekit-client';

export async function POST(request: NextRequest) {
  if (!(await authenticateAdmin(request))) {
    return createAuthResponse('Unauthorized access');
  }

  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const folder = formData.get('folder') as string || '/';
    const tags = formData.get('tags') as string || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > 20 * 1024 * 1024) { // 20MB limit for ImageKit
      return NextResponse.json({ error: 'File too large (max 20MB)' }, { status: 400 });
    }

    // The file should already be converted to WebP from the frontend
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Prepare file name and path
    const fileName = file.name;
    const filePath = folder === '/' ? fileName : `${folder}/${fileName}`;

    // Upload to ImageKit
    const uploadResult = await imagekit.upload({
      file: buffer,
      fileName: fileName,
      folder: folder === '/' ? undefined : folder,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      useUniqueFileName: true,
      transformation: {
        pre: 'f-webp,q-85', // Force WebP format with 85% quality
      },
    });

    return NextResponse.json({ 
      success: true, 
      image: {
        id: uploadResult.fileId,
        name: uploadResult.name,
        url: uploadResult.url,
        size: uploadResult.size,
        tags: uploadResult.tags || [],
        folder: folder,
        uploadedAt: new Date().toISOString(),
        filePath: uploadResult.filePath,
        width: uploadResult.width,
        height: uploadResult.height,
        fileType: uploadResult.fileType,
        type: 'file',
      }
    });
  } catch (error: any) {
    console.error('Error uploading to ImageKit:', error);
    return NextResponse.json({ 
      error: 'Failed to upload to ImageKit', 
      details: error.message 
    }, { status: 500 });
  }
}
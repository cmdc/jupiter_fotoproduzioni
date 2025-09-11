import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, createAuthResponse } from '@/lib/auth';
import { imagekit } from '@/utils/imagekit-client';

export async function GET(request: NextRequest) {
  if (!(await authenticateAdmin(request))) {
    return createAuthResponse('Unauthorized access');
  }

  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || '/';
    const limit = parseInt(searchParams.get('limit') || '50');

    const files = await imagekit.listFiles({
      limit,
      path,
      includeFolder: true,
    });

    // Transform ImageKit files to our interface
    const transformedFiles = files.map((file: any) => ({
      id: file.fileId,
      name: file.name,
      url: file.url,
      size: file.size,
      tags: file.tags || [],
      folder: file.filePath.split('/').slice(0, -1).join('/') || '/',
      uploadedAt: file.createdAt,
      type: file.type, // 'file' or 'folder'
      filePath: file.filePath,
      width: file.width,
      height: file.height,
      fileType: file.fileType,
    }));

    return NextResponse.json(transformedFiles);
  } catch (error: any) {
    console.error('Error loading ImageKit files:', error);
    return NextResponse.json({ 
      error: 'Failed to load ImageKit files', 
      details: error.message 
    }, { status: 500 });
  }
}
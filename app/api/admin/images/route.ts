import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, createAuthResponse } from '@/lib/auth';
import { imagekit } from '@/utils/imagekit-client';

export async function GET(request: NextRequest) {
  if (!(await authenticateAdmin(request))) {
    return createAuthResponse('Unauthorized access');
  }

  // Check ImageKit configuration
  if (!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || !process.env.NEXT_IMAGEKIT_PRIVATE_KEY || !process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT) {
    return NextResponse.json({
      error: 'ImageKit not configured',
      details: 'Missing required environment variables: NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY, NEXT_IMAGEKIT_PRIVATE_KEY, or NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT'
    }, { status: 500 });
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

    if (!files || !Array.isArray(files)) {
      return NextResponse.json({ 
        error: 'Invalid response from ImageKit', 
        details: 'Expected array of files but got: ' + typeof files
      }, { status: 500 });
    }

    // Transform ImageKit files to our interface
    const transformedFiles = files.map((file: any) => {
      // Gestisce il caso in cui filePath sia undefined o null
      const filePath = file.filePath || file.name || '';
      const folderPath = filePath ? filePath.split('/').slice(0, -1).join('/') || '/' : '/';
      
      return {
        id: file.fileId || file.folderId || Math.random().toString(36),
        name: file.name || 'Unknown',
        url: file.url || '',
        size: file.size || 0,
        tags: file.tags || [],
        folder: folderPath,
        uploadedAt: file.createdAt || new Date().toISOString(),
        type: file.type || 'file', // 'file' or 'folder'
        filePath: filePath,
        width: file.width || null,
        height: file.height || null,
        fileType: file.fileType || null,
      };
    });

    return NextResponse.json(transformedFiles);
  } catch (error: any) {
    console.error('Error loading ImageKit files:', error);
    return NextResponse.json({ 
      error: 'Failed to load ImageKit files', 
      details: error.message 
    }, { status: 500 });
  }
}
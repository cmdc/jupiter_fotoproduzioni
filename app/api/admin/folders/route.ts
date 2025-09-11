import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, createAuthResponse } from '@/lib/auth';
import { imagekit } from '@/utils/imagekit-client';

interface Folder {
  name: string;
  path: string;
  imageCount: number;
}

export async function GET(request: NextRequest) {
  if (!(await authenticateAdmin(request))) {
    return createAuthResponse('Unauthorized access');
  }

  try {
    const { searchParams } = new URL(request.url);
    const basePath = searchParams.get('path') || '/';

    // Get all files and folders from ImageKit
    const files = await imagekit.listFiles({
      limit: 1000,
      path: basePath,
      includeFolder: true,
    });

    // Extract unique folders and count their contents
    const folderMap = new Map<string, number>();

    files.forEach((file: any) => {
      if (file.type === 'folder') {
        folderMap.set(file.filePath, 0);
      } else if (file.type === 'file') {
        // Count files in each folder
        const folderPath = file.filePath.split('/').slice(0, -1).join('/') || '/';
        folderMap.set(folderPath, (folderMap.get(folderPath) || 0) + 1);
      }
    });

    const folders: Folder[] = Array.from(folderMap.entries()).map(([path, count]) => ({
      name: path.split('/').pop() || 'root',
      path,
      imageCount: count,
    }));

    return NextResponse.json(folders);
  } catch (error: any) {
    console.error('Error loading ImageKit folders:', error);
    return NextResponse.json({ 
      error: 'Failed to load ImageKit folders', 
      details: error.message 
    }, { status: 500 });
  }
}
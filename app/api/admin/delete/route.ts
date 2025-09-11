import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { authenticateAdmin, createAuthResponse } from '@/lib/auth';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const METADATA_FILE = path.join(UPLOAD_DIR, 'metadata.json');

interface ImageMetadata {
  id: string;
  name: string;
  url: string;
  size: number;
  tags: string[];
  folder: string;
  uploadedAt: string;
}

async function loadMetadata(): Promise<ImageMetadata[]> {
  try {
    const data = await fs.readFile(METADATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveMetadata(metadata: ImageMetadata[]) {
  await fs.writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2));
}

export async function DELETE(request: NextRequest) {
  if (!(await authenticateAdmin(request))) {
    return createAuthResponse('Unauthorized access');
  }

  try {
    const { imageIds } = await request.json();

    if (!Array.isArray(imageIds)) {
      return NextResponse.json({ error: 'Invalid image IDs' }, { status: 400 });
    }

    const metadata = await loadMetadata();
    const imagesToDelete = metadata.filter(img => imageIds.includes(img.id));

    for (const image of imagesToDelete) {
      const filePath = path.join(process.cwd(), 'public', image.url);
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error(`Failed to delete file ${filePath}:`, error);
      }
    }

    const remainingMetadata = metadata.filter(img => !imageIds.includes(img.id));
    await saveMetadata(remainingMetadata);

    return NextResponse.json({ 
      success: true, 
      deletedCount: imagesToDelete.length 
    });
  } catch (error) {
    console.error('Error deleting images:', error);
    return NextResponse.json({ error: 'Failed to delete images' }, { status: 500 });
  }
}
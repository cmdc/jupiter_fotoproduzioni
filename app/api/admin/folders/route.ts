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

interface Folder {
  name: string;
  imageCount: number;
}

async function loadMetadata(): Promise<ImageMetadata[]> {
  try {
    const data = await fs.readFile(METADATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  if (!(await authenticateAdmin(request))) {
    return createAuthResponse('Unauthorized access');
  }

  try {
    const images = await loadMetadata();
    
    const folderCounts = images.reduce((acc, image) => {
      acc[image.folder] = (acc[image.folder] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const folders: Folder[] = Object.entries(folderCounts).map(([name, count]) => ({
      name,
      imageCount: count,
    }));

    return NextResponse.json(folders);
  } catch (error) {
    console.error('Error loading folders:', error);
    return NextResponse.json({ error: 'Failed to load folders' }, { status: 500 });
  }
}
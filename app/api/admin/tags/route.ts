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

export async function POST(request: NextRequest) {
  if (!(await authenticateAdmin(request))) {
    return createAuthResponse('Unauthorized access');
  }

  try {
    const { imageId, tag } = await request.json();

    if (!imageId || !tag) {
      return NextResponse.json({ error: 'Missing imageId or tag' }, { status: 400 });
    }

    const metadata = await loadMetadata();
    const image = metadata.find(img => img.id === imageId);

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    if (!image.tags.includes(tag)) {
      image.tags.push(tag);
      await saveMetadata(metadata);
    }

    return NextResponse.json({ success: true, image });
  } catch (error) {
    console.error('Error adding tag:', error);
    return NextResponse.json({ error: 'Failed to add tag' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await authenticateAdmin(request))) {
    return createAuthResponse('Unauthorized access');
  }

  try {
    const { imageId, tag } = await request.json();

    if (!imageId || !tag) {
      return NextResponse.json({ error: 'Missing imageId or tag' }, { status: 400 });
    }

    const metadata = await loadMetadata();
    const image = metadata.find(img => img.id === imageId);

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    image.tags = image.tags.filter(t => t !== tag);
    await saveMetadata(metadata);

    return NextResponse.json({ success: true, image });
  } catch (error) {
    console.error('Error removing tag:', error);
    return NextResponse.json({ error: 'Failed to remove tag' }, { status: 500 });
  }
}
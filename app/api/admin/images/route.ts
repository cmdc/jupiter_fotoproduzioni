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

async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

async function loadMetadata(): Promise<ImageMetadata[]> {
  await ensureUploadDir();
  try {
    const data = await fs.readFile(METADATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveMetadata(metadata: ImageMetadata[]) {
  await ensureUploadDir();
  await fs.writeFile(METADATA_FILE, JSON.stringify(metadata, null, 2));
}

export async function GET(request: NextRequest) {
  if (!(await authenticateAdmin(request))) {
    return createAuthResponse('Unauthorized access');
  }

  try {
    const images = await loadMetadata();
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error loading images:', error);
    return NextResponse.json({ error: 'Failed to load images' }, { status: 500 });
  }
}
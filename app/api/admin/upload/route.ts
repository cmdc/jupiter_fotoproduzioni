import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
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

export async function POST(request: NextRequest) {
  if (!(await authenticateAdmin(request))) {
    return createAuthResponse('Unauthorized access');
  }

  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const folder = formData.get('folder') as string || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 });
    }

    await ensureUploadDir();

    const id = uuidv4();
    const fileExtension = path.extname(file.name);
    const fileName = `${id}${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    const bytes = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(bytes));

    const metadata = await loadMetadata();
    const newImage: ImageMetadata = {
      id,
      name: file.name,
      url: `/uploads/${fileName}`,
      size: file.size,
      tags: [],
      folder,
      uploadedAt: new Date().toISOString(),
    };

    metadata.push(newImage);
    await saveMetadata(metadata);

    return NextResponse.json({ success: true, image: newImage });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
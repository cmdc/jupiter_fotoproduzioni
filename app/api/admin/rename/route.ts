import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, createAuthResponse } from '@/lib/auth';
import { imagekit } from '@/utils/imagekit-client';

export async function PUT(request: NextRequest) {
  if (!(await authenticateAdmin(request))) {
    return createAuthResponse('Unauthorized access');
  }

  try {
    const { fileId, newName } = await request.json();

    if (!fileId || !newName) {
      return NextResponse.json({ error: 'Missing fileId or newName' }, { status: 400 });
    }

    // Validate new name
    if (newName.trim().length === 0) {
      return NextResponse.json({ error: 'New name cannot be empty' }, { status: 400 });
    }

    // Get current file details to preserve existing tags
    const fileDetails = await imagekit.getFileDetails(fileId);
    const currentTags = fileDetails.tags || [];
    
    // Remove any existing display name tags and add the new one
    const filteredTags = currentTags.filter(tag => !tag.startsWith('displayName:'));
    const updatedTags = [...filteredTags, `displayName:${newName.trim()}`];

    // Update file with the display name tag
    const updatedFile = await imagekit.updateFileDetails(fileId, {
      tags: updatedTags,
    });

    return NextResponse.json({ 
      success: true, 
      file: {
        id: fileId,
        name: newName.trim(),
        url: updatedFile.url,
        tags: updatedFile.tags,
      }
    });
  } catch (error: any) {
    console.error('Error renaming ImageKit file:', error);
    return NextResponse.json({ 
      error: 'Failed to rename file', 
      details: error.message 
    }, { status: 500 });
  }
}
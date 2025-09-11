import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, createAuthResponse } from '@/lib/auth';
import { imagekit } from '@/utils/imagekit-client';

export async function POST(request: NextRequest) {
  if (!(await authenticateAdmin(request))) {
    return createAuthResponse('Unauthorized access');
  }

  try {
    const { fileId, tags } = await request.json();

    if (!fileId || !tags) {
      return NextResponse.json({ error: 'Missing fileId or tags' }, { status: 400 });
    }

    // Ensure tags is an array
    const tagsArray = Array.isArray(tags) ? tags : [tags];

    // Get current file details
    const fileDetails = await imagekit.getFileDetails(fileId);
    const currentTags = fileDetails.tags || [];

    // Add new tags to existing ones
    const tagSet = new Set([...currentTags, ...tagsArray]);
    const updatedTags = Array.from(tagSet);

    // Update file with new tags
    const updatedFile = await imagekit.updateFileDetails(fileId, {
      tags: updatedTags,
    });

    return NextResponse.json({ 
      success: true, 
      file: {
        id: fileId,
        tags: updatedFile.tags,
        name: updatedFile.name,
        url: updatedFile.url,
      }
    });
  } catch (error: any) {
    console.error('Error adding tags to ImageKit file:', error);
    return NextResponse.json({ 
      error: 'Failed to add tags', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await authenticateAdmin(request))) {
    return createAuthResponse('Unauthorized access');
  }

  try {
    const { fileId, tag } = await request.json();

    if (!fileId || !tag) {
      return NextResponse.json({ error: 'Missing fileId or tag' }, { status: 400 });
    }

    // Get current file details
    const fileDetails = await imagekit.getFileDetails(fileId);
    const currentTags = fileDetails.tags || [];

    // Remove the specified tag
    const updatedTags = currentTags.filter((t: string) => t !== tag);

    // Update file with remaining tags
    // ImageKit might have issues with empty arrays, try undefined when no tags
    const tagsToUpdate = updatedTags.length > 0 ? updatedTags : undefined;
    
    const updatedFile = await imagekit.updateFileDetails(fileId, {
      tags: tagsToUpdate,
    });

    return NextResponse.json({ 
      success: true, 
      file: {
        id: fileId,
        tags: updatedTags, // Use our filtered tags instead of ImageKit's response
        name: updatedFile.name,
        url: updatedFile.url,
      }
    });
  } catch (error: any) {
    console.error('Error removing tag from ImageKit file:', error);
    return NextResponse.json({ 
      error: 'Failed to remove tag', 
      details: error.message 
    }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, createAuthResponse } from '@/lib/auth';
import { imagekit } from '@/utils/imagekit-client';

export async function DELETE(request: NextRequest) {
  if (!(await authenticateAdmin(request))) {
    return createAuthResponse('Unauthorized access');
  }

  try {
    const { fileIds } = await request.json();

    if (!Array.isArray(fileIds)) {
      return NextResponse.json({ error: 'Invalid file IDs' }, { status: 400 });
    }

    const deletionResults = [];
    let successCount = 0;

    for (const fileId of fileIds) {
      try {
        await imagekit.deleteFile(fileId);
        deletionResults.push({ fileId, success: true });
        successCount++;
      } catch (error: any) {
        console.error(`Failed to delete ImageKit file ${fileId}:`, error);
        deletionResults.push({ 
          fileId, 
          success: false, 
          error: error.message 
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      deletedCount: successCount,
      totalRequested: fileIds.length,
      results: deletionResults
    });
  } catch (error: any) {
    console.error('Error deleting ImageKit files:', error);
    return NextResponse.json({ 
      error: 'Failed to delete ImageKit files', 
      details: error.message 
    }, { status: 500 });
  }
}
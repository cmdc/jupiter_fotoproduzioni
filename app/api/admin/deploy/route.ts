import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, createAuthResponse } from '@/lib/auth';

export async function POST(request: NextRequest) {
  if (!(await authenticateAdmin(request))) {
    return createAuthResponse('Unauthorized access');
  }

  try {

    // Trigger Vercel deploy utilizzando l'integration URL
    const deployUrl = process.env.NEXT_DEPLOY_URL;
    
    if (!deployUrl) {
      return NextResponse.json({ 
        error: 'Deploy webhook URL not configured',
        message: 'NEXT_DEPLOY_URL environment variable is missing'
      }, { status: 500 });
    }

    try {
      const deployResponse = await fetch(deployUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ref: 'master', // branch da deployare
          message: 'Manual deploy triggered from admin panel'
        })
      });

      if (deployResponse.ok) {
        let deployData;
        try {
          deployData = await deployResponse.json();
        } catch {
          deployData = { message: 'Deploy triggered successfully' };
        }
        
        
        return NextResponse.json({ 
          success: true, 
          message: 'Deploy triggered successfully! Vercel will handle the build and deployment.',
          deployResponse: deployData,
          status: `HTTP ${deployResponse.status}`,
          info: 'You can monitor the deployment progress in your Vercel dashboard.'
        });
      } else {
        const errorText = await deployResponse.text().catch(() => 'Unknown error');
        console.error('Deploy trigger failed:', deployResponse.status, errorText);
        
        return NextResponse.json({ 
          error: 'Deploy trigger failed',
          message: 'Failed to trigger Vercel deployment. Check your webhook URL and permissions.',
          details: `HTTP ${deployResponse.status}: ${errorText}`,
          webhookUrl: deployUrl.replace(/\/[^\/]*$/, '/***') // Hide sensitive parts of URL
        }, { status: 500 });
      }
    } catch (networkError: any) {
      console.error('Network error triggering deploy:', networkError);
      return NextResponse.json({ 
        error: 'Network error',
        message: 'Failed to reach Vercel webhook endpoint.',
        details: networkError.message
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Deploy API error:', error);
    
    return NextResponse.json({ 
      error: 'Deploy failed', 
      details: error.message
    }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { authenticateAdmin, createAuthResponse } from '@/lib/auth';

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  if (!(await authenticateAdmin(request))) {
    return createAuthResponse('Unauthorized access');
  }

  try {
    console.log('Starting build and deploy process...');
    
    // Esegui la build del progetto
    const { stdout, stderr } = await execAsync('yarn build', {
      cwd: process.cwd(),
      timeout: 300000, // 5 minuti timeout
    });

    if (stderr && !stderr.includes('Warning:')) {
      console.error('Build stderr:', stderr);
      return NextResponse.json({ 
        error: 'Build failed', 
        details: stderr 
      }, { status: 500 });
    }

    console.log('Build completed successfully');
    console.log('Build stdout:', stdout);

    // Trigger Vercel deploy utilizzando l'integration URL
    const deployUrl = process.env.NEXT_DEPLOY_URL;
    
    if (deployUrl) {
      try {
        console.log('Triggering Vercel deploy...');
        
        const deployResponse = await fetch(deployUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (deployResponse.ok) {
          const deployData = await deployResponse.json();
          console.log('Deploy triggered successfully:', deployData);
          
          return NextResponse.json({ 
            success: true, 
            message: 'Build completed and deploy triggered successfully!',
            buildOutput: stdout,
            deployResponse: deployData
          });
        } else {
          console.error('Deploy trigger failed:', deployResponse.statusText);
          return NextResponse.json({ 
            success: true, 
            message: 'Build completed, but deploy trigger failed. Check Vercel settings.',
            buildOutput: stdout,
            deployError: `HTTP ${deployResponse.status}: ${deployResponse.statusText}`
          });
        }
      } catch (deployError: any) {
        console.error('Deploy trigger error:', deployError);
        return NextResponse.json({ 
          success: true, 
          message: 'Build completed, but deploy trigger failed.',
          buildOutput: stdout,
          deployError: deployError.message
        });
      }
    } else {
      console.warn('NEXT_DEPLOY_URL not configured');
      return NextResponse.json({ 
        success: true, 
        message: 'Build completed successfully. NEXT_DEPLOY_URL not configured for auto-deploy.',
        buildOutput: stdout
      });
    }

  } catch (error: any) {
    console.error('Build/Deploy error:', error);
    
    return NextResponse.json({ 
      error: 'Build/Deploy failed', 
      details: error.message,
      stderr: error.stderr || 'No stderr available'
    }, { status: 500 });
  }
}
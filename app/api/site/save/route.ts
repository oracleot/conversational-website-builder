/**
 * Site API Route - Save website draft
 * POST /api/site/save
 */

import { NextRequest, NextResponse } from 'next/server';
import { saveSiteDraft, getSiteDraft } from '@/lib/db/queries';

// Flexible content type that works with our storage
type SiteContentPayload = Record<string, unknown>;

export interface SaveSiteRequest {
  sessionId: string;
  businessProfile: {
    businessName: string;
    industry: string;
    services: string[];
    targetAudience: string;
    uniqueValue: string;
    tone?: string;
    personality?: string;
  };
  content: SiteContentPayload;
  siteConfig: {
    personality: string;
    colorScheme: string;
    sections: string[];
  };
}

export interface SaveSiteResponse {
  success: boolean;
  siteId?: string;
  updatedAt?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<SaveSiteResponse>> {
  try {
    const body = await request.json() as SaveSiteRequest;
    
    // Validate required fields
    if (!body.sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID is required',
      }, { status: 400 });
    }

    if (!body.businessProfile?.businessName) {
      return NextResponse.json({
        success: false,
        error: 'Business name is required',
      }, { status: 400 });
    }

    if (!body.content) {
      return NextResponse.json({
        success: false,
        error: 'Site content is required',
      }, { status: 400 });
    }

    // Save or update draft
    const result = await saveSiteDraft({
      sessionId: body.sessionId,
      businessProfile: body.businessProfile,
      content: body.content,
      siteConfig: body.siteConfig,
    });

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to save site draft',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      siteId: result.siteId,
      updatedAt: result.updatedAt,
    });

  } catch (error) {
    console.error('Site save error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: 'Session ID is required',
      }, { status: 400 });
    }

    const result = await getSiteDraft(sessionId);
    
    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error || 'Site draft not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      site: result.site,
    });

  } catch (error) {
    console.error('Site fetch error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}

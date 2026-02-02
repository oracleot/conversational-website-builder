/**
 * Site API Route - Generate website content from conversation
 * POST /api/site/generate
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateSiteContent, type BusinessProfile as AIBusinessProfile } from '@/lib/ai/client';
import { BusinessProfileSchema, type BusinessProfile } from '@/lib/schemas/business-profile';
import type { SiteContent } from '@/components/sections/preview/site-preview';

export interface GenerateSiteRequest {
  businessProfile: BusinessProfile;
  conversationContext?: string;
}

export interface GenerateSiteResponse {
  success: boolean;
  content?: SiteContent;
  siteConfig?: {
    personality: string;
    colorScheme: string;
    sections: string[];
  };
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<GenerateSiteResponse>> {
  try {
    const body = await request.json() as GenerateSiteRequest;
    
    // Validate business profile
    const profileResult = BusinessProfileSchema.safeParse(body.businessProfile);
    if (!profileResult.success) {
      return NextResponse.json({
        success: false,
        error: `Invalid business profile: ${profileResult.error.message}`,
      }, { status: 400 });
    }

    const profile = profileResult.data;
    
    // Map to AI client format
    const aiProfile: AIBusinessProfile = {
      businessName: profile.name,
      industry: profile.industry,
      services: [profile.businessType],
      targetAudience: 'general audience',
      uniqueValue: profile.tagline,
      tone: profile.brandPersonality[0] || 'professional',
    };
    
    // Generate site content using AI
    const result = await generateSiteContent(aiProfile, body.conversationContext);
    
    if (!result.success || !result.content) {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to generate site content',
      }, { status: 500 });
    }

    // Determine personality from brand personality
    const personality = profile.brandPersonality[0] || 'professional';

    return NextResponse.json({
      success: true,
      content: result.content as SiteContent,
      siteConfig: {
        personality,
        colorScheme: result.colorScheme || 'default',
        sections: result.sections || ['hero', 'services', 'about', 'testimonials', 'contact'],
      },
    });

  } catch (error) {
    console.error('Site generation error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}

/**
 * Site API Route - Publish website
 * POST /api/site/publish
 */

import { NextRequest, NextResponse } from 'next/server';
import { publishSite, getSiteBySlug } from '@/lib/db/queries';
import type { SiteContent } from '@/components/sections/preview/site-preview';

export interface PublishSiteRequest {
  siteId: string;
  slug?: string;
  customDomain?: string;
}

export interface PublishSiteResponse {
  success: boolean;
  publishedUrl?: string;
  slug?: string;
  publishedAt?: string;
  error?: string;
}

// Generate URL-safe slug from business name
function generateSlug(businessName: string): string {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);
}

// Check if slug is available
async function isSlugAvailable(slug: string, currentSiteId?: string): Promise<boolean> {
  const existing = await getSiteBySlug(slug);
  if (!existing.success || !existing.site) {
    return true;
  }
  // Allow if it's the same site
  return existing.site.id === currentSiteId;
}

export async function POST(request: NextRequest): Promise<NextResponse<PublishSiteResponse>> {
  try {
    const body = await request.json() as PublishSiteRequest;
    
    if (!body.siteId) {
      return NextResponse.json({
        success: false,
        error: 'Site ID is required',
      }, { status: 400 });
    }

    // Generate or validate slug
    let slug = body.slug;
    if (!slug) {
      // Get site to generate slug from business name
      const siteResult = await getSiteBySlug(body.siteId);
      if (siteResult.success && siteResult.site) {
        slug = generateSlug(siteResult.site.businessProfile.businessName);
      } else {
        slug = `site-${Date.now()}`;
      }
    }

    // Check slug availability
    const slugAvailable = await isSlugAvailable(slug, body.siteId);
    if (!slugAvailable) {
      // Append random suffix
      slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    }

    // Publish the site
    const result = await publishSite({
      siteId: body.siteId,
      slug,
      customDomain: body.customDomain,
    });

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error || 'Failed to publish site',
      }, { status: 500 });
    }

    // Construct published URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';
    const publishedUrl = body.customDomain 
      ? `https://${body.customDomain}`
      : `${baseUrl}/sites/${slug}`;

    return NextResponse.json({
      success: true,
      publishedUrl,
      slug,
      publishedAt: result.publishedAt,
    });

  } catch (error) {
    console.error('Site publish error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 });
  }
}

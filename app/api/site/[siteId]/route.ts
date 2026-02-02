/**
 * Site API - GET and PATCH for individual site
 * GET: Retrieve site by ID
 * PATCH: Update site configuration
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSiteDraft, saveSiteDraft } from '@/lib/db/queries';
import { ThemeConfigSchema } from '@/lib/schemas';

// Schema for PATCH request
const UpdateSiteSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  theme: ThemeConfigSchema.optional(),
  sections: z.array(z.object({
    id: z.string(),
    type: z.string(),
    order: z.number(),
    variant: z.number(),
    content: z.unknown(),
    isVisible: z.boolean().optional(),
  })).optional(),
  businessProfile: z.record(z.string(), z.unknown()).optional(),
  siteConfig: z.record(z.string(), z.unknown()).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const { siteId } = await params;

    if (!siteId) {
      return NextResponse.json(
        { error: 'Site ID is required' },
        { status: 400 }
      );
    }

    const result = await getSiteDraft(siteId);

    if (!result.success || !result.site) {
      return NextResponse.json(
        { error: result.error ?? 'Site not found' },
        { status: 404 }
      );
    }

    const site = result.site;
    return NextResponse.json({
      id: site.id,
      sessionId: site.sessionId,
      businessProfile: site.businessProfile,
      content: site.content,
      siteConfig: site.siteConfig,
      createdAt: site.createdAt,
      updatedAt: site.updatedAt,
    });
  } catch (error) {
    console.error('Get site error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve site' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const { siteId } = await params;
    const body = await request.json();

    if (!siteId) {
      return NextResponse.json(
        { error: 'Site ID is required' },
        { status: 400 }
      );
    }

    // Validate update data
    const parseResult = UpdateSiteSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid update data', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const updateData = parseResult.data;

    // Get existing site
    const existingResult = await getSiteDraft(siteId);
    if (!existingResult.success || !existingResult.site) {
      return NextResponse.json(
        { error: existingResult.error ?? 'Site not found' },
        { status: 404 }
      );
    }

    const existingSite = existingResult.site;

    // Merge updates with existing data
    const updatedSiteConfig = {
      ...existingSite.siteConfig,
      ...(updateData.siteConfig ?? {}),
      ...(updateData.theme ? { theme: updateData.theme } : {}),
      ...(updateData.sections ? { sections: updateData.sections } : {}),
    };

    // Save updated site
    const saveResult = await saveSiteDraft({
      sessionId: existingSite.sessionId,
      businessProfile: updateData.businessProfile ?? existingSite.businessProfile,
      content: existingSite.content,
      siteConfig: updatedSiteConfig,
    });

    if (!saveResult.success) {
      return NextResponse.json(
        { error: saveResult.error ?? 'Failed to update site' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      siteId: saveResult.siteId,
      updatedAt: saveResult.updatedAt,
    });
  } catch (error) {
    console.error('Update site error:', error);
    return NextResponse.json(
      { error: 'Failed to update site' },
      { status: 500 }
    );
  }
}

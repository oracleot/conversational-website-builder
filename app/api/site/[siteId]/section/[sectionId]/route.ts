/**
 * Section API - GET, PATCH, DELETE for individual section
 * GET: Retrieve specific section
 * PATCH: Update section content, variant, or visibility
 * DELETE: Remove section from site
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSiteDraft, saveSiteDraft } from '@/lib/db/queries';
import { SectionType } from '@/lib/db/types';

// Schema for updating a section
const borderRadiusOptions = ['none', 'sm', 'md', 'lg', 'full'] as const;
const UpdateSectionSchema = z.object({
  order: z.number().int().min(0).optional(),
  variant: z.number().int().min(1).max(5).optional(),
  content: z.record(z.string(), z.unknown()).optional(),
  isVisible: z.boolean().optional(),
});

interface SiteSection {
  id: string;
  type: SectionType;
  order: number;
  variant: number;
  content: unknown;
  isVisible: boolean;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ siteId: string; sectionId: string }> }
) {
  try {
    const { siteId, sectionId } = await params;

    if (!siteId || !sectionId) {
      return NextResponse.json(
        { error: 'Site ID and Section ID are required' },
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

    const siteConfig = result.site.siteConfig as { sections?: SiteSection[] };
    const sections = siteConfig.sections ?? [];
    const section = sections.find(s => s.id === sectionId);

    if (!section) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ section });
  } catch (error) {
    console.error('Get section error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve section' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ siteId: string; sectionId: string }> }
) {
  try {
    const { siteId, sectionId } = await params;
    const body = await request.json();

    if (!siteId || !sectionId) {
      return NextResponse.json(
        { error: 'Site ID and Section ID are required' },
        { status: 400 }
      );
    }

    // Validate update data
    const parseResult = UpdateSectionSchema.safeParse(body);
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
    const siteConfig = existingSite.siteConfig as { sections?: SiteSection[] };
    const sections = siteConfig.sections ?? [];
    const sectionIndex = sections.findIndex(s => s.id === sectionId);

    if (sectionIndex === -1) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }

    // Update section
    const updatedSection: SiteSection = {
      ...sections[sectionIndex],
      ...(updateData.order !== undefined && { order: updateData.order }),
      ...(updateData.variant !== undefined && { variant: updateData.variant }),
      ...(updateData.content !== undefined && { content: updateData.content }),
      ...(updateData.isVisible !== undefined && { isVisible: updateData.isVisible }),
    };

    // Replace in array
    const updatedSections = [...sections];
    updatedSections[sectionIndex] = updatedSection;

    // Re-sort if order changed
    if (updateData.order !== undefined) {
      updatedSections.sort((a, b) => a.order - b.order);
    }

    // Save updated site
    const saveResult = await saveSiteDraft({
      sessionId: existingSite.sessionId,
      businessProfile: existingSite.businessProfile,
      content: existingSite.content,
      siteConfig: {
        ...existingSite.siteConfig,
        sections: updatedSections,
      },
    });

    if (!saveResult.success) {
      return NextResponse.json(
        { error: saveResult.error ?? 'Failed to update section' },
        { status: 500 }
      );
    }

    return NextResponse.json({ section: updatedSection });
  } catch (error) {
    console.error('Update section error:', error);
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ siteId: string; sectionId: string }> }
) {
  try {
    const { siteId, sectionId } = await params;

    if (!siteId || !sectionId) {
      return NextResponse.json(
        { error: 'Site ID and Section ID are required' },
        { status: 400 }
      );
    }

    // Get existing site
    const existingResult = await getSiteDraft(siteId);
    if (!existingResult.success || !existingResult.site) {
      return NextResponse.json(
        { error: existingResult.error ?? 'Site not found' },
        { status: 404 }
      );
    }

    const existingSite = existingResult.site;
    const siteConfig = existingSite.siteConfig as { sections?: SiteSection[] };
    const sections = siteConfig.sections ?? [];
    const sectionToDelete = sections.find(s => s.id === sectionId);

    if (!sectionToDelete) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }

    // Remove section and re-order remaining
    const updatedSections = sections
      .filter(s => s.id !== sectionId)
      .map((s, index) => ({ ...s, order: index }));

    // Save updated site
    const saveResult = await saveSiteDraft({
      sessionId: existingSite.sessionId,
      businessProfile: existingSite.businessProfile,
      content: existingSite.content,
      siteConfig: {
        ...existingSite.siteConfig,
        sections: updatedSections,
      },
    });

    if (!saveResult.success) {
      return NextResponse.json(
        { error: saveResult.error ?? 'Failed to delete section' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      deleted: sectionToDelete.id,
      remainingSections: updatedSections.length,
    });
  } catch (error) {
    console.error('Delete section error:', error);
    return NextResponse.json(
      { error: 'Failed to delete section' },
      { status: 500 }
    );
  }
}

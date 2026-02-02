/**
 * Section API - POST for creating new sections
 * POST: Add a new section to a site
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSiteDraft, saveSiteDraft } from '@/lib/db/queries';
import { SectionType } from '@/lib/db/types';

// Schema for creating a section
const sectionTypes = ['hero', 'services', 'about', 'process', 'testimonials', 'portfolio', 'contact', 'menu', 'location', 'gallery'] as const;
const CreateSectionSchema = z.object({
  type: z.enum(sectionTypes),
  order: z.number().int().min(0).optional(),
  variant: z.number().int().min(1).max(5).default(1),
  content: z.record(z.string(), z.unknown()),
  isVisible: z.boolean().default(true),
});

interface SiteSection {
  id: string;
  type: SectionType;
  order: number;
  variant: number;
  content: unknown;
  isVisible: boolean;
}

export async function POST(
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

    // Validate section data
    const parseResult = CreateSectionSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid section data', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const sectionData = parseResult.data;

    // Get existing site
    const existingResult = await getSiteDraft(siteId);
    if (!existingResult.success || !existingResult.site) {
      return NextResponse.json(
        { error: existingResult.error ?? 'Site not found' },
        { status: 404 }
      );
    }

    const existingSite = existingResult.site;
    
    // Get existing sections from siteConfig
    const siteConfig = existingSite.siteConfig as { sections?: SiteSection[] };
    const existingSections = siteConfig.sections ?? [];

    // Check if section type already exists
    const existingSection = existingSections.find(s => s.type === sectionData.type);
    if (existingSection) {
      return NextResponse.json(
        { error: `Section of type '${sectionData.type}' already exists`, existingSectionId: existingSection.id },
        { status: 409 }
      );
    }

    // Generate section ID
    const sectionId = `section-${sectionData.type}-${Date.now()}`;

    // Determine order (append to end if not specified)
    const order = sectionData.order ?? existingSections.length;

    // Create new section
    const newSection: SiteSection = {
      id: sectionId,
      type: sectionData.type as SectionType,
      order,
      variant: sectionData.variant,
      content: sectionData.content,
      isVisible: sectionData.isVisible,
    };

    // Add to sections array
    const updatedSections = [...existingSections, newSection].sort((a, b) => a.order - b.order);

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
        { error: saveResult.error ?? 'Failed to create section' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      section: newSection,
      totalSections: updatedSections.length,
    }, { status: 201 });
  } catch (error) {
    console.error('Create section error:', error);
    return NextResponse.json(
      { error: 'Failed to create section' },
      { status: 500 }
    );
  }
}

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

    const siteConfig = result.site.siteConfig as { sections?: SiteSection[] };
    const sections = siteConfig.sections ?? [];

    return NextResponse.json({
      sections: sections.sort((a, b) => a.order - b.order),
      total: sections.length,
    });
  } catch (error) {
    console.error('Get sections error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve sections' },
      { status: 500 }
    );
  }
}

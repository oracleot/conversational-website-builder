/**
 * Variant API - AI-powered variant selection and switching
 * POST: Get variant recommendations for a section based on business profile
 * PATCH: Switch to a different variant for a section
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSiteDraft, saveSiteDraft, trackComponentUsageInMemory } from '@/lib/db/queries';
import {
  selectVariant,
  selectVariantsForSite,
  getAllVariantsWithScores,
} from '@/lib/chat/variant-selector';
import type { SectionType, IndustryType } from '@/lib/db/types';
import type { BusinessProfile } from '@/lib/schemas';

// Schema for POST request - get variant recommendations
const GetVariantRecommendationsSchema = z.object({
  sectionType: z.string().optional(),
  sections: z.array(z.string()).optional(),
});

// Schema for PATCH request - switch variant
const SwitchVariantSchema = z.object({
  sectionId: z.string(),
  sectionType: z.string(),
  newVariant: z.number().min(1).max(5),
  isOverride: z.boolean().default(true),
});

/**
 * POST - Get variant recommendations based on business profile
 * Can request for a single section or multiple sections
 */
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

    // Validate request
    const parseResult = GetVariantRecommendationsSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { sectionType, sections } = parseResult.data;

    // Get site data to access business profile
    const siteResult = await getSiteDraft(siteId);
    if (!siteResult.success || !siteResult.site) {
      return NextResponse.json(
        { error: siteResult.error ?? 'Site not found' },
        { status: 404 }
      );
    }

    const site = siteResult.site;
    const businessProfile = site.businessProfile as BusinessProfile;
    const industry = (businessProfile.industry || 'service') as IndustryType;

    // Single section recommendation
    if (sectionType) {
      const recommendation = selectVariant({
        sectionType: sectionType as SectionType,
        industry,
        businessProfile,
      });

      const allVariants = getAllVariantsWithScores(
        sectionType as SectionType,
        industry,
        businessProfile
      );

      return NextResponse.json({
        success: true,
        sectionType,
        recommendation: {
          selectedVariant: recommendation.selectedVariant,
          score: recommendation.score,
          reasoning: recommendation.reasoning,
        },
        alternatives: recommendation.alternatives.map(alt => ({
          variant: alt.variant,
          score: alt.score,
          description: alt.personality.description,
          traits: alt.personality.traits,
        })),
        allVariants: allVariants.map(v => ({
          variant: v.variant,
          score: Math.round(v.score * 100),
          description: v.personality.description,
          isRecommended: v.isRecommended,
        })),
      });
    }

    // Batch recommendations for multiple sections
    if (sections && sections.length > 0) {
      const batchResult = selectVariantsForSite(
        sections as SectionType[],
        industry,
        businessProfile
      );

      return NextResponse.json({
        success: true,
        selections: batchResult.selections.map(sel => ({
          sectionType: sel.sectionType,
          selectedVariant: sel.selectedVariant,
          score: Math.round(sel.score * 100),
          reasoning: sel.reasoning,
          alternatives: sel.alternatives.slice(0, 2).map(alt => ({
            variant: alt.variant,
            description: alt.personality.description,
          })),
        })),
        overallReasoning: batchResult.overallReasoning,
      });
    }

    // Default: recommend for all standard sections
    const defaultSections: SectionType[] = [
      'hero',
      'services',
      'about',
      'process',
      'testimonials',
      'portfolio',
      'contact',
    ];

    const batchResult = selectVariantsForSite(
      defaultSections,
      industry,
      businessProfile
    );

    return NextResponse.json({
      success: true,
      selections: batchResult.selections.map(sel => ({
        sectionType: sel.sectionType,
        selectedVariant: sel.selectedVariant,
        score: Math.round(sel.score * 100),
        reasoning: sel.reasoning,
      })),
      overallReasoning: batchResult.overallReasoning,
    });
  } catch (error) {
    console.error('Variant recommendation error:', error);
    return NextResponse.json(
      { error: 'Failed to get variant recommendations' },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Switch a section to a different variant
 * Records the override for analytics
 */
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

    // Validate request
    const parseResult = SwitchVariantSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const { sectionId, sectionType, newVariant, isOverride } = parseResult.data;

    // Get existing site
    const siteResult = await getSiteDraft(siteId);
    if (!siteResult.success || !siteResult.site) {
      return NextResponse.json(
        { error: siteResult.error ?? 'Site not found' },
        { status: 404 }
      );
    }

    const site = siteResult.site;
    const siteConfig = site.siteConfig as Record<string, unknown>;
    const sections = (siteConfig.sections || []) as Array<{
      id: string;
      type: string;
      order: number;
      variant: number;
      content: unknown;
      isVisible?: boolean;
    }>;

    // Find and update the section
    const sectionIndex = sections.findIndex(
      s => s.id === sectionId || s.type === sectionType
    );

    if (sectionIndex === -1) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }

    const previousVariant = sections[sectionIndex].variant;
    sections[sectionIndex].variant = newVariant;

    // Save updated site
    const saveResult = await saveSiteDraft({
      sessionId: site.sessionId,
      businessProfile: site.businessProfile,
      content: site.content,
      siteConfig: {
        ...siteConfig,
        sections,
      },
    });

    if (!saveResult.success) {
      return NextResponse.json(
        { error: saveResult.error ?? 'Failed to save variant change' },
        { status: 500 }
      );
    }

    // Track variant override for analytics (T103)
    if (isOverride) {
      await trackComponentUsageInMemory({
        siteId,
        sectionType,
        variantNumber: newVariant,
        isOverride: true,
      });
    }

    // Get the personality info for the new variant
    const businessProfile = site.businessProfile as BusinessProfile;
    const industry = (businessProfile.industry || 'service') as IndustryType;
    const allVariants = getAllVariantsWithScores(
      sectionType as SectionType,
      industry,
      businessProfile
    );
    const selectedVariantInfo = allVariants.find(v => v.variant === newVariant);

    return NextResponse.json({
      success: true,
      sectionId,
      sectionType,
      previousVariant,
      newVariant,
      isOverride,
      variantInfo: selectedVariantInfo ? {
        description: selectedVariantInfo.personality.description,
        traits: selectedVariantInfo.personality.traits,
        matchScore: Math.round(selectedVariantInfo.score * 100),
      } : null,
      updatedAt: saveResult.updatedAt,
    });
  } catch (error) {
    console.error('Switch variant error:', error);
    return NextResponse.json(
      { error: 'Failed to switch variant' },
      { status: 500 }
    );
  }
}

/**
 * GET - Get all variant options with scores for a specific section
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  try {
    const { siteId } = await params;
    const { searchParams } = new URL(request.url);
    const sectionType = searchParams.get('sectionType');

    if (!siteId) {
      return NextResponse.json(
        { error: 'Site ID is required' },
        { status: 400 }
      );
    }

    if (!sectionType) {
      return NextResponse.json(
        { error: 'sectionType query parameter is required' },
        { status: 400 }
      );
    }

    // Get site data
    const siteResult = await getSiteDraft(siteId);
    if (!siteResult.success || !siteResult.site) {
      return NextResponse.json(
        { error: siteResult.error ?? 'Site not found' },
        { status: 404 }
      );
    }

    const site = siteResult.site;
    const businessProfile = site.businessProfile as BusinessProfile;
    const industry = (businessProfile.industry || 'service') as IndustryType;

    // Get all variants with scores
    const allVariants = getAllVariantsWithScores(
      sectionType as SectionType,
      industry,
      businessProfile
    );

    // Get current variant from site config
    const siteConfig = site.siteConfig as Record<string, unknown>;
    const sections = (siteConfig.sections || []) as Array<{
      id: string;
      type: string;
      variant: number;
    }>;
    const currentSection = sections.find(s => s.type === sectionType);
    const currentVariant = currentSection?.variant || allVariants.find(v => v.isRecommended)?.variant || 1;

    return NextResponse.json({
      success: true,
      sectionType,
      currentVariant,
      variants: allVariants.map(v => ({
        variant: v.variant,
        matchScore: Math.round(v.score * 100),
        description: v.personality.description,
        traits: v.personality.traits,
        bestFor: v.personality.bestFor,
        isRecommended: v.isRecommended,
        isCurrent: v.variant === currentVariant,
      })),
    });
  } catch (error) {
    console.error('Get variants error:', error);
    return NextResponse.json(
      { error: 'Failed to get variant options' },
      { status: 500 }
    );
  }
}

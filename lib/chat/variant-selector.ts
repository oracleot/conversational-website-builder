/**
 * Variant Selector - AI-powered variant selection based on brand personality
 * 
 * Selects the best component variant (1-5) for each section based on:
 * 1. Brand personality traits from business profile
 * 2. Industry type (service vs local)
 * 3. Variant personality matrix matching
 */

import type { SectionType, IndustryType } from '@/lib/db/types';
import type { BusinessProfile } from '@/lib/schemas';
import {
  VARIANT_PERSONALITIES,
  calculatePersonalityMatch,
  rankVariantsByPersonality,
  type VariantPersonality,
} from '@/lib/registry/variant-personalities';
import { getAvailableVariants } from '@/lib/registry/components';

export interface VariantSelection {
  sectionType: SectionType;
  selectedVariant: number;
  score: number;
  reasoning: string;
  alternatives: VariantAlternative[];
}

export interface VariantAlternative {
  variant: number;
  score: number;
  personality: VariantPersonality;
}

export interface VariantSelectorInput {
  sectionType: SectionType;
  industry: IndustryType;
  businessProfile: BusinessProfile;
}

export interface BatchVariantSelection {
  selections: VariantSelection[];
  overallReasoning: string;
}

/**
 * Select the best variant for a single section
 */
export function selectVariant(input: VariantSelectorInput): VariantSelection {
  const { sectionType, industry, businessProfile } = input;
  
  // Get brand personality traits from business profile
  const brandTraits = businessProfile.brandPersonality || [];
  
  // Get available variants for this section
  const availableVariants = getAvailableVariants(
    industry === 'service' ? 'service' : 'local',
    sectionType
  );
  
  // Rank all variants by personality match
  const rankedVariants = rankVariantsByPersonality(brandTraits);
  
  // Filter to only available variants
  const availableRanked = rankedVariants.filter(rv =>
    availableVariants.includes(rv.variant)
  );
  
  // Get the best match
  const bestMatch = availableRanked[0] || {
    variant: 1,
    score: 0,
    personality: VARIANT_PERSONALITIES[0],
  };
  
  // Generate reasoning
  const reasoning = generateReasoning(
    brandTraits,
    bestMatch.personality,
    bestMatch.score
  );
  
  // Build alternatives (excluding the selected one)
  const alternatives: VariantAlternative[] = availableRanked
    .filter(rv => rv.variant !== bestMatch.variant)
    .slice(0, 4) // Top 4 alternatives
    .map(rv => ({
      variant: rv.variant,
      score: rv.score,
      personality: rv.personality,
    }));
  
  return {
    sectionType,
    selectedVariant: bestMatch.variant,
    score: bestMatch.score,
    reasoning,
    alternatives,
  };
}

/**
 * Select variants for multiple sections at once
 */
export function selectVariantsForSite(
  sections: SectionType[],
  industry: IndustryType,
  businessProfile: BusinessProfile
): BatchVariantSelection {
  const selections = sections.map(sectionType =>
    selectVariant({ sectionType, industry, businessProfile })
  );
  
  // Generate overall reasoning
  const brandTraits = businessProfile.brandPersonality || [];
  const avgScore = selections.reduce((sum, s) => sum + s.score, 0) / selections.length;
  
  const overallReasoning = generateOverallReasoning(
    brandTraits,
    selections,
    avgScore
  );
  
  return {
    selections,
    overallReasoning,
  };
}

/**
 * Get variant recommendation with detailed explanation
 */
export function getVariantRecommendation(
  sectionType: SectionType,
  industry: IndustryType,
  businessProfile: BusinessProfile
): {
  recommended: number;
  alternatives: Array<{ variant: number; match: string }>;
  explanation: string;
} {
  const selection = selectVariant({ sectionType, industry, businessProfile });
  
  return {
    recommended: selection.selectedVariant,
    alternatives: selection.alternatives.map(alt => ({
      variant: alt.variant,
      match: `${Math.round(alt.score * 100)}% match - ${alt.personality.description}`,
    })),
    explanation: selection.reasoning,
  };
}

/**
 * Calculate match score between brand and variant
 * Exposed for use in API and UI
 */
export function getMatchScore(
  brandTraits: string[],
  variant: number
): {
  score: number;
  matchedTraits: string[];
  personality: VariantPersonality | undefined;
} {
  const personality = VARIANT_PERSONALITIES.find(vp => vp.variant === variant);
  if (!personality) {
    return { score: 0, matchedTraits: [], personality: undefined };
  }
  
  const normalizedBrand = brandTraits.map(t => t.toLowerCase().trim());
  const normalizedVariant = personality.traits.map(t => t.toLowerCase().trim());
  
  const matchedTraits = normalizedBrand.filter(trait =>
    normalizedVariant.some(vTrait =>
      vTrait.includes(trait) || trait.includes(vTrait)
    )
  );
  
  return {
    score: calculatePersonalityMatch(brandTraits, personality.traits),
    matchedTraits,
    personality,
  };
}

/**
 * Get all variants with their match scores for a section
 */
export function getAllVariantsWithScores(
  sectionType: SectionType,
  industry: IndustryType,
  businessProfile: BusinessProfile
): Array<{
  variant: number;
  score: number;
  personality: VariantPersonality;
  isRecommended: boolean;
}> {
  const brandTraits = businessProfile.brandPersonality || [];
  const availableVariants = getAvailableVariants(
    industry === 'service' ? 'service' : 'local',
    sectionType
  );
  
  const rankedVariants = rankVariantsByPersonality(brandTraits);
  const topVariant = rankedVariants[0]?.variant || 1;
  
  return rankedVariants
    .filter(rv => availableVariants.includes(rv.variant))
    .map(rv => ({
      variant: rv.variant,
      score: rv.score,
      personality: rv.personality,
      isRecommended: rv.variant === topVariant,
    }));
}

// ============================================================================
// PRIVATE HELPER FUNCTIONS
// ============================================================================

function generateReasoning(
  brandTraits: string[],
  personality: VariantPersonality,
  score: number
): string {
  if (brandTraits.length === 0) {
    return `Selected variant ${personality.variant} (${personality.description}) as the default style.`;
  }
  
  const matchPercentage = Math.round(score * 100);
  const matchedTraits = brandTraits.filter(trait =>
    personality.traits.some(pt =>
      pt.toLowerCase().includes(trait.toLowerCase()) ||
      trait.toLowerCase().includes(pt.toLowerCase())
    )
  );
  
  if (matchedTraits.length === 0) {
    return `Selected variant ${personality.variant} for its ${personality.traits.slice(0, 2).join(' and ')} aesthetic, which complements your brand.`;
  }
  
  return `Selected variant ${personality.variant} (${matchPercentage}% match) because your "${matchedTraits.join(', ')}" brand personality aligns with its ${personality.traits.slice(0, 2).join(' and ')} design style.`;
}

function generateOverallReasoning(
  brandTraits: string[],
  selections: VariantSelection[],
  avgScore: number
): string {
  if (brandTraits.length === 0) {
    return 'Default variants selected. Add brand personality traits to get personalized recommendations.';
  }
  
  const avgPercentage = Math.round(avgScore * 100);
  const dominantVariant = findDominantVariant(selections);
  
  if (dominantVariant) {
    const personality = VARIANT_PERSONALITIES.find(vp => vp.variant === dominantVariant);
    return `${avgPercentage}% overall match. Your "${brandTraits.join(', ')}" brand aligns best with the ${personality?.description.toLowerCase() || 'selected'} design approach used across most sections.`;
  }
  
  return `${avgPercentage}% overall match. Variants were selected to best represent your "${brandTraits.join(', ')}" brand personality across all sections.`;
}

function findDominantVariant(selections: VariantSelection[]): number | null {
  const counts = new Map<number, number>();
  
  for (const selection of selections) {
    counts.set(selection.selectedVariant, (counts.get(selection.selectedVariant) || 0) + 1);
  }
  
  let maxCount = 0;
  let dominant: number | null = null;
  
  for (const [variant, count] of counts) {
    if (count > maxCount) {
      maxCount = count;
      dominant = variant;
    }
  }
  
  // Only return if it represents majority
  return maxCount > selections.length / 2 ? dominant : null;
}

export default {
  selectVariant,
  selectVariantsForSite,
  getVariantRecommendation,
  getMatchScore,
  getAllVariantsWithScores,
};

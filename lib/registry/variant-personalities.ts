/**
 * Variant Personality Matrix
 * Maps each variant (1-5) to personality traits for AI selection
 */

export interface VariantPersonality {
  variant: number;
  traits: string[];
  description: string;
  bestFor: string[];
}

export const VARIANT_PERSONALITIES: VariantPersonality[] = [
  {
    variant: 1,
    traits: ['professional', 'corporate', 'trustworthy', 'traditional', 'formal'],
    description: 'Clean, professional design with strong credibility signals',
    bestFor: ['consulting', 'legal', 'financial', 'b2b services', 'professional services'],
  },
  {
    variant: 2,
    traits: ['modern', 'minimal', 'clean', 'tech', 'sleek', 'contemporary'],
    description: 'Minimalist design with modern aesthetics and whitespace',
    bestFor: ['tech companies', 'startups', 'design agencies', 'digital services'],
  },
  {
    variant: 3,
    traits: ['bold', 'creative', 'artistic', 'unique', 'expressive', 'vibrant'],
    description: 'Eye-catching design with creative flair and strong visual impact',
    bestFor: ['creative agencies', 'artists', 'entertainment', 'fashion', 'events'],
  },
  {
    variant: 4,
    traits: ['elegant', 'luxury', 'sophisticated', 'premium', 'refined', 'upscale'],
    description: 'High-end design with elegant typography and premium feel',
    bestFor: ['luxury brands', 'high-end services', 'boutiques', 'premium products'],
  },
  {
    variant: 5,
    traits: ['friendly', 'approachable', 'casual', 'warm', 'welcoming', 'personal'],
    description: 'Warm, inviting design that feels personal and accessible',
    bestFor: ['local businesses', 'restaurants', 'retail', 'family services', 'community'],
  },
];

/**
 * Calculate personality match score for variant selection
 * @param brandTraits - Brand personality traits from business profile
 * @param variantTraits - Traits associated with a variant
 * @returns Score from 0-1 indicating match strength
 */
export function calculatePersonalityMatch(
  brandTraits: string[],
  variantTraits: string[]
): number {
  const normalizedBrandTraits = brandTraits.map((t) => t.toLowerCase().trim());
  const normalizedVariantTraits = variantTraits.map((t) => t.toLowerCase().trim());

  const matches = normalizedBrandTraits.filter((trait) =>
    normalizedVariantTraits.some((vTrait) => 
      vTrait.includes(trait) || trait.includes(vTrait)
    )
  ).length;

  return matches / Math.max(normalizedBrandTraits.length, 1);
}

/**
 * Get variant personality by variant number
 */
export function getVariantPersonality(variant: number): VariantPersonality | undefined {
  return VARIANT_PERSONALITIES.find((vp) => vp.variant === variant);
}

/**
 * Get all variants sorted by personality match score
 */
export function rankVariantsByPersonality(brandTraits: string[]): Array<{
  variant: number;
  score: number;
  personality: VariantPersonality;
}> {
  return VARIANT_PERSONALITIES.map((vp) => ({
    variant: vp.variant,
    score: calculatePersonalityMatch(brandTraits, vp.traits),
    personality: vp,
  })).sort((a, b) => b.score - a.score);
}

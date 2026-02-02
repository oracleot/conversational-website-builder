/**
 * Variant Selector Tests
 * Tests for the AI variant selection algorithm
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  selectVariant,
  selectVariantsForSite,
  getVariantRecommendation,
  getMatchScore,
  getAllVariantsWithScores,
  type VariantSelection,
  type VariantSelectorInput,
} from '@/lib/chat/variant-selector';
import type { BusinessProfile } from '@/lib/schemas';
import type { SectionType, IndustryType } from '@/lib/db/types';

// Test fixtures
const createBusinessProfile = (overrides: Partial<BusinessProfile> = {}): BusinessProfile => ({
  name: 'Test Business',
  industry: 'service',
  businessType: 'consulting',
  tagline: 'We help you succeed',
  description: 'A consulting firm helping businesses grow',
  brandPersonality: ['professional', 'trustworthy'],
  contact: {
    email: 'test@example.com',
  },
  ...overrides,
});

describe('Variant Selector', () => {
  describe('selectVariant', () => {
    it('should select a variant for a given section', () => {
      const input: VariantSelectorInput = {
        sectionType: 'hero',
        industry: 'service',
        businessProfile: createBusinessProfile(),
      };

      const result = selectVariant(input);

      expect(result).toHaveProperty('sectionType', 'hero');
      expect(result).toHaveProperty('selectedVariant');
      expect(result.selectedVariant).toBeGreaterThanOrEqual(1);
      expect(result.selectedVariant).toBeLessThanOrEqual(5);
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('reasoning');
      expect(result).toHaveProperty('alternatives');
    });

    it('should select variant 1 (professional) for professional traits', () => {
      const input: VariantSelectorInput = {
        sectionType: 'hero',
        industry: 'service',
        businessProfile: createBusinessProfile({
          brandPersonality: ['professional', 'corporate', 'trustworthy'],
        }),
      };

      const result = selectVariant(input);

      // Variant 1 has professional traits
      expect(result.selectedVariant).toBe(1);
      expect(result.score).toBeGreaterThan(0.5);
    });

    it('should select variant 2 (modern) for modern/tech traits', () => {
      const input: VariantSelectorInput = {
        sectionType: 'hero',
        industry: 'service',
        businessProfile: createBusinessProfile({
          brandPersonality: ['modern', 'minimal', 'tech'],
        }),
      };

      const result = selectVariant(input);

      expect(result.selectedVariant).toBe(2);
    });

    it('should select variant 3 (bold) for creative traits', () => {
      const input: VariantSelectorInput = {
        sectionType: 'hero',
        industry: 'service',
        businessProfile: createBusinessProfile({
          brandPersonality: ['bold', 'creative', 'artistic'],
        }),
      };

      const result = selectVariant(input);

      expect(result.selectedVariant).toBe(3);
    });

    it('should select variant 4 (elegant) for luxury traits', () => {
      const input: VariantSelectorInput = {
        sectionType: 'hero',
        industry: 'service',
        businessProfile: createBusinessProfile({
          brandPersonality: ['elegant', 'luxury', 'sophisticated'],
        }),
      };

      const result = selectVariant(input);

      expect(result.selectedVariant).toBe(4);
    });

    it('should select variant 5 (friendly) for warm/casual traits', () => {
      const input: VariantSelectorInput = {
        sectionType: 'hero',
        industry: 'service',
        businessProfile: createBusinessProfile({
          brandPersonality: ['friendly', 'warm', 'approachable'],
        }),
      };

      const result = selectVariant(input);

      expect(result.selectedVariant).toBe(5);
    });

    it('should provide alternatives when selecting a variant', () => {
      const input: VariantSelectorInput = {
        sectionType: 'hero',
        industry: 'service',
        businessProfile: createBusinessProfile(),
      };

      const result = selectVariant(input);

      expect(result.alternatives.length).toBeGreaterThan(0);
      expect(result.alternatives.length).toBeLessThanOrEqual(4);
      result.alternatives.forEach(alt => {
        expect(alt.variant).not.toBe(result.selectedVariant);
        expect(alt).toHaveProperty('score');
        expect(alt).toHaveProperty('personality');
      });
    });

    it('should generate meaningful reasoning', () => {
      const input: VariantSelectorInput = {
        sectionType: 'hero',
        industry: 'service',
        businessProfile: createBusinessProfile({
          brandPersonality: ['professional', 'trustworthy'],
        }),
      };

      const result = selectVariant(input);

      expect(result.reasoning).toBeTruthy();
      expect(typeof result.reasoning).toBe('string');
      expect(result.reasoning.length).toBeGreaterThan(10);
    });

    it('should handle empty brand personality', () => {
      const input: VariantSelectorInput = {
        sectionType: 'hero',
        industry: 'service',
        businessProfile: createBusinessProfile({
          brandPersonality: [],
        }),
      };

      const result = selectVariant(input);

      expect(result.selectedVariant).toBeGreaterThanOrEqual(1);
      expect(result.selectedVariant).toBeLessThanOrEqual(5);
      expect(result.reasoning).toContain('default');
    });
  });

  describe('selectVariantsForSite', () => {
    it('should select variants for multiple sections', () => {
      const sections: SectionType[] = ['hero', 'services', 'about', 'contact'];
      const industry: IndustryType = 'service';
      const profile = createBusinessProfile();

      const result = selectVariantsForSite(sections, industry, profile);

      expect(result.selections.length).toBe(sections.length);
      result.selections.forEach((sel, idx) => {
        expect(sel.sectionType).toBe(sections[idx]);
        expect(sel.selectedVariant).toBeGreaterThanOrEqual(1);
        expect(sel.selectedVariant).toBeLessThanOrEqual(5);
      });
    });

    it('should provide overall reasoning', () => {
      const sections: SectionType[] = ['hero', 'services', 'contact'];
      const industry: IndustryType = 'service';
      const profile = createBusinessProfile();

      const result = selectVariantsForSite(sections, industry, profile);

      expect(result.overallReasoning).toBeTruthy();
      expect(typeof result.overallReasoning).toBe('string');
    });

    it('should maintain consistency across sections with same traits', () => {
      const sections: SectionType[] = ['hero', 'services', 'about'];
      const industry: IndustryType = 'service';
      const profile = createBusinessProfile({
        brandPersonality: ['modern', 'minimal', 'clean'],
      });

      const result = selectVariantsForSite(sections, industry, profile);

      // All sections should have the same variant for consistent design
      const variants = result.selections.map(s => s.selectedVariant);
      const uniqueVariants = [...new Set(variants)];
      // With strong trait match, we expect consistency
      expect(uniqueVariants.length).toBeLessThanOrEqual(2);
    });
  });

  describe('getVariantRecommendation', () => {
    it('should return a recommendation with alternatives', () => {
      const result = getVariantRecommendation(
        'hero',
        'service',
        createBusinessProfile()
      );

      expect(result).toHaveProperty('recommended');
      expect(result).toHaveProperty('alternatives');
      expect(result).toHaveProperty('explanation');
      expect(result.alternatives.length).toBeGreaterThanOrEqual(0);
    });

    it('should format alternative descriptions', () => {
      const result = getVariantRecommendation(
        'services',
        'service',
        createBusinessProfile()
      );

      result.alternatives.forEach(alt => {
        expect(alt).toHaveProperty('variant');
        expect(alt).toHaveProperty('match');
        expect(alt.match).toContain('%');
      });
    });
  });

  describe('getMatchScore', () => {
    it('should calculate match score between brand traits and variant', () => {
      const brandTraits = ['professional', 'trustworthy'];
      const result = getMatchScore(brandTraits, 1);

      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('matchedTraits');
      expect(result).toHaveProperty('personality');
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
    });

    it('should return high score for matching traits', () => {
      const brandTraits = ['professional', 'corporate', 'trustworthy'];
      const result = getMatchScore(brandTraits, 1); // Variant 1 is professional

      expect(result.score).toBeGreaterThan(0.5);
      expect(result.matchedTraits.length).toBeGreaterThan(0);
    });

    it('should return low score for non-matching traits', () => {
      const brandTraits = ['professional', 'corporate'];
      const result = getMatchScore(brandTraits, 3); // Variant 3 is bold/creative

      expect(result.score).toBeLessThan(result.matchedTraits.length > 0 ? 0.5 : 1);
    });

    it('should return personality info', () => {
      const result = getMatchScore(['modern'], 2);

      expect(result.personality).toBeDefined();
      expect(result.personality?.variant).toBe(2);
      expect(result.personality?.traits).toContain('modern');
    });

    it('should handle invalid variant number', () => {
      const result = getMatchScore(['modern'], 10); // Invalid variant

      expect(result.score).toBe(0);
      expect(result.matchedTraits).toEqual([]);
      expect(result.personality).toBeUndefined();
    });
  });

  describe('getAllVariantsWithScores', () => {
    it('should return all variants with scores', () => {
      const result = getAllVariantsWithScores(
        'hero',
        'service',
        createBusinessProfile()
      );

      expect(result.length).toBeGreaterThan(0);
      result.forEach(v => {
        expect(v).toHaveProperty('variant');
        expect(v).toHaveProperty('score');
        expect(v).toHaveProperty('personality');
        expect(v).toHaveProperty('isRecommended');
      });
    });

    it('should mark exactly one variant as recommended', () => {
      const result = getAllVariantsWithScores(
        'hero',
        'service',
        createBusinessProfile()
      );

      const recommended = result.filter(v => v.isRecommended);
      expect(recommended.length).toBe(1);
    });

    it('should sort by score descending', () => {
      const result = getAllVariantsWithScores(
        'hero',
        'service',
        createBusinessProfile({
          brandPersonality: ['professional', 'corporate'],
        })
      );

      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].score).toBeGreaterThanOrEqual(result[i + 1].score);
      }
    });
  });

  describe('edge cases', () => {
    it('should handle local industry', () => {
      const input: VariantSelectorInput = {
        sectionType: 'hero',
        industry: 'local',
        businessProfile: createBusinessProfile({
          industry: 'local',
          businessType: 'restaurant',
          brandPersonality: ['friendly', 'warm'],
        }),
      };

      const result = selectVariant(input);

      expect(result.selectedVariant).toBe(5); // Friendly variant for local business
    });

    it('should handle partial trait matches', () => {
      const brandTraits = ['professional-looking', 'somewhat-formal'];
      const result = getMatchScore(brandTraits, 1);

      // Should still find partial matches
      expect(result.matchedTraits.length).toBeGreaterThan(0);
    });

    it('should handle case-insensitive trait matching', () => {
      const input: VariantSelectorInput = {
        sectionType: 'hero',
        industry: 'service',
        businessProfile: createBusinessProfile({
          brandPersonality: ['PROFESSIONAL', 'Modern', 'ELEGANT'],
        }),
      };

      const result = selectVariant(input);

      expect(result.selectedVariant).toBeGreaterThanOrEqual(1);
      expect(result.score).toBeGreaterThan(0);
    });
  });
});

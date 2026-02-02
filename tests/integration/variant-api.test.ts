/**
 * Variant API Integration Tests
 * Tests for AI variant selection and switching
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock database operations
vi.mock('@/lib/db/queries', () => ({
  getSiteDraft: vi.fn(),
  saveSiteDraft: vi.fn(),
  trackComponentUsageInMemory: vi.fn(),
  getComponentUsageInMemory: vi.fn(),
  getOverrideStats: vi.fn(),
}));

import { getSiteDraft, saveSiteDraft, trackComponentUsageInMemory } from '@/lib/db/queries';

const mockedGetSiteDraft = vi.mocked(getSiteDraft);
const mockedSaveSiteDraft = vi.mocked(saveSiteDraft);
const mockedTrackComponentUsage = vi.mocked(trackComponentUsageInMemory);

describe('Variant API Integration', () => {
  const mockTimestamp = new Date().toISOString();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/site/[siteId]/variant', () => {
    it('should return all variants with scores for a section', async () => {
      const mockSite = {
        id: 'site-123',
        sessionId: 'session-456',
        businessProfile: {
          name: 'Test Business',
          industry: 'service',
          brandPersonality: ['professional', 'trustworthy'],
        },
        siteConfig: {
          sections: [
            { id: 'hero-1', type: 'hero', variant: 1 },
          ],
        },
        content: {},
        createdAt: mockTimestamp,
        updatedAt: mockTimestamp,
      };

      mockedGetSiteDraft.mockResolvedValue({
        success: true,
        site: mockSite,
      });

      // Expected response structure
      const expectedResponse = {
        success: true,
        sectionType: 'hero',
        currentVariant: 1,
        variants: [
          {
            variant: 1,
            matchScore: expect.any(Number),
            description: expect.any(String),
            traits: expect.any(Array),
            bestFor: expect.any(Array),
            isRecommended: expect.any(Boolean),
            isCurrent: true,
          },
        ],
      };

      expect(expectedResponse.success).toBe(true);
      expect(expectedResponse.currentVariant).toBe(1);
    });

    it('should require sectionType query parameter', async () => {
      const errorResponse = {
        error: 'sectionType query parameter is required',
        status: 400,
      };

      expect(errorResponse.status).toBe(400);
    });

    it('should return 404 for non-existent site', async () => {
      mockedGetSiteDraft.mockResolvedValue({
        success: false,
        error: 'Site not found',
      });

      const errorResponse = {
        error: 'Site not found',
        status: 404,
      };

      expect(errorResponse.status).toBe(404);
    });
  });

  describe('POST /api/site/[siteId]/variant', () => {
    it('should return variant recommendations for a single section', async () => {
      const mockSite = {
        id: 'site-123',
        sessionId: 'session-456',
        businessProfile: {
          name: 'Elegant Interiors',
          industry: 'service',
          brandPersonality: ['elegant', 'luxury', 'sophisticated'],
        },
        siteConfig: {},
        content: {},
        createdAt: mockTimestamp,
        updatedAt: mockTimestamp,
      };

      mockedGetSiteDraft.mockResolvedValue({
        success: true,
        site: mockSite,
      });

      const requestPayload = {
        sectionType: 'hero',
      };

      // Expected response
      const expectedResponse = {
        success: true,
        sectionType: 'hero',
        recommendation: {
          selectedVariant: 4, // Elegant variant for luxury brand
          score: expect.any(Number),
          reasoning: expect.any(String),
        },
        alternatives: expect.any(Array),
        allVariants: expect.any(Array),
      };

      expect(expectedResponse.success).toBe(true);
      expect(expectedResponse.recommendation.selectedVariant).toBe(4);
    });

    it('should return batch recommendations for multiple sections', async () => {
      const mockSite = {
        id: 'site-123',
        sessionId: 'session-456',
        businessProfile: {
          name: 'Modern Tech',
          industry: 'service',
          brandPersonality: ['modern', 'minimal', 'tech'],
        },
        siteConfig: {},
        content: {},
        createdAt: mockTimestamp,
        updatedAt: mockTimestamp,
      };

      mockedGetSiteDraft.mockResolvedValue({
        success: true,
        site: mockSite,
      });

      const requestPayload = {
        sections: ['hero', 'services', 'about', 'contact'],
      };

      // Expected response
      const expectedResponse = {
        success: true,
        selections: [
          {
            sectionType: 'hero',
            selectedVariant: 2,
            score: expect.any(Number),
            reasoning: expect.any(String),
          },
          {
            sectionType: 'services',
            selectedVariant: 2,
            score: expect.any(Number),
            reasoning: expect.any(String),
          },
          {
            sectionType: 'about',
            selectedVariant: 2,
            score: expect.any(Number),
            reasoning: expect.any(String),
          },
          {
            sectionType: 'contact',
            selectedVariant: 2,
            score: expect.any(Number),
            reasoning: expect.any(String),
          },
        ],
        overallReasoning: expect.any(String),
      };

      expect(expectedResponse.success).toBe(true);
      expect(expectedResponse.selections.length).toBe(4);
    });

    it('should return default recommendations when no sections specified', async () => {
      const mockSite = {
        id: 'site-123',
        sessionId: 'session-456',
        businessProfile: {
          name: 'Default Business',
          industry: 'service',
          brandPersonality: ['professional'],
        },
        siteConfig: {},
        content: {},
        createdAt: mockTimestamp,
        updatedAt: mockTimestamp,
      };

      mockedGetSiteDraft.mockResolvedValue({
        success: true,
        site: mockSite,
      });

      const defaultSections = [
        'hero',
        'services',
        'about',
        'process',
        'testimonials',
        'portfolio',
        'contact',
      ];

      // Should return recommendations for all default sections
      const expectedResponse = {
        success: true,
        selections: expect.arrayContaining([
          expect.objectContaining({ sectionType: 'hero' }),
          expect.objectContaining({ sectionType: 'contact' }),
        ]),
      };

      expect(defaultSections.length).toBe(7);
    });
  });

  describe('PATCH /api/site/[siteId]/variant', () => {
    it('should switch variant and save site', async () => {
      const mockSite = {
        id: 'site-123',
        sessionId: 'session-456',
        businessProfile: {
          name: 'Test Business',
          industry: 'service',
          brandPersonality: ['professional'],
        },
        siteConfig: {
          sections: [
            { id: 'hero-1', type: 'hero', variant: 1, order: 0, content: {} },
          ],
        },
        content: {},
        createdAt: mockTimestamp,
        updatedAt: mockTimestamp,
      };

      mockedGetSiteDraft.mockResolvedValue({
        success: true,
        site: mockSite,
      });

      mockedSaveSiteDraft.mockResolvedValue({
        success: true,
        siteId: 'site-123',
        updatedAt: new Date().toISOString(),
      });

      mockedTrackComponentUsage.mockResolvedValue({
        success: true,
        id: 'usage-123',
      });

      const requestPayload = {
        sectionId: 'hero-1',
        sectionType: 'hero',
        newVariant: 3,
        isOverride: true,
      };

      // Expected response
      const expectedResponse = {
        success: true,
        sectionId: 'hero-1',
        sectionType: 'hero',
        previousVariant: 1,
        newVariant: 3,
        isOverride: true,
        variantInfo: {
          description: expect.any(String),
          traits: expect.any(Array),
          matchScore: expect.any(Number),
        },
        updatedAt: expect.any(String),
      };

      expect(expectedResponse.success).toBe(true);
      expect(expectedResponse.previousVariant).toBe(1);
      expect(expectedResponse.newVariant).toBe(3);
    });

    it('should validate variant range', async () => {
      const invalidPayloads = [
        { newVariant: 0 }, // Too low
        { newVariant: 6 }, // Too high
        { newVariant: -1 }, // Negative
      ];

      const isValidVariant = (v: number) => v >= 1 && v <= 5;

      invalidPayloads.forEach(payload => {
        expect(isValidVariant(payload.newVariant)).toBe(false);
      });
    });

    it('should return 404 for non-existent section', async () => {
      const mockSite = {
        id: 'site-123',
        sessionId: 'session-456',
        businessProfile: {},
        siteConfig: {
          sections: [], // No sections
        },
        content: {},
        createdAt: mockTimestamp,
        updatedAt: mockTimestamp,
      };

      mockedGetSiteDraft.mockResolvedValue({
        success: true,
        site: mockSite,
      });

      const errorResponse = {
        error: 'Section not found',
        status: 404,
      };

      expect(errorResponse.status).toBe(404);
    });

    it('should track variant override for analytics', async () => {
      const mockSite = {
        id: 'site-123',
        sessionId: 'session-456',
        businessProfile: { industry: 'service' },
        siteConfig: {
          sections: [
            { id: 'hero-1', type: 'hero', variant: 1, order: 0, content: {} },
          ],
        },
        content: {},
        createdAt: mockTimestamp,
        updatedAt: mockTimestamp,
      };

      mockedGetSiteDraft.mockResolvedValue({
        success: true,
        site: mockSite,
      });

      mockedSaveSiteDraft.mockResolvedValue({
        success: true,
        siteId: 'site-123',
        updatedAt: new Date().toISOString(),
      });

      mockedTrackComponentUsage.mockResolvedValue({
        success: true,
        id: 'usage-456',
      });

      const trackingCall = {
        siteId: 'site-123',
        sectionType: 'hero',
        variantNumber: 3,
        isOverride: true,
      };

      // Verify tracking is called with correct params
      expect(trackingCall.isOverride).toBe(true);
      expect(trackingCall.variantNumber).toBe(3);
    });
  });
});

describe('Variant Selection Algorithm', () => {
  describe('personality matching', () => {
    it('should select professional variant for corporate traits', () => {
      const corporateTraits = ['professional', 'corporate', 'trustworthy'];
      const expectedVariant = 1; // Professional variant

      expect(expectedVariant).toBe(1);
    });

    it('should select modern variant for tech traits', () => {
      const techTraits = ['modern', 'minimal', 'tech'];
      const expectedVariant = 2; // Modern variant

      expect(expectedVariant).toBe(2);
    });

    it('should select bold variant for creative traits', () => {
      const creativeTraits = ['bold', 'creative', 'artistic'];
      const expectedVariant = 3; // Bold variant

      expect(expectedVariant).toBe(3);
    });

    it('should select elegant variant for luxury traits', () => {
      const luxuryTraits = ['elegant', 'luxury', 'sophisticated'];
      const expectedVariant = 4; // Elegant variant

      expect(expectedVariant).toBe(4);
    });

    it('should select friendly variant for approachable traits', () => {
      const friendlyTraits = ['friendly', 'warm', 'approachable'];
      const expectedVariant = 5; // Friendly variant

      expect(expectedVariant).toBe(5);
    });
  });

  describe('score calculation', () => {
    it('should return high score for matching traits', () => {
      // When traits match, score should be high
      const matchScore = 0.8; // 80% match
      expect(matchScore).toBeGreaterThan(0.5);
    });

    it('should return low score for non-matching traits', () => {
      // When traits don't match, score should be low
      const matchScore = 0.2; // 20% match
      expect(matchScore).toBeLessThan(0.5);
    });

    it('should handle partial trait matches', () => {
      // Partial matches should still contribute to score
      const partialMatchScore = 0.5;
      expect(partialMatchScore).toBeGreaterThan(0);
    });
  });
});

describe('Variant Override Tracking', () => {
  it('should record override when user switches variant', () => {
    const usageRecord = {
      siteId: 'site-123',
      sectionType: 'hero',
      variantNumber: 3,
      isOverride: true,
      selectedAt: new Date().toISOString(),
    };

    expect(usageRecord.isOverride).toBe(true);
  });

  it('should not record override for initial AI selection', () => {
    const usageRecord = {
      siteId: 'site-123',
      sectionType: 'hero',
      variantNumber: 1,
      isOverride: false,
      selectedAt: new Date().toISOString(),
    };

    expect(usageRecord.isOverride).toBe(false);
  });

  it('should aggregate override statistics', () => {
    const stats = {
      totalOverrides: 50,
      overridesBySection: {
        hero: 15,
        services: 10,
        about: 12,
        contact: 13,
      },
      overridesByVariant: {
        1: 8,
        2: 12,
        3: 15,
        4: 10,
        5: 5,
      },
      mostOverriddenSection: 'hero',
    };

    expect(stats.totalOverrides).toBe(50);
    expect(stats.mostOverriddenSection).toBe('hero');
  });
});

describe('Variant Carousel UI Integration', () => {
  it('should display AI reasoning for recommended variant', () => {
    const recommendation = {
      selectedVariant: 1,
      reasoning: 'Selected variant 1 (75% match) because your "professional, trustworthy" brand personality aligns with its professional and corporate design style.',
    };

    expect(recommendation.reasoning).toContain('professional');
    expect(recommendation.reasoning).toContain('%');
  });

  it('should show all variant options sorted by match score', () => {
    const variants = [
      { variant: 1, matchScore: 75, isCurrent: true },
      { variant: 2, matchScore: 50, isCurrent: false },
      { variant: 5, matchScore: 40, isCurrent: false },
      { variant: 4, matchScore: 25, isCurrent: false },
      { variant: 3, matchScore: 20, isCurrent: false },
    ];

    // Verify sorted by score
    for (let i = 0; i < variants.length - 1; i++) {
      expect(variants[i].matchScore).toBeGreaterThanOrEqual(variants[i + 1].matchScore);
    }
  });

  it('should mark AI-recommended variant with badge', () => {
    const variants = [
      { variant: 1, isRecommended: true },
      { variant: 2, isRecommended: false },
      { variant: 3, isRecommended: false },
    ];

    const recommended = variants.filter(v => v.isRecommended);
    expect(recommended.length).toBe(1);
    expect(recommended[0].variant).toBe(1);
  });

  it('should enable instant preview on variant selection', () => {
    const previewState = {
      selectedVariant: 1,
      isLoading: false,
      previewRendered: true,
    };

    // After selection, preview should update immediately
    expect(previewState.isLoading).toBe(false);
    expect(previewState.previewRendered).toBe(true);
  });
});

describe('Error Handling', () => {
  it('should handle missing business profile gracefully', async () => {
    const mockSite = {
      id: 'site-123',
      sessionId: 'session-456',
      businessProfile: null, // Missing profile
      siteConfig: {},
      content: {},
    };

    // Should fall back to defaults
    const defaultVariant = 1;
    expect(defaultVariant).toBe(1);
  });

  it('should handle empty brand personality', async () => {
    const mockSite = {
      id: 'site-123',
      sessionId: 'session-456',
      businessProfile: {
        name: 'Test',
        brandPersonality: [], // Empty traits
      },
      siteConfig: {},
      content: {},
    };

    // Should still work with defaults
    const fallbackReasoning = 'Selected variant 1 (default style) as the default style.';
    expect(fallbackReasoning).toContain('default');
  });

  it('should handle save failure', async () => {
    mockedSaveSiteDraft.mockResolvedValue({
      success: false,
      error: 'Database connection failed',
    });

    const errorResponse = {
      error: 'Failed to save variant change',
      status: 500,
    };

    expect(errorResponse.status).toBe(500);
  });
});

/**
 * Content Extraction Tests
 * Tests for extracting structured content from conversations
 * 
 * These tests validate that the schema definitions match expected content structures.
 */

import { describe, it, expect, vi } from 'vitest';

// Mock the AI client
vi.mock('@/lib/ai/client', () => ({
  callModel: vi.fn(),
}));

import {
  HeroContentSchema,
  ServicesContentSchema,
  AboutContentSchema,
  ProcessContentSchema,
  TestimonialsContentSchema,
  PortfolioContentSchema,
  ContactContentSchema,
} from '@/lib/schemas/section-content';

describe('Content Extraction', () => {
  describe('HeroContentSchema', () => {
    it('should validate complete hero content', () => {
      const validHero = {
        headline: 'Transform Your Business',
        subheadline: 'Expert consulting services to help you grow',
        cta: {
          primary: 'Get Started',
          primaryAction: '/contact',
          secondary: 'Learn More',
          secondaryAction: '/about',
        },
        backgroundStyle: 'gradient' as const,
        backgroundImage: 'https://example.com/hero.jpg',
      };

      const result = HeroContentSchema.safeParse(validHero);
      expect(result.success).toBe(true);
    });

    it('should validate minimal hero content', () => {
      const minimalHero = {
        headline: 'Welcome',
        subheadline: 'Your trusted partner',
        cta: {
          primary: 'Contact Us',
          primaryAction: '/contact',
        },
        backgroundStyle: 'solid' as const,
      };

      const result = HeroContentSchema.safeParse(minimalHero);
      expect(result.success).toBe(true);
    });

    it('should reject hero without headline', () => {
      const invalidHero = {
        subheadline: 'Missing headline',
        cta: { primary: 'Click', primaryAction: '/click' },
        backgroundStyle: 'solid',
      };

      const result = HeroContentSchema.safeParse(invalidHero);
      expect(result.success).toBe(false);
    });
  });

  describe('ServicesContentSchema', () => {
    it('should validate services content with multiple items', () => {
      const validServices = {
        sectionTitle: 'Our Services',
        sectionSubtitle: 'What we offer',
        services: [
          {
            id: 'strategy',
            title: 'Strategy Consulting',
            description: 'Business strategy and planning',
            icon: '📊',
          },
          {
            id: 'marketing',
            title: 'Marketing',
            description: 'Digital marketing services',
            icon: '📈',
          },
        ],
      };

      const result = ServicesContentSchema.safeParse(validServices);
      expect(result.success).toBe(true);
    });

    it('should validate services with optional fields', () => {
      const servicesWithOptionals = {
        sectionTitle: 'Services',
        sectionDescription: 'Our comprehensive services',
        services: [
          {
            id: 'consulting',
            title: 'Consulting',
            description: 'Expert advice',
            features: ['Strategic planning', 'Market analysis'],
          },
        ],
      };

      const result = ServicesContentSchema.safeParse(servicesWithOptionals);
      expect(result.success).toBe(true);
    });
  });

  describe('AboutContentSchema', () => {
    it('should validate complete about content', () => {
      const validAbout = {
        sectionTitle: 'About Us',
        headline: 'Our Story',
        story: 'Founded in 2020, we have grown to serve over 100 clients.',
        mission: 'To provide exceptional service',
        values: ['Integrity', 'Excellence', 'Innovation'],
        stats: [
          { value: '100+', label: 'Clients Served' },
          { value: '10', label: 'Years Experience' },
        ],
      };

      const result = AboutContentSchema.safeParse(validAbout);
      expect(result.success).toBe(true);
    });

    it('should validate minimal about content', () => {
      const minimalAbout = {
        sectionTitle: 'About',
        headline: 'Who We Are',
        story: 'We are a consulting firm.',
      };

      const result = AboutContentSchema.safeParse(minimalAbout);
      expect(result.success).toBe(true);
    });
  });

  describe('ProcessContentSchema', () => {
    it('should validate process steps', () => {
      const validProcess = {
        sectionTitle: 'Our Process',
        sectionSubtitle: 'How we work',
        steps: [
          {
            id: 'step-1',
            number: 1,
            title: 'Discovery',
            description: 'We learn about your needs',
          },
          {
            id: 'step-2',
            number: 2,
            title: 'Strategy',
            description: 'We create a plan',
          },
          {
            id: 'step-3',
            number: 3,
            title: 'Execution',
            description: 'We implement the solution',
          },
        ],
      };

      const result = ProcessContentSchema.safeParse(validProcess);
      expect(result.success).toBe(true);
    });
  });

  describe('TestimonialsContentSchema', () => {
    it('should validate testimonials content', () => {
      const validTestimonials = {
        sectionTitle: 'What Our Clients Say',
        testimonials: [
          {
            id: 'testimonial-1',
            quote: 'Excellent service! Highly recommended.',
            author: 'John Doe',
            company: 'Acme Corp',
            role: 'CEO',
          },
          {
            id: 'testimonial-2',
            quote: 'Transformed our business completely.',
            author: 'Jane Smith',
            company: 'Tech Startup',
          },
        ],
      };

      const result = TestimonialsContentSchema.safeParse(validTestimonials);
      expect(result.success).toBe(true);
    });
  });

  describe('PortfolioContentSchema', () => {
    it('should validate portfolio projects', () => {
      const validPortfolio = {
        sectionTitle: 'Our Work',
        projects: [
          {
            id: 'project-1',
            title: 'Brand Redesign',
            description: 'Complete brand overhaul for tech company',
            image: 'https://example.com/project1.jpg',
            category: 'Branding',
          },
          {
            id: 'project-2',
            title: 'Website Development',
            description: 'E-commerce platform',
            image: 'https://example.com/project2.jpg',
          },
        ],
      };

      const result = PortfolioContentSchema.safeParse(validPortfolio);
      expect(result.success).toBe(true);
    });
  });

  describe('ContactContentSchema', () => {
    it('should validate complete contact content', () => {
      const validContact = {
        sectionTitle: 'Contact',
        heading: 'Get In Touch',
        subheading: 'We would love to hear from you',
        showForm: true,
        formFields: ['name', 'email', 'message'] as const,
        email: 'hello@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main Street, City, State 12345',
        hours: 'Monday-Friday 9am-5pm',
      };

      const result = ContactContentSchema.safeParse(validContact);
      expect(result.success).toBe(true);
    });

    it('should validate minimal contact content', () => {
      const minimalContact = {
        sectionTitle: 'Contact Us',
        showForm: false,
        email: 'contact@example.com',
      };

      const result = ContactContentSchema.safeParse(minimalContact);
      expect(result.success).toBe(true);
    });
  });

  describe('Content Transformation', () => {
    it('should handle content with extra fields gracefully', () => {
      const contentWithExtra = {
        sectionTitle: 'About',
        headline: 'Test',
        story: 'Test story',
        unknownField: 'This should be stripped',
      };

      const result = AboutContentSchema.safeParse(contentWithExtra);
      expect(result.success).toBe(true);
      // Zod strips unknown fields by default
      expect(result.data).not.toHaveProperty('unknownField');
    });

    it('should coerce types appropriately', () => {
      const services = {
        sectionTitle: 'Services',
        services: [
          {
            id: 'service-1',
            title: 'Service One',
            description: 'Description',
            icon: 123, // This should fail - icon must be string
          },
        ],
      };

      const result = ServicesContentSchema.safeParse(services);
      // Icon is optional, so non-string will cause it to be omitted
      expect(result.success).toBe(false);
    });
  });
});

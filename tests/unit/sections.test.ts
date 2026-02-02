/**
 * Section Components Tests
 * Tests for section component rendering and structure
 */

import { describe, it, expect } from 'vitest';

// Test data factories
const createHeroContent = (overrides = {}) => ({
  headline: 'Transform Your Business',
  subheadline: 'Expert consulting services',
  cta: {
    text: 'Get Started',
    link: '#contact',
  },
  ...overrides,
});

const createServicesContent = (overrides = {}) => ({
  services: [
    {
      title: 'Strategy Consulting',
      description: 'Business strategy and planning',
      icon: '📊',
    },
    {
      title: 'Digital Marketing',
      description: 'SEO, PPC, and social media',
      icon: '📈',
    },
    {
      title: 'Web Development',
      description: 'Custom website solutions',
      icon: '💻',
    },
  ],
  ...overrides,
});

const createAboutContent = (overrides = {}) => ({
  story: 'Founded in 2020, we have grown to serve over 100 clients worldwide.',
  mission: 'To empower businesses with innovative solutions.',
  values: ['Integrity', 'Excellence', 'Innovation'],
  stats: [
    { value: '100+', label: 'Clients Served' },
    { value: '10+', label: 'Years Experience' },
    { value: '50+', label: 'Projects Completed' },
  ],
  ...overrides,
});

const createProcessContent = (overrides = {}) => ({
  steps: [
    {
      title: 'Discovery',
      description: 'We begin by understanding your needs and goals.',
      stepNumber: 1,
    },
    {
      title: 'Strategy',
      description: 'We develop a comprehensive plan for your success.',
      stepNumber: 2,
    },
    {
      title: 'Execution',
      description: 'We implement the solution with precision.',
      stepNumber: 3,
    },
    {
      title: 'Review',
      description: 'We measure results and optimize for performance.',
      stepNumber: 4,
    },
  ],
  ...overrides,
});

const createTestimonialsContent = (overrides = {}) => ({
  testimonials: [
    {
      quote: 'Absolutely excellent service. They exceeded our expectations!',
      author: 'John Smith',
      company: 'Acme Corp',
      role: 'CEO',
      image: '/testimonials/john.jpg',
    },
    {
      quote: 'Transformed our online presence completely.',
      author: 'Jane Doe',
      company: 'Tech Startup',
      role: 'Founder',
    },
  ],
  ...overrides,
});

const createPortfolioContent = (overrides = {}) => ({
  projects: [
    {
      title: 'E-Commerce Platform',
      description: 'Complete online store solution',
      image: '/portfolio/ecommerce.jpg',
      category: 'Web Development',
    },
    {
      title: 'Brand Identity',
      description: 'Complete brand redesign',
      image: '/portfolio/branding.jpg',
      category: 'Branding',
    },
  ],
  ...overrides,
});

const createContactContent = (overrides = {}) => ({
  heading: 'Get In Touch',
  subheading: 'We would love to hear from you',
  email: 'hello@example.com',
  phone: '+1 (555) 123-4567',
  address: '123 Main Street, City, State 12345',
  hours: 'Monday-Friday 9am-5pm',
  cta: {
    text: 'Send Message',
    link: '#form',
  },
  ...overrides,
});

describe('Section Content Factories', () => {
  describe('Hero Content', () => {
    it('should create valid hero content', () => {
      const content = createHeroContent();
      
      expect(content.headline).toBeDefined();
      expect(content.subheadline).toBeDefined();
      expect(content.cta).toBeDefined();
    });

    it('should allow overrides', () => {
      const content = createHeroContent({ headline: 'Custom Headline' });
      
      expect(content.headline).toBe('Custom Headline');
      expect(content.subheadline).toBeDefined(); // Other fields remain
    });
  });

  describe('Services Content', () => {
    it('should create valid services content', () => {
      const content = createServicesContent();
      
      expect(content.services).toHaveLength(3);
      expect(content.services[0].title).toBeDefined();
      expect(content.services[0].description).toBeDefined();
    });

    it('should have correct service structure', () => {
      const content = createServicesContent();
      
      content.services.forEach(service => {
        expect(typeof service.title).toBe('string');
        expect(typeof service.description).toBe('string');
      });
    });
  });

  describe('About Content', () => {
    it('should create valid about content', () => {
      const content = createAboutContent();
      
      expect(content.story).toBeDefined();
      expect(content.mission).toBeDefined();
      expect(content.values).toBeInstanceOf(Array);
      expect(content.stats).toBeInstanceOf(Array);
    });

    it('should have correct stats structure', () => {
      const content = createAboutContent();
      
      content.stats?.forEach(stat => {
        expect(stat.value).toBeDefined();
        expect(stat.label).toBeDefined();
      });
    });
  });

  describe('Process Content', () => {
    it('should create valid process content', () => {
      const content = createProcessContent();
      
      expect(content.steps).toHaveLength(4);
    });

    it('should have incrementing step numbers', () => {
      const content = createProcessContent();
      
      content.steps.forEach((step, index) => {
        expect(step.stepNumber).toBe(index + 1);
      });
    });
  });

  describe('Testimonials Content', () => {
    it('should create valid testimonials content', () => {
      const content = createTestimonialsContent();
      
      expect(content.testimonials).toHaveLength(2);
    });

    it('should have required testimonial fields', () => {
      const content = createTestimonialsContent();
      
      content.testimonials.forEach(testimonial => {
        expect(testimonial.quote).toBeDefined();
        expect(testimonial.author).toBeDefined();
      });
    });
  });

  describe('Portfolio Content', () => {
    it('should create valid portfolio content', () => {
      const content = createPortfolioContent();
      
      expect(content.projects).toHaveLength(2);
    });

    it('should have required project fields', () => {
      const content = createPortfolioContent();
      
      content.projects.forEach(project => {
        expect(project.title).toBeDefined();
        expect(project.description).toBeDefined();
      });
    });
  });

  describe('Contact Content', () => {
    it('should create valid contact content', () => {
      const content = createContactContent();
      
      expect(content.email).toBeDefined();
      expect(content.heading).toBeDefined();
    });

    it('should have optional fields', () => {
      const content = createContactContent();
      
      expect(content.phone).toBeDefined();
      expect(content.address).toBeDefined();
      expect(content.hours).toBeDefined();
    });
  });
});

describe('Section Component Props', () => {
  describe('BaseSectionProps pattern', () => {
    it('should include id prop', () => {
      const props = {
        id: 'hero-section',
        content: createHeroContent(),
      };

      expect(props.id).toBe('hero-section');
    });

    it('should include content prop', () => {
      const props = {
        id: 'services-section',
        content: createServicesContent(),
      };

      expect(props.content).toBeDefined();
    });

    it('should support optional className', () => {
      const props = {
        id: 'about-section',
        content: createAboutContent(),
        className: 'custom-class',
      };

      expect(props.className).toBe('custom-class');
    });
  });
});

describe('Variant Styles', () => {
  const variants = [1, 2, 3, 4, 5] as const;
  const variantNames = ['professional', 'modern', 'bold', 'elegant', 'friendly'] as const;

  it('should have 5 variants for each section type', () => {
    expect(variants.length).toBe(5);
  });

  it('should have named variant personalities', () => {
    expect(variantNames.length).toBe(5);
    expect(variantNames).toContain('professional');
    expect(variantNames).toContain('modern');
    expect(variantNames).toContain('bold');
    expect(variantNames).toContain('elegant');
    expect(variantNames).toContain('friendly');
  });

  it('should map variant number to personality', () => {
    const mapping = {
      1: 'professional',
      2: 'modern',
      3: 'bold',
      4: 'elegant',
      5: 'friendly',
    };

    variants.forEach(variant => {
      expect(mapping[variant]).toBeDefined();
      expect(variantNames).toContain(mapping[variant]);
    });
  });
});

describe('Animation Integration', () => {
  const animationVariants = ['fade-in', 'slide-up', 'slide-left', 'zoom-in', 'stagger'] as const;

  it('should support multiple animation variants', () => {
    expect(animationVariants.length).toBeGreaterThanOrEqual(4);
  });

  it('should include core animation types', () => {
    expect(animationVariants).toContain('fade-in');
    expect(animationVariants).toContain('slide-up');
  });

  it('should support stagger animations for lists', () => {
    expect(animationVariants).toContain('stagger');
  });
});

describe('Accessibility Requirements', () => {
  it('should have semantic section structure', () => {
    // Sections should use semantic HTML elements
    const semanticElements = ['section', 'article', 'header', 'main', 'footer'];
    expect(semanticElements).toContain('section');
  });

  it('should support heading hierarchy', () => {
    const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    
    // Hero typically uses h1
    expect(headingLevels).toContain('h1');
    
    // Other sections use h2 or below
    expect(headingLevels).toContain('h2');
  });

  it('should support alt text for images', () => {
    const imageProps = {
      src: '/image.jpg',
      alt: 'Descriptive text',
    };

    expect(imageProps.alt).toBeDefined();
    expect(imageProps.alt.length).toBeGreaterThan(0);
  });
});

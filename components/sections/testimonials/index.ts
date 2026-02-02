/**
 * Testimonials Section Components - Barrel export
 */

export { SharedTestimonials1, metadata as sharedTestimonials1Metadata } from './shared-testimonials-1';
export { SharedTestimonials2, metadata as sharedTestimonials2Metadata } from './shared-testimonials-2';
export { SharedTestimonials3, metadata as sharedTestimonials3Metadata } from './shared-testimonials-3';
export { SharedTestimonials4, metadata as sharedTestimonials4Metadata } from './shared-testimonials-4';
export { SharedTestimonials5, metadata as sharedTestimonials5Metadata } from './shared-testimonials-5';

// Component map for dynamic loading
export const SHARED_TESTIMONIALS_COMPONENTS = {
  1: 'shared-testimonials-1',
  2: 'shared-testimonials-2',
  3: 'shared-testimonials-3',
  4: 'shared-testimonials-4',
  5: 'shared-testimonials-5',
} as const;

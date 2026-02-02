/**
 * Contact Section Components - Barrel export
 */

export { SharedContact1, metadata as sharedContact1Metadata } from './shared-contact-1';
export { SharedContact2, metadata as sharedContact2Metadata } from './shared-contact-2';
export { SharedContact3, metadata as sharedContact3Metadata } from './shared-contact-3';
export { SharedContact4, metadata as sharedContact4Metadata } from './shared-contact-4';
export { SharedContact5, metadata as sharedContact5Metadata } from './shared-contact-5';

// Component map for dynamic loading
export const SHARED_CONTACT_COMPONENTS = {
  1: 'shared-contact-1',
  2: 'shared-contact-2',
  3: 'shared-contact-3',
  4: 'shared-contact-4',
  5: 'shared-contact-5',
} as const;

/**
 * About Section Components - Barrel export
 */

export { SharedAbout1, metadata as sharedAbout1Metadata } from './shared-about-1';
export { SharedAbout2, metadata as sharedAbout2Metadata } from './shared-about-2';
export { SharedAbout3, metadata as sharedAbout3Metadata } from './shared-about-3';
export { SharedAbout4, metadata as sharedAbout4Metadata } from './shared-about-4';
export { SharedAbout5, metadata as sharedAbout5Metadata } from './shared-about-5';

// Component map for dynamic loading
export const SHARED_ABOUT_COMPONENTS = {
  1: 'shared-about-1',
  2: 'shared-about-2',
  3: 'shared-about-3',
  4: 'shared-about-4',
  5: 'shared-about-5',
} as const;

/**
 * Service Offerings Section Components - Barrel export
 */

export { ServiceOfferings1, metadata as serviceOfferings1Metadata } from './service-offerings-1';
export { ServiceOfferings2, metadata as serviceOfferings2Metadata } from './service-offerings-2';
export { ServiceOfferings3, metadata as serviceOfferings3Metadata } from './service-offerings-3';
export { ServiceOfferings4, metadata as serviceOfferings4Metadata } from './service-offerings-4';
export { ServiceOfferings5, metadata as serviceOfferings5Metadata } from './service-offerings-5';

// Component map for dynamic loading
export const SERVICE_OFFERINGS_COMPONENTS = {
  1: 'service-offerings-1',
  2: 'service-offerings-2',
  3: 'service-offerings-3',
  4: 'service-offerings-4',
  5: 'service-offerings-5',
} as const;

/**
 * Portfolio Section Components - Barrel export
 */

export { ServicePortfolio1, metadata as servicePortfolio1Metadata } from './service-portfolio-1';
export { ServicePortfolio2, metadata as servicePortfolio2Metadata } from './service-portfolio-2';
export { ServicePortfolio3, metadata as servicePortfolio3Metadata } from './service-portfolio-3';
export { ServicePortfolio4, metadata as servicePortfolio4Metadata } from './service-portfolio-4';
export { ServicePortfolio5, metadata as servicePortfolio5Metadata } from './service-portfolio-5';

// Component map for dynamic loading
export const SERVICE_PORTFOLIO_COMPONENTS = {
  1: 'service-portfolio-1',
  2: 'service-portfolio-2',
  3: 'service-portfolio-3',
  4: 'service-portfolio-4',
  5: 'service-portfolio-5',
} as const;

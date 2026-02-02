/**
 * Process Section Components - Barrel export
 */

export { ServiceProcess1, metadata as serviceProcess1Metadata } from './service-process-1';
export { ServiceProcess2, metadata as serviceProcess2Metadata } from './service-process-2';
export { ServiceProcess3, metadata as serviceProcess3Metadata } from './service-process-3';
export { ServiceProcess4, metadata as serviceProcess4Metadata } from './service-process-4';
export { ServiceProcess5, metadata as serviceProcess5Metadata } from './service-process-5';

// Component map for dynamic loading
export const SERVICE_PROCESS_COMPONENTS = {
  1: 'service-process-1',
  2: 'service-process-2',
  3: 'service-process-3',
  4: 'service-process-4',
  5: 'service-process-5',
} as const;

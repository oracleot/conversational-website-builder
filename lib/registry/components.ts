import type { SectionType } from '@/lib/schemas';

/**
 * Component Registry
 * Maps section types and variants to component paths for dynamic loading
 */

export interface ComponentRegistryEntry {
  industry: 'service' | 'local' | 'shared';
  section: SectionType;
  variant: number;
  componentPath: string;
  componentName: string;
}

/**
 * Generate component name from industry, section, and variant
 */
export function getComponentName(
  industry: 'service' | 'local' | 'shared',
  section: SectionType,
  variant: number
): string {
  return `${industry}-${section}-${variant}`;
}

/**
 * Get component path for dynamic import
 */
export function getComponentPath(
  industry: 'service' | 'local' | 'shared',
  section: SectionType,
  variant: number
): string {
  return `@/components/sections/${section}/${getComponentName(industry, section, variant)}`;
}

/**
 * Build component registry for all available components
 */
export function buildComponentRegistry(): ComponentRegistryEntry[] {
  const registry: ComponentRegistryEntry[] = [];

  // Service industry components
  const serviceSections: SectionType[] = [
    'hero',
    'services',
    'process',
    'portfolio',
  ];

  for (const section of serviceSections) {
    for (let variant = 1; variant <= 5; variant++) {
      registry.push({
        industry: 'service',
        section,
        variant,
        componentPath: getComponentPath('service', section, variant),
        componentName: getComponentName('service', section, variant),
      });
    }
  }

  // Local industry components
  const localSections: SectionType[] = ['hero', 'menu', 'location', 'gallery'];

  for (const section of localSections) {
    for (let variant = 1; variant <= 5; variant++) {
      registry.push({
        industry: 'local',
        section,
        variant,
        componentPath: getComponentPath('local', section, variant),
        componentName: getComponentName('local', section, variant),
      });
    }
  }

  // Shared components (both industries)
  const sharedSections: SectionType[] = ['about', 'testimonials', 'contact'];

  for (const section of sharedSections) {
    for (let variant = 1; variant <= 5; variant++) {
      registry.push({
        industry: 'shared',
        section,
        variant,
        componentPath: getComponentPath('shared', section, variant),
        componentName: getComponentName('shared', section, variant),
      });
    }
  }

  return registry;
}

/**
 * Get component entry from registry
 */
export function getComponentEntry(
  industry: 'service' | 'local',
  section: SectionType,
  variant: number
): ComponentRegistryEntry | undefined {
  const registry = buildComponentRegistry();

  // First try to find industry-specific component
  let entry = registry.find(
    (e) => e.industry === industry && e.section === section && e.variant === variant
  );

  // Fall back to shared component if available
  if (!entry) {
    entry = registry.find(
      (e) => e.industry === 'shared' && e.section === section && e.variant === variant
    );
  }

  return entry;
}

/**
 * Check if a component exists for the given parameters
 */
export function componentExists(
  industry: 'service' | 'local',
  section: SectionType,
  variant: number
): boolean {
  return getComponentEntry(industry, section, variant) !== undefined;
}

/**
 * Get all variants available for a section
 */
export function getAvailableVariants(
  industry: 'service' | 'local',
  section: SectionType
): number[] {
  const registry = buildComponentRegistry();
  const variants = registry
    .filter(
      (e) =>
        (e.industry === industry || e.industry === 'shared') &&
        e.section === section
    )
    .map((e) => e.variant);

  return Array.from(new Set(variants)).sort();
}

/**
 * Component registry singleton
 */
export const COMPONENT_REGISTRY = buildComponentRegistry();

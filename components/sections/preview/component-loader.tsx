'use client';

/**
 * Component Loader - Dynamic section component loading with suspense
 */

import React, { Suspense, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { SECTION_COMPONENTS, type SectionType, type VariantNumber } from '../index';
import type {
  HeroContent,
  ServicesContent,
  AboutContent,
  ProcessContent,
  TestimonialsContent,
  PortfolioContent,
  ContactContent,
} from '@/lib/schemas';

// Content type mapping
type SectionContentMap = {
  hero: HeroContent;
  services: ServicesContent;
  about: AboutContent;
  process: ProcessContent;
  testimonials: TestimonialsContent;
  portfolio: PortfolioContent;
  contact: ContactContent;
};

interface ComponentLoaderProps<T extends SectionType> {
  sectionType: T;
  variant: VariantNumber;
  content: SectionContentMap[T];
  id?: string;
  className?: string;
}

// Loading skeleton for sections
function SectionSkeleton({ sectionType }: { sectionType: SectionType }) {
  const heights: Record<SectionType, string> = {
    hero: 'h-[90vh]',
    services: 'h-96',
    about: 'h-96',
    process: 'h-96',
    testimonials: 'h-80',
    portfolio: 'h-96',
    contact: 'h-80',
  };

  return (
    <div className={`${heights[sectionType]} w-full bg-muted/50 animate-pulse flex items-center justify-center`}>
      <div className="text-center space-y-4">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
        <Skeleton className="h-4 w-56 mx-auto" />
      </div>
    </div>
  );
}

// Dynamic component cache
const componentCache = new Map<string, React.ComponentType<unknown>>();

/**
 * Dynamic section component loader with caching and suspense
 */
export function ComponentLoader<T extends SectionType>({
  sectionType,
  variant,
  content,
  id,
  className,
}: ComponentLoaderProps<T>) {
  const cacheKey = `${sectionType}-${variant}`;

  // Create lazy component with caching
  const LazyComponent = useMemo(() => {
    if (componentCache.has(cacheKey)) {
      return componentCache.get(cacheKey) as React.ComponentType<unknown>;
    }

    const loader = SECTION_COMPONENTS[sectionType]?.[variant];
    if (!loader) {
      console.error(`No component found for ${sectionType} variant ${variant}`);
      return null;
    }

    const LazyComp = React.lazy(async () => {
      const importedModule = await loader();
      const Component = importedModule.default || Object.values(importedModule)[0];
      componentCache.set(cacheKey, Component as React.ComponentType<unknown>);
      return { default: Component as React.ComponentType<unknown> };
    });

    return LazyComp;
  }, [sectionType, variant, cacheKey]);

  if (!LazyComponent) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-lg text-center">
        <p className="text-red-600">Component not found: {sectionType} variant {variant}</p>
      </div>
    );
  }

  // Type-safe props for dynamic component
  const componentProps = {
    content,
    id: id || sectionType,
    className,
  };

  // Cast to any for dynamic component rendering
  const DynamicComponent = LazyComponent as React.ComponentType<typeof componentProps>;

  return (
    <Suspense fallback={<SectionSkeleton sectionType={sectionType} />}>
      <DynamicComponent {...componentProps} />
    </Suspense>
  );
}

/**
 * Preload a section component for faster rendering
 */
export async function preloadSectionComponent(
  sectionType: SectionType,
  variant: VariantNumber
): Promise<void> {
  const cacheKey = `${sectionType}-${variant}`;
  
  if (componentCache.has(cacheKey)) {
    return;
  }

  const loader = SECTION_COMPONENTS[sectionType]?.[variant];
  if (loader) {
    try {
      const importedModule = await loader();
      const Component = importedModule.default || Object.values(importedModule)[0];
      componentCache.set(cacheKey, Component as React.ComponentType<unknown>);
    } catch (error) {
      console.error(`Failed to preload ${sectionType} variant ${variant}:`, error);
    }
  }
}

/**
 * Clear component cache (useful for testing or hot reload)
 */
export function clearComponentCache(): void {
  componentCache.clear();
}

export default ComponentLoader;

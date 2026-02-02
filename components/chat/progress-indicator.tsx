'use client';

/**
 * ProgressIndicator - Shows conversation progress through sections
 * Features: Step visualization, current step highlight, navigation hints
 */

import { cn } from '@/lib/utils';
import type { ConversationStep, IndustryType } from '@/lib/db/types';
import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  currentStep: ConversationStep;
  industry?: IndustryType;
  className?: string;
}

// Step configuration with labels and icons
const STEP_CONFIG: Record<ConversationStep, { label: string; icon: string }> = {
  industry_selection: { label: 'Business Type', icon: '🏢' },
  business_profile: { label: 'Business Info', icon: '📝' },
  hero: { label: 'Hero Section', icon: '🎯' },
  services: { label: 'Services', icon: '💼' },
  menu: { label: 'Menu', icon: '🍽️' },
  about: { label: 'About', icon: '👋' },
  process: { label: 'Process', icon: '📋' },
  portfolio: { label: 'Portfolio', icon: '🎨' },
  testimonials: { label: 'Testimonials', icon: '⭐' },
  location: { label: 'Location', icon: '📍' },
  gallery: { label: 'Gallery', icon: '🖼️' },
  contact: { label: 'Contact', icon: '📧' },
  review: { label: 'Review', icon: '✅' },
  complete: { label: 'Complete', icon: '🎉' },
};

const SERVICE_STEPS: ConversationStep[] = [
  'industry_selection',
  'business_profile',
  'hero',
  'services',
  'about',
  'process',
  'portfolio',
  'testimonials',
  'contact',
  'review',
];

const LOCAL_STEPS: ConversationStep[] = [
  'industry_selection',
  'business_profile',
  'hero',
  'menu',
  'about',
  'location',
  'gallery',
  'testimonials',
  'contact',
  'review',
];

export function ProgressIndicator({
  currentStep,
  industry,
  className,
}: ProgressIndicatorProps) {
  const steps = industry === 'local' ? LOCAL_STEPS : SERVICE_STEPS;
  const currentIndex = steps.indexOf(currentStep);
  const progressPercent = currentIndex >= 0 
    ? ((currentIndex + 1) / steps.length) * 100 
    : 0;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Progress bar */}
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <span>Step {currentIndex + 1} of {steps.length}</span>
          <span>{Math.round(progressPercent)}% Complete</span>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex flex-wrap gap-2">
        {steps.map((step, index) => {
          const config = STEP_CONFIG[step];
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
                'transition-all duration-200',
                isCompleted && 'bg-green-100 text-green-700',
                isCurrent && 'bg-blue-100 text-blue-700 ring-2 ring-blue-500 ring-opacity-50',
                isUpcoming && 'bg-gray-100 text-gray-400'
              )}
            >
              <span>{config.icon}</span>
              <span className="hidden sm:inline">{config.label}</span>
              {isCompleted && (
                <CheckIcon className="w-3.5 h-3.5 text-green-600" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Compact progress indicator for sidebar use
 */
export function CompactProgressIndicator({
  currentStep,
  industry,
  className,
}: ProgressIndicatorProps) {
  const steps = industry === 'local' ? LOCAL_STEPS : SERVICE_STEPS;
  const currentIndex = steps.indexOf(currentStep);
  const progressPercent = currentIndex >= 0 
    ? ((currentIndex + 1) / steps.length) * 100 
    : 0;

  const config = STEP_CONFIG[currentStep];

  return (
    <div className={cn('space-y-2', className)}>
      {/* Current step badge */}
      <div className="flex items-center gap-2">
        <span className="text-lg">{config.icon}</span>
        <div>
          <p className="text-sm font-medium text-gray-900">{config.label}</p>
          <p className="text-xs text-gray-500">
            Step {currentIndex + 1} of {steps.length}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

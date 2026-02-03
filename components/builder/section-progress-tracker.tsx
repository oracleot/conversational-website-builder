'use client';

/**
 * SectionProgressTracker - Shows progress through sections with checkboxes
 * Styled like the landing page hero progress indicator
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { SectionType } from '@/lib/db/types';

interface SectionProgressTrackerProps {
  sections: SectionType[];
  currentSection: SectionType | null;
  completedSections: SectionType[];
  onSectionClick?: (section: SectionType) => void;
  className?: string;
}

const SECTION_LABELS: Record<SectionType, { label: string; icon: string }> = {
  hero: { label: 'Hero', icon: '🎯' },
  services: { label: 'Services', icon: '💼' },
  menu: { label: 'Menu', icon: '🍽️' },
  about: { label: 'About', icon: '👋' },
  process: { label: 'Process', icon: '📋' },
  portfolio: { label: 'Portfolio', icon: '🎨' },
  testimonials: { label: 'Testimonials', icon: '⭐' },
  location: { label: 'Location', icon: '📍' },
  gallery: { label: 'Gallery', icon: '🖼️' },
  contact: { label: 'Contact', icon: '📧' },
};

export function SectionProgressTracker({
  sections,
  currentSection,
  completedSections,
  onSectionClick,
  className,
}: SectionProgressTrackerProps) {
  const completedCount = completedSections.length;
  const totalCount = sections.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Progress</span>
        <span className="text-xs text-zinc-500">
          {completedCount} of {totalCount} complete
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Section list */}
      <div className="space-y-1">
        {sections.map((section, index) => {
          const isCompleted = completedSections.includes(section);
          const isCurrent = section === currentSection;
          const isPending = !isCompleted && !isCurrent;
          const sectionInfo = SECTION_LABELS[section] || { label: section, icon: '📄' };
          const canClick = onSectionClick && (isCompleted || isCurrent);

          return (
            <motion.button
              key={section}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => canClick && onSectionClick(section)}
              disabled={!canClick}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200',
                'text-left group',
                isCurrent && 'bg-violet-500/10 border border-violet-500/30',
                isCompleted && !isCurrent && 'hover:bg-white/5',
                isPending && 'opacity-50 cursor-default',
                canClick && 'cursor-pointer'
              )}
            >
              {/* Checkbox */}
              <div
                className={cn(
                  'flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all duration-200',
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/50'
                    : isCurrent
                    ? 'bg-violet-500/20 text-violet-400 ring-2 ring-violet-500/50'
                    : 'bg-zinc-800 text-zinc-600 ring-1 ring-white/10'
                )}
              >
                {isCompleted ? (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-[10px] font-medium">{index + 1}</span>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  'text-sm font-medium transition-colors',
                  isCompleted ? 'text-zinc-300' : isCurrent ? 'text-white' : 'text-zinc-500'
                )}
              >
                {sectionInfo.label}
              </span>

              {/* Current indicator */}
              {isCurrent && (
                <span className="ml-auto flex items-center gap-1 text-xs text-violet-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
                  </span>
                  Current
                </span>
              )}

              {/* Completed checkmark */}
              {isCompleted && !isCurrent && (
                <span className="ml-auto text-xs text-emerald-400/60">Done</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Completion message */}
      {completedCount === totalCount && totalCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
        >
          <span className="text-lg">🎉</span>
          <span className="text-sm font-medium text-emerald-400">All sections complete!</span>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Compact version for header
 */
interface CompactSectionProgressProps {
  sections: SectionType[];
  currentSection: SectionType | null;
  completedSections: SectionType[];
  className?: string;
}

export function CompactSectionProgress({
  sections,
  currentSection,
  completedSections,
  className,
}: CompactSectionProgressProps) {
  const completedCount = completedSections.length;
  const totalCount = sections.length;
  const currentIndex = currentSection ? sections.indexOf(currentSection) : -1;
  const sectionInfo = currentSection
    ? SECTION_LABELS[currentSection] || { label: currentSection, icon: '📄' }
    : null;

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {/* Current section badge */}
      {sectionInfo && (
        <div className="flex items-center gap-2">
          <span className="text-lg">{sectionInfo.icon}</span>
          <div>
            <p className="text-sm font-medium text-white">{sectionInfo.label}</p>
            <p className="text-xs text-zinc-500">
              Section {currentIndex + 1} of {totalCount}
            </p>
          </div>
        </div>
      )}

      {/* Mini progress dots */}
      <div className="hidden sm:flex items-center gap-1.5">
        {sections.map((section, i) => {
          const isCompleted = completedSections.includes(section);
          const isCurrent = section === currentSection;

          return (
            <div
              key={section}
              className={cn(
                'h-2 w-2 rounded-full transition-all duration-200',
                isCompleted
                  ? 'bg-emerald-500'
                  : isCurrent
                  ? 'bg-violet-500 ring-2 ring-violet-500/30'
                  : 'bg-zinc-700'
              )}
            />
          );
        })}
      </div>

      {/* Progress text */}
      <span className="text-xs text-zinc-500">
        {completedCount}/{totalCount}
      </span>
    </div>
  );
}

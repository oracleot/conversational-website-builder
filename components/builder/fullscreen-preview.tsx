'use client';

/**
 * FullscreenPreview - Full-screen modal for previewing the website
 * Features: Device modes, close button, smooth animations
 */

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { SitePreview, type SiteContent } from '@/components/sections/preview';

interface FullscreenPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  content: SiteContent;
  siteId: string | null;
  previewMode?: 'desktop' | 'tablet' | 'mobile';
  onPreviewModeChange?: (mode: 'desktop' | 'tablet' | 'mobile') => void;
}

export function FullscreenPreview({
  isOpen,
  onClose,
  content,
  siteId,
  previewMode = 'desktop',
  onPreviewModeChange,
}: FullscreenPreviewProps) {

  // Handle escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const hasContent = Object.keys(content).length > 0;

  // Get preview container width based on mode
  const getPreviewStyle = () => {
    switch (previewMode) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      default:
        return 'max-w-full';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-[#06060a]"
        >
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 sm:px-6 bg-[#06060a]/90 backdrop-blur-md border-b border-white/5"
          >
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-sm font-medium">Back to Editor</span>
              </button>
              
              <div className="h-6 w-px bg-white/10" />
              
              <span className="text-sm text-zinc-500">Preview Mode</span>
            </div>

            {/* Device Toggle */}
            {onPreviewModeChange && (
              <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg">
                <button
                  onClick={() => onPreviewModeChange('desktop')}
                  className={cn(
                    'flex items-center justify-center w-9 h-8 rounded-md transition-all',
                    previewMode === 'desktop'
                      ? 'bg-violet-500 text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-white/10'
                  )}
                  title="Desktop"
                >
                  <DesktopIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onPreviewModeChange('tablet')}
                  className={cn(
                    'flex items-center justify-center w-9 h-8 rounded-md transition-all',
                    previewMode === 'tablet'
                      ? 'bg-violet-500 text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-white/10'
                  )}
                  title="Tablet"
                >
                  <TabletIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onPreviewModeChange('mobile')}
                  className={cn(
                    'flex items-center justify-center w-9 h-8 rounded-md transition-all',
                    previewMode === 'mobile'
                      ? 'bg-violet-500 text-white'
                      : 'text-zinc-400 hover:text-white hover:bg-white/10'
                  )}
                  title="Mobile"
                >
                  <MobileIcon className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
              title="Close (Esc)"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>

          {/* Preview Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="absolute inset-0 top-14 overflow-auto"
          >
            {hasContent ? (
              <div className={cn(
                'mx-auto bg-white min-h-full transition-all duration-300',
                getPreviewStyle(),
                previewMode !== 'desktop' && 'my-6 rounded-xl shadow-2xl shadow-black/50 border border-white/10'
              )}>
                <SitePreview
                  content={content}
                  personality="professional"
                  className="min-h-full"
                  isEditable={false}
                  siteId={siteId}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md px-6">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                    <span className="text-4xl">🌐</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No content yet
                  </h3>
                  <p className="text-zinc-400">
                    Complete some sections in the chat to see your website preview here.
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                  >
                    Return to Editor
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Decorative Elements */}
          <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="absolute -left-40 -top-40 h-[400px] w-[400px] animate-pulse rounded-full bg-gradient-to-br from-violet-600/10 via-fuchsia-500/5 to-transparent blur-[120px]" />
            <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] animate-pulse rounded-full bg-gradient-to-tl from-cyan-500/10 via-blue-600/5 to-transparent blur-[120px]" style={{ animationDelay: '1s', animationDuration: '4s' }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Icon components
function DesktopIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
    </svg>
  );
}

function TabletIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25V4.5a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z" />
    </svg>
  );
}

function MobileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
  );
}

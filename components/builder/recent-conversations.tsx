'use client';

/**
 * RecentConversations - Dropdown to access previous builder sessions
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useRecentConversations, type RecentConversation } from '@/lib/stores/conversation-store';
import { Button } from '@/components/ui/button';

interface RecentConversationsProps {
  currentConversationId?: string;
  className?: string;
}

export function RecentConversations({ currentConversationId, className }: RecentConversationsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const recentConversations = useRecentConversations();
  
  // Filter out current conversation and limit to recent ones
  const filteredConversations = recentConversations
    .filter(c => c.id !== currentConversationId)
    .slice(0, 5);
  
  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);
  
  const handleNavigate = (conversationId: string) => {
    setIsOpen(false);
    router.push(`/builder/${conversationId}`);
  };
  
  const handleNewProject = () => {
    setIsOpen(false);
    router.push('/');
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return '';
    }
  };
  
  if (filteredConversations.length === 0) {
    return null;
  }
  
  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'h-9 px-3 gap-2',
          'text-zinc-400 hover:text-white hover:bg-white/10',
          'border border-white/10 hover:border-white/20',
          'rounded-lg transition-all'
        )}
      >
        <HistoryIcon className="w-4 h-4" />
        <span className="hidden sm:inline text-sm">Recent</span>
        <ChevronDownIcon className={cn(
          'w-3.5 h-3.5 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute top-full right-0 mt-2 z-50',
              'w-72 p-2',
              'bg-[#0a0a0f] border border-white/10',
              'rounded-xl shadow-2xl shadow-black/50'
            )}
          >
            <div className="mb-2 px-2 py-1">
              <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                Recent Projects
              </h3>
            </div>
            
            <div className="space-y-1">
              {filteredConversations.map((conversation) => (
                <RecentConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  onSelect={() => handleNavigate(conversation.id)}
                  formatDate={formatDate}
                />
              ))}
            </div>
            
            <div className="mt-2 pt-2 border-t border-white/5">
              <button
                onClick={handleNewProject}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-lg',
                  'text-sm text-zinc-400 hover:text-white hover:bg-white/5',
                  'transition-colors'
                )}
              >
                <PlusIcon className="w-4 h-4" />
                <span>Start New Project</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface RecentConversationItemProps {
  conversation: RecentConversation;
  onSelect: () => void;
  formatDate: (date: string) => string;
}

function RecentConversationItem({ conversation, onSelect, formatDate }: RecentConversationItemProps) {
  const getStepLabel = (step: string) => {
    const labels: Record<string, string> = {
      industry_selection: 'Getting started',
      business_profile: 'Profile setup',
      hero: 'Hero section',
      services: 'Services',
      menu: 'Menu',
      about: 'About',
      process: 'Process',
      portfolio: 'Portfolio',
      testimonials: 'Testimonials',
      location: 'Location',
      gallery: 'Gallery',
      contact: 'Contact',
      review: 'Review',
      complete: 'Complete',
    };
    return labels[step] || step;
  };
  
  const getIndustryIcon = (industry?: string) => {
    if (industry === 'local') {
      return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    }
    return (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  };
  
  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full flex items-start gap-3 px-3 py-2.5 rounded-lg',
        'hover:bg-white/5 transition-colors text-left'
      )}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center text-violet-400">
        {getIndustryIcon(conversation.industry)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-white truncate">
            {conversation.businessName}
          </span>
          <span className="text-xs text-zinc-500 flex-shrink-0">
            {formatDate(conversation.lastAccessedAt)}
          </span>
        </div>
        <span className="text-xs text-zinc-500">
          {getStepLabel(conversation.currentStep)}
        </span>
      </div>
    </button>
  );
}

function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  );
}

export default RecentConversations;

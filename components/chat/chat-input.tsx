'use client';

/**
 * ChatInput - Text input component for sending messages
 * Features: Auto-resize textarea, keyboard shortcuts, loading state, dark mode
 */

import { useState, useRef, useCallback, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  darkMode?: boolean;
}

export function ChatInput({
  onSend,
  placeholder = 'Type your message...',
  disabled = false,
  isLoading = false,
  className,
  darkMode = false,
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(() => {
    const trimmedValue = value.trim();
    if (!trimmedValue || disabled || isLoading) return;

    onSend(trimmedValue);
    setValue('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, disabled, isLoading, onSend]);

  const handleSuggest = useCallback(() => {
    if (disabled || isLoading) return;
    onSend('Suggest an answer');
  }, [disabled, isLoading, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Suggest button row */}
      <div className="flex justify-start">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSuggest}
          disabled={disabled || isLoading}
          className={cn(
            'h-8 px-3 rounded-full text-xs border-0',
            'bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-400 text-white font-medium',
            'hover:from-amber-500 hover:via-orange-500 hover:to-yellow-500',
            'shadow-sm hover:shadow-md',
            'transition-all duration-200'
          )}
        >
          <span className="flex items-center gap-1.5">
            <LightbulbIcon className="w-3.5 h-3.5" />
            <span>Suggest an answer</span>
          </span>
        </Button>
      </div>
      
      {/* Input row */}
      <div className="flex gap-3 items-end">
        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            className={cn(
              'min-h-[52px] max-h-[200px] resize-none pr-4',
              'rounded-xl transition-colors duration-200',
              darkMode
                ? 'bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:border-violet-500/50 focus:ring-violet-500/20'
                : 'border-2 border-gray-200 focus:border-blue-500 placeholder:text-gray-400 text-gray-900',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            rows={1}
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!value.trim() || disabled || isLoading}
          className={cn(
            'h-[52px] px-6 rounded-xl',
            'bg-gradient-to-r from-violet-600 to-fuchsia-600',
            'hover:from-violet-700 hover:to-fuchsia-700',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200'
          )}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <LoadingDots />
              <span className="sr-only">Sending...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <SendIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Send</span>
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function LoadingDots() {
  return (
    <span className="flex gap-1">
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </span>
  );
}

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}

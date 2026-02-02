'use client';

/**
 * ChatInput - Text input component for sending messages
 * Features: Auto-resize textarea, keyboard shortcuts, loading state
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
}

export function ChatInput({
  onSend,
  placeholder = 'Type your message...',
  disabled = false,
  isLoading = false,
  className,
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
    <div className={cn('flex gap-3 items-end', className)}>
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
            'rounded-2xl border-2 border-gray-200 focus:border-blue-500',
            'transition-colors duration-200',
            'placeholder:text-gray-400',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          rows={1}
        />
      </div>
      <Button
        onClick={handleSubmit}
        disabled={!value.trim() || disabled || isLoading}
        className={cn(
          'h-[52px] px-6 rounded-2xl',
          'bg-gradient-to-r from-blue-600 to-indigo-600',
          'hover:from-blue-700 hover:to-indigo-700',
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
      <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </span>
  );
}

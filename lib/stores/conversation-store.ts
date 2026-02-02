/**
 * Conversation Store - Zustand store for managing conversation state
 * Tracks current conversation, messages, and extracted content
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  ConversationStep, 
  IndustryType, 
  Message, 
  BusinessProfile 
} from '@/lib/db/types';

interface ConversationState {
  // Conversation data
  id: string | null;
  currentStep: ConversationStep;
  industry: IndustryType | null;
  businessProfile: BusinessProfile | null;
  messages: Message[];
  
  // Extracted section content
  extractedContent: Record<string, unknown>;
  
  // UI state
  isLoading: boolean;
  error: string | null;

  // Actions
  initializeConversation: (data: {
    id: string;
    currentStep: ConversationStep;
    industry?: IndustryType;
    businessProfile?: BusinessProfile;
    messages?: Message[];
  }) => void;
  
  setCurrentStep: (step: ConversationStep) => void;
  setIndustry: (industry: IndustryType) => void;
  setBusinessProfile: (profile: BusinessProfile) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setExtractedContent: (sectionType: string, content: unknown) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  id: null,
  currentStep: 'industry_selection' as ConversationStep,
  industry: null,
  businessProfile: null,
  messages: [],
  extractedContent: {},
  isLoading: false,
  error: null,
};

export const useConversationStore = create<ConversationState>()(
  persist(
    (set) => ({
      ...initialState,

      initializeConversation: (data) => set({
        id: data.id,
        currentStep: data.currentStep,
        industry: data.industry ?? null,
        businessProfile: data.businessProfile ?? null,
        messages: data.messages ?? [],
        error: null,
      }),

      setCurrentStep: (step) => set({ currentStep: step }),
      
      setIndustry: (industry) => set({ industry }),
      
      setBusinessProfile: (profile) => set({ businessProfile: profile }),
      
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message],
      })),
      
      setMessages: (messages) => set({ messages }),
      
      setExtractedContent: (sectionType, content) => set((state) => ({
        extractedContent: {
          ...state.extractedContent,
          [sectionType]: content,
        },
      })),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'conversation-storage',
      partialize: (state) => ({
        id: state.id,
        currentStep: state.currentStep,
        industry: state.industry,
        businessProfile: state.businessProfile,
        extractedContent: state.extractedContent,
      }),
    }
  )
);

// Selector hooks for optimized renders
export const useConversationId = () => useConversationStore((s) => s.id);
export const useCurrentStep = () => useConversationStore((s) => s.currentStep);
export const useIndustry = () => useConversationStore((s) => s.industry);
export const useBusinessProfile = () => useConversationStore((s) => s.businessProfile);
export const useMessages = () => useConversationStore((s) => s.messages);
export const useExtractedContent = () => useConversationStore((s) => s.extractedContent);
export const useIsLoading = () => useConversationStore((s) => s.isLoading);

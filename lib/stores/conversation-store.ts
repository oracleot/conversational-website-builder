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
  BusinessProfile,
  SectionType 
} from '@/lib/db/types';

// Recent conversation entry for history
export interface RecentConversation {
  id: string;
  businessName: string;
  industry?: IndustryType;
  lastAccessedAt: string;
  currentStep: ConversationStep;
  completedSections?: SectionType[];
  selectedSections?: SectionType[];
}

interface ConversationState {
  // Conversation data
  id: string | null;
  currentStep: ConversationStep;
  industry: IndustryType | null;
  businessProfile: BusinessProfile | null;
  messages: Message[];
  
  // Extracted section content
  extractedContent: Record<string, unknown>;
  
  // Recent conversations history
  recentConversations: RecentConversation[];
  
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
  
  // History actions
  addToRecentConversations: (entry: RecentConversation) => void;
  updateRecentConversation: (id: string, updates: Partial<RecentConversation>) => void;
  removeFromRecentConversations: (id: string) => void;
  clearRecentConversations: () => void;
  
  reset: () => void;
  clearCurrentConversation: () => void;
}

const initialState = {
  id: null,
  currentStep: 'industry_selection' as ConversationStep,
  industry: null,
  businessProfile: null,
  messages: [],
  extractedContent: {},
  recentConversations: [],
  isLoading: false,
  error: null,
};

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      ...initialState,

      initializeConversation: (data) => {
        const state = get();
        const isNewConversation = state.id !== data.id;
        
        // If this is a new conversation, reset all conversation-specific state
        if (isNewConversation) {
          // Add current conversation to history if it exists
          if (state.id && state.businessProfile?.name) {
            const existingEntry = state.recentConversations.find(r => r.id === state.id);
            const updatedEntry: RecentConversation = {
              id: state.id,
              businessName: state.businessProfile.name,
              industry: state.industry ?? undefined,
              lastAccessedAt: new Date().toISOString(),
              currentStep: state.currentStep,
            };
            
            const recentConversations = existingEntry
              ? state.recentConversations.map(r => r.id === state.id ? updatedEntry : r)
              : [updatedEntry, ...state.recentConversations].slice(0, 10); // Keep last 10
            
            set({ recentConversations });
          }
        }
        
        set({
          id: data.id,
          currentStep: data.currentStep,
          industry: data.industry ?? null,
          businessProfile: data.businessProfile ?? null,
          messages: data.messages ?? [],
          extractedContent: isNewConversation ? {} : state.extractedContent,
          error: null,
        });
        
        // Update recent conversations with current
        if (data.businessProfile?.name) {
          const entry: RecentConversation = {
            id: data.id,
            businessName: data.businessProfile.name,
            industry: data.industry,
            lastAccessedAt: new Date().toISOString(),
            currentStep: data.currentStep,
          };
          
          const current = get().recentConversations;
          const filtered = current.filter(r => r.id !== data.id);
          set({
            recentConversations: [entry, ...filtered].slice(0, 10)
          });
        }
      },

      setCurrentStep: (step) => set({ currentStep: step }),
      
      setIndustry: (industry) => set({ industry }),
      
      setBusinessProfile: (profile) => {
        set({ businessProfile: profile });
        
        // Update recent conversations when business profile changes
        const state = get();
        if (state.id && profile.name) {
          const entry: RecentConversation = {
            id: state.id,
            businessName: profile.name,
            industry: state.industry ?? undefined,
            lastAccessedAt: new Date().toISOString(),
            currentStep: state.currentStep,
          };
          
          const filtered = state.recentConversations.filter(r => r.id !== state.id);
          set({
            recentConversations: [entry, ...filtered].slice(0, 10)
          });
        }
      },
      
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
      
      // History actions
      addToRecentConversations: (entry) => set((state) => {
        const filtered = state.recentConversations.filter(r => r.id !== entry.id);
        return {
          recentConversations: [entry, ...filtered].slice(0, 10)
        };
      }),
      
      updateRecentConversation: (id, updates) => set((state) => ({
        recentConversations: state.recentConversations.map(r => 
          r.id === id ? { ...r, ...updates, lastAccessedAt: new Date().toISOString() } : r
        )
      })),
      
      removeFromRecentConversations: (id) => set((state) => ({
        recentConversations: state.recentConversations.filter(r => r.id !== id)
      })),
      
      clearRecentConversations: () => set({ recentConversations: [] }),
      
      reset: () => set({
        ...initialState,
        recentConversations: get().recentConversations, // Preserve history
      }),
      
      clearCurrentConversation: () => set({
        id: null,
        currentStep: 'industry_selection',
        industry: null,
        businessProfile: null,
        messages: [],
        extractedContent: {},
        error: null,
        // Keep recentConversations
      }),
    }),
    {
      name: 'conversation-storage',
      partialize: (state) => ({
        id: state.id,
        currentStep: state.currentStep,
        industry: state.industry,
        businessProfile: state.businessProfile,
        extractedContent: state.extractedContent,
        recentConversations: state.recentConversations,
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
export const useRecentConversations = () => useConversationStore((s) => s.recentConversations);


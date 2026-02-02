/**
 * Site Store - Zustand store for managing site preview state
 * Tracks site configuration, sections, and preview updates
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SectionType, ThemeConfig } from '@/lib/db/types';

interface SiteSection {
  id: string;
  type: SectionType;
  order: number;
  variant: number;
  content: unknown;
  isVisible: boolean;
}

interface SiteState {
  // Site data
  id: string | null;
  conversationId: string | null;
  name: string;
  slug: string | null;
  
  // Sections
  sections: SiteSection[];
  activeSectionId: string | null;
  
  // Theme
  theme: ThemeConfig | null;
  
  // Preview state
  previewMode: 'desktop' | 'tablet' | 'mobile';
  isPreviewLoading: boolean;
  scrollToSection: string | null;
  
  // Publishing state
  isPublished: boolean;
  publishedUrl: string | null;
  
  // UI state
  isSaving: boolean;
  lastSavedAt: Date | null;
  error: string | null;

  // Actions
  initializeSite: (data: {
    id: string;
    conversationId: string;
    name?: string;
    sections?: SiteSection[];
    theme?: ThemeConfig;
  }) => void;
  
  setSiteId: (id: string) => void;
  setName: (name: string) => void;
  setSlug: (slug: string) => void;
  
  // Section actions
  addSection: (section: SiteSection) => void;
  updateSection: (sectionId: string, updates: Partial<SiteSection>) => void;
  updateSectionContent: (sectionId: string, content: unknown) => void;
  updateSectionVariant: (sectionId: string, variant: number) => void;
  reorderSections: (sectionIds: string[]) => void;
  removeSection: (sectionId: string) => void;
  setActiveSection: (sectionId: string | null) => void;
  setSections: (sections: SiteSection[]) => void;
  
  // Theme actions
  setTheme: (theme: ThemeConfig) => void;
  updateThemeColors: (colors: Partial<ThemeConfig['colors']>) => void;
  
  // Preview actions
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  setPreviewLoading: (loading: boolean) => void;
  triggerScrollToSection: (sectionId: string) => void;
  clearScrollTarget: () => void;
  
  // Publishing actions
  setPublished: (url: string) => void;
  
  // State management
  setSaving: (saving: boolean) => void;
  setLastSaved: (date: Date) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const defaultTheme: ThemeConfig = {
  colors: {
    primary: '#3B82F6',
    secondary: '#1E40AF',
    accent: '#F59E0B',
    background: '#FFFFFF',
    foreground: '#1F2937',
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
  borderRadius: 'md',
};

const initialState = {
  id: null,
  conversationId: null,
  name: 'Untitled Site',
  slug: null,
  sections: [],
  activeSectionId: null,
  theme: defaultTheme,
  previewMode: 'desktop' as const,
  isPreviewLoading: false,
  scrollToSection: null,
  isPublished: false,
  publishedUrl: null,
  isSaving: false,
  lastSavedAt: null,
  error: null,
};

export const useSiteStore = create<SiteState>()(
  persist(
    (set, get) => ({
      ...initialState,

      initializeSite: (data) => set({
        id: data.id,
        conversationId: data.conversationId,
        name: data.name ?? 'Untitled Site',
        sections: data.sections ?? [],
        theme: data.theme ?? defaultTheme,
        error: null,
      }),

      setSiteId: (id) => set({ id }),
      setName: (name) => set({ name }),
      setSlug: (slug) => set({ slug }),

      // Section actions
      addSection: (section) => set((state) => {
        const existingSection = state.sections.find(s => s.type === section.type);
        if (existingSection) {
          // Update existing section instead of adding duplicate
          return {
            sections: state.sections.map(s =>
              s.type === section.type
                ? { ...s, content: section.content, variant: section.variant }
                : s
            ),
            scrollToSection: existingSection.id,
          };
        }
        return {
          sections: [...state.sections, section].sort((a, b) => a.order - b.order),
          scrollToSection: section.id,
        };
      }),

      updateSection: (sectionId, updates) => set((state) => ({
        sections: state.sections.map((s) =>
          s.id === sectionId ? { ...s, ...updates } : s
        ),
      })),

      updateSectionContent: (sectionId, content) => set((state) => ({
        sections: state.sections.map((s) =>
          s.id === sectionId ? { ...s, content } : s
        ),
      })),

      updateSectionVariant: (sectionId, variant) => set((state) => ({
        sections: state.sections.map((s) =>
          s.id === sectionId ? { ...s, variant } : s
        ),
      })),

      reorderSections: (sectionIds) => set((state) => ({
        sections: sectionIds
          .map((id, index) => {
            const section = state.sections.find((s) => s.id === id);
            return section ? { ...section, order: index } : null;
          })
          .filter(Boolean) as SiteSection[],
      })),

      removeSection: (sectionId) => set((state) => ({
        sections: state.sections.filter((s) => s.id !== sectionId),
        activeSectionId: state.activeSectionId === sectionId ? null : state.activeSectionId,
      })),

      setActiveSection: (sectionId) => set({ activeSectionId: sectionId }),
      
      setSections: (sections) => set({ sections }),

      // Theme actions
      setTheme: (theme) => set({ theme }),

      updateThemeColors: (colors) => set((state) => ({
        theme: state.theme
          ? {
              ...state.theme,
              colors: { ...state.theme.colors, ...colors },
            }
          : null,
      })),

      // Preview actions
      setPreviewMode: (mode) => set({ previewMode: mode }),
      setPreviewLoading: (loading) => set({ isPreviewLoading: loading }),
      triggerScrollToSection: (sectionId) => set({ scrollToSection: sectionId }),
      clearScrollTarget: () => set({ scrollToSection: null }),

      // Publishing actions
      setPublished: (url) => set({
        isPublished: true,
        publishedUrl: url,
      }),

      // State management
      setSaving: (saving) => set({ isSaving: saving }),
      setLastSaved: (date) => set({ lastSavedAt: date }),
      setError: (error) => set({ error }),
      reset: () => set(initialState),
    }),
    {
      name: 'site-storage',
      partialize: (state) => ({
        id: state.id,
        conversationId: state.conversationId,
        name: state.name,
        slug: state.slug,
        sections: state.sections,
        theme: state.theme,
        previewMode: state.previewMode,
      }),
    }
  )
);

// Selector hooks for optimized renders
export const useSiteId = () => useSiteStore((s) => s.id);
export const useSiteName = () => useSiteStore((s) => s.name);
export const useSections = () => useSiteStore((s) => s.sections);
export const useActiveSection = () => useSiteStore((s) => s.activeSectionId);
export const useSiteTheme = () => useSiteStore((s) => s.theme);
export const usePreviewMode = () => useSiteStore((s) => s.previewMode);
export const useIsPreviewLoading = () => useSiteStore((s) => s.isPreviewLoading);
export const useScrollTarget = () => useSiteStore((s) => s.scrollToSection);
export const useIsSaving = () => useSiteStore((s) => s.isSaving);
export const useIsPublished = () => useSiteStore((s) => s.isPublished);

// Helper to get section by type
export const useSectionByType = (type: SectionType) =>
  useSiteStore((s) => s.sections.find((section) => section.type === type));

// Helper to get ordered sections
export const useOrderedSections = () =>
  useSiteStore((s) => [...s.sections].sort((a, b) => a.order - b.order));

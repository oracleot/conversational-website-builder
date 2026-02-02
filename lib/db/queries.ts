import type {
  BusinessProfile,
  SiteConfig,
  LaunchPreferences,
} from '@/lib/schemas';
import type { Database, ConversationStep, IndustryType, SiteStatus, Json, Message } from './types';
import type { SupabaseClient } from '@supabase/supabase-js';

type TypedSupabaseClient = SupabaseClient<Database>;

// Type for conversation rows from database
type ConversationRow = Database['public']['Tables']['conversations']['Row'];
type SiteRow = Database['public']['Tables']['sites']['Row'];

/**
 * Database queries for conversations, sites, and component usage
 */

// ========== CONVERSATION QUERIES ==========

export interface CreateConversationParams {
  userId?: string;
  industry?: IndustryType;
}

export async function createConversation(
  supabase: TypedSupabaseClient,
  params: CreateConversationParams = {}
) {
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      user_id: params.userId || null,
      industry: params.industry || null,
      current_step: 'industry_selection' as ConversationStep,
      messages: [] as Json[],
    })
    .select()
    .single();

  if (error) throw error;
  
  // Transform to API response format
  return transformConversation(data as unknown as ConversationRow);
}

export async function getConversation(
  supabase: TypedSupabaseClient,
  conversationId: string
) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  
  return transformConversation(data as unknown as ConversationRow);
}

export interface UpdateConversationParams {
  industry?: IndustryType;
  currentStep?: ConversationStep;
  businessProfile?: BusinessProfile;
  messages?: Message[];
}

export async function updateConversation(
  supabase: TypedSupabaseClient,
  conversationId: string,
  updates: UpdateConversationParams
) {
  const updateData: Record<string, unknown> = {};

  if (updates.industry !== undefined) updateData.industry = updates.industry;
  if (updates.currentStep !== undefined) updateData.current_step = updates.currentStep;
  if (updates.businessProfile !== undefined)
    updateData.business_profile = updates.businessProfile;
  if (updates.messages !== undefined)
    updateData.messages = updates.messages;

  const { data, error } = await supabase
    .from('conversations')
    .update(updateData)
    .eq('id', conversationId)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  
  return transformConversation(data as unknown as ConversationRow);
}

export async function deleteConversation(
  supabase: TypedSupabaseClient,
  conversationId: string
) {
  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', conversationId);

  if (error) throw error;
}

export async function getUserConversations(
  supabase: TypedSupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data as unknown as ConversationRow[]).map(transformConversation);
}

/**
 * Add a message to a conversation
 */
export async function addMessage(
  supabase: TypedSupabaseClient,
  conversationId: string,
  message: Message
) {
  // First get current messages
  const { data: conversation, error: fetchError } = await supabase
    .from('conversations')
    .select('messages')
    .eq('id', conversationId)
    .single();

  if (fetchError) throw fetchError;

  const currentMessages = (conversation.messages || []) as unknown as Message[];
  const updatedMessages = [...currentMessages, message];

  // Update with new message
  const { data, error } = await supabase
    .from('conversations')
    .update({ 
      messages: updatedMessages as unknown as Json[],
      updated_at: new Date().toISOString()
    })
    .eq('id', conversationId)
    .select()
    .single();

  if (error) throw error;
  return transformConversation(data as unknown as ConversationRow);
}

/**
 * Transform database row to API response format
 */
function transformConversation(row: Database['public']['Tables']['conversations']['Row']) {
  return {
    id: row.id,
    userId: row.user_id,
    industry: row.industry,
    currentStep: row.current_step,
    businessProfile: row.business_profile as BusinessProfile | null,
    messages: (row.messages || []) as unknown as Message[],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// ========== SITE QUERIES ==========

export interface CreateSiteParams {
  conversationId: string;
  config: SiteConfig;
}

export async function createSite(
  supabase: TypedSupabaseClient,
  params: CreateSiteParams
) {
  const { data, error } = await supabase
    .from('sites')
    .insert({
      conversation_id: params.conversationId,
      config: params.config as unknown as Json,
      status: 'building' as SiteStatus,
    })
    .select()
    .single();

  if (error) throw error;
  return transformSite(data as unknown as SiteRow);
}

export async function getSite(
  supabase: TypedSupabaseClient,
  siteId: string
) {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', siteId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return transformSite(data as unknown as SiteRow);
}

export async function getSiteByConversation(
  supabase: TypedSupabaseClient,
  conversationId: string
) {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('conversation_id', conversationId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return transformSite(data as unknown as SiteRow);
}

export interface UpdateSiteParams {
  config?: SiteConfig;
  status?: SiteStatus;
  previewUrl?: string;
  exportUrl?: string;
  launchPreferences?: LaunchPreferences;
  launchedAt?: string;
}

export async function updateSite(
  supabase: TypedSupabaseClient,
  siteId: string,
  updates: UpdateSiteParams
) {
  const updateData: Record<string, unknown> = {};

  if (updates.config !== undefined)
    updateData.config = updates.config;
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.previewUrl !== undefined) updateData.preview_url = updates.previewUrl;
  if (updates.exportUrl !== undefined) updateData.export_url = updates.exportUrl;
  if (updates.launchPreferences !== undefined)
    updateData.launch_preferences = updates.launchPreferences;
  if (updates.launchedAt !== undefined) updateData.launched_at = updates.launchedAt;

  const { data, error } = await supabase
    .from('sites')
    .update(updateData)
    .eq('id', siteId)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return transformSite(data as unknown as SiteRow);
}

/**
 * Transform site database row to API response format
 */
function transformSite(row: Database['public']['Tables']['sites']['Row']) {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    config: row.config as unknown as SiteConfig,
    status: row.status,
    previewUrl: row.preview_url,
    exportUrl: row.export_url,
    launchPreferences: row.launch_preferences as unknown as LaunchPreferences | null,
    createdAt: row.created_at,
    launchedAt: row.launched_at
  };
}

// ========== COMPONENT USAGE QUERIES ==========

export interface TrackComponentUsageParams {
  siteId: string;
  sectionType: string;
  variantNumber: number;
  isOverride: boolean;
}

export async function trackComponentUsage(
  supabase: TypedSupabaseClient,
  params: TrackComponentUsageParams
) {
  const { data, error } = await supabase
    .from('component_usage')
    .insert({
      site_id: params.siteId,
      section_type: params.sectionType,
      variant_number: params.variantNumber,
      is_override: params.isOverride,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getComponentUsageStats(supabase: TypedSupabaseClient) {
  const { data, error } = await supabase
    .from('component_usage')
    .select('section_type, variant_number, is_override, selected_at');

  if (error) throw error;
  return data;
}

export async function getSiteComponentUsage(
  supabase: TypedSupabaseClient,
  siteId: string
) {
  const { data, error } = await supabase
    .from('component_usage')
    .select('*')
    .eq('site_id', siteId)
    .order('selected_at', { ascending: false });

  if (error) throw error;
  return data;
}

// ========== IN-MEMORY COMPONENT USAGE TRACKING ==========

/**
 * In-memory component usage tracking for demo purposes
 * In production, this would use the Supabase trackComponentUsage function
 */
const componentUsageLog = new Map<string, Array<{
  id: string;
  siteId: string;
  sectionType: string;
  variantNumber: number;
  isOverride: boolean;
  selectedAt: string;
}>>();

export interface TrackComponentUsageInMemoryParams {
  siteId: string;
  sectionType: string;
  variantNumber: number;
  isOverride: boolean;
}

/**
 * Track component variant usage (in-memory version)
 * Records when users select or override variant selections
 */
export async function trackComponentUsageInMemory(
  params: TrackComponentUsageInMemoryParams
): Promise<{
  success: boolean;
  id?: string;
  error?: string;
}> {
  try {
    const id = `usage_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const usage = {
      id,
      siteId: params.siteId,
      sectionType: params.sectionType,
      variantNumber: params.variantNumber,
      isOverride: params.isOverride,
      selectedAt: new Date().toISOString(),
    };

    const existing = componentUsageLog.get(params.siteId) || [];
    existing.push(usage);
    componentUsageLog.set(params.siteId, existing);

    return { success: true, id };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to track usage',
    };
  }
}

/**
 * Get component usage statistics for a site (in-memory version)
 */
export async function getComponentUsageInMemory(siteId: string): Promise<{
  success: boolean;
  usage?: Array<{
    sectionType: string;
    variantNumber: number;
    isOverride: boolean;
    selectedAt: string;
  }>;
  error?: string;
}> {
  try {
    const usage = componentUsageLog.get(siteId) || [];
    return {
      success: true,
      usage: usage.map(u => ({
        sectionType: u.sectionType,
        variantNumber: u.variantNumber,
        isOverride: u.isOverride,
        selectedAt: u.selectedAt,
      })),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get usage',
    };
  }
}

/**
 * Get component override statistics across all sites (in-memory version)
 */
export function getOverrideStats(): {
  totalOverrides: number;
  overridesBySection: Record<string, number>;
  overridesByVariant: Record<number, number>;
  mostOverriddenSection: string | null;
} {
  const stats = {
    totalOverrides: 0,
    overridesBySection: {} as Record<string, number>,
    overridesByVariant: {} as Record<number, number>,
    mostOverriddenSection: null as string | null,
  };

  for (const usages of componentUsageLog.values()) {
    for (const usage of usages) {
      if (usage.isOverride) {
        stats.totalOverrides++;
        stats.overridesBySection[usage.sectionType] = 
          (stats.overridesBySection[usage.sectionType] || 0) + 1;
        stats.overridesByVariant[usage.variantNumber] = 
          (stats.overridesByVariant[usage.variantNumber] || 0) + 1;
      }
    }
  }

  // Find most overridden section
  let maxOverrides = 0;
  for (const [section, count] of Object.entries(stats.overridesBySection)) {
    if (count > maxOverrides) {
      maxOverrides = count;
      stats.mostOverriddenSection = section;
    }
  }

  return stats;
}

// ========== HELPER QUERIES ==========

/**
 * Link an anonymous conversation to an authenticated user
 */
export async function linkConversationToUser(
  supabase: TypedSupabaseClient,
  conversationId: string,
  userId: string
) {
  const { data, error } = await supabase
    .from('conversations')
    .update({ user_id: userId })
    .eq('id', conversationId)
    .is('user_id', null)
    .select()
    .single();

  if (error) throw error;
  return transformConversation(data as unknown as ConversationRow);
}

/**
 * Check if a conversation belongs to a user
 */
export async function isConversationOwner(
  supabase: TypedSupabaseClient,
  conversationId: string,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('conversations')
    .select('user_id')
    .eq('id', conversationId)
    .single();

  if (error) return false;
  return data.user_id === userId || data.user_id === null;
}

// ========== SITE DRAFT FUNCTIONS (Standalone) ==========

/**
 * In-memory site draft storage for demo purposes
 * In production, this would use Supabase
 */
const siteDrafts = new Map<string, {
  id: string;
  sessionId: string;
  businessProfile: Record<string, unknown>;
  content: Record<string, unknown>;
  siteConfig: Record<string, unknown>;
  slug?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}>();

export interface SaveDraftParams {
  sessionId: string;
  businessProfile: Record<string, unknown>;
  content: Record<string, unknown>;
  siteConfig: Record<string, unknown>;
}

/**
 * Save or update a site draft
 */
export async function saveSiteDraft(params: SaveDraftParams): Promise<{
  success: boolean;
  siteId?: string;
  updatedAt?: string;
  error?: string;
}> {
  try {
    const existing = siteDrafts.get(params.sessionId);
    const now = new Date().toISOString();
    
    if (existing) {
      // Update existing draft
      existing.businessProfile = params.businessProfile;
      existing.content = params.content;
      existing.siteConfig = params.siteConfig;
      existing.updatedAt = now;
      siteDrafts.set(params.sessionId, existing);
      
      return {
        success: true,
        siteId: existing.id,
        updatedAt: now,
      };
    } else {
      // Create new draft
      const siteId = `site_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      siteDrafts.set(params.sessionId, {
        id: siteId,
        sessionId: params.sessionId,
        businessProfile: params.businessProfile,
        content: params.content,
        siteConfig: params.siteConfig,
        createdAt: now,
        updatedAt: now,
      });
      
      return {
        success: true,
        siteId,
        updatedAt: now,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save draft',
    };
  }
}

/**
 * Get a site draft by session ID
 */
export async function getSiteDraft(sessionId: string): Promise<{
  success: boolean;
  site?: {
    id: string;
    sessionId: string;
    businessProfile: Record<string, unknown>;
    content: Record<string, unknown>;
    siteConfig: Record<string, unknown>;
    createdAt: string;
    updatedAt: string;
  };
  error?: string;
}> {
  try {
    const draft = siteDrafts.get(sessionId);
    
    if (!draft) {
      return {
        success: false,
        error: 'Site draft not found',
      };
    }
    
    return {
      success: true,
      site: draft,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get draft',
    };
  }
}

/**
 * Get a site by its slug
 */
export async function getSiteBySlug(slug: string): Promise<{
  success: boolean;
  site?: {
    id: string;
    slug: string;
    businessProfile: { businessName: string };
    content: Record<string, unknown>;
    siteConfig: Record<string, unknown>;
    publishedAt?: string;
  };
  error?: string;
}> {
  try {
    // Find site with matching slug
    for (const draft of siteDrafts.values()) {
      if (draft.slug === slug || draft.id === slug) {
        return {
          success: true,
          site: {
            id: draft.id,
            slug: draft.slug || draft.id,
            businessProfile: draft.businessProfile as { businessName: string },
            content: draft.content,
            siteConfig: draft.siteConfig,
            publishedAt: draft.publishedAt,
          },
        };
      }
    }
    
    return {
      success: false,
      error: 'Site not found',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get site',
    };
  }
}

export interface PublishParams {
  siteId: string;
  slug: string;
  customDomain?: string;
}

/**
 * Publish a site (make it publicly accessible)
 */
export async function publishSite(params: PublishParams): Promise<{
  success: boolean;
  publishedAt?: string;
  error?: string;
}> {
  try {
    // Find the site by ID
    for (const [sessionId, draft] of siteDrafts.entries()) {
      if (draft.id === params.siteId) {
        const now = new Date().toISOString();
        draft.slug = params.slug;
        draft.publishedAt = now;
        siteDrafts.set(sessionId, draft);
        
        return {
          success: true,
          publishedAt: now,
        };
      }
    }
    
    return {
      success: false,
      error: 'Site not found',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to publish site',
    };
  }
}

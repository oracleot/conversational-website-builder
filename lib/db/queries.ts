import { getServerClient } from './client';
import type {
  BusinessProfile,
  SiteConfig,
  LaunchPreferences,
} from '@/lib/schemas';
import type { Database, ConversationStep, IndustryType, SiteStatus } from './types';

/**
 * Database queries for conversations, sites, and component usage
 */

// ========== CONVERSATION QUERIES ==========

export interface CreateConversationParams {
  userId?: string;
  industry?: IndustryType;
}

export async function createConversation(params: CreateConversationParams = {}) {
  const supabase = getServerClient();

  const { data, error } = await supabase
    .from('conversations')
    .insert({
      user_id: params.userId || null,
      industry: params.industry || null,
      current_step: 'industry_selection',
      messages: [],
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getConversation(conversationId: string) {
  const supabase = getServerClient();

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .single();

  if (error) throw error;
  return data;
}

export interface UpdateConversationParams {
  industry?: IndustryType;
  currentStep?: ConversationStep;
  businessProfile?: BusinessProfile;
  messages?: unknown[];
}

export async function updateConversation(
  conversationId: string,
  updates: UpdateConversationParams
) {
  const supabase = getServerClient();

  const updateData: Partial<Database['public']['Tables']['conversations']['Update']> = {};

  if (updates.industry !== undefined) updateData.industry = updates.industry;
  if (updates.currentStep !== undefined) updateData.current_step = updates.currentStep;
  if (updates.businessProfile !== undefined)
    updateData.business_profile = updates.businessProfile as unknown as Database['public']['Tables']['conversations']['Update']['business_profile'];
  if (updates.messages !== undefined)
    updateData.messages = updates.messages as unknown as Database['public']['Tables']['conversations']['Update']['messages'];

  const { data, error } = await supabase
    .from('conversations')
    .update(updateData)
    .eq('id', conversationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteConversation(conversationId: string) {
  const supabase = getServerClient();

  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', conversationId);

  if (error) throw error;
}

export async function getUserConversations(userId: string) {
  const supabase = getServerClient();

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
}

// ========== SITE QUERIES ==========

export interface CreateSiteParams {
  conversationId: string;
  config: SiteConfig;
}

export async function createSite(params: CreateSiteParams) {
  const supabase = getServerClient();

  const { data, error } = await supabase
    .from('sites')
    .insert({
      conversation_id: params.conversationId,
      config: params.config as unknown as Database['public']['Tables']['sites']['Insert']['config'],
      status: 'building',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSite(siteId: string) {
  const supabase = getServerClient();

  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', siteId)
    .single();

  if (error) throw error;
  return data;
}

export async function getSiteByConversation(conversationId: string) {
  const supabase = getServerClient();

  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('conversation_id', conversationId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return data;
}

export interface UpdateSiteParams {
  config?: SiteConfig;
  status?: SiteStatus;
  previewUrl?: string;
  exportUrl?: string;
  launchPreferences?: LaunchPreferences;
  launchedAt?: string;
}

export async function updateSite(siteId: string, updates: UpdateSiteParams) {
  const supabase = getServerClient();

  const updateData: Partial<Database['public']['Tables']['sites']['Update']> = {};

  if (updates.config !== undefined)
    updateData.config = updates.config as unknown as Database['public']['Tables']['sites']['Update']['config'];
  if (updates.status !== undefined) updateData.status = updates.status;
  if (updates.previewUrl !== undefined) updateData.preview_url = updates.previewUrl;
  if (updates.exportUrl !== undefined) updateData.export_url = updates.exportUrl;
  if (updates.launchPreferences !== undefined)
    updateData.launch_preferences = updates.launchPreferences as unknown as Database['public']['Tables']['sites']['Update']['launch_preferences'];
  if (updates.launchedAt !== undefined) updateData.launched_at = updates.launchedAt;

  const { data, error } = await supabase
    .from('sites')
    .update(updateData)
    .eq('id', siteId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ========== COMPONENT USAGE QUERIES ==========

export interface TrackComponentUsageParams {
  siteId: string;
  sectionType: string;
  variantNumber: number;
  isOverride: boolean;
}

export async function trackComponentUsage(params: TrackComponentUsageParams) {
  const supabase = getServerClient();

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

export async function getComponentUsageStats() {
  const supabase = getServerClient();

  const { data, error } = await supabase
    .from('component_usage')
    .select('section_type, variant_number, is_override, selected_at');

  if (error) throw error;
  return data;
}

export async function getSiteComponentUsage(siteId: string) {
  const supabase = getServerClient();

  const { data, error } = await supabase
    .from('component_usage')
    .select('*')
    .eq('site_id', siteId)
    .order('selected_at', { ascending: false });

  if (error) throw error;
  return data;
}

// ========== HELPER QUERIES ==========

/**
 * Link an anonymous conversation to an authenticated user
 */
export async function linkConversationToUser(conversationId: string, userId: string) {
  const supabase = getServerClient();

  const { data, error } = await supabase
    .from('conversations')
    .update({ user_id: userId })
    .eq('id', conversationId)
    .is('user_id', null)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Check if a conversation belongs to a user
 */
export async function isConversationOwner(
  conversationId: string,
  userId: string
): Promise<boolean> {
  const supabase = getServerClient();

  const { data, error } = await supabase
    .from('conversations')
    .select('user_id')
    .eq('id', conversationId)
    .single();

  if (error) return false;
  return data.user_id === userId || data.user_id === null;
}

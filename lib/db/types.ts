/**
 * Database type definitions
 * These will be generated from Supabase schema after migrations
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type IndustryType = 'service' | 'local';

export type ConversationStep =
  | 'industry_selection'
  | 'business_profile'
  | 'hero'
  | 'services'
  | 'menu'
  | 'about'
  | 'process'
  | 'portfolio'
  | 'testimonials'
  | 'location'
  | 'gallery'
  | 'contact'
  | 'review'
  | 'complete';

export type SiteStatus = 'building' | 'preview' | 'awaiting_launch' | 'launched';

// Section types for service industry
export type ServiceSectionType = 
  | 'hero'
  | 'services'
  | 'about'
  | 'process'
  | 'portfolio'
  | 'testimonials'
  | 'contact';

// Section types for local industry
export type LocalSectionType = 
  | 'hero'
  | 'menu'
  | 'about'
  | 'location'
  | 'gallery'
  | 'testimonials'
  | 'contact';

// Combined section type
export type SectionType = 
  | 'hero'
  | 'services'
  | 'menu'
  | 'about'
  | 'process'
  | 'portfolio'
  | 'testimonials'
  | 'location'
  | 'gallery'
  | 'contact';

// Message in conversation history
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    step?: ConversationStep;
    extractedContent?: unknown;
  };
}

// Business profile extracted from conversation
export interface BusinessProfile {
  name: string;
  industry: IndustryType;
  businessType: string;
  tagline: string;
  description: string;
  brandPersonality: string[];
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  contact: {
    phone?: string;
    email: string;
    address?: string;
  };
}

// Section configuration in site config
export interface SectionConfig {
  id: string;
  type: SectionType;
  selectedVariant: number;
  content: Record<string, unknown>;
  aiSelected: boolean;
  aiReasoning?: string;
}

// Theme configuration
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

// Full site configuration
export interface SiteConfig {
  businessProfile: BusinessProfile;
  sections: SectionConfig[];
  theme: ThemeConfig;
  sectionOrder: SectionType[];
}

// Launch preferences
export interface LaunchPreferences {
  email: string;
  phone?: string;
  imagePreference: 'placeholders' | 'provide_own' | 'need_photography';
  domainPreference: 'buy_new' | 'use_existing' | 'hosted_subdomain';
  existingDomain?: string;
  timeline: 'asap' | 'this_week' | 'this_month' | 'no_rush';
  notes?: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          user_id: string | null;
          industry: IndustryType | null;
          current_step: ConversationStep;
          business_profile: Json | null;
          messages: Json[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          industry?: IndustryType | null;
          current_step?: ConversationStep;
          business_profile?: Json | null;
          messages?: Json[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          industry?: IndustryType | null;
          current_step?: ConversationStep;
          business_profile?: Json | null;
          messages?: Json[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "conversations_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      sites: {
        Row: {
          id: string;
          conversation_id: string;
          config: Json;
          status: SiteStatus;
          preview_url: string | null;
          export_url: string | null;
          launch_preferences: Json | null;
          created_at: string;
          launched_at: string | null;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          config: Json;
          status?: SiteStatus;
          preview_url?: string | null;
          export_url?: string | null;
          launch_preferences?: Json | null;
          created_at?: string;
          launched_at?: string | null;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          config?: Json;
          status?: SiteStatus;
          preview_url?: string | null;
          export_url?: string | null;
          launch_preferences?: Json | null;
          created_at?: string;
          launched_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "sites_conversation_id_fkey";
            columns: ["conversation_id"];
            isOneToOne: true;
            referencedRelation: "conversations";
            referencedColumns: ["id"];
          }
        ];
      };
      component_usage: {
        Row: {
          id: string;
          site_id: string;
          section_type: string;
          variant_number: number;
          is_override: boolean;
          selected_at: string;
        };
        Insert: {
          id?: string;
          site_id: string;
          section_type: string;
          variant_number: number;
          is_override?: boolean;
          selected_at?: string;
        };
        Update: {
          id?: string;
          site_id?: string;
          section_type?: string;
          variant_number?: number;
          is_override?: boolean;
          selected_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "component_usage_site_id_fkey";
            columns: ["site_id"];
            isOneToOne: false;
            referencedRelation: "sites";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

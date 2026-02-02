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

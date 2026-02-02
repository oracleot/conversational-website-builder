# Data Model: AI-Powered Conversational Website Builder MVP

**Feature Branch**: `001-website-builder-mvp`  
**Date**: 2026-02-02  
**Status**: Complete

## Entity Relationship Diagram

```
┌──────────────┐       ┌───────────────────┐       ┌─────────────────┐
│    User      │───1:N─│   Conversation    │───1:1─│      Site       │
└──────────────┘       └───────────────────┘       └─────────────────┘
       │                       │                          │
       │                       │                          │
       │                       ▼                          ▼
       │               ┌───────────────┐          ┌───────────────────┐
       │               │BusinessProfile│          │  ComponentUsage   │
       │               │   (embedded)  │          │   (analytics)     │
       │               └───────────────┘          └───────────────────┘
       │                       │
       │                       ▼
       │               ┌───────────────┐
       │               │   Message[]   │
       │               │  (embedded)   │
       │               └───────────────┘
       │
       │               ┌───────────────┐
       └───────────────│   Section[]   │
                       │  (in Site)    │
                       └───────────────┘
```

---

## Core Entities

### User

Represents an authenticated user of the platform.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| email | string | UNIQUE, NOT NULL | User's email address |
| created_at | timestamp | NOT NULL | Account creation time |

**Validation Rules**:
- Email must be valid email format
- Email is case-insensitive (stored lowercase)

---

### Conversation

Represents an ongoing website creation session.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| user_id | UUID | FK → users, NULL | Owner (null for anonymous) |
| industry | IndustryType | NULL | Selected industry type |
| current_step | ConversationStep | NOT NULL | Current conversation step |
| business_profile | JSONB | NULL | Extracted business data |
| messages | JSONB[] | NOT NULL, DEFAULT [] | Chat message history |
| created_at | timestamp | NOT NULL | Session start time |
| updated_at | timestamp | NOT NULL | Last interaction time |

**State Transitions**:
```
created → industry_selected → profile_complete → sections_building → 
sections_complete → ready_for_launch
```

**Validation Rules**:
- `current_step` must be valid ConversationStep enum value
- `business_profile` validated against BusinessProfile schema when present
- `messages` array entries validated against Message schema
- Conversation retained for 30 days of inactivity (FR-005)

---

### Site

Represents a generated website configuration.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| conversation_id | UUID | FK → conversations, UNIQUE | Source conversation |
| config | JSONB | NOT NULL | Full site configuration |
| status | SiteStatus | NOT NULL | Current site state |
| preview_url | string | NULL | Deployed preview URL |
| export_url | string | NULL | Download/GitHub URL |
| launch_preferences | JSONB | NULL | User's launch form data |
| created_at | timestamp | NOT NULL | Initial creation |
| launched_at | timestamp | NULL | When launched |

**Status Transitions**:
```
building → preview → awaiting_launch → launched
```

**Validation Rules**:
- `config` validated against SiteConfig schema
- `status` must be valid SiteStatus enum value
- `launched_at` required when status = 'launched'

---

### ComponentUsage (Analytics)

Tracks component selection for improving AI variant selection.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| site_id | UUID | FK → sites | Associated site |
| section_type | SectionType | NOT NULL | Type of section |
| variant_number | integer | NOT NULL, 1-5 | Selected variant |
| is_override | boolean | NOT NULL | User overrode AI selection |
| selected_at | timestamp | NOT NULL | Selection timestamp |

**Validation Rules**:
- `variant_number` must be between 1 and 5
- `section_type` must be valid for site's industry

---

## Embedded Value Objects

### BusinessProfile

Extracted business information used across the site.

```typescript
interface BusinessProfile {
  name: string;                    // Business name (required)
  industry: 'service' | 'local';   // Industry type (required)
  businessType: string;            // Specific type (e.g., "restaurant", "consultant")
  tagline: string;                 // Short tagline (required)
  description: string;             // Full description (required)
  brandPersonality: string[];      // Personality traits (min 1)
  colors?: {                       // Optional brand colors
    primary: string;               // Hex color
    secondary: string;             // Hex color
    accent: string;                // Hex color
  };
  contact: {
    phone?: string;                // Optional phone number
    email: string;                 // Required email
    address?: string;              // Optional address
  };
}
```

**Validation Rules**:
- `name` max 100 characters
- `tagline` max 200 characters
- `description` max 2000 characters
- `brandPersonality` must include at least 1 trait
- `colors` values must be valid hex codes (#RRGGBB)
- `contact.email` must be valid email format

---

### Message

A single message in the conversation history.

```typescript
interface Message {
  id: string;                      // Unique message ID
  role: 'user' | 'assistant' | 'system';
  content: string;                 // Message text
  timestamp: string;               // ISO timestamp
  metadata?: {
    step?: ConversationStep;       // Associated conversation step
    extractedContent?: unknown;    // Structured extraction result
  };
}
```

---

### SectionConfig

Configuration for a single website section.

```typescript
interface SectionConfig {
  id: string;                      // Unique section ID
  type: SectionType;               // Section type enum
  selectedVariant: number;         // 1-5
  content: SectionContent;         // Type-specific content
  aiSelected: boolean;             // Whether AI chose this variant
  aiReasoning?: string;            // AI explanation for selection
}
```

---

### SiteConfig

Complete site configuration (stored in `sites.config`).

```typescript
interface SiteConfig {
  businessProfile: BusinessProfile;
  sections: SectionConfig[];
  theme: ThemeConfig;
  sectionOrder: SectionType[];     // Display order
}
```

---

### ThemeConfig

Visual theme configuration.

```typescript
interface ThemeConfig {
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
```

---

### LaunchPreferences

User preferences captured in launch request.

```typescript
interface LaunchPreferences {
  email: string;                   // Required
  phone?: string;                  // Optional
  imagePreference: 'placeholders' | 'provide_own' | 'need_photography';
  domainPreference: 'buy_new' | 'use_existing' | 'hosted_subdomain';
  existingDomain?: string;         // If use_existing
  timeline: 'asap' | 'this_week' | 'this_month' | 'no_rush';
  notes?: string;                  // Additional instructions
}
```

---

## Enums

### IndustryType

```typescript
type IndustryType = 'service' | 'local';
```

### ConversationStep

```typescript
type ConversationStep = 
  | 'industry_selection'
  | 'business_profile'
  | 'hero'
  | 'services'      // service industry: services/offerings
  | 'menu'          // local industry: menu/services
  | 'about'
  | 'process'       // service only
  | 'portfolio'     // service only
  | 'testimonials'
  | 'location'      // local only
  | 'gallery'       // local only
  | 'contact'
  | 'review'
  | 'complete';
```

### SectionType

```typescript
// Service industry sections
type ServiceSectionType = 
  | 'hero'
  | 'services'
  | 'about'
  | 'process'
  | 'portfolio'
  | 'testimonials'
  | 'contact';

// Local industry sections
type LocalSectionType = 
  | 'hero'
  | 'menu'
  | 'about'
  | 'location'
  | 'gallery'
  | 'testimonials'
  | 'contact';

type SectionType = ServiceSectionType | LocalSectionType;
```

### SiteStatus

```typescript
type SiteStatus = 'building' | 'preview' | 'awaiting_launch' | 'launched';
```

---

## Section Content Schemas

### HeroContent

```typescript
interface HeroContent {
  headline: string;                // Max 100 chars
  subheadline: string;             // Max 200 chars
  cta: {
    primary: string;               // Primary button text
    primaryAction: string;         // Link or action
    secondary?: string;            // Optional secondary button
    secondaryAction?: string;
  };
  backgroundStyle: 'image' | 'gradient' | 'solid';
  backgroundImage?: string;        // URL if image style
}
```

### ServicesContent (Service Industry)

```typescript
interface ServicesContent {
  sectionTitle: string;
  sectionSubtitle?: string;
  services: Array<{
    id: string;
    title: string;                 // Max 50 chars
    description: string;           // Max 200 chars
    icon?: string;                 // Icon name from library
    features?: string[];           // Optional feature list
  }>;                              // Min 1, max 12 services
}
```

### MenuContent (Local Industry)

```typescript
interface MenuContent {
  sectionTitle: string;
  categories: Array<{
    id: string;
    name: string;
    items: Array<{
      id: string;
      name: string;
      description?: string;
      price?: string;              // Formatted price string
      tags?: string[];             // e.g., "vegetarian", "spicy"
    }>;
  }>;
}
```

### AboutContent

```typescript
interface AboutContent {
  sectionTitle: string;
  headline: string;
  story: string;                   // Max 1000 chars
  highlights?: Array<{
    title: string;
    value: string;
  }>;                              // e.g., "Years in Business": "15+"
  image?: string;
}
```

### ProcessContent (Service Industry)

```typescript
interface ProcessContent {
  sectionTitle: string;
  sectionSubtitle?: string;
  steps: Array<{
    id: string;
    number: number;
    title: string;
    description: string;
  }>;                              // Min 3, max 6 steps
}
```

### PortfolioContent (Service Industry)

```typescript
interface PortfolioContent {
  sectionTitle: string;
  projects: Array<{
    id: string;
    title: string;
    description: string;
    category?: string;
    image?: string;
    link?: string;
  }>;                              // Min 1, max 12 projects
}
```

### TestimonialsContent

```typescript
interface TestimonialsContent {
  sectionTitle: string;
  testimonials: Array<{
    id: string;
    quote: string;                 // Max 500 chars
    author: string;
    role?: string;
    company?: string;
    avatar?: string;
    rating?: number;               // 1-5
  }>;                              // Min 1, max 10
}
```

### LocationContent (Local Industry)

```typescript
interface LocationContent {
  sectionTitle: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
  };
  phone?: string;
  email?: string;
  hours: Array<{
    days: string;                  // e.g., "Monday - Friday"
    hours: string;                 // e.g., "9:00 AM - 5:00 PM"
  }>;
  mapEmbed?: string;               // Google Maps embed URL
}
```

### GalleryContent (Local Industry)

```typescript
interface GalleryContent {
  sectionTitle: string;
  sectionSubtitle?: string;
  images: Array<{
    id: string;
    url: string;
    alt: string;
    caption?: string;
  }>;                              // Min 3, max 20
}
```

### ContactContent

```typescript
interface ContactContent {
  sectionTitle: string;
  headline?: string;
  subtext?: string;
  showForm: boolean;
  formFields?: Array<'name' | 'email' | 'phone' | 'message' | 'subject'>;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
}
```

---

## Database Indexes

```sql
-- Primary lookups
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at);
CREATE INDEX idx_sites_conversation_id ON sites(conversation_id);
CREATE INDEX idx_sites_status ON sites(status);

-- JSONB indexes for efficient querying
CREATE INDEX idx_conversations_industry ON conversations((business_profile->>'industry'));
CREATE INDEX idx_component_usage_analytics ON component_usage(section_type, variant_number, is_override);
```

---

## Validation Summary

All schemas implemented in `lib/schemas/` using Zod with the following guarantees:
- Type safety at compile time and runtime
- Clear error messages for invalid data
- Consistent validation across API routes and client
- Export types for use throughout codebase

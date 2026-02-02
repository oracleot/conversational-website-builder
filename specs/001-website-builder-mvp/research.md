# Research: AI-Powered Conversational Website Builder MVP

**Feature Branch**: `001-website-builder-mvp`  
**Date**: 2026-02-02  
**Status**: Complete

## Overview

This document consolidates research findings for all technology choices, integration patterns, and architectural decisions for the Website Builder MVP.

---

## 1. AI Orchestration Strategy

### Decision: Dual-Model Approach via OpenRouter (GPT-4o + GPT-4o-mini)

**Rationale**: Optimize for both quality and cost by using the appropriate model for each task. OpenRouter provides model-agnostic access enabling easy provider switching.

| Task | Model | Reasoning |
|------|-------|-----------|
| Conversation orchestration | GPT-4o (or Claude 3.5 Sonnet) | Requires nuanced understanding, contextual awareness, and natural dialogue |
| Content extraction | GPT-4o-mini | Structured output extraction is simpler, 10x cost reduction |
| Variant selection | GPT-4o-mini | Pattern matching against personality matrix, low complexity |

**OpenRouter Benefits**:
- Single API key for multiple providers (OpenAI, Anthropic, Google, etc.)
- Easy model switching without code changes
- Fallback routing if primary model is unavailable
- Usage tracking across all models

**Cost Analysis (per site build)**:
- Orchestration (~15 conversational turns): ~$0.50
- Extraction (7 sections × ~500 tokens): ~$0.20
- Variant selection (7 sections): ~$0.05
- **Total**: ~$0.75 (well under $2 budget)

**Alternatives Considered**:
- **Single GPT-4o for all**: Higher quality but ~$3-4 per site, exceeds budget
- **Direct OpenAI API**: Works but locks into single provider; OpenRouter preferred for flexibility
- **Fine-tuned model**: Overkill for MVP, would require significant training data

---

## 2. Conversation Flow Architecture

### Decision: Step-Based State Machine with Flexible Transitions

**Rationale**: Users need guided flow but with ability to backtrack and edit.

**Conversation Steps**:
```
INDUSTRY_SELECTION → BUSINESS_PROFILE → HERO → SERVICES → ABOUT → 
TESTIMONIALS → PORTFOLIO/MENU → CONTACT → REVIEW → LAUNCH
```

**State Transitions**:
- Linear forward progression by default
- Any completed step accessible for editing (non-linear backtrack)
- Step completion stored in conversation state
- AI determines when sufficient info gathered per step

**Implementation Pattern**:
```typescript
interface ConversationState {
  currentStep: ConversationStep;
  completedSteps: ConversationStep[];
  businessProfile: Partial<BusinessProfile>;
  sections: SectionConfig[];
  messages: Message[];
}
```

**Alternatives Considered**:
- **Free-form conversation**: Better UX but unpredictable, harder to ensure coverage
- **Rigid wizard**: Too restrictive, doesn't feel conversational
- **Agent-based (multi-tool)**: Over-engineered for structured flow

---

## 3. Content Extraction Strategy

### Decision: Section-Specific Extraction Prompts with Zod Validation

**Rationale**: Each section type has distinct data requirements requiring tailored prompts.

**Extraction Pattern**:
1. User provides natural language response
2. GPT-4o-mini receives section-specific prompt + user text
3. Model outputs JSON matching section schema
4. Zod validates output, rejects invalid responses
5. If validation fails, retry with clarification request

**OpenRouter + Zod Integration**:
```typescript
import OpenAI from 'openai';

// OpenRouter-compatible client
const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

const extractedContent = await openrouter.chat.completions.create({
  model: 'openai/gpt-4o-mini', // OpenRouter model format
  response_format: { type: 'json_object' },
  messages: [
    { role: 'system', content: sectionExtractionPrompt },
    { role: 'user', content: userMessage }
  ]
});
const validated = SectionSchema.parse(JSON.parse(extractedContent));
```

**Accuracy Target**: >85% first-pass accuracy (user confirms without edits)

**Alternatives Considered**:
- **Manual form input**: Defeats conversational UX goal
- **Single generic extractor**: Lower accuracy, needs post-processing
- **LangChain structured output**: Additional dependency, OpenRouter + OpenAI SDK sufficient

---

## 4. Live Preview Architecture

### Decision: Client-Side Rendering with Zustand State

**Rationale**: Sub-3-second updates require client-side rendering without server round-trips.

**State Management**:
```typescript
// Zustand store for site configuration
interface SiteStore {
  config: SiteConfig;
  updateSection: (index: number, section: SectionConfig) => void;
  setVariant: (sectionIndex: number, variant: number) => void;
  addSection: (section: SectionConfig) => void;
}
```

**Component Loading Strategy**:
- Dynamic imports with `next/dynamic`
- Component registry maps `{industry}-{section}-{variant}` to lazy-loaded components
- Preload adjacent variants for instant switching

**Preview Update Flow**:
1. User confirms section in chat
2. Zustand store updates immediately (optimistic)
3. Preview re-renders affected section
4. Background sync to Supabase for persistence

**Alternatives Considered**:
- **Server-side rendering**: Higher latency, overkill for preview
- **React Query/SWR**: Over-engineered for single-user session state
- **Context API**: Less performant for frequent updates

---

## 5. Component Variant System

### Decision: 5 Variants per Section with Personality Matrix

**Rationale**: 5 variants provide meaningful choice without overwhelming complexity.

**Personality Matrix**:
| Variant | Personality Traits |
|---------|-------------------|
| 1 | professional, corporate, trustworthy, traditional |
| 2 | modern, minimal, clean, tech |
| 3 | bold, creative, artistic, unique |
| 4 | elegant, luxury, sophisticated, premium |
| 5 | friendly, approachable, casual, warm |

**Variant Selection Algorithm**:
```typescript
async function selectVariant(
  brandPersonality: string[],
  sectionType: SectionType
): Promise<{ variant: number; confidence: number; reasoning: string }> {
  // Calculate cosine similarity between brand traits and variant traits
  // Return highest match with explanation
}
```

**Selection Criteria**:
- Match overlap with brand personality traits
- Industry-appropriate defaults (local businesses skew friendly, service skew professional)
- User override history (learn from corrections)

**Alternatives Considered**:
- **3 variants**: Insufficient design diversity
- **10 variants**: Too many to maintain, diminishing returns
- **Dynamic generation**: Inconsistent quality, breaks "no AI look" promise

---

## 6. Database Schema Design

### Decision: Supabase with JSONB for Flexible Content Storage

**Rationale**: JSONB allows evolving content schemas without migrations.

**Schema Highlights**:

```sql
-- Core tables
users (id, email, created_at)
conversations (id, user_id, current_step, business_profile JSONB, messages JSONB[])
sites (id, conversation_id, config JSONB, status, preview_url, export_url)
component_usage (id, site_id, section_type, variant_number, is_override, selected_at)
```

**JSONB Benefits**:
- Section schemas can evolve without ALTER TABLE
- Efficient querying with GIN indexes
- Native Postgres support, no ORM complexity

**Realtime Integration**:
- Subscribe to `sites` table changes for multi-device sync
- Broadcast section updates for collaborative editing (future)

**Alternatives Considered**:
- **Normalized tables**: Requires schema changes for each section type
- **MongoDB**: Another dependency, Postgres sufficient
- **Redis for state**: Additional complexity, Supabase handles persistence

---

## 7. Authentication Strategy

### Decision: Supabase Auth with Magic Link

**Rationale**: Magic link removes password friction for non-technical users.

**Flow**:
1. User enters email
2. Supabase sends magic link
3. User clicks link, redirected to `/callback`
4. Session established, conversation ownership assigned

**Anonymous → Authenticated Transition**:
- Users can start conversation anonymously
- Prompted to sign in before saving progress
- Anonymous conversation linked to authenticated user on sign-in

**Session Management**:
- JWT tokens with 7-day expiry
- Refresh tokens for persistent sessions
- Supabase handles token rotation automatically

**Alternatives Considered**:
- **Password auth**: Friction for target audience
- **OAuth (Google/GitHub)**: Enterprise associations, not SMB-friendly
- **Phone OTP**: Additional complexity, international issues

---

## 8. Export Generation Strategy

### Decision: Template-Based Assembly with AST Manipulation

**Rationale**: Generate clean, editable code by copying and transforming component sources.

**Generation Process**:
1. Read base Next.js template files
2. Copy only selected component variants
3. Inject user content as default prop values
4. Generate theme CSS from color palette
5. Create page.tsx assembling sections
6. Bundle as ZIP or push to GitHub

**Template Structure**:
```
export-template/
├── package.json.template
├── next.config.ts.template
├── tailwind.config.ts.template
├── app/
│   ├── page.tsx.template
│   └── globals.css.template
└── README.md.template
```

**Content Injection**:
```typescript
// Transform component to include default content
const component = await fs.readFile(componentPath);
const injected = injectDefaultProps(component, sectionContent);
```

**Alternatives Considered**:
- **Full SSG build**: Slow, 45+ seconds
- **Copy entire codebase**: Bloated, includes unused variants
- **Serverless function export**: Cold start issues

---

## 9. Email Integration

### Decision: Resend for Transactional Email

**Rationale**: Developer-friendly API, excellent deliverability, React components for templates.

**Email Types**:
| Type | Trigger | Content |
|------|---------|---------|
| Magic Link | Auth request | Login link |
| Launch Confirmation | User submits launch | Confirmation + timeline |
| Team Notification | Launch request | Site preview + user preferences |

**React Email Templates**:
```typescript
// lib/email/templates/launch-confirmation.tsx
export const LaunchConfirmation = ({ businessName, previewUrl }) => (
  <Html>
    <Body>
      <Heading>Your {businessName} website is ready!</Heading>
      <Button href={previewUrl}>View Preview</Button>
      <Text>A consultant will contact you within 24 hours.</Text>
    </Body>
  </Html>
);
```

**Alternatives Considered**:
- **SendGrid**: More enterprise-focused, complex setup
- **AWS SES**: Requires additional infrastructure
- **Postmark**: Good alternative, Resend selected for DX

---

## 10. Testing Strategy

### Decision: Vitest + Playwright + AI Output Fixtures

**Rationale**: Comprehensive coverage across unit, integration, and E2E layers.

**Test Layers**:

| Layer | Tool | Coverage |
|-------|------|----------|
| Unit | Vitest | Schema validation, variant selection, utility functions |
| Integration | Vitest + MSW | API routes, orchestrator flow, database queries |
| Contract | Vitest | AI output parsing against fixtures |
| E2E | Playwright | Full conversation flows for both industries |

**AI Output Testing**:
- Fixture library of sample user inputs and expected extractions
- Mock AI responses for deterministic testing
- Accuracy measured against fixture set

**Performance Testing**:
- Vitest benchmarks for component render times
- Playwright timing for preview updates
- Export generation duration tracking

**Alternatives Considered**:
- **Jest**: Vitest faster, better ESM support
- **Cypress**: Playwright better for Next.js, faster execution
- **No mocking**: Non-deterministic AI tests, unreliable CI

---

## 11. Deployment Architecture

### Decision: Single Vercel Project with Edge Functions

**Rationale**: Unified deployment, optimal for Next.js, handles both platform and generated sites.

**Platform Deployment**:
- Main app deployed to Vercel
- Edge Runtime for API routes (low latency)
- Supabase Postgres in same region (US East)

**User Site Deployment**:
- Generated projects pushed to user's GitHub (optional)
- One-click Vercel deploy from generated repo
- Alternative: Direct ZIP download for manual hosting

**Environment Configuration**:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_KEY=sb_publishable_
SUPABASE_SECRET_KEY=sb_secret_
OPENROUTER_API_KEY=
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
RESEND_API_KEY=
```

**Note**: Using modern Supabase API keys (publishable/secret) instead of legacy anon/service_role keys.

**Alternatives Considered**:
- **Separate staging/production**: Over-engineered for MVP
- **Self-hosted**: Vercel DX superior for Next.js
- **Cloudflare Pages**: Less Next.js integration

---

## 12. Error Handling & Recovery

### Decision: Graceful Degradation with User-Facing Recovery Actions

**Rationale**: Non-technical users need clear recovery paths, not technical error messages.

**Error Categories**:

| Category | Handling | User Message |
|----------|----------|--------------|
| AI extraction fails | Retry once, then show manual fields | "Let me get that right. Can you tell me more about..." |
| API timeout | Retry with backoff | "Taking longer than usual. Retrying..." |
| Export fails | Log error, offer retry | "Export had an issue. Click to try again." |
| Auth error | Clear session, redirect to login | "Session expired. Please sign in again." |
| Network offline | Local state preserved | "You're offline. Changes will save when reconnected." |

**Logging**:
- Structured logging to Vercel Logs
- Error tracking with Sentry (post-MVP)
- AI interaction logs for accuracy improvement

**Alternatives Considered**:
- **Silent retries only**: Users confused by delays
- **Technical error messages**: Intimidating for target audience

---

## Dependency Versions

| Package | Version | Purpose |
|---------|---------|---------|
| next | 15.x | Framework |
| react | 19.x | UI library |
| typescript | 5.x | Type safety |
| tailwindcss | 4.x | Styling |
| framer-motion | 11.x | Animations |
| zod | 3.x | Schema validation |
| @supabase/supabase-js | 2.x | Database client |
| ai | 3.x | Vercel AI SDK |
| openai | 4.x | OpenAI SDK (OpenRouter-compatible) |
| resend | 2.x | Email |
| zustand | 5.x | State management |

---

## Open Questions (Resolved)

All clarifications resolved in spec:
- ✅ Authentication: Magic link
- ✅ Anonymous access: Allowed until save
- ✅ Conversation retention: 30 days
- ✅ Payment gate: Export and launch
- ✅ AI failure handling: Show raw input for manual entry

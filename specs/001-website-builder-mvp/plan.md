# Implementation Plan: AI-Powered Conversational Website Builder MVP

**Branch**: `001-website-builder-mvp` | **Date**: 2026-02-02 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-website-builder-mvp/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a hybrid SaaS platform where small business owners chat their way through website creation, see live previews as they go, and get human-assisted launch. The system uses pre-built, industry-specific component variants (5 per section type) with AI orchestrating selection and content injection. MVP supports 2 industries (Service + Local businesses) with extensible architecture. Technical approach uses GPT-4o for conversation orchestration, GPT-4o-mini for content extraction, Supabase for persistence, and generates deployable Next.js projects on export.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 15 App Router (strict mode enabled)  
**Primary Dependencies**: React 19, Tailwind CSS, Framer Motion, Zod, Vercel AI SDK (`ai`), OpenAI SDK, @supabase/supabase-js, Resend  
**Storage**: Supabase (PostgreSQL + Realtime + Auth)  
**Testing**: Vitest for unit tests, Playwright for E2E, React Testing Library for components  
**Target Platform**: Modern web browsers (Chrome, Safari, Firefox, Edge), Vercel deployment  
**Project Type**: Web application (Next.js full-stack)  
**Performance Goals**: 
- Preview render: <3 seconds per section
- Conversation completion: <15 minutes
- Export generation: <45 seconds
- 100 concurrent conversations without degradation  
**Constraints**: 
- AI API cost: <$2 per site build
- Database queries: <100ms for conversation state retrieval
- Export must deploy successfully to Vercel without modification  
**Scale/Scope**: 
- 2 industry types (service, local)
- 7 section types per industry
- 5 variants per section type (70+ components total)
- Magic link authentication

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Component-First Architecture ✅

| Requirement | Compliance | Notes |
|-------------|------------|-------|
| Components use `BaseSectionProps<T>` pattern | ✅ Planned | All section components will follow this interface |
| Components independently renderable | ✅ Planned | No parent context dependencies |
| No hard-coded business content | ✅ Planned | All content flows through props |
| 5 variants with documented personalities | ✅ Planned | Personality matrix in registry |
| Shared components cross-industry compatible | ✅ Planned | testimonials, contact, about reusable |

### II. Test-Driven Quality ✅

| Requirement | Compliance | Notes |
|-------------|------------|-------|
| Unit tests for extraction (>85% accuracy) | ✅ Planned | Test fixtures per section type |
| Integration tests for conversation flow | ✅ Planned | E2E coverage with Playwright |
| Contract tests for AI outputs | ✅ Planned | Structured output parsing validation |
| Red-Green-Refactor enforced | ✅ Workflow | Tests before implementation |

### III. UX Consistency ✅

| Requirement | Compliance | Notes |
|-------------|------------|-------|
| Preview updates <3 seconds | ✅ Planned | Local state + optimistic UI |
| Progress tracking | ✅ Planned | Step indicator component |
| Variant switcher accessible | ✅ Planned | Hover/tap carousel without reload |
| Framer Motion animations | ✅ Planned | Consistent with existing patterns |
| Actionable error states | ✅ Planned | Recovery paths documented |
| Mobile responsive | ✅ Planned | Breakpoint testing for chat/preview |

### IV. Performance Requirements ✅

| Requirement | Compliance | Notes |
|-------------|------------|-------|
| <15 min conversation | ✅ Planned | Optimized flow design |
| <3s preview render | ✅ Planned | Client-side rendering |
| <45s export | ✅ Planned | Template assembly approach |
| <$2 AI cost per site | ✅ Planned | GPT-4o-mini for extraction |
| <100ms DB queries | ✅ Planned | Indexed queries, minimal data |
| Lazy loading | ✅ Planned | Viewport + 1 ahead strategy |

### Technology Standards Compliance ✅

| Standard | Compliance |
|----------|------------|
| Next.js 15 App Router + TypeScript strict | ✅ |
| Tailwind CSS + Framer Motion | ✅ |
| Supabase + Zod schemas | ✅ |
| GPT-4o orchestration + GPT-4o-mini extraction | ✅ |
| Vercel deployment | ✅ |
| Resend for emails | ✅ |
| Component naming convention | ✅ |
| frontend-design / vercel-react-best-practices skills | ✅ |
| shadcn/ui component check | ✅ |

**Gate Status**: ✅ PASSED - Proceeding to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-website-builder-mvp/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── conversation-api.yaml    # Chat and orchestration endpoints
│   ├── site-api.yaml            # Site CRUD and export endpoints
│   └── launch-api.yaml          # Launch request endpoints
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
app/
├── (auth)/
│   ├── login/page.tsx           # Magic link login
│   └── callback/page.tsx        # Auth callback
├── builder/
│   └── [conversationId]/
│       └── page.tsx             # Split-screen builder interface
├── api/
│   ├── chat/route.ts            # Streaming chat endpoint
│   ├── conversation/route.ts    # Conversation CRUD
│   ├── site/route.ts            # Site config CRUD
│   ├── export/route.ts          # Project export
│   └── launch/route.ts          # Launch request handling
├── globals.css
├── layout.tsx
└── page.tsx                     # Landing/home page

components/
├── sections/
│   ├── hero/
│   │   ├── service-hero-1.tsx through service-hero-5.tsx
│   │   └── local-hero-1.tsx through local-hero-5.tsx
│   ├── services/
│   │   ├── service-offerings-1.tsx through service-offerings-5.tsx
│   │   └── local-menu-1.tsx through local-menu-5.tsx
│   ├── about/
│   │   └── shared-about-1.tsx through shared-about-5.tsx
│   ├── testimonials/
│   │   └── shared-testimonials-1.tsx through shared-testimonials-5.tsx
│   ├── contact/
│   │   └── shared-contact-1.tsx through shared-contact-5.tsx
│   ├── process/
│   │   └── service-process-1.tsx through service-process-5.tsx
│   ├── portfolio/
│   │   └── service-portfolio-1.tsx through service-portfolio-5.tsx
│   ├── location/
│   │   └── local-location-1.tsx through local-location-5.tsx
│   └── gallery/
│       └── local-gallery-1.tsx through local-gallery-5.tsx
├── chat/
│   ├── chat-interface.tsx       # Main chat UI component
│   ├── message-list.tsx         # Message display
│   ├── chat-input.tsx           # User input
│   └── progress-indicator.tsx   # Conversation progress
├── preview/
│   ├── site-preview.tsx         # Live preview renderer
│   ├── section-wrapper.tsx      # Hover variant selector
│   └── variant-carousel.tsx     # Alternative variants display
├── builder/
│   ├── builder-layout.tsx       # Split-screen container
│   └── launch-modal.tsx         # Ready to Launch form
└── ui/
    └── [shadcn components]      # Button, Input, Dialog, etc.

lib/
├── schemas/
│   ├── business-profile.ts      # BusinessProfile Zod schema
│   ├── section-content.ts       # Hero, Services, etc. schemas
│   ├── site-config.ts           # Full site config schema
│   └── index.ts                 # Schema exports
├── chat/
│   ├── orchestrator.ts          # ConversationOrchestrator class
│   ├── prompts.ts               # System prompts for AI
│   └── variant-selector.ts      # AI variant selection logic
├── registry/
│   ├── components.ts            # Component registry for AI
│   ├── variant-personalities.ts # Personality matrix
│   └── industries.ts            # Industry configurations
├── preview/
│   └── component-loader.ts      # Dynamic component imports
├── export/
│   └── project-generator.ts     # Export project builder
├── db/
│   ├── client.ts                # Supabase client
│   ├── queries.ts               # Database queries
│   └── types.ts                 # Database types
├── email/
│   └── templates.ts             # Email templates for Resend
└── utils.ts

tests/
├── unit/
│   ├── extraction.test.ts       # Content extraction tests
│   ├── variant-selection.test.ts
│   └── schemas.test.ts
├── integration/
│   ├── conversation-flow.test.ts
│   └── export.test.ts
├── contract/
│   └── ai-outputs.test.ts       # AI structured output contracts
└── e2e/
    ├── service-business.spec.ts # Full flow service business
    └── local-business.spec.ts   # Full flow local business
```

**Structure Decision**: Web application with Next.js App Router. Frontend and backend colocated in `app/` with API routes. Component library in `components/sections/` follows constitution naming convention. All schemas centralized in `lib/schemas/` with Zod validation.

## Complexity Tracking

> No constitution violations identified. All requirements align with defined principles.

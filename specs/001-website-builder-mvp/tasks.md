# Tasks: AI-Powered Conversational Website Builder MVP

**Input**: Design documents from `/specs/001-website-builder-mvp/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1-US6 maps to user stories from spec.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and tooling configuration

- [X] T001 Install core dependencies: ai, openai (OpenRouter-compatible), @supabase/supabase-js, zod, zustand, framer-motion, resend
- [X] T002 [P] Configure TypeScript strict mode in tsconfig.json
- [X] T003 [P] Add shadcn/ui components: Button, Input, Dialog, Card, Textarea, ScrollArea, Skeleton
- [X] T004 [P] Configure Vitest for unit testing in vitest.config.ts
- [X] T005 [P] Configure Playwright for E2E testing in playwright.config.ts
- [X] T006 Create environment variables template in .env.example\n- [X] T006a Create OpenRouter-compatible AI client wrapper in lib/ai/client.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database & Auth

- [X] T007 Create Supabase client wrapper in lib/db/client.ts
- [X] T008 [P] Create database types from schema in lib/db/types.ts
- [X] T009 Run database migrations for users, conversations, sites, component_usage tables
- [X] T010 [P] Implement magic link auth flow in app/(auth)/login/page.tsx
- [X] T011 [P] Implement auth callback handler in app/(auth)/callback/page.tsx

### Zod Schemas (All User Stories Depend On)

- [X] T012 [P] Create BusinessProfile schema in lib/schemas/business-profile.ts
- [X] T013 [P] Create HeroContent schema in lib/schemas/section-content.ts
- [X] T014 [P] Create ServicesContent schema in lib/schemas/section-content.ts
- [X] T015 [P] Create AboutContent schema in lib/schemas/section-content.ts
- [X] T016 [P] Create TestimonialsContent schema in lib/schemas/section-content.ts
- [X] T017 [P] Create ContactContent schema in lib/schemas/section-content.ts
- [X] T018 [P] Create ProcessContent schema in lib/schemas/section-content.ts
- [X] T019 [P] Create PortfolioContent schema in lib/schemas/section-content.ts
- [X] T020 [P] Create MenuContent schema in lib/schemas/section-content.ts
- [X] T021 [P] Create LocationContent schema in lib/schemas/section-content.ts
- [X] T022 [P] Create GalleryContent schema in lib/schemas/section-content.ts
- [X] T023 [P] Create SiteConfig schema in lib/schemas/site-config.ts
- [X] T024 [P] Create ThemeConfig schema in lib/schemas/site-config.ts
- [X] T025 [P] Create LaunchPreferences schema in lib/schemas/site-config.ts
- [X] T026 Create schema barrel exports in lib/schemas/index.ts

### Registries (Component & Industry Config)

- [X] T027 [P] Create variant personality matrix in lib/registry/variant-personalities.ts
- [X] T028 [P] Create industry configurations in lib/registry/industries.ts
- [X] T029 Create component registry in lib/registry/components.ts

### Database Queries

- [X] T030 [P] Implement conversation CRUD queries in lib/db/queries.ts
- [X] T031 [P] Implement site CRUD queries in lib/db/queries.ts
- [X] T032 [P] Implement component usage tracking in lib/db/queries.ts

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Guided Conversation for Business Website (Priority: P1) 🎯 MVP

**Goal**: Small business owners complete a guided chat conversation to build their website configuration step by step

**Independent Test**: Start a new conversation, answer prompts for a fictional consulting business, verify structured content extraction works

### AI Orchestration for US1

- [ ] T033 [US1] Create system prompts for conversation orchestration in lib/chat/prompts.ts
- [ ] T034 [US1] Create content extraction prompts per section type in lib/chat/prompts.ts
- [ ] T035 [US1] Implement ConversationOrchestrator class in lib/chat/orchestrator.ts
- [ ] T036 [US1] Implement content extraction with Zod validation in lib/chat/orchestrator.ts

### API Routes for US1

- [ ] T037 [US1] Implement POST /api/conversation (create) in app/api/conversation/route.ts
- [ ] T038 [US1] Implement GET /api/conversation/[id] in app/api/conversation/[conversationId]/route.ts
- [ ] T039 [US1] Implement PATCH /api/conversation/[id] in app/api/conversation/[conversationId]/route.ts
- [ ] T040 [US1] Implement POST /api/chat (streaming) in app/api/chat/route.ts
- [ ] T041 [US1] Implement POST /api/conversation/[id]/extract in app/api/conversation/[conversationId]/extract/route.ts

### Chat UI Components for US1

- [ ] T042 [P] [US1] Create chat-input component in components/chat/chat-input.tsx
- [ ] T043 [P] [US1] Create message-list component in components/chat/message-list.tsx
- [ ] T044 [P] [US1] Create progress-indicator component in components/chat/progress-indicator.tsx
- [ ] T045 [US1] Create chat-interface component in components/chat/chat-interface.tsx

### Builder Page for US1

- [ ] T046 [US1] Create builder-layout component in components/builder/builder-layout.tsx
- [ ] T047 [US1] Create builder page in app/builder/[conversationId]/page.tsx
- [ ] T048 [US1] Create Zustand store for conversation state in lib/stores/conversation-store.ts
- [ ] T048a [US1] Integrate progress-indicator into chat-interface and builder-layout for conversation step tracking

### Tests for US1 (RED-GREEN-REFACTOR)

- [ ] T048b [P] [US1] Write unit tests for ConversationOrchestrator in tests/unit/orchestrator.test.ts
- [ ] T048c [P] [US1] Write unit tests for content extraction in tests/unit/extraction.test.ts
- [ ] T048d [P] [US1] Write contract tests for AI structured outputs in tests/contract/ai-outputs.test.ts
- [ ] T048e [US1] Write integration tests for conversation API endpoints in tests/integration/conversation-api.test.ts

**Checkpoint**: User Story 1 complete - Users can have a full guided conversation and see structured content extracted

---

## Phase 4: User Story 2 - Live Preview Updates (Priority: P2)

**Goal**: Preview updates in real-time as users complete each section, split-screen interface with smooth animations

**Independent Test**: Complete hero section, verify preview panel updates within 3 seconds with rendered component

### Core Section Components (Service Industry)

- [ ] T049 [P] [US2] Create service-hero-1.tsx (professional) in components/sections/hero/
- [ ] T050 [P] [US2] Create service-hero-2.tsx (modern) in components/sections/hero/
- [ ] T051 [P] [US2] Create service-hero-3.tsx (bold) in components/sections/hero/
- [ ] T052 [P] [US2] Create service-hero-4.tsx (elegant) in components/sections/hero/
- [ ] T053 [P] [US2] Create service-hero-5.tsx (friendly) in components/sections/hero/
- [ ] T054 [P] [US2] Create service-offerings-1.tsx in components/sections/services/
- [ ] T055 [P] [US2] Create service-offerings-2.tsx in components/sections/services/
- [ ] T056 [P] [US2] Create service-offerings-3.tsx in components/sections/services/
- [ ] T057 [P] [US2] Create service-offerings-4.tsx in components/sections/services/
- [ ] T058 [P] [US2] Create service-offerings-5.tsx in components/sections/services/
- [ ] T059 [P] [US2] Create shared-about-1.tsx in components/sections/about/
- [ ] T060 [P] [US2] Create shared-about-2.tsx in components/sections/about/
- [ ] T061 [P] [US2] Create shared-about-3.tsx in components/sections/about/
- [ ] T062 [P] [US2] Create shared-about-4.tsx in components/sections/about/
- [ ] T063 [P] [US2] Create shared-about-5.tsx in components/sections/about/
- [ ] T064 [P] [US2] Create service-process-1.tsx in components/sections/process/
- [ ] T065 [P] [US2] Create service-process-2.tsx in components/sections/process/
- [ ] T066 [P] [US2] Create service-process-3.tsx in components/sections/process/
- [ ] T067 [P] [US2] Create service-process-4.tsx in components/sections/process/
- [ ] T068 [P] [US2] Create service-process-5.tsx in components/sections/process/
- [ ] T069 [P] [US2] Create shared-testimonials-1.tsx in components/sections/testimonials/
- [ ] T070 [P] [US2] Create shared-testimonials-2.tsx in components/sections/testimonials/
- [ ] T071 [P] [US2] Create shared-testimonials-3.tsx in components/sections/testimonials/
- [ ] T072 [P] [US2] Create shared-testimonials-4.tsx in components/sections/testimonials/
- [ ] T073 [P] [US2] Create shared-testimonials-5.tsx in components/sections/testimonials/
- [ ] T074 [P] [US2] Create service-portfolio-1.tsx in components/sections/portfolio/
- [ ] T075 [P] [US2] Create service-portfolio-2.tsx in components/sections/portfolio/
- [ ] T076 [P] [US2] Create service-portfolio-3.tsx in components/sections/portfolio/
- [ ] T077 [P] [US2] Create service-portfolio-4.tsx in components/sections/portfolio/
- [ ] T078 [P] [US2] Create service-portfolio-5.tsx in components/sections/portfolio/
- [ ] T079 [P] [US2] Create shared-contact-1.tsx in components/sections/contact/
- [ ] T080 [P] [US2] Create shared-contact-2.tsx in components/sections/contact/
- [ ] T081 [P] [US2] Create shared-contact-3.tsx in components/sections/contact/
- [ ] T082 [P] [US2] Create shared-contact-4.tsx in components/sections/contact/
- [ ] T083 [P] [US2] Create shared-contact-5.tsx in components/sections/contact/

### Preview System for US2

- [ ] T084 [US2] Create dynamic component loader in lib/preview/component-loader.ts
- [ ] T085 [US2] Create site-preview component in components/preview/site-preview.tsx
- [ ] T086 [US2] Create section-wrapper component with hover state in components/preview/section-wrapper.tsx
- [ ] T087 [US2] Create Zustand store for site config in lib/stores/site-store.ts
- [ ] T088 [US2] Integrate preview into builder-layout with split-screen in components/builder/builder-layout.tsx
- [ ] T089 [US2] Add smooth scroll to newly added sections in components/preview/site-preview.tsx
- [ ] T090 [US2] Add Framer Motion animations for section transitions in components/preview/section-wrapper.tsx

### Site API for US2

- [ ] T091 [US2] Implement POST /api/site (create from conversation) in app/api/site/route.ts
- [ ] T092 [US2] Implement GET /api/site/[id] in app/api/site/[siteId]/route.ts
- [ ] T093 [US2] Implement PATCH /api/site/[id] in app/api/site/[siteId]/route.ts
- [ ] T094 [US2] Implement POST /api/site/[id]/section in app/api/site/[siteId]/section/route.ts
- [ ] T095 [US2] Implement PATCH /api/site/[id]/section/[sectionId] in app/api/site/[siteId]/section/[sectionId]/route.ts

### Tests for US2 (RED-GREEN-REFACTOR)

- [ ] T095a [P] [US2] Write unit tests for component-loader in tests/unit/component-loader.test.ts
- [ ] T095b [P] [US2] Write component rendering tests for section components in tests/unit/sections.test.ts
- [ ] T095c [US2] Write integration tests for site API endpoints in tests/integration/site-api.test.ts

**Checkpoint**: User Story 2 complete - Live preview updates in real-time with professional service business components

---

## Phase 5: User Story 3 - AI Variant Selection with Override (Priority: P3)

**Goal**: AI automatically selects best variant based on brand personality, users can browse and switch alternatives

**Independent Test**: Complete business profile with "elegant, luxury" traits, verify system selects variant 4 for hero section

### Variant Selection Logic for US3

- [ ] T096 [US3] Implement variant selection algorithm in lib/chat/variant-selector.ts
- [ ] T097 [US3] Create variant selection prompt in lib/chat/prompts.ts
- [ ] T098 [US3] Implement POST /api/site/[id]/variant endpoint in app/api/site/[siteId]/variant/route.ts

### Variant Override UI for US3

- [ ] T099 [US3] Create variant-carousel component in components/preview/variant-carousel.tsx
- [ ] T100 [US3] Add "See other options" trigger to section-wrapper in components/preview/section-wrapper.tsx
- [ ] T101 [US3] Display AI reasoning badge in section-wrapper in components/preview/section-wrapper.tsx
- [ ] T102 [US3] Implement variant switch with instant preview update in components/preview/variant-carousel.tsx
- [ ] T103 [US3] Record variant override to component_usage table via existing query from T032

### Tests for US3 (RED-GREEN-REFACTOR)

- [ ] T103a [P] [US3] Write unit tests for variant-selector algorithm in tests/unit/variant-selector.test.ts
- [ ] T103b [US3] Write integration tests for variant switching in tests/integration/variant-api.test.ts

**Checkpoint**: User Story 3 complete - AI selects variants with reasoning, users can override easily

---

## Phase 6: User Story 4 - Export Deployable Website Project (Priority: P4)

**Goal**: Generate a complete, deployable Next.js project with user content and selected variants

**Independent Test**: Complete full website, click export, download project, deploy to Vercel successfully

### Export System for US4

- [ ] T104 [US4] Create export templates in lib/export/templates/ (package.json, next.config.ts, etc.)
- [ ] T105 [US4] Implement ProjectGenerator class in lib/export/project-generator.ts
- [ ] T106 [US4] Implement component copy with content injection in lib/export/project-generator.ts
- [ ] T107 [US4] Implement theme CSS generation from color palette in lib/export/project-generator.ts
- [ ] T108 [US4] Implement ZIP bundling for download in lib/export/project-generator.ts
- [ ] T109 [US4] Implement POST /api/export endpoint in app/api/export/route.ts
- [ ] T110 [US4] Add export button to builder interface in components/builder/builder-layout.tsx
- [ ] T111 [US4] Add export progress and download UI in components/builder/export-modal.tsx

### Tests for US4 (RED-GREEN-REFACTOR)

- [ ] T111a [P] [US4] Write unit tests for ProjectGenerator in tests/unit/project-generator.test.ts
- [ ] T111b [US4] Write integration tests for export endpoint in tests/integration/export-api.test.ts
- [ ] T111c [US4] Write E2E test for full export flow in tests/e2e/export.spec.ts

**Checkpoint**: User Story 4 complete - Export generates deployable Next.js project in <45 seconds

---

## Phase 7: User Story 5 - Launch Handoff Workflow (Priority: P5)

**Goal**: Users submit launch request with preferences, system notifies consultant team

**Independent Test**: Complete "Ready to Launch" flow, verify user and team emails are sent

### Email System for US5

- [ ] T112 [P] [US5] Create launch confirmation email template in lib/email/templates.ts
- [ ] T113 [P] [US5] Create team notification email template in lib/email/templates.ts
- [ ] T114 [US5] Implement email sending with Resend in lib/email/send.ts

### Launch API for US5

- [ ] T115 [US5] Implement POST /api/launch endpoint in app/api/launch/route.ts
- [ ] T116 [US5] Implement GET /api/launch/[id] (status) in app/api/launch/[launchId]/route.ts

### Launch UI for US5

- [ ] T117 [US5] Create launch-modal component with form in components/builder/launch-modal.tsx
- [ ] T118 [US5] Add "Ready to Launch" button to builder in components/builder/builder-layout.tsx
- [ ] T119 [US5] Add launch status display in builder in components/builder/builder-layout.tsx

### Tests for US5 (RED-GREEN-REFACTOR)

- [ ] T119a [P] [US5] Write unit tests for email templates in tests/unit/email.test.ts
- [ ] T119b [US5] Write integration tests for launch API endpoints in tests/integration/launch-api.test.ts

**Checkpoint**: User Story 5 complete - Launch request workflow with email notifications functional

---

## Phase 8: User Story 6 - Local Business Conversation Flow (Priority: P6)

**Goal**: Local business owners (restaurants, salons) have industry-appropriate conversation flow and components

**Independent Test**: Select "local business", complete conversation for restaurant, verify menu/location/gallery sections

### Local Business Components for US6

- [ ] T120 [P] [US6] Create local-hero-1.tsx in components/sections/hero/
- [ ] T121 [P] [US6] Create local-hero-2.tsx in components/sections/hero/
- [ ] T122 [P] [US6] Create local-hero-3.tsx in components/sections/hero/
- [ ] T123 [P] [US6] Create local-hero-4.tsx in components/sections/hero/
- [ ] T124 [P] [US6] Create local-hero-5.tsx in components/sections/hero/
- [ ] T125 [P] [US6] Create local-menu-1.tsx in components/sections/services/
- [ ] T126 [P] [US6] Create local-menu-2.tsx in components/sections/services/
- [ ] T127 [P] [US6] Create local-menu-3.tsx in components/sections/services/
- [ ] T128 [P] [US6] Create local-menu-4.tsx in components/sections/services/
- [ ] T129 [P] [US6] Create local-menu-5.tsx in components/sections/services/
- [ ] T130 [P] [US6] Create local-location-1.tsx in components/sections/location/
- [ ] T131 [P] [US6] Create local-location-2.tsx in components/sections/location/
- [ ] T132 [P] [US6] Create local-location-3.tsx in components/sections/location/
- [ ] T133 [P] [US6] Create local-location-4.tsx in components/sections/location/
- [ ] T134 [P] [US6] Create local-location-5.tsx in components/sections/location/
- [ ] T135 [P] [US6] Create local-gallery-1.tsx in components/sections/gallery/
- [ ] T136 [P] [US6] Create local-gallery-2.tsx in components/sections/gallery/
- [ ] T137 [P] [US6] Create local-gallery-3.tsx in components/sections/gallery/
- [ ] T138 [P] [US6] Create local-gallery-4.tsx in components/sections/gallery/
- [ ] T139 [P] [US6] Create local-gallery-5.tsx in components/sections/gallery/

### Local Business Conversation for US6

- [ ] T140 [US6] Add local business extraction prompts in lib/chat/prompts.ts
- [ ] T141 [US6] Update orchestrator for local business section flow in lib/chat/orchestrator.ts
- [ ] T142 [US6] Update component loader for local business variants in lib/preview/component-loader.ts
- [ ] T143 [US6] Update export generator for local business sections in lib/export/project-generator.ts

### Tests for US6 (RED-GREEN-REFACTOR)

- [ ] T143a [P] [US6] Write component rendering tests for local business sections in tests/unit/local-sections.test.ts
- [ ] T143b [US6] Write E2E test for local business flow in tests/e2e/local-business.spec.ts

**Checkpoint**: User Story 6 complete - Full local business support with all 20 industry-specific components

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Quality improvements affecting multiple user stories

### Payment Integration (FR-022)

- [ ] T143c Configure Stripe/LemonSqueezy payment provider in lib/payments/client.ts
- [ ] T143d Create payment checkout flow for export in app/api/checkout/route.ts
- [ ] T143e Create payment success callback handler in app/api/checkout/callback/route.ts
- [ ] T143f Add payment gate check to export endpoint (FR-022) in app/api/export/route.ts
- [ ] T143g Add payment gate check to launch endpoint (FR-022) in app/api/launch/route.ts
- [ ] T143h Create upgrade modal for free users attempting export/launch in components/builder/upgrade-modal.tsx
- [ ] T143i Add watermark overlay to preview for non-paid users in components/preview/site-preview.tsx

### Session Management

- [ ] T143j Implement anonymous session creation with local storage in lib/stores/session-store.ts
- [ ] T143k Implement anonymous→authenticated session linking on magic link login in app/(auth)/callback/page.tsx

### Section Navigation/Editing

- [ ] T143l Add section navigation UI for editing previous sections in components/chat/progress-indicator.tsx
- [ ] T143m Implement conversation rollback for section re-editing in lib/chat/orchestrator.ts

### Placeholder Images

- [ ] T143n Configure Unsplash/Picsum placeholder image service in lib/images/placeholder.ts
- [ ] T143o Integrate placeholder images into all section components with fallback in components/sections/

### Landing Page

- [ ] T144 [P] Create landing page with CTA in app/page.tsx
- [ ] T145 [P] Create "Start Building" flow in app/page.tsx

### Error Handling

- [ ] T146 Add error boundaries to builder components in app/builder/[conversationId]/error.tsx
- [ ] T147 Add retry logic for AI extraction failures in lib/chat/orchestrator.ts
- [ ] T148 Add offline state handling with local persistence in lib/stores/site-store.ts

### Performance

- [ ] T149 Implement lazy loading for section components in lib/preview/component-loader.ts
- [ ] T150 Add loading skeletons for preview sections in components/preview/section-wrapper.tsx

### Documentation

- [ ] T151 [P] Create README with quickstart instructions in README.md
- [ ] T152 Run quickstart.md validation to verify setup works

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 - BLOCKS all user stories
- **Phases 3-8 (User Stories)**: All depend on Phase 2 completion
- **Phase 9 (Polish)**: Depends on desired user stories being complete

### User Story Dependencies

| Story | Depends On | Can Start After |
|-------|------------|-----------------|
| US1 (P1) | Phase 2 | Phase 2 complete |
| US2 (P2) | US1 | T048 (Zustand store) |
| US3 (P3) | US2 | T086 (section-wrapper) |
| US4 (P4) | US2 | T085 (site-preview) |
| US5 (P5) | US4 | T109 (export endpoint) |
| US6 (P6) | US2 | T084 (component loader) |

### Test Task Summary

Each user story phase now includes test tasks following RED-GREEN-REFACTOR pattern per constitution:

| Phase | Test Tasks | Type |
|-------|-----------|------|
| US1 (Phase 3) | T048b-T048e | Unit, Contract, Integration |
| US2 (Phase 4) | T095a-T095c | Unit, Component, Integration |
| US3 (Phase 5) | T103a-T103b | Unit, Integration |
| US4 (Phase 6) | T111a-T111c | Unit, Integration, E2E |
| US5 (Phase 7) | T119a-T119b | Unit, Integration |
| US6 (Phase 8) | T143a-T143b | Component, E2E |

### Parallel Opportunities Per Phase

**Phase 2** (after T009):

```bash
# All schema tasks can run in parallel
T012, T013, T014, T015, T016, T017, T018, T019, T020, T021, T022, T023, T024, T025
# Registry tasks can run in parallel
T027, T028
# Query tasks can run in parallel
T030, T031, T032
```

**Phase 4** (US2 - Components are highly parallelizable):

```bash
# All 35 service component variants can be built in parallel
T049-T083 (all [P] marked)
```

**Phase 8** (US6 - All local components parallel):

```bash
# All 20 local business components can be built in parallel
T120-T139 (all [P] marked)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (~6 tasks)
2. Complete Phase 2: Foundational (~26 tasks)
3. Complete Phase 3: User Story 1 (~16 tasks)
4. **STOP and VALIDATE**: Test guided conversation independently
5. Deploy/demo if ready

### Incremental Delivery

| Milestone | Stories | Value Delivered |
|-----------|---------|-----------------|
| MVP | US1 | Guided conversation with content extraction |
| Preview | US1 + US2 | Live preview with service business components |
| Design AI | US1-3 | AI variant selection with overrides |
| Export | US1-4 | Downloadable deployable project |
| Launch | US1-5 | Full launch handoff workflow |
| Full MVP | US1-6 | Both industry types supported |

### Task Count Summary

| Phase | Tasks | Parallel |
|-------|-------|----------|
| Phase 1: Setup | 6 | 4 |
| Phase 2: Foundational | 26 | 20 |
| Phase 3: US1 (P1) | 16 | 4 |
| Phase 4: US2 (P2) | 42 | 35 |
| Phase 5: US3 (P3) | 8 | 0 |
| Phase 6: US4 (P4) | 8 | 0 |
| Phase 7: US5 (P5) | 8 | 2 |
| Phase 8: US6 (P6) | 24 | 20 |
| Phase 9: Polish | 24 | 4 |
| **Total** | **175** | **105** |

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [US#] label tracks which user story each task belongs to
- Constitution compliance: All components use BaseSectionProps<T> pattern
- 35 service components + 20 local components + 15 shared = 70 section variants (5 variants × 7 service sections + 5 variants × 4 local-only sections + 5 variants × 3 shared sections)
- Each checkpoint allows independent story testing before proceeding

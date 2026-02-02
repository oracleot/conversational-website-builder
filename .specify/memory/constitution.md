<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 1.0.1 (PATCH - Development workflow clarifications)
Modified principles: None (clarifications added to Technology Standards section)
Added sections:
  - Development Workflow subsection (UI/design skills requirement, shadcn/ui check requirement)
Removed sections: None
Templates status:
  - .specify/templates/plan-template.md: ✅ Compatible (Constitution Check section exists)
  - .specify/templates/spec-template.md: ✅ Compatible (Requirements/Success Criteria align)
  - .specify/templates/tasks-template.md: ✅ Compatible (Phase structure supports principles)
Follow-up TODOs: None
-->

# Conversational Website Builder Constitution

## Core Principles

### I. Component-First Architecture

All UI features MUST be built as self-contained, reusable section components with standardized prop interfaces.

**Requirements:**
- Components MUST accept content via `BaseSectionProps<T>` interface pattern
- Components MUST be independently renderable without parent context
- No hard-coded business content; all text, images, and data MUST flow through props
- Component variants (1-5 per section type) MUST have distinct visual personalities documented in registry
- Shared components (testimonials, contact) MUST work across industry types without modification

**Rationale:** The product's core value depends on pre-built, professional components that guarantee design quality. Generic or tightly-coupled components undermine the "no AI look" promise.

### II. Test-Driven Quality

All features MUST have corresponding tests written before implementation. Critical paths require integration coverage.

**Requirements:**
- Unit tests MUST cover: content extraction accuracy (>85%), variant selection logic, schema validation
- Integration tests MUST cover: conversation flow end-to-end, preview rendering pipeline, export generation
- Contract tests MUST verify: AI prompt → structured output parsing, component prop interfaces
- Red-Green-Refactor cycle enforced: tests fail first, then implementation, then optimization
- AI content extraction accuracy MUST be validated against test fixtures per section type

**Rationale:** Conversation and export reliability directly impact user trust. A broken conversation flow or failed export destroys the 15-minute promise.

### III. UX Consistency

User-facing interactions MUST deliver predictable, polished experiences that match the premium product positioning.

**Requirements:**
- Preview updates MUST render within 3 seconds per section
- Conversation steps MUST be clearly indicated with progress tracking
- Variant switcher MUST be accessible on hover/tap without page reload
- All animations MUST use Framer Motion with consistent easing (match existing hero patterns)
- Error states MUST provide actionable recovery paths, never dead ends
- Mobile responsiveness MUST be tested for chat → preview transition at breakpoints

**Rationale:** Small business owners are paying for simplicity and professionalism. Inconsistent UX erodes confidence in the final product quality.

### IV. Performance Requirements

All operations MUST meet defined latency and cost budgets to ensure scalability and profitability.

**Requirements:**
- Conversation completion: MUST be achievable in <15 minutes for target user
- Preview render: <3 seconds per section (client-side)
- Export generation: <45 seconds for complete Next.js project
- AI API cost: <$2 total per site build (orchestration + extraction + variant selection)
- Database queries: <100ms for conversation state retrieval
- Component lazy loading: Only render sections in viewport + 1 ahead

**Rationale:** Performance directly impacts unit economics (>95% gross margin target) and user satisfaction metrics.

## Technology Standards

**Framework:** Next.js 15 App Router with TypeScript strict mode enabled
**Styling:** Tailwind CSS + Framer Motion; CSS variables for theme customization
**Database:** Supabase (Postgres + Realtime); all schemas defined in `lib/schemas/` with Zod validation
**AI Models:** OpenRouter for model access (GPT-4o, Claude, etc. for orchestration; GPT-4o-mini for extraction); structured JSON outputs required; model-agnostic architecture enables switching providers without code changes
**Deployment:** Vercel for platform; generated user sites MUST deploy to Vercel successfully
**Email:** Resend for transactional emails; all notifications MUST include required context

**Component Naming Convention:**
- Industry-specific: `{industry}-{section}-{variant}.tsx` (e.g., `service-hero-1.tsx`)
- Shared/reusable: `shared-{section}-{variant}.tsx` (e.g., `shared-testimonials-3.tsx`)

**Development Workflow:**
- All UI/design work MUST utilize `frontend-design` and `vercel-react-best-practices` skills for production-grade quality and optimal performance patterns
- Before creating new components, MUST check shadcn/ui component library for existing implementations that can be reused or adapted

## Quality Gates

**Pre-Merge Requirements:**
1. All existing tests pass
2. New code has corresponding test coverage
3. TypeScript compilation succeeds with zero errors
4. Component props interface follows `BaseSectionProps<T>` pattern
5. Performance benchmarks verified for affected paths

**Pre-Release Requirements:**
1. End-to-end conversation test passes for both industry types (service, local)
2. Export generates deployable project verified on Vercel
3. AI cost per test conversation logged and within budget
4. Preview render times measured and within threshold

## Governance

This constitution supersedes all other development practices for this project. All pull requests and code reviews MUST verify compliance with these principles.

**Amendment Process:**
1. Proposed changes documented with rationale
2. Impact assessment on existing components/features
3. Version increment following semantic versioning:
   - MAJOR: Principle removal or redefinition
   - MINOR: New principle or section expansion
   - PATCH: Clarifications and wording refinements
4. Templates updated if principles affect structure

**Compliance:** Constitution checks are integrated into the plan template. Violations MUST be justified in the Complexity Tracking section with rejected alternatives documented.

**Version**: 1.0.1 | **Ratified**: 2026-02-02 | **Last Amended**: 2026-02-02

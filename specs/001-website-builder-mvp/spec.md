# Feature Specification: AI-Powered Conversational Website Builder MVP

**Feature Branch**: `001-website-builder-mvp`  
**Created**: 2026-02-02  
**Status**: Draft  
**Input**: User description: "AI-Powered Conversational Website Builder MVP - A hybrid SaaS platform where small business owners chat their way through website creation, see live previews, and get human-assisted launch"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Guided Conversation for Business Website (Priority: P1)

A small business owner visits the platform to create their business website. They engage in a guided chat conversation that asks about their industry (service or local business), business name, services offered, tagline, and brand personality. The system extracts structured content from their natural language responses and builds their website configuration step by step.

**Why this priority**: This is the core value proposition - the conversational interface that makes website creation accessible to non-technical users. Without the guided conversation, the product doesn't exist.

**Independent Test**: Can be fully tested by starting a new conversation, answering prompts for a fictional consulting business, and verifying that the system correctly captures business name, industry type, tagline, services, and brand personality into a structured format.

**Acceptance Scenarios**:

1. **Given** a new user lands on the platform, **When** they start a conversation, **Then** the system asks them to choose between service business or local business industry types
2. **Given** a user has selected "service business", **When** they provide their business name and description in natural language, **Then** the system extracts and stores the business name, type, and tagline correctly
3. **Given** a user describes their services conversationally (e.g., "I offer branding, web design, and marketing strategy"), **When** the system processes this, **Then** it extracts individual services with titles and descriptions
4. **Given** a user describes their brand as "professional but friendly and modern", **When** the system processes this, **Then** it stores brand personality traits as an array for variant selection

---

### User Story 2 - Live Preview Updates (Priority: P2)

As the user completes each section of the conversation, they see their website preview update in real-time on a split-screen interface. The preview shows their actual content rendered in professional design components, updating smoothly after each section is confirmed.

**Why this priority**: Live preview provides instant gratification and builds trust that the system is actually creating their website. It's the visual proof that the conversation is productive.

**Independent Test**: Can be tested by completing the hero section conversation and verifying the preview panel updates to show a rendered hero component with the user's headline, subheadline, and CTA text within 3 seconds.

**Acceptance Scenarios**:

1. **Given** a user is in the builder interface, **When** they confirm their hero section content, **Then** the preview panel updates to show a rendered hero component with their headline and CTA within 3 seconds
2. **Given** a user has completed multiple sections, **When** they add a new section, **Then** the preview smoothly scrolls to show the newly added section
3. **Given** the preview is displaying, **When** a section is updated, **Then** the change animates smoothly without full page refresh

---

### User Story 3 - AI Variant Selection with Override (Priority: P3)

For each section, the AI automatically selects the best design variant (1 of 5) based on the user's brand personality traits. The user sees the AI's choice with a brief explanation, and can easily browse and switch to alternative variants if they prefer a different style.

**Why this priority**: This delivers the "professional design guaranteed" promise by matching design personality to brand personality, while respecting user autonomy through overrides.

**Independent Test**: Can be tested by completing a business profile with "elegant, luxury, sophisticated" personality traits and verifying the system selects variant 4 (elegant personality) for the hero section, with a visible option to switch to other variants.

**Acceptance Scenarios**:

1. **Given** a user has brand personality traits defined, **When** a section is added, **Then** the system selects a variant with matching personality and displays reasoning (e.g., "We picked Elegant style because your brand is sophisticated")
2. **Given** a section is displayed with AI-selected variant, **When** user clicks "See other options", **Then** a carousel shows the 4 alternative variants with visual previews
3. **Given** user is viewing alternative variants, **When** they click on a different variant, **Then** the preview updates immediately to show that variant
4. **Given** a user overrides the AI selection, **When** they confirm the section, **Then** the override is recorded for analytics

---

### User Story 4 - Export Deployable Website Project (Priority: P4)

When the user is satisfied with their preview, they can export a complete, deployable website project. The export includes all necessary files to run as a standalone website, with their content pre-populated and their selected design variants included.

**Why this priority**: Export is the deliverable that users are paying for - the actual website they can own and deploy. It transforms the preview into a tangible asset.

**Independent Test**: Can be tested by completing a full website conversation, clicking export, downloading the generated project, and verifying it runs successfully when deployed to a hosting platform.

**Acceptance Scenarios**:

1. **Given** a user has completed all sections (hero, services, about, testimonials, contact), **When** they click "Export Project", **Then** the system generates a downloadable project within 45 seconds
2. **Given** an exported project, **When** deployed to a hosting platform, **Then** the site displays correctly with all sections, content, and styling intact
3. **Given** an exported project, **When** reviewed, **Then** it contains only the component variants that were selected (not all 5 variants per section)
4. **Given** an exported project, **When** reviewed, **Then** the code is clean, readable, and follows standard project structure

---

### User Story 5 - Launch Handoff Workflow (Priority: P5)

When ready to launch, the user clicks "Ready to Launch" to enter a handoff workflow. They provide their email, phone (optional), image preferences, and domain preferences. The system notifies the consultant team and sends the user a confirmation that a human expert will contact them to finalize the launch.

**Why this priority**: The human-assisted launch is a differentiator that justifies premium pricing and ensures quality, but it's operationally dependent on having a completed site first.

**Independent Test**: Can be tested by completing the "Ready to Launch" flow, submitting the form with email and preferences, and verifying both the user confirmation email and team notification are sent.

**Acceptance Scenarios**:

1. **Given** a user has a completed preview, **When** they click "Ready to Launch", **Then** a modal appears with fields for email, phone, image preferences, and domain preferences
2. **Given** the launch form is displayed, **When** user submits with valid email, **Then** the site status changes to "awaiting-launch" and user receives confirmation email
3. **Given** a launch request is submitted, **When** processing completes, **Then** the consultant team receives notification with site preview link and user preferences
4. **Given** a launch request is submitted, **When** the user views their dashboard, **Then** they see their site status as "Awaiting Launch" with estimated contact timeline

---

### User Story 6 - Local Business Conversation Flow (Priority: P6)

A local business owner (restaurant, salon, retail) can complete the same guided conversation flow with industry-appropriate sections including menu/services, location/hours, and gallery/ambiance instead of the service business sections.

**Why this priority**: Supporting both service and local businesses doubles the addressable market for MVP, and many components can be reused.

**Independent Test**: Can be tested by selecting "local business" at the start, completing the conversation for a fictional restaurant, and verifying the system asks about menu items, business hours, and location rather than service-business-specific questions.

**Acceptance Scenarios**:

1. **Given** a user selects "local business" industry, **When** the conversation proceeds, **Then** the system asks about menu/services, location, hours, and ambiance rather than portfolio/case studies
2. **Given** a local business describes their menu items, **When** processed, **Then** the system extracts structured menu data with item names, descriptions, and optional prices
3. **Given** a local business provides address and hours, **When** the location section renders, **Then** it displays formatted address and business hours clearly

---

### Edge Cases

- What happens when a user provides incomplete or unclear responses?
  - System asks clarifying follow-up questions rather than proceeding with partial data
- What happens when a user wants to go back and edit a previous section?
  - User can navigate to any completed section and modify it, triggering preview update
- What happens when the AI fails to extract content correctly?
  - User sees extracted content summary and can correct before confirming
  - If extraction completely fails, system displays user's original text with empty structured fields for manual completion
- What happens when export generation fails?
  - User receives clear error message with option to retry or contact support
- What happens when a conversation is abandoned mid-way?
  - Conversation state is persisted and user can resume from where they left off
- What happens when a user's internet connection is lost during conversation?
  - Local state is preserved and syncs when connection restores

## Requirements *(mandatory)*

### Functional Requirements

**Conversation System:**

- **FR-001**: System MUST guide users through a structured conversation flow progressing from industry selection → business profile → section-by-section content collection → launch
- **FR-002**: System MUST extract structured business data (name, industry, type, tagline, description, personality) from natural language responses
- **FR-003**: If AI extraction fails, system MUST display user's original input with empty structured fields for manual completion
- **FR-004**: System MUST support two industry types for MVP: "service" businesses and "local" businesses
- **FR-005**: System MUST persist conversation state so users can resume incomplete sessions (retained for 30 days of inactivity)
- **FR-006**: System MUST display conversation progress indicator showing completed, current, and upcoming sections

**Preview System:**

- **FR-007**: System MUST render a live preview that updates within 3 seconds of section confirmation
- **FR-008**: System MUST display the preview in a split-screen layout alongside the chat interface
- **FR-009**: System MUST smooth-scroll preview to newly added sections
- **FR-010**: System MUST support switching between 5 design variants per section type without page reload

**Variant Selection:**

- **FR-011**: System MUST automatically select a design variant for each section based on brand personality traits
- **FR-012**: System MUST display reasoning for variant selection to users
- **FR-013**: System MUST allow users to override AI-selected variants by browsing alternatives
- **FR-014**: System MUST record variant overrides for analytics improvement

**Component Library:**

- **FR-015**: System MUST provide 5 distinct design variants for each section type: 7 for service industry (hero, services, about, process, testimonials, portfolio, contact) and 7 for local industry (hero, menu, location, gallery, about, testimonials, contact), with about/testimonials/contact shared across industries - totaling 70 unique components (35 service + 20 local-only + 15 shared)
- **FR-016**: All section components MUST accept content via standardized prop interfaces
- **FR-017**: Components MUST render with placeholder images when user hasn't provided custom images

**Export System:**

- **FR-018**: System MUST generate a complete, deployable website project from the site configuration
- **FR-019**: Export MUST include only the selected component variants (not all variants)
- **FR-020**: Export MUST complete within 45 seconds
- **FR-021**: Exported projects MUST deploy successfully to hosting platforms without modification
- **FR-022**: System MUST require payment before allowing export or launch request (free tier limited to watermarked preview)

**Launch Workflow:**

- **FR-023**: System MUST provide a "Ready to Launch" action that captures user email (required), phone (optional), image preferences, and domain preferences
- **FR-024**: System MUST send confirmation email to user upon launch request submission
- **FR-025**: System MUST notify consultant team with site preview and user preferences
- **FR-026**: System MUST update site status to "awaiting-launch" upon submission

**Data Persistence:**

- **FR-027**: System MUST store user accounts with email identification
- **FR-028**: System MUST authenticate users via magic link (passwordless email sign-in)
- **FR-029**: System MUST allow anonymous users to start conversations and explore; authentication required before saving progress
- **FR-030**: System MUST store conversations with full message history and current step
- **FR-031**: System MUST store site configurations with all section content and variant selections
- **FR-032**: System MUST track component usage (section type, variant, whether AI-selected or overridden)

### Key Entities

- **User**: Individual using the platform; authenticated via magic link (passwordless email); owns conversations and sites
- **Conversation**: An ongoing website creation session; tracks current step (profile, hero, services, etc.), business profile data, and message history; belongs to a user
- **Site**: A generated website; contains full configuration (business profile, sections array, theme), status (building, preview, awaiting-launch, launched), and export URLs; linked to a conversation
- **Business Profile**: Extracted business information including name, industry type, business type, tagline, description, brand personality traits, optional colors, and contact information
- **Section**: A discrete part of a website (hero, services, testimonials, etc.); each has a type, selected variant (1-5), and content conforming to section-specific schema
- **Component Variant**: A specific design implementation of a section type; has personality traits (professional, modern, bold, elegant, friendly) used for AI matching

### Assumptions

- Users have a modern web browser with JavaScript enabled
- Users can articulate their business information in conversational English
- Initial MVP will use placeholder images from stock photo services; custom image upload is post-MVP
- Free tier allows full conversation and preview (watermarked); export and launch require payment
- Consultant team capacity exists to handle launch requests within 24 hours

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete the full conversation from start to "Ready to Launch" in under 15 minutes
- **SC-002**: Preview renders each new section within 3 seconds of confirmation
- **SC-003**: Export generation completes within 45 seconds for a complete 7-section site
- **SC-004**: AI content extraction accuracy exceeds 85% (user confirms extracted content without modification)
- **SC-005**: Exported projects deploy successfully to hosting platforms on first attempt
- **SC-006**: 70% of users who start a conversation progress to preview completion
- **SC-007**: 30% of users who complete preview submit a launch request
- **SC-008**: Total per-site cost for AI operations remains under $2
- **SC-009**: System handles at least 100 concurrent conversations without performance degradation
- **SC-010**: All 7 section types render correctly with injected user content for both industry types

## Clarifications

### Session 2026-02-02

- Q: What authentication method should be used for user accounts? → A: Magic link (email-based passwordless authentication)
- Q: When should users be required to authenticate? → A: Authenticate before saving (allow anonymous exploration, require sign-in to save progress)
- Q: How long should incomplete conversations be retained before expiration? → A: 30 days of inactivity
- Q: What actions should be gated behind payment in the free tier? → A: Gate export and launch (free users complete full preview with watermark, pay to export or request launch)
- Q: How should AI extraction failure be handled? → A: Show raw input for manual entry (display user's original text with empty structured fields for manual completion)

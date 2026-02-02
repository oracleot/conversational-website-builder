# Quickstart: AI-Powered Conversational Website Builder MVP

**Feature Branch**: `001-website-builder-mvp`  
**Date**: 2026-02-02

## Prerequisites

- Node.js 20+ (LTS recommended)
- pnpm 9+ (`npm install -g pnpm`)
- OpenRouter API key (provides access to GPT-4o, Claude, and other models)
- Supabase account (free tier works for development)
- Resend account for email (free tier: 100 emails/day)

---

## 1. Environment Setup

### Clone and Install

```bash
cd /Users/damilolaoduronbi/Projects/conversational-website-builder
git checkout 001-website-builder-mvp
pnpm install
```

### Environment Variables

Create `.env.local` in the project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenRouter (model-agnostic access)
OPENROUTER_API_KEY=sk-or-your-openrouter-api-key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1

# Resend (Email)
RESEND_API_KEY=re_your-resend-api-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 2. Database Setup

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy the project URL and anon key to `.env.local`
3. Go to Settings → API and copy the service role key

### Run Migrations

Create the database schema by running the SQL in Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  industry TEXT CHECK (industry IN ('service', 'local')),
  current_step TEXT NOT NULL DEFAULT 'industry_selection',
  business_profile JSONB,
  messages JSONB[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sites table
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID UNIQUE REFERENCES conversations(id) ON DELETE CASCADE,
  config JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'building' 
    CHECK (status IN ('building', 'preview', 'awaiting_launch', 'launched')),
  preview_url TEXT,
  export_url TEXT,
  launch_preferences JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  launched_at TIMESTAMPTZ
);

-- Component usage analytics
CREATE TABLE component_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  variant_number INTEGER NOT NULL CHECK (variant_number BETWEEN 1 AND 5),
  is_override BOOLEAN NOT NULL DEFAULT FALSE,
  selected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at);
CREATE INDEX idx_sites_conversation_id ON sites(conversation_id);
CREATE INDEX idx_sites_status ON sites(status);
CREATE INDEX idx_component_usage_analytics ON component_usage(section_type, variant_number, is_override);

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_usage ENABLE ROW LEVEL SECURITY;

-- Policies (adjust based on auth strategy)
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can read own conversations" ON conversations
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own conversations" ON conversations
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Enable Supabase Auth
-- Go to Authentication → Providers and enable Email (Magic Link)
```

### Enable Magic Link Auth

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable "Email" provider
3. Under "Email Auth", enable "Enable Email Magic Link"
4. Configure redirect URL: `http://localhost:3000/callback`

---

## 3. Running the Application

### Development Server

```bash
pnpm dev
```

Application runs at [http://localhost:3000](http://localhost:3000)

### Type Checking

```bash
pnpm type-check
```

### Linting

```bash
pnpm lint
```

### Testing

```bash
# Unit tests
pnpm test

# E2E tests (requires dev server running)
pnpm test:e2e

# Test coverage
pnpm test:coverage
```

---

## 4. Project Structure Overview

```
├── app/                    # Next.js App Router pages and API routes
│   ├── (auth)/             # Auth-related pages (login, callback)
│   ├── builder/            # Main builder interface
│   ├── api/                # API routes
│   └── page.tsx            # Landing page
├── components/
│   ├── sections/           # Industry-specific section components
│   ├── chat/               # Chat interface components
│   ├── preview/            # Live preview components
│   └── ui/                 # shadcn/ui primitives
├── lib/
│   ├── schemas/            # Zod schemas for validation
│   ├── chat/               # Conversation orchestrator, prompts
│   ├── registry/           # Component and industry registries
│   ├── db/                 # Supabase client and queries
│   └── export/             # Project generator
└── specs/                  # Feature specifications
    └── 001-website-builder-mvp/
        ├── spec.md         # Feature specification
        ├── plan.md         # Implementation plan
        ├── research.md     # Technology research
        ├── data-model.md   # Entity schemas
        └── contracts/      # API specifications
```

---

## 5. Key Development Workflows

### Adding a New Section Variant

1. Create component in `components/sections/{section-type}/`
2. Follow naming: `{industry}-{section}-{variant}.tsx` or `shared-{section}-{variant}.tsx`
3. Implement `BaseSectionProps<T>` interface
4. Add to component registry in `lib/registry/components.ts`
5. Add personality traits to `lib/registry/variant-personalities.ts`
6. Write unit test for component

### Adding a New Industry

1. Add industry to `IndustryType` in `lib/schemas/types.ts`
2. Create `IndustryConfig` in `lib/registry/industries.ts`
3. Define required/optional sections
4. Create conversation prompts for each section
5. Create industry-specific section components
6. Update conversation orchestrator flow

### Modifying Content Schemas

1. Update Zod schema in `lib/schemas/section-content.ts`
2. Update corresponding TypeScript interface
3. Update extraction prompts in `lib/chat/prompts.ts`
4. Update contract in `specs/001-website-builder-mvp/contracts/`
5. Add/update test fixtures

---

## 6. Testing Strategy

### Unit Tests (`tests/unit/`)

- Schema validation
- Variant selection algorithm
- Content extraction parsing
- Utility functions

### Integration Tests (`tests/integration/`)

- API route handlers
- Conversation orchestrator flow
- Database queries
- Export generation

### Contract Tests (`tests/contract/`)

- AI structured output parsing
- Mock AI responses for determinism

### E2E Tests (`tests/e2e/`)

- Full service business conversation flow
- Full local business conversation flow
- Preview rendering
- Export and download

---

## 7. Common Tasks

### Generate AI Structured Outputs

```typescript
import { openai } from '@/lib/ai'; // OpenRouter-compatible client
import { HeroContentSchema } from '@/lib/schemas';

const response = await openai.chat.completions.create({
  model: 'openai/gpt-4o-mini', // OpenRouter model format
  response_format: { type: 'json_object' },
  messages: [
    { role: 'system', content: HERO_EXTRACTION_PROMPT },
    { role: 'user', content: userMessage }
  ]
});

const content = HeroContentSchema.parse(JSON.parse(response.choices[0].message.content));
```

### Stream Chat Responses

```typescript
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

// OpenRouter-compatible provider
const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

const result = await streamText({
  model: openrouter('openai/gpt-4o'), // Can switch to 'anthropic/claude-3.5-sonnet' etc.
  messages: conversationMessages,
  system: ORCHESTRATOR_SYSTEM_PROMPT
});

return result.toDataStreamResponse();
```

### Dynamic Component Loading

```typescript
import dynamic from 'next/dynamic';

const loadComponent = (industry: string, section: string, variant: number) => {
  return dynamic(
    () => import(`@/components/sections/${section}/${industry}-${section}-${variant}`),
    { loading: () => <SectionSkeleton /> }
  );
};
```

---

## 8. Deployment

### Vercel Deployment

1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Configure Supabase production URL
4. Deploy

### Production Checklist

- [ ] All environment variables set
- [ ] Supabase production project created
- [ ] Magic link redirect URL updated for production domain
- [ ] Resend domain verified
- [ ] Error tracking configured (Sentry)
- [ ] Performance monitoring enabled

---

## 9. Troubleshooting

### OpenAI Rate Limits

If hitting rate limits during development:
- Use shorter conversation turns
- Cache extraction results
- Consider GPT-4o-mini for all dev testing

### Supabase Connection Issues

- Verify project URL and keys in `.env.local`
- Check RLS policies if getting permission errors
- Ensure auth is properly configured

### Preview Not Updating

- Check Zustand store is properly hydrated
- Verify component is registered in component registry
- Check browser console for render errors

---

## 10. Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Zod Documentation](https://zod.dev)
- [Framer Motion](https://www.framer.com/motion/)

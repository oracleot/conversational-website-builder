This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# AI-Powered Conversational Website Builder MVP

A hybrid SaaS platform where small business owners chat their way through website creation, see live previews, and get human-assisted launch.

## Quick Start

### Prerequisites

- Node.js 20+ and pnpm
- Supabase account
- OpenRouter API key (for AI features)

### Setup

1. **Clone and install dependencies:**

```bash
pnpm install
```

2. **Configure environment variables:**

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

**Important**: This project uses modern Supabase API keys:
- Get your **publishable key** (starts with `sb_publishable_`) for `NEXT_PUBLIC_SUPABASE_KEY`
- Get your **secret key** (starts with `sb_secret_`) for `SUPABASE_SECRET_KEY`
- Find these in Supabase Dashboard → Project Settings → **API Keys** (not "Legacy API Keys")

3. **Setup database:**

Run the migrations in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL Editor.

4. **Run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Next.js 15 App Router pages and API routes
- `/components` - React components (UI and sections)
- `/lib` - Core utilities (database, AI, schemas, registries)
- `/specs` - Feature specifications and documentation
- `/supabase` - Database migrations
- `/tests` - Test files (Vitest + Playwright)

## Key Technologies

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Database**: Supabase (PostgreSQL + Auth)
- **AI**: OpenRouter (GPT-4o, Claude, etc.)
- **Styling**: Tailwind CSS + shadcn/ui
- **Animation**: Framer Motion
- **Validation**: Zod
- **Testing**: Vitest + Playwright

## Documentation

- **Quickstart**: [`specs/001-website-builder-mvp/quickstart.md`](specs/001-website-builder-mvp/quickstart.md)
- **Spec**: [`specs/001-website-builder-mvp/spec.md`](specs/001-website-builder-mvp/spec.md)
- **Implementation Plan**: [`specs/001-website-builder-mvp/plan.md`](specs/001-website-builder-mvp/plan.md)
- **Tasks**: [`specs/001-website-builder-mvp/tasks.md`](specs/001-website-builder-mvp/tasks.md)

## Development

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

# E2E tests
pnpm test:e2e
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [Supabase Documentation](https://supabase.com/docs) - Supabase guides and reference
- [OpenRouter](https://openrouter.ai/docs) - AI model access documentation
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework

## Deployment

The easiest way to deploy is via [Vercel](https://vercel.com/new):

1. Push your code to GitHub
2. Import repository to Vercel
3. Add environment variables
4. Deploy

See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more options.

## License

MIT


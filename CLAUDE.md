# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run db:generate  # Generate Drizzle migrations from schema changes
npm run db:migrate   # Apply pending migrations to the database
npm run db:studio    # Open Drizzle Studio (visual DB browser)
```

## Architecture

Full-stack Next.js 14 (App Router). No separate backend — API Routes in `app/api/` serve as the backend.

**Data flow:**
- `db/schema.ts` — Drizzle schema (source of truth for types via `$inferSelect`/`$inferInsert`)
- `db/index.ts` — libSQL client + Drizzle instance (`db`)
- `app/api/lists/` and `app/api/lists/[id]/items/` — REST endpoints, validated with Zod
- `hooks/use-lists.ts` — TanStack Query hooks (client-side cache + mutations)
- React components call hooks; hooks call `lib/api.ts` fetch helpers

**Key design rules:**
- Zod schemas live in `lib/schemas.ts` and are shared between API routes and frontend forms
- All dates are generated server-side (`datetime('now', 'localtime')` in SQLite default)
- Voice-to-text uses the native Web Speech API via `hooks/use-speech.ts` — no external API
- Budget alert threshold is 80% of `budget_limit`; visual feedback via color progression (green → yellow → red)

**Database:**
- Local dev: `shopping.db` (SQLite file, git-ignored)
- Production: Turso (set `DATABASE_URL` + `DATABASE_AUTH_TOKEN` in env)
- Schema: `lists` (id, name, budget_limit, created_at) → `items` (id, list_id FK, name, quantity, price, created_at)

**UI conventions:**
- Base font size: 18px (accessibility for middle-aged users)
- Min touch target: 48px
- Components from shadcn/ui in `components/ui/`; custom components directly in `components/`

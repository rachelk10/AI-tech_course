<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Keep the branch in a working state because pushes sync back to Lovable.
<!-- LOVABLE:END -->

# Agent guide for `v0-digital-course-website`

## What this repo is
- Next.js 16 App Router project for a Hebrew machine-learning course website.
- Uses React 19, Tailwind CSS v4, Radix UI/shadcn-style components, Prisma, and NextAuth.js 5.
- The app is centered around authenticated course access, profile/payment flows, and referral tracking.

## Start here
- Read `README.md`, `START_HERE.md`, `QUICKSTART.md`, and `COMMANDS.md` before making non-trivial changes.
- Use `AUTH_README.md` and `AUTH_SETUP.md` for auth work.
- Use `VERCEL_SETUP.md` for deployment/env changes.
- Avoid duplicating those docs here; link to them instead.

## Useful structure
- `app/` — App Router pages, layouts, and API routes.
- `components/` — shared React components.
- `components/ui/` — reusable UI primitives.
- `lib/` — auth, Prisma, referrals, and shared utilities.
- `prisma/` — schema and SQL/init files.
- `scripts/` — seed and maintenance scripts.
- `chat-bot/` — separate chatbot experiment; treat it as a distinct subproject unless the user asks otherwise.

## Commands to know
- `npm run dev` — local dev server.
- `npm run build` — production build; runs Prisma generate first.
- `npm run lint` — ESLint across the repo.
- `npm run db:generate` — regenerate Prisma client.
- `npm run db:migrate` — apply schema changes.
- `npm run db:push` — push schema without a migration.
- `npm run db:studio` — open Prisma Studio.
- `npm run db:seed` — seed data.

## Working conventions
- Prefer small, targeted edits that keep the branch deployable.
- Keep Hebrew-first UI and copy intact unless the task explicitly changes content.
- Preserve existing auth/access patterns: `lib/auth.ts`, `middleware.ts`, and `app/api/check-access/` are sensitive areas.
- If you touch Prisma models or referral logic, check the schema and related helpers together.
- Use `.env.local` for local secrets; never hardcode env values.
- When adding or changing UI, reuse existing components from `components/ui/` before introducing new patterns.

## Known pitfalls
- Referral features depend on `User.referralCode`, `User.referredByReferrerId`, and `Referrer`; production DB schema must be in sync.
- Local success with SQLite does not guarantee Vercel success; verify migrations against the production database.
- Authentication in `middleware.ts` has been intentionally adjusted before; inspect the file before re-enabling or refactoring protection.
- This repo is linked to Lovable, so avoid history-rewriting git commands.

## Good places to inspect for examples
- `app/page.tsx` for the home page entry point.
- `app/course/machine-learning/` for course content structure.
- `components/auth-buttons.tsx` and `components/protected-content.tsx` for auth-gated UI patterns.
- `lib/referrals.ts` for referral-cookie behavior.
- `prisma/schema.prisma` for the source of truth on data models.

## When you need more detail
- For setup and troubleshooting, link users to `START_HERE.md`, `QUICKSTART.md`, and `INSTALL_TROUBLESHOOTING.md`.
- For deployment guidance, link to `VERCEL_SETUP.md`.
- For auth architecture and files created, link to `AUTH_README.md` and `AUTH_SETUP.md`.

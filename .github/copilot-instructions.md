# 🚀 Quick Start for AI Coding Agents

## Start Here
- **Monorepo:** See [apps/](apps), [packages/](packages); primary app is [apps/portfolio](apps/portfolio), plus [apps/blog](apps/blog), [apps/site-check](apps/site-check), [apps/docs](apps/docs).
- **Config hub:** [src/app/resources/config.js](src/app/resources/config.js) → routing, fonts, visual effects, baseURL.
- **Layout & Providers:** [src/app/layout.tsx](src/app/layout.tsx), [(main) layout](src/app/(main)/layout.tsx), and [Providers](src/app/Providers.tsx) for theme, icons, toasts.
- **Package manager:** pnpm only. Common commands: `pnpm dev`, `pnpm build`, `pnpm test`, `pnpm lint`. Per-app dev: `pnpm dev:portfolio`, `dev:blog`, `dev:site-check`, `dev:docs`.

## Architecture
- **Next.js App Router (v16):** French-first routing under [src/app/(main)](src/app/(main)). Prefer Server Components; use "use client" for interactive UI.
- **Once UI design system:** Use `@once-ui-system/core` components (e.g., `Flex`, `Grid`, `Button`, `Meta`). Avoid custom CSS; use component props. Global styles loaded in [src/app/layout.tsx](src/app/layout.tsx).
- **Centralized configuration:** All UI/content config lives in [src/app/resources](src/app/resources). Import via alias `@/*` (see [tsconfig.json](tsconfig.json)).
- **TypeScript strict:** Path alias `@/*`, strict checks enabled; shared types in [src/app/utils/types.ts](src/app/utils/types.ts).

## Data & Integrations
- **Wisp CMS:** Client in [src/app/utils/wispClient.ts](src/app/utils/wispClient.ts); server actions in [src/app/utils/serverActions.ts](src/app/utils/serverActions.ts) (`getPosts`, `getPostBySlug`, `getTags`, `getProjects`, `createComment`). Cache via `unstable_cache(..., { revalidate: 3600 })`.
- **Neon Postgres + Drizzle:** DB setup in [src/utils/db.ts](src/utils/db.ts). Import `db` for queries; Edge-ready via HTTP/WebSocket.
- **Google Calendar:** Client widget [src/components/Calendar.tsx](src/components/Calendar.tsx); availability API [src/app/api/cal/availability/route.ts](src/app/api/cal/availability/route.ts).
- **PWA:** Server actions [src/app/pwaActions.ts](src/app/pwaActions.ts), SW in [public/sw.js](public/sw.js), manifest [public/manifest.json](public/manifest.json).
- **MDX:** Enabled in [next.config.mjs](next.config.mjs); components in [src/components/mdx.tsx](src/components/mdx.tsx).
- **Server action example (`createComment`)**:
	```ts
	"use server"
	import { revalidatePath } from "next/cache";
	import { wisp } from "@/app/utils/wispClient";
	export async function createComment(input) {
		const ok = await wisp.comment.create(input);
		if (ok) revalidatePath("/blog");
		return ok;
	}
	```

## API Patterns
- **Route handlers:** Use Next.js conventions in [src/app/api](src/app/api). Async params pattern: `{ params }: { params: Promise<{ slug: string }> }`. Responses via `NextResponse.json()`.
- **Open Graph:** Fetcher [src/app/api/og/fetch/route.ts](src/app/api/og/fetch/route.ts), proxy cache [src/app/api/og/proxy/route.ts](src/app/api/og/proxy/route.ts).
- **Cron jobs (Vercel):** [src/app/api/cron/social-share/route.ts](src/app/api/cron/social-share/route.ts), [indexNow](src/app/api/cron/indexNow/route.ts), [refresh-facebook-token](src/app/api/cron/refresh-facebook-token/route.ts).
- **SEO files:** Sitemap in [src/app/sitemap.ts](src/app/sitemap.ts) (routes + Wisp posts) and robots in [src/app/robots.ts](src/app/robots.ts).

## Styling
- **Once UI first:** Layout/spacing with props (`gap`, `paddingX`, `fillWidth`).
- **SCSS modules for custom:** e.g., [src/components/Header.module.scss](src/components/Header.module.scss). Design tokens: [src/tokens/scheme.scss](src/tokens/scheme.scss); breakpoints: [src/components/breakpoints.scss](src/components/breakpoints.scss).
- **Once UI imports & tokens:** Global styles in [src/app/layout.tsx](src/app/layout.tsx); tokens via [src/tokens/scheme.scss](src/tokens/scheme.scss). Use `Meta.generate()` for page metadata.

## Workflows
- **Dev:** `pnpm dev` (Turbopack); HTTPS dev via `pnpm dev-https` (certs in [certificates/](certificates)).
- **Per-app dev & ports:** `pnpm dev:portfolio` → 3000, `pnpm dev:blog` → 3001, `pnpm dev:site-check` → 3002, `pnpm dev:docs` → 3003.
- **Build/Run:** `pnpm build`, `pnpm start`. App builds: `pnpm build:portfolio|blog|site-check|docs`.
- **Tests:** Vitest + RTL. Config [vitest.config.ts](vitest.config.ts); setup [vitest.setup.ts](vitest.setup.ts); tests in [src/__tests__](src/__tests__).
- **Lint/Format/Cleanup:** `pnpm lint`, `pnpm clean`, `pnpm clean:deps`, `pnpm clean:exports`, `pnpm clean:check`.

## Environment
- `.env.local` keys: `DATABASE_URL`, `WISP_API_KEY`, `GOOGLE_CALENDAR_ID`, `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `PASSWORD_PROTECT_ROUTE`, social tokens (`FACEBOOK_ACCESS_TOKEN`, `LINKEDIN_ACCESS_TOKEN`, `FACEBOOK_PAGE_ID`).

## Common Tasks
- **New blog post:** Wisp CMS → render via [blog page](src/app/(main)/blog/[slug]/page.tsx); cache + social share via cron.
- **New project:** Wisp `projects` → list in [realisations](src/app/(main)/realisations); per-slug pages under `[slug]`.
- **New page + metadata:** Use `Meta.generate()` in page file and set `path`, `title`, `description`.

If anything is unclear or missing, tell me which section to refine (monorepo commands, Once UI props, server actions, or API patterns).

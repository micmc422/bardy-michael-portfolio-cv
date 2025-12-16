# 🚀 Quick Start for AI Agents

**New to this codebase?** Read in this order:
1. **Config first:** `src/app/resources/config.js` - understand routing, fonts, effects
2. **Layout structure:** `src/app/layout.tsx` → `src/app/(main)/layout.tsx` - SEO, schema, providers
3. **Key patterns:** Check `src/components/Header.tsx` (client) vs `src/app/utils/serverActions.ts` (server)
4. **Adding features:** See `/blog/[slug]` or `/realisations` as examples

**Critical files to know:**
- `next.config.js` - MDX, images, redirects
- `src/app/Providers.tsx` - theme/icon/toast setup
- `tsconfig.json` - path aliases, type strictness
- `.env.local` - secrets (DATABASE_URL, WISP_API_KEY, etc.)

---

# Architecture & Patterns

## 🎨 Once UI Design System
Portfolio utilise **@once-ui-system/core** (v1.5.6) pour tous les composants UI. La philosophie : composants avec props plutôt que CSS custom.

**Essentials:**
- Import depuis `@once-ui-system/core` : `Flex, Grid, Column, Button, Meta, LayoutProvider, etc.`
- Styles CSS pré-chargés `src/app/layout.tsx` : `@once-ui-system/core/css/styles.css` & `.../tokens.css`
- Thème/Icons configurés `src/app/Providers.tsx` (ThemeProvider, IconProvider, ToastProvider)
- Props Once UI pour layout : `fillWidth`, `center`, `gap`, `padding*`, `as` (élément HTML)
- **Ne JAMAIS créer de CSS custom pour Once UI components** - utiliser props de composant

**Data Flow:** `src/app/resources/config.js` (effects, fonts) → layout → Providers

---

## 🏗️ Next.js 15 App Router Architecture
Routes principales organisées par domaine fonctionnel :
- `(main)` groupe de routes avec layout partagé : Header + RDV + Footer + CookieConsent
- Routes françaises : `/a-propos`, `/realisations`, `/blog`, `/estimation`, `/webmaster-albi`, `/solutions`
- Redirects permanentes configurées (ex : `/about` → `/a-propos`) via `next.config.js`
- **API Routes** : conventions Next.js (async GET/POST) dans `src/app/api/`
  - Pattern params async : `{ params }: { params: Promise<{ slug: string }> }`
  - Toutes retournent `NextResponse.json()`

**Key Pages:**
- `src/app/(main)/blog/[slug]/page.tsx` - articles Wisp CMS avec commentaires
- `src/app/(main)/realisations/` - portfolio projets
- `src/app/api/og/fetch/route.ts` - Open Graph scraper pour social shares

---

## 🖥️ Server/Client Components Pattern
**Default: Server Components** → minimize JS client. Use `"use client"` only for:
- Events (click, onChange, form interactions)
- React hooks (useState, useEffect, useContext)
- Browser APIs (localStorage, window, scrolling)

**Client Components Examples:**
- `src/components/Header.tsx` (navigation, mobile menu)
- `src/components/ThemeToggle.tsx`, `CookieConsent.tsx`
- `src/components/Calendar.tsx` - Google Cal integration
- Entire `src/components/chart/` - Recharts & interactive dashboards

**Server Actions:** `src/app/utils/serverActions.ts` & `src/app/pwaActions.ts`
- Directive `'use server'` au top
- Cache avec `unstable_cache(fn, ['cache-key'], { revalidate: 3600 })`
- Pattern: Wisp CMS queries (getPosts, getPostBySlug, getTags, getProjects)
- Form actions via `formAction` prop (HTML pattern)

---

## 📋 Configuration Centralisée
Toute config vit dans `src/app/resources/` - single source of truth:

| Fichier | Rôle |
|---------|------|
| `config.js` | Routes, fonts (Josefin_Sans, Geist, Open_Sans), effects (gradient, dots, grid), baseURL |
| `content.js` | Contenu multilingue (person, social, home, about, blog, work, services) |
| `icons.ts` | Icône lib pour `IconProvider` (lucide-react wrapper) |
| `index.ts` | Re-export central |

**Import pattern:** `import { baseURL, style, fonts } from "@/app/resources"`

---

## 🎯 Styling & CSS Strategy
- **SCSS Modules** pour custom components : `Component.module.scss` + `import styles from "..."`
- Tokens CSS : `src/tokens/scheme.scss` (variables de design)
- Breakpoints : `src/components/breakpoints.scss`
- SASS compiler : `modern` mode (next.config.js)
- **Once UI props > CSS** : padding/margin via `paddingX="s"` pas `style={{}}` ou className

---

## 🗄️ Database & Services Integration

### Neon Postgres + Drizzle ORM
- Connection pool via `src/utils/db.ts` : Neon HTTP + WebSocket (Edge compatible)
- Usage: `import { db } from "@/utils/db"`
- Edge computing ready : `.poolQueryViaFetch = true` option available

### Wisp CMS (Blog & Content)
- Client : `src/app/utils/wispClient.ts` → `@wisp-cms/client`
- Server Actions pattern : `getPosts({ limit, page, tags })`, `getPostBySlug(slug)`, `getTags()`, `getProjects()`
- **Caching:** `unstable_cache()` with 3600s revalidate
- Post format conversion: `formatPostData()` transforms Wisp → internal PostType
- Comments : `createComment()` action avec validation

### Google Calendar API
- Location : `src/lib/google/` (auth flow, event creation)
- Component : `src/components/Calendar.tsx` (client-side)
- Availability endpoint : `src/app/api/cal/availability/route.ts`

### Web Push Notifications (PWA)
- Config : `src/app/pwaActions.ts` (server actions)
- VAPID keys en .env (generate via web-push library)
- Service Worker : `public/sw.js`

---

## 📝 MDX & Content Management
- MDX enabled via `@next/mdx` plugin (next.config.js)
- Extensions : `.md`, `.mdx`, `.ts`, `.tsx`
- Custom MDX components : `src/components/mdx.tsx` (Code, Blockquote, Link, etc.)
- Gray-matter support : frontmatter parsing
- Prism.js: syntax highlighting in code blocks

# 🚀 Workflows & Commands

## Package Manager (pnpm v10.12.1)
**ALWAYS pnpm** - définit dans `package.json` sous `packageManager`
```bash
pnpm i              # Install deps (lock file = pnpm-lock.yaml)
pnpm dev            # Dev server avec Turbopack (http://localhost:3000)
pnpm dev-https      # Dev HTTPS (certificats dans ./certificates/)
pnpm build          # Build production (Next.js)
pnpm start          # Run production build
pnpm lint           # ESLint quiet mode (pas de fixing)
pnpm test           # Vitest run (one-shot)
pnpm test:watch     # Vitest watch mode
pnpm test:coverage  # Coverage report
pnpm clean          # Remove unused deps/exports/eslint fixes
```

**Cron Jobs** (Vercel scheduled functions):
- `src/app/api/cron/social-share/route.ts` - partage automatique blog vers LinkedIn/Facebook
- `src/app/api/cron/indexNow/route.ts` - SEO ping (Microsoft Bing)
- `src/app/api/cron/refresh-facebook-token/route.ts` - token refresh

---

## Testing Strategy (Vitest + React Testing Library)
Setup files :
- `vitest.config.ts` - configuration (React JSX, alias @/*, modules)
- `vitest.setup.ts` - setup global (@testing-library/jest-dom)
- Tests : `src/__tests__/*.test.ts` pattern

**Test files:**
- `formatDate.test.ts` - utility date formatting
- `utils.test.ts` - helper functions

Coverage : `pnpm test:coverage` → reports/

---

## Linting & Formatting Standards
- **ESLint** : `eslint.config.js` + `eslint.config.mjs` (Next.js + TypeScript rules)
  - Run: `pnpm lint` (quiet mode, report only)
  - Auto-fix: `pnpm clean:eslint`
- **Biome** : `biome.json` (formatter)
  - Indentation: 2 spaces
  - Quotes: double `"`
  - Used for consistency checks
- **Code cleanup tools:**
  - `pnpm clean:deps` → depcheck (unused dependencies)
  - `pnpm clean:exports` → ts-prune (unused exports)
  - `pnpm clean:check` → npm-check (outdated packages)

# 📐 Project-Specific Conventions

## TypeScript Configuration
- Path alias: `@/*` → `./src/*` (tsconfig.json)
- Strict mode: `noUncheckedIndexedAccess`, `strictNullChecks`, `noImplicitAny`
- Custom types in `src/app/utils/types.ts` : `PostType`, `WispPost`, `ProjectType`, `AvisType`
- React 19 mode avec JSX automatic runtime

## Routing & Internationalization
**French-first routing** (all routes in French):
- `/a-propos` (about), `/realisations` (work), `/blog`, `/solutions`, `/webmaster-albi`, `/estimation`
- Redirects in `next.config.js` : `/about` → `/a-propos`, `/work` → `/realisations`
- Breadcrumbs in `src/app/resources/config.js` : maps route names to display labels
- Password-protected routes defined in `src/app/resources/config.js` : `protectedRoutes` object
  - `.env.local` : `PASSWORD_PROTECT_ROUTE=<password>`

---

## SEO & Metadata Strategy
**Built on Once UI Meta + Next.js metadata:**
- `Meta.generate()` in `src/app/layout.tsx` for global metadata (title, description, OG image)
- Dynamic pages use `generateMetadata()` async function
- **Sitemap:** `src/app/sitemap.ts` (dynamic routes + blog posts from Wisp)
- **Robots.txt:** `src/app/robots.ts` (disallow, allow rules)
- **Rich Data (Schema.org):** `src/app/layout.tsx` includes:
  - LocalBusiness with reviews (from Google Reviews API)
  - Service offers from `src/app/(main)/estimation/estimationData`
  - BlogPosting schema for articles

**Open Graph Images:**
- Static OG images in `public/images/og/`
- Dynamic OG scraping: `src/app/api/og/fetch/route.ts` (open-graph-scraper)
- OG proxy for cached images: `src/app/api/og/proxy/route.ts`

---

## Image Management
- **Next.js Image component** configured in `next.config.js`
- Remote patterns allowed: `imagedelivery.net`, `lh3.googleusercontent.com` (Google), `avatars.githubusercontent.com`
- Local images in `public/images/` organized by:
  - `blog/` - article covers
  - `projects/` - project screenshots (h2team/, louhenix/, tw3-champollion/)
  - `og/` - social sharing images
  - `gallery/` - portfolio galleries
- Cloudflare integration: `imagedelivery.net` for optimized delivery

---

## PWA (Progressive Web App)
Configuration:
- Service Worker: `public/sw.js` (cached routes, offline support)
- Manifest: `public/manifest.json` (app metadata)
- Server Actions: `src/app/pwaActions.ts` (subscribe, notify)
- Client Component: `src/components/PWA.tsx` (subscription UI)
- VAPID keys in `.env.local` : `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`

---

## Form Handling & Actions
**Dual pattern:**
- **Server Actions:** `src/app/utils/serverActions.ts` (Wisp queries, comments, reviews)
  - Use `revalidatePath()` to invalidate cache after mutations
  - Example: `createComment()` validates input then adds to Wisp CMS
- **Client-side form wrapper:** `src/components/formActionClient.tsx`
  - Handles loading states, toast notifications (`ActionToastResponse`)
  - Triggers server actions via `formAction` prop
- **Google Forms integration:** `src/components/Calendar.tsx` - event creation

---

## API Routes Patterns
**Standard response format:**
```typescript
import { NextResponse } from 'next/server';
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return NextResponse.json({ data: ... });
}
```

**Key endpoints:**
- `GET /api/post/[slug]` - fetch blog post details
- `GET /api/project/[slug]` - fetch project metadata
- `GET /api/github/[owner]/[repo]` - GitHub repo stats
- `GET /api/cal/availability` - Google Calendar availability
- `POST /api/estimation/[type]` - estimation form submission
- `GET /api/revalidate/[type]/[slug]` - ISR revalidation triggers

---

## Environment Variables
`.env.local` essentials:
- `DATABASE_URL` - Neon Postgres connection (wss:// format)
- `WISP_API_KEY` - Wisp CMS authentication
- `GOOGLE_CALENDAR_ID` - iCal feed ID
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` - PWA subscriptions
- `VAPIR_PRIVATE_KEY` - PWA server-side (private)
- `PASSWORD_PROTECT_ROUTE` - Route protection password
- Social APIs : `FACEBOOK_ACCESS_TOKEN`, `LINKEDIN_ACCESS_TOKEN`, `FACEBOOK_PAGE_ID`

---

# 🎯 Common Implementation Tasks

## Adding a new blog post
1. Create post in Wisp CMS dashboard (title, slug, content)
2. Post auto-fetched via `getPostBySlug()` server action (cached 3600s)
3. Page renders via `src/app/(main)/blog/[slug]/page.tsx`
4. Comments use `createComment()` server action with Wisp validation
5. Social sharing auto-generated via cron job to LinkedIn/Facebook

## Adding a new project/réalisation
1. Create project in Wisp CMS (`projects` content type)
2. Fetch via `getProjects()` in realisations page
3. Create project slug page at `src/app/(main)/realisations/[slug]/page.tsx`
4. Use `src/components/realisations/` components for layout
5. Project metadata: `src/app/api/project/[slug]/route.ts`

## Adding a new page with metadata
```tsx
// File: src/app/(main)/new-page/page.tsx
import { Meta } from "@once-ui-system/core";
export async function generateMetadata() {
  return Meta.generate({
    title: "Page Title",
    description: "Description",
    baseURL: baseURL,
    path: "/new-page",
  });
}
```

## Creating a new Once UI component
```tsx
// Use props, not className
import { Flex, Button } from "@once-ui-system/core";
export function MyComponent() {
  return (
    <Flex gap="m" paddingX="s" paddingY="m">
      <Button> Click me </Button>
    </Flex>
  );
}
```

## Server Action for database query
```tsx
"use server"
import { db } from "@/utils/db";
export async function myQuery() {
  try {
    const data = await db.query.someTable.findMany();
    return data;
  } catch (error) {
    console.error("Query failed:", error);
    return null;
  }
}
```

## Adding environment variable
1. Add to `.env.local`
2. If client-accessible: prefix with `NEXT_PUBLIC_`
3. Import in code: `process.env.MY_VAR`
4. Never commit `.env.local`

---

# 🔍 File Organization Reference
```
src/app/
├── resources/          # ← Config hub (start here)
│   ├── config.js      # Routes, fonts, effects, baseURL
│   ├── content.js     # All content strings
│   └── icons.ts       # Icon library
├── layout.tsx         # Root layout + schema.org
├── (main)/
│   ├── layout.tsx     # Shared layout (Header/Footer/RDV)
│   ├── blog/[slug]/   # Blog post pages
│   ├── realisations/  # Portfolio pages
│   ├── estimation/    # Service pages
│   └── [other]/       # French routes
├── api/               # API endpoints
│   ├── cron/          # Scheduled jobs
│   ├── og/            # OpenGraph scraping
│   ├── post/[slug]/   # Blog post API
│   └── cal/           # Calendar endpoints
└── utils/
    ├── serverActions.ts   # ← Wisp CMS queries here
    ├── wispClient.ts      # CMS initialization
    └── types.ts           # TypeScript interfaces

src/components/
├── Header.tsx         # Main nav (client)
├── Footer.tsx         # Footer layout
├── Calendar.tsx       # Google Cal widget
├── formActionClient.tsx  # Form state wrapper
├── mdx.tsx            # MDX components
├── chart/             # Recharts components
└── [section]/         # Feature-specific

src/utils/
└── db.ts              # Neon Postgres + Drizzle
```

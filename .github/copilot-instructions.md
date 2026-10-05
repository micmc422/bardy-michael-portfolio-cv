# 🚀 Quick Start for AI Agents

**New to this codebase?** Read in this order:
1. **`AGENTS.md`** (racine) — résumé conventions + pièges, source de vérité synchronisée
2. **Config first:** `src/core/config/config.js` - routing, fonts, effects, baseURL
3. **Layout structure:** `src/app/layout.tsx` → `src/app/(main)/layout.tsx` - SEO, schema, providers
4. **Key patterns:** `src/shared/components/Header.tsx` (client) vs `src/core/github/githubContent.ts` (server)
5. **Adding features:** See `/blog/[slug]` or `/realisations` as examples

**Critical files to know:**
- `next.config.mjs` - MDX, images, redirects, headers sécurité/cache
- `src/core/Providers.tsx` - theme/icon/toast setup
- `tsconfig.json` - path alias `@/*`, strictness (`verbatimModuleSyntax` → `import type` obligatoire)
- `.env.local` - secrets (DATABASE_URL, GITHUB_TOKEN, etc.) — jamais commité

---

# Architecture & Patterns

## 🎨 Once UI Design System
Portfolio utilise **@once-ui-system/core** (v2.0.0) pour tous les composants UI. La philosophie : composants avec props plutôt que CSS custom. API détaillée : `.github/agents/once-ui.md`.

**Essentials:**
- Import depuis `@once-ui-system/core` : `Flex, Grid, Column, Row, Button, Meta, etc.`
- Styles CSS pré-chargés dans `src/app/layout.tsx` : `@once-ui-system/core/css/styles.css` & `.../tokens.css`
- Thème/Icons configurés dans `src/core/Providers.tsx` (ThemeProvider, IconProvider, ToastProvider)
- Props Once UI pour layout : `fillWidth`, `center`, `gap`, `padding*`, `as` (élément HTML)
- **Ne JAMAIS créer de CSS custom pour Once UI components** - utiliser les props

**Data Flow:** `src/core/config/config.js` (style, effects, fonts) → layout → Providers

---

## 🏗️ Next.js 16 App Router Architecture
Next.js **16.3.x** + React **19.2.x**, dev avec **Turbopack**. Routes organisées par domaine fonctionnel :
- `(main)` groupe de routes avec layout partagé : Header + RDV + Footer + CookieConsent
- Routes françaises : `/a-propos`, `/realisations`, `/blog`, `/estimation`, `/webmaster-albi`, `/solutions`, `/site-check`, `/atomicbd81` (protégée), `/mentions-legales`
- Redirects permanentes (ex : `/about` → `/a-propos`) via `next.config.mjs`
- **API Routes** : conventions Next.js (async GET/POST) dans `src/app/api/`
  - Pattern params async : `{ params }: { params: Promise<{ slug: string }> }` puis `await params`
  - Toutes retournent `NextResponse.json()`

**Key Pages:**
- `src/app/(main)/blog/[slug]/page.tsx` - articles MDX depuis GitHub avec commentaires
- `src/app/(main)/realisations/` - portfolio projets
- `src/app/(main)/estimation/` - parallel routes (`@headline`, `@resume`) + `estimationData.ts`
- `src/app/(main)/site-check/[url]/` - audit de site en ligne (moteur : `src/modules/site-check/`)
- `src/app/api/og/fetch/` - Open Graph scraper pour social shares

---

## 🖥️ Server/Client Components Pattern
**Default: Server Components** → minimize JS client. Use `"use client"` only for:
- Events (click, onChange, form interactions)
- React hooks (useState, useEffect, useContext)
- Browser APIs (localStorage, window, scrolling)

**Client Components Examples:**
- `src/shared/components/Header.tsx` (navigation, mobile menu)
- `src/shared/components/ThemeToggle.tsx`, `src/shared/components/cookiesConsent.tsx`
- `src/modules/calendar/` - intégration calendrier
- `src/shared/ui/chart/` - Recharts & interactive dashboards

**Server Actions:** `src/core/github/githubContent.ts` & `src/modules/pwa/controllers/`
- Directive `'use server'` au top
- Cache avec `unstable_cache(fn, ['cache-key'], { revalidate: 3600 })`
- Pattern: GitHub MDX queries (getPosts, getPostBySlug, getRelatedPost, getTags, getProjects)
- Form actions via `formAction` prop (HTML pattern)

---

## 📋 Configuration Centralisée
Toute config vit dans `src/core/config/` - single source of truth:

| Fichier | Rôle |
|---------|------|
| `config.js` | Routes, breadcrumbs, protectedRoutes, fonts (Josefin_Sans, Geist, Open_Sans, Geist_Mono), effects, baseURL |
| `content.js` | Contenu du site (person, social, home, about, blog, work, services…) — JSX inline dans un `.js`, c'est voulu |
| `icons.ts` | Icône lib pour `IconProvider` (lucide-react + react-icons) |
| `index.ts` | Re-export central |

**Import pattern:** `import { baseURL, style, fonts } from "@/core/config"`

---

## 🎯 Styling & CSS Strategy
- **SCSS Modules** pour custom components : `Component.module.scss` + `import styles from "..."`
- Tokens CSS : `src/tokens/scheme.scss` (variables de design)
- Breakpoints : `src/breakpoints.scss`
- SASS compiler : `modern` mode (`next.config.mjs`)
- **Once UI props > CSS** : padding/margin via `paddingX="s"` pas `style={{}}` ou className
- **Pas de Tailwind** dans ce projet

---

## 🗄️ Database & Services Integration

### Neon Postgres + Drizzle ORM
- Connection via `src/core/database/` : Neon HTTP + WebSocket (Edge compatible)
- Usage: `import { db } from "@/core/database"` — env : `DATABASE_URL`

### GitHub MDX (Blog & Projets)
- Data layer : `src/core/github/githubContent.ts` — lit les MDX depuis `bardy-michael-content` via API GitHub (raw.githubusercontent.com)
- Cache ISR 3600s avec `unstable_cache`
- Images servies via `/api/content-image/...` (proxy 302 → GitHub raw en prod, lecture locale en dev)
- **Pas de rebuild nécessaire** pour publier du contenu

### Google APIs
- `src/lib/google/` : service account (GMB reviews), env `GOOGLE_SERVICE_ACCOUNT_KEY`, `GOOGLE_PLACE_ID`, `GOOGLE_LOCATION_ID`, `GOOGLE_PLACE_API_KEY`
- Disponibilités RDV : `src/app/api/cal/availability/` (Cal.com : `CAL_API_KEY`/`CALCOM_API_KEY`)

### Web Push Notifications (PWA)
- Server actions : `src/modules/pwa/controllers/` (subscribe, notify)
- VAPID keys en .env : `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`
- Service Worker : `public/sw.js` (servi avec CSP stricte via headers `next.config.mjs`)

### PDF & Puppeteer
- `src/lib/pdf/EstimationPdf.tsx` : génération PDF via `@react-pdf/renderer`
- `src/lib/puppeteer/browser.ts` : puppeteer-core + `@sparticuz/chromium-min` (serverless) pour le site-check

---

## 📝 MDX & Content Management
- MDX enabled via `@next/mdx` plugin (`next.config.mjs`), extensions `.md`/`.mdx`/`.ts`/`.tsx`
- Custom MDX components : `src/shared/components/RawGithubFile.tsx` (Code, Blockquote, Link, etc.)
- Contenu dans le dépôt séparé `bardy-michael-content` (sous-module `content/`)

# 🚀 Workflows & Commands

## Package Manager (pnpm v10)
**ALWAYS pnpm** - défini dans `package.json` sous `packageManager`
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
pnpm clean          # depcheck + ts-prune + npm-check + eslint --fix
```

**Cron Jobs** (Vercel scheduled functions, planning dans `vercel.json`):
- `src/app/api/cron/social-share/` - partage auto blog vers LinkedIn/Facebook (07:00)
- `src/app/api/cron/indexNow/` - SEO ping IndexNow/Bing (00:00, `INDEXNOW_API_KEY`)
- `src/app/api/cron/refresh-facebook-token/` - refresh token FB (mensuel)
- Auth cron : header `Authorization: Bearer ${CRON_SECRET}`
- **Tokens sociaux stockés dans Vercel Edge Config** (`@vercel/edge-config`), pas en .env ; écriture via API Vercel (`VERCEL_API_TOKEN`, `VERCEL_EDGE_ID`, `VERCEL_TEAM_ID`)

---

## Testing Strategy (Vitest + React Testing Library)
- `vitest.config.ts` - jsdom, globals, alias `@` → `./src`
- `vitest.setup.ts` - @testing-library/jest-dom
- Tests : `src/__tests__/*.test.ts`
- Coverage : `pnpm test:coverage`

---

## Linting & Formatting Standards
- **ESLint 9 flat config — deux fichiers coexistent :**
  - `eslint.config.js` (CJS, **config effective**) : spread de `eslint-config-next` + `eslint-plugin-unused-imports`
  - `eslint.config.mjs` (FlatCompat) : hérité, ne pas privilégier
  - Run: `pnpm lint` (quiet) · Auto-fix: `pnpm clean:eslint`
  - Vars inutilisées : préfixer `_` ; `unused-imports/no-unused-imports` = error
- **Biome** : `biome.json` (formatter) — 2 espaces, doubles quotes
- **Cleanup:** `pnpm clean:deps` (depcheck) · `pnpm clean:exports` (ts-prune) · `pnpm clean:check` (npm-check)

# 📐 Project-Specific Conventions

## TypeScript Configuration
- Path alias: `@/*` → `./src/*` (tsconfig.json)
- Strict mode: `noUncheckedIndexedAccess`, `strictNullChecks`, `noImplicitAny`, `verbatimModuleSyntax` (→ `import type { X }` pour les types)
- Custom types in `src/core/utils/utils.ts` : `PostType`, `ProjectType`, `AvisType`
- React 19 avec JSX automatic runtime

## Routing & Internationalization
**French-first routing** (all routes in French):
- `/a-propos`, `/realisations`, `/blog`, `/solutions`, `/webmaster-albi`, `/estimation`, `/site-check`
- Redirects in `next.config.mjs` : `/about` → `/a-propos`, `/work` → `/realisations`
- Breadcrumbs in `src/core/config/config.js` : maps route names to content entries
- Password-protected routes : `protectedRoutes` object dans `config.js` (ex : `/atomicbd81`) + `src/shared/components/PasswordProtect.tsx`

---

## SEO & Metadata Strategy
- `src/modules/seo/` : `Meta.tsx` + `Schema.tsx` (rich data maison)
- `Meta.generate()` (Once UI) dans `src/app/layout.tsx` pour metadata globales
- Dynamic pages : `generateMetadata()` async
- **Sitemap:** `src/app/sitemap.ts` (routes + posts MDX) · **Robots:** `src/app/robots.ts`
- **Schema.org** dans `src/app/layout.tsx` : LocalBusiness + avis Google, offres depuis `estimationData.ts`, BlogPosting pour articles
- **OG images :** statiques `public/images/og/` · génération dynamique `src/app/og/` · scraping `src/app/api/og/fetch/` · proxy `src/app/api/og/proxy/`

---

## Image Management
- Next.js Image, formats AVIF/WebP (`next.config.mjs`)
- Remote patterns : `imagedelivery.net` (Cloudflare), `lh3.googleusercontent.com`, `avatars.githubusercontent.com`, `www.google.com`
- Images de couverture : `image.webp` (site) + `image.png` (OG) — voir `content/docs/image-generation.md`
- Cache immutable 1 an sur `/images`, `/fonts`, `/trademark` (headers)

---

## Environment Variables
`.env.local` (liste réelle, vérifiée par grep dans src/) :
- `DATABASE_URL` - Neon Postgres
- `CONTENT_REPO_TOKEN` / `GITHUB_TOKEN` - API GitHub (lecture MDX)
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` - PWA push
- `CRON_SECRET` - auth des crons Vercel
- `GOOGLE_SERVICE_ACCOUNT_KEY`, `GOOGLE_PLACE_ID`, `GOOGLE_PLACE_API_KEY`, `GOOGLE_LOCATION_ID` - Google APIs
- `CAL_API_KEY` / `CALCOM_API_KEY` - Cal.com
- `GITHUB_TOKEN`, `GITHUB_API` - stats repos
- `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`, `FACEBOOK_PAGE_ID`, `LINKEDIN_AUTHOR_URN` - réseaux sociaux (les **tokens** vivent dans Edge Config)
- `VERCEL_API_TOKEN`, `VERCEL_EDGE_ID`, `VERCEL_TEAM_ID` - écriture Edge Config
- `INDEXNOW_API_KEY` - SEO ping
- `SMTP_USER`, `SMTP_PASS` - nodemailer
- `NEXT_PUBLIC_SITE_DOMAIN`

---

# 🎯 Common Implementation Tasks

## Adding a new blog post
1. Create `content/blog/<slug>.mdx` dans le dépôt `bardy-michael-content`
2. Ajouter l'image de couverture dans `blog/<slug>/image.webp` + `image.png`
3. Le site récupère le MDX via API GitHub (cache ISR 3600s)
4. Social sharing auto via cron `social-share`

## Adding a new project/réalisation
1. Create `content/projects/<slug>.mdx` dans le dépôt `bardy-michael-content`
2. Fetch via `getProjects()` in realisations page
3. Page : `src/app/(main)/realisations/[slug]/page.tsx`
4. Composants : `src/modules/projects/components/`
5. API : `src/app/api/project/[slug]/`

## Adding a new page with metadata
```tsx
// File: src/app/(main)/new-page/page.tsx
import { Meta } from "@once-ui-system/core";
import { baseURL } from "@/core/config";
export async function generateMetadata() {
  return Meta.generate({
    title: "Page Title",
    description: "Description",
    baseURL: baseURL,
    path: "/new-page",
  });
}
```

## API route pattern (Next 16)
```typescript
import { NextResponse } from 'next/server';
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return NextResponse.json({ data: slug });
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
src/
├── app/                    # Routes Next.js (App Router)
│   ├── layout.tsx          # Root layout + schema.org
│   ├── og/                 # OG image generation
│   ├── (main)/             # Routes FR (layout partagé Header/Footer)
│   │   ├── blog/[slug]/    # Articles MDX
│   │   ├── realisations/   # Portfolio projets
│   │   ├── estimation/     # Parallel routes @headline/@resume
│   │   ├── site-check/     # Audit de site
│   │   ├── a-propos/
│   │   ├── solutions/
│   │   ├── webmaster-albi/
│   │   ├── mentions-legales/
│   │   └── atomicbd81/     # Protégée par mot de passe
│   ├── api/                # API endpoints
│   │   ├── cron/           # Scheduled jobs (Vercel)
│   │   ├── og/             # OpenGraph scraping/proxy
│   │   ├── post/[slug]/    # Blog post API
│   │   ├── project/[slug]/ # Project API
│   │   ├── cal/            # Calendar endpoints
│   │   ├── estimation/     # Estimation API
│   │   ├── revalidate/     # Revalidation ISR
│   │   ├── content-image/  # Proxy images
│   │   └── github/         # GitHub stats
│   ├── resources/          # ← SUPPRIMÉ (utiliser src/core/config/)
│   └── utils/              # ← SUPPRIMÉ (utiliser src/core/utils/)
├── core/                   # ← Cœur applicatif
│   ├── config/             # Hub config (config.js, content.js, icons.ts)
│   ├── database/           # Neon Postgres + Drizzle
│   ├── github/             # Data layer GitHub (githubContent.ts)
│   ├── utils/              # Types + helpers (utils.ts, formatDate.ts, urlUtils.ts)
│   └── Providers.tsx       # ThemeProvider, IconProvider, ToastProvider
├── modules/                # ← Architecture MVC par domaine
│   ├── seo/                # Meta.tsx, Schema.tsx
│   ├── blog/               # Module blog (controllers, models, views, components)
│   ├── estimation/         # Module estimation
│   ├── projects/           # Module projets/réalisations
│   ├── pwa/                # Module PWA (controllers, views)
│   ├── reactions/          # Module réactions/commentaires
│   ├── calendar/           # Module calendrier
│   └── site-check/         # Audit de site (perf, seo, a11y, mobile, sécurité)
├── shared/                 # ← Composants/libs partagés
│   ├── components/         # Header, Footer, ThemeToggle, PasswordProtect, etc.
│   ├── ui/                 # chart/, animateNumber/
│   └── lib/                # google/, pdf/, puppeteer/, jsxSvg/
├── breakpoints.scss         # Breakpoints SCSS
└── __tests__/              # Tests unitaires (Vitest)
```

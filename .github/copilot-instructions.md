# Architecture & Patterns

## Once UI Design System
Ce projet utilise **@once-ui-system/core** comme système de design principal. La documentation complète est dans [.github/agents/once-ui.md](.github/agents/once-ui.md).
- Import des composants depuis `@once-ui-system/core` (Flex, Grid, Column, Button, etc.)
- Les styles CSS sont pré-configurés dans `src/app/layout.tsx` avec `@once-ui-system/core/css/styles.css`
- Configuration du thème dans `src/app/Providers.tsx` via ThemeProvider, IconProvider, ToastProvider
- Ne pas utiliser de CSS custom, privilégier les props Once UI (padding, gap, fillWidth, etc.)

## Structure Next.js 15 + App Router
- **App Router** avec organisation par routes dans `src/app/`
- Route principale `(main)` avec layout partagé (`src/app/(main)/layout.tsx`) incluant Header, Footer, RDV, CookieConsent
- Routes françaises : `/a-propos`, `/realisations`, `/blog`, `/estimation`, `/webmaster-albi`, `/solutions`
- Routes API dans `src/app/api/` utilisant les conventions Next.js (GET, POST functions)

## Server/Client Components Pattern
- **Par défaut Server Components** - garder les composants serveur sauf nécessité
- Utiliser `"use client"` uniquement pour l'interactivité (événements, hooks, useState)
- Exemples client : Header, ThemeToggle, CookieConsent, Calendar, tous les composants dans `src/components/chart/`
- Server Actions dans `src/app/utils/serverActions.ts` et `src/app/pwaActions.ts` avec directive `'use server'`

## Configuration Centralisée
La config est centralisée dans `src/app/resources/` :
- `config.js` : routes, fonts (Josefin_Sans, Geist, Open_Sans), styles, effets visuels, baseURL
- `content.js` : contenus (person, social, home, about, blog, work, gallery)
- `icons.ts` : bibliothèque d'icônes pour IconProvider
- Importer via `import { baseURL, style, fonts } from "@/app/resources"`

## Styling & CSS
- SCSS Modules pour les composants custom : `*.module.scss` avec import `import styles from "./Component.module.scss"`
- Tokens CSS dans `src/tokens/scheme.scss` pour les variables de design
- Breakpoints définis dans `src/components/breakpoints.scss`
- Compiler moderne SASS configuré dans `next.config.js`

## Database & External Services
- **Neon Postgres** avec Drizzle ORM (`src/utils/db.ts`)
- **Wisp CMS** pour le blog (`@wisp-cms/client`, config dans `src/app/utils/wispClient.ts`)
- **Google Calendar API** via `src/lib/google/` pour gestion des rendez-vous
- **Web Push** pour notifications PWA (VAPID keys, config dans `src/app/pwaActions.ts`)

## MDX & Content
- MDX configuré avec `@next/mdx` dans `next.config.js`
- Extensions : `.md`, `.mdx`, `.ts`, `.tsx`
- Composants MDX personnalisés dans `src/components/mdx.tsx`

# Workflows & Commands

## Package Manager
**TOUJOURS utiliser pnpm** (v10.12.1) - défini dans `packageManager` du package.json
```bash
pnpm i              # Installation
pnpm dev           # Dev avec Turbopack
pnpm dev-https     # Dev HTTPS (certificats dans ./certificates/)
pnpm build         # Build production
pnpm test          # Tests avec Vitest
pnpm lint          # ESLint quiet mode
```

## Tests
- **Vitest** configuré avec React Testing Library (`vitest.config.ts`)
- Tests dans `src/__tests__/` avec pattern `*.test.ts`
- Setup dans `vitest.setup.ts`
- Alias `@/` résolu vers `./src`
- Commandes : `pnpm test` (run), `pnpm test:watch`, `pnpm test:coverage`

## Linting & Formatting
- **ESLint** avec config Next.js + TypeScript (fichiers : `eslint.config.js`, `eslint.config.mjs`)
- **Biome** configuré (`biome.json`) : formatter avec indentation 2 espaces, quotes doubles
- Scripts de nettoyage : `pnpm clean:deps` (depcheck), `pnpm clean:exports` (ts-prune), `pnpm clean` (tout)

# Project-Specific Conventions

## TypeScript Paths
- Alias `@/*` résolu vers `./src/*` (configuré dans `tsconfig.json`)
- Mode strict activé avec `noUncheckedIndexedAccess`
- Types personnalisés dans `src/app/utils/types.ts`

## Routing & Redirects
- Redirections permanentes en français : `/about` → `/a-propos`, `/work` → `/realisations`
- Routes protégées par mot de passe définies dans `src/app/resources/config.js`
- Breadcrumbs configurés dans `breadCrumbs` de config.js

## SEO & Metadata
- Génération de metadata via `Meta.generate()` depuis Once UI
- Sitemap dynamique dans `src/app/sitemap.ts`
- Robots.txt dans `src/app/robots.ts`
- Open Graph images via `/api/og` et route dédiée `src/app/og/route.tsx`
- Schema.org rich data dans `src/app/layout.tsx` (LocalBusiness, reviews, services)

## Images
- Configuration Next.js Image dans `next.config.js` avec patterns distants (Cloudflare, Google, GitHub)
- Images locales dans `public/images/` organisées par catégorie (blog, gallery, projects, og)

## PWA
- Service Worker dans `public/sw.js`
- Manifest dans `public/manifest.json`
- Actions PWA server-side dans `src/app/pwaActions.ts`
- Composant PWA dans `src/components/PWA.tsx`

## Form Actions
- Actions client-side dans `src/components/formActionClient.tsx`
- Actions serveur dans `src/app/utils/serverActions.ts`
- Pattern : async server actions avec revalidation Next.js

## API Routes Patterns
- Toutes les routes API retournent `NextResponse.json()`
- Params async : `{ params }: { params: Promise<{ slug: string }> }`
- Auth via headers ou Edge Config Vercel
- Cron jobs dans `src/app/api/cron/` (social-share, indexNow, refresh-token)

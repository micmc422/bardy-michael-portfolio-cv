# AGENTS.md — Portfolio & CV Michaël Bardy (occitaweb.fr)

> Fichier auto-chargé par les agents IA (Hermes, Copilot, Claude Code…). Source de vérité : le code.
> Détails étendus : `.github/copilot-instructions.md` · API Once UI : `.github/agents/once-ui.md` · Index : `llms.txt`

## Projet

Site portfolio/CV de Michaël Bardy, développeur web freelance à Albi (activité **Occitaweb**). Déployé sur Vercel → https://occitaweb.fr. Français-first (routes, contenu, commits).

## Stack réelle (vérifiée dans package.json)

- **Next.js 16.2.6** (App Router, Turbopack en dev) + **React 19.2.6** + **TypeScript 5.9 strict**
- **@once-ui-system/core 1.6.4** — design system principal (props, PAS de CSS custom pour ses composants)
- SCSS Modules (`*.module.scss`) + tokens `src/tokens/scheme.scss` — **pas de Tailwind**
- Wisp CMS (`@wisp-cms/client`) pour blog & projets · Neon Postgres + Drizzle (`src/utils/db.ts`)
- MDX via `@next/mdx` · Recharts + chart.js · @react-pdf/renderer · puppeteer-core/@sparticuz (site-check)
- Tests : **Vitest** + Testing Library (jsdom) · Lint : **ESLint 9** (`eslint.config.js`, importe `eslint-config-next` + FlatCompat dans `eslint.config.mjs`) · Format : Biome (2 espaces, doubles quotes)

## Commandes (pnpm 10 UNIQUEMENT — jamais npm/yarn)

```bash
pnpm dev             # dev Turbopack :3000
pnpm build           # build prod
pnpm lint            # eslint --quiet
pnpm test            # vitest run  (tests dans src/__tests__/)
pnpm test:coverage
pnpm clean           # depcheck + ts-prune + npm-check + eslint --fix
```

Vérification avant de livrer : `pnpm test && pnpm lint && pnpm build`.

## Architecture — points d'entrée

| Chemin | Rôle |
|---|---|
| `src/app/resources/config.js` | **Hub config** : baseURL, routes, protectedRoutes, fonts, style/effects |
| `src/app/resources/content.js` | Tout le contenu (person, home, about, blog, work, services…) — JSX inline |
| `src/app/layout.tsx` | Root layout : Once UI css, Meta, Schema.org (LocalBusiness + avis Google) |
| `src/app/(main)/` | Routes FR : `a-propos`, `realisations`, `blog`, `estimation`, `solutions`, `webmaster-albi`, `site-check`, `atomicbd81` |
| `src/app/utils/serverActions.ts` | Server actions Wisp (`getPosts`, `getPostBySlug`, `getProjects`…) cachées via `unstable_cache(..., { revalidate: 3600 })` |
| `src/app/utils/types.ts` | `PostType`, `WispPost`, `ProjectType`, `AvisType` |
| `src/app/api/` | Routes API : `post/[slug]`, `project/[slug]`, `github/…`, `cal/…`, `og/…`, `estimation/[type]`, `revalidate/…`, `cron/…` |
| `src/app/api/cron/` | Crons Vercel (voir `vercel.json`) : indexNow, social-share (LinkedIn/FB), refresh-facebook-token |
| `src/modules/seo/` | `Meta.tsx`, `Schema.tsx` |
| `src/components/` | Composants ; `mdx.tsx` = composants MDX custom ; `chart/` = client |
| `src/lib/` | google (Calendar), pdf (EstimationPdf), puppeteer, schema, jsxSvg |
| `src/app/utils/siteCheck/` | Audit de site (perf, seo, a11y, mobile, sécurité) |

Alias : `@/*` → `./src/*`.

## Conventions fortes

1. **Server Components par défaut** ; `"use client"` seulement si events/hooks/APIs navigateur.
2. **Once UI d'abord** : layout via props (`fillWidth`, `gap="m"`, `paddingX="s"`), jamais de CSS custom sur ses composants. SCSS Modules réservés aux composants maison.
   - **Docs agent Once UI** : harness codegen sur https://docs.once-ui.com/ai/ (`rules.compact.md` avant toute tâche UI, `catalog.json`, `tasks/index.json`, `gotchas.json`) ; questions exploratoires via MCP **context7** (`resolve-library-id` → `query-docs` sur `/once-ui-system/core`). Config IDE : `.vscode/mcp.json` ; config Hermes : serveur `context7` déjà enregistré.
3. **Params async Next 16** : `{ params }: { params: Promise<{ slug: string }> }` puis `await params`.
4. **Routes en français** + redirects permanents (`/about`→`/a-propos`, `/work`→`/realisations`) dans `next.config.mjs`.
5. Data Wisp toujours via server actions cachées — ne pas appeler `wisp.*` directement dans les pages.
   - **Rédaction d'articles blog** : suivre `docs/wisp-articles-guideline.md`. Générer les brouillons `.mdx` dans `articles/` (non versionné) ; l'utilisateur les colle dans Wisp CMS. Composants custom via `<div data-wisp-react-component="true" data-name="Faq|Steps" data-props="<JSON encodeURIComponent>">`.
6. Variables d'env dans `.env.local` (jamais commité) : `DATABASE_URL`, `WISP_BLOG_ID`, VAPID keys, tokens sociaux, `PASSWORD_PROTECT_ROUTE`.
7. TS strict : `noUncheckedIndexedAccess`, `verbatimModuleSyntax` (→ `import type` obligatoire pour les types).
8. Vars inutilisées : préfixe `_` (règle ESLint) ; `unused-imports/no-unused-imports` = error.

## Pièges connus

- Repo hébergé dans **WSL2 Debian**, Hermes tourne sous Windows : chemins repo-relatifs OK ; pour git en git-bash, ajouter si besoin `git config --global --add safe.directory '%(prefix)///wsl.localhost/Debian/home/occitaweb/projets/bardy-michael-portfolio-cv'`.
- Deux configs ESLint coexistent : `eslint.config.js` (utilisée, CJS) et `eslint.config.mjs` (FlatCompat). Modifier la `.js` en priorité.
- `content.js` contient du JSX dans un `.js` — ne pas « corriger » ça.
- PWA : `public/sw.js` servi avec CSP stricte (headers dans `next.config.mjs`).

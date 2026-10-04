# AGENTS.md — Portfolio & CV Michaël Bardy (occitaweb.fr)

> Fichier auto-chargé par les agents IA (Hermes, Copilot, Claude Code…). Source de vérité : le code.
> Dépôt de contenu : `bardy-michael-content` (articles/projects MDX, images)
> Détails étendus : `.github/copilot-instructions.md` · API Once UI : `.github/agents/once-ui.md` · Index : `llms.txt`

## Projet

Site portfolio/CV de Michaël Bardy, développeur web freelance à Albi (activité **Occitaweb**). Déployé sur Vercel → https://occitaweb.fr. Français-first (routes, contenu, commits).

**Contenu géré séparément** : les articles et projets MDX vivent dans le dépôt `bardy-michael-content` (lu dynamiquement via l'API GitHub + cache ISR). Les articles ne sont PAS dans le Wisp CMS.

## Stack réelle (vérifiée dans package.json)

- **Next.js 16.3.8** (App Router, Turbopack en dev) + **React 19.2.8** + **TypeScript 5.9 strict**
- **@once-ui-system/core 2.0.0** — design system principal (props, PAS de CSS custom pour ses composants)
- SCSS Modules (`*.module.scss`) + tokens `src/tokens/scheme.scss` — **pas de Tailwind**
- Contenu MDX depuis GitHub (raw.githubusercontent.com) — **pas de Wisp CMS**
- MDX via `@next/mdx` · Recharts + chart.js · @react-pdf/renderer · puppeteer-core/@sparticuz (site-check)
- Tests : **Vitest** + Testing Library (jsdom) · Lint : **ESLint 9** (`eslint.config.js`) · Format : Biome (2 espaces, doubles quotes)

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
| `src/lib/githubContent.ts` | **Data layer GitHub** : lit les MDX depuis `bardy-michael-content` via API + raw |
| `src/app/api/content-image/` | Proxy d'images depuis le dépôt de contenu (sans copie dans `public/blog`) |
| `src/app/utils/types.ts` | `PostType`, `ProjectType`, `AvisType` |
| `src/app/api/` | Routes API : `post/[slug]`, `project/[slug]`, `github/…`, `cal/…`, `og/…`, `estimation/[type]`, `revalidate/…`, `cron/…` |
| `src/app/api/cron/` | Crons Vercel (voir `vercel.json`) : indexNow, social-share (LinkedIn/FB), refresh-facebook-token |
| `src/modules/seo/` | `Meta.tsx`, `Schema.tsx` |
| `src/components/` | Composants ; `mdx.tsx` = composants MDX custom ; `chart/` = client |
| `src/lib/` | google (Calendar), pdf (EstimationPdf), puppeteer, schema, jsxSvg |
| `src/app/utils/siteCheck/` | Audit de site (perf, seo, a11y, mobile, sécurité) |

Alias : `@/*` → `./src/*`.

## Conventions fortes

1. **Server Components par défaut** ; `"use client"` seulement si events/hooks/APIs navigateur.
2. **Once UI 2.0 d'abord** : layout via props (`fillWidth`, `gap="m"`, `paddingX="s"`), jamais de CSS custom sur ses composants. SCSS Modules réservés aux composants maison.
   - **Imports 2.0** : `LayoutProvider` → `@once-ui-system/core/next` ; charts (`BarChart`, `ChartProps`, `DataPoint`, `ChartVariant`…) → `@once-ui-system/core/data` ; `CodeBlock` → `@once-ui-system/core/code` ; `MediaUpload` → `@once-ui-system/core/media`. `Icon.name` est typé `IconName` — les noms custom du projet sont déclarés via `IconLibraryOverrides` dans `src/app/resources/icons.ts`.
   - **Questions exploratoires** via MCP **context7** (`resolve-library-id` → `query-docs` sur `/once-ui-system/core`).

<!-- once-ui-agent-harness:start -->
## Once UI codegen harness

Before generating Once UI code, load the harness from your installed package (not full doc pages):

1. Read `node_modules/@once-ui-system/core/ai/manifest.json`
2. Load bootstrap: `ai/rules.compact.md` + `ai/catalog.json`
3. Match intent via `ai/tasks/index.json` → fetch task bundle + component slices
4. Validate: `npx once-ui-validate-ai-code path/to/file.tsx`

npm exports: `@once-ui-system/core/ai/manifest.json`

Remote fallback: https://docs.once-ui.com/ai/manifest.json
<!-- once-ui-agent-harness:end -->

3. **Params async Next 16** : `{ params }: { params: Promise<{ slug: string }> }` puis `await params`.
4. **Routes en français** + redirects permanents (`/about`→`/a-propos`, `/work`→`/realisations`) dans `next.config.mjs`.
5. **Contenu MDX** : les articles et projets sont dans le dépôt `bardy-michael-content` (`content/blog/<slug>.mdx`). Le site les lit via l'API GitHub (raw.githubusercontent.com) + cache ISR 3600s dans `githubContent.ts`. **Aucune donnée Wisp**.
   - **Rédaction** : suivre `docs/articles-guideline.md` dans le dépôt `bardy-michael-content`.
6. Variables d'env dans `.env.local` (jamais commité) : `DATABASE_URL`, `GITHUB_TOKEN`/`CONTENT_REPO_TOKEN`, VAPID keys, tokens sociaux, `PASSWORD_PROTECT_ROUTE`.
7. TS strict : `noUncheckedIndexedAccess`, `verbatimModuleSyntax` (→ `import type` obligatoire pour les types).
8. Vars inutilisées : préfixe `_` (règle ESLint) ; `unused-imports/no-unused-imports` = error.

### Contenu MDX (nouveau pipeline)

Le site ne dépend **plus** de Wisp CMS. Les articles sont des fichiers `.mdx` versionnés dans `bardy-michael-content/content/blog/` avec frontmatter YAML + composants JSX (`<Faq />`, `<Steps />`). Images dans `blog/<slug>/2d89acac-7cff-46da-a8e0-6c0cba53f22c.png` du dépôt contenu.

Pour modifier le contenu : PR sur `bardy-michael-content` (pas besoin de rebuild du site).

### Serveurs MCP enregistrés (Hermes)

| Serveur | Transport | Outils | Usage |
|---|---|---|---|
| `context7` | HTTP `https://mcp.context7.com/mcp` | `resolve-library-id`, `query-docs` | Docs à jour Once UI / Next 16 / React 19 avant toute tâche UI ou upgrade |
| `github` | HTTP `https://api.githubcopilot.com/mcp/` | ~90 (issues, PR, reviews, Actions, code search, secret scanning) | Cycle PR, revue de code, CI |

Ré-installation depuis zéro :

```bash
hermes mcp add context7 --url https://mcp.context7.com/mcp --auth header       # → MCP_CONTEXT7_API_KEY
hermes mcp add github   --url https://api.githubcopilot.com/mcp/ --auth header # → MCP_GITHUB_API_KEY (PAT ghp_…)
hermes mcp list && hermes mcp test <nom>
```

Clés uniquement dans `~/.hermes/.env` (jamais dans `config.yaml` ni le repo ; le repo a ses propres `CONTEXT7_API_KEY` / `GITHUB_TOKEN` dans `.env.local`). Après ajout d'un serveur, ouvrir une **nouvelle session** pour que ses outils soient exposés à l'agent (`/reload-mcp` reconnecte les serveurs mais ne suffit pas toujours, et les slash commands ne sont pas relayés par tous les clients IDE/ACP).

## Pièges connus

- Repo et agents tournent **tous en WSL2 Debian 13** (Hermes installé nativement en WSL : `~/.local/bin/hermes`, `HERMES_HOME=~/.hermes` côté Linux, `terminal.backend: local`). Chemins Linux natifs — ne pas passer par `/mnt/c/`. Node 22, pnpm 10.12.
- Deux configs ESLint coexistent : `eslint.config.js` (utilisée, CJS) et `eslint.config.mjs` (FlatCompat). Modifier la `.js` en priorité.
- `content.js` contient du JSX dans un `.js` — ne pas « corriger » ça.
- PWA : `public/sw.js` servi avec CSP stricte (headers dans `next.config.mjs`).
- **Contenu séparé** : les articles MDX ne sont PAS dans ce dépôt. Modifier `bardy-michael-content` pour le contenu.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

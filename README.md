# 🎨 Bardy Michael — Portfolio & CV

Ce dépôt contient le code source du site portfolio de **Michael Bardy**, développeur web freelance.

👉 **Site en ligne** : [https://occitaweb.fr](https://occitaweb.fr)

---

## 🚀 Technologies utilisées

- **Next.js 16** — App Router, Turbopack en dev
- **React 19** + **TypeScript** (mode strict) — typage fort pour un code robuste
- **Once UI** (`@once-ui-system/core`) — design system, complété par des SCSS Modules
- **Wisp CMS** — blog et réalisations (headless)
- **Neon Postgres + Drizzle ORM** — données (réactions, commentaires…)
- **Vercel** — déploiement serverless, crons et Edge Config
- **Vitest + Testing Library** — tests unitaires

---

## 🔧 Développement local

### Prérequis

- Node.js >= 20
- pnpm (version définie dans `package.json` → `packageManager`)

### Installation

```bash
pnpm install
```

Lancer le projet

```bash
pnpm dev
```

Le site sera accessible sur <http://localhost:3000>

### Scripts utiles

```bash
pnpm build           # build production
pnpm lint            # ESLint
pnpm test            # tests unitaires (Vitest)
pnpm test:coverage   # couverture
pnpm clean           # depcheck + ts-prune + npm-check + eslint --fix
```

### 🚀 Déploiement

Le site est déployé automatiquement sur Vercel lors des pushs sur la branche main.

## 🤖 Agents IA

Les instructions pour les assistants de code (Copilot, Hermes, Claude…) sont dans :

- `AGENTS.md` — conventions, architecture, pièges (source de vérité)
- `llms.txt` — index des fichiers clés
- `.github/copilot-instructions.md` — patterns détaillés

## 📄 À propos

Ce projet a pour objectif de présenter :

- Mon parcours
- Mes réalisations (projets web)
- Mes compétences en développement

Priorité : rapidité, accessibilité, expérience utilisateur.

### 📩 Contact

Si vous souhaitez collaborer ou me contacter :
<michael.bardy@occitaweb.fr>

## Licence

Ce projet est open source sous licence MIT.

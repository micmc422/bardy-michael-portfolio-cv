# 🎨 Bardy Michael — Monorepo

Ce dépôt contient le code source du monorepo de **Michael Bardy**, développeur web freelance, organisé en 4 applications distinctes.

👉 **Sites en ligne** :
- Portfolio : [https://occitaweb.fr](https://occitaweb.fr)
- Blog : [https://blog.occitaweb.fr](https://blog.occitaweb.fr)
- Site-Check (SEO) : [https://seo.occitaweb.fr](https://seo.occitaweb.fr)
- Documentation : [https://docs.occitaweb.fr](https://docs.occitaweb.fr)

---

## 📁 Structure du Monorepo

```
├── apps/
│   ├── portfolio/     # Site portfolio principal (port 3000)
│   ├── blog/          # Application blog (port 3001)
│   ├── site-check/    # Outil d'analyse SEO (port 3002)
│   └── docs/          # Documentation Nextra (port 3003)
├── packages/
│   ├── config/        # Configuration partagée (resources, types)
│   ├── ui/            # Composants UI partagés
│   ├── utils/         # Utilitaires partagés
│   └── seo-resources/ # Ressources SEO (types, analysis)
└── pnpm-workspace.yaml
```

---

## 🚀 Technologies utilisées

- **Next.js 16** — framework React moderne
- **TypeScript** — typage fort pour un code robuste
- **Once UI** — système de design
- **Nextra** — documentation
- **pnpm** — gestionnaire de paquets pour monorepo
- **Vitest** — tests unitaires
- **Vercel** — déploiement serverless

---

## 🔧 Développement local

### Prérequis

- Node.js >= 18
- pnpm >= 10.12.1

### Installation

```bash
pnpm install
```

### Lancer les projets

```bash
# Lancer tous les projets
pnpm dev

# Lancer un projet spécifique
pnpm dev:portfolio    # Port 3000
pnpm dev:blog         # Port 3001
pnpm dev:site-check   # Port 3002
pnpm dev:docs         # Port 3003
```

### Build

```bash
# Build tous les projets
pnpm build

# Build un projet spécifique
pnpm build:portfolio
pnpm build:blog
pnpm build:site-check
pnpm build:docs
```

### Tests

```bash
# Lancer tous les tests
pnpm test

# Lancer les tests d'un package spécifique
pnpm test:utils
pnpm test:seo
pnpm test:portfolio
```

---

## 📦 Applications

### Portfolio (apps/portfolio)
Site portfolio principal présentant :
- Mon parcours
- Mes réalisations (projets web)
- Mes compétences en développement
- Services et tarifs

### Blog (apps/blog)
Application blog avec :
- Articles techniques
- Tutoriels
- Actualités web

### Site-Check (apps/site-check)
Outil d'analyse SEO gratuit :
- Analyse des performances
- Audit SEO
- Vérification de sécurité
- Test d'accessibilité

### Documentation (apps/docs)
Documentation Nextra du monorepo :
- Guide de démarrage
- Documentation des packages
- API Reference

---

## 📦 Packages partagés

| Package | Description |
|---------|-------------|
| @repo/config | Configuration partagée (routes, fonts, style) |
| @repo/ui | Composants UI (Header, Footer, etc.) |
| @repo/utils | Utilitaires (slugify, formatDate, etc.) |
| @repo/seo-resources | Ressources SEO (types, analysis) |

---

## 🔄 Redirections

Les anciennes URLs sont automatiquement redirigées :

| Ancienne URL | Nouvelle destination |
|--------------|---------------------|
| `/blog/*` | `https://blog.occitaweb.fr/*` |
| `/site-check/*` | `https://seo.occitaweb.fr/*` |
| `/about/*` | `/a-propos/*` |
| `/work/*` | `/realisations/*` |

---

## 📝 TODO

- [ ] Améliorer la couverture de tests
- [ ] Ajouter des tests E2E

### 📩 Contact

Si vous souhaitez collaborer ou me contacter :
<michael.bardy@occitaweb.fr>

## Licence

Ce projet est open source sous licence MIT.

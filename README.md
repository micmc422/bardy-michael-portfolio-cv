# 🎨 Bardy Michael — Monorepo

Ce dépôt contient le code source du monorepo de **Michael Bardy**, développeur web freelance, organisé en 3 applications distinctes.

👉 **Sites en ligne** :
- Portfolio : [https://occitaweb.fr](https://occitaweb.fr)
- Blog : [https://blog.occitaweb.fr](https://blog.occitaweb.fr)
- Site-Check (SEO) : [https://seo.occitaweb.fr](https://seo.occitaweb.fr)

---

## 📁 Structure du Monorepo

```
├── apps/
│   ├── portfolio/     # Site portfolio principal
│   ├── blog/          # Application blog
│   └── site-check/    # Outil d'analyse SEO
├── packages/
│   ├── config/        # Configuration partagée (resources, types)
│   ├── ui/            # Composants UI partagés
│   └── utils/         # Utilitaires partagés
└── pnpm-workspace.yaml
```

---

## 🚀 Technologies utilisées

- **Next.js 16** — framework React moderne
- **TypeScript** — typage fort pour un code robuste
- **Once UI** — système de design
- **pnpm** — gestionnaire de paquets pour monorepo
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
```

### Build

```bash
# Build tous les projets
pnpm build

# Build un projet spécifique
pnpm build:portfolio
pnpm build:blog
pnpm build:site-check
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

---

## 📝 TODO

- [ ] Ajouter des tests unitaires
- [ ] Améliorer la documentation

### 📩 Contact

Si vous souhaitez collaborer ou me contacter :
<michael.bardy@occitaweb.fr>

## Licence

Ce projet est open source sous licence MIT.

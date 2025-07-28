export interface EstimationData {
    siteType: string
    features: string[]
    pages: number
    timeline: string
    budget: string
    description: string
}

export interface PricingTier {
    name: string
    slug: string
    basePrice: number
    annualPrice: number
    periodicite?: "annuelle" | "mensuelle";
    icon: string
    description: string
    includes: string[]
    options: Option[]
    notes?: string
    serviceType: "Développement Web" | "Maintenance" | "Optimisation";
}

export interface Option {
    name: string;
    price: number;
    periodicite?: "annuelle" | "mensuelle";
    icon: string;
    slug: string;
    description: string;
}


export const vitrineAdditionalFeatures: Option[] = [
    {
        name: "Blog intégré",
        price: 400,
        icon: "book",
        slug: "blog-integre",
        description: "Animez votre site et améliorez votre référencement naturel en publiant régulièrement des articles, des actualités ou des conseils."
    },
    {
        name: "Module de prise de rendez-vous",
        price: 600,
        icon: "calendar",
        slug: "prise-rendez-vous",
        description: "Simplifiez la gestion de vos consultations, réservations ou devis en ligne directement depuis votre site, disponible 24/7."
    },
    {
        name: "Galerie photo/vidéo avancée",
        price: 350,
        icon: "images",
        slug: "galerie-avancee",
        description: "Mettez en valeur vos produits ou réalisations avec une galerie interactive, personnalisable et optimisée pour l'affichage."
    },
    {
        name: "Optimisation de la vitesse (Core Web Vitals)",
        price: 300,
        icon: "zap",
        slug: "optimisation-vitesse",
        description: "Améliorez l'expérience utilisateur et votre positionnement SEO grâce à un site ultra-rapide, essentiel pour retenir vos visiteurs."
    },
    {
        name: "Maintenance et mises à jour annuelles",
        price: 500,
        periodicite: "annuelle",
        icon: "settings",
        slug: "maintenance-annuelle",
        description: "Assurez la sécurité, le bon fonctionnement et la compatibilité de votre site avec les dernières technologies, tout au long de l'année."
    },
    {
        name: "Intégration réseaux sociaux avancée",
        price: 200,
        icon: "share2",
        slug: "reseaux-sociaux-avances",
        description: "Connectez votre site à vos profils sociaux pour augmenter votre visibilité et faciliter le partage de votre contenu."
    },
    {
        name: "Support multilingue (2 langues)",
        price: 700,
        icon: "flag",
        slug: "support-multilingue",
        description: "Élargissez votre audience en rendant votre site accessible en plusieurs langues, augmentant ainsi votre portée géographique."
    },
    {
        name: "Statistiques de visite avancées (Matomo/Google Analytics)",
        price: 250,
        icon: "bar-chart-2",
        slug: "statistiques-avancees",
        description: "Comprenez le comportement de vos visiteurs, identifiez les pages populaires et prenez des décisions éclairées pour optimiser votre site."
    },
    {
        name: "Rédaction de contenu (2 pages)",
        price: 450,
        icon: "pen",
        slug: "redaction-contenu",
        description: "Confiez la création de contenus percutants et optimisés SEO pour deux de vos pages, captivant ainsi votre audience et les moteurs de recherche."
    },
    {
        name: "Formation à l'administration du site",
        price: 300,
        icon: "checkCircle",
        slug: "formation-administration",
        description: "Devenez autonome dans la gestion et la mise à jour de votre site grâce à une formation personnalisée et pratique."
    },
];

export const portfolioAdditionalFeatures: Option[] = [
    {
        name: "Intégration de réseaux sociaux avancée",
        price: 200,
        icon: "share2",
        slug: "reseaux-sociaux-avances",
        description: "Mettez en avant vos profils Behance, Dribbble, Instagram, etc., pour une visibilité accrue de vos créations et projets."
    },
    {
        name: "Page 'À propos' détaillée avec vidéo",
        price: 450,
        icon: "person",
        slug: "page-a-propos-video",
        description: "Humanisez votre profil et présentez votre parcours, votre vision ou votre processus de travail de manière dynamique et engageante."
    },
    {
        name: "Formulaire de contact personnalisé avec upload",
        price: 350,
        icon: "upload",
        slug: "formulaire-upload",
        description: "Facilitez la prise de contact pour des projets ou collaborations en permettant à vos prospects d'envoyer directement des fichiers."
    },
    {
        name: "Animations sur mesure pour projets",
        price: 700,
        icon: "sparkles",
        slug: "animations-projets",
        description: "Donnez vie à vos créations avec des effets visuels uniques et des micro-animations qui captiveront vos visiteurs et mettront en valeur votre travail."
    },
    {
        name: "Témoignages clients dynamiques",
        price: 300,
        icon: "users",
        slug: "temoignages-dynamiques",
        description: "Affichez de manière attrayante les retours positifs de vos clients, renforçant ainsi votre crédibilité et votre professionnalisme."
    },
    {
        name: "Optimisation pour la vitesse de chargement",
        price: 250,
        icon: "zap",
        slug: "optimisation-vitesse",
        description: "Assurez un chargement rapide de vos images et animations pour une expérience fluide, essentielle pour un portfolio."
    },
    {
        name: "Intégration d'une boutique simple (produits numériques)",
        price: 800,
        icon: "shoppingCart",
        slug: "boutique-numerique",
        description: "Vendez vos créations numériques (brushes, templates, photos) directement depuis votre portfolio avec un système simple et sécurisé."
    },
    {
        name: "Section 'Services' ou 'Compétences' interactive",
        price: 400,
        icon: "book",
        slug: "services-competences-interactives",
        description: "Présentez vos offres ou expertises de manière engageante avec des éléments interactifs (graphiques, toggles, etc.)."
    },
    {
        name: "Consultation et stratégie de contenu",
        price: 500,
        icon: "lightbulb",
        slug: "strategie-contenu",
        description: "Développez une approche stratégique pour vos contenus (articles de blog, descriptions de projets) afin d'attirer plus de clients potentiels."
    },
    {
        name: "Maintenance et mises à jour annuelles",
        price: 500,
        periodicite: "annuelle",
        icon: "settings",
        slug: "maintenance-annuelle",
        description: "Garantissez le bon fonctionnement de votre portfolio, sa sécurité et l'accès aux dernières fonctionnalités pour une image professionnelle constante."
    },
];

export const ecommerceAdditionalFeatures: Option[] = [
    {
        name: "Gestion des stocks avancée",
        price: 600,
        icon: "package",
        slug: "gestion-stocks-avancee",
        description: "Suivez précisément vos niveaux de stock, recevez des alertes pour les seuils bas et gérez facilement les réassorts pour éviter les ruptures."
    },
    {
        name: "Système d'avis et notations clients",
        price: 400,
        icon: "star",
        slug: "avis-notations-clients",
        description: "Encouragez vos clients à laisser des commentaires et des notes, renforçant ainsi la preuve sociale et la confiance des futurs acheteurs."
    },
    {
        name: "Intégration CRM / Emailing (ex: Mailchimp)",
        price: 800,
        icon: "email",
        slug: "integration-crm-emailing",
        description: "Automatisez vos campagnes d'emailing (newsletters, paniers abandonnés) et gérez vos relations clients pour fidéliser votre audience."
    },
    {
        name: "Fonctionnalités Cross-sell / Up-sell",
        price: 550,
        icon: "arrow-right-circle",
        slug: "cross-up-sell",
        description: "Proposez intelligemment des produits complémentaires ou des versions améliorées pour augmenter la valeur moyenne de chaque commande."
    },
    {
        name: "Suivi des livraisons et notifications",
        price: 700,
        icon: "truck",
        slug: "suivi-livraisons",
        description: "Offrez à vos clients la possibilité de suivre l'acheminement de leurs commandes en temps réel et recevez des notifications personnalisées."
    },
    {
        name: "Filtres et recherche avancée de produits",
        price: 450,
        icon: "filter",
        slug: "filtres-recherche-produits",
        description: "Permettez à vos clients de trouver rapidement ce qu'ils cherchent grâce à des filtres précis (taille, couleur, prix) et une recherche performante."
    },
    {
        name: "Chèques cadeaux / Codes promotionnels",
        price: 300,
        icon: "gift",
        slug: "cheques-cadeaux-codes-promo",
        description: "Mettez en place des stratégies marketing avec des bons d'achat et des réductions pour attirer de nouveaux clients et fidéliser les existants."
    },
    {
        name: "Plusieurs devises / langues",
        price: 900,
        icon: "globe",
        slug: "devises-langues",
        description: "Ouvrez votre boutique à l'international en proposant les prix dans différentes devises et le contenu dans plusieurs langues."
    },
    {
        name: "Optimisation SEO pour produits",
        price: 350,
        icon: "trending-up",
        slug: "seo-produits",
        description: "Optimisez les fiches de vos produits pour les moteurs de recherche afin d'attirer plus de trafic qualifié et augmenter vos ventes."
    },
    {
        name: "Module de blog pour actualités produits",
        price: 400,
        icon: "book",
        slug: "blog-actualites-produits",
        description: "Partagez des articles sur vos nouveaux produits, des guides d'achat ou des conseils d'utilisation pour engager votre clientèle et améliorer votre SEO."
    },
];

export const crmPlateformeAdditionalFeatures: Option[] = [
    {
        name: "Tableaux de bord personnalisables",
        price: 800,
        icon: "layout",
        slug: "tableaux-bord-personnalisables",
        description: "Permettez aux utilisateurs de visualiser les données les plus pertinentes pour leurs activités grâce à des tableaux de bord ajustables."
    },
    {
        name: "Gestion avancée des rôles et permissions",
        price: 700,
        icon: "users",
        slug: "gestion-roles-permissions",
        description: "Contrôlez finement l'accès aux différentes fonctionnalités et données de la plateforme en attribuant des rôles et des permissions spécifiques à chaque utilisateur."
    },
    {
        name: "Module de communication interne (chat/notifications)",
        price: 900,
        icon: "messages",
        slug: "communication-interne",
        description: "Facilitez les échanges et la collaboration entre les utilisateurs de la plateforme via un système de chat intégré et des notifications instantanées."
    },
    {
        name: "Intégration d'outils tiers (calendrier, visio)",
        price: 1000,
        icon: "link",
        slug: "integration-outils-tiers",
        description: "Connectez votre plateforme aux outils essentiels de votre quotidien (Google Calendar, Zoom, Slack) pour une productivité accrue et un flux de travail centralisé."
    },
    {
        name: "Exportation de données personnalisée",
        price: 500,
        icon: "download",
        slug: "exportation-donnees",
        description: "Offrez la possibilité d'exporter des rapports et des informations spécifiques (clients, ventes, projets) dans divers formats pour une analyse approfondie."
    },
    {
        name: "Historique des activités et audit trail",
        price: 600,
        icon: "activity",
        slug: "historique-activites",
        description: "Suivez toutes les actions réalisées sur la plateforme (qui a fait quoi et quand) pour une traçabilité complète et un contrôle accru."
    },
    {
        name: "Notifications et alertes automatisées",
        price: 450,
        icon: "bell",
        slug: "notifications-automatisees",
        description: "Configurez des alertes automatiques pour les événements importants (nouvelle tâche, échéance, modification de statut) afin de ne rien manquer."
    },
    {
        name: "Module de gestion de projets/tâches",
        price: 850,
        icon: "check-square",
        slug: "gestion-projets-taches",
        description: "Organisez, assignez et suivez l'avancement des projets et des tâches directement depuis la plateforme pour une meilleure coordination d'équipe."
    },
    {
        name: "Support et maintenance niveau 2",
        price: 1200,
        periodicite: "annuelle",
        icon: "life-buoy",
        slug: "support-maintenance-n2",
        description: "Bénéficiez d'un support technique approfondi pour résoudre les problèmes complexes et assurer la continuité de service de votre plateforme."
    },
    {
        name: "Formation utilisateur complète",
        price: 600,
        icon: "monitor",
        slug: "formation-utilisateur",
        description: "Assurez une prise en main rapide et efficace de la plateforme pour tous vos utilisateurs grâce à des sessions de formation complètes et adaptées."
    },
];
export const optimisationAdditionalFeatures: Option[] = [
    {
        name: "Audit complet UX / SEO / technique",
        price: 300,
        icon: "search",
        slug: "audit-complet",
        description: "Analyse approfondie de votre site actuel pour identifier les points faibles en ergonomie, référencement et performance technique."
    },
    {
        name: "Reconstruction sur stack moderne (Next.js, Vite, etc.)",
        price: 900,
        icon: "refresh-ccw",
        slug: "migration-stack-moderne",
        description: "Migration de votre site vers une architecture plus rapide, plus sécurisée et évolutive (Next.js, Astro, etc.)."
    },
    {
        name: "Optimisation SEO technique",
        price: 350,
        icon: "trending-up",
        slug: "optimisation-seo-technique",
        description: "Nettoyage du code, structuration des balises, amélioration du maillage interne et des métadonnées pour un meilleur positionnement."
    },
    {
        name: "Refonte UI (interface utilisateur)",
        price: 600,
        icon: "layout",
        slug: "refonte-ui",
        description: "Modernisation complète de l'apparence de votre site pour un design plus engageant, responsive et cohérent avec votre identité visuelle."
    },
    {
        name: "Sécurisation & mise en conformité RGPD",
        price: 250,
        icon: "shield",
        slug: "securisation-rgpd",
        description: "Mise à jour des protocoles de sécurité, ajout de bannières de consentement, et conformité avec les réglementations européennes."
    },
    {
        name: "Amélioration des Core Web Vitals",
        price: 300,
        icon: "activity",
        slug: "core-web-vitals",
        description: "Optimisations ciblées pour améliorer les scores Google sur les indicateurs de performance clés (LCP, CLS, FID)."
    },
    {
        name: "Migration hébergement / DNS",
        price: 200,
        icon: "server",
        slug: "migration-hebergement",
        description: "Transfert sécurisé de votre site vers un hébergement plus performant, avec gestion DNS et configuration SSL incluses."
    }
]
export const gestionAdditionalFeatures: Option[] = [
    {
        name: "Pack Sérénité (3h de modifications/mois)",
        price: 120,
        icon: "clock",
        slug: "pack-serenite",
        description: "Idéal pour les sites évolutifs : jusqu’à 3h de modifications techniques ou de contenus incluses chaque mois."
    },
    {
        name: "Surveillance de sécurité 24/7",
        price: 90,
        periodicite: "mensuelle",
        icon: "shield-off",
        slug: "surveillance-securite",
        description: "Détection proactive des intrusions, alertes en temps réel, protection renforcée contre les attaques et malwares."
    },
    {
        name: "Rapport mensuel d'activité",
        price: 60,
        periodicite: "mensuelle",
        icon: "file-bar-chart",
        slug: "rapport-activite",
        description: "Recevez chaque mois un rapport clair sur les mises à jour, sauvegardes, statistiques de fréquentation et état global du site."
    },
    {
        name: "Intervention urgente garantie sous 24h",
        price: 80,
        periodicite: "mensuelle",
        icon: "alert-triangle",
        slug: "intervention-urgence",
        description: "En cas de bug ou de panne, bénéficiez d’une prise en charge prioritaire sous 24h, même le week-end."
    },
    {
        name: "Sauvegardes externes (multi-localisation)",
        price: 50,
        periodicite: "mensuelle",
        icon: "database",
        slug: "sauvegardes-externe",
        description: "Ajout d’un système de sauvegarde en cloud décentralisé (ex : Dropbox, AWS, Google Drive) pour plus de sécurité."
    },
    {
        name: "Optimisation mensuelle des performances",
        price: 100,
        periodicite: "mensuelle",
        icon: "cpu",
        slug: "optimisation-performance-mensuelle",
        description: "Audit et nettoyage mensuel des fichiers inutiles, base de données, cache, images lourdes pour garder un site fluide."
    },
    {
        name: "Ajout de contenu mensuel (1 article ou page)",
        price: 150,
        periodicite: "mensuelle",
        icon: "plus-square",
        slug: "ajout-contenu-mensuel",
        description: "Publiez régulièrement un article ou une nouvelle page, avec intégration optimisée et relecture incluse."
    }
]

export const siteTypes: PricingTier[] = [
    {
        name: "Site Vitrine",
        slug: "vitrine",
        basePrice: 600,
        annualPrice: 250,
        icon: "globe",
        description: "Obtenez une estimation rapide et gratuite pour la création de votre site vitrine. Formulaire simple, réponse personnalisée selon vos besoins et votre budget.",
        includes: ["Design responsive", "5-10 pages", "Formulaire de contact", "SEO de base"],
        options: vitrineAdditionalFeatures,
        serviceType: "Développement Web"
    },
    {
        name: "Portfolio",
        slug: "portfolio",
        basePrice: 800,
        annualPrice: 250,
        icon: "briefcase",
        description: "Créez un portfolio professionnel pour exposer vos projets : graphiste, développeur, photographe... Estimez votre site dès maintenant, sans engagement.",
        includes: ["Galerie interactive", "Blog intégré", "Animations", "Optimisation images"],
        options: portfolioAdditionalFeatures,
        serviceType: "Développement Web"
    },
    {
        name: "E-commerce",
        slug: "e-commerce",
        basePrice: 2500,
        annualPrice: 1000,
        icon: "shoppingCart",
        description: "Obtenez une estimation précise pour la création de votre boutique en ligne : panier, paiement, livraison, CMS, SEO, tout est pensé pour vendre efficacement.",
        includes: ["Catalogue produits", "Panier", "Paiement sécurisé", "Gestion commandes"],
        options: ecommerceAdditionalFeatures,
        serviceType: "Développement Web"
    },
    {
        name: "CRM/Plateforme",
        slug: "CRM",
        basePrice: 4500,
        annualPrice: 2000,
        icon: "users",
        description: "Besoin d’un outil adapté à votre activité ? Estimez le prix de votre CRM personnalisé : gestion client, workflow, interface web et automatisations.",
        includes: ["Interface admin", "Base de données", "Authentification", "API personnalisée"],
        options: crmPlateformeAdditionalFeatures,
        serviceType: "Développement Web"
    },
    {
        name: "Refonte & Optimisation",
        slug: "optimisation",
        basePrice: 600,
        annualPrice: 0,
        icon: "palette",
        description: "Refonte complète et optimisation SEO de votre site internet. Obtenez une estimation personnalisée pour un site moderne, rapide et mieux référencé.",
        includes: ["Audit UX / SEO / performance",
            "Amélioration design, vitesse & structure",
            "Migration vers une stack plus moderne (ex. WordPress > Next.js)", "Sécurisation & mises à jour techniques"],
        options: optimisationAdditionalFeatures,
        serviceType: "Optimisation"
    },
    {
        name: "Maintenance & gestion",
        slug: "maintenance",
        basePrice: 50,
        annualPrice: 250,
        icon: "construction",
        description: "Gestion courante et maintenance de votre site web : mises à jour, sécurité, support technique et suivi pour assurer performance et stabilité au quotidien.",
        includes: ["Mises à jour régulières (CMS, plugins, sécurité)", "Sauvegardes automatisées", "Assistance prioritaire & suivi des performances", "1h de modifications incluses chaque mois"],
        options: gestionAdditionalFeatures,
        serviceType: "Maintenance"
    },
]
/*
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "reviewCount": reviews.length
    },
*/
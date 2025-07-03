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
    icon: string
    description: string
    includes: string[]
    options: Option[]
}

export interface Option {
    name: string;
    price: number;
    icon: string;
    slug: string;
    description: string;
}


export const vitrineAdditionalFeatures = [
    {
        name: "Blog intégré",
        price: 400,
        icon: "edit",
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
        icon: "image",
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
        icon: "language",
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
        icon: "file-text",
        slug: "redaction-contenu",
        description: "Confiez la création de contenus percutants et optimisés SEO pour deux de vos pages, captivant ainsi votre audience et les moteurs de recherche."
    },
    {
        name: "Formation à l'administration du site",
        price: 300,
        icon: "user-check",
        slug: "formation-administration",
        description: "Devenez autonome dans la gestion et la mise à jour de votre site grâce à une formation personnalisée et pratique."
    },
];

export const portfolioAdditionalFeatures = [
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
        icon: "video",
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
        icon: "message-square",
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
        icon: "shopping-bag",
        slug: "boutique-numerique",
        description: "Vendez vos créations numériques (brushes, templates, photos) directement depuis votre portfolio avec un système simple et sécurisé."
    },
    {
        name: "Section 'Services' ou 'Compétences' interactive",
        price: 400,
        icon: "tool",
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
        icon: "settings",
        slug: "maintenance-annuelle",
        description: "Garantissez le bon fonctionnement de votre portfolio, sa sécurité et l'accès aux dernières fonctionnalités pour une image professionnelle constante."
    },
];

export const ecommerceAdditionalFeatures = [
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
        icon: "mail",
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
        icon: "book-open",
        slug: "blog-actualites-produits",
        description: "Partagez des articles sur vos nouveaux produits, des guides d'achat ou des conseils d'utilisation pour engager votre clientèle et améliorer votre SEO."
    },
];

export const crmPlateformeAdditionalFeatures = [
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
        icon: "message-circle",
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

export const siteTypes: PricingTier[] = [
    {
        name: "Site Vitrine",
        slug: "vitrine",
        basePrice: 600,
        icon: "globe",
        description: "Site de présentation simple et élégant",
        includes: ["Design responsive", "5-10 pages", "Formulaire de contact", "SEO de base"],
        options: vitrineAdditionalFeatures
    },
    {
        name: "Portfolio",
        slug: "portfolio",
        basePrice: 1200,
        icon: "briefcase",
        description: "Showcase professionnel de vos réalisations",
        includes: ["Galerie interactive", "Blog intégré", "Animations", "Optimisation images"],
        options: portfolioAdditionalFeatures
    },
    {
        name: "E-commerce",
        slug: "e-commerce",
        basePrice: 2500,
        icon: "shoppingCart",
        description: "Boutique en ligne complète",
        includes: ["Catalogue produits", "Panier", "Paiement sécurisé", "Gestion commandes"],
        options: ecommerceAdditionalFeatures
    },
    {
        name: "CRM/Plateforme",
        slug: "CRM",
        basePrice: 4500,
        icon: "users",
        description: "Application web sur mesure",
        includes: ["Interface admin", "Base de données", "Authentification", "API personnalisée"],
        options: crmPlateformeAdditionalFeatures
    },
]

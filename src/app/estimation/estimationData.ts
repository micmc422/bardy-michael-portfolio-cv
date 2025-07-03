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
}

export const siteTypes: PricingTier[] = [
    {
        name: "Site Vitrine",
        slug: "vitrine",
        basePrice: 600,
        icon: "globe",
        description: "Site de présentation simple et élégant",
        includes: ["Design responsive", "5-10 pages", "Formulaire de contact", "SEO de base"],
    },
    {
        name: "Portfolio",
        slug: "portfolio",
        basePrice: 1200,
        icon: "briefcase",
        description: "Showcase professionnel de vos réalisations",
        includes: ["Galerie interactive", "Blog intégré", "Animations", "Optimisation images"],
    },
    {
        name: "E-commerce",
        slug: "e-commerce",
        basePrice: 2500,
        icon: "shoppingCart",
        description: "Boutique en ligne complète",
        includes: ["Catalogue produits", "Panier", "Paiement sécurisé", "Gestion commandes"],
    },
    {
        name: "CRM/Plateforme",
        slug: "CRM",
        basePrice: 4500,
        icon: "users",
        description: "Application web sur mesure",
        includes: ["Interface admin", "Base de données", "Authentification", "API personnalisée"],
    },
]

export const additionalFeatures = [
    { name: "Design animé", price: 500, icon: "palette" },
    { name: "SEO avancé", price: 300, icon: "search" },
    { name: "Application mobile", price: 1500, icon: "smartphone" },
    { name: "Sécurité renforcée", price: 400, icon: "shield" },
    { name: "Optimisation performance", price: 350, icon: "zap" },
    { name: "Intégration CRM", price: 800, icon: "database" },
    { name: "Newsletter/Emailing", price: 250, icon: "mail" },
    { name: "Analytics avancés", price: 200, icon: "barchart3" },
]

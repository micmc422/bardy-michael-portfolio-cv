export const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://occitaweb.fr";

const performance = {
    title: "Performance",
    description: "Temps de chargement, taille de la page, requêtes HTTP",
    icon: "zap",
};

const seo = {
    title: "SEO",
    description: "Optimisation pour les moteurs de recherche",
    icon: "search",
};

const security = {
    title: "Sécurité",
    description: "HTTPS, en-têtes de sécurité, contenu mixte",
    icon: "shield",
};

const accessibility = {
    title: "Accessibilité",
    description: "Conformité WCAG, ARIA, navigation clavier",
    icon: "users",
};

const mobile = {
    title: "Mobile",
    description: "Responsive design, viewport, cibles tactiles",
    icon: "mobile",
};

export const siteCheck = {
    path: "/site-check",
    label: "Analyse de Site",
    title: "Analyse de Site Web",
    description:
        "Analysez gratuitement votre site web : performance, SEO, sécurité, accessibilité et compatibilité mobile. Obtenez des recommandations personnalisées pour améliorer votre site.",
    headline: "Analysez votre site web",
    subline:
        "Obtenez une analyse complète de votre site web en quelques secondes. Performance, SEO, sécurité, accessibilité et compatibilité mobile.",
    categories: {
        performance,
        seo,
        security,
        accessibility,
        mobile,
    },
};

export const person = {
    name: "Michaël Bardy",
    avatar: "/images/avatar.jpg",
};

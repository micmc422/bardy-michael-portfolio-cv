import type { IconName } from "@once-ui-system/core";
import type { FaqAccordionItem } from "@/shared/components/FaqAccordion";
import { siteTypes } from "./estimationData";

export type IncludedService = {
  name: string;
  icon: IconName;
  description: string;
};

export const includedServices: IncludedService[] = [
  {
    name: "Design sur mesure",
    icon: "palette",
    description: "Une interface unique, pensée pour votre identité visuelle et vos visiteurs.",
  },
  {
    name: "Design responsive",
    icon: "mobile",
    description: "Un rendu soigné sur mobile, tablette et ordinateur, sans compromis.",
  },
  {
    name: "Sécurité & performance",
    icon: "shield",
    description: "Un site sécurisé, hébergé sur une infrastructure rapide et optimisé pour le SEO.",
  },
];

export const estimationSteps = [
  { label: "Type de projet", hint: "Choisissez la base de votre site" },
  { label: "Options", hint: "Ajustez les fonctionnalités" },
  { label: "Devis", hint: "Recevez une proposition détaillée" },
] as const;

const startingPrice = (slug: string) => siteTypes.find((site) => site.slug === slug)?.basePrice;

export const estimationFaq: FaqAccordionItem[] = [
  {
    title: "Quels types de projets web puis-je estimer ?",
    content:
      "Sites vitrines, portfolios, boutiques en ligne et plateformes/CRM sur mesure, mais aussi la refonte, l'optimisation et la maintenance d'un site existant.",
  },
  {
    title: "Quel est le prix de départ d'un site vitrine ?",
    content: `Un site vitrine démarre à partir de ${startingPrice("vitrine")} € HT. Les options (blog, rendez-vous, multilingue…) s'ajoutent selon vos besoins et sont chiffrées en temps réel.`,
  },
  {
    title: "Que comprend un devis e-commerce ?",
    content: `Catalogue produits, paiement sécurisé, gestion des commandes et espace d'administration. Le prix de départ est de ${startingPrice("e-commerce")} € HT, avec des options pour les stocks, les codes promo ou le multi-devises.`,
  },
  {
    title: "Que comprend la refonte et l'optimisation ?",
    content: `À partir de ${startingPrice("optimisation")} € HT : audit UX, SEO et performance, améliorations de conception et migration vers une stack moderne si nécessaire.`,
  },
  {
    title: "Que couvre le plan de maintenance ?",
    content: `À partir de ${startingPrice("maintenance")} € HT par mois : mises à jour régulières, sécurité, support technique et suivi des performances, avec 1 heure de modifications incluse chaque mois.`,
  },
  {
    title: "Comment obtenir un devis personnalisé ?",
    content:
      "Choisissez un type de projet, cochez vos options puis laissez votre courriel : je vous transmets un devis détaillé dans les meilleurs délais. Vous pouvez aussi prendre rendez-vous pour en discuter.",
    link: { label: "Prendre rendez-vous", path: "#RDV" },
  },
  {
    title: "Mes informations personnelles sont-elles partagées ?",
    content:
      "Non. Votre adresse courriel sert uniquement à vous envoyer le devis, et aucune donnée collectée via les cookies n'est transmise à des tiers.",
  },
];

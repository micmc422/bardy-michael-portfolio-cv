import Link from "next/link";
import { FaqAccordion, type FaqAccordionItem } from "@/shared/components/FaqAccordion";
import { buildFaqSchema } from "@/modules/blog/components/Faq";
import { ArrowIcon } from "./ArrowIcon";
import homeStyles from "../home.module.scss";
import styles from "../faq.module.scss";

const FAQ_ITEMS: FaqAccordionItem[] = [
  {
    title: "Quels types de sites proposez-vous ?",
    content:
      "Je conçois des sites vitrines, des boutiques en ligne, des blogs et des applications web sur mesure, avec un fort accent sur la performance, l'accessibilité et l'expérience utilisateur. Chaque projet est adapté aux besoins spécifiques de mes clients.",
  },
  {
    title: "Combien coûte un site internet ?",
    content:
      "Un site vitrine démarre à partir de 600 € HT. Le prix final dépend du périmètre, des fonctionnalités et du niveau de personnalisation. L'outil d'estimation en ligne vous donne une première fourchette en quelques minutes, et un devis précis est établi avant tout démarrage.",
    link: { label: "Estimer mon projet", path: "/estimation" },
  },
  {
    title: "Quelles technologies utilisez-vous ?",
    content:
      "Je travaille principalement avec Next.js, React et TypeScript, avec PostgreSQL pour les données et Vercel pour le déploiement. Pour les équipes qui préfèrent un back-office familier, je peux aussi intégrer WordPress en mode headless.",
  },
  {
    title: "Travaillez-vous avec des agences ou directement avec des clients ?",
    content:
      "Les deux. Je collabore régulièrement avec des agences en tant que développeur freelance, et j'accompagne aussi directement des entreprises, artisans ou indépendants pour la création et la gestion de leur site web.",
  },
  {
    title: "Quels sont vos délais de réalisation ?",
    content:
      "Cela dépend de la complexité du projet. Un site vitrine simple peut être prêt en 2 à 4 semaines, tandis qu'un site plus technique ou une refonte complète peut prendre plusieurs mois. Je m'engage toujours sur un planning réaliste dès le départ.",
  },
  {
    title: "Assurez-vous la maintenance après la livraison ?",
    content:
      "Oui. Je propose des forfaits de maintenance pour assurer la sécurité, les mises à jour techniques et les améliorations continues du site, selon vos besoins.",
  },
  {
    title: "Proposez-vous une formation à l'utilisation du site ?",
    content:
      "Tout à fait. Je propose des sessions de prise en main, à distance, pour que vous puissiez gérer vous-même votre contenu ou votre boutique en ligne en toute autonomie.",
  },
  {
    title: "Prenez-vous des stagiaires ?",
    content:
      "Non. Je travaille depuis mon domicile dans un environnement de télétravail pensé pour la concentration, ce qui ne permet pas d'assurer l'encadrement qu'exige un stage de qualité. Je préfère consacrer mon temps à mes clients et à la qualité des projets livrés.",
  },
];

export function FaqSection() {
  return (
    <section className={styles.section} aria-labelledby="faq-title">
      <div className={styles.intro}>
        <span className={homeStyles.eyebrow}>FAQ</span>
        <h2 id="faq-title" className={homeStyles.sectionTitle}>
          Vos questions, mes réponses.
        </h2>
        <p className={homeStyles.sectionLead}>
          Délais, budget, technologies, accompagnement : l&apos;essentiel avant de se lancer.
        </p>
        <Link href="#RDV" className={styles.help}>
          Une autre question ? Parlons-en
          <ArrowIcon />
        </Link>
      </div>
      <FaqAccordion items={FAQ_ITEMS} group="home-faq" defaultOpenFirst />
      {buildFaqSchema(FAQ_ITEMS, "home")}
    </section>
  );
}

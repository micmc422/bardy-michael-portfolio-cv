import { Code2, Gauge, Search, Accessibility, ShieldCheck, Workflow } from "lucide-react";
import { RevealFx } from "@once-ui-system/fx";
import styles from "../home.module.scss";

const expertises = [
  {
    icon: Code2,
    title: "Développement sur mesure",
    text: "Sites vitrines, e-commerce, portails clients et applications métier : une base de code propre, typée et maintenable, pensée pour évoluer avec votre activité.",
    tags: ["Next.js", "React", "TypeScript", "WordPress"],
  },
  {
    icon: Gauge,
    title: "Performance mesurable",
    text: "Rendu côté serveur, images optimisées, cache maîtrisé. Chaque page est auditée sur les Core Web Vitals pour offrir une expérience instantanée, y compris sur mobile.",
    tags: ["Core Web Vitals", "SSR", "Edge"],
  },
  {
    icon: Search,
    title: "SEO technique",
    text: "Structure sémantique, données structurées, maillage et sitemaps. Votre site est lisible par les moteurs de recherche et les IA dès sa conception.",
    tags: ["Schema.org", "Sitemap", "Meta"],
  },
  {
    icon: Accessibility,
    title: "Accessibilité et qualité",
    text: "HTML sémantique, navigation clavier, contrastes et tests automatisés. Un site utilisable par tous est aussi un site qui convertit mieux.",
    tags: ["ARIA", "WCAG", "Vitest"],
  },
  {
    icon: ShieldCheck,
    title: "Sécurité et maintenance",
    text: "Mises à jour, sauvegardes, supervision et durcissement des accès. Je reste présent après la livraison pour garder votre site sûr et à jour.",
    tags: ["HTTPS", "Sauvegardes", "Monitoring"],
  },
  {
    icon: Workflow,
    title: "Intégrations et automatisation",
    text: "Prise de rendez-vous, devis en ligne, paiement, CRM, emails et notifications : vos outils connectés pour vous faire gagner du temps chaque semaine.",
    tags: ["API", "Stripe", "Cal.com", "Postgres"],
  },
];

export function Expertise() {
  return (
    <section className={styles.section} aria-labelledby="expertise-title" style={{ display: "flex", flexDirection: "column", gap: "var(--static-space-40)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--static-space-16)" }}>
        <span className={styles.eyebrow}>Expertise</span>
        <h2 id="expertise-title" className={styles.sectionTitle}>
          Une exigence d&apos;ingénieur, au service de votre activité.
        </h2>
        <p className={styles.sectionLead}>
          Chaque projet réunit stratégie, design et développement. Résultat : des sites rapides, bien référencés et simples à faire vivre.
        </p>
      </div>
      <div className={styles.grid}>
        {expertises.map(({ icon: Icon, title, text, tags }, i) => (
          <RevealFx key={title} translateY={12} delay={i * 0.05} fillWidth>
            <article className={styles.card}>
              <span className={styles.cardIndex} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.cardIcon}><Icon size={22} aria-hidden="true" /></span>
              <h3 className={styles.cardTitle}>{title}</h3>
              <p className={styles.cardText}>{text}</p>
              <ul className={styles.cardTags} style={{ listStyle: "none", padding: 0 }}>
                {tags.map((tag) => <li key={tag} className={styles.cardTag}>{tag}</li>)}
              </ul>
            </article>
          </RevealFx>
        ))}
      </div>
    </section>
  );
}

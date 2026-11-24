import { Button } from "@once-ui-system/core";
import { RevealFx } from "@once-ui-system/fx";
import { about, person } from "@/core/config/content";
import styles from "../home.module.scss";

const chips = ["Next.js 16", "React 19", "TypeScript", "Node.js", "PostgreSQL", "Vercel"];

const lines: { delay: number; node: React.ReactNode }[] = [
  { delay: 0.2, node: <><span className={styles.prompt}>$</span> occitaweb init --projet votre-site</> },
  { delay: 0.7, node: <><span className={styles.ok}>✓</span> cadrage des objectifs et du périmètre</> },
  { delay: 1.1, node: <><span className={styles.ok}>✓</span> architecture Next.js + React Server Components</> },
  { delay: 1.5, node: <><span className={styles.ok}>✓</span> Core Web Vitals, SEO technique, accessibilité</> },
  { delay: 1.9, node: <><span className={styles.ok}>✓</span> sécurité, sauvegardes, supervision</> },
  { delay: 2.3, node: <><span className={styles.ok}>✓</span> déploiement continu sur Vercel</> },
  { delay: 2.8, node: <><span className={styles.dim}>→ en ligne.</span> <span className={styles.cursor} /></> },
];

export function Hero() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroGlow} aria-hidden="true" />
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--static-space-24)", alignItems: "flex-start" }}>
        <RevealFx translateY={8}>
          <a className={styles.status} href={about.calendar.link} aria-label="Planifier un rendez-vous">
            <span className={styles.pulse} aria-hidden="true" />
            Disponible pour de nouveaux projets · Albi, Occitanie
          </a>
        </RevealFx>
        <RevealFx translateY={12} delay={0.1}>
          <h1 className={styles.title} id="hero-title">
            Des produits web <span className={styles.gradientText}>rapides, fiables</span> et conçus pour durer.
          </h1>
        </RevealFx>
        <RevealFx translateY={12} delay={0.2}>
          <p className={styles.lead}>
            Occitaweb, création de sites internet et d&apos;applications web sur mesure. Depuis 2015, {person.firstName} Bardy
            conçoit, développe et fait évoluer des plateformes performantes pour des agences, des entreprises et des
            porteurs de projet. Formateur à l&apos;Université Champollion.
          </p>
        </RevealFx>
        <RevealFx translateY={12} delay={0.3}>
          <div className={styles.ctas}>
            <Button href={about.calendar.link} variant="primary" size="l" prefixIcon="calendar" arrowIcon>
              Planifier un échange
            </Button>
            <Button href="/realisations" variant="secondary" size="l">
              Voir les réalisations
            </Button>
          </div>
        </RevealFx>
        <ul className={styles.chips} aria-label="Technologies principales">
          {chips.map((chip) => (
            <li key={chip} className={styles.chip}>{chip}</li>
          ))}
        </ul>
      </div>

      <RevealFx translateY={16} delay={0.3}>
        <div className={styles.terminal} role="img" aria-label="Aperçu de la méthode de travail : du cadrage au déploiement continu">
          <div className={styles.terminalBar}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span style={{ marginLeft: "auto" }}>occitaweb.fr — build</span>
          </div>
          <div className={styles.terminalBody} aria-hidden="true">
            {lines.map((line, i) => (
              <span key={i} className={styles.line} style={{ animationDelay: `${line.delay}s` }}>
                {line.node}
              </span>
            ))}
          </div>
        </div>
      </RevealFx>
    </div>
  );
}

import Link from "next/link";
import styles from "../home.module.scss";
import { ArrowIcon } from "./ArrowIcon";

export function Solutions() {
  return (
    <section className={styles.section} aria-labelledby="solutions-title" style={{ paddingBlock: "var(--static-space-32)" }}>
      <div className={styles.band}>
        <div className={styles.bandCopy}>
          <span className={styles.eyebrow}>Fonctionnalités</span>
          <h2 id="solutions-title" className={styles.bandTitle}>
            Des fonctionnalités ciblées pour booster votre activité.
          </h2>
          <p className={styles.sectionLead}>
            Devis en ligne, prise de rendez-vous, catalogue interactif, espace client sécurisé ou automatisations : des outils concrets pour gagner du temps et enrichir l&apos;expérience de vos visiteurs.
          </p>
        </div>
        <Link href="/solutions" className={styles.bandLink}>
          Découvrir les solutions
          <ArrowIcon />
        </Link>
      </div>
    </section>
  );
}

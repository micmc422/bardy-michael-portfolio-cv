import { GlobeCanvas } from "./GlobeCanvas";
import home from "../home.module.scss";
import styles from "../showcase.module.scss";

const features = [
  {
    tag: "EDGE",
    title: "Un réseau de diffusion mondial",
    text: "Pages statiques et assets servis depuis le point de présence le plus proche de vos visiteurs.",
  },
  {
    tag: "SSR",
    title: "Rendu serveur et cache maîtrisé",
    text: "React Server Components, revalidation à la demande et données fraîches sans sacrifier la vitesse.",
  },
  {
    tag: "CI/CD",
    title: "Déploiements atomiques",
    text: "Chaque modification est testée, prévisualisée puis publiée sans interruption, avec retour arrière instantané.",
  },
];

export function GlobeSection() {
  return (
    <section className={`${home.section} ${styles.globeSection}`} aria-labelledby="infra-title">
      <div className={styles.globeGrid}>
        <div className={styles.globeCopy}>
          <span className={home.eyebrow}>Infrastructure</span>
          <h2 className={home.sectionTitle} id="infra-title">
            Votre site, servi <span className={styles.accent}>au plus près</span> de chaque visiteur.
          </h2>
          <p className={home.sectionLead}>
            Une architecture moderne déployée sur le réseau edge : temps de réponse courts partout dans le monde,
            haute disponibilité et mises en production sans friction.
          </p>
          <ul className={styles.featureList}>
            {features.map((feature) => (
              <li key={feature.tag} className={styles.feature}>
                <span className={styles.featureTag}>{feature.tag}</span>
                <div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureText}>{feature.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <figure
          className={styles.globeStage}
          aria-label="Visualisation 3D interactive d'un réseau mondial : des requêtes circulent depuis Albi vers des villes du monde entier"
        >
          <span className={`${styles.corner} ${styles.cornerTl}`} aria-hidden="true" />
          <span className={`${styles.corner} ${styles.cornerTr}`} aria-hidden="true" />
          <span className={`${styles.corner} ${styles.cornerBl}`} aria-hidden="true" />
          <span className={`${styles.corner} ${styles.cornerBr}`} aria-hidden="true" />
          <GlobeCanvas />
          <figcaption className={styles.hud} aria-hidden="true">
            <span>ORIGINE · ALBI 43.93°N 2.15°E</span>
            <span className={styles.hudLive}>
              <i /> 13 ROUTES ACTIVES
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

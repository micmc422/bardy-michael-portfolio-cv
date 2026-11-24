import styles from "../home.module.scss";

const steps = [
  { title: "Cadrage", text: "Échange de 30 minutes, analyse de vos objectifs, de votre audience et de l'existant. Vous repartez avec un périmètre et un planning clairs." },
  { title: "Conception", text: "Arborescence, maquettes et choix techniques validés avec vous avant la première ligne de code." },
  { title: "Développement", text: "Livraisons itératives sur un environnement de prévisualisation. Vous suivez l'avancement et validez à chaque étape." },
  { title: "Mise en ligne et suivi", text: "Déploiement, formation à la prise en main, puis maintenance et améliorations continues selon vos besoins." },
];

export function Process() {
  return (
    <section className={styles.section} aria-labelledby="process-title" style={{ display: "flex", flexDirection: "column", gap: "var(--static-space-40)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--static-space-16)" }}>
        <span className={styles.eyebrow}>Méthode</span>
        <h2 id="process-title" className={styles.sectionTitle}>De l&apos;idée à la mise en ligne, sans zone d&apos;ombre.</h2>
        <p className={styles.sectionLead}>
          Un processus transparent, un interlocuteur unique et des délais annoncés dès le départ.
        </p>
      </div>
      <ol className={styles.steps}>
        {steps.map((step, i) => (
          <li key={step.title} className={styles.step}>
            <span className={styles.stepNum}>{String(i + 1).padStart(2, "0")} /</span>
            <h3 className={styles.cardTitle}>{step.title}</h3>
            <p className={styles.cardText}>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

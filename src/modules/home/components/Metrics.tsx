import { getAvis } from "@/modules/blog/controllers/serverActions";
import styles from "../home.module.scss";

const START_YEAR = 2015;

export async function Metrics() {
  let rating: number | null = null;
  let count = 0;
  try {
    const avis = await getAvis();
    rating = Number(avis.rating) || null;
    count = avis.reviews.length;
  } catch {
    rating = null;
  }

  const years = new Date().getFullYear() - START_YEAR;
  const items = [
    { value: `${years}+`, label: "années à concevoir des sites et applications web" },
    { value: rating ? `${rating.toFixed(1)}/5` : "5/5", label: count ? `note moyenne sur ${count} avis Google` : "satisfaction client" },
    { value: "Full-stack", label: "du design à l'hébergement, un seul interlocuteur" },
    { value: "Formateur", label: "à l'Université Champollion" },
  ];

  return (
    <section className={styles.section} aria-label="Chiffres clés">
      <dl className={styles.metrics} style={{ margin: 0 }}>
        {items.map((item) => (
          <div key={item.label} className={styles.metric}>
            <dd className={styles.metricValue} style={{ margin: 0, order: 1 }}>{item.value}</dd>
            <dt className={styles.metricLabel} style={{ order: 2 }}>{item.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}

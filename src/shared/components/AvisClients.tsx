import { getAvis } from "@/modules/blog/controllers/serverActions";
import homeStyles from "@/modules/home/home.module.scss";
import styles from "./avisClients.module.scss";

export interface AvisType {
    author_name: string,
    author_url: string,
    language: 'fr-FR',
    original_language: 'fr' | "en",
    profile_photo_url: string,
    rating: number,
    relative_time_description: string,
    text: string,
    time: number,
    translated: string
}

function Stars({ rating }: { rating: number }) {
    const value = Math.max(0, Math.min(5, Math.round(rating)));
    return (
        <span className={styles.stars} role="img" aria-label={`Note : ${value} sur 5`}>
            {Array.from({ length: 5 }, (_, i) => (
                <svg
                    key={i}
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    focusable="false"
                    className={i < value ? styles.starOn : styles.starOff}
                >
                    <path d="M10 1.6l2.5 5.4 5.9.7-4.3 4 1.1 5.8L10 14.6 4.8 17.5l1.1-5.8-4.3-4 5.9-.7L10 1.6z" fill="currentColor" />
                </svg>
            ))}
        </span>
    );
}

function Avis({ author_name, author_url, profile_photo_url, rating, text, relative_time_description }: AvisType) {
    return (
        <li className={styles.item}>
            <figure className={styles.card}>
                <Stars rating={rating} />
                <blockquote className={styles.quote}>{text}</blockquote>
                <figcaption className={styles.author}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={profile_photo_url}
                        alt=""
                        width={40}
                        height={40}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className={styles.avatar}
                    />
                    <span className={styles.meta}>
                        <a href={author_url} target="_blank" rel="noopener noreferrer" className={styles.name}>
                            {author_name}
                        </a>
                        <span className={styles.date}>{relative_time_description}</span>
                    </span>
                </figcaption>
            </figure>
        </li>
    );
}

export async function AvisClient() {
    const { reviews, rating } = await getAvis();
    if (!reviews.length) return null;

    return (
        <section className={styles.section} aria-labelledby="avis-title">
            <div className={styles.head}>
                <div className={styles.headCopy}>
                    <span className={homeStyles.eyebrow}>Avis clients</span>
                    <h2 id="avis-title" className={homeStyles.sectionTitle}>
                        Ils m&apos;ont fait confiance.
                    </h2>
                    <p className={homeStyles.sectionLead}>
                        Les retours de clients, d&apos;agences et de partenaires, publiés sur Google.
                    </p>
                </div>
                {rating !== null && (
                    <div className={styles.summary}>
                        <span className={styles.score}>{rating.toFixed(1).replace(".", ",")}</span>
                        <div className={styles.summaryMeta}>
                            <Stars rating={rating} />
                            <span className={styles.summaryLabel}>Note moyenne Google</span>
                        </div>
                    </div>
                )}
            </div>
            <ul className={styles.track} aria-label="Avis clients" tabIndex={0}>
                {reviews.map((avis) => (
                    <Avis key={`${avis.author_name}-${avis.time}`} {...avis} />
                ))}
            </ul>
        </section>
    );
}

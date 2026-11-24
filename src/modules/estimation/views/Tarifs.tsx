import React from "react";
import Link from "next/link";
import styles from "./Tarifs.module.scss";
import Schema from "@/modules/seo/Schema";

type PricingItem = {
    title: string;
    slug: string;
    price: string;
    features: string[];
    notes?: string;
    description: string;
    highlight?: boolean;
};

const defaultTarifs: PricingItem[] = [
    {
        title: "Création de site web",
        slug: "vitrine",
        price: "600 € HT",
        features: [
            "Site vitrine sur mesure (WordPress ou Next.js)",
            "Design responsive & optimisé SEO",
            "Rédaction/conseil sur le contenu",
            "Livraison clé en main sous 2 à 4 semaines",
        ],
        notes: "Options : blog, multilingue, réservation, etc.",
        description: "Création de sites vitrines sur mesure avec WordPress ou Next.js, responsive et optimisés pour le SEO.",
        highlight: true,
    },
    {
        title: "Refonte & Optimisation",
        slug: "optimisation",
        price: "600 € HT",
        features: [
            "Audit UX / SEO / performance",
            "Amélioration design, vitesse & structure",
            "Migration vers une stack plus moderne (ex. WordPress > Next.js)",
            "Sécurisation & mises à jour techniques",
        ],
        description: "Audit et amélioration de sites existants : UX, SEO, performances, migration vers des technologies modernes.",
    },
    {
        title: "Maintenance & gestion",
        slug: "maintenance",
        price: "50 € HT / mois",
        features: [
            "Mises à jour régulières (CMS, plugins, sécurité)",
            "Sauvegardes automatisées",
            "Assistance prioritaire & suivi des performances",
            "1h de modifications incluses chaque mois",
        ],
        description: "Mises à jour, sauvegardes, assistance et évolutions régulières pour assurer la stabilité de votre site.",
    },
];

interface TarifsProps {
    className?: string;
    style?: React.CSSProperties;
    tarifs?: PricingItem[];
}

function splitPrice(price: string) {
    const index = price.indexOf(" HT");
    if (index === -1) return { amount: price, unit: "" };
    return { amount: price.slice(0, index), unit: price.slice(index + 1) };
}

function CheckIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M3 8.5l3.2 3L13 4.5" />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
    );
}

function Tarifs({ tarifs = defaultTarifs, className, style }: TarifsProps) {
    return (
        <section className={[styles.section, className].filter(Boolean).join(" ")} style={style} aria-labelledby="tarifs-title">
            <div className={styles.head}>
                <span className={styles.eyebrow}>Tarifs</span>
                <h2 id="tarifs-title" className={styles.sectionTitle}>
                    Des offres simples, adaptées à chaque étape de votre projet.
                </h2>
                <p className={styles.lead}>
                    Que vous lanciez un projet, optimisiez un site existant ou souhaitiez un accompagnement régulier, le périmètre et le prix sont posés dès le départ.
                </p>
            </div>

            <ul className={styles.grid}>
                {tarifs.map((tarif, index) => {
                    const { amount, unit } = splitPrice(tarif.price);
                    return (
                        <li key={tarif.slug} className={styles.item}>
                            <article className={`${styles.card} ${tarif.highlight ? styles.highlight : ""}`}>
                                <Schema as="service" title={tarif.title} description={tarif.description} path={`estimation/${tarif.slug}`} offerSlug={tarif.slug} />
                                <div className={styles.cardTop}>
                                    <span className={styles.code}>{String(index + 1).padStart(2, "0")} / {tarif.slug}</span>
                                    {tarif.highlight && <span className={styles.badge}>Le plus demandé</span>}
                                </div>
                                <h3 className={styles.title}>{tarif.title}</h3>
                                <p className={styles.description}>{tarif.description}</p>

                                <p className={styles.price}>
                                    <span className={styles.from}>À partir de</span>
                                    <span className={styles.amount}>{amount}</span>
                                    {unit && <span className={styles.unit}>{unit}</span>}
                                </p>

                                <ul className={styles.features}>
                                    {tarif.features.map((feature) => (
                                        <li key={feature}>
                                            <span className={styles.check}>
                                                <CheckIcon />
                                            </span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {tarif.notes && <p className={styles.notes}>{tarif.notes}</p>}

                                <Link href={`/estimation/${tarif.slug}`} className={tarif.highlight ? styles.ctaPrimary : styles.cta}>
                                    Estimation en ligne
                                    <ArrowIcon />
                                </Link>
                            </article>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

Tarifs.displayName = "Tarifs";

export { Tarifs };

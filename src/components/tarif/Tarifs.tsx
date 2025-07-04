import React, { forwardRef } from "react";
import classNames from "classnames";
import styles from "./Tarifs.module.scss";
import { Row, Column, Heading, Text, Background, Line, Button } from "@/once-ui/components";
import { rdv } from "@/app/resources/config";
import type { opacity } from "@/once-ui/types";
import Script from "next/script";
import { getAvis } from "@/app/utils/serverActions";
import { getRandomSixDigitNumber } from "@/utils/utils";


type PricingItem = {
    title: string;
    slug: string;
    price: string;
    features: string[];
    notes?: string;
    jsonLD: string;
};

function getPriceValidUntilDate() {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // mois : 0-11
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

const { rating, reviews } = await getAvis();

const defaultTarifs: PricingItem[] = [
    {
        "title": "Création de site web",
        "slug": "vitrine",
        "price": "600 € HT",
        "features": [
            "Site vitrine sur mesure (WordPress ou Next.js)",
            "Design responsive & optimisé SEO",
            "Rédaction/conseil sur le contenu",
            "Livraison clé en main sous 2 à 4 semaines"
        ],
        "notes": "Options : blog, multilingue, réservation, etc.",
        jsonLD: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "image": "/images/blog/cv-cover.png",
            "name": "Création de site web",
            "description": "Création de sites vitrines sur mesure avec WordPress ou Next.js, responsive et optimisés pour le SEO.",
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": rating,
                "reviewCount": reviews.length
            },
            "brand": {
                "@type": "Organization",
                "name": "Occitaweb"
            },
            "offers": {
                "@type": "Offer",
                "priceValidUntil": getPriceValidUntilDate(),
                "priceCurrency": "EUR",
                "price": "1200",
                "priceSpecification": {
                    "@type": "PriceSpecification",
                    "priceCurrency": "EUR",
                    "price": 1200,
                    "minPrice": 1200,
                    "maxPrice": 12000,
                    "valueAddedTaxIncluded": false
                },
                "availability": "https://schema.org/InStock",
                "url": "https://occitaweb.fr"
            },
            "category": "WebDevelopmentService"
        }
        )
    },
    {
        "title": "Refonte & Optimisation",
        "slug": "optimisation",
        "price": "600 € HT",
        "features": [
            "Audit UX / SEO / performance",
            "Amélioration design, vitesse & structure",
            "Migration vers une stack plus moderne (ex. WordPress > Next.js)",
            "Sécurisation & mises à jour techniques"
        ],
        jsonLD: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "image": "/images/blog/pagespeed-h2team.png",
            "name": "Refonte & Optimisation",
            "description": "Audit et amélioration de sites existants : UX, SEO, performances, migration vers des technologies modernes.",
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": rating,
                "reviewCount": reviews.length
            },
            "brand": {
                "@type": "Organization",
                "name": "Occitaweb"
            },
            "offers": {
                "@type": "Offer",
                "priceValidUntil": getPriceValidUntilDate(),
                "priceCurrency": "EUR",
                "price": "600",
                "priceSpecification": {
                    "@type": "PriceSpecification",
                    "priceCurrency": "EUR",
                    "price": 600,
                    "minPrice": 600,
                    "maxPrice": 6000,
                    "valueAddedTaxIncluded": false
                },
                "availability": "https://schema.org/InStock",
                "url": "https://occitaweb.fr"
            },
            "category": "WebDevelopmentService"
        }
        )
    },
    {
        "title": "Maintenance & gestion",
        "slug": "maintenance",
        "price": "50 € HT / mois",
        "features": [
            "Mises à jour régulières (CMS, plugins, sécurité)",
            "Sauvegardes automatisées",
            "Assistance prioritaire & suivi des performances",
            "1h de modifications incluses chaque mois"
        ],
        jsonLD: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "image": "/images/blog/headless.png",
            "name": "Maintenance & accompagnement",
            "description": "Mises à jour, sauvegardes, assistance et évolutions régulières pour assurer la stabilité de votre site.",
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": rating,
                "reviewCount": reviews.length
            },
            "brand": {
                "@type": "Organization",
                "name": "Occitaweb"
            },
            "offers": {
                "@type": "Offer",
                "priceValidUntil": getPriceValidUntilDate(),
                "priceCurrency": "EUR",
                "price": "90",
                "priceSpecification": {
                    "@type": "PriceSpecification",
                    "priceCurrency": "EUR",
                    "price": 90,
                    "minPrice": 90,
                    "maxPrice": 1000,
                    "valueAddedTaxIncluded": false
                },
                "availability": "https://schema.org/InStock",
                "url": "https://occitaweb.fr"
            },
            "category": "WebMaintenanceService"
        }
        )
    }
]

interface TarifsProps extends React.ComponentProps<typeof Column> {
    className?: string;
    style?: React.CSSProperties;
    tarifs?: PricingItem[]
}

const Tarifs = forwardRef<HTMLDivElement, TarifsProps>(
    ({ tarifs = defaultTarifs, className, style, ...rest }, ref) => {
        return (
            <Column
                ref={ref}
                style={style}
                className={classNames(styles.component, className)}
                center
                gap="l"
                overflow="hidden"
                background="page"
                radius="l-8"
                padding="xl"
                {...rest}
            >
                <Background
                    fill
                    position="absolute"
                    mask={{
                        cursor: true,
                        x: 50,
                        y: 25,
                        radius: 70
                    }}
                    dots={{
                        display: true,
                        opacity: 0.6 as opacity,
                        size: "8",
                        color: "accent-background-medium"
                    }}
                    gradient={{
                        display: true,
                        opacity: 1 as opacity,
                        x: 50,
                        y: 0,
                        colorStart: "accent-alpha-strong",
                        colorEnd: "accent-alpha-weak"
                    }}
                />

                <Column maxWidth={"xs"} center>
                    <Heading as="h2" variant="display-strong-m">Tarifs 💰</Heading>
                    <Text variant="body-default-l" align="center" onBackground="neutral-weak">Des offres simples et adaptées à vos besoins : que vous lanciez un projet, optimisiez un site existant ou souhaitiez un accompagnement régulier.</Text>
                </Column>
                <Row center gap="s" mobileDirection="column">
                    {tarifs.map((tarif, i) => <Volet key={i} volet={tarif} />)}
                </Row>
            </Column>
        );
    }
);

Tarifs.displayName = "Tarifs";
interface VoletProps extends React.ComponentProps<typeof Column> {
    className?: string;
    style?: React.CSSProperties;
    volet: PricingItem
}

const Volet = forwardRef<HTMLDivElement, VoletProps>(
    ({ volet, className, style, ...rest }, ref) => {
        const { title, slug, price, features, notes, jsonLD } = volet;
        return (
            <Column radius="l-4"
                ref={ref}
                className={classNames(styles.volet, className)}
                direction="column"
                fillWidth
                overflow="hidden"
                background="accent-alpha-medium"

                {...rest}
            >
                <Background
                    fill
                    position="absolute"
                    zIndex={-1}
                    mask={{
                        x: rdv.effects.mask.x,
                        y: rdv.effects.mask.y,
                        radius: rdv.effects.mask.radius,
                        cursor: rdv.effects.mask.cursor
                    }}
                    gradient={{
                        display: true,
                        opacity: rdv.effects.gradient.opacity as opacity,
                        x: rdv.effects.gradient.x,
                        y: rdv.effects.gradient.y,
                        width: rdv.effects.gradient.width,
                        height: rdv.effects.gradient.height,
                        tilt: rdv.effects.gradient.tilt,
                        colorStart: rdv.effects.gradient.colorStart,
                        colorEnd: rdv.effects.gradient.colorEnd,
                    }}
                    grid={{
                        display: rdv.effects.grid.display,
                        opacity: rdv.effects.grid.opacity as opacity,
                        color: "neutral-alpha-medium",
                        width: rdv.effects.grid.width,
                        height: rdv.effects.grid.height,
                    }}
                />

                <Heading as="h3" variant="display-strong-xs" padding="m" className={styles.titre} onBackground="accent-weak">{title}</Heading>
                <Line background="page" />
                <Row fillWidth padding="m">
                    <ul className={styles.list}>
                        {features.map(feature => <li key={feature}>
                            <Text variant="body-default-s" onBackground="info-medium" padding="0">{feature}</Text>
                        </li>)}
                    </ul>
                </Row>
                <Line background="page" />
                <Column padding="m" fillWidth gap="0" horizontal="end" background="overlay">
                    <Text onBackground="accent-weak">À partir de :</Text>
                    <Text variant="display-strong-xs" onBackground="success-strong">{price}</Text>
                    <Text variant="body-default-xs" onBackground="neutral-strong" align="center">{notes}</Text>
                </Column>
                <Column padding="m" center>
                    <Button variant="primary" href={`/estimation/${slug}`}>Estimation en ligne</Button>
                </Column>
                <Script id={`Tarifs-${typeof title === "string" ? title : `${getRandomSixDigitNumber()}`}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLD }} />
            </Column>
        );
    }
);

Volet.displayName = "Volet";


export { Tarifs };

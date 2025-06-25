import React, { forwardRef } from "react";
import classNames from "classnames";
import styles from "./Tarifs.module.scss";
import { Row, Column, Heading, Text, Card, Background } from "@/once-ui/components";
import { rdv } from "@/app/resources/config";
import { opacity, SpacingToken } from "@/once-ui/types";


type PricingItem = {
    title: string;
    price: string;
    features: string[];
    notes?: string;
    jsonLD: string;
};

const defaultTarifs: PricingItem[] = [
    {
        "title": "Création de site web",
        "price": "1 200 € HT",
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
            "name": "Création de site web",
            "description": "Création de sites vitrines sur mesure avec WordPress ou Next.js, responsive et optimisés pour le SEO.",
            "brand": {
                "@type": "Organization",
                "name": "Occitaweb"
            },
            "offers": {
                "@type": "Offer",
                "priceCurrency": "EUR",
                "price": "1200",
                "priceSpecification": {
                    "@type": "PriceSpecification",
                    "priceCurrency": "EUR",
                    "price": 1200,
                    "minPrice": 1200,
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
            "name": "Refonte & Optimisation",
            "description": "Audit et amélioration de sites existants : UX, SEO, performances, migration vers des technologies modernes.",
            "brand": {
                "@type": "Organization",
                "name": "Occitaweb"
            },
            "offers": {
                "@type": "Offer",
                "priceCurrency": "EUR",
                "price": "600",
                "priceSpecification": {
                    "@type": "PriceSpecification",
                    "priceCurrency": "EUR",
                    "price": 600,
                    "minPrice": 600,
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
        "title": "Maintenance & accompagnement",
        "price": "90 € HT / mois",
        "features": [
            "Mises à jour régulières (CMS, plugins, sécurité)",
            "Sauvegardes automatisées",
            "Assistance prioritaire & suivi des performances",
            "1h de modifications incluses chaque mois"
        ],
        jsonLD: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Maintenance & accompagnement",
            "description": "Mises à jour, sauvegardes, assistance et évolutions régulières pour assurer la stabilité de votre site.",
            "brand": {
                "@type": "Organization",
                "name": "Occitaweb"
            },
            "offers": {
                "@type": "Offer",
                "priceCurrency": "EUR",
                "price": "90",
                "priceSpecification": {
                    "@type": "PriceSpecification",
                    "priceCurrency": "EUR",
                    "price": 90,
                    "minPrice": 90,
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
}

const Tarifs = forwardRef<HTMLDivElement, TarifsProps>(
    ({ className, style, ...rest }, ref) => {
        return (
            <Column
                ref={ref}
                style={style}
                className={classNames(styles.component, className)}
                center
                gap="l"
                {...rest}
            >
                <Column maxWidth={"xs"} center>
                    <Heading as="h2" variant="display-strong-m">Tarifs 💰</Heading>
                    <Text variant="body-default-l" align="center" onBackground="neutral-weak">Des offres simples et adaptées à vos besoins : que vous lanciez un projet, optimisiez un site existant ou souhaitiez un accompagnement régulier.</Text>
                </Column>
                <Row center gap="s" mobileDirection="column">
                    {defaultTarifs.map((tarif, i) => <Volet key={i} volet={tarif} />)}
                </Row>
            </Column>
        );
    }
);

Tarifs.displayName = "Tarifs";
interface VoletProps extends React.ComponentProps<typeof Card> {
    className?: string;
    style?: React.CSSProperties;
    volet: PricingItem
}

const Volet = forwardRef<HTMLDivElement, VoletProps>(
    ({ volet, className, style, ...rest }, ref) => {
        const { title, price, features, notes, jsonLD } = volet;
        return (
            <Column radius="s-4"
                ref={ref}
                style={style}
                className={classNames(styles.component, className)}
                direction="column"
                fillWidth
                paddingY="m"
                gap="m"
                background="overlay"
                border="brand-alpha-strong"
                {...rest}
            >
                <Background
                    fill
                    position="absolute"
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
                        color: rdv.effects.grid.color,
                        width: rdv.effects.grid.width,
                        height: rdv.effects.grid.height,
                    }}
                />

                <Heading as="h3" variant="body-strong-xl" paddingX="m" className={styles.titre}>{title}</Heading>
                <Row fillWidth paddingX="m">
                    <ul className={styles.list}>
                        {features.map(feature => <li key={feature}>
                            <Text variant="body-default-s" onBackground="info-medium" padding="0">{feature}</Text>
                        </li>)}
                    </ul>
                </Row>
                <Column paddingX="m" fillWidth gap="2" horizontal="end">
                    <Text onBackground="brand-weak">À partir de :</Text>
                    <Text variant="display-strong-xs" onBackground="info-medium">{price}</Text>
                    <Text onBackground="neutral-weak">{notes}</Text>
                </Column>
                <script dangerouslySetInnerHTML={{ __html: jsonLD }} />
            </Column>
        );
    }
);

Volet.displayName = "Volet";


export { Tarifs };

import React, { forwardRef } from "react";
import classNames from "classnames";
import styles from "./Tarifs.module.scss";
import { Row, Column, Heading, Text, Background, Line, Button, type Opacity } from "@once-ui-system/core";
import { rdv } from "@/app/resources/config";
import Schema from "@/modules/seo/Schema";


type PricingItem = {
    title: string;
    slug: string;
    price: string;
    features: string[];
    notes?: string;
    description: string;
};


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
        "description": "Création de sites vitrines sur mesure avec WordPress ou Next.js, responsive et optimisés pour le SEO.",
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
        "description": "Audit et amélioration de sites existants : UX, SEO, performances, migration vers des technologies modernes.",
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
        "description": "Mises à jour, sauvegardes, assistance et évolutions régulières pour assurer la stabilité de votre site.",
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
                as="section"
                ref={ref}
                style={style}
                className={classNames(styles.component, className)}
                center
                gap="l"
                overflow="hidden"
                background="page"
                radius="l-8"
                padding="xl"
                aria-labelledby="tarifs-title"
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
                        opacity: 0.6 as Opacity,
                        size: "8",
                        color: "accent-background-medium"
                    }}
                    gradient={{
                        display: true,
                        opacity: 1 as Opacity,
                        x: 50,
                        y: 0,
                        colorStart: "accent-alpha-strong",
                        colorEnd: "accent-alpha-weak"
                    }}
                />

                <Column maxWidth={"xs"} center>
                    <Heading as="h2" id="tarifs-title" variant="display-strong-m">Tarifs 💰</Heading>
                    <Text variant="body-default-l" align="center" onBackground="neutral-weak">Des offres simples et adaptées à vos besoins : que vous lanciez un projet, optimisiez un site existant ou souhaitiez un accompagnement régulier.</Text>
                </Column>
                <Row center gap="s" s={{direction: "column"}}>
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
    ({ volet, className, ...rest }, ref) => {
        const { title, description, slug, price, features, notes } = volet;
        return (
            <Column as="article" radius="m"
                ref={ref}
                className={classNames(styles.volet, className)}
                direction="column"
                fillWidth
                overflow="hidden"
                background="accent-alpha-medium"
                {...rest}
            >
                <Schema as={"service"} title={title} description={description} path={`estimation/${slug}`} offerSlug={slug} />
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
                        opacity: rdv.effects.gradient.opacity as Opacity,
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
                        opacity: rdv.effects.grid.opacity as Opacity,
                        color: "neutral-alpha-medium",
                        width: rdv.effects.grid.width,
                        height: rdv.effects.grid.height,
                    }}
                />

                <Heading as="h3" variant="display-strong-xs" padding="m" paddingTop="l" className={styles.titre} onBackground="accent-weak">{title}</Heading>
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
            </Column>
        );
    }
);

Volet.displayName = "Volet";


export { Tarifs };

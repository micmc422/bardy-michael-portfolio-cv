import { Background, Column, Heading, Icon, Row, Text } from "@/once-ui/components";
import { Suspense, type ReactNode } from "react";
import { rdv } from "../resources";
import type { ColorScheme, ColorWeight, opacity } from "@/once-ui/types";
import { Faq } from "@/components";

const servicesInclus: { name: string, icon: string, desc: string, bgColor?: ColorScheme }[] = [
    {
        name: "Design sur mesure",
        icon: "palette",
        desc: "Interface unique adaptée à votre identité visuelle.",
        bgColor: "accent"
    },
    {
        name: "Design responsive",
        icon: "mobile",
        desc: "Parfaitement adapté à tous les écrans et appareils.",
        bgColor: "neutral"
    },
    {
        name: "Sécurité & Performance",
        icon: "shield",
        desc: "Site sécurisé et optimisé pour un chargement rapide",
        bgColor: "success"
    },
]

const faqData = {
    "title": "Foire aux questions (FAQ)",
    "faq": [
        {
            "title": "Quels types de projets web Occitaweb peut-il estimer ?",
            "content": "Occitaweb peut estimer divers projets, y compris les sites vitrines, les portfolios, les sites e-commerce et les plateformes/CRM personnalisés. Ils proposent également des services de refonte, d'optimisation, de maintenance et de gestion."
        },
        {
            "title": "Quel est le prix de départ pour un site vitrine ?",
            "content": "Un site vitrine commence à partir de 600€."
        },
        {
            "title": "Quelles fonctionnalités sont incluses dans un devis pour un site e-commerce ?",
            "content": "Un devis pour un site e-commerce inclut des fonctionnalités telles que le catalogue de produits, les options de paiement sécurisé, la gestion des commandes et un système de gestion de contenu (CMS). Le prix de départ est de 2500€."
        },
        {
            "title": "Que comprend le service de refonte et d'optimisation ?",
            "content": "Ce service, à partir de 600€, comprend des audits UX/SEO/performance, des améliorations de conception et une migration vers des stacks modernes pour des refontes complètes et l'optimisation SEO."
        },
        {
            "title": "Que couvre le plan de maintenance et de gestion ?",
            "content": "À partir de 50€, ce plan couvre les mises à jour régulières, la sécurité, le support technique et la surveillance des performances, avec 1 heure de modifications incluse chaque mois."
        },
        {
            "title": "Comment puis-je obtenir un devis personnalisé pour mon projet ?",
            "content": "Vous pouvez obtenir un devis en sélectionnant un type de site sur la page et il est recommandé de prendre rendez-vous pour des consultations."
        },
        {
            "title": "Occitaweb partage-t-il mes informations personnelles collectées via les cookies ?",
            "content": "Non, Occitaweb assure qu'aucune information collectée via les cookies (comme les pages visitées, l'origine, le navigateur, le système d'exploitation, le pays) n'est partagée avec des tiers."
        }
    ]
};

export default async function EstimationLayout({ children, resume, headline }: { children: ReactNode, resume: ReactNode, headline: ReactNode }) {
    return <Column center maxWidth={"l"}>
        <Suspense>{headline}</Suspense>
        <Row fillWidth gap="l" paddingY="xl" mobileDirection="column">
            <Column flex={8} background="surface" padding="m" radius="xl">
                {children}
            </Column>
            <Column flex={3} background="surface" padding="m" radius="m" gap="m">
                <Suspense>{resume}</Suspense>
            </Column>
        </Row>
        <Column background="surface" gap="m" padding="m" radius="xl">
            <Heading variant="display-strong-m">Services inclus</Heading>
            <Row mobileDirection="column" gap="s">
                <ServicesInclus />
            </Row>
        </Column>
        <Column paddingTop="xl" maxWidth={"s"}>
            <Faq faqData={JSON.stringify(faqData)} />
        </Column>
    </Column>
}

function ServicesInclus() {
    return servicesInclus.map(({ name, icon, desc, bgColor }, i) => <Column key={i} horizontal="start" padding="l" border="neutral-alpha-weak" radius="m" gap="s" overflow="hidden">
        <Background
            fill
            position="absolute"
            zIndex={0}
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
                color: `${bgColor}-alpha-medium`,
                width: rdv.effects.grid.width,
                height: rdv.effects.grid.height,
            }}
        />
        <Row>
            <Heading as="h2" variant="display-strong-xs">{name}</Heading>
            <Icon name={icon} size="xl" onBackground={`${bgColor}-weak` as `${ColorScheme}-${ColorWeight}`} />
        </Row>
        <Text onBackground="neutral-weak">{desc}</Text>
    </Column>)
}
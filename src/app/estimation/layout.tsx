import { Background, Column, Heading, Icon, Row, Text } from "@/once-ui/components";
import { Suspense, type ReactNode } from "react";
import { rdv } from "../resources";
import type { ColorScheme, ColorWeight, opacity } from "@/once-ui/types";

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
    </Column>
}

function ServicesInclus() {
    return servicesInclus.map(({ name, icon, desc, bgColor }, i) => <Column key={i} horizontal="start" padding="l" border="neutral-alpha-weak" radius="m" gap="s">
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
            <Heading as="h3" variant="display-strong-xs">{name}</Heading>
            <Icon name={icon} size="xl" onBackground={`${bgColor}-weak` as `${ColorScheme}-${ColorWeight}`} />
        </Row>
        <Text onBackground="neutral-weak">{desc}</Text>
    </Column>)
}
import { Column, Heading, Icon, Row, Text, RevealFx, Line, Grid, Background, type opacity } from "@once-ui-system/core";
import { baseURL } from "@/app/resources";
import { person, atomicBd81 } from "@/app/resources/content";
import Meta from "@/modules/seo/Meta";
import Schema from "@/modules/seo/Schema";
import PasswordProtect from "@/components/PasswordProtect";
import { validateAtomicBd81Password } from "./actions";

export async function generateMetadata() {
    return Meta.generate({
        title: atomicBd81.title,
        description: atomicBd81.description,
        baseURL: baseURL,
        image: `${baseURL}/og?title=${encodeURIComponent(atomicBd81.title)}`,
        path: atomicBd81.path,
    });
}

function CostTable({ tableau }: { tableau: { headers: string[]; rows: string[][] } }) {
    return (
        <Column fillWidth radius="m" overflow="hidden" border="neutral-alpha-weak" background="surface">
            {/* Header */}
            <Row fillWidth background="neutral-alpha-weak" padding="s" gap="s">
                {tableau.headers.map((header, idx) => (
                    <Column key={idx} flex={idx === 0 ? 2 : 1}>
                        <Text variant="label-default-s" onBackground="neutral-strong">
                            {header}
                        </Text>
                    </Column>
                ))}
            </Row>
            {/* Rows */}
            {tableau.rows.map((row, rowIdx) => (
                <Row
                    key={rowIdx}
                    fillWidth
                    padding="s"
                    gap="s"
                    background={rowIdx % 2 === 0 ? "page" : "surface"}
                    style={{ borderTop: "1px solid var(--neutral-alpha-weak)" }}
                >
                    {row.map((cell, cellIdx) => (
                        <Column key={cellIdx} flex={cellIdx === 0 ? 2 : 1}>
                            <Text
                                variant="body-default-s"
                                onBackground={cellIdx === 0 ? "neutral-strong" : "neutral-weak"}
                            >
                                {cell}
                            </Text>
                        </Column>
                    ))}
                </Row>
            ))}
        </Column>
    );
}

export default function AtomicBd81Page() {
    const chargeSection = atomicBd81.sections[0];
    const coutsSection = atomicBd81.sections[1];
    const pertinenceSection = atomicBd81.sections[2];
    const alternativesSection = atomicBd81.sections[3];

    return (
        <PasswordProtect validateAction={validateAtomicBd81Password} storageKey="atomicbd81-auth">
            <Schema
                as="webPage"
                baseURL={baseURL}
                path={atomicBd81.path}
                title={atomicBd81.title}
                description={atomicBd81.description}
                image={`${baseURL}/og?title=${encodeURIComponent(atomicBd81.title)}`}
                author={{
                    name: person.name,
                    url: `${baseURL}${atomicBd81.path}`,
                    image: `${baseURL}${person.avatar}`,
                }}
            />

            {/* Hero Section */}
            <Column as="section" maxWidth="m" paddingY="xl" gap="m" aria-labelledby="hero-title">
                <RevealFx translateY="4" fillWidth horizontal="start" paddingBottom="16">
                    <Heading as="h1" id="hero-title" wrap="balance" variant="display-strong-l">
                        {atomicBd81.headline}
                    </Heading>
                </RevealFx>
                <RevealFx translateY="8" delay={0.2} fillWidth horizontal="start">
                    <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-l">
                        {atomicBd81.subline}
                    </Text>
                </RevealFx>
            </Column>

            {/* Section 1: Charge de travail */}
            {chargeSection && (
                <Column as="section" maxWidth="m" paddingY="l" gap="l" aria-labelledby={chargeSection.id}>
                    <Row gap="s" vertical="center">
                        <Icon name={chargeSection.icone} size="l" onBackground="brand-strong" />
                        <Heading as="h2" id={chargeSection.id} variant="display-strong-m">
                            {chargeSection.titre}
                        </Heading>
                    </Row>
                    <Text variant="body-default-l" onBackground="neutral-weak">
                        {chargeSection.description}
                    </Text>

                    <Grid columns={2} s={{ columns: "1" }} gap="m">
                        {chargeSection.points?.map((point, idx) => (
                            <Column
                                key={idx}
                                background="surface"
                                padding="l"
                                radius="m"
                                border="neutral-alpha-weak"
                                gap="s"
                            >
                                <Heading as="h3" variant="heading-strong-m">
                                    {point.titre}
                                </Heading>
                                <Text variant="body-default-m" onBackground="neutral-weak">
                                    {point.description}
                                </Text>
                            </Column>
                        ))}
                    </Grid>
                </Column>
            )}

            <Line maxWidth="m" background="neutral-alpha-weak" />

            {/* Section 2: Coûts */}
            {coutsSection && (
                <Column as="section" maxWidth="m" paddingY="l" gap="l" aria-labelledby={coutsSection.id}>
                    <Row gap="s" vertical="center">
                        <Icon name={coutsSection.icone} size="l" onBackground="brand-strong" />
                        <Heading as="h2" id={coutsSection.id} variant="display-strong-m">
                            {coutsSection.titre}
                        </Heading>
                    </Row>
                    <Text variant="body-default-l" onBackground="neutral-weak">
                        {coutsSection.description}
                    </Text>

                    {coutsSection.tableau && <CostTable tableau={coutsSection.tableau} />}
                </Column>
            )}

            <Line maxWidth="m" background="neutral-alpha-weak" />

            {/* Section 3: Pertinence et Viabilité */}
            {pertinenceSection && (
                <Column as="section" maxWidth="m" paddingY="l" gap="l" aria-labelledby={pertinenceSection.id}>
                    <Row gap="s" vertical="center">
                        <Icon name={pertinenceSection.icone} size="l" onBackground="brand-strong" />
                        <Heading as="h2" id={pertinenceSection.id} variant="display-strong-m">
                            {pertinenceSection.titre}
                        </Heading>
                    </Row>
                    <Text variant="body-default-l" onBackground="neutral-weak">
                        {pertinenceSection.description}
                    </Text>

                    {/* Avantages */}
                    <Column gap="m">
                        <Heading as="h3" variant="heading-strong-l">
                            <Row gap="xs" vertical="center">
                                <Icon name="checkCircle" onBackground="success-strong" />
                                Les points forts (Avantages)
                            </Row>
                        </Heading>
                        <Grid columns={3} s={{ columns: "1" }} gap="m">
                            {pertinenceSection.avantages?.map((item, idx) => (
                                <Column
                                    key={idx}
                                    background="success-alpha-weak"
                                    padding="l"
                                    radius="m"
                                    border="success-alpha-medium"
                                    gap="s"
                                >
                                    <Heading as="h4" variant="heading-strong-s">
                                        {item.titre}
                                    </Heading>
                                    <Text variant="body-default-m" onBackground="neutral-weak">
                                        {item.description}
                                    </Text>
                                </Column>
                            ))}
                        </Grid>
                    </Column>

                    {/* Contraintes */}
                    <Column gap="m">
                        <Heading as="h3" variant="heading-strong-l">
                            <Row gap="xs" vertical="center">
                                <Icon name="warningTriangle" onBackground="warning-strong" />
                                Les points de vigilance (Contraintes)
                            </Row>
                        </Heading>
                        <Grid columns={2} s={{ columns: "1" }} gap="m">
                            {pertinenceSection.contraintes?.map((item, idx) => (
                                <Column
                                    key={idx}
                                    background="warning-alpha-weak"
                                    padding="l"
                                    radius="m"
                                    border="warning-alpha-medium"
                                    gap="s"
                                >
                                    <Heading as="h4" variant="heading-strong-s">
                                        {item.titre}
                                    </Heading>
                                    <Text variant="body-default-m" onBackground="neutral-weak">
                                        {item.description}
                                    </Text>
                                </Column>
                            ))}
                        </Grid>
                    </Column>
                </Column>
            )}

            <Line maxWidth="m" background="neutral-alpha-weak" />

            {/* Section 4: Solutions alternatives */}
            {alternativesSection && (
                <Column as="section" maxWidth="m" paddingY="l" gap="l" aria-labelledby={alternativesSection.id}>
                    <Row gap="s" vertical="center">
                        <Icon name={alternativesSection.icone} size="l" onBackground="brand-strong" />
                        <Heading as="h2" id={alternativesSection.id} variant="display-strong-m">
                            {alternativesSection.titre}
                        </Heading>
                    </Row>
                    <Text variant="body-default-l" onBackground="neutral-weak">
                        {alternativesSection.description}
                    </Text>

                    <Grid columns={2} s={{ columns: "1" }} gap="m">
                        <Background
                            zIndex={-1}
                            fill
                            position="absolute"
                            mask={{
                                cursor: true,
                                x: 50,
                                y: 25,
                                radius: 70,
                            }}
                            gradient={{
                                display: true,
                                opacity: 1 as opacity,
                                x: 50,
                                y: 0,
                                colorStart: "accent-alpha-strong",
                                colorEnd: "brand-alpha-weak",
                            }}
                        />
                        {alternativesSection.alternatives?.map((alt, idx) => (
                            <Column
                                key={idx}
                                background="overlay"
                                padding="l"
                                radius="m"
                                gap="s"
                            >
                                <Heading as="h3" variant="heading-strong-m">
                                    {alt.titre}
                                </Heading>
                                <Text variant="body-default-m" onBackground="neutral-weak">
                                    {alt.description}
                                </Text>
                            </Column>
                        ))}
                    </Grid>
                </Column>
            )}
        </PasswordProtect>
    );
}

import { about, baseURL, person } from "@/app/resources";
import { solutionsHébergement } from "@/app/resources/content";
import Schema from "@/modules/seo/Schema";
import { Badge, Column, Heading, Icon, IconButton, Meta, RevealFx, Row, Text, type DataPoint } from "@once-ui-system/core";
import { BarChart } from "@once-ui-system/core";
import { FlexibilitySection } from "./FlexibilitySection";
import { ChartCardContainer } from "@/components/chart";
import { couleurs } from "@/components/chart/theme";

export async function generateMetadata() {
    return Meta.generate({
        title: solutionsHébergement.title,
        description: solutionsHébergement.description,
        baseURL: baseURL,
        image: `${baseURL}/og?title=${encodeURIComponent(solutionsHébergement.title)}`,
        path: solutionsHébergement.path,
    });
}

export default async function HebergementPage() {
    return <>
        <Schema
            as="webPage"
            baseURL={baseURL}
            path={`${solutionsHébergement.path}`}
            title={solutionsHébergement.title}
            description={solutionsHébergement.description}
            image={`${baseURL}/og?title=${encodeURIComponent(solutionsHébergement.title)}`}
            author={{
                name: person.name,
                url: `${baseURL}`,
                image: `${baseURL}${person.avatar}`,
            }}
        />
        <Column maxWidth="xl" paddingY="24" gap="m">
            <Column maxWidth="s">
                <RevealFx translateY="4" fillWidth horizontal="start" paddingBottom="16">
                    <Heading as="h1" wrap="balance" variant="display-strong-l">
                        {solutionsHébergement.title}
                    </Heading>
                </RevealFx>
                <RevealFx translateY="8" delay={0.2} fillWidth horizontal="start" paddingBottom="32">
                    <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl">
                        {solutionsHébergement.headline}
                    </Text>
                </RevealFx>
                <RevealFx fillWidth horizontal="start" paddingTop="16" paddingBottom="32" paddingLeft="8">
                    <Badge
                        background="brand-alpha-weak" paddingX="8" paddingY="4" onBackground="brand-strong"
                        arrow={false}
                        href={about.calendar.link}
                        center
                        gap="s"
                        id="RDVBtn"
                        aria-label="Lien vers la prise de rendez-vous"
                    >
                        <Icon paddingLeft="12" name="calendar" onBackground="brand-strong" />
                        <Text paddingTop="4">Planifier un RDV</Text>
                        <IconButton
                            data-border="rounded"
                            variant="ghost"
                            icon="chevronRight"
                        />
                    </Badge>
                </RevealFx>
            </Column>
            <Row center>
                <Column maxWidth="s" paddingY="16" center>
                    <Heading wrap="balance" variant="display-strong-m">
                        {solutionsHébergement.introduction.titre}
                    </Heading>
                    <Row gap="m" paddingY="16">
                        {solutionsHébergement.introduction.modeles.map((model, i) => <Column maxWidth="s" paddingY="8" key={i} center>
                            <Text style={{ fontSize: "6vmax" }}>{model.icone}</Text>
                            <Heading wrap="balance" variant="heading-default-m" paddingTop="8">
                                {model.nom}
                            </Heading>
                            <Text wrap="balance" onBackground="neutral-weak" variant="body-default-m" align="center">
                                {model.description}
                            </Text>
                        </Column>)}
                    </Row>
                </Column>
            </Row>
            <Row tabletDirection="column" maxWidth={"xl"} gap="l" align="start" paddingX="m">
                <Column maxWidth="s" gap="m">
                    <BarChartperformanceScalabilite />
                </Column>
                <Column maxWidth="s" gap="m">
                    <CapacitScalabilite />
                </Column>
            </Row>
        </Column>
        <Row maxWidth={"s"} gap="l" align="start" paddingX="m">
            <FlexibilitySection />
        </Row>
    </>
}

function BarChartperformanceScalabilite() {
    const { titre, description, performance_relative } = solutionsHébergement.performance_scalabilite;
    const { titre: label, labels, valeurs, explication } = performance_relative;
    type Keys = typeof labels[number];
    const series = labels.map((key, i) => ({ key, color: couleurs[i] }))
    const data: DataPoint = { label }
    labels.forEach((key, i) => data[key as Keys] = valeurs[i])
    return <ChartCardContainer>
        <BarChart
            title={titre}
            description={description}
            axis="x"
            barWidth="xl"
            background="transparent"
            border="transparent"
            legend={{
                position: "bottom-center",
            }}
            gap="32"
            series={series}
            data={[
                data,
            ]}
        />
        <Column paddingY='12' paddingX="20" gap="4">
            <Text onBackground="neutral-medium" variant="label-default-s">{explication}</Text>
        </Column>
    </ChartCardContainer>
}

function CapacitScalabilite() {
    const { titre, description, types } = solutionsHébergement.performance_scalabilite.capacite_scalabilite;
    return <ChartCardContainer maxWidth={"s"}>
        <Column paddingY='12' paddingX="20" gap="4">
            <Heading wrap="pretty" variant='heading-strong-xs'>{titre}</Heading>
            <Text onBackground="neutral-weak" variant="label-default-s" >{description}</Text>
        </Column>
        <Column paddingY='12' paddingX="20" gap="4">
            {types.map(({ nom, niveau, explication }, i) => {
                return <Column key={i} gap="2">
                    <Heading as="h3" onBackground="brand-weak" variant='heading-strong-xs'>{nom}</Heading>
                    <Row height={"24"} style={{ width: `${niveau}%`, backgroundImage: `linear-gradient(to right, transparent, var(--data-${couleurs[i]}))`, border: `2px solid var(--data-${couleurs[i]})` }} radius="m"></Row>
                    <Text onBackground="neutral-medium" variant="label-default-s" paddingTop="xs">{explication}</Text>
                </Column>
            })}
        </Column>
    </ChartCardContainer>
}



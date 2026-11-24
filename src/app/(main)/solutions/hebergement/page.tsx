import { about, baseURL, person } from "@/core/config";
import { solutionsHébergement } from "@/core/config/content";
import Schema from "@/modules/seo/Schema";
import { Button, Column, Flex, Grid, Heading, Row, Text } from "@once-ui-system/core";
import Meta from "@/modules/seo/Meta";
import { PageHeader, SectionHead } from "@/shared/components/PageHeader";
import panel from "@/shared/components/PageHeader.module.scss";
import { BarChart, type DataPoint } from "@once-ui-system/core/data";
import { ChartCardContainer } from "@/shared/ui/chart";
import { LinesBars } from "@/shared/ui/chart/LinesBars";
import { RadarChart } from "@/shared/ui/chart/Radar";
import { DougNut } from "@/shared/ui/chart/DougNut";

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
        <Column as="section" maxWidth="xl" gap="m" aria-labelledby="hebergement-hero-title">
            <PageHeader
                id="hebergement-hero-title"
                eyebrow="Hébergement"
                title={solutionsHébergement.title}
                lead={solutionsHébergement.headline}
            >
                <Button href={about.calendar.link} prefixIcon="calendar" variant="primary" size="l">Planifier un échange</Button>
                <Button href="/estimation" variant="secondary" size="l">Estimer mon projet</Button>
            </PageHeader>
            <Column paddingY="24" gap="l">
                <SectionHead
                    id="hebergement-modeles-title"
                    eyebrow="Modèles"
                    title={solutionsHébergement.introduction.titre}
                />
                <Grid columns={solutionsHébergement.introduction.modeles.length > 2 ? 3 : 2} s={{ columns: "1" }} m={{ columns: "1" }} gap="16">
                    {solutionsHébergement.introduction.modeles.map((model, i) => (
                        <Column as="article" className={`${panel.panel} ${panel.lift}`} padding="l" key={i} gap="s">
                            <Text style={{ fontSize: "2.5rem", lineHeight: 1 }} aria-hidden="true">{model.icone}</Text>
                            <Heading as="h3" wrap="balance" textVariant="display-strong-xs">
                                {model.nom}
                            </Heading>
                            <Text wrap="balance" onBackground="neutral-weak" textVariant="body-default-m">
                                {model.description}
                            </Text>
                        </Column>
                    ))}
                </Grid>
            </Column>
            <Row s={{ direction: "column" }} maxWidth={"xl"} gap="l" align="start" paddingX="m">
                <Column maxWidth="s" gap="m">
                    <BarChartperformanceScalabilite />
                </Column>
                <Column maxWidth="s" gap="m">
                    <LinesBars {...solutionsHébergement.performance_scalabilite.capacite_scalabilite} />
                </Column>
            </Row>
        </Column>
        <Row maxWidth={"s"} gap="l" align="start" paddingX="m">
            <RadarChart
                {...solutionsHébergement.flexibilite_controle} />
        </Row>
        <Row maxWidth={"s"} gap="l" align="start" paddingX="m">

            <ChartCardContainer gap="l" align="start" paddingX="l" paddingY="m">
                <Heading as="h2" wrap="pretty" textVariant='heading-strong-xs'>{solutionsHébergement.securite_fiabilite.titre}</Heading>
                <Flex gap="l" horizontal="center" wrap>
                    {solutionsHébergement.securite_fiabilite.types.map((el, i) => <DougNut key={i} {...el} />)}
                </Flex>
            </ChartCardContainer>
        </Row>
    </>
}

function BarChartperformanceScalabilite() {
    const { titre, description, performance_relative } = solutionsHébergement.performance_scalabilite;
    const { titre: label, labels, valeurs, explication } = performance_relative;
    type Keys = typeof labels[number];
    const series = labels.map((key) => ({ key }))
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
            <Text onBackground="neutral-medium" textVariant="label-default-s">{explication}</Text>
        </Column>
    </ChartCardContainer>
}


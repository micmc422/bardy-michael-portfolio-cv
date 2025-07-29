import { about, baseURL, person } from "@/app/resources";
import { solutionsHébergement } from "@/app/resources/content";
import { Badge, Column, Heading, Icon, IconButton, Meta, RevealFx, Row, Schema, Text } from "@once-ui-system/core";
import { BarChart } from "@once-ui-system/core";


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
            path={`${baseURL}${solutionsHébergement.path}`}
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
            <Column maxWidth="s" paddingY="16">
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
            <Column maxWidth="s" paddingY="16" gap="m">
                <Heading wrap="balance" variant="display-strong-m">
                    {solutionsHébergement.performance_scalabilite.titre}
                </Heading>
                <BarChart
                    background="surface"
                    title="Daily Time Spent on Activities"
                    axis="x"
                    barWidth="xl"
                    legend={{
                        position: "bottom-center",
                    }}
                    series={[
                        { key: "Reading", color: "aqua" },
                        { key: "Sports", color: "yellow" },
                        { key: "Doomscrolling", color: "orange" }
                    ]}
                    data={[
                        { label: "Minutes per day", "Reading": 16, "Sports": 36, "Doomscrolling": 128 },
                    ]}
                />
            </Column>
        </Column>

    </>
}
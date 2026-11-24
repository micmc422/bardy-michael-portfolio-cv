import { Background, Tag, Button, Column, Grid, Heading, Icon, IconButton, Row, Text, type Opacity, type IconName } from "@once-ui-system/core";
import { RevealFx } from "@once-ui-system/fx";
import { about, baseURL } from "@/core/config";
import { person, solutionsWeb } from "@/core/config/content";
 import Meta from "@/modules/seo/Meta";
import { PageHeader, SectionHead } from "@/shared/components/PageHeader";
import panel from "@/shared/components/PageHeader.module.scss";
import Schema from "@/modules/seo/Schema";

export async function generateMetadata() {
    return Meta.generate({
        title: solutionsWeb.title,
        description: solutionsWeb.description,
        baseURL: baseURL,
        image: `${baseURL}/og?title=${encodeURIComponent(solutionsWeb.title)}`,
        path: solutionsWeb.path,
    });
}
export default function SolutionsPage() {
    return (
        <>
            <Schema
                as="webPage"
                baseURL={baseURL}
                path={solutionsWeb.path}
                title={solutionsWeb.title}
                description={solutionsWeb.description}
                image={`${baseURL}/og?title=${encodeURIComponent(solutionsWeb.title)}`}
                author={{
                    name: person.name,
                    url: `${baseURL}${solutionsWeb.path}`,
                    image: `${baseURL}${person.avatar}`,
                }}
            />

            <Column as="section" maxWidth="xl" gap="m" aria-labelledby="solutions-hero-title">
                <PageHeader id="solutions-hero-title" eyebrow="Solutions sur mesure" title={solutionsWeb.headline} lead={solutionsWeb.subline}>
                    <Button href={about.calendar.link} prefixIcon="calendar" variant="primary" size="l">Planifier un échange</Button>
                    <Button href="/estimation" variant="secondary" size="l">Estimer mon projet</Button>
                </PageHeader>
            </Column>
            <Column as="section" maxWidth="xl" paddingY="24" aria-labelledby="fonctionnalites-section-title">
                <SectionHead
                    id="fonctionnalites-section-title"
                    eyebrow="Fonctionnalités"
                    title="Des fonctionnalités ciblées pour booster votre activité."
                    lead="Chaque activité a ses spécificités. Formulaire de devis, prise de rendez-vous, catalogue, espace client, automatisations : des outils concrets pour gagner du temps et offrir une meilleure expérience à vos utilisateurs."
                />
            </Column>
            <Grid columns={4} s={{ columns: "1" }} m={{ columns: "2" }} maxWidth="xl" gap="16" paddingX="16">
                {solutionsWeb.pourquoi.map((item, index) => (
                    <Column as="article" className={`${panel.panel} ${panel.lift}`} paddingX="m" paddingY="l" key={index} gap="m">
                        <Heading as="h3" wrap="balance" textVariant="display-strong-xs">
                            <Row vertical="center" gap="s" align="start">
                                <Icon name={(item?.icone || "check") as IconName} onBackground="brand-strong" />
                                {item?.titre}
                            </Row>
                        </Heading>
                        <Text wrap="balance" onBackground="neutral-medium" textVariant="body-default-m">
                            {item?.description}
                        </Text>
                        <Column as="ul" className="list-none">
                            {item?.fonctions?.map((fonction, idx) => (
                                <li key={idx}>
                                    <Row vertical="center" gap="xs">
                                        <Icon name="checkCircle" onBackground="success-medium" />
                                        <Text wrap="balance" onBackground="neutral-weak" textVariant="body-default-xs">
                                            {fonction}
                                        </Text>
                                    </Row>
                                </li>
                            ))}
                        </Column>
                    </Column>
                ))}
            </Grid>
            <Column as="section" maxWidth="xl" paddingY="48" paddingX="16" aria-labelledby="hebergement-section-title">
                <Column className={panel.panel} padding="xl" gap="m" horizontal="center">
                    <SectionHead
                        id="hebergement-section-title"
                        align="center"
                        eyebrow="Hébergement"
                        title="Votre site, toujours rapide. Toujours en ligne."
                        lead="Grâce à un hébergement cloud dernière génération (Vercel), vos pages se chargent instantanément, même aux heures de pointe : plus de conversions, une meilleure image, zéro stress côté technique."
                    />
                    <Button href="/solutions/hebergement" variant="primary" size="l" suffixIcon="arrowRight">{`Solutions d'hébergement`}</Button>
                </Column>
            </Column>
        </>
    );
}